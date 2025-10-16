import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Heart, Users, Building2, CreditCard, TrendingUp, Calendar, Stethoscope, Pill, Microscope, CheckCircle, XCircle, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { apiUrl } from "@/lib/api";

const PartnerDashboard = () => {
  const navigate = useNavigate();
  const [partner, setPartner] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
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

  React.useEffect(() => {
    const token = localStorage.getItem('partnerToken');
    if (!token) {
      navigate('/partner/login');
      return;
    }

    // Decode token to get partner info (basic decode, not verifying signature)
    try {
      const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      setPartner({
        id: payload.id,
        email: payload.email,
        type: payload.type,
        name: 'Partner' // We'll get full name from API later
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
      // Parse discount percentage (remove % and convert to number)
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
          discountApplied: discountPercent, // Send as number (e.g., 10 for 10%)
          savedAmount: 0 // This would be calculated based on the service
        }),
      });

      if (response.ok) {
        alert('Visit recorded successfully!');
        setMembershipId('');
        setVerificationResult(null);
        // Refresh stats after recording visit
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
      case 'doctor': return <Stethoscope className="h-6 w-6" />;
      case 'diagnostic': return <Microscope className="h-6 w-6" />;
      case 'pharmacy': return <Pill className="h-6 w-6" />;
      default: return <Building2 className="h-6 w-6" />;
    }
  };

  const getPartnerTypeLabel = (type: string) => {
    switch (type) {
      case 'doctor': return 'Doctor';
      case 'diagnostic': return 'Diagnostic Center';
      case 'pharmacy': return 'Pharmacy';
      default: return 'Partner';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!partner) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <Heart className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">HealthConnect</span>
          </Link>
          <div className="flex gap-4 items-center">
            <Badge variant="outline" className="flex items-center gap-2">
              {getPartnerIcon(partner.type)}
              {getPartnerTypeLabel(partner.type)} Portal
            </Badge>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Partner Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Manage your services and track performance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Members Served</p>
                  <p className="text-2xl font-bold">{stats.membersServed.toLocaleString()}</p>
                  <p className="text-xs text-green-600">Total patients served</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                  <p className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</p>
                  <p className="text-xs text-green-600">Total earnings</p>
                </div>
                <CreditCard className="h-8 w-8 text-secondary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg. Discount</p>
                  <p className="text-2xl font-bold">{stats.averageDiscount}</p>
                  <p className="text-xs text-green-600">Average discount offered</p>
                </div>
                <TrendingUp className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold">{stats.monthlyVisits}</p>
                  <p className="text-xs text-muted-foreground">visits</p>
                </div>
                <Calendar className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Membership Verification */}
        <Card className="mb-8 border-2 border-primary/20 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-primary/10 rounded-full">
                <Search className="h-6 w-6 text-primary" />
              </div>
              Membership Verification
            </CardTitle>
            <CardDescription className="text-base">
              Verify member eligibility, check discount details, and record visits
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="membershipId" className="text-sm font-medium mb-2 block">
                    Membership ID
                  </Label>
                  <Input
                    id="membershipId"
                    placeholder="Enter membership ID (e.g., MED001)"
                    value={membershipId}
                    onChange={(e) => setMembershipId(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleVerifyMembership()}
                    className="text-base h-11"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={handleVerifyMembership}
                    disabled={verifying || !membershipId.trim()}
                    size="lg"
                    className="px-8"
                  >
                    {verifying ? 'Verifying...' : 'Verify Membership'}
                  </Button>
                </div>
              </div>

              {verificationResult && (
                <Alert className={verificationResult.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                  <div className="flex items-start gap-3">
                    {verificationResult.success ? (
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    )}
                    <div className="flex-1">
                      {verificationResult.success ? (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-green-800 text-xl">✓ Valid Membership Verified</h4>
                            <Button
                              size="lg"
                              onClick={handleRecordVisit}
                              disabled={recordingVisit}
                              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 font-medium"
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

                          {/* Primary Member Details */}
                          <div className="bg-white rounded-lg p-4 border border-green-200">
                            <h5 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                              <Heart className="h-4 w-4 text-green-600" />
                              Primary Member Details
                            </h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="bg-gray-50 rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Full Name</span>
                                </div>
                                <p className="text-lg font-semibold text-gray-900">{verificationResult.member.name}</p>
                              </div>
                              <div className="bg-gray-50 rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Membership ID</span>
                                </div>
                                <p className="text-lg font-semibold text-gray-900 font-mono">{verificationResult.member.membershipId}</p>
                              </div>
                              <div className="bg-gray-50 rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Plan Type</span>
                                </div>
                                <p className="text-base font-medium text-gray-900 capitalize">{verificationResult.member.plan} Membership</p>
                              </div>
                              <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-medium text-green-700 uppercase tracking-wide">Discount Rate</span>
                                </div>
                                <p className="text-xl font-bold text-green-700">{verificationResult.member.discount}</p>
                                <p className="text-xs text-green-600">on all services</p>
                              </div>
                              {verificationResult.member.validUntil && (
                                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200 md:col-span-2">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Calendar className="h-3 w-3 text-blue-600" />
                                    <span className="text-xs font-medium text-blue-700 uppercase tracking-wide">Valid Until</span>
                                  </div>
                                  <p className="text-base font-semibold text-blue-900">
                                    {new Date(verificationResult.member.validUntil).toLocaleDateString('en-IN', {
                                      weekday: 'long',
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric'
                                    })}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Family Members */}
                          {verificationResult.member.familyMembers > 0 ? (
                            verificationResult.member.familyDetails && verificationResult.member.familyDetails.length > 0 ? (
                              <div className="bg-white rounded-lg p-4 border border-green-200">
                                <h5 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                                  <Users className="h-4 w-4" />
                                  Family Members ({verificationResult.member.familyMembers} additional)
                                </h5>
                                <div className="grid gap-3">
                                  {verificationResult.member.familyDetails.map((familyMember: any, index: number) => (
                                    <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                                      <div className="flex items-center justify-between mb-2">
                                        <h6 className="font-semibold text-gray-900 text-base">
                                          {familyMember.name}
                                        </h6>
                                        <Badge variant="outline" className="capitalize">
                                          {familyMember.relationship}
                                        </Badge>
                                      </div>
                                      <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div className="flex items-center gap-2">
                                          <span className="text-gray-600 font-medium">Age:</span>
                                          <span className="text-gray-900">{familyMember.age} years old</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <span className="text-gray-600 font-medium">Gender:</span>
                                          <span className="text-gray-900 capitalize">{familyMember.gender}</span>
                                        </div>
                                      </div>
                                      <div className="mt-2 pt-2 border-t border-blue-200">
                                        <p className="text-xs text-gray-600">
                                          Covered under {verificationResult.member.name}'s membership • Eligible for {verificationResult.member.discount} discount
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                                <div className="flex items-center gap-2">
                                  <Users className="h-4 w-4 text-yellow-600" />
                                  <h5 className="font-medium text-yellow-800">Family Plan</h5>
                                </div>
                                <p className="text-yellow-700 mt-1">
                                  This membership includes {verificationResult.member.familyMembers} additional family member(s), but details are not yet provided.
                                  The {verificationResult.member.discount} discount applies to all family members.
                                </p>
                              </div>
                            )
                          ) : null}
                        </div>
                      ) : (
                        <div>
                          <h4 className="font-semibold text-red-800 mb-1">Verification Failed</h4>
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

        {/* Recent Activity */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Visits</CardTitle>
              <CardDescription>Latest member visits to your facility</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Rajesh Kumar</p>
                    <p className="text-sm text-muted-foreground">Blood Test - 15% discount</p>
                  </div>
                  <Badge variant="secondary">Today</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Priya Sharma</p>
                    <p className="text-sm text-muted-foreground">Consultation - 10% discount</p>
                  </div>
                  <Badge variant="secondary">Yesterday</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Amit Singh</p>
                    <p className="text-sm text-muted-foreground">Medicine Purchase - 10% discount</p>
                  </div>
                  <Badge variant="outline">2 days ago</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and tools</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  View Member Directory
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Generate Reports
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Management
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Analytics Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PartnerDashboard;