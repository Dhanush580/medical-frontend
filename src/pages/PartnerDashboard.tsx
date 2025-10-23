import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Heart, Users, Building2, CreditCard, TrendingUp, Calendar, Stethoscope, Pill, Microscope, CheckCircle, XCircle, Search, History, UserCheck, BarChart3, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { apiUrl } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const PartnerDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
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

  // Recent visits data with pagination
  const [recentVisits, setRecentVisits] = React.useState<any[]>([]);
  const [visitsPagination, setVisitsPagination] = React.useState({
    currentPage: 1,
    totalPages: 1,
    totalVisits: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 10
  });
  const [loadingVisits, setLoadingVisits] = React.useState(false);

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

  const loadPartnerVisits = async (page = 1) => {
    const token = localStorage.getItem('partnerToken');
    if (!token) return;

    setLoadingVisits(true);
    try {
      const response = await fetch(apiUrl(`api/partners/partner-visits?page=${page}&limit=10`), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setRecentVisits(data.visits);
        setVisitsPagination(data.pagination);
      }
    } catch (error) {
      console.error('Failed to load partner visits:', error);
    } finally {
      setLoadingVisits(false);
    }
  };

  React.useEffect(() => {
    if (partner) {
      loadPartnerStats();
      loadPartnerVisits();
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
      const token = localStorage.getItem('partnerToken');
      const response = await fetch(apiUrl('api/partners/verify'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
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
      const token = localStorage.getItem('partnerToken');

      const response = await fetch(apiUrl('api/partners/visit'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
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
        // Refresh both stats and visits
        loadPartnerStats();
        loadPartnerVisits();
        setMembershipId('');
        setVerificationResult(null);
        toast({
          title: "Visit Recorded",
          description: "The member visit has been recorded successfully.",
        });
      } else {
        toast({
          title: "Recording Failed",
          description: "Failed to record visit. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      alert('Network error. Please try again.');
    } finally {
      setRecordingVisit(false);
    }
  };

  const getPartnerIcon = (type: string) => {
    switch (type) {
      case 'doctor': return <Stethoscope className="h-4 w-4 sm:h-5 sm:w-5" />;
      case 'diagnostic': return <Microscope className="h-4 w-4 sm:h-5 sm:w-5" />;
      case 'pharmacy': return <Pill className="h-4 w-4 sm:h-5 sm:w-5" />;
      default: return <Building2 className="h-4 w-4 sm:h-5 sm:w-5" />;
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
        <div className="container mx-auto px-3 sm:px-4 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 transition-transform hover:scale-105">
            <Heart className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              MEDI COST SAVER
            </span>
          </Link>
          <div className="flex gap-2 sm:gap-3 items-center">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 flex items-center gap-1 sm:gap-2 text-xs">
              {getPartnerIcon(partner.type)}
              <span className="hidden xs:inline">{getPartnerTypeLabel(partner.type)}</span>
            </Badge>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout}
              className="hover:bg-red-50 hover:text-red-600 transition-colors text-xs sm:text-sm"
            >
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Header */}
        <div className="mb-6 sm:mb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-primary/10 rounded-full mb-2 sm:mb-3">
            <Building2 className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
            <span className="text-xs sm:text-sm font-medium text-primary">Partner Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Welcome back, Partner! 👋
          </h1>
          <p className="text-muted-foreground max-w-2xl text-sm sm:text-base">
            Manage member verifications, track visits, and monitor your healthcare services
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Card className="border-0 shadow-sm rounded-xl sm:rounded-2xl hover:shadow-md transition-all duration-200">
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Members Served</p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold">{stats.membersServed.toLocaleString()}</p>
                  <p className="text-xs text-green-600">Total patients</p>
                </div>
                <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm rounded-xl sm:rounded-2xl hover:shadow-md transition-all duration-200">
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Revenue</p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</p>
                  <p className="text-xs text-green-600">Total earnings</p>
                </div>
                <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg">
                  <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm rounded-xl sm:rounded-2xl hover:shadow-md transition-all duration-200">
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Avg. Discount</p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold">{stats.averageDiscount}</p>
                  <p className="text-xs text-green-600">Average offered</p>
                </div>
                <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm rounded-xl sm:rounded-2xl hover:shadow-md transition-all duration-200">
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">This Month</p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold">{stats.monthlyVisits}</p>
                  <p className="text-xs text-muted-foreground">visits</p>
                </div>
                <div className="p-1.5 sm:p-2 bg-orange-100 rounded-lg">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2 p-1 bg-muted/50 rounded-lg sm:rounded-xl h-auto">
            <TabsTrigger 
              value="verify-membership" 
              className="flex items-center gap-1 sm:gap-2 py-2 sm:py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md sm:rounded-lg transition-all text-xs sm:text-sm"
            >
              <UserCheck className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Verify Membership</span>
              <span className="xs:hidden">Verify</span>
            </TabsTrigger>
            <TabsTrigger 
              value="recent-visits" 
              className="flex items-center gap-1 sm:gap-2 py-2 sm:py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md sm:rounded-lg transition-all text-xs sm:text-sm"
            >
              <History className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Recent Visits</span>
              <span className="xs:hidden">Visits</span>
            </TabsTrigger>
          </TabsList>

          {/* Verify Membership Tab */}
          <TabsContent value="verify-membership" className="animate-in fade-in-50">
            <Card className="border-0 shadow-lg rounded-xl sm:rounded-2xl">
              <CardHeader className={`bg-gradient-to-r ${getPartnerColor(partner.type)} pb-3 sm:pb-4`}>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                    <Search className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl sm:text-2xl">Membership Verification</CardTitle>
                    <CardDescription className="text-sm sm:text-base">
                      Verify member eligibility, check discount details, and record visits
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 sm:pt-6">
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <div className="flex-1 space-y-1.5 sm:space-y-2">
                      <Label htmlFor="membershipId" className="text-xs sm:text-sm font-medium">
                        Membership ID
                      </Label>
                      <div className="relative">
                        <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                        <Input
                          id="membershipId"
                          placeholder="Enter membership ID (e.g., MED001)"
                          value={membershipId}
                          onChange={(e) => setMembershipId(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleVerifyMembership()}
                          className="pl-7 sm:pl-10 h-9 sm:h-11 rounded-lg sm:rounded-xl border-muted-foreground/20 focus:border-primary transition-colors text-sm sm:text-base"
                        />
                      </div>
                    </div>
                    <div className="flex items-end">
                      <Button
                        onClick={handleVerifyMembership}
                        disabled={verifying || !membershipId.trim()}
                        size="lg"
                        className="px-4 sm:px-8 rounded-lg sm:rounded-xl h-9 sm:h-11 text-xs sm:text-sm w-full sm:w-auto"
                      >
                        {verifying ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white mr-1 sm:mr-2"></div>
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
                    } rounded-lg sm:rounded-xl transition-all duration-300`}>
                      <div className="flex items-start gap-2 sm:gap-3">
                        {verificationResult.success ? (
                          <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 mt-0.5 flex-shrink-0" />
                        )}
                        <div className="flex-1 space-y-3 sm:space-y-4">
                          {verificationResult.success ? (
                            <>
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                                <h4 className="font-semibold text-green-800 text-lg sm:text-xl flex items-center gap-1 sm:gap-2">
                                  ✓ Valid Membership Verified
                                </h4>
                                <Button
                                  size="lg"
                                  onClick={handleRecordVisit}
                                  disabled={recordingVisit}
                                  className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-6 py-1.5 sm:py-2 font-medium rounded-lg sm:rounded-xl text-xs sm:text-sm w-full sm:w-auto"
                                >
                                  {recordingVisit ? (
                                    <>
                                      <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white mr-1 sm:mr-2"></div>
                                      Recording Visit...
                                    </>
                                  ) : (
                                    'Record Visit'
                                  )}
                                </Button>
                              </div>

                              {/* Member Details Card */}
                              <Card className="border-green-200 bg-white shadow-sm">
                                <CardContent className="p-3 sm:p-4 md:p-6">
                                  <div className="space-y-3 sm:space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                                      <div className="space-y-1">
                                        <Label className="text-xs font-medium text-gray-500 uppercase">Full Name</Label>
                                        <p className="text-base sm:text-lg font-semibold text-gray-900">{verificationResult.member.name}</p>
                                      </div>
                                      <div className="space-y-1">
                                        <Label className="text-xs font-medium text-gray-500 uppercase">Membership ID</Label>
                                        <p className="text-base sm:text-lg font-semibold text-gray-900 font-mono">{verificationResult.member.membershipId}</p>
                                      </div>
                                      <div className="space-y-1">
                                        <Label className="text-xs font-medium text-gray-500 uppercase">Plan Type</Label>
                                        <p className="text-sm sm:text-base font-medium text-gray-900 capitalize">{verificationResult.member.plan} Membership</p>
                                      </div>
                                      <div className="space-y-1">
                                        <Label className="text-xs font-medium text-green-700 uppercase">Discount Rate</Label>
                                        <p className="text-lg sm:text-xl font-bold text-green-700">{verificationResult.member.discount}</p>
                                        <p className="text-xs text-green-600">on all services</p>
                                      </div>
                                    </div>

                                    {verificationResult.member.validUntil && (
                                      <div className="flex items-center gap-2 p-2 sm:p-3 bg-blue-50 rounded-lg border border-blue-200">
                                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                                        <div>
                                          <p className="text-xs sm:text-sm font-medium text-blue-900">Valid Until</p>
                                          <p className="text-xs sm:text-sm text-blue-700">
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
                                  <CardContent className="p-3 sm:p-4 md:p-6">
                                    <h5 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4 flex items-center gap-1 sm:gap-2">
                                      <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                                      Family Members ({verificationResult.member.familyMembers})
                                    </h5>
                                    <div className="space-y-2 sm:space-y-3">
                                      {verificationResult.member.familyDetails?.map((familyMember: any, index: number) => (
                                        <div key={index} className="flex items-center justify-between p-2 sm:p-3 bg-blue-50 rounded-lg border border-blue-200">
                                          <div className="space-y-1">
                                            <p className="font-medium text-gray-900 text-sm sm:text-base">{familyMember.name}</p>
                                            <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-2 text-xs sm:text-sm text-gray-600">
                                              <span>Age: {familyMember.age}</span>
                                              <span className="hidden xs:inline">•</span>
                                              <span className="capitalize">{familyMember.gender}</span>
                                              <span className="hidden xs:inline">•</span>
                                              <span className="capitalize">{familyMember.relationship}</span>
                                            </div>
                                          </div>
                                          <Badge variant="outline" className="bg-white text-xs">
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
                              <h4 className="font-semibold text-red-800 mb-1 sm:mb-2 text-sm sm:text-base">Verification Failed</h4>
                              <p className="text-red-700 text-xs sm:text-sm">{verificationResult.message}</p>
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
            <Card className="border-0 shadow-lg rounded-xl sm:rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 pb-3 sm:pb-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg">
                    <History className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl sm:text-2xl">Recent Visits</CardTitle>
                    <CardDescription className="text-sm sm:text-base">
                      Track recent member visits and service history
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 sm:pt-6">
                {loadingVisits && (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span className="ml-2 text-muted-foreground">Loading visits...</span>
                  </div>
                )}
                <div className="space-y-3 sm:space-y-4">
                  {!loadingVisits && (
                  <>
                    {recentVisits.length === 0 ? (
                    <div className="text-center py-8 sm:py-12">
                      <History className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No visits recorded yet</h3>
                      <p className="text-gray-600 text-sm sm:text-base mb-4">
                        Start by verifying member eligibility and recording their visits.
                      </p>
                      <Button 
                        onClick={() => setActiveTab('verify')}
                        className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700"
                      >
                        Start Recording Visits
                      </Button>
                    </div>
                  ) : (
                    recentVisits.map((visit) => (
                    <Card key={visit.id} className="border-muted-foreground/20 hover:shadow-md transition-all duration-200">
                      <CardContent className="p-3 sm:p-4 md:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                          <div className="flex items-start gap-3 sm:gap-4 flex-1">
                            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg sm:rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <Users className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-primary" />
                            </div>
                            <div className="space-y-1 flex-1">
                              <h3 className="font-semibold text-base sm:text-lg">{visit.memberName}</h3>
                              <p className="text-muted-foreground text-sm sm:text-base">{visit.membershipId} • {visit.service}</p>
                              <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-2 text-xs sm:text-sm">
                                <span className="text-green-600 font-medium">{visit.discount} discount</span>
                                {visit.savedAmount > 0 && (
                                  <span className="text-blue-600">• ₹{visit.savedAmount} saved</span>
                                )}
                              </div>
                              <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-2 text-xs sm:text-sm text-muted-foreground mt-1">
                                {visit.email !== 'N/A' && (
                                  <span className="flex items-center gap-1">
                                    <span>📧</span>
                                    <span>{visit.email}</span>
                                  </span>
                                )}
                                {visit.phone !== 'N/A' && (
                                  <span className="flex items-center gap-1">
                                    <span>📱</span>
                                    <span>{visit.phone}</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 sm:gap-3">
                            <Badge variant="outline" className="whitespace-nowrap text-xs">
                              {visit.date} at {visit.time}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                  )}

                  {/* Pagination Controls */}

                  {/* Pagination Controls */}
                  {visitsPagination.totalPages > 1 && (
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-sm text-muted-foreground">
                        Showing {recentVisits.length} of {visitsPagination.totalVisits} visits
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => loadPartnerVisits(visitsPagination.currentPage - 1)}
                          disabled={!visitsPagination.hasPrevPage || loadingVisits}
                          className="text-xs"
                        >
                          <ChevronLeft className="h-3 w-3 mr-1" />
                          Previous
                        </Button>

                        <div className="flex items-center gap-1">
                          {Array.from({ length: visitsPagination.totalPages }, (_, i) => i + 1)
                            .filter(page => {
                              const current = visitsPagination.currentPage;
                              return page === 1 || page === visitsPagination.totalPages || 
                                     (page >= current - 1 && page <= current + 1);
                            })
                            .map((page, index, array) => (
                              <React.Fragment key={page}>
                                {index > 0 && array[index - 1] !== page - 1 && (
                                  <span className="text-muted-foreground text-xs">...</span>
                                )}
                                <Button
                                  variant={page === visitsPagination.currentPage ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => loadPartnerVisits(page)}
                                  disabled={loadingVisits}
                                  className="text-xs min-w-[32px] h-8"
                                >
                                  {page}
                                </Button>
                              </React.Fragment>
                            ))}
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => loadPartnerVisits(visitsPagination.currentPage + 1)}
                          disabled={!visitsPagination.hasNextPage || loadingVisits}
                          className="text-xs"
                        >
                          Next
                          <ChevronRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  )}
                  </>
                )}
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
