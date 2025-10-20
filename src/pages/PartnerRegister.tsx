import { useState, useMemo } from "react";
import indiaDistricts from "@/lib/indiaDistricts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Stethoscope, Pill, Microscope, ArrowLeft, Upload, CheckCircle, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";

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

      const res = await fetch(apiUrl('api/partners/register'), {
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-6xl w-full mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Partner Registration
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join our healthcare network and expand your reach. Choose your partner type to begin the registration process.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {[
            { role: 'doctor' as Role, icon: Stethoscope, title: 'Doctor', desc: 'Register as a medical practitioner and join our network' },
            { role: 'diagnostic' as Role, icon: Microscope, title: 'Diagnostic Center', desc: 'Register your diagnostic facility for patient referrals' },
            { role: 'pharmacy' as Role, icon: Pill, title: 'Pharmacy', desc: 'Register your pharmacy for discounted medications' }
          ].map(({ role: roleOption, icon: Icon, title, desc }) => (
            <div
              key={roleOption}
              className="group cursor-pointer relative bg-white rounded-2xl border border-gray-200 p-8 transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:border-blue-300"
              onClick={() => setRole(roleOption)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Icon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
                <div className="mt-6 text-blue-600 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Get Started →
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const form = (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-2xl border-0 rounded-3xl overflow-hidden bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white pb-8">
            <div className="flex items-center gap-4 mb-4">
              <Button 
                variant="ghost" 
                onClick={() => setRole('')} 
                className="text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <CardTitle className="text-2xl md:text-3xl font-bold">Partner Registration</CardTitle>
                <CardDescription className="text-blue-100 mt-2">
                  {role === 'doctor' ? 'Doctor' : role === 'diagnostic' ? 'Diagnostic Center' : 'Pharmacy'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6 md:p-8">
            <div className="space-y-8">
              {/* Personal Details Section */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
                  <h3 className="text-xl font-semibold text-gray-900">Personal Details</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Full Name *</Label>
                    <Input 
                      value={personName} 
                      onChange={(e) => setPersonName(e.target.value)} 
                      placeholder="Responsible person / Doctor name"
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Age</Label>
                    <Input 
                      type="number" 
                      value={String(personAge || '')} 
                      onChange={(e) => setPersonAge(e.target.value ? Number(e.target.value) : '')} 
                      placeholder="Age"
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Sex</Label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      value={personSex} 
                      onChange={(e) => setPersonSex(e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Date of Birth</Label>
                    <Input 
                      type="date" 
                      value={personDOB} 
                      onChange={(e) => setPersonDOB(e.target.value)}
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </section>

              {/* Business Details Section */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-8 bg-green-600 rounded-full"></div>
                  <h3 className="text-xl font-semibold text-gray-900">Business Details</h3>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      {role === 'doctor' ? 'Clinic Name *' : 'Center/Business Name *'}
                    </Label>
                    <Input 
                      value={role === 'doctor' ? clinicName : centerName} 
                      onChange={(e) => role === 'doctor' ? setClinicName(e.target.value) : setCenterName(e.target.value)} 
                      placeholder={role === 'doctor' ? 'Clinic / Practice name' : 'Diagnostic center or pharmacy name'}
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Address *</Label>
                    <Input 
                      value={address} 
                      onChange={(e) => setAddress(e.target.value)} 
                      placeholder="Full address"
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">State *</Label>
                      <select 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        value={stateValue} 
                        onChange={(e) => { setStateValue(e.target.value); setDistrict(''); setCustomDistrict(''); }}
                      >
                        <option value="">Select state</option>
                        {Object.keys(stateDistricts).map(s => <option key={s} value={s}>{s}</option>)}
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">District *</Label>
                      {districtsForSelected.length > 0 ? (
                        <select 
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          value={district} 
                          onChange={(e) => setDistrict(e.target.value)}
                        >
                          <option value="">Select district</option>
                          {districtsForSelected.map(d => <option key={d} value={d}>{d}</option>)}
                          <option value="Other">Other</option>
                        </select>
                      ) : (
                        <Input 
                          value={customDistrict} 
                          onChange={(e) => setCustomDistrict(e.target.value)} 
                          placeholder="District"
                          className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Pincode *</Label>
                      <Input 
                        value={pincode} 
                        onChange={(e) => setPincode(e.target.value)} 
                        placeholder="Pin / ZIP code"
                        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Timings</Label>
                      <Input 
                        value={timings} 
                        onChange={(e) => setTimings(e.target.value)} 
                        placeholder="e.g. Mon-Fri 9:00-17:00"
                        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Website</Label>
                      <Input 
                        value={website} 
                        onChange={(e) => setWebsite(e.target.value)} 
                        placeholder="https://"
                        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Contact & Login Section */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-8 bg-purple-600 rounded-full"></div>
                  <h3 className="text-xl font-semibold text-gray-900">Contact & Login Information</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Contact Email *</Label>
                    <Input 
                      value={contactEmail} 
                      onChange={(e) => setContactEmail(e.target.value)} 
                      placeholder="contact@you.com"
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Contact Phone *</Label>
                    <Input 
                      value={contactPhone} 
                      onChange={(e) => setContactPhone(e.target.value)} 
                      placeholder="Phone number"
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Login Email *</Label>
                    <Input 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      placeholder="email@domain.com" 
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Password *</Label>
                    <Input 
                      type="password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      placeholder="Minimum 6 characters"
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </section>

              {/* Registration Details Section */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-8 bg-orange-500 rounded-full"></div>
                  <h3 className="text-xl font-semibold text-gray-900">Registration Details</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Registering Authority / Council Name *</Label>
                    <Input 
                      value={councilName} 
                      onChange={(e) => setCouncilName(e.target.value)} 
                      placeholder="Council or authority"
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Registration / Council Number *</Label>
                    <Input 
                      value={councilNumber} 
                      onChange={(e) => setCouncilNumber(e.target.value)} 
                      placeholder="Registration number"
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </section>

              {/* File Uploads Section */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-8 bg-red-500 rounded-full"></div>
                  <h3 className="text-xl font-semibold text-gray-900">Document Uploads</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        Passport Photo {role === 'doctor' ? '(Required)' : '(Optional)'}
                        {passportPhoto && <CheckCircle className="h-4 w-4 text-green-600" />}
                      </Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center transition-all duration-200 hover:border-blue-400 hover:bg-blue-50/50 relative">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setPassportPhoto(e.target.files?.[0] || null)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <p className="text-sm text-gray-600 relative z-0">
                          {passportPhoto ? passportPhoto.name : 'Click to upload passport photo'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        {role === 'doctor' ? 'Council Certificate (Optional)' : 'Government Registration Certificate (Required)'}
                        {certificateFile && <CheckCircle className="h-4 w-4 text-green-600" />}
                      </Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center transition-all duration-200 hover:border-blue-400 hover:bg-blue-50/50 relative">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          onChange={(e) => setCertificateFile(e.target.files?.[0] || null)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <p className="text-sm text-gray-600 relative z-0">
                          {certificateFile ? certificateFile.name : 'Click to upload certificate'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {role === 'doctor' && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      Clinic Photos (Optional - you may upload multiple)
                      {clinicPhotos && <CheckCircle className="h-4 w-4 text-green-600" />}
                    </Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center transition-all duration-200 hover:border-blue-400 hover:bg-blue-50/50 relative">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => setClinicPhotos(e.target.files)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <p className="text-sm text-gray-600 relative z-0">
                        {clinicPhotos ? `${clinicPhotos.length} files selected` : 'Click to upload clinic photos'}
                      </p>
                    </div>
                  </div>
                )}
              </section>

              {/* Status and Actions */}
              {statusMessage && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  <AlertCircle className="h-5 w-5" />
                  <span className="text-sm">{statusMessage}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                <Button 
                  onClick={handleSubmit} 
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting Registration...
                    </div>
                  ) : (
                    'Submit Registration'
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => { resetForm(); setStatusMessage(null); }}
                  className="py-3 rounded-xl transition-all duration-200 hover:bg-gray-50 hover:shadow-md"
                >
                  Reset Form
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="rounded-2xl max-w-md">
            <DialogHeader className="text-center">
              <div className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${dialogData?.success ? 'bg-green-100' : 'bg-red-100'}`}>
                {dialogData?.success ? (
                  <CheckCircle className="h-6 w-6 text-green-600" />
                ) : (
                  <AlertCircle className="h-6 w-6 text-red-600" />
                )}
              </div>
              <DialogTitle className={dialogData?.success ? 'text-green-600' : 'text-red-600'}>
                {dialogData?.success ? 'Registration Submitted' : 'Submission Error'}
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                {dialogData?.message}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button 
                className={`w-full rounded-xl ${dialogData?.success ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                onClick={() => { 
                  setDialogOpen(false); 
                  if (dialogData?.success) navigate('/partner'); 
                }}
              >
                {dialogData?.success ? 'Go to Partner Portal' : 'Close'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
      {!role ? selection : form}
    </div>
    </>
  );
};

export default PartnerRegister;