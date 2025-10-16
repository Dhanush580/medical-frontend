import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Heart } from "lucide-react";
import { apiUrl } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    plan: "annual",
    familyMembers: 0,
    familyDetails: [] as any[],
  });

  const plans = [
    { id: 'annual', name: 'Annual', price: '₹365/year', discount: '10% when family added' },
  ];

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      const id = 'razorpay-script';
      if (document.getElementById(id)) return resolve(true);
      const script = document.createElement('script');
      script.id = id;
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // show pre-checkout confirmation dialog
    setConfirmOpen(true);
  };

  // calculate prices client-side for display
  const basePrice = 365;
  const membersCount = Number(formData.familyMembers) || (Array.isArray(formData.familyDetails) ? formData.familyDetails.length : 0);
  const totalPersons = 1 + membersCount;
  const rawTotal = basePrice * totalPersons;
  const discountedTotal = membersCount > 0 ? Math.round(rawTotal * 0.9) : rawTotal;

  const priceDisplay = useMemo(() => ({ rawTotal, discountedTotal }), [rawTotal, discountedTotal]);

  // Proceed to payment: creates order then opens Razorpay (previous handleSubmit logic)
  const proceedToPayment = async () => {
    setConfirmOpen(false);
    // 1) Request backend to create a registration order
    const res = await fetch(apiUrl('api/auth/register-with-order'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        plan: formData.plan,
        familyMembers: membersCount,
        familyDetails: formData.familyDetails || [],
      }),
    });

    // Safely parse JSON and handle empty/non-JSON responses
    let payload: any = null;
    try {
      const text = await res.text();
      if (!text) {
        alert('Empty response from server when creating order. Check backend logs.');
        return;
      }
      payload = JSON.parse(text);
    } catch (err) {
      console.error('Failed to parse JSON from /api/auth/register-with-order', err);
      alert('Invalid response from server when creating order. Check backend logs.');
      return;
    }

    if (!res.ok) {
      alert(payload?.message || 'Failed to create order');
      return;
    }

    const { order, tempUser } = payload;

    // 2) Load Razorpay script
    const ok = await loadRazorpayScript();
    if (!ok) {
      alert('Failed to load Razorpay SDK');
      return;
    }

    // 3) Open Razorpay checkout
    const options: any = {
      key: (window as any).RAZORPAY_KEY || '',
      amount: order.amount,
      currency: order.currency,
      name: 'HealthConnect',
      description: `Subscribe: ${tempUser.plan}`,
      order_id: order.id,
      modal: {
        // called when user closes the checkout (cancels)
        ondismiss: function () {
          try {
            setDialogData({ type: 'error', title: 'Payment Cancelled', message: 'Payment was cancelled or could not be completed. Please try again.' });
            setDialogOpen(true);
          } catch (err) {
            // swallow - set state may fail in some contexts, but we do best effort
            console.warn('Failed to show cancel dialog', err);
          }
        }
      },
      handler: async function (response: any) {
        // show interim UI? we'll verify, then show confirmation dialog
        try {
          // 4) Verify payment with backend
          const verifyRes = await fetch(apiUrl('api/payments/verify'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response),
          });
          const verify = await verifyRes.json();
          if (!verifyRes.ok || !verify.valid) {
            // show failure dialog
            setDialogData({
              type: 'error',
              title: 'Payment Verification Failed',
              message: 'Payment could not be verified. If your account was charged, contact support with the payment id.',
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
            });
            setDialogOpen(true);
            return;
          }

          // 5) On successful verification, create the user record
          const regRes = await fetch(apiUrl('api/auth/register'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...tempUser, familyDetails: formData.familyDetails || [] }),
          });
          if (!regRes.ok) {
            const err = await regRes.json();
            setDialogData({ type: 'error', title: 'Registration Failed', message: err.message || 'Registration failed after payment', paymentId: response.razorpay_payment_id, orderId: response.razorpay_order_id });
            setDialogOpen(true);
            return;
          }
          const data = await regRes.json();

          // success dialog with nice layout (like PhonePe)
          setDialogData({
            type: 'success',
            title: 'Payment Successful',
            message: 'Your subscription is active. Please save this confirmation.',
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            amount: (order.amount / 100).toFixed(2),
            plan: tempUser.plan,
            familyMembers: tempUser.familyMembers || 0,
            membershipId: data.user?.membershipId || data.user?.membershipId || null,
            familyDetails: formData.familyDetails || [],
          });
          setDialogOpen(true);
        } catch (err) {
          console.error(err);
          setDialogData({ type: 'error', title: 'Payment Error', message: 'An unexpected error occurred during payment. Please contact support.' });
          setDialogOpen(true);
        }
      },
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: formData.phone,
      },
      theme: { color: '#0ea5a4' },
    };

    // if backend provided key id in response (we didn't), otherwise ensure options.key is present
    if (!options.key) {
      console.warn('Razorpay key not present in frontend options; using backend-signed order. If checkout fails, add public key to window.RECT_APP_RAZORPAY_KEY');
    }

    const rzp = new (window as any).Razorpay(options);
    // handle explicit failure event from checkout
    if (rzp.on) {
      rzp.on('payment.failed', function (response: any) {
        const msg = response?.error?.description || 'Payment failed. Please try again.';
        const paymentId = response?.error?.metadata?.payment_id || response?.error?.payment_id || null;
        const orderId = response?.error?.metadata?.order_id || response?.error?.order_id || null;
        setDialogData({ type: 'error', title: 'Payment Failed', message: msg, paymentId, orderId });
        setDialogOpen(true);
      });
    }
    rzp.open();
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFamilyMemberChange = (index: number, field: string, value: string) => {
    setFormData((prev) => {
      const details = Array.isArray(prev.familyDetails) ? [...prev.familyDetails] : [];
      details[index] = { ...(details[index] || {}), [field]: field === 'age' ? Number(value) : value };
      return { ...prev, familyDetails: details };
    });
  };

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState<any>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-background py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-4">
            <Heart className="h-10 w-10 text-primary" />
            <span className="text-3xl font-extrabold text-slate-900">HealthConnect</span>
          </Link>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Create Your Account</CardTitle>
            <CardDescription className="text-muted-foreground">Join thousands of members saving on healthcare</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit} className="p-0">
            <CardContent className="space-y-6 p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="John Doe" value={formData.name} onChange={(e) => handleChange("name", e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="+91 98765 43210" value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} required />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="your.email@example.com" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} required />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="Create a password" value={formData.password} onChange={(e) => handleChange("password", e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input id="confirmPassword" type="password" placeholder="Confirm your password" value={formData.confirmPassword} onChange={(e) => handleChange("confirmPassword", e.target.value)} required />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 items-center">
                <div>
                  <Label>Plan</Label>
                  <div className="mt-2">
                    <div className="flex items-center justify-between border rounded-lg p-4 bg-white">
                      <div>
                        <div className="font-semibold">Annual</div>
                        <div className="text-sm text-muted-foreground">Base: ₹365 / person / year</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Price</div>
                        <div className="text-2xl font-bold text-primary">₹365</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="familyMembers">Additional Family Members</Label>
                  <select id="familyMembers" value={String(formData.familyMembers)} onChange={(e) => {
                      const val = Number(e.target.value || 0);
                      handleChange('familyMembers', val as any);
                      setFormData((prev) => {
                        const details = Array.isArray(prev.familyDetails) ? [...prev.familyDetails] : [];
                        while (details.length < val) details.push({ name: '', age: '', gender: '', relationship: '' });
                        details.length = val;
                        return { ...prev, familyDetails: details };
                      });
                    }} className="w-full input input-bordered">
                    <option value="0">0 (None)</option>
                    {[...Array(10)].map((_, i) => (<option key={i+1} value={i+1}>{i+1}</option>))}
                  </select>
                </div>
              </div>

              {/* Price breakdown */}
              <div className="rounded-lg border p-4 bg-muted/50">
                <div className="flex items-center justify-between">
                  <div className="text-sm">Original total</div>
                  <div className="text-sm text-muted-foreground line-through">₹{priceDisplay.rawTotal}</div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="text-sm">Discounted total</div>
                  <div className="text-xl font-bold text-primary">₹{priceDisplay.discountedTotal}</div>
                </div>
                <div className="text-xs text-muted-foreground mt-2">Includes ₹{basePrice} per person. 10% discount applied when family members added.</div>
              </div>

              {Number(formData.familyMembers) > 0 && (
                <div className="mt-2">
                  <h4 className="font-semibold mb-2">Family Member Details</h4>
                  <div className="space-y-4">
                    {[...Array(Number(formData.familyMembers))].map((_, idx) => (
                      <div key={idx} className="p-4 border rounded-lg bg-white">
                        <div className="grid md:grid-cols-2 gap-3">
                          <div>
                            <Label>Name</Label>
                            <Input value={formData.familyDetails[idx]?.name || ''} onChange={(e) => handleFamilyMemberChange(idx, 'name', e.target.value)} />
                          </div>
                          <div>
                            <Label>Age</Label>
                            <Input type="number" value={String(formData.familyDetails[idx]?.age || '')} onChange={(e) => handleFamilyMemberChange(idx, 'age', e.target.value)} />
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-3 mt-3">
                          <div>
                            <Label>Gender</Label>
                            <select value={formData.familyDetails[idx]?.gender || ''} onChange={(e) => handleFamilyMemberChange(idx, 'gender', e.target.value)} className="w-full input input-bordered">
                              <option value="">Select</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                          <div>
                            <Label>Relationship</Label>
                            <select value={formData.familyDetails[idx]?.relationship || ''} onChange={(e) => handleFamilyMemberChange(idx, 'relationship', e.target.value)} className="w-full input input-bordered">
                              <option value="">Select</option>
                              <option value="Son">Son</option>
                              <option value="Daughter">Daughter</option>
                              <option value="Father">Father</option>
                              <option value="Mother">Mother</option>
                              <option value="Grandfather">Grandfather</option>
                              <option value="Grandmother">Grandmother</option>
                              <option value="Husband">Husband</option>
                              <option value="Wife">Wife</option>
                              <option value="Brother">Brother</option>
                              <option value="Sister">Sister</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-3 p-6">
              <div className="flex gap-3">
                <Button type="submit" className="flex-1" size="lg">Review & Confirm</Button>
                <Button variant="outline" className="w-40" onClick={() => navigate('/login')}>Sign in</Button>
              </div>
              <p className="text-sm text-center text-muted-foreground">By continuing you agree to our Terms & Privacy Policy.</p>
            </CardFooter>
          </form>
        </Card>

        {/* Pre-checkout confirmation dialog */}
        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Your Subscription</DialogTitle>
              <DialogDescription>Verify plan details before proceeding to payment</DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">Plan</div>
                  <div className="text-sm text-muted-foreground">Annual</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground line-through">₹{priceDisplay.rawTotal}</div>
                  <div className="text-lg font-bold text-primary">₹{priceDisplay.discountedTotal}</div>
                </div>
              </div>

              <div>
                <div className="font-semibold">Family Members: {membersCount}</div>
                {membersCount > 0 && (
                  <div className="mt-2 space-y-2">
                    {formData.familyDetails.map((m, i) => (
                      <div key={i} className="border rounded p-3 bg-white">
                        <div className="font-semibold">{m.name || '—'}</div>
                        <div className="text-sm text-muted-foreground">Age: {m.age || '—'} • Gender: {m.gender || '—'} • Relation: {m.relationship || '—'}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <div className="flex w-full gap-2">
                <Button className="w-full" onClick={() => proceedToPayment()}>Confirm & Pay ₹{priceDisplay.discountedTotal}</Button>
                <Button variant="outline" className="w-full" onClick={() => setConfirmOpen(false)}>Cancel</Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Confirmation / result dialog (post-payment) */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{dialogData?.title || 'Status'}</DialogTitle>
              <DialogDescription>{dialogData?.message}</DialogDescription>
            </DialogHeader>

            <div className="mt-4 space-y-3">
              {dialogData?.type === 'success' && (
                <div className="flex flex-col items-center gap-4">
                  <Badge variant="secondary" className="px-4 py-2">SUCCESS</Badge>
                  <div className="text-center">
                    <div className="text-lg font-semibold">Plan: {dialogData?.plan || 'Annual'}</div>
                    <div className="text-sm text-muted-foreground">Amount: ₹{dialogData?.amount}</div>
                    <div className="text-sm text-muted-foreground">Family Members: {dialogData?.familyMembers || 0}</div>
                    {dialogData?.membershipId && <div className="text-sm text-muted-foreground">Membership ID: {dialogData.membershipId}</div>}
                  </div>

                  <div className="w-full border-t pt-3">
                    <div className="text-sm text-muted-foreground">Payment ID: {dialogData?.paymentId}</div>
                    <div className="text-sm text-muted-foreground">Order ID: {dialogData?.orderId}</div>
                  </div>
                </div>
              )}
              {dialogData?.type === 'error' && (
                <div className="space-y-2">
                  <Badge variant="destructive" className="px-4 py-2">ERROR</Badge>
                  <div className="text-sm text-muted-foreground">{dialogData?.message}</div>
                  <div className="text-sm text-muted-foreground">If you were charged, contact support with Payment ID: {dialogData?.paymentId}</div>
                </div>
              )}
            </div>

            <DialogFooter>
              <div className="flex w-full gap-2">
                {dialogData?.type === 'success' ? (
                  <Button className="w-full" onClick={() => { setDialogOpen(false); navigate('/login'); }}>Go to Login</Button>
                ) : (
                  <Button variant="outline" className="w-full" onClick={() => setDialogOpen(false)}>Close</Button>
                )}
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Signup;
