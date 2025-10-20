import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, Users, Shield, CheckCircle, AlertCircle, ArrowRight, ArrowLeft, CreditCard } from "lucide-react";
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
import Navbar from "@/components/Navbar";

// Separate component for Personal Details to prevent re-renders
const PersonalDetailsStep = ({ formData, onUpdate, onNext, onBack, errors, setErrors }) => {
  const handleChange = (field: string, value: string) => {
    onUpdate(field, value);
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-emerald-50 p-4">
      <Card className="w-full max-w-2xl shadow-2xl border-0 rounded-3xl">
        <CardHeader className="text-center pb-6">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="absolute left-6 top-6 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <CardTitle className="text-3xl font-bold text-gray-900">Personal Information</CardTitle>
          <CardDescription className="text-gray-600 text-lg">Tell us about yourself to get started</CardDescription>
        </CardHeader>

        <ProgressSteps currentStep={1} />

        <form onSubmit={(e) => { e.preventDefault(); onNext(); }}>
          <CardContent className="space-y-6 px-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-gray-900 font-semibold">Full Name *</Label>
                <Input 
                  id="name" 
                  placeholder="Enter your full name" 
                  value={formData.name} 
                  onChange={(e) => handleChange("name", e.target.value)} 
                  required 
                  className={`rounded-xl border-gray-300 focus:border-blue-500 transition-all duration-200 ${errors.name ? 'border-red-500 focus:border-red-500' : ''}`}
                />
                {errors.name && (
                  <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                )}
              </div>
              <div className="space-y-3">
                <Label htmlFor="phone" className="text-gray-900 font-semibold">Phone Number *</Label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-xl">
                    +91
                  </span>
                  <Input 
                    id="phone" 
                    type="tel" 
                    placeholder="9876543210" 
                    value={formData.phone.replace(/^\+91\s*/, '')} 
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                      handleChange("phone", value);
                    }} 
                    required 
                    className={`rounded-l-none rounded-r-xl border-gray-300 focus:border-blue-500 transition-all duration-200 ${errors.phone ? 'border-red-500 focus:border-red-500' : ''}`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="email" className="text-gray-900 font-semibold">Email Address *</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="your.email@example.com" 
                value={formData.email} 
                onChange={(e) => handleChange("email", e.target.value)} 
                required 
                className={`rounded-xl border-gray-300 focus:border-blue-500 transition-all duration-200 ${errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="password" className="text-gray-900 font-semibold">Password *</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Create secure password" 
                  value={formData.password} 
                  onChange={(e) => handleChange("password", e.target.value)} 
                  required 
                  className={`rounded-xl border-gray-300 focus:border-blue-500 transition-all duration-200 ${errors.password ? 'border-red-500 focus:border-red-500' : ''}`}
                />
                {errors.password && (
                  <p className="text-red-600 text-sm mt-1">{errors.password}</p>
                )}
              </div>
              <div className="space-y-3">
                <Label htmlFor="confirmPassword" className="text-gray-900 font-semibold">Confirm Password *</Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  placeholder="Confirm your password" 
                  value={formData.confirmPassword} 
                  onChange={(e) => handleChange("confirmPassword", e.target.value)} 
                  required 
                  className={`rounded-xl border-gray-300 focus:border-blue-500 transition-all duration-200 ${errors.confirmPassword ? 'border-red-500 focus:border-red-500' : ''}`}
                />
                {errors.confirmPassword && (
                  <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex gap-4 pt-6 px-8 pb-8">
            <Button 
              type="button"
              variant="outline" 
              onClick={onBack}
              className="flex-1 rounded-xl border-gray-300 hover:bg-gray-50 transition-all duration-200"
            >
              Back
            </Button>
            <Button 
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white rounded-xl transition-all duration-200 hover:shadow-lg"
            >
              Continue to Family Details
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

// Separate component for Family Details
const FamilyDetailsStep = ({ formData, onUpdate, onNext, onBack }) => {
  const handleChange = (field: string, value: string) => {
    onUpdate(field, value);
  };

  const handleFamilyMemberChange = (index: number, field: string, value: string) => {
    onUpdate('familyDetails', { index, field, value });
  };

  const handleFamilyMembersChange = (value: number) => {
    onUpdate('familyMembers', value);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-emerald-50 p-4">
      <Card className="w-full max-w-2xl shadow-2xl border-0 rounded-3xl">
        <CardHeader className="text-center pb-6">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="absolute left-6 top-6 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <CardTitle className="text-3xl font-bold text-gray-900">Family Members</CardTitle>
          <CardDescription className="text-gray-600 text-lg">Add your family members to include them in your plan</CardDescription>
        </CardHeader>

        <ProgressSteps currentStep={2} />

        <form onSubmit={(e) => { e.preventDefault(); onNext(); }}>
          <CardContent className="space-y-6 px-8">
            <div className="space-y-3">
              <Label htmlFor="familyMembers" className="text-gray-900 font-semibold text-lg">Add Family Members</Label>
              <select 
                id="familyMembers" 
                value={String(formData.familyMembers)} 
                onChange={(e) => handleFamilyMembersChange(Number(e.target.value))}
                className="w-full bg-white border-gray-300 text-gray-900 rounded-xl px-4 py-3 focus:border-blue-500 transition-all duration-200"
              >
                <option value="0">0 (Just Me)</option>
                {[...Array(10)].map((_, i) => (
                  <option key={i+1} value={i+1}>{i+1} Member{i > 0 ? 's' : ''}</option>
                ))}
              </select>
              <p className="text-blue-600 text-sm">Add family members to get 10% discount on total</p>
            </div>

            {Number(formData.familyMembers) > 0 && (
              <div className="space-y-4">
                <h4 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                  <Users className="h-5 w-5 text-emerald-600" />
                  Family Member Details
                </h4>
                <div className="space-y-4">
                  {[...Array(Number(formData.familyMembers))].map((_, idx) => (
                    <div key={idx} className="bg-gray-50 border border-gray-200 rounded-xl p-6 hover:border-emerald-300 transition-all duration-200">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-gray-900 font-semibold">Full Name</Label>
                          <Input 
                            value={formData.familyDetails[idx]?.name || ''} 
                            onChange={(e) => handleFamilyMemberChange(idx, 'name', e.target.value)}
                            className="rounded-lg border-gray-300 focus:border-blue-500"
                            placeholder="Family member name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-gray-900 font-semibold">Age</Label>
                          <Input 
                            type="number" 
                            value={String(formData.familyDetails[idx]?.age || '')} 
                            onChange={(e) => handleFamilyMemberChange(idx, 'age', e.target.value)}
                            className="rounded-lg border-gray-300 focus:border-blue-500"
                            placeholder="Age"
                          />
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 mt-4">
                        <div className="space-y-2">
                          <Label className="text-gray-900 font-semibold">Gender</Label>
                          <select 
                            value={formData.familyDetails[idx]?.gender || ''} 
                            onChange={(e) => handleFamilyMemberChange(idx, 'gender', e.target.value)}
                            className="w-full bg-white border-gray-300 text-gray-900 rounded-lg px-3 py-2 focus:border-blue-500"
                          >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-gray-900 font-semibold">Relationship</Label>
                          <select 
                            value={formData.familyDetails[idx]?.relationship || ''} 
                            onChange={(e) => handleFamilyMemberChange(idx, 'relationship', e.target.value)}
                            className="w-full bg-white border-gray-300 text-gray-900 rounded-lg px-3 py-2 focus:border-blue-500"
                          >
                            <option value="">Select Relationship</option>
                            <option value="Son">Son</option>
                            <option value="Daughter">Daughter</option>
                            <option value="Father">Father</option>
                            <option value="Mother">Mother</option>
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

          <CardFooter className="flex gap-4 pt-6 px-8 pb-8">
            <Button 
              type="button"
              variant="outline" 
              onClick={onBack}
              className="flex-1 rounded-xl border-gray-300 hover:bg-gray-50 transition-all duration-200"
            >
              Back
            </Button>
            <Button 
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white rounded-xl transition-all duration-200 hover:shadow-lg"
            >
              Review & Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

// Progress Steps Component
const ProgressSteps = ({ currentStep }) => {
  const steps = [
    { id: 1, name: "Personal Details", description: "Tell us about yourself" },
    { id: 2, name: "Family Members", description: "Add your family" },
    { id: 3, name: "Payment", description: "Complete your subscription" }
  ];

  return (
    <div className="flex justify-center mb-8">
      <div className="flex items-center space-x-4">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          
          return (
            <div key={step.id} className="flex items-center">
              <div className={`flex flex-col items-center transition-all duration-300 ${
                isActive ? 'scale-110' : ''
              }`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  isCompleted 
                    ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/50'
                    : isActive
                    ? 'bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-500/50'
                    : 'bg-white border-gray-300 text-gray-500'
                }`}>
                  {isCompleted ? <CheckCircle className="h-5 w-5" /> : stepNumber}
                </div>
                <span className={`text-xs mt-2 font-medium ${
                  isActive ? 'text-blue-600' : isCompleted ? 'text-emerald-600' : 'text-gray-500'
                }`}>
                  {step.name}
                </span>
              </div>
              {stepNumber < 3 && (
                <div className={`w-12 h-1 mx-4 transition-all duration-300 ${
                  stepNumber < currentStep ? 'bg-emerald-500' : 'bg-gray-300'
                }`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Signup = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState<any>(null);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

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

  // Calculate prices
  const basePrice = 365;
  const membersCount = Number(formData.familyMembers) || (Array.isArray(formData.familyDetails) ? formData.familyDetails.length : 0);
  const totalPersons = 1 + membersCount;
  const rawTotal = basePrice * totalPersons;
  const discountedTotal = membersCount > 0 ? Math.round(rawTotal * 0.9) : rawTotal;

  const priceDisplay = useMemo(() => ({ rawTotal, discountedTotal }), [rawTotal, discountedTotal]);

  // Email validation function
  const checkEmailExists = useCallback(async (email: string) => {
    try {
      const res = await fetch(apiUrl('api/auth/check-email'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      return data.exists;
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  }, []);

  // Step navigation handlers with validation
  const handlePersonalDetailsNext = useCallback(async () => {
    // Clear previous errors
    setErrors({});

    // Validate required fields
    if (!formData.name.trim()) {
      setErrors({ name: 'Please enter your full name' });
      return;
    }
    if (!formData.phone.trim()) {
      setErrors({ phone: 'Please enter your phone number' });
      return;
    }
    if (formData.phone.length !== 10) {
      setErrors({ phone: 'Please enter a valid 10-digit phone number' });
      return;
    }
    if (!formData.email.trim()) {
      setErrors({ email: 'Please enter your email address' });
      return;
    }
    if (!formData.password) {
      setErrors({ password: 'Please enter a password' });
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }

    // Check if email already exists
    const emailExists = await checkEmailExists(formData.email);
    if (emailExists) {
      setErrors({ email: 'This email address is already registered. Please use a different email or login to your existing account.' });
      return;
    }

    setCurrentStep(2);
  }, [formData, checkEmailExists]);

  const handleFamilyDetailsNext = useCallback(() => {
    setCurrentStep(3);
  }, []);

  // Stable form update handler
  const handleFormUpdate = useCallback((field: string, value: any) => {
    if (field === 'familyDetails' && typeof value === 'object') {
      // Handle family details update
      const { index, field: memberField, value: memberValue } = value;
      setFormData(prev => {
        const details = Array.isArray(prev.familyDetails) ? [...prev.familyDetails] : [];
        details[index] = { 
          ...(details[index] || {}), 
          [memberField]: memberField === 'age' ? Number(memberValue) : memberValue 
        };
        return { ...prev, familyDetails: details };
      });
    } else if (field === 'familyMembers') {
      // Handle family members count change
      const val = Number(value);
      setFormData(prev => {
        const details = Array.isArray(prev.familyDetails) ? [...prev.familyDetails] : [];
        while (details.length < val) details.push({ name: '', age: '', gender: '', relationship: '' });
        details.length = val;
        return { ...prev, familyMembers: val, familyDetails: details };
      });
    } else {
      // Handle regular field update
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  }, []);

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

  const proceedToPayment = useCallback(async () => {
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

    const ok = await loadRazorpayScript();
    if (!ok) {
      alert('Failed to load Razorpay SDK');
      return;
    }

    const options: any = {
      key: (window as any).RAZORPAY_KEY || '',
      amount: order.amount,
      currency: order.currency,
      name: 'HealthConnect',
      description: `Subscribe: ${tempUser.plan}`,
      order_id: order.id,
      modal: {
        ondismiss: function () {
          try {
            setDialogData({ type: 'error', title: 'Payment Cancelled', message: 'Payment was cancelled or could not be completed. Please try again.' });
            setDialogOpen(true);
          } catch (err) {
            console.warn('Failed to show cancel dialog', err);
          }
        }
      },
      handler: async function (response: any) {
        try {
          const verifyRes = await fetch(apiUrl('api/payments/verify'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response),
          });
          const verify = await verifyRes.json();
          if (!verifyRes.ok || !verify.valid) {
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
          setCurrentStep(4);
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

    if (!options.key) {
      console.warn('Razorpay key not present in frontend options; using backend-signed order. If checkout fails, add public key to window.RECT_APP_RAZORPAY_KEY');
    }

    const rzp = new (window as any).Razorpay(options);
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
  }, [formData, membersCount]);

  // Welcome Step
  const WelcomeStep = () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-emerald-50 p-4">
      <Card className="w-full max-w-2xl shadow-2xl border-0 rounded-3xl overflow-hidden">
        <CardHeader className="text-center pb-8 pt-12 bg-gradient-to-r from-blue-600 to-emerald-600 text-white">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/20 flex items-center justify-center">
            <Heart className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-4xl font-bold">Welcome to HealthConnect</CardTitle>
          <CardDescription className="text-blue-100 text-lg mt-4">
            Join thousands of families protecting their health with our comprehensive healthcare plan
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="space-y-3">
              <div className="w-12 h-12 mx-auto rounded-xl bg-blue-100 flex items-center justify-center">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Family Protection</h3>
              <p className="text-sm text-gray-600">Cover your entire family under one plan</p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Save 70%</h3>
              <p className="text-sm text-gray-600">On healthcare expenses and medications</p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 mx-auto rounded-xl bg-amber-100 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Instant Activation</h3>
              <p className="text-sm text-gray-600">Get started immediately after payment</p>
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-2xl p-6 text-center">
            <h4 className="font-bold text-gray-900 text-lg mb-2">Annual Plan - ₹365/year</h4>
            <p className="text-gray-600">Just ₹1 per day for complete family health protection</p>
          </div>
        </CardContent>
        <CardFooter className="pb-8 px-8">
          <Button 
            onClick={() => setCurrentStep(1)}
            className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white py-3 rounded-xl text-lg font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );

  // Payment Step
  const PaymentStep = () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-emerald-50 p-4">
      <Card className="w-full max-w-2xl shadow-2xl border-0 rounded-3xl">
        <CardHeader className="text-center pb-6">
          <Button 
            variant="ghost" 
            onClick={() => setCurrentStep(2)}
            className="absolute left-6 top-6 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <CardTitle className="text-3xl font-bold text-gray-900">Payment</CardTitle>
          <CardDescription className="text-gray-600 text-lg">Complete your subscription to get started</CardDescription>
        </CardHeader>

        <ProgressSteps currentStep={3} />

        <CardContent className="space-y-6 px-8">
          <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
            <h4 className="font-bold text-gray-900 text-lg flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-blue-600" />
              Order Summary
            </h4>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Annual Plan (You)</span>
                <span className="font-semibold">₹365</span>
              </div>
              
              {membersCount > 0 && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Family Members × {membersCount}</span>
                    <span className="font-semibold">₹{365 * membersCount}</span>
                  </div>
                  <div className="flex justify-between items-center bg-green-50 rounded-lg p-3">
                    <span className="text-green-700 font-medium">Family Discount</span>
                    <span className="font-bold text-green-700">-10%</span>
                  </div>
                </>
              )}
              
              <div className="border-t pt-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total Amount</span>
                  <div className="text-right">
                    {membersCount > 0 && (
                      <div className="text-sm text-gray-500 line-through">₹{priceDisplay.rawTotal}</div>
                    )}
                    <div className="text-xl font-bold text-emerald-600">₹{priceDisplay.discountedTotal}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {membersCount > 0 && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h4 className="font-bold text-gray-900 text-lg mb-4">Family Members Included</h4>
              <div className="space-y-3">
                {formData.familyDetails.map((member, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{member.name || 'Unnamed'}</div>
                      <div className="text-sm text-gray-600">
                        {[member.age && `Age: ${member.age}`, member.gender, member.relationship].filter(Boolean).join(' • ')}
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                      Included
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex gap-4 pt-6 px-8 pb-8">
          <Button 
            type="button"
            variant="outline" 
            onClick={() => setCurrentStep(2)}
            className="flex-1 rounded-xl border-gray-300 hover:bg-gray-50 transition-all duration-200"
          >
            Back
          </Button>
          <Button 
            onClick={proceedToPayment}
            className="flex-1 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white rounded-xl transition-all duration-200 hover:shadow-lg text-lg font-semibold"
          >
            Pay ₹{priceDisplay.discountedTotal}
            <CreditCard className="ml-2 h-5 w-5" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );

  // Confirmation Step
  const ConfirmationStep = () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-emerald-50 p-4">
      <Card className="w-full max-w-2xl shadow-2xl border-0 rounded-3xl">
        <CardHeader className="text-center pb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-emerald-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">Registration Complete!</CardTitle>
          <CardDescription className="text-gray-600 text-lg">
            Welcome to the HealthConnect family
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 px-8 text-center">
          <div className="bg-emerald-50 rounded-2xl p-6">
            <h4 className="font-bold text-gray-900 text-lg mb-2">Your HealthConnect Plan</h4>
            <div className="space-y-2 text-gray-600">
              <p>Annual Subscription - ₹{priceDisplay.discountedTotal}</p>
              <p>{1 + membersCount} Family Member{membersCount !== 0 ? 's' : ''} Covered</p>
              <p className="text-sm">Plan activated immediately</p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-gray-600">
              Your account has been created successfully. You can now login and start using HealthConnect services.
            </p>
            <p className="text-sm text-gray-500">
              Check your email for confirmation and membership details.
            </p>
          </div>
        </CardContent>

        <CardFooter className="px-8 pb-8">
          <Button 
            onClick={() => navigate('/login')}
            className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white rounded-xl transition-all duration-200 hover:shadow-lg text-lg font-semibold"
          >
            Go to Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );

  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeStep />;
      case 1:
        return (
          <PersonalDetailsStep 
            formData={formData}
            onUpdate={handleFormUpdate}
            onNext={handlePersonalDetailsNext}
            onBack={() => setCurrentStep(0)}
            errors={errors}
            setErrors={setErrors}
          />
        );
      case 2:
        return (
          <FamilyDetailsStep 
            formData={formData}
            onUpdate={handleFormUpdate}
            onNext={handleFamilyDetailsNext}
            onBack={() => setCurrentStep(1)}
          />
        );
      case 3:
        return <PaymentStep />;
      case 4:
        return <ConfirmationStep />;
      default:
        return <WelcomeStep />;
    }
  };

  return (
    <>
      <Navbar />
      {renderStep()}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader className="text-center">
            <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
              dialogData?.type === 'success' ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {dialogData?.type === 'success' ? (
                <CheckCircle className="h-8 w-8 text-green-600" />
              ) : (
                <AlertCircle className="h-8 w-8 text-red-600" />
              )}
            </div>
            <DialogTitle className={
              dialogData?.type === 'success' ? 'text-green-600 text-xl' : 'text-red-600 text-xl'
            }>
              {dialogData?.title}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              {dialogData?.message}
            </DialogDescription>
          </DialogHeader>

          {dialogData?.type === 'success' && (
            <div className="mt-4 space-y-3">
              <div className="bg-green-50 rounded-xl p-4">
                <div className="text-sm text-gray-700 space-y-1">
                  <div>Payment ID: {dialogData?.paymentId}</div>
                  <div>Amount: ₹{dialogData?.amount}</div>
                  {dialogData?.membershipId && (
                    <div>Membership ID: {dialogData.membershipId}</div>
                  )}
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="mt-6">
            <Button 
              className="w-full rounded-xl"
              onClick={() => setDialogOpen(false)}
            >
              {dialogData?.type === 'success' ? 'Continue' : 'Close'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Signup;