import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Heart, Users, Building2, CreditCard, TrendingUp, Calendar, Stethoscope, Pill, Microscope, CheckCircle, XCircle, Search, History, UserCheck, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { apiUrl } from "@/lib/api";

const PartnerDashboard = () => {
  const navigate = useNavigate();
  const [partner, setPartner] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState("verify-membership");
  const [membershipId, setMembershipId] = React.useState('');
  const [verificationResult, setVerificationResult] = React.useState<any>(null);
  const [verifying, setVerifying] = React.useState(false);
  const [recordingVisit, setRecordingVisit] = React.useState(false);
  const [stats, setStats] = React.useState({
    membersServed: 0,
    monthlyVisits: 0,
    totalRevenue: 0,
    averageDiscount: '12.5%'
  });

  // Mock data for recent visits - replace with actual API call
  const [recentVisits, setRecentVisits] = React.useState([
    { id: 1, memberName: "Rajesh Kumar", service: "Blood Test", discount: "15%", date: "Today", amount: "₹1,500" },
    { id: 2, memberName: "Priya Sharma", service: "Consultation", discount: "10%", date: "Yesterday", amount: "₹800" },
    { id: 3, memberName: "Amit Singh", service: "Medicine Purchase", discount: "10%", date: "2 days ago", amount: "₹2,300" },
    { id: 4, memberName: "Sneha Patel", service: "X-Ray", discount: "15%", date: "3 days ago", amount: "₹1,200" },
    { id: 5, memberName: "Rahul Verma", service: "Health Checkup", discount: "12%", date: "4 days ago", amount: "₹3,500" }
  ]);

  React.useEffect(() => {
    const token = localStorage.getItem('partnerToken');
    if (!token) {
      navigate('/partner/login');
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      setPartner({
        id: payload.id,
        email: payload.email,
        type: payload.type,
        name: 'Partner'
      });
    } catch (e) {
      localStorage.removeItem('partnerToken');
      navigate('/partner/login');
      return;
    }

    setLoading(false);
  }, [navigate]);

  const loadPartnerStats = async () => {
    const token = localStorage.getItem('partnerToken');
    if (!token) return;

    try {
      const response = await fetch(apiUrl('api/partners/partner-stats'), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to load partner stats:', error);
    }
  };

  React.useEffect(() => {
    if (partner) {
      loadPartnerStats();
    }
  }, [partner]);

  const handleLogout = () => {
    localStorage.removeItem('partnerToken');
    navigate('/partner/login');
  };

  const handleVerifyMembership = async () => {
    if (!membershipId.trim()) return;

    setVerifying(true);
    setVerificationResult(null);

    try {
      const response = await fetch(apiUrl('api/partners/verify'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ membershipId: membershipId.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setVerificationResult({ success: true, member: data.member });
      } else {
        setVerificationResult({ success: false, message: data.message || 'Verification failed' });
      }
    } catch (error) {
      setVerificationResult({ success: false, message: 'Network error. Please try again.' });
    } finally {
      setVerifying(false);
    }
  };

  const handleRecordVisit = async () => {
    if (!verificationResult?.success || !partner?.id) return;

    setRecordingVisit(true);
    try {
      const discountPercent = parseFloat(verificationResult.member.discount.replace('%', '')) || 0;

      const response = await fetch(apiUrl('api/partners/visit'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          membershipId: membershipId,
          partnerId: partner.id,
          service: 'Membership Verification',
          discountApplied: discountPercent,
          savedAmount: 0
        }),
      });

      if (response.ok) {
        alert('Visit recorded successfully!');
        setMembershipId('');
        setVerificationResult(null);
        loadPartnerStats();
      } else {
        alert('Failed to record visit. Please try again.');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    } finally {
      setRecordingVisit(false);
    }
  };

  const getPartnerIcon = (type: string) => {
    switch (type) {
      case 'doctor': return <Stethoscope className="h-5 w-5" />;
      case 'diagnostic': return <Microscope className="h-5 w-5" />;
      case 'pharmacy': return <Pill className="h-5 w-5" />;
      default: return <Building2 className="h-5 w-5" />;
    }
  };

  const getPartnerTypeLabel = (type: string) => {
    switch (type) {
      case 'doctor': return 'Medical Clinic';
      case 'diagnostic': return 'Diagnostic Center';
      case 'pharmacy': return 'Pharmacy';
      default: return 'Healthcare Partner';
    }
  };

  const getPartnerColor = (type: string) => {
    switch (type) {
      case 'doctor': return 'from-blue-50 to-cyan-50';
      case 'diagnostic': return 'from-purple-50 to-violet-50';
      case 'pharmacy': return 'from-green-50 to-emerald-50';
      default: return 'from-slate-50 to-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!partner) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-lg sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 transition-transform hover:scale-105">
            <Heart className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              HealthConnect
            </span>
          </Link>
          <div className="flex gap-3 items-center">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 flex items-center gap-2">
              {getPartnerIcon(partner.type)}
              {getPartnerTypeLabel(partner.type)}
            </Badge>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout}
              className="hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-3">
            <Building2 className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Partner Dashboard</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Welcome back, Partner! 👋
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Manage member verifications, track visits, and monitor your healthcare services
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 shadow-sm rounded-2xl hover:shadow-md transition-all duration-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Members Served</p>
                  <p className="text-xl sm:text-2xl font-bold">{stats.membersServed.toLocaleString()}</p>
                  <p className="text-xs text-green-600">Total patients</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm rounded-2xl hover:shadow-md transition-all duration-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Revenue</p>
                  <p className="text-xl sm:text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</p>
                  <p className="text-xs text-green-600">Total earnings</p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm rounded-2xl hover:shadow-md transition-all duration-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Avg. Discount</p>
                  <p className="text-xl sm:text-2xl font-bold">{stats.averageDiscount}</p>
                  <p className="text-xs text-green-600">Average offered</p>
                </div>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm rounded-2xl hover:shadow-md transition-all duration-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">This Month</p>
                  <p className="text-xl sm:text-2xl font-bold">{stats.monthlyVisits}</p>
                  <p className="text-xs text-muted-foreground">visits</p>
                </div>
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 p-1 bg-muted/50 rounded-xl h-auto">
            <TabsTrigger 
              value="verify-membership" 
              className="flex items-center gap-2 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all"
            >
              <UserCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Verify Membership</span>
              <span className="sm:hidden">Verify</span>
            </TabsTrigger>
            <TabsTrigger 
              value="recent-visits" 
              className="flex items-center gap-2 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all"
            >
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">Recent Visits</span>
              <span className="sm:hidden">Visits</span>
            </TabsTrigger>
          </TabsList>

          {/* Verify Membership Tab */}
          <TabsContent value="verify-membership" className="animate-in fade-in-50">
            <Card className="border-0 shadow-lg rounded-2xl">
              <CardHeader className={`bg-gradient-to-r ${getPartnerColor(partner.type)} pb-4`}>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Search className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Membership Verification</CardTitle>
                    <CardDescription className="text-base">
                      Verify member eligibility, check discount details, and record visits
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="membershipId" className="text-sm font-medium">
                        Membership ID
                      </Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="membershipId"
                          placeholder="Enter membership ID (e.g., MED001)"
                          value={membershipId}
                          onChange={(e) => setMembershipId(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleVerifyMembership()}
                          className="pl-10 h-11 rounded-xl border-muted-foreground/20 focus:border-primary transition-colors"
                        />
                      </div>
                    </div>
                    <div className="flex items-end">
                      <Button
                        onClick={handleVerifyMembership}
                        disabled={verifying || !membershipId.trim()}
                        size="lg"
                        className="px-8 rounded-xl h-11"
                      >
                        {verifying ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Verifying...
                          </>
                        ) : (
                          'Verify Membership'
                        )}
                      </Button>
                    </div>
                  </div>

                  {verificationResult && (
                    <Alert className={`border-2 ${
                      verificationResult.success 
                        ? 'border-green-200 bg-green-50' 
                        : 'border-red-200 bg-red-50'
                    } rounded-xl transition-all duration-300`}>
                      <div className="flex items-start gap-3">
                        {verificationResult.success ? (
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                        )}
                        <div className="flex-1 space-y-4">
                          {verificationResult.success ? (
                            <>
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <h4 className="font-semibold text-green-800 text-xl flex items-center gap-2">
                                  ✓ Valid Membership Verified
                                </h4>
                                <Button
                                  size="lg"
                                  onClick={handleRecordVisit}
                                  disabled={recordingVisit}
                                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 font-medium rounded-xl"
                                >
                                  {recordingVisit ? (
                                    <>
                                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                      Recording Visit...
                                    </>
                                  ) : (
                                    'Record Visit'
                                  )}
                                </Button>
                              </div>

                              {/* Member Details Card */}
                              <Card className="border-green-200 bg-white shadow-sm">
                                <CardContent className="p-4 sm:p-6">
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="space-y-1">
                                        <Label className="text-xs font-medium text-gray-500 uppercase">Full Name</Label>
                                        <p className="text-lg font-semibold text-gray-900">{verificationResult.member.name}</p>
                                      </div>
                                      <div className="space-y-1">
                                        <Label className="text-xs font-medium text-gray-500 uppercase">Membership ID</Label>
                                        <p className="text-lg font-semibold text-gray-900 font-mono">{verificationResult.member.membershipId}</p>
                                      </div>
                                      <div className="space-y-1">
                                        <Label className="text-xs font-medium text-gray-500 uppercase">Plan Type</Label>
                                        <p className="text-base font-medium text-gray-900 capitalize">{verificationResult.member.plan} Membership</p>
                                      </div>
                                      <div className="space-y-1">
                                        <Label className="text-xs font-medium text-green-700 uppercase">Discount Rate</Label>
                                        <p className="text-xl font-bold text-green-700">{verificationResult.member.discount}</p>
                                        <p className="text-xs text-green-600">on all services</p>
                                      </div>
                                    </div>

                                    {verificationResult.member.validUntil && (
                                      <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                        <Calendar className="h-4 w-4 text-blue-600" />
                                        <div>
                                          <p className="text-sm font-medium text-blue-900">Valid Until</p>
                                          <p className="text-sm text-blue-700">
                                            {new Date(verificationResult.member.validUntil).toLocaleDateString('en-IN', {
                                              weekday: 'long',
                                              year: 'numeric',
                                              month: 'long',
                                              day: 'numeric'
                                            })}
                                          </p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>

                              {/* Family Members */}
                              {verificationResult.member.familyMembers > 0 && (
                                <Card className="border-blue-200 bg-white">
                                  <CardContent className="p-4 sm:p-6">
                                    <h5 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                      <Users className="h-5 w-5 text-blue-600" />
                                      Family Members ({verificationResult.member.familyMembers})
                                    </h5>
                                    <div className="space-y-3">
                                      {verificationResult.member.familyDetails?.map((familyMember: any, index: number) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                                          <div className="space-y-1">
                                            <p className="font-medium text-gray-900">{familyMember.name}</p>
                                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                              <span>Age: {familyMember.age}</span>
                                              <span>•</span>
                                              <span className="capitalize">{familyMember.gender}</span>
                                              <span>•</span>
                                              <span className="capitalize">{familyMember.relationship}</span>
                                            </div>
                                          </div>
                                          <Badge variant="outline" className="bg-white">
                                            Eligible for {verificationResult.member.discount}
                                          </Badge>
                                        </div>
                                      ))}
                                    </div>
                                  </CardContent>
                                </Card>
                              )}
                            </>
                          ) : (
                            <div>
                              <h4 className="font-semibold text-red-800 mb-2">Verification Failed</h4>
                              <p className="text-red-700">{verificationResult.message}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recent Visits Tab */}
          <TabsContent value="recent-visits" className="animate-in fade-in-50">
            <Card className="border-0 shadow-lg rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <History className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Recent Visits</CardTitle>
                    <CardDescription className="text-base">
                      Track recent member visits and service history
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {recentVisits.map((visit) => (
                    <Card key={visit.id} className="border-muted-foreground/20 hover:shadow-md transition-all duration-200">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <Users className="h-6 w-6 text-primary" />
                            </div>
                            <div className="space-y-1 flex-1">
                              <h3 className="font-semibold text-lg">{visit.memberName}</h3>
                              <p className="text-muted-foreground">{visit.service}</p>
                              <div className="flex items-center gap-4 text-sm">
                                <span className="text-green-600 font-medium">{visit.discount} discount</span>
                                <span className="text-gray-400">•</span>
                                <span className="font-medium">{visit.amount}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge 
                              variant={
                                visit.date === 'Today' ? 'default' : 
                                visit.date === 'Yesterday' ? 'secondary' : 'outline'
                              }
                              className="whitespace-nowrap"
                            >
                              {visit.date}
                            </Badge>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="mt-8 pt-6 border-t">
                  <h4 className="font-semibold text-lg mb-4">Quick Actions</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <Button variant="outline" className="h-16 flex flex-col gap-1">
                      <Users className="h-5 w-5" />
                      <span className="text-xs">Member Directory</span>
                    </Button>
                    <Button variant="outline" className="h-16 flex flex-col gap-1">
                      <CreditCard className="h-5 w-5" />
                      <span className="text-xs">Generate Reports</span>
                    </Button>
                    <Button variant="outline" className="h-16 flex flex-col gap-1">
                      <Calendar className="h-5 w-5" />
                      <span className="text-xs">Schedule</span>
                    </Button>
                    <Button variant="outline" className="h-16 flex flex-col gap-1">
                      <BarChart3 className="h-5 w-5" />
                      <span className="text-xs">Analytics</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PartnerDashboard;