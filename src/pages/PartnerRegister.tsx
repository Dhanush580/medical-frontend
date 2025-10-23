import { useState, useMemo } from "react";
import indiaDistricts from "@/lib/indiaDistricts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Stethoscope, Pill, Microscope, ArrowLeft, Upload, CheckCircle, AlertCircle, Shield, Users, Clock, Award } from "lucide-react";
import Navbar from "@/components/Navbar";

type Role = "doctor" | "dentist" | "diagnostic" | "pharmacy";

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
  const [timeFrom, setTimeFrom] = useState("");
  const [timeTo, setTimeTo] = useState("");
  const [dayFrom, setDayFrom] = useState("");
  const [dayTo, setDayTo] = useState("");
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
  const [specialization, setSpecialization] = useState("");
  const [customSpecialization, setCustomSpecialization] = useState("");

  // center-specific
  const [centerName, setCenterName] = useState("");
  const [clinicName, setClinicName] = useState("");

  // discount fields
  const [discountAmount, setDiscountAmount] = useState("");
  const [discountItems, setDiscountItems] = useState<string[]>([]);
  const [currentDiscountItem, setCurrentDiscountItem] = useState("");

  // files
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [clinicPhotos, setClinicPhotos] = useState<FileList | null>(null);

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState<{ success: boolean; message: string } | null>(null);
  const [hasShownSuccessMessage, setHasShownSuccessMessage] = useState(false);

  // terms and conditions
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [termsDialogOpen, setTermsDialogOpen] = useState(false);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  const districtsForSelected = stateValue && stateDistricts[stateValue] ? stateDistricts[stateValue] : [];

  const resetForm = () => {
    setRole("");
    setStateValue("");
    setDistrict("");
    setCustomDistrict("");
    setAddress("");
    setTimings("");
    setTimeFrom("");
    setTimeTo("");
    setDayFrom("");
    setDayTo("");
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
    setSpecialization("");
    setCustomSpecialization("");
    setClinicName("");
    setCenterName("");
    setCertificateFile(null);
    setClinicPhotos(null);
    setPincode("");
    setDiscountAmount("");
    setDiscountItems([]);
    setCurrentDiscountItem("");
    setAcceptTerms(false);
    setHasScrolledToBottom(false);
  };

  const validate = () => {
    // basic required checks per role
    if (!role) return 'Please select a partner type (Doctor / Dentist / Diagnostic / Pharmacy).';
    if (!personName) return 'Please enter responsible person name.';
    if (!personAge || personAge === '') return 'Please enter your age.';
    if (!personSex) return 'Please select your sex.';
    if (!personDOB) return 'Please enter your date of birth.';
    if (!contactPhone) return 'Please enter a contact phone number.';
    if (!contactEmail) return 'Please enter a contact email.';
    if (!email) return 'Please enter login email.';
    if (!password) return 'Please enter a password.';
    if (password.length < 6) return 'Password must be at least 6 characters long.';
    if (!address) return 'Please enter the clinic/center address.';
    if (!stateValue) return 'Please select a state.';
    if (!district && !customDistrict) return 'Please select or enter a district.';
    if (!pincode) return 'Please enter a pincode.';
    if (!timeFrom || !timeTo) return 'Please specify your available timings (from and to).';
    if (!dayFrom || !dayTo) return 'Please specify your available days (from and to).';
    if (!councilName) return 'Please enter council/registration authority name.';
    if (!councilNumber) return 'Please enter council/registration number.';
    // specialization required for doctors and dentists
    if ((role === 'doctor' || role === 'dentist') && !specialization) return 'Please select your specialization.';
    if ((role === 'doctor' || role === 'dentist') && specialization === 'Other' && !customSpecialization.trim()) return 'Please enter your specialization.';
    // certificate required for all roles
    if (!certificateFile) return role === 'doctor' || role === 'dentist' ? 'Please upload your council certificate.' : 'Please upload the government registration certificate.';
    // clinic photos required for doctors and dentists
    if ((role === 'doctor' || role === 'dentist') && !clinicPhotos) return 'Please upload clinic photos.';
    // discount validation
    if (!discountAmount) return 'Please specify the discount amount you are willing to provide.';
    if (discountItems.length === 0) return 'Please add at least one service/procedure you want to offer discount on.';
    // terms and conditions validation
    if (!acceptTerms) return 'Please accept the terms and conditions to proceed.';
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
      if (timeFrom) form.append('timeFrom', timeFrom);
      if (timeTo) form.append('timeTo', timeTo);
      if (dayFrom) form.append('dayFrom', dayFrom);
      if (dayTo) form.append('dayTo', dayTo);
      form.append('website', website);
      form.append('contactEmail', contactEmail);
      form.append('contactPhone', contactPhone);
      form.append('email', email);
      form.append('password', password);
      form.append('councilName', councilName);
      form.append('councilNumber', councilNumber);
      if ((role === 'doctor' || role === 'dentist') && specialization) {
        const finalSpecialization = specialization === 'Other' ? customSpecialization.trim() : specialization;
        form.append('specialization', finalSpecialization);
      }
      form.append('state', stateValue);
      const effDistrict = district === 'Other' ? customDistrict : (district || customDistrict);
      form.append('district', effDistrict || '');
      form.append('pincode', pincode || '');
      form.append('discountAmount', discountAmount);
      form.append('discountItems', JSON.stringify(discountItems));

      if (role === 'doctor' || role === 'dentist') {
        form.append('clinicName', clinicName);
        if (clinicPhotos) {
          Array.from(clinicPhotos).forEach((f, idx) => form.append('clinicPhotos', f, f.name));
        }
      } else {
        // center (diagnostic / pharmacy)
        form.append('centerName', centerName);
      }
      // certificate is required for centers, optional for doctors and dentists
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

      if (!hasShownSuccessMessage) {
        setDialogData({ success: true, message: 'Registration submitted successfully. Our team will review and contact you.' });
        setDialogOpen(true);
        setHasShownSuccessMessage(true);
      }
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-4 sm:py-6 md:py-8 px-3 sm:px-4">
      <div className="max-w-6xl w-full mx-auto">
        <div className="text-center mb-8 sm:mb-10 md:mb-12 px-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Partner Registration
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Join our healthcare network and expand your reach. Choose your partner type to begin the registration process.
          </p>
        </div>

        {/* Partner Criteria Section */}
        <div className="mb-8 sm:mb-10 md:mb-12 max-w-5xl mx-auto px-2">
          <Card className="border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 shadow-lg">
            <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
                  <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg sm:text-xl font-bold text-amber-800">Partner Requirements & Criteria</CardTitle>
                  <CardDescription className="text-amber-700 mt-0.5 sm:mt-1 text-xs sm:text-sm">
                    Please review these requirements before proceeding with registration
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6">
              <div className="space-y-3 sm:space-y-4">
                {/* Highlighted Dentist Requirement - Moved to Top */}
                <div className="flex items-start gap-2 sm:gap-3 p-4 sm:p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-300 shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg">
                    ⭐ FEATURED
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 shadow-md">
                    <Stethoscope className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-green-800 text-sm sm:text-lg mb-2 flex items-center gap-2">
                      <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">FREE</span>
                      Dentist Requirements
                    </h4>
                    <p className="text-green-700 text-sm sm:text-base font-semibold leading-relaxed">
                      🎁 Dentists must provide <span className="text-green-800 font-bold text-lg">FREE consultation</span> for MEDI COST SAVER members
                    </p>
                    <p className="text-green-600 text-xs sm:text-sm mt-2 font-medium">
                      Join now and attract more patients with this exclusive benefit!
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-white/60 rounded-lg border border-amber-200">
                  <Award className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-amber-800 text-xs sm:text-sm">Mandatory Discount on Total Bill</h4>
                    <p className="text-amber-700 text-xs sm:text-sm mt-1">
                      Every partner must provide some discount on the total bill for all MEDI COST SAVER members
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-white/60 rounded-lg border border-amber-200">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-amber-800 text-xs sm:text-sm">Procedure/Service Discounts</h4>
                    <p className="text-amber-700 text-xs sm:text-sm mt-1">
                      Every partner should provide discounts on some of their available procedures or services
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-white/60 rounded-lg border border-amber-200">
                  <Pill className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-amber-800 text-xs sm:text-sm">Pharmacy Requirements</h4>
                    <p className="text-amber-700 text-xs sm:text-sm mt-1">
                      Pharmacies must provide discounts on medicines and some other goods for members
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-white/60 rounded-lg border border-amber-200">
                  <Microscope className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-amber-800 text-xs sm:text-sm">Diagnostic Center Requirements</h4>
                    <p className="text-amber-700 text-xs sm:text-sm mt-1">
                      Diagnostic centers must provide some discount on some of their tests they perform
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-amber-100 rounded-lg border border-amber-300">
                <p className="text-amber-800 text-xs sm:text-sm font-medium">
                  <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 inline mr-1 sm:mr-2" />
                  All applications undergo thorough verification. Only approved partners who commit to these discount requirements will be listed on our platform.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 xl:gap-8 px-2">
          {[
            { role: 'doctor' as Role, icon: Stethoscope, title: 'Doctor', desc: 'Register as a medical practitioner and join our network' },
            { role: 'dentist' as Role, icon: Stethoscope, title: 'Dentist', desc: 'Register as a dental practitioner and join our network' },
            { role: 'diagnostic' as Role, icon: Microscope, title: 'Diagnostic Center', desc: 'Register your diagnostic facility for patient referrals' },
            { role: 'pharmacy' as Role, icon: Pill, title: 'Pharmacy', desc: 'Register your pharmacy for discounted medications' }
          ].map(({ role: roleOption, icon: Icon, title, desc }) => (
            <div
              key={roleOption}
              className="group cursor-pointer relative bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6 md:p-8 transition-all duration-300 hover:shadow-xl sm:hover:shadow-2xl hover:scale-105 hover:border-blue-300"
              onClick={() => setRole(roleOption)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 mx-auto mb-3 sm:mb-4 md:mb-6 rounded-lg sm:rounded-xl md:rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-300">
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-white" />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 text-center">{title}</h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed text-center">{desc}</p>
                <div className="mt-3 sm:mt-4 md:mt-6 text-blue-600 font-medium text-xs sm:text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-4 sm:py-6 md:py-8 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-xl sm:shadow-2xl border-0 rounded-2xl sm:rounded-3xl overflow-hidden bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white pb-4 sm:pb-6 md:pb-8 px-4 sm:px-6">
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4">
              <Button 
                variant="ghost" 
                onClick={() => setRole('')} 
                className="text-white hover:bg-white/20 rounded-full p-1 sm:p-2 transition-all duration-200"
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <div>
                <CardTitle className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">Partner Registration</CardTitle>
                <CardDescription className="text-blue-100 mt-1 sm:mt-2 text-xs sm:text-sm">
                  {role === 'doctor' ? 'Doctor' : role === 'diagnostic' ? 'Diagnostic Center' : role === 'pharmacy' ? 'Pharmacy' : 'Dentist'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-4 sm:p-5 md:p-6 lg:p-8">
            <div className="space-y-6 sm:space-y-8">
              {/* Personal Details Section */}
              <section className="space-y-4 sm:space-y-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-1.5 h-6 sm:h-8 bg-blue-600 rounded-full"></div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Personal Details</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label className="text-xs sm:text-sm font-medium text-gray-700">Full Name *</Label>
                    <Input 
                      value={personName} 
                      onChange={(e) => setPersonName(e.target.value)} 
                      placeholder="Responsible person / Doctor name"
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    />
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label className="text-xs sm:text-sm font-medium text-gray-700">Age *</Label>
                    <Input 
                      type="number" 
                      value={String(personAge || '')} 
                      onChange={(e) => setPersonAge(e.target.value ? Number(e.target.value) : '')} 
                      placeholder="Age"
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    />
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label className="text-xs sm:text-sm font-medium text-gray-700">Sex *</Label>
                    <div className="relative">
                      <select 
                        className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base appearance-none bg-white"
                        value={personSex} 
                        onChange={(e) => setPersonSex(e.target.value)}
                      >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label className="text-xs sm:text-sm font-medium text-gray-700">Date of Birth *</Label>
                    <Input 
                      type="date" 
                      value={personDOB} 
                      onChange={(e) => setPersonDOB(e.target.value)}
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    />
                  </div>
                </div>
              </section>

              {/* Business Details Section */}
              <section className="space-y-4 sm:space-y-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-1.5 h-6 sm:h-8 bg-green-600 rounded-full"></div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Business Details</h3>
                </div>
                <div className="space-y-4 sm:space-y-6">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label className="text-xs sm:text-sm font-medium text-gray-700">
                      {role === 'doctor' || role === 'dentist' ? 'Clinic Name *' : 'Center/Business Name *'}
                    </Label>
                    <Input 
                      value={role === 'doctor' || role === 'dentist' ? clinicName : centerName} 
                      onChange={(e) => role === 'doctor' || role === 'dentist' ? setClinicName(e.target.value) : setCenterName(e.target.value)} 
                      placeholder={role === 'doctor' || role === 'dentist' ? 'Clinic / Practice name' : 'Diagnostic center or pharmacy name'}
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    />
                  </div>
                  
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label className="text-xs sm:text-sm font-medium text-gray-700">Address *</Label>
                    <Input 
                      value={address} 
                      onChange={(e) => setAddress(e.target.value)} 
                      placeholder="Full address"
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                    <div className="space-y-1.5 sm:space-y-2">
                      <Label className="text-xs sm:text-sm font-medium text-gray-700">State *</Label>
                      <div className="relative">
                        <select 
                          className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base appearance-none bg-white"
                          value={stateValue} 
                          onChange={(e) => { setStateValue(e.target.value); setDistrict(''); setCustomDistrict(''); }}
                        >
                          <option value="">Select state</option>
                          {Object.keys(stateDistricts).map(s => <option key={s} value={s}>{s}</option>)}
                          <option value="Other">Other</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1.5 sm:space-y-2">
                      <Label className="text-xs sm:text-sm font-medium text-gray-700">District *</Label>
                      {districtsForSelected.length > 0 ? (
                        <div className="relative">
                          <select 
                            className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base appearance-none bg-white"
                            value={district} 
                            onChange={(e) => setDistrict(e.target.value)}
                          >
                            <option value="">Select district</option>
                            {districtsForSelected.map(d => <option key={d} value={d}>{d}</option>)}
                            <option value="Other">Other</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      ) : (
                        <Input 
                          value={customDistrict} 
                          onChange={(e) => setCustomDistrict(e.target.value)} 
                          placeholder="District"
                          className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                        />
                      )}
                    </div>
                    <div className="space-y-1.5 sm:space-y-2">
                      <Label className="text-xs sm:text-sm font-medium text-gray-700">Pincode *</Label>
                      <Input 
                        value={pincode} 
                        onChange={(e) => setPincode(e.target.value)} 
                        placeholder="Pin / ZIP code"
                        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                    <div className="space-y-1.5 sm:space-y-2">
                      <Label className="text-xs sm:text-sm font-medium text-gray-700">Available Timings *</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="relative">
                          <select
                            value={timeFrom}
                            onChange={(e) => setTimeFrom(e.target.value)}
                            className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs sm:text-sm appearance-none bg-white"
                          >
                            <option value="">From</option>
                            <option value="6:00 AM">6:00 AM</option>
                            <option value="7:00 AM">7:00 AM</option>
                            <option value="8:00 AM">8:00 AM</option>
                            <option value="9:00 AM">9:00 AM</option>
                            <option value="10:00 AM">10:00 AM</option>
                            <option value="11:00 AM">11:00 AM</option>
                            <option value="12:00 PM">12:00 PM</option>
                            <option value="1:00 PM">1:00 PM</option>
                            <option value="2:00 PM">2:00 PM</option>
                            <option value="3:00 PM">3:00 PM</option>
                            <option value="4:00 PM">4:00 PM</option>
                            <option value="5:00 PM">5:00 PM</option>
                            <option value="6:00 PM">6:00 PM</option>
                            <option value="7:00 PM">7:00 PM</option>
                            <option value="8:00 PM">8:00 PM</option>
                            <option value="9:00 PM">9:00 PM</option>
                            <option value="10:00 PM">10:00 PM</option>
                            <option value="11:00 PM">11:00 PM</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-gray-700">
                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                        <div className="relative">
                          <select
                            value={timeTo}
                            onChange={(e) => setTimeTo(e.target.value)}
                            className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs sm:text-sm appearance-none bg-white"
                          >
                            <option value="">To</option>
                            <option value="6:00 AM">6:00 AM</option>
                            <option value="7:00 AM">7:00 AM</option>
                            <option value="8:00 AM">8:00 AM</option>
                            <option value="9:00 AM">9:00 AM</option>
                            <option value="10:00 AM">10:00 AM</option>
                            <option value="11:00 AM">11:00 AM</option>
                            <option value="12:00 PM">12:00 PM</option>
                            <option value="1:00 PM">1:00 PM</option>
                            <option value="2:00 PM">2:00 PM</option>
                            <option value="3:00 PM">3:00 PM</option>
                            <option value="4:00 PM">4:00 PM</option>
                            <option value="5:00 PM">5:00 PM</option>
                            <option value="6:00 PM">6:00 PM</option>
                            <option value="7:00 PM">7:00 PM</option>
                            <option value="8:00 PM">8:00 PM</option>
                            <option value="9:00 PM">9:00 PM</option>
                            <option value="10:00 PM">10:00 PM</option>
                            <option value="11:00 PM">11:00 PM</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-gray-700">
                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1.5 sm:space-y-2">
                      <Label className="text-xs sm:text-sm font-medium text-gray-700">Available Days *</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="relative">
                          <select
                            value={dayFrom}
                            onChange={(e) => setDayFrom(e.target.value)}
                            className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs sm:text-sm appearance-none bg-white"
                          >
                            <option value="">From</option>
                            <option value="Monday">Monday</option>
                            <option value="Tuesday">Tuesday</option>
                            <option value="Wednesday">Wednesday</option>
                            <option value="Thursday">Thursday</option>
                            <option value="Friday">Friday</option>
                            <option value="Saturday">Saturday</option>
                            <option value="Sunday">Sunday</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-gray-700">
                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                        <div className="relative">
                          <select
                            value={dayTo}
                            onChange={(e) => setDayTo(e.target.value)}
                            className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs sm:text-sm appearance-none bg-white"
                          >
                            <option value="">To</option>
                            <option value="Monday">Monday</option>
                            <option value="Tuesday">Tuesday</option>
                            <option value="Wednesday">Wednesday</option>
                            <option value="Thursday">Thursday</option>
                            <option value="Friday">Friday</option>
                            <option value="Saturday">Saturday</option>
                            <option value="Sunday">Sunday</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-gray-700">
                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                    <div className="space-y-1.5 sm:space-y-2">
                      <Label className="text-xs sm:text-sm font-medium text-gray-700">Website</Label>
                      <Input 
                        value={website} 
                        onChange={(e) => setWebsite(e.target.value)} 
                        placeholder="https://"
                        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Contact & Login Section */}
              <section className="space-y-4 sm:space-y-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-1.5 h-6 sm:h-8 bg-purple-600 rounded-full"></div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Contact & Login Information</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label className="text-xs sm:text-sm font-medium text-gray-700">Contact Email *</Label>
                    <Input 
                      value={contactEmail} 
                      onChange={(e) => setContactEmail(e.target.value)} 
                      placeholder="contact@you.com"
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    />
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label className="text-xs sm:text-sm font-medium text-gray-700">Contact Phone *</Label>
                    <Input 
                      value={contactPhone} 
                      onChange={(e) => setContactPhone(e.target.value)} 
                      placeholder="Phone number"
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    />
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label className="text-xs sm:text-sm font-medium text-gray-700">Login Email *</Label>
                    <Input 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      placeholder="email@domain.com" 
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    />
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label className="text-xs sm:text-sm font-medium text-gray-700">Password *</Label>
                    <Input 
                      type="password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      placeholder="Minimum 6 characters"
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    />
                  </div>
                </div>
              </section>

              {/* Registration Details Section */}
              <section className="space-y-4 sm:space-y-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-1.5 h-6 sm:h-8 bg-orange-500 rounded-full"></div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Registration Details</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label className="text-xs sm:text-sm font-medium text-gray-700">Registering Authority / Council Name *</Label>
                    <Input 
                      value={councilName} 
                      onChange={(e) => setCouncilName(e.target.value)} 
                      placeholder="Council or authority"
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    />
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label className="text-xs sm:text-sm font-medium text-gray-700">Registration / Council Number *</Label>
                    <Input 
                      value={councilNumber} 
                      onChange={(e) => setCouncilNumber(e.target.value)} 
                      placeholder="Registration number"
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    />
                  </div>
                  {(role === 'doctor' || role === 'dentist') && (
                    <div className="space-y-1.5 sm:space-y-2 sm:col-span-2">
                      <Label className="text-xs sm:text-sm font-medium text-gray-700">Specialization *</Label>
                      <div className="relative">
                        <select
                          value={specialization}
                          onChange={(e) => {
                            setSpecialization(e.target.value);
                            if (e.target.value !== 'Other') {
                              setCustomSpecialization('');
                            }
                          }}
                          className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base appearance-none bg-white"
                        >
                          <option value="">Select specialization</option>
                          {role === 'doctor' ? (
                            <>
                              <option value="General Medicine">General Medicine</option>
                              <option value="Cardiology">Cardiology</option>
                              <option value="Neurology">Neurology</option>
                              <option value="Orthopedics">Orthopedics</option>
                              <option value="Dermatology">Dermatology</option>
                              <option value="Gynecology">Gynecology</option>
                              <option value="Pediatrics">Pediatrics</option>
                              <option value="Ophthalmology">Ophthalmology</option>
                              <option value="ENT">ENT (Ear, Nose, Throat)</option>
                              <option value="Psychiatry">Psychiatry</option>
                              <option value="Radiology">Radiology</option>
                              <option value="Urology">Urology</option>
                              <option value="Nephrology">Nephrology</option>
                              <option value="Oncology">Oncology</option>
                              <option value="Endocrinology">Endocrinology</option>
                              <option value="Gastroenterology">Gastroenterology</option>
                              <option value="Pulmonology">Pulmonology</option>
                              <option value="Rheumatology">Rheumatology</option>
                              <option value="Other">Other</option>
                            </>
                          ) : (
                            <>
                              <option value="General Dentistry">General Dentistry</option>
                              <option value="Orthodontics">Orthodontics</option>
                              <option value="Oral Surgery">Oral Surgery</option>
                              <option value="Periodontics">Periodontics</option>
                              <option value="Endodontics">Endodontics</option>
                              <option value="Prosthodontics">Prosthodontics</option>
                              <option value="Pediatric Dentistry">Pediatric Dentistry</option>
                              <option value="Oral Pathology">Oral Pathology</option>
                              <option value="Oral Medicine">Oral Medicine</option>
                              <option value="Other">Other</option>
                            </>
                          )}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      {specialization === 'Other' && (
                        <Input
                          value={customSpecialization}
                          onChange={(e) => setCustomSpecialization(e.target.value)}
                          placeholder="Enter your specialization"
                          className="mt-2 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                        />
                      )}
                    </div>
                  )}
                </div>
              </section>

              {/* File Uploads Section */}
              <section className="space-y-4 sm:space-y-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-1.5 h-6 sm:h-8 bg-red-500 rounded-full"></div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Document Uploads</h3>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:gap-5 md:gap-6">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="space-y-1.5 sm:space-y-2">
                      <Label className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-1.5 sm:gap-2">
                        {role === 'doctor' || role === 'dentist' ? 'Council Certificate (Required)' : 'Government Registration Certificate (Required)'}
                        {certificateFile && <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />}
                      </Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 sm:p-4 md:p-6 text-center transition-all duration-200 hover:border-blue-400 hover:bg-blue-50/50 relative">
                        <Upload className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-gray-400 mx-auto mb-1.5 sm:mb-2" />
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          onChange={(e) => setCertificateFile(e.target.files?.[0] || null)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <p className="text-xs sm:text-sm text-gray-600 relative z-0">
                          {certificateFile ? certificateFile.name : 'Click to upload certificate'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {(role === 'doctor' || role === 'dentist') && (
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-1.5 sm:gap-2">
                      Clinic Photos (Required - you may upload multiple)
                      {clinicPhotos && <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />}
                    </Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 sm:p-4 md:p-6 text-center transition-all duration-200 hover:border-blue-400 hover:bg-blue-50/50 relative">
                      <Upload className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-gray-400 mx-auto mb-1.5 sm:mb-2" />
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => setClinicPhotos(e.target.files)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <p className="text-xs sm:text-sm text-gray-600 relative z-0">
                        {clinicPhotos ? `${clinicPhotos.length} files selected` : 'Click to upload clinic photos'}
                      </p>
                    </div>
                  </div>
                )}
              </section>

              {/* Discount Information Section */}
              <section className="space-y-4 sm:space-y-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-1.5 h-6 sm:h-8 bg-green-600 rounded-full"></div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Discount Information</h3>
                </div>
                <div className="space-y-4 sm:space-y-6">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label className="text-xs sm:text-sm font-medium text-gray-700">Discount Amount *</Label>
                    <Input 
                      value={discountAmount} 
                      onChange={(e) => setDiscountAmount(e.target.value)} 
                      placeholder="e.g., 10% off, ₹500 off, etc."
                      className="transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                    />
                    <p className="text-xs text-gray-500">Specify the discount you are willing to provide to MEDI COST SAVER members</p>
                  </div>
                  
                  <div className="space-y-3 sm:space-y-4">
                    <Label className="text-xs sm:text-sm font-medium text-gray-700">Services/Procedures for Discount *</Label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Input 
                        value={currentDiscountItem} 
                        onChange={(e) => setCurrentDiscountItem(e.target.value)} 
                        placeholder="e.g., Consultation, Blood Test, X-Ray, etc."
                        className="transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base flex-1"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (currentDiscountItem.trim()) {
                              setDiscountItems([...discountItems, currentDiscountItem.trim()]);
                              setCurrentDiscountItem("");
                            }
                          }
                        }}
                      />
                      <Button 
                        type="button"
                        onClick={() => {
                          if (currentDiscountItem.trim()) {
                            setDiscountItems([...discountItems, currentDiscountItem.trim()]);
                            setCurrentDiscountItem("");
                          }
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 text-sm"
                      >
                        Add
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">Add services/procedures you want to offer discount on. Press Enter or click Add to include them.</p>
                    
                    {discountItems.length > 0 && (
                      <div className="space-y-1.5 sm:space-y-2">
                        <Label className="text-xs sm:text-sm font-medium text-gray-700">Added Services:</Label>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {discountItems.map((item, index) => (
                            <Badge 
                              key={index} 
                              variant="secondary" 
                              className="flex items-center gap-1 sm:gap-2 bg-green-100 text-green-800 hover:bg-green-200 px-2 sm:px-3 py-0.5 sm:py-1 text-xs"
                            >
                              {item}
                              <button
                                type="button"
                                onClick={() => {
                                  setDiscountItems(discountItems.filter((_, i) => i !== index));
                                }}
                                className="ml-0.5 sm:ml-1 text-green-600 hover:text-red-600 transition-colors text-xs"
                              >
                                ×
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Terms and Conditions */}
              <section className="space-y-3 sm:space-y-4">
                <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <Checkbox
                    id="terms"
                    checked={acceptTerms}
                    onCheckedChange={(checked) => {
                      setAcceptTerms(checked as boolean);
                      if (checked) {
                        setTermsDialogOpen(true);
                        setHasScrolledToBottom(false);
                      }
                    }}
                    className="mt-0.5 sm:mt-1"
                  />
                  <div className="flex-1">
                    <Label htmlFor="terms" className="text-xs sm:text-sm text-gray-700 cursor-pointer">
                      I accept the{' '}
                      <button
                        type="button"
                        onClick={() => setTermsDialogOpen(true)}
                        className="text-blue-600 hover:text-blue-700 underline font-medium"
                      >
                        Terms and Conditions
                      </button>
                    </Label>
                  </div>
                </div>
              </section>

              {/* Status and Actions */}
              {statusMessage && (
                <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">{statusMessage}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-200">
                <Button 
                  onClick={handleSubmit} 
                  disabled={loading || !acceptTerms}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {loading ? (
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs sm:text-sm">Submitting Registration...</span>
                    </div>
                  ) : (
                    'Submit Registration'
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => { resetForm(); setStatusMessage(null); }}
                  className="py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-200 hover:bg-gray-50 hover:shadow-md text-sm sm:text-base"
                >
                  Reset Form
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="rounded-xl sm:rounded-2xl max-w-xs sm:max-w-md mx-2 sm:mx-auto">
            <DialogHeader className="text-center">
              <div className={`mx-auto mb-3 sm:mb-4 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full ${dialogData?.success ? 'bg-green-100' : 'bg-red-100'}`}>
                {dialogData?.success ? (
                  <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
                )}
              </div>
              <DialogTitle className={`text-base sm:text-lg ${dialogData?.success ? 'text-green-600' : 'text-red-600'}`}>
                {dialogData?.success ? 'Registration Submitted' : 'Submission Error'}
              </DialogTitle>
              <DialogDescription className="text-gray-600 text-xs sm:text-sm">
                {dialogData?.message}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button 
                className={`w-full rounded-lg sm:rounded-xl text-sm sm:text-base ${dialogData?.success ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
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

      {/* Terms and Conditions Dialog */}
      <Dialog open={termsDialogOpen} onOpenChange={setTermsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl font-bold text-gray-900">
              Terms and Conditions
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              Please read all terms and conditions carefully before accepting.
            </DialogDescription>
          </DialogHeader>
          
          <div 
            className="flex-1 overflow-y-auto max-h-96 p-4 border rounded-lg bg-gray-50 text-sm leading-relaxed"
            onScroll={(e) => {
              const element = e.currentTarget;
              const isAtBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 10;
              setHasScrolledToBottom(isAtBottom);
            }}
          >
            <div className="space-y-4 text-gray-800">
              <h2 className="text-xl font-bold text-center mb-6">ADDITIONAL TERMS OF USE FOR MCPs</h2>

              <div className="space-y-4">
                <p>These terms and conditions specific to MCPs ("MCP Terms") form a legally binding agreement between MEDICOSTSAVER, india ("We" or "Us" or Our or "MEDICOSTSAVER" or "Company"), having its registered office Hyderabad, india and You ("You" or "Your"), as an MCP User of Our Website, System and Services.</p>

                <p>You and We are hereinafter collectively referred to as the "Parties".</p>

                <p>By clicking "sign up" or "start my free trial" or "get started for free" or the 'I accept' tab at the time of registration, or by entering into an agreement with MEDICOSTSAVER to provide committed services as set out in these MCP Terms, or through the continued use of the System and/or Services, or by Accessing the System and/or Services through any medium, including but not limited to accessing the System through mobile phones, smart phones and tablets, You agree to be subject to these MCP Terms.</p>

                <p>We request You to please read these MCP Terms carefully and do not click "sign up" or "start my free trial" or "get started for free" "I accept" or continue the use of the Website, System and Service unless You agree fully with these MCP Terms.</p>

                <p>These MCP Terms are in addition to the Terms of Use of the Website available at <a href="https://www.medicostsaver.com/terms" className="text-blue-600 underline">https://www.medicostsaver.com/terms</a>, the Privacy Policy <a href="https://www.medicostsaver.com/privacy" className="text-blue-600 underline">https://www.medicostsaver.com/privacy</a> and any other policy which may govern the use of the Website, System and Services (referred to as the "Other Terms" and collectively with the MCP Terms referred to as "Agreement")</p>
              </div>

              <h3 className="font-bold text-lg mt-6 mb-4">1. Definitions</h3>
              <p className="mb-3">As used in these MCP Terms, the following terms shall have the meaning set forth below:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>"Account"</strong> means credit or debit balance maintained by You with the Website;</li>
                <li><strong>"Effective Date"</strong> means the Date on which You accept these MCP Terms by clicking 'Sign Up' or "start my free trial" or "get started for free" or 'I Accept';</li>
                <li><strong>"User Information"</strong> means information regarding Registered Users/Members which includes personal and medical information and any other information which may be provided by a Registered Users/Members to You or may be transferred to You by MEDICOSTSAVER;</li>
                <li><strong>"Services"</strong> means the services offered to You by MEDICOSTSAVER that involves use of the System, which may include the practice management service, electronic medical records service and other services as may be introduced by MEDICOSTSAVER from time to time;</li>
                <li><strong>"Website"</strong> means www.medicostsaver.com</li>
                <li><strong>"System"</strong> means the technology platform provided as part of the Website consisting of hardware and / or software used or provided by Us for the purpose of providing the Services to You;</li>
              </ul>
              <p className="mt-3">All other capitalized terms shall have the meaning ascribed to them in the Other Terms.</p>

              <h3 className="font-bold text-lg mt-6 mb-4">2. Grant of Rights</h3>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold">(i)</p>
                  <p className="ml-4">Subject to the terms of the Agreement, we grant to You and You accept a non-exclusive, personal, non-transferable, limited right to have access to and to use the System for the duration of Your engagement with Us.</p>
                  <p className="ml-4 mt-2">The aforementioned right does not extend to:</p>
                  <ul className="list-disc list-inside space-y-1 ml-8">
                    <li>use the System for time-sharing, rental or service bureau purposes;</li>
                    <li>make the System, in whole or in part, available to any other person, entity or business;</li>
                    <li>modify the contents of the Systems and the Website or use such content for any commercial purpose, or any public display, performance, sale or rental other than envisaged in the Agreement;</li>
                    <li>copy, reverse engineer, decompile or disassemble the System or the Website, in whole or in part, or otherwise attempt to discover the source code to the software used in the System; or</li>
                    <li>modify the System or associated software or combine the System with any other software or services not provided or approved by Us.</li>
                  </ul>
                  <p className="ml-4 mt-2">You will obtain no rights to the System except for the limited rights to use the System expressly granted by these MCP Terms.</p>
                </div>

                <div>
                  <p className="font-semibold">(ii)</p>
                  <p className="ml-4">The System/Website may links or references which direct you to third party websites / applications / content or service providers, including advertisers and e-commerce websites (collectively referred to as "Third Party Websites"). Links to such Third Party Websites are provided for your convenience only. Please exercise your independent judgment and prudence when visiting / using any Third Party Websites via a link available on the System / Website. Should You decide to click on the links to visit such Third Party Website, You do so of Your own volition. Your usage of such Third Party Websites and all content available on such Third Party Websites is subject to the terms of use of the respective Third Party Website and we are not responsible for Your use of any Third Party Websites</p>
                </div>
              </div>

              <h3 className="font-bold text-lg mt-6 mb-4">3. Implementation Requirements</h3>
              <p>By accepting these MCP Terms, You agree that:</p>
              <div className="ml-4">
                <p className="font-semibold">(i)</p>
                <p className="ml-4">You will acquire, install, configure and maintain all hardware, software and communications systems necessary to access the System ("Implementation") and receive the Services. To the extent possible, such an assessment should be done before making advance payment for the Service. Your Implementation will comply with the specifications from time to time established by Us. You will ensure that Your Implementation is compatible with the System and Services. If We notify You that Your Implementation is incompatible with the System and / or Services, You will rectify such incompatibility, and We will have the right to suspend Services to You until such rectification has been implemented. Under no circumstances will You be eligible for any refund or any financial assistance in relation to Implementation.</p>
              </div>

              <h3 className="font-bold text-lg mt-6 mb-4">4. Engagement of MCPs by MEDICOSTSAVER</h3>
              <div className="ml-4">
                <p className="font-semibold">(i)</p>
                <p className="ml-4">In certain cases, You and MEDICOSTSAVER may agree that You will commit to providing information and responses on the Website for a specific period of time (such as a specific number of hours per day / week/ month). In such a case, while all the terms of the Agreement will continue to apply to You, there may be some additional terms which will apply to You which will be agreed between You and MEDICOSTSAVER.</p>
              </div>

              <h3 className="font-bold text-lg mt-6 mb-4">5. Access to the System and Use of Services</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold">(i) Verification.</p>
                  <p className="ml-4">You agree that Your receipt of Services is subject to verification by Us of Your identity and credentials as a health care practitioner and to Your ongoing qualification as such. As part of the registration process and at any time thereafter, You may be required to provide Us with various information such as Your Photo Id, Your medical registration details (as recognized by your Medical Council), Your qualifications and other information in order to prove that You are a valid health care practitioner in the field that You claim ("Credential Information"). We may verify such Credential Information or may ask You for additional information. We may also make enquiries from third parties to verify the authenticity of Your Credential Information. You authorize Us to make such enquiries from such third parties, and You agree to hold them and Us harmless from any claim or liability arising from the request for or disclosure of such information. You agree that We may terminate Your access to or use of the System and Services at any time if We are unable at any time to determine or verify Your Credential Information. We reserve the right to carry out re-verification of Credential Information as and when required, and the above rights and commitments will extend to re-verification as well.</p>
                </div>

                <div>
                  <p className="font-semibold">(ii) Safeguards.</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>You will implement and maintain appropriate administrative, physical and technical safeguards to protect the System from access, use or alteration; and You will always use the User ID assigned to You.</li>
                    <li>You will immediately notify Us of any breach or suspected breach of the security of the System of which You become aware, or any unauthorized use or disclosure of information within or obtained from the System, and You will take such action to mitigate the breach or suspected breach as We may direct, and will cooperate with Us in investigating and mitigating such breach.</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold">(iii) No Third-Party Access.</p>
                  <p className="ml-4">You will not permit any third party to have access to the System or to use the System or the Services without Our prior written consent. You will not allow any third party to access the System or provide information to Registered Users/ Non-Registered Users on the Website. You will promptly notify Us of any order or demand for compulsory disclosure of health information if the disclosure requires access to or use of the System or Services.</p>
                </div>
              </div>

              <h3 className="font-bold text-lg mt-6 mb-4">6. Compliance</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold">(i)</p>
                  <p className="ml-4">You are solely responsible for ensuring that Your use of the System and the Services complies with applicable law. You will also ensure that Your use of the System, the Website and the Services in always in accordance with the terms of the Agreement. You will not undertake or permit any unlawful use of the System or Services, or take any action that would render the operation or use of the System or Services by us.</p>
                </div>

                <div>
                  <p className="font-semibold">(ii)</p>
                  <p className="ml-4">Without limiting the generality of the foregoing, You represent that You shall not use the System in violation of any applicable laws including Medical Ethics Regulations or any other code of conduct governed by your council. Notwithstanding the generality of the foregoing, You shall not use the System to:</p>
                  <ul className="list-disc list-inside space-y-1 ml-8">
                    <li>Interact with a Registered Users at the time of medical emergencies.</li>
                    <li>Discriminate in any way between appointments booked in the ordinary course and appointments booked through MEDICOSTSAVER.</li>
                    <li>Boast of cases, operations, cures or remedies through System, Services or Website.</li>
                    <li>Directly or indirectly solicit Registered Users for consultation.</li>
                    <li>Claim to be a specialist, through System, Services or Website, unless You have a special qualification in that branch.</li>
                    <li>Give any positive assertion or representation regarding the risk-free nature of communicating over online media.</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold">(iii)</p>
                  <p className="ml-4">You shall keep Your Credential Information updated and will inform Us immediately should any portion of Your Credential Information be revoked, is cancelled or expires.</p>
                </div>
              </div>

              <h3 className="font-bold text-lg mt-6 mb-4">7. User Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold">(i)</p>
                  <p className="ml-4">You hereby acknowledge that You may get access to User Information including identifiable health related information.</p>
                </div>

                <div>
                  <p className="font-semibold">(ii)</p>
                  <p className="ml-4">You represent and warrant that You will, at all times during the use of the Services and thereafter, comply with all laws directly or indirectly applicable to You that may now or hereafter govern the collection, use, transmission, processing, receipt, reporting, disclosure, maintenance, and storage of User Information, including but not limited to the Information Technology Act, 2000 and The Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011 made thereunder.</p>
                </div>

                <div>
                  <p className="font-semibold">(iii)</p>
                  <p className="ml-4">Notwithstanding the generality of the aforementioned provision:</p>
                  <ul className="list-disc list-inside space-y-2 ml-8">
                    <li>You acknowledge that You have read, understood and agree to comply with MEDICOSTSAVER's Privacy Policy available at <a href="https://www.medicostsaver.com/privacy" className="text-blue-600 underline">https://www.medicostsaver.com/privacy</a> when dealing with User Information.</li>
                    <li>You represent and warrant that You will not use the User Information of Registered Users and Non-Registered Users for any other purpose than for providing information to such Registered Users and Non-Registered Users and /or fixing appointments with the Registered Users.</li>
                  </ul>
                </div>
              </div>

              <h3 className="font-bold text-lg mt-6 mb-4">8. Cooperation</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold">(i)</p>
                  <p className="ml-4">You will cooperate with Us in the administration of the System, including providing reasonable assistance in evaluating the System and collecting and reporting data requested by Us for the purposes of administering the System.</p>
                </div>

                <div>
                  <p className="font-semibold">(ii)</p>
                  <p className="ml-4">We may provide Your reference to other potential users of the system as a referral to Our Services. In case You would not like to be contacted by potential users, You can send Us an email at <a href="mailto:medicostsaver@gmail.com" className="text-blue-600 underline">medicostsaver@gmail.com</a> regarding the same. We shall cease providing Your reference to potential users within 48 hours of receipt of such written request.</p>
                </div>
              </div>

              <h3 className="font-bold text-lg mt-6 mb-4">9. Providing Physician Data</h3>
              <p>You agree that We may provide de-identified health information and other information including Your personal information and information concerning Your practice to any medical group, independent practice associations, health plan or other organization including any organization with which You have a contract to provide medical services, or to whose members or enrollees You provide dental services. Such information may identify You, but will not identify any individual to whom You provide services. Such information may include (without limitation) aggregate data concerning Your patients, diagnoses, procedures, orders etc.</p>

              <h3 className="font-bold text-lg mt-6 mb-4">10. Intellectual Property Rights</h3>
              <p>All intellectual property rights in and title to the System, the present or future modifications / upgradations thereof and standard enhancements thereto shall remain the property of MEDICOSTSAVER and its licensors. These MCP Terms or the Agreement do not and shall not transfer any ownership or proprietary interest in the System from MEDICOSTSAVER to You, except as may be otherwise expressly provided in these MCP Terms or as may be agreed to by and between MEDICOSTSAVER and You.</p>

              <h3 className="font-bold text-lg mt-6 mb-4">11. Fees and Charges</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>You understand that MEDICOSTSAVER provides various Services to its members for free with minimal fees and you agreed to provide those services for free.</li>
                <li>we wont charge any fees from MCPS for joining as a Provider.</li>
                <li>You are responsible for any charges you collect it from Users outside the platform (website)</li>
              </ul>

              <h3 className="font-bold text-lg mt-6 mb-4">12. Confidential Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold">(a)</p>
                  <p className="ml-4">You will treat all information received from Us as confidential. You may not disclose Our confidential information to any other person, and You may not use any confidential information except as provided herein. Except as otherwise provided in MCP Terms and Other Terms, You may not, without Our prior written consent, at any time, during or after the applicability of these MCP Terms, directly or indirectly, divulge or disclose confidential information for any purpose or use confidential information for Your own benefit or for the purposes or benefit of any other person. You agree to hold all confidential information in strict confidence and to take all measures necessary to prevent unauthorized copying, use, or disclosure of confidential information, and to keep the confidential information from being disclosed into the public domain or into the possession of persons not bound to maintain confidentiality. You will disclose confidential information only to your employees, agents or contractors who have a need to use it for the purposes permitted under the MCP Terms and Other Terms only. You will inform all such recipients of the confidential nature of confidential information and will instruct them to deal with confidential information in accordance with these MCP Terms. You will promptly notify Us in writing of any improper disclosure, misappropriation, or misuse of the confidential information by any person, which may come to Your attention.</p>
                </div>

                <div>
                  <p className="font-semibold">(b)</p>
                  <p className="ml-4">You agree that We will suffer irreparable harm if You fail to comply with the obligations set forth in this Section 12, and You further agree that monetary damages will be inadequate to compensate Us for any such breach. Accordingly, You agree that We will, in addition to any other remedies available to Us at law or in equity, be entitled to seek injunctive relief to enforce the provisions hereof, immediately and without the necessity of posting a bond.</p>
                </div>

                <div>
                  <p className="font-semibold">(c)</p>
                  <p className="ml-4">This Section 12 will survive the termination or expiration of these MCP Terms or Agreement for any reason.</p>
                </div>
              </div>

              <h3 className="font-bold text-lg mt-6 mb-4">13. Disclaimer and Exclusion of Warranties</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold">(a)</p>
                  <p className="ml-4">You acknowledge that access to the system will be provided over various facilities and communication lines, and information will be transmitted over local exchange and internet backbone carrier lines and through routers, switches, and other devices (collectively, "carrier lines") owned, maintained, and serviced by third-party carriers, utilities, and internet service providers, all of which are beyond our control. we assume no liability for or relating to the integrity, privacy, security, confidentiality, or use of any information while it is transmitted on the carrier lines, or any delay, failure, interruption, interception, loss, transmission, or corruption of any data or other information attributable to transmission on the carrier lines. use of the carrier lines is solely at your risk and is subject to all applicable local, state, national, and international laws.</p>
                </div>

                <div>
                  <p className="font-semibold">(b)</p>
                  <p className="ml-4">The services, the website the system, access to the system and the information contained on the system is provided "as is" and "as available" basis without any warranty of any kind, expressed or implied, including but not limited to the implied warranties of merchantability, fitness for a particular purpose, and non-infringement. you are solely responsible for any and all acts or omissions taken or made in reliance on the system or the information in the system, including inaccurate or incomplete information. it is expressly agreed that in no event shall we be liable for any special, indirect, consequential, remote or exemplary damages, including but not limited to, loss of profits or revenues, loss of use, or loss of information or data, whether a claim for any such liability or damages is premised upon breach of contract, breach of warranty, negligence, strict liability, or any other theory of liability, even if we have been apprised of the possibility or likelihood of such damages occurring. we disclaim any and all liability for erroneous transmissions and loss of service resulting from communication failures by telecommunication service providers or the system.</p>
                </div>

                <div>
                  <p className="font-semibold">(c)</p>
                  <p className="ml-4">You acknowledge that other users have access to the system and are receiving our services. such other users have committed to comply with these terms & conditions and our policies and procedures concerning use of the system; however, the actions of such other users are beyond our control. accordingly, we do not assume any liability for or relating to any impairment of the privacy, security, confidentiality, integrity, availability, or restricted use of any information on the system resulting from any users' actions or failures to act.</p>
                </div>

                <div>
                  <p className="font-semibold">(d)</p>
                  <p className="ml-4">We are not responsible for unauthorized access to your, data, facilities or equipment by individuals or entities using the system or for unauthorized access to, alteration, theft. corruption, loss or destruction of your, data files, programs, procedures, or information through the system, whether by accident, fraudulent means or devices, or any other means. you are solely responsible for validating the accuracy of all output and reports, and for protecting your data and programs from loss by implementing appropriate security measures, including routine backup procedures. you hereby waive any damages occasioned by lost or corrupt data, incorrect reports, or incorrect data files resulting from programming error, operator error, equipment or software malfunction, security violations, or the use of third-party software. we are not responsible for the content of any information transmitted or received through our provision of the services.</p>
                </div>

                <div>
                  <p className="font-semibold">(e)</p>
                  <p className="ml-4">We expressly disclaim any liability for the consequences to you arising because of your use of the system or the services.</p>
                </div>

                <div>
                  <p className="font-semibold">(f)</p>
                  <p className="ml-4">We do not warrant that your use of the system and the services under these terms will not violate any law or regulation applicable to you.</p>
                </div>
              </div>

              <h3 className="font-bold text-lg mt-6 mb-4">14. Limitation Of Liability</h3>
              <p>Notwithstanding the other Terms of these MCP terms, in the event Medicostsaver should have any liability to you or any third party for any loss, harm or damage, you and Medicostsaver agree that such liability shall under no circumstances exceed the value of any fees received by Medicostsaver from you in the preceding twelve months or inr 5000 whichever is lower. you and Medicostsaver agree that the foregoing limitation of liability is an agreed allocation of risk between you and Medicostsaver. you acknowledge that without your assent to this section 14, Medicostsaver would not provide access to the system, to you.</p>

              <h3 className="font-bold text-lg mt-6 mb-4">15. Indemnification</h3>
              <p>You agree to indemnify, defend, and hold harmless MEDICOSTSAVER, Our and their affiliates, officers, directors, and agents, from and against any claim, cost or liability, including reasonable attorneys' fees, arising out of: (a) the use of the Services; (b) any breach by You of any representations, warranties or agreements contained in these MCP Terms; (c) the actions of any person gaining access to the System under a User ID assigned to You; (d) the actions of anyone using a User ID, password or other unique identifier assigned to You that adversely affects the System or any information accessed through the System;</p>

              <h3 className="font-bold text-lg mt-6 mb-4">16. Termination; Modification; Suspension; Termination</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold">(a)</p>
                  <p className="ml-4">We or You may terminate our Services at any time without cause upon thirty (30) days prior written notice to You.</p>
                </div>

                <div>
                  <p className="font-semibold">(b)</p>
                  <p className="ml-4">We may update or change the Services and/or the MCP Terms and/ or the Service Fee set forth in these MCP Terms from time to time and recommend that You review these MCP Terms on a regular basis. You understand and agree that Your continued use of the Services after the MCP Terms has been updated or changed constitutes Your acceptance of the revised MCP Terms. Without limiting the foregoing, if We make a change to these MCP Terms that materially affects Your use of the Services, We may post notice on the Website or notify You via email of any such change.</p>
                </div>

                <div>
                  <p className="font-semibold">(c)</p>
                  <p className="ml-4">Termination, Suspension or Amendment as a result of applicable laws - Notwithstanding anything to the contrary in these MCP Terms, We have the right, on providing notice to You, immediately to terminate, suspend, or amend the provision of the Services without liability: (a) to comply with any order issued or proposed to be issued by any governmental agency; (b) to comply with any provision of law, any standard of participation in any reimbursement program, or any accreditation standard; or (c) if performance of any term of these MCP Terms by either Party would cause it to be in violation of law.</p>
                </div>

                <div>
                  <p className="font-semibold">(d)</p>
                  <p className="ml-4">We may terminate the provision of Services to You through the System immediately upon notice to You: (i) if You are named as a defendant in a criminal proceeding for a violation of federal or state law; (ii) if a finding or stipulation is made or entered into that You have violated any standard or requirement of federal or state law relating to the privacy or security of health information is made in any administrative or civil proceeding; or (iii) You cease to be qualified to provide services as a health care professional, or We are unable to verify Your qualifications as notified to Us under these MCP Terms.</p>
                </div>

                <div>
                  <p className="font-semibold">(e)</p>
                  <p className="ml-4">We may suspend Your Services immediately pending Your cure of any breach of these MCP Terms, or in the event We determine in Our sole discretion that access to or use of the System by You may jeopardize the System or the confidentiality, privacy, security, integrity or availability of information within the System, or that You have violated or may violate these MCP Terms or Other Terms, or has jeopardized or may jeopardize the rights of any third party, or that any person is or may be making unauthorized use of the System with any User ID assigned to You. Our election to suspend the Services shall not waive or affect Our rights to terminate these MCP Terms as applicable to You as permitted under these MCP Terms.</p>
                </div>

                <div>
                  <p className="font-semibold">(f)</p>
                  <p className="ml-4">Upon termination, You will cease to use the System and We will terminate Your access to the System. Upon termination for any reason, You will remove all software provided under MCP Terms from Your computer systems, You will cease to have access to the System, and You will return to Us all hardware, software and documentation provided by or on behalf of Us.</p>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => {
                setTermsDialogOpen(false);
                setAcceptTerms(false);
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={() => {
                setTermsDialogOpen(false);
                setAcceptTerms(true);
              }}
              disabled={!hasScrolledToBottom}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              I Accept Terms
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PartnerRegister;
