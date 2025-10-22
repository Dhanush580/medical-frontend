import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Calendar, MapPin, Phone, Mail, Search, Filter, User, Shield, History, Home } from "lucide-react";
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
  const [activeTab, setActiveTab] = React.useState('partners');
  const [inputState, setInputState] = React.useState('');
  const [inputDistrict, setInputDistrict] = React.useState('');

  React.useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await fetch(apiUrl('api/auth/me'), { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) {
          const u = await res.json();
          setUser(u);
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

  // Instant search effect - only for query and type changes
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchPartners();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, selectedType]);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login', { replace: true });
    window.history.pushState(null, '', '/login');
    const onBack = () => {
      if (!localStorage.getItem('token')) {
        navigate('/login', { replace: true });
      }
    };
    window.addEventListener('popstate', onBack);
    setTimeout(() => window.removeEventListener('popstate', onBack), 5000);
  };

  const getDistrictsForState = (state: string) => {
    return indiaDistricts[state] || [];
  };

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    setSelectedDistrict('');
    setDistrictSuggestions([]);
  };

  const handleStateInputChange = (value: string) => {
    setInputState(value);
    setInputDistrict('');
    setDistrictSuggestions([]);

    if (value.trim()) {
      const filtered = Object.keys(indiaDistricts)
        .filter(state => state.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 10);
      setStateSuggestions(filtered);
      setShowStateSuggestions(true);
    } else {
      setStateSuggestions([]);
      setShowStateSuggestions(false);
    }
  };

  const handleDistrictInputChange = (value: string) => {
    setInputDistrict(value);

    if (value.trim() && inputState) {
      const districts = getDistrictsForState(inputState);
      const filtered = districts
        .filter(district => district.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 10);
      setDistrictSuggestions(filtered);
      setShowDistrictSuggestions(true);
    } else {
      setDistrictSuggestions([]);
      setShowDistrictSuggestions(false);
    }
  };

  const selectStateSuggestion = (state: string) => {
    setInputState(state);
    setSelectedState(state);
    setInputDistrict('');
    setSelectedDistrict('');
    setStateSuggestions([]);
    setShowStateSuggestions(false);
    setDistrictSuggestions([]);
    searchPartners();
  };

  const selectDistrictSuggestion = (district: string) => {
    setInputDistrict(district);
    setSelectedDistrict(district);
    setDistrictSuggestions([]);
    setShowDistrictSuggestions(false);
    searchPartners();
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-lg sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-3 sm:px-4 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 transition-transform hover:scale-105">
            <Heart className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              HealthConnect
            </span>
          </Link>
          <div className="flex gap-2 sm:gap-3 items-center">
            <div className="hidden xs:flex items-center gap-2 px-2 sm:px-3 py-1 bg-primary/10 rounded-full">
              <User className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
              <span className="text-xs sm:text-sm font-medium">{user?.name ?? 'Guest'}</span>
            </div>
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
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-primary/10 rounded-full mb-2 sm:mb-3">
            <Home className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
            <span className="text-xs sm:text-sm font-medium text-primary">Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Welcome back, {user?.name ?? 'Guest'}! 👋
          </h1>
          <p className="text-muted-foreground max-w-2xl text-sm sm:text-base">
            Manage your healthcare membership and find trusted medical partners in one place.
          </p>
        </div>

        {/* Main Content with Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-3 p-1 bg-muted/50 rounded-lg sm:rounded-xl h-auto">
            <TabsTrigger 
              value="partners" 
              className="flex items-center gap-1 sm:gap-2 py-2 sm:py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md sm:rounded-lg transition-all text-xs sm:text-sm"
            >
              <Search className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Find Partners</span>
              <span className="xs:hidden">Partners</span>
            </TabsTrigger>
            <TabsTrigger 
              value="subscription" 
              className="flex items-center gap-1 sm:gap-2 py-2 sm:py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md sm:rounded-lg transition-all text-xs sm:text-sm"
            >
              <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">My Subscription</span>
              <span className="xs:hidden">Subscription</span>
            </TabsTrigger>
            <TabsTrigger 
              value="visits" 
              className="flex items-center gap-1 sm:gap-2 py-2 sm:py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md sm:rounded-lg transition-all text-xs sm:text-sm"
            >
              <History className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Recent Visits</span>
              <span className="xs:hidden">Visits</span>
            </TabsTrigger>
          </TabsList>

          {/* Partners Tab */}
          <TabsContent value="partners" className="space-y-4 sm:space-y-6 animate-in fade-in-50">
            <Card className="border-0 shadow-lg rounded-xl sm:rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-blue-50 pb-3 sm:pb-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                    <Search className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl sm:text-2xl">Find Healthcare Partners</CardTitle>
                    <CardDescription className="text-sm sm:text-base">
                      Search hospitals, doctors, pharmacies, and diagnostic centers
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 sm:pt-6">
                <div className="space-y-4 sm:space-y-6">
                  {/* Search Input */}
                  <div className="relative">
                    <Label htmlFor="search" className="text-xs sm:text-sm font-medium mb-2 sm:mb-3 block">Search Partners</Label>
                    <div className="relative">
                      <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                      <Input
                        id="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by name, specialty, or address..."
                        className="w-full pl-7 sm:pl-10 pr-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border-muted-foreground/20 focus:border-primary transition-colors text-sm sm:text-base"
                      />
                    </div>
                  </div>

                  {/* Filters Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    <div className="space-y-2 sm:space-y-3">
                      <Label htmlFor="type" className="text-xs sm:text-sm font-medium">Service Type</Label>
                      <Select value={selectedType} onValueChange={setSelectedType}>
                        <SelectTrigger className="rounded-lg sm:rounded-xl border-muted-foreground/20 focus:border-primary transition-colors text-sm sm:text-base">
                          <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Healthcare Services</SelectItem>
                          <SelectItem value="doctor">Doctors & Clinics</SelectItem>
                          <SelectItem value="dentist">Dentists</SelectItem>
                          <SelectItem value="diagnostic">Diagnostic Centers</SelectItem>
                          <SelectItem value="pharmacy">Pharmacies</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 sm:space-y-3 relative">
                      <Label htmlFor="state" className="text-xs sm:text-sm font-medium">State</Label>
                      <Input
                        id="state"
                        value={inputState}
                        onChange={(e) => handleStateInputChange(e.target.value)}
                        onFocus={() => stateSuggestions.length > 0 && setShowStateSuggestions(true)}
                        placeholder="Type state name..."
                        className="rounded-lg sm:rounded-xl border-muted-foreground/20 focus:border-primary transition-colors text-sm sm:text-base"
                      />
                      {showStateSuggestions && stateSuggestions.length > 0 && (
                        <div className="absolute z-20 w-full mt-1 bg-white border border-border rounded-lg sm:rounded-xl shadow-lg max-h-48 overflow-y-auto">
                          {stateSuggestions.map((state) => (
                            <div
                              key={state}
                              className="px-3 sm:px-4 py-2 sm:py-3 hover:bg-muted/50 cursor-pointer text-xs sm:text-sm border-b border-border/50 last:border-b-0 transition-colors"
                              onClick={() => selectStateSuggestion(state)}
                            >
                              {state}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 sm:space-y-3 relative">
                      <Label htmlFor="district" className="text-xs sm:text-sm font-medium">District</Label>
                      <Input
                        id="district"
                        value={inputDistrict}
                        onChange={(e) => handleDistrictInputChange(e.target.value)}
                        onFocus={() => districtSuggestions.length > 0 && setShowDistrictSuggestions(true)}
                        placeholder="Type district name..."
                        className="rounded-lg sm:rounded-xl border-muted-foreground/20 focus:border-primary transition-colors text-sm sm:text-base disabled:opacity-50"
                        disabled={!inputState}
                      />
                      {showDistrictSuggestions && districtSuggestions.length > 0 && (
                        <div className="absolute z-20 w-full mt-1 bg-white border border-border rounded-lg sm:rounded-xl shadow-lg max-h-48 overflow-y-auto">
                          {districtSuggestions.map((district) => (
                            <div
                              key={district}
                              className="px-3 sm:px-4 py-2 sm:py-3 hover:bg-muted/50 cursor-pointer text-xs sm:text-sm border-b border-border/50 last:border-b-0 transition-colors"
                              onClick={() => selectDistrictSuggestion(district)}
                            >
                              {district}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Clear Filters */}
                  {(query || selectedType !== 'all' || selectedState || selectedDistrict) && (
                    <div className="flex justify-center mt-3 sm:mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setQuery('');
                          setSelectedType('all');
                          setSelectedState('');
                          setSelectedDistrict('');
                          setInputState('');
                          setInputDistrict('');
                          setStateSuggestions([]);
                          setDistrictSuggestions([]);
                          setShowStateSuggestions(false);
                          setShowDistrictSuggestions(false);
                          searchPartners();
                        }}
                        className="text-muted-foreground hover:text-foreground text-xs sm:text-sm"
                      >
                        Clear all filters
                      </Button>
                    </div>
                  )}

                  {/* Results */}
                  {loading && (
                    <div className="flex justify-center py-6 sm:py-8">
                      <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-primary"></div>
                    </div>
                  )}

                  {partners.length > 0 && !loading && (
                    <div className="mt-4 sm:mt-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 mb-3 sm:mb-4">
                        <h4 className="font-semibold text-base sm:text-lg">
                          Found {partners.length} partner{partners.length !== 1 ? 's' : ''}
                        </h4>
                        <Badge variant="secondary" className="bg-primary/10 text-primary text-xs sm:text-sm">
                          {selectedType === 'all' ? 'All Types' : selectedType}
                        </Badge>
                      </div>
                      <div className="grid gap-4 sm:gap-6 max-h-96 overflow-y-auto pr-1 sm:pr-2">
                        {partners.map((p, idx) => (
                          <Card 
                            key={idx} 
                            className="border-muted-foreground/20 hover:border-primary/30 hover:shadow-lg transition-all duration-200 cursor-pointer rounded-lg sm:rounded-xl overflow-hidden"
                          >
                            <CardContent className="p-4 sm:p-6">
                              {/* Header with Name and Type */}
                              <div className="flex items-start justify-between mb-3 sm:mb-4">
                                <div className="flex-1">
                                  <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-3 mb-1 sm:mb-2">
                                    <h5 className="font-bold text-lg sm:text-xl text-gray-900 break-words">{p.name}</h5>
                                    <Badge variant="outline" className="capitalize bg-blue-50 text-blue-700 border-blue-200 font-medium text-xs w-fit">
                                      {p.type}
                                    </Badge>
                                  </div>
                                  {p.responsible?.name && (
                                    <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 sm:gap-2">
                                      <User className="h-3 w-3 sm:h-4 sm:w-4" />
                                      Dr. {p.responsible.name}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Main Information Grid */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-3 sm:mb-4">
                                {/* Contact Information */}
                                <div className="space-y-2 sm:space-y-3">
                                  <h6 className="font-semibold text-xs sm:text-sm text-gray-700 uppercase tracking-wide">Contact Information</h6>
                                  {p.contactPhone && (
                                    <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                                      <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 flex-shrink-0" />
                                      <span className="font-medium break-all">{p.contactPhone}</span>
                                    </div>
                                  )}
                                  {p.contactEmail && (
                                    <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                                      <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 flex-shrink-0" />
                                      <span className="font-medium break-all">{p.contactEmail}</span>
                                    </div>
                                  )}
                                  {p.website && (
                                    <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                                      <div className="h-3 w-3 sm:h-4 sm:w-4 rounded bg-purple-100 flex items-center justify-center flex-shrink-0">
                                        <span className="text-xs font-bold text-purple-600">W</span>
                                      </div>
                                      <a 
                                        href={p.website} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="font-medium text-purple-600 hover:underline break-all"
                                      >
                                        Visit Website
                                      </a>
                                    </div>
                                  )}
                                </div>

                                {/* Location Information */}
                                <div className="space-y-2 sm:space-y-3">
                                  <h6 className="font-semibold text-xs sm:text-sm text-gray-700 uppercase tracking-wide">Location</h6>
                                  {p.address && (
                                    <div className="flex items-start gap-1 sm:gap-2 text-xs sm:text-sm">
                                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-red-600 mt-0.5 flex-shrink-0" />
                                      <span className="leading-relaxed break-words">{p.address}</span>
                                    </div>
                                  )}
                                  {(p.district || p.state) && (
                                    <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground ml-4 sm:ml-6">
                                      <span className="break-words">{p.district}{p.district && p.state ? ', ' : ''}{p.state}</span>
                                      {p.pincode && <span className="text-xs bg-gray-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded flex-shrink-0">{p.pincode}</span>}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Timings and Specialization */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-3 sm:mb-4">
                                {/* Available Timings */}
                                <div className="space-y-1.5 sm:space-y-2">
                                  <h6 className="font-semibold text-xs sm:text-sm text-gray-700 uppercase tracking-wide">Available Timings</h6>
                                  {(p.timeFrom || p.timeTo) && (
                                    <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                                      <div className="h-3 w-3 sm:h-4 sm:w-4 rounded bg-green-100 flex items-center justify-center flex-shrink-0">
                                        <span className="text-xs font-bold text-green-600">T</span>
                                      </div>
                                      <span className="font-medium">
                                        {p.timeFrom && p.timeTo ? `${p.timeFrom} - ${p.timeTo}` : (p.timeFrom || p.timeTo)}
                                      </span>
                                    </div>
                                  )}
                                  {(p.dayFrom || p.dayTo) && (
                                    <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground ml-4 sm:ml-6">
                                      <span>{p.dayFrom && p.dayTo ? `${p.dayFrom} - ${p.dayTo}` : (p.dayFrom || p.dayTo)}</span>
                                    </div>
                                  )}
                                </div>

                                {/* Specialization and Council */}
                                <div className="space-y-1.5 sm:space-y-2">
                                  {(p.specialization || (p.council?.name || p.council?.number)) && (
                                    <>
                                      <h6 className="font-semibold text-xs sm:text-sm text-gray-700 uppercase tracking-wide">
                                        {p.type === 'doctor' || p.type === 'dentist' ? 'Specialization' : 'Details'}
                                      </h6>
                                      {p.specialization && (
                                        <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                                          <div className="h-3 w-3 sm:h-4 sm:w-4 rounded bg-orange-100 flex items-center justify-center flex-shrink-0">
                                            <span className="text-xs font-bold text-orange-600">S</span>
                                          </div>
                                          <span className="font-medium break-words">{p.specialization}</span>
                                        </div>
                                      )}
                                      {(p.council?.name || p.council?.number) && (
                                        <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground ml-4 sm:ml-6">
                                          <span className="break-words">{p.council?.name}{p.council?.name && p.council?.number ? ' - ' : ''}{p.council?.number}</span>
                                        </div>
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>

                              {/* Discount Information */}
                              {(p.discountAmount || (p.discountItems && p.discountItems.length > 0)) && (
                                <div className="pt-3 sm:pt-4 border-t border-gray-100">
                                  <div className="flex items-center gap-1 sm:gap-2 mb-1.5 sm:mb-2">
                                    <div className="h-4 w-4 sm:h-5 sm:w-5 rounded bg-yellow-100 flex items-center justify-center flex-shrink-0">
                                      <span className="text-xs font-bold text-yellow-600">%</span>
                                    </div>
                                    <h6 className="font-semibold text-xs sm:text-sm text-gray-700 uppercase tracking-wide">Discount Information</h6>
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                                    {p.discountAmount && (
                                      <div className="text-xs sm:text-sm">
                                        <span className="text-muted-foreground">Discount: </span>
                                        <span className="font-semibold text-green-600">{p.discountAmount}</span>
                                      </div>
                                    )}
                                    {p.discountItems && p.discountItems.length > 0 && (
                                      <div className="text-xs sm:text-sm">
                                        <span className="text-muted-foreground">Services: </span>
                                        <span className="font-medium break-words">{p.discountItems.join(', ')}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Footer with additional info */}
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 pt-3 sm:pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
                                  <span>Members served: {p.membersServed || 0}</span>
                                  <span className="hidden sm:inline">•</span>
                                  <span>Joined {new Date(p.createdAt).toLocaleDateString()}</span>
                                </div>
                                <Badge 
                                  variant="secondary" 
                                  className={`text-xs ${
                                    p.status === 'Active' 
                                      ? 'bg-green-50 text-green-700' 
                                      : p.status === 'Pending'
                                      ? 'bg-yellow-50 text-yellow-700'
                                      : 'bg-gray-50 text-gray-700'
                                  }`}
                                >
                                  {p.status}
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {partners.length === 0 && !loading && (query || selectedType !== 'all' || selectedState || selectedDistrict) && (
                    <div className="text-center py-8 sm:py-12 text-muted-foreground">
                      <Search className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-4 opacity-40" />
                      <p className="text-base sm:text-lg font-medium mb-1 sm:mb-2">No partners found</p>
                      <p className="text-xs sm:text-sm">Try adjusting your search criteria or filters</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subscription Tab */}
          <TabsContent value="subscription" className="animate-in fade-in-50">
            <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Subscription Details */}
              <Card className="border-0 shadow-lg rounded-xl sm:rounded-2xl">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 pb-3 sm:pb-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg">
                      <Shield className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl sm:text-2xl">Subscription Details</CardTitle>
                      <CardDescription className="text-sm sm:text-base">
                        Your membership information and benefits
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 sm:pt-6 space-y-4 sm:space-y-6">
                  {user ? (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div className="space-y-1">
                          <div className="text-xs sm:text-sm font-medium text-muted-foreground">Plan Type</div>
                          <div className="text-lg sm:text-xl font-semibold">{user.plan || 'Annual'}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-xs sm:text-sm font-medium text-muted-foreground">Status</div>
                          <Badge 
                            variant="outline" 
                            className={`text-xs sm:text-sm ${
                              user.status === 'Active' 
                                ? 'bg-green-50 text-green-700 border-green-200' 
                                : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                            }`}
                          >
                            {user.status}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <div className="text-xs sm:text-sm font-medium text-muted-foreground">Valid Until</div>
                          <div className="text-base sm:text-lg font-medium">
                            {user.validUntil ? new Date(user.validUntil).toLocaleDateString() : '—'}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-xs sm:text-sm font-medium text-muted-foreground">Member ID</div>
                          <div className="text-base sm:text-lg font-mono font-medium bg-muted/30 px-2 py-1 rounded break-all">
                            {user.membershipId}
                          </div>
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="pt-3 sm:pt-4 border-t">
                        <h4 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3">Contact Information</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                          <div className="p-2 sm:p-3 border rounded-lg sm:rounded-xl bg-muted/20 space-y-1">
                            <div className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 sm:gap-2">
                              <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
                              Email
                            </div>
                            <div className="font-medium text-sm sm:text-base break-all">{user?.email || '—'}</div>
                          </div>
                          <div className="p-2 sm:p-3 border rounded-lg sm:rounded-xl bg-muted/20 space-y-1">
                            <div className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 sm:gap-2">
                              <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
                              Phone
                            </div>
                            <div className="font-medium text-sm sm:text-base break-all">{user?.phone || '—'}</div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-6 sm:py-8 text-muted-foreground text-sm sm:text-base">
                      Please login to view subscription details
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Family Members & Digital Card */}
              <div className="space-y-4 sm:space-y-6">
                {/* Family Members */}
                {user?.familyMembers > 0 && Array.isArray(user?.familyDetails) && (
                  <Card className="border-0 shadow-lg rounded-xl sm:rounded-2xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-1 sm:gap-2 text-lg sm:text-xl">
                        <User className="h-4 w-4 sm:h-5 sm:w-5" />
                        Family Members ({user.familyMembers})
                      </CardTitle>
                      <CardDescription className="text-sm sm:text-base">
                        Family members covered under your plan
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 sm:space-y-3">
                        {user.familyDetails.map((m: any, idx: number) => (
                          <div 
                            key={idx} 
                            className="p-3 sm:p-4 border rounded-lg sm:rounded-xl hover:bg-muted/20 transition-colors flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2 sm:gap-3">
                              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                              </div>
                              <div>
                                <div className="font-semibold text-sm sm:text-base">{m?.name || '—'}</div>
                                <div className="text-xs sm:text-sm text-muted-foreground">
                                  Age: {m?.age ?? '—'} • {m?.gender || '—'}
                                </div>
                              </div>
                            </div>
                            <Badge variant="secondary" className="bg-blue-50 text-blue-700 text-xs">
                              {m?.relationship || '—'}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Digital Card */}
                {user && (
                  <Card className="border-0 shadow-lg rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary to-blue-600 text-white">
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0">
                        <div>
                          <CardTitle className="text-xl sm:text-2xl mb-1">{user?.name}</CardTitle>
                          <CardDescription className="text-white/80 text-sm sm:text-base">
                            Member ID: {user?.membershipId}
                          </CardDescription>
                        </div>
                        <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs sm:text-sm">
                          {user?.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3 sm:space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <div className="text-xs sm:text-sm opacity-80">Plan</div>
                          <div className="text-lg sm:text-xl font-semibold">{user?.plan}</div>
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm opacity-80">Family Discount</div>
                          <div className="text-lg sm:text-xl font-semibold">
                            {user?.familyMembers && user.familyMembers > 0 ? '10%' : '0%'}
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant="secondary" 
                        className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30 transition-all text-sm sm:text-base"
                      >
                        Download Digital Card
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Recent Visits Tab */}
          <TabsContent value="visits" className="animate-in fade-in-50">
            <Card className="border-0 shadow-lg rounded-xl sm:rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 pb-3 sm:pb-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg">
                    <History className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl sm:text-2xl">Recent Visits</CardTitle>
                    <CardDescription className="text-sm sm:text-base">
                      Your recent healthcare facility visits and savings
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 sm:pt-6">
                {recentVisits.length > 0 ? (
                  <div className="space-y-3 sm:space-y-4">
                    {recentVisits.map((visit, idx) => (
                      <div 
                        key={visit.id || idx} 
                        className="p-3 sm:p-4 border rounded-lg sm:rounded-xl hover:shadow-md transition-all duration-200 bg-white"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0">
                          <div className="flex gap-3 sm:gap-4 items-start">
                            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg sm:rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                              <MapPin className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-purple-600" />
                            </div>
                            <div>
                              <div className="font-semibold text-base sm:text-lg mb-1">{visit.facility}</div>
                              <div className="text-muted-foreground text-sm sm:text-base mb-1 sm:mb-2">{visit.service}</div>
                              <div className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 sm:gap-2">
                                <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                                {visit.date}
                              </div>
                            </div>
                          </div>
                          <div className="text-left sm:text-right">
                            <div className="text-xs sm:text-sm text-muted-foreground">You Saved</div>
                            <div className="font-bold text-base sm:text-lg text-green-600">{visit.discount}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 sm:py-12 text-muted-foreground">
                    <Calendar className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-4 opacity-40" />
                    <p className="text-base sm:text-lg font-medium mb-1 sm:mb-2">No visits recorded yet</p>
                    <p className="text-xs sm:text-sm">Your healthcare visits will appear here once you start using our services</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
