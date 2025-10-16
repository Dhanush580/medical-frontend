import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Calendar, MapPin, Phone, Mail, Search, Filter } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import indiaDistricts from "@/lib/indiaDistricts";
import { apiUrl } from "@/lib/api";

const Dashboard = () => {
  const [user, setUser] = React.useState<any>(null);
  const [query, setQuery] = React.useState('');
  const [partners, setPartners] = React.useState<any[]>([]);
  const [recentVisits, setRecentVisits] = React.useState<any[]>([]);
  const [selectedState, setSelectedState] = React.useState('');
  const [selectedDistrict, setSelectedDistrict] = React.useState('');
  const [selectedType, setSelectedType] = React.useState('all');
  const [loading, setLoading] = React.useState(false);
  const [stateSuggestions, setStateSuggestions] = React.useState<string[]>([]);
  const [districtSuggestions, setDistrictSuggestions] = React.useState<string[]>([]);
  const [showStateSuggestions, setShowStateSuggestions] = React.useState(false);
  const [showDistrictSuggestions, setShowDistrictSuggestions] = React.useState(false);

  React.useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await fetch(apiUrl('api/auth/me'), { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) {
          const u = await res.json();
          setUser(u);
          // Load visits after user is loaded
          loadVisits();
        }
      } catch (err) {
        console.error(err);
      }
    };

    const loadVisits = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await fetch(apiUrl('api/partners/my-visits'), { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) {
          const visits = await res.json();
          setRecentVisits(visits);
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadUser();
  }, []);

  // Instant search effect
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchPartners();
    }, 300); // Debounce for 300ms

    return () => clearTimeout(timeoutId);
  }, [query, selectedState, selectedDistrict, selectedType]);

  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove auth token and clear user state
    localStorage.removeItem('token');
    setUser(null);
    // Replace history so back doesn't go to protected page
    navigate('/login', { replace: true });

    // Push a dummy state and listen for popstate to prevent navigating back
    window.history.pushState(null, '', '/login');
    const onBack = () => {
      // If no token, always redirect to login
      if (!localStorage.getItem('token')) {
        navigate('/login', { replace: true });
      }
    };
    window.addEventListener('popstate', onBack);
    // Remove listener after a short timeout to avoid leaking if user stays
    setTimeout(() => window.removeEventListener('popstate', onBack), 5000);
  };

  const getDistrictsForState = (state: string) => {
    return indiaDistricts[state] || [];
  };

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    setSelectedDistrict(''); // Reset district when state changes
    setDistrictSuggestions([]); // Clear district suggestions
  };

  const handleStateInputChange = (value: string) => {
    setSelectedState(value);
    setSelectedDistrict(''); // Reset district when state changes
    setDistrictSuggestions([]); // Clear district suggestions

    if (value.trim()) {
      const filtered = Object.keys(indiaDistricts)
        .filter(state => state.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 10); // Limit to 10 suggestions
      setStateSuggestions(filtered);
      setShowStateSuggestions(true);
    } else {
      setStateSuggestions([]);
      setShowStateSuggestions(false);
    }
  };

  const handleDistrictInputChange = (value: string) => {
    setSelectedDistrict(value);

    if (value.trim() && selectedState) {
      const districts = getDistrictsForState(selectedState);
      const filtered = districts
        .filter(district => district.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 10); // Limit to 10 suggestions
      setDistrictSuggestions(filtered);
      setShowDistrictSuggestions(true);
    } else {
      setDistrictSuggestions([]);
      setShowDistrictSuggestions(false);
    }
  };

  const selectStateSuggestion = (state: string) => {
    setSelectedState(state);
    setStateSuggestions([]);
    setShowStateSuggestions(false);
    setSelectedDistrict(''); // Reset district when state changes
    searchPartners(); // Trigger search immediately
  };

  const selectDistrictSuggestion = (district: string) => {
    setSelectedDistrict(district);
    setDistrictSuggestions([]);
    setShowDistrictSuggestions(false);
    searchPartners(); // Trigger search immediately
  };

  const searchPartners = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query.trim()) params.append('q', query.trim());
      if (selectedType !== 'all') params.append('type', selectedType);
      if (selectedState) params.append('state', selectedState);
      if (selectedDistrict) params.append('district', selectedDistrict);

      const res = await fetch(apiUrl(`api/partners?${params.toString()}`));
      if (res.ok) {
        const data = await res.json();
        setPartners(data);
      } else {
        console.error('Failed to search partners');
        setPartners([]);
      }
    } catch (err) {
      console.error('Error searching partners:', err);
      setPartners([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <Heart className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              HealthConnect
            </span>
          </Link>
          <div className="flex gap-4 items-center">
            <span className="text-sm text-muted-foreground">Welcome, {user?.name ?? 'Guest'}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Dashboard</h1>
          <p className="text-muted-foreground">Manage your healthcare membership</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Top: show user subscription status */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Subscription</CardTitle>
                <CardDescription>Membership details</CardDescription>
              </CardHeader>
              <CardContent>
                {user ? (<>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm opacity-80 mb-1">Plan</div>
                      <div className="text-xl font-semibold">{user.plan || 'Annual'}</div>
                      {user?.familyMembers > 0 && (
                        <div className="text-sm text-muted-foreground">Includes {user.familyMembers} family member(s)</div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm opacity-80 mb-1">Status</div>
                      <div className="text-xl font-semibold">{user.status}</div>
                    </div>
                    <div>
                      <div className="text-sm opacity-80 mb-1">Valid Until</div>
                      <div className="text-lg">{user.validUntil ? new Date(user.validUntil).toLocaleDateString() : '—'}</div>
                    </div>
                    <div>
                      <div className="text-sm opacity-80 mb-1">Member ID</div>
                      <div className="text-lg">{user.membershipId}</div>
                    </div>
                  </div>

                  {/* Family members list */}
                  {user?.familyMembers > 0 && Array.isArray(user?.familyDetails) && (
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">Family Members</h4>
                      <div className="space-y-3">
                        {user.familyDetails.map((m: any, idx: number) => (
                          <div key={idx} className="p-3 border rounded-lg flex items-center justify-between bg-card/30">
                            <div>
                              <div className="font-semibold">{m?.name || '—'}</div>
                              <div className="text-sm text-muted-foreground">Age: {m?.age ?? '—'} • {m?.gender || '—'}</div>
                            </div>
                            <div className="text-sm text-muted-foreground">{m?.relationship || '—'}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Contact details (moved into Subscription) */}
                  {user?.email || user?.phone ? (
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">Contact</h4>
                      <div className="grid md:grid-cols-2 gap-3">
                        <div className="p-3 border rounded-lg bg-card/30">
                          <div className="text-sm text-muted-foreground">Email</div>
                          <div className="font-medium">{user?.email || '—'}</div>
                        </div>
                        <div className="p-3 border rounded-lg bg-card/30">
                          <div className="text-sm text-muted-foreground">Phone</div>
                          <div className="font-medium">{user?.phone || '—'}</div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </>
                ) : (
                  <div>Please login to see membership details.</div>
                )}
              </CardContent>
            </Card>

            {/* Partner search */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Find Healthcare Partners
                </CardTitle>
                <CardDescription>Search and filter hospitals, doctors, pharmacies, and diagnostic centers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Search Input */}
                  <div>
                    <Label htmlFor="search" className="text-sm font-medium mb-2 block">Search</Label>
                    <Input
                      id="search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search by name, type, or address..."
                      className="w-full"
                      onKeyPress={(e) => e.key === 'Enter' && searchPartners()}
                    />
                  </div>

                  {/* Filters Row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                      <Label htmlFor="type" className="text-sm font-medium mb-2 block">Type</Label>
                      <Select value={selectedType} onValueChange={setSelectedType}>
                        <SelectTrigger>
                          <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="doctor">Doctor</SelectItem>
                          <SelectItem value="diagnostic">Diagnostic Center</SelectItem>
                          <SelectItem value="pharmacy">Pharmacy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="relative">
                      <Label htmlFor="state" className="text-sm font-medium mb-2 block">State</Label>
                      <Input
                        id="state"
                        value={selectedState}
                        onChange={(e) => handleStateInputChange(e.target.value)}
                        onFocus={() => stateSuggestions.length > 0 && setShowStateSuggestions(true)}
                        placeholder="Type state name..."
                        className="w-full"
                      />
                      {showStateSuggestions && stateSuggestions.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-48 overflow-y-auto">
                          {stateSuggestions.map((state) => (
                            <div
                              key={state}
                              className="px-3 py-2 hover:bg-muted cursor-pointer text-sm"
                              onClick={() => selectStateSuggestion(state)}
                            >
                              {state}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="relative">
                      <Label htmlFor="district" className="text-sm font-medium mb-2 block">District</Label>
                      <Input
                        id="district"
                        value={selectedDistrict}
                        onChange={(e) => handleDistrictInputChange(e.target.value)}
                        onFocus={() => districtSuggestions.length > 0 && setShowDistrictSuggestions(true)}
                        placeholder="Type district name..."
                        className="w-full"
                        disabled={!selectedState}
                      />
                      {showDistrictSuggestions && districtSuggestions.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-48 overflow-y-auto">
                          {districtSuggestions.map((district) => (
                            <div
                              key={district}
                              className="px-3 py-2 hover:bg-muted cursor-pointer text-sm"
                              onClick={() => selectDistrictSuggestion(district)}
                            >
                              {district}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Results */}
                  {partners.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-medium mb-3">Found {partners.length} partner{partners.length !== 1 ? 's' : ''}</h4>
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {partners.map((p, idx) => (
                          <div key={idx} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h5 className="font-semibold text-lg">{p.name}</h5>
                                  <Badge variant="outline" className="capitalize">
                                    {p.type}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">{p.address}</p>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  {p.contactPhone && (
                                    <div className="flex items-center gap-1">
                                      <Phone className="h-3 w-3" />
                                      {p.contactPhone}
                                    </div>
                                  )}
                                  {p.state && p.district && (
                                    <div className="flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />
                                      {p.district}, {p.state}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {partners.length === 0 && !loading && (query || selectedType !== 'all' || selectedState || selectedDistrict) && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No partners found matching your criteria.</p>
                      <p className="text-sm">Try adjusting your search or filters.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

          {/* Membership Card */}
          <div>
            {user ? (
              <Card className="bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-xl">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl mb-1">{user?.name}</CardTitle>
                      <CardDescription className="text-primary-foreground/80">
                        Member ID: {user?.membershipId}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      {user?.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm opacity-80 mb-1">Plan</div>
                      <div className="text-xl font-semibold">{user?.plan}</div>
                    </div>
                    <div>
                      <div className="text-sm opacity-80 mb-1">Discount</div>
                      <div className="text-xl font-semibold">{user?.familyMembers && user.familyMembers > 0 ? '10%' : '0%'}</div>
                    </div>
                    <div>
                      <div className="text-sm opacity-80 mb-1">Valid Until</div>
                      <div className="text-lg">{user?.validUntil ? new Date(user.validUntil).toLocaleDateString() : '—'}</div>
                    </div>
                    {/* digital card info removed (scanner removed per request) */}
                  </div>

                  <div className="pt-4 border-t border-white/20">
                    <Button variant="secondary" className="w-full md:w-auto bg-white/20 hover:bg-white/30 text-white border-white/30">
                      Download Digital Card
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Not logged in</CardTitle>
                </CardHeader>
                <CardContent>Please login to view your membership card and recent visits.</CardContent>
              </Card>
            )}
          </div>

            {/* Recent Visits */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Recent Visits</CardTitle>
                <CardDescription>Your recent healthcare facility visits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentVisits.length > 0 ? (
                    recentVisits.map((visit, idx) => (
                      <div key={visit.id || idx} className="flex items-start justify-between p-4 border rounded-lg">
                        <div className="flex gap-4">
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <MapPin className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <div className="font-semibold">{visit.facility}</div>
                            <div className="text-sm text-muted-foreground">{visit.service}</div>
                            <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                              <Calendar className="h-3 w-3" />
                              {visit.date}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">Saved</div>
                          <div className="font-semibold text-accent">{visit.discount}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No visits recorded yet</p>
                      <p className="text-sm">Your healthcare visits will appear here</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Savings Summary */}
            <Card className="bg-gradient-to-br from-accent/10 to-accent/5">
              <CardHeader>
                <CardTitle>Total Savings</CardTitle>
                <CardDescription>Since joining HealthConnect</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-accent mb-2">₹3,450</div>
                <div className="text-sm text-muted-foreground">
                  You've saved more than your subscription cost!
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
