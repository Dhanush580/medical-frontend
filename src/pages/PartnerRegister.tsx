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
    setPassportPhoto(null);
    setCertificateFile(null);
    setClinicPhotos(null);
    setPincode("");
    setDiscountAmount("");
    setDiscountItems([]);
    setCurrentDiscountItem("");
  };

  const validate = () => {
    // basic required checks per role
    if (!role) return 'Please select a partner type (Doctor / Dentist / Diagnostic / Pharmacy).';
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
    // specialization required for doctors and dentists
    if ((role === 'doctor' || role === 'dentist') && !specialization) return 'Please select your specialization.';
    if ((role === 'doctor' || role === 'dentist') && specialization === 'Other' && !customSpecialization.trim()) return 'Please enter your specialization.';
    // doctor and dentist specific file checks
    if ((role === 'doctor' || role === 'dentist') && !passportPhoto) return 'Please upload passport photo for the practitioner.';
    // centers require certificate
    if ((role === 'diagnostic' || role === 'pharmacy') && !certificateFile) return 'Please upload the government registration certificate.';
    // discount validation
    if (!discountAmount) return 'Please specify the discount amount you are willing to provide.';
    if (discountItems.length === 0) return 'Please add at least one service/procedure you want to offer discount on.';
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
      // passportPhoto is optional for all roles but can be uploaded
      if (passportPhoto) form.append('passportPhoto', passportPhoto, passportPhoto.name);
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
                  <Stethoscope className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-amber-800 text-xs sm:text-sm">Dentist Requirements</h4>
                    <p className="text-amber-700 text-xs sm:text-sm mt-1">
                      Dentists must provide free consultation for MEDI COST SAVER members
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
                    <Label className="text-xs sm:text-sm font-medium text-gray-700">Age</Label>
                    <Input 
                      type="number" 
                      value={String(personAge || '')} 
                      onChange={(e) => setPersonAge(e.target.value ? Number(e.target.value) : '')} 
                      placeholder="Age"
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    />
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label className="text-xs sm:text-sm font-medium text-gray-700">Sex</Label>
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
                    <Label className="text-xs sm:text-sm font-medium text-gray-700">Date of Birth</Label>
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
                      <Label className="text-xs sm:text-sm font-medium text-gray-700">Available Timings</Label>
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
                      <Label className="text-xs sm:text-sm font-medium text-gray-700">Available Days</Label>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="space-y-1.5 sm:space-y-2">
                      <Label className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-1.5 sm:gap-2">
                        Passport Photo {role === 'doctor' || role === 'dentist' ? '(Required)' : '(Optional)'}
                        {passportPhoto && <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />}
                      </Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 sm:p-4 md:p-6 text-center transition-all duration-200 hover:border-blue-400 hover:bg-blue-50/50 relative">
                        <Upload className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-gray-400 mx-auto mb-1.5 sm:mb-2" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setPassportPhoto(e.target.files?.[0] || null)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <p className="text-xs sm:text-sm text-gray-600 relative z-0">
                          {passportPhoto ? passportPhoto.name : 'Click to upload passport photo'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 sm:space-y-4">
                    <div className="space-y-1.5 sm:space-y-2">
                      <Label className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-1.5 sm:gap-2">
                        {role === 'doctor' || role === 'dentist' ? 'Council Certificate (Optional)' : 'Government Registration Certificate (Required)'}
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
                      Clinic Photos (Optional - you may upload multiple)
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
                  disabled={loading}
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
    </>
  );
};

export default PartnerRegister;
