import { useState, useMemo } from "react";
import indiaDistricts from "@/lib/indiaDistricts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Stethoscope, Pill, Microscope } from "lucide-react";

type Role = "doctor" | "diagnostic" | "pharmacy";

const PartnerRegister = () => {
  const navigate = useNavigate();
  const stateDistricts = indiaDistricts;

  // common
  const [role, setRole] = useState<Role | "">("");
  const [stateValue, setStateValue] = useState("");
  const [district, setDistrict] = useState("");
  const [customDistrict, setCustomDistrict] = useState("");
  const [pincode, setPincode] = useState("");
  const [address, setAddress] = useState("");
  const [timings, setTimings] = useState("");
  const [website, setWebsite] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // person / responsible fields
  const [personName, setPersonName] = useState("");
  const [personAge, setPersonAge] = useState<number | "">("");
  const [personSex, setPersonSex] = useState("");
  const [personDOB, setPersonDOB] = useState("");

  // registration / council
  const [councilName, setCouncilName] = useState("");
  const [councilNumber, setCouncilNumber] = useState("");

  // center-specific
  const [centerName, setCenterName] = useState("");
  const [clinicName, setClinicName] = useState("");

  // files
  const [passportPhoto, setPassportPhoto] = useState<File | null>(null);
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [clinicPhotos, setClinicPhotos] = useState<FileList | null>(null);

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState<{ success: boolean; message: string } | null>(null);

  const districtsForSelected = stateValue && stateDistricts[stateValue] ? stateDistricts[stateValue] : [];

  const resetForm = () => {
    setRole("");
    setStateValue("");
    setDistrict("");
    setCustomDistrict("");
    setAddress("");
    setTimings("");
    setWebsite("");
    setContactEmail("");
    setContactPhone("");
    setEmail("");
    setPassword("");
    setPersonName("");
    setPersonAge("");
    setPersonSex("");
    setPersonDOB("");
    setCouncilName("");
    setCouncilNumber("");
    setClinicName("");
    setCenterName("");
    setPassportPhoto(null);
    setCertificateFile(null);
    setClinicPhotos(null);
    setPincode("");
  };

  const validate = () => {
    // basic required checks per role
    if (!role) return 'Please select a partner type (Doctor / Diagnostic / Pharmacy).';
    if (!personName) return 'Please enter responsible person name.';
    if (!contactPhone) return 'Please enter a contact phone number.';
    if (!contactEmail) return 'Please enter a contact email.';
    if (!email) return 'Please enter login email.';
    if (!password) return 'Please enter a password.';
    if (password.length < 6) return 'Password must be at least 6 characters long.';
    if (!address) return 'Please enter the clinic/center address.';
    if (!stateValue) return 'Please select a state.';
  if (!district && !customDistrict) return 'Please select or enter a district.';
  if (!pincode) return 'Please enter a pincode.';
    if (!councilName) return 'Please enter council/registration authority name.';
    if (!councilNumber) return 'Please enter council/registration number.';
    // doctor-specific file checks
    if (role === 'doctor' && !passportPhoto) return 'Please upload passport photo for the doctor.';
    // centers require certificate
    if ((role === 'diagnostic' || role === 'pharmacy') && !certificateFile) return 'Please upload the government registration certificate.';
    return null;
  };

  const handleSubmit = async () => {
    setStatusMessage(null);
    const err = validate();
    if (err) {
      setStatusMessage(err);
      return;
    }

    setLoading(true);
    try {
      const form = new FormData();
      form.append('role', role);
      form.append('responsibleName', personName);
      form.append('responsibleAge', String(personAge || ''));
      form.append('responsibleSex', personSex);
      form.append('responsibleDOB', personDOB);
      form.append('address', address);
      form.append('timings', timings);
      form.append('website', website);
      form.append('contactEmail', contactEmail);
      form.append('contactPhone', contactPhone);
      form.append('email', email);
      form.append('password', password);
      form.append('councilName', councilName);
      form.append('councilNumber', councilNumber);
      form.append('state', stateValue);
  const effDistrict = district === 'Other' ? customDistrict : (district || customDistrict);
  form.append('district', effDistrict || '');
  form.append('pincode', pincode || '');

      if (role === 'doctor') {
        form.append('clinicName', clinicName);
        if (clinicPhotos) {
          Array.from(clinicPhotos).forEach((f, idx) => form.append('clinicPhotos', f, f.name));
        }
      } else {
        // center (diagnostic / pharmacy)
        form.append('centerName', centerName);
      }
      // passportPhoto is optional for all roles but can be uploaded
      if (passportPhoto) form.append('passportPhoto', passportPhoto, passportPhoto.name);
      // certificate is required for centers, optional for doctors
      if (certificateFile) form.append('certificateFile', certificateFile, certificateFile.name);

      const res = await fetch('/api/partners/register', {
        method: 'POST',
        body: form,
      });

      if (!res.ok) {
        let text: any = await res.text();
        try { text = JSON.parse(text); } catch (_) {}
        const msg = text?.message || text || 'Registration failed';
        setDialogData({ success: false, message: String(msg) });
        setDialogOpen(true);
        setLoading(false);
        return;
      }

      setDialogData({ success: true, message: 'Registration submitted successfully. Our team will review and contact you.' });
      setDialogOpen(true);
      resetForm();
    } catch (err) {
      console.error(err);
      setDialogData({ success: false, message: 'Unexpected error when submitting. Please try again.' });
      setDialogOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const selection = (
    <div className="flex items-center justify-center py-12 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Partner Registration</h1>
        <p className="text-lg text-muted-foreground mb-12">Choose your partner type to get started with the registration process</p>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="cursor-pointer p-8 rounded-xl border-2 transition-all hover:shadow-xl hover:scale-105 border-border bg-card" onClick={() => setRole('doctor')}>
            <Stethoscope className="h-16 w-16 mx-auto mb-6 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Doctor</h3>
            <p className="text-sm text-muted-foreground">Register as a medical practitioner and join our network</p>
          </div>
          <div className="cursor-pointer p-8 rounded-xl border-2 transition-all hover:shadow-xl hover:scale-105 border-border bg-card" onClick={() => setRole('diagnostic')}>
            <Microscope className="h-16 w-16 mx-auto mb-6 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Diagnostic Center</h3>
            <p className="text-sm text-muted-foreground">Register your diagnostic facility for patient referrals</p>
          </div>
          <div className="cursor-pointer p-8 rounded-xl border-2 transition-all hover:shadow-xl hover:scale-105 border-border bg-card" onClick={() => setRole('pharmacy')}>
            <Pill className="h-16 w-16 mx-auto mb-6 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Pharmacy</h3>
            <p className="text-sm text-muted-foreground">Register your pharmacy for discounted medications</p>
          </div>
        </div>
      </div>
    </div>
  );

  const form = (
    <div className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Partner Registration - {role === 'doctor' ? 'Doctor' : role === 'diagnostic' ? 'Diagnostic Center' : 'Pharmacy'}</CardTitle>
            <CardDescription>Fill the form below and upload the required documents.</CardDescription>
            <Button variant="ghost" onClick={() => setRole('')} className="mt-4">← Change Partner Type</Button>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {/* Responsible / Personal details */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Full Name</Label>
                  <Input value={personName} onChange={(e) => setPersonName(e.target.value)} placeholder="Responsible person / Doctor name" />
                </div>
                <div>
                  <Label>Age</Label>
                  <Input type="number" value={String(personAge || '')} onChange={(e) => setPersonAge(e.target.value ? Number(e.target.value) : '')} placeholder="Age" />
                </div>
                <div>
                  <Label>Sex</Label>
                  <select className="input input-bordered w-full" value={personSex} onChange={(e) => setPersonSex(e.target.value)}>
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <Label>Date of Birth</Label>
                  <Input type="date" value={personDOB} onChange={(e) => setPersonDOB(e.target.value)} />
                </div>
              </div>

              {/* Clinic / Center details */}
              <div>
                <Label>{role === 'doctor' ? 'Clinic Name' : 'Center/Business Name'}</Label>
                <Input value={role === 'doctor' ? clinicName : centerName} onChange={(e) => role === 'doctor' ? setClinicName(e.target.value) : setCenterName(e.target.value)} placeholder={role === 'doctor' ? 'Clinic / Practice name' : 'Diagnostic center or pharmacy name'} />
              </div>

              <div>
                <Label>Address</Label>
                <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Full address" />
              </div>

              {/* State, District and Pincode (right after Address) */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label>State</Label>
                  <select className="input input-bordered w-full" value={stateValue} onChange={(e) => { setStateValue(e.target.value); setDistrict(''); setCustomDistrict(''); }}>
                    <option value="">Select state</option>
                    {Object.keys(stateDistricts).map(s => <option key={s} value={s}>{s}</option>)}
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <Label>District</Label>
                  {districtsForSelected.length > 0 ? (
                    <select className="input input-bordered w-full" value={district} onChange={(e) => setDistrict(e.target.value)}>
                      <option value="">Select district</option>
                      {districtsForSelected.map(d => <option key={d} value={d}>{d}</option>)}
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <Input value={customDistrict} onChange={(e) => setCustomDistrict(e.target.value)} placeholder="District" />
                  )}
                </div>
                <div>
                  <Label>Pincode</Label>
                  <Input value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="Pin / ZIP code" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Timings</Label>
                  <Input value={timings} onChange={(e) => setTimings(e.target.value)} placeholder="e.g. Mon-Fri 9:00-17:00" />
                </div>
                <div>
                  <Label>Website</Label>
                  <Input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Contact Email</Label>
                  <Input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="contact@you.com" />
                </div>
                <div>
                  <Label>Contact Phone</Label>
                  <Input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="Phone number" />
                </div>
              </div>

              {/* Login Credentials */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Login Email *</Label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@domain.com" required />
                </div>
                <div>
                  <Label>Password *</Label>
                  <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimum 6 characters" required />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Registering Authority / Council Name</Label>
                  <Input value={councilName} onChange={(e) => setCouncilName(e.target.value)} placeholder="Council or authority" />
                </div>
                <div>
                  <Label>Registration / Council Number</Label>
                  <Input value={councilNumber} onChange={(e) => setCouncilNumber(e.target.value)} placeholder="Registration number" />
                </div>
              </div>

              {/* (State/District moved earlier; single set above Address) */}

              {/* File uploads */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Passport Photo {role === 'doctor' ? '(Required)' : '(Optional)'}</Label>
                  <input type="file" accept="image/*" onChange={(e) => setPassportPhoto(e.target.files?.[0] || null)} className="mt-2" />
                </div>
                <div>
                  <Label>{role === 'doctor' ? 'Council Certificate (Optional)' : 'Government Registration Certificate (Required)'}</Label>
                  <input type="file" accept="image/*,application/pdf" onChange={(e) => setCertificateFile(e.target.files?.[0] || null)} className="mt-2" />
                </div>
              </div>

              {role === 'doctor' && (
                <div>
                  <Label>Clinic Photos (Optional - you may upload multiple)</Label>
                  <input type="file" accept="image/*" multiple onChange={(e) => setClinicPhotos(e.target.files)} className="mt-2" />
                </div>
              )}

              {statusMessage && <div className="text-sm text-destructive mt-2">{statusMessage}</div>}

              <div className="flex items-center gap-3">
                <Button onClick={handleSubmit} disabled={loading} className="px-6">{loading ? 'Submitting...' : 'Submit Registration'}</Button>
                <Button variant="outline" onClick={() => { resetForm(); setStatusMessage(null); }}>Reset</Button>
                {dialogData?.success && <Badge variant="secondary">Submitted</Badge>}
              </div>
            </div>
          </CardContent>
          <CardFooter />
        </Card>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{dialogData?.success ? 'Registration Submitted' : 'Submission Error'}</DialogTitle>
              <DialogDescription>{dialogData?.message}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <div className="w-full">
                <Button className="w-full" onClick={() => { setDialogOpen(false); if (dialogData?.success) navigate('/partner'); }}>{dialogData?.success ? 'Go to Partner Portal' : 'Close'}</Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {!role ? selection : form}
    </div>
  );
};

export default PartnerRegister;
