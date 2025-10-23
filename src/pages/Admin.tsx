import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Users, Building2, CreditCard, MessageCircle, Calendar, FileText, CheckCircle, XCircle, Eye, Download, Filter, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import React from 'react';
import { apiUrl } from "@/lib/api";
import { Input } from "@/components/ui/input";

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState("partner-requests");
  const [stats, setStats] = React.useState([
    { label: "Total Members", value: "Loading...", change: "", icon: Users, color: "text-blue-600" },
    { label: "Active Partners", value: "Loading...", change: "", icon: Building2, color: "text-green-600" },
    { label: "Pending Queries", value: "Loading...", change: "", icon: MessageCircle, color: "text-orange-600" },
    { label: "Monthly Revenue", value: "₹24.5L", change: "+18%", icon: CreditCard, color: "text-purple-600" },
  ]);

  const [recentMembers, setRecentMembers] = React.useState([
    { name: "Loading...", plan: "", date: "", status: "" }
  ]);

  const [recentPartners, setRecentPartners] = React.useState([
    { name: "Loading...", type: "", members: 0, status: "" }
  ]);

  const [applications, setApplications] = React.useState<any[]>([]);
  const [queries, setQueries] = React.useState<any[]>([]);
  const [queryStats, setQueryStats] = React.useState({
    totalQueries: 0,
    pendingQueries: 0,
    resolvedToday: 0
  });
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(() => {
    try {
      const t = localStorage.getItem('token');
      if (!t) return false;
      const payload = JSON.parse(atob(t.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      return !!payload?.isAdmin;
    } catch (e) {
      return false;
    }
  });
  const [selectedApp, setSelectedApp] = React.useState<any | null>(null);
  const [appDialogOpen, setAppDialogOpen] = React.useState(false);
  const [viewerImage, setViewerImage] = React.useState<string | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = React.useState(false);
  const [selectedQuery, setSelectedQuery] = React.useState<any>(null);
  const [searchTerm, setSearchTerm] = React.useState("");

  // Pagination and data for all users/partners
  const [allUsers, setAllUsers] = React.useState<any[]>([]);
  const [allPartners, setAllPartners] = React.useState<any[]>([]);
  const [usersPagination, setUsersPagination] = React.useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [partnersPagination, setPartnersPagination] = React.useState({
    currentPage: 1,
    totalPages: 1,
    totalPartners: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [usersSearch, setUsersSearch] = React.useState("");
  const [partnersSearch, setPartnersSearch] = React.useState("");

  // Delete confirmation dialogs
  const [deletePartnerDialog, setDeletePartnerDialog] = React.useState(false);
  const [deleteUserDialog, setDeleteUserDialog] = React.useState(false);
  const [partnerToDelete, setPartnerToDelete] = React.useState<any>(null);
  const [userToDelete, setUserToDelete] = React.useState<any>(null);
  
  const BACKEND_ORIGIN = (import.meta.env.VITE_API_BASE_URL as string) || `${window.location.protocol}//${window.location.hostname}:5000`;
  const assetUrl = (p?: string) => {
    if (!p) return '';
    // If it's already a data URL (base64), return as-is
    if (p.startsWith('data:')) return p;
    if (p.startsWith('http://') || p.startsWith('https://')) return p;
    // Ensure the path starts with uploads/ for proper static serving
    const path = p.startsWith('uploads/') ? p : (p.startsWith('/') ? p.slice(1) : p);
    return `${BACKEND_ORIGIN}/${path}`;
  };

  // Data loading functions (same as before)
  const loadApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(apiUrl('api/partners/applications'), { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) return;
      const apps = await res.json();
      setApplications(apps);
    } catch (err) {
      console.error(err);
    }
  };

  const loadStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(apiUrl('api/partners/stats'), { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) return;
      const data = await res.json();
      setStats([
        { label: "Total Members", value: data.totalUsers.toString(), change: "", icon: Users, color: "text-blue-600" },
        { label: "Active Partners", value: data.approvedPartners.toString(), change: "", icon: Building2, color: "text-green-600" },
        { label: "Pending Queries", value: queryStats.pendingQueries.toString(), change: "", icon: MessageCircle, color: "text-orange-600" },
        { label: "Monthly Revenue", value: "₹24.5L", change: "+18%", icon: CreditCard, color: "text-purple-600" },
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  const loadRecentMembers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(apiUrl('api/partners/recent-members'), { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) return;
      const data = await res.json();
      setRecentMembers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadRecentPartners = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(apiUrl('api/partners/recent-partners'), { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) return;
      const data = await res.json();
      setRecentPartners(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadQueries = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(apiUrl('api/contact/queries?limit=50'), { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) return;
      const data = await res.json();
      setQueries(data.queries);
    } catch (err) {
      console.error(err);
    }
  };

  const loadQueryStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(apiUrl('api/contact/stats'), { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) return;
      const data = await res.json();
      setQueryStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadAllUsers = async (page: number = 1, search: string = "") => {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({ page: page.toString(), limit: '10' });
      if (search) params.append('search', search);
      const res = await fetch(apiUrl(`api/partners/all-users?${params}`), { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) return;
      const data = await res.json();
      setAllUsers(data.users);
      setUsersPagination(data.pagination);
    } catch (err) {
      console.error('Load all users error:', err);
    }
  };

  const loadAllPartners = async (page: number = 1, search: string = "") => {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({ page: page.toString(), limit: '10' });
      if (search) params.append('search', search);
      const res = await fetch(apiUrl(`api/partners/all-partners?${params}`), { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) return;
      const data = await res.json();
      setAllPartners(data.partners);
      setPartnersPagination(data.pagination);
    } catch (err) {
      console.error('Load all partners error:', err);
    }
  };

  React.useEffect(() => {
    loadApplications();
    loadStats();
    loadRecentMembers();
    loadRecentPartners();
    loadQueries();
    loadQueryStats();
    loadAllUsers();
    loadAllPartners();
  }, []);

  // Action functions (same as before)
  const approve = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(apiUrl(`api/partners/applications/${id}/approve`), { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) loadApplications();
    } catch (err) { console.error(err); }
  };

  const reject = async (id: string) => {
    const reason = prompt('Reason for rejection (optional)') || '';
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(apiUrl(`api/partners/applications/${id}/reject`), { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ reason }) });
      if (res.ok) loadApplications();
    } catch (err) { console.error(err); }
  };

  const updateQueryStatus = async (id: string, status: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(apiUrl(`api/contact/queries/${id}/status`), {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        loadQueries();
        loadQueryStats();
        loadStats();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteQuery = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(apiUrl(`api/contact/queries/${id}`), {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        loadQueries();
        loadQueryStats();
        loadStats();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deletePartner = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(apiUrl(`api/partners/partners/${id}`), {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        loadAllPartners();
        loadStats();
        setDeletePartnerDialog(false);
        setPartnerToDelete(null);
      }
    } catch (err) {
      console.error('Delete partner error:', err);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(apiUrl(`api/partners/users/${id}`), {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        loadAllUsers();
        loadStats();
        setDeleteUserDialog(false);
        setUserToDelete(null);
      }
    } catch (err) {
      console.error('Delete user error:', err);
    }
  };

  const openAppDialog = (app:any) => { setSelectedApp(app); setAppDialogOpen(true); };
  const closeAppDialog = () => { setSelectedApp(null); setAppDialogOpen(false); };
  const openViewer = (src:string) => setViewerImage(src);
  const closeViewer = () => setViewerImage(null);
  const viewQuery = (query: any) => {
    setSelectedQuery(query);
    setViewDialogOpen(true);
  };

  // Filter applications based on search
  const filteredApplications = applications.filter(app => 
    app.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.state?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.district?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter queries based on search
  const filteredQueries = queries.filter(query =>
    query.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    query.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    query.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    query.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
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
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-xs">
              Admin
            </Badge>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => { localStorage.removeItem('token'); navigate('/'); }}
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
          <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-2 bg-primary/10 rounded-full mb-2 sm:mb-3">
            <Building2 className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
            <span className="text-xs sm:text-sm font-medium text-primary">Admin Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Platform Management
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl">
            Manage partner applications, user queries, and monitor platform performance
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {stats.map((stat, idx) => (
            <Card key={idx} className="border-0 shadow-sm rounded-xl sm:rounded-2xl hover:shadow-md transition-all duration-200">
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="text-xs sm:text-sm text-muted-foreground mb-1 truncate">{stat.label}</div>
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold mb-1 truncate">{stat.value}</div>
                    <div className="text-xs text-accent">{stat.change}</div>
                  </div>
                  <div className={`p-2 bg-primary/10 rounded-lg flex-shrink-0 ml-2 ${stat.color}`}>
                    <stat.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 p-1 bg-muted/50 rounded-lg sm:rounded-xl h-auto gap-1">
            <TabsTrigger 
              value="partner-requests" 
              className="flex items-center gap-1 sm:gap-2 py-2 sm:py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md sm:rounded-lg transition-all text-xs sm:text-sm"
            >
              <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="truncate">Partners</span>
              {applications.length > 0 && (
                <Badge variant="destructive" className="h-4 w-4 sm:h-5 sm:w-5 p-0 flex items-center justify-center text-xs">
                  {applications.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="queries" 
              className="flex items-center gap-1 sm:gap-2 py-2 sm:py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md sm:rounded-lg transition-all text-xs sm:text-sm"
            >
              <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="truncate">Queries</span>
              {queryStats.pendingQueries > 0 && (
                <Badge variant="destructive" className="h-4 w-4 sm:h-5 sm:w-5 p-0 flex items-center justify-center text-xs">
                  {queryStats.pendingQueries}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="manage-partners" 
              className="flex items-center gap-1 sm:gap-2 py-2 sm:py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md sm:rounded-lg transition-all text-xs sm:text-sm"
            >
              <Building2 className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="truncate">Partners</span>
            </TabsTrigger>
            <TabsTrigger 
              value="manage-users" 
              className="flex items-center gap-1 sm:gap-2 py-2 sm:py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md sm:rounded-lg transition-all text-xs sm:text-sm"
            >
              <Users className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="truncate">Users</span>
            </TabsTrigger>
          </TabsList>

          {/* Partner Requests Tab */}
          <TabsContent value="partner-requests" className="animate-in fade-in-50">
            <Card className="border-0 shadow-lg rounded-xl sm:rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-3 sm:pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-1 sm:p-2 bg-blue-100 rounded-lg">
                      <FileText className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl sm:text-2xl">Partner Applications</CardTitle>
                      <CardDescription className="text-sm sm:text-base">
                        Review and approve partner registration requests
                      </CardDescription>
                    </div>
                  </div>
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search applications..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-7 sm:pl-10 rounded-lg sm:rounded-xl border-muted-foreground/20 text-sm"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 sm:pt-6">
                {filteredApplications.length === 0 ? (
                  <div className="text-center py-8 sm:py-12 text-muted-foreground">
                    <FileText className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-4 opacity-40" />
                    <p className="text-base sm:text-lg font-medium mb-1 sm:mb-2">
                      {applications.length === 0 ? "No pending applications" : "No applications match your search"}
                    </p>
                    <p className="text-xs sm:text-sm">
                      {applications.length === 0 
                        ? "All partner applications have been processed" 
                        : "Try adjusting your search criteria"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {filteredApplications.map((app) => (
                      <Card key={app._id} className="border-muted-foreground/20 hover:border-blue-300 hover:shadow-md transition-all duration-200">
                        <CardContent className="p-3 sm:p-4 lg:p-6">
                          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3 sm:gap-4">
                            <div className="flex-1 space-y-2 sm:space-y-3 min-w-0">
                              <div className="flex flex-col xs:flex-row xs:items-center gap-1 sm:gap-2">
                                <h3 className="font-semibold text-base sm:text-lg truncate">{app.name}</h3>
                                <div className="flex gap-1 sm:gap-2">
                                  <Badge variant="outline" className="capitalize w-fit bg-blue-50 text-blue-700 border-blue-200 text-xs">
                                    {app.type}
                                  </Badge>
                                  <Badge variant={app.status === 'pending' ? 'secondary' : app.status === 'approved' ? 'default' : 'destructive'} className="text-xs">
                                    {app.status}
                                  </Badge>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-1 xs:grid-cols-2 gap-1 sm:gap-2 text-xs sm:text-sm">
                                <div className="flex items-center gap-1 sm:gap-2 truncate">
                                  <span className="text-muted-foreground">Contact:</span>
                                  <span className="truncate">{app.contactEmail} • {app.contactPhone}</span>
                                </div>
                                <div className="flex items-center gap-1 sm:gap-2 truncate">
                                  <span className="text-muted-foreground">Location:</span>
                                  <span className="truncate">{app.district}, {app.state}</span>
                                </div>
                                <div className="flex items-center gap-1 sm:gap-2 truncate xs:col-span-2">
                                  <span className="text-muted-foreground">Responsible:</span>
                                  <span className="truncate">{app.responsible?.name} • {app.responsible?.sex} • {app.responsible?.age}</span>
                                </div>
                              </div>

                              <div className="flex gap-1 sm:gap-2 flex-wrap">
                                {app.passportPhoto && (
                                  <img 
                                    src={assetUrl(app.passportPhoto)} 
                                    alt="passport" 
                                    className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 object-cover rounded cursor-pointer border hover:shadow-md transition-all"
                                    onClick={() => openViewer(assetUrl(app.passportPhoto))}
                                    onError={(e) => {
                                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDMTMuMSAyIDE0IDIuOSAxNCA0VjE2QzE0IDE3LjEgMTMuMSAxOCA5LjUgMTJDOS41IDE4IDkgMTcuMSAxOSA5QzkgOC45IDkuMSAxOCA5LjUgMTJDOS41IDE4IDEwIDE3LjEgMTAgMTZWMTRDMTAgMi45IDEwLjkgMiAxMiAyWk0xMiA3QzEyLjU1IDcgMTMgNy40NSAxMyA4UzEyLjU1IDkgMTIgOVMxMSA4LjU1IDExIDhTMTIuNDUgNyAxMiA3Wk0xMiAxNWMtMS42NiAwLTMtMS4zNC0zLTNTMTAuMzQgMTMgMTIgMTNTMTQuMzQgMTYgMTYgMTZTMzMuNjYgMTUgMTIgMTVaIiBmaWxsPSIjOWNhM2FmIi8+Cjwvc3ZnPgo=';
                                      e.currentTarget.alt = 'Image not available';
                                    }}
                                  />
                                )}
                                {app.certificateFile && (
                                  app.certificateFile.includes('application/pdf') || app.certificateFile.toLowerCase().includes('.pdf') ? (
                                    <a
                                      href={assetUrl(app.certificateFile)}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="flex items-center gap-1 sm:gap-2 px-2 py-1 sm:px-3 sm:py-2 border rounded text-xs hover:bg-blue-50 transition-colors"
                                    >
                                      <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
                                      <span className="hidden xs:inline">Certificate PDF</span>
                                      <span className="xs:hidden">PDF</span>
                                    </a>
                                  ) : (
                                    <img
                                      src={assetUrl(app.certificateFile)}
                                      alt="certificate"
                                      className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 object-cover rounded cursor-pointer border hover:shadow-md transition-all"
                                      onClick={() => openViewer(assetUrl(app.certificateFile))}
                                      onError={(e) => {
                                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDMTMuMSAyIDE0IDIuOSAxNCA0VjE2QzE0IDE3LjEgMTMuMSAxOCA5LjUgMTJDOS41IDE4IDkgMTcuMSAxOSA5QzkgOC45IDkuMSAxOCA5LjUgMTJDOS41IDE4IDEwIDE3LjEgMTAgMTZWMTRDMTAgMi45IDEwLjkgMiAxMiAyWk0xMiA3QzEyLjU1IDcgMTMgNy40NSAxMyA4UzEyLjU1IDkgMTIgOVMxMSA4LjU1IDExIDhTMTIuNDUgNyAxMiA3Wk0xMiAxNWMtMS42NiAwLTMtMS4zNC0zLTNTMTAuMzQgMTMgMTIgMTNTMTQuMzQgMTYgMTYgMTZTMzMuNjYgMTUgMTIgMTVaIiBmaWxsPSIjOWNhM2FmIi8+Cjwvc3ZnPgo=';
                                        e.currentTarget.alt = 'Image not available';
                                      }}
                                    />
                                  )
                                )}
                                {app.clinicPhotos && app.clinicPhotos.map((p: string, i: number) => (
                                  <img 
                                    key={i}
                                    src={assetUrl(p)} 
                                    alt={`clinic-${i}`} 
                                    className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 object-cover rounded cursor-pointer border hover:shadow-md transition-all"
                                    onClick={() => openViewer(assetUrl(p))}
                                    onError={(e) => {
                                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDMTMuMSAyIDE0IDIuOSAxNCA0VjE2QzE0IDE3LjEgMTMuMSAxOCA5LjUgMTJDOS41IDE4IDkgMTcuMSAxOSA5QzkgOC45IDkuMSAxOCA5LjUgMTJDOS41IDE4IDEwIDE3LjEgMTAgMTZWMTRDMTAgMi45IDEwLjkgMiAxMiAyWk0xMiA3QzEyLjU1IDcgMTMgNy40NSAxMyA4UzEyLjU1IDkgMTIgOVMxMSA4LjU1IDExIDhTMTIuNDUgNyAxMiA3Wk0xMiAxNWMtMS42NiAwLTMtMS4zNC0zLTNTMTAuMzQgMTMgMTIgMTNTMTQuMzQgMTYgMTYgMTZTMzMuNjYgMTUgMTIgMTVaIiBmaWxsPSIjOWNhM2FmIi8+Cjwvc3ZnPgo=';
                                      e.currentTarget.alt = 'Image not available';
                                    }}
                                  />
                                ))}
                              </div>
                            </div>

                            <div className="flex flex-row sm:flex-col gap-1 sm:gap-2 w-full sm:w-auto">
                              <Button variant="outline" size="sm" onClick={() => openAppDialog(app)} className="flex items-center gap-1 sm:gap-2 flex-1 sm:flex-none text-xs">
                                <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                                <span className="hidden sm:inline">View</span>
                              </Button>
                              <Button 
                                size="sm" 
                                onClick={() => approve(app._id)}
                                className="flex items-center gap-1 sm:gap-2 flex-1 sm:flex-none text-xs bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                                <span className="hidden sm:inline">Approve</span>
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm" 
                                onClick={() => reject(app._id)}
                                className="flex items-center gap-1 sm:gap-2 flex-1 sm:flex-none text-xs"
                              >
                                <XCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                                <span className="hidden sm:inline">Reject</span>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Queries Tab */}
          <TabsContent value="queries" className="animate-in fade-in-50">
            <Card className="border-0 shadow-lg rounded-xl sm:rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 pb-3 sm:pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-1 sm:p-2 bg-orange-100 rounded-lg">
                      <MessageCircle className="h-4 w-4 sm:h-6 sm:w-6 text-orange-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl sm:text-2xl">User Queries</CardTitle>
                      <CardDescription className="text-sm sm:text-base">
                        Manage and respond to user support requests
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-4">
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      <span className="font-semibold text-orange-600">{queryStats.pendingQueries}</span> pending
                    </div>
                    <div className="relative w-32 xs:w-40 sm:w-64">
                      <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search queries..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-7 sm:pl-10 rounded-lg sm:rounded-xl border-muted-foreground/20 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 sm:pt-6">
                {filteredQueries.length === 0 ? (
                  <div className="text-center py-8 sm:py-12 text-muted-foreground">
                    <MessageCircle className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-4 opacity-40" />
                    <p className="text-base sm:text-lg font-medium mb-1 sm:mb-2">
                      {queries.length === 0 ? "No queries found" : "No queries match your search"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {filteredQueries.map((query) => (
                      <Card key={query._id} className="border-muted-foreground/20 hover:shadow-md transition-all duration-200">
                        <CardContent className="p-3 sm:p-4 lg:p-6">
                          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3 sm:gap-4">
                            <div className="flex-1 space-y-2 sm:space-y-3 min-w-0">
                              <div className="flex flex-col xs:flex-row xs:items-center gap-1 sm:gap-2">
                                <h3 className="font-semibold text-base sm:text-lg truncate">{query.subject}</h3>
                                <Badge variant={query.status === 'pending' ? 'destructive' : query.status === 'resolved' ? 'default' : 'secondary'} className="text-xs w-fit">
                                  {query.status}
                                </Badge>
                              </div>
                              
                              <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                                {query.message}
                              </p>

                              <div className="grid grid-cols-1 xs:grid-cols-2 gap-1 sm:gap-2 text-xs sm:text-sm">
                                <div className="flex items-center gap-1 sm:gap-2 truncate">
                                  <span className="text-muted-foreground">From:</span>
                                  <span className="truncate">{query.name} ({query.email})</span>
                                </div>
                                <div className="flex items-center gap-1 sm:gap-2 truncate">
                                  <span className="text-muted-foreground">User Type:</span>
                                  <span>{query.userType}</span>
                                </div>
                                <div className="flex items-center gap-1 sm:gap-2 truncate xs:col-span-2">
                                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                                  <span>{new Date(query.createdAt).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-row sm:flex-col gap-1 sm:gap-2 w-full sm:w-auto">
                              <Button variant="outline" size="sm" onClick={() => viewQuery(query)} className="flex items-center gap-1 sm:gap-2 flex-1 sm:flex-none text-xs">
                                <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                                <span className="hidden sm:inline">View</span>
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => updateQueryStatus(query._id, 'resolved')}
                                className="flex items-center gap-1 sm:gap-2 flex-1 sm:flex-none text-xs text-green-600 hover:text-green-700"
                              >
                                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                                <span className="hidden sm:inline">Resolve</span>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Manage Partners Tab */}
          <TabsContent value="manage-partners" className="animate-in fade-in-50">
            <Card className="border-0 shadow-lg rounded-xl sm:rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 pb-3 sm:pb-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-1 sm:p-2 bg-green-100 rounded-lg">
                    <Building2 className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl sm:text-2xl">Active Partners</CardTitle>
                    <CardDescription className="text-sm sm:text-base">
                      View all active healthcare partners ({partnersPagination.totalPartners} total)
                    </CardDescription>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search partners by name, clinic name, email, or facility type..."
                      value={partnersSearch}
                      onChange={(e) => {
                        setPartnersSearch(e.target.value);
                        loadAllPartners(1, e.target.value);
                      }}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 sm:pt-6">
                <div className="space-y-3 sm:space-y-4">
                  {allPartners.map((partner, idx) => (
                    <Card key={partner._id || idx} className="border-muted-foreground/20 hover:shadow-md transition-all duration-200">
                      <CardContent className="p-3 sm:p-4 lg:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                          <div className="space-y-1 sm:space-y-2 min-w-0 flex-1">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <h3 className="font-semibold text-base sm:text-lg truncate">{partner.name || partner.clinicName}</h3>
                              <Badge variant="outline" className="capitalize bg-green-50 text-green-700 border-green-200 text-xs">
                                {partner.facilityType || partner.type}
                              </Badge>
                            </div>
                            <div className="text-xs sm:text-sm text-muted-foreground">
                              {partner.email || partner.contactEmail} • {partner.contactPhone || partner.phone || 'N/A'}
                            </div>
                            <div className="text-xs sm:text-sm text-muted-foreground">
                              {partner.address} • {partner.membersServed || 0} members served
                            </div>
                            <div className="text-xs sm:text-sm text-muted-foreground">
                              Joined {new Date(partner.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 sm:gap-3">
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              className="text-xs sm:text-sm"
                              onClick={() => {
                                setPartnerToDelete(partner);
                                setDeletePartnerDialog(true);
                              }}
                            >
                              <XCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {partnersPagination.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-muted-foreground">
                      Showing {((partnersPagination.currentPage - 1) * 10) + 1} to {Math.min(partnersPagination.currentPage * 10, partnersPagination.totalPartners)} of {partnersPagination.totalPartners} partners
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => loadAllPartners(partnersPagination.currentPage - 1, partnersSearch)}
                        disabled={!partnersPagination.hasPrevPage}
                      >
                        Previous
                      </Button>
                      <span className="text-sm text-muted-foreground px-2">
                        Page {partnersPagination.currentPage} of {partnersPagination.totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => loadAllPartners(partnersPagination.currentPage + 1, partnersSearch)}
                        disabled={!partnersPagination.hasNextPage}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Manage Users Tab */}
          <TabsContent value="manage-users" className="animate-in fade-in-50">
            <Card className="border-0 shadow-lg rounded-xl sm:rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 pb-3 sm:pb-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-1 sm:p-2 bg-purple-100 rounded-lg">
                    <Users className="h-4 w-4 sm:h-6 sm:w-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl sm:text-2xl">All Users</CardTitle>
                    <CardDescription className="text-sm sm:text-base">
                      View and manage all platform users ({usersPagination.totalUsers} total)
                    </CardDescription>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users by name, email, or membership ID..."
                      value={usersSearch}
                      onChange={(e) => {
                        setUsersSearch(e.target.value);
                        loadAllUsers(1, e.target.value);
                      }}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 sm:pt-6">
                <div className="space-y-3 sm:space-y-4">
                  {allUsers.map((user, idx) => (
                    <Card key={user._id || idx} className="border-muted-foreground/20 hover:shadow-md transition-all duration-200">
                      <CardContent className="p-3 sm:p-4 lg:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                          <div className="space-y-1 sm:space-y-2 min-w-0 flex-1">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <h3 className="font-semibold text-base sm:text-lg truncate">{user.name}</h3>
                              <Badge variant="outline" className="capitalize bg-purple-50 text-purple-700 border-purple-200 text-xs">
                                {user.plan}
                              </Badge>
                            </div>
                            <div className="text-xs sm:text-sm text-muted-foreground">
                              {user.email} • {user.membershipId}
                            </div>
                            <div className="text-xs sm:text-sm text-muted-foreground">
                              Joined {new Date(user.createdAt).toLocaleDateString()} • Valid until {new Date(user.validUntil).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 sm:gap-3">
                            <Badge variant="secondary" className="text-xs">Active</Badge>
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              className="text-xs sm:text-sm"
                              onClick={() => {
                                setUserToDelete(user);
                                setDeleteUserDialog(true);
                              }}
                            >
                              <XCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {usersPagination.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-muted-foreground">
                      Showing {((usersPagination.currentPage - 1) * 10) + 1} to {Math.min(usersPagination.currentPage * 10, usersPagination.totalUsers)} of {usersPagination.totalUsers} users
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => loadAllUsers(usersPagination.currentPage - 1, usersSearch)}
                        disabled={!usersPagination.hasPrevPage}
                      >
                        Previous
                      </Button>
                      <span className="text-sm text-muted-foreground px-2">
                        Page {usersPagination.currentPage} of {usersPagination.totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => loadAllUsers(usersPagination.currentPage + 1, usersSearch)}
                        disabled={!usersPagination.hasNextPage}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Application Detail Dialog */}
      <Dialog open={appDialogOpen} onOpenChange={setAppDialogOpen}>
        <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-hidden mx-2 sm:mx-4">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl">Application Details</DialogTitle>
            <DialogDescription className="text-sm sm:text-base">Review all details before making a decision</DialogDescription>
          </DialogHeader>
          {selectedApp && (
            <div className="max-h-[60vh] overflow-y-auto pr-1 sm:pr-2 space-y-6 sm:space-y-8 mt-2">
              {/* Personal Details Section */}
              <section className="space-y-4 sm:space-y-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-1.5 h-6 sm:w-2 sm:h-8 bg-blue-600 rounded-full"></div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Personal Details</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-1">
                    <h4 className="font-semibold text-xs sm:text-sm text-muted-foreground">Full Name</h4>
                    <div className="text-sm sm:text-base">{selectedApp.responsible?.name || 'Not specified'}</div>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-xs sm:text-sm text-muted-foreground">Age</h4>
                    <div className="text-sm sm:text-base">{selectedApp.responsible?.age || 'Not specified'}</div>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-xs sm:text-sm text-muted-foreground">Sex</h4>
                    <div className="text-sm sm:text-base">{selectedApp.responsible?.sex || 'Not specified'}</div>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-xs sm:text-sm text-muted-foreground">Date of Birth</h4>
                    <div className="text-sm sm:text-base">{selectedApp.responsible?.dob || 'Not specified'}</div>
                  </div>
                </div>
              </section>

              {/* Business Details Section */}
              <section className="space-y-4 sm:space-y-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-1.5 h-6 sm:w-2 sm:h-8 bg-green-600 rounded-full"></div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Business Details</h3>
                </div>
                <div className="space-y-4 sm:space-y-6">
                  <div className="space-y-1">
                    <h4 className="font-semibold text-xs sm:text-sm text-muted-foreground">
                      {selectedApp.type === 'doctor' ? 'Clinic Name' : 'Center/Business Name'}
                    </h4>
                    <div className="text-sm sm:text-base">{selectedApp.name || 'Not specified'}</div>
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="font-semibold text-xs sm:text-sm text-muted-foreground">Address</h4>
                    <div className="text-sm sm:text-base">{selectedApp.address || 'Not specified'}</div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <div className="space-y-1">
                      <h4 className="font-semibold text-xs sm:text-sm text-muted-foreground">State</h4>
                      <div className="text-sm sm:text-base">{selectedApp.state || 'Not specified'}</div>
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-semibold text-xs sm:text-sm text-muted-foreground">District</h4>
                      <div className="text-sm sm:text-base">{selectedApp.district || 'Not specified'}</div>
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-semibold text-xs sm:text-sm text-muted-foreground">Pincode</h4>
                      <div className="text-sm sm:text-base">{selectedApp.pincode || 'Not specified'}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-1">
                      <h4 className="font-semibold text-xs sm:text-sm text-muted-foreground">Available Timings</h4>
                      <div className="text-sm sm:text-base">
                        {selectedApp.timeFrom && selectedApp.timeTo ? `${selectedApp.timeFrom} - ${selectedApp.timeTo}` : 'Not specified'}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-semibold text-xs sm:text-sm text-muted-foreground">Available Days</h4>
                      <div className="text-sm sm:text-base">
                        {selectedApp.dayFrom && selectedApp.dayTo ? `${selectedApp.dayFrom} - ${selectedApp.dayTo}` : 'Not specified'}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-semibold text-xs sm:text-sm text-muted-foreground">Website</h4>
                    <div className="text-sm sm:text-base">
                      {selectedApp.website ? (
                        <a href={selectedApp.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                          {selectedApp.website}
                        </a>
                      ) : 'Not specified'}
                    </div>
                  </div>
                </div>
              </section>

              {/* Contact & Login Information Section */}
              <section className="space-y-4 sm:space-y-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-1.5 h-6 sm:w-2 sm:h-8 bg-purple-600 rounded-full"></div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Contact & Login Information</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-1">
                    <h4 className="font-semibold text-xs sm:text-sm text-muted-foreground">Contact Email</h4>
                    <div className="text-sm sm:text-base break-all">{selectedApp.contactEmail || 'Not specified'}</div>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-xs sm:text-sm text-muted-foreground">Contact Phone</h4>
                    <div className="text-sm sm:text-base">{selectedApp.contactPhone || 'Not specified'}</div>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-xs sm:text-sm text-muted-foreground">Login Email</h4>
                    <div className="text-sm sm:text-base break-all">{selectedApp.email || 'Not specified'}</div>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-xs sm:text-sm text-muted-foreground">Partner Type</h4>
                    <div className="text-sm sm:text-base capitalize">{selectedApp.type || 'Not specified'}</div>
                  </div>
                </div>
              </section>

              {/* Registration Details Section */}
              <section className="space-y-4 sm:space-y-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-1.5 h-6 sm:w-2 sm:h-8 bg-orange-600 rounded-full"></div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Registration Details</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-1">
                    <h4 className="font-semibold text-xs sm:text-sm text-muted-foreground">Council Name</h4>
                    <div className="text-sm sm:text-base">{selectedApp.council?.name || 'Not specified'}</div>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-xs sm:text-sm text-muted-foreground">Council Number</h4>
                    <div className="text-sm sm:text-base">{selectedApp.council?.number || 'Not specified'}</div>
                  </div>
                  {(selectedApp.type === 'doctor' || selectedApp.type === 'dentist') && (
                    <div className="space-y-1 sm:col-span-2">
                      <h4 className="font-semibold text-xs sm:text-sm text-muted-foreground">Specialization</h4>
                      <div className="text-sm sm:text-base">{selectedApp.specialization || 'Not specified'}</div>
                    </div>
                  )}
                </div>
              </section>

              {/* Document Uploads Section */}
              <section className="space-y-4 sm:space-y-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-1.5 h-6 sm:w-2 sm:h-8 bg-red-600 rounded-full"></div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Document Uploads</h3>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <h4 className="font-semibold mb-1 sm:mb-2 text-xs sm:text-sm text-muted-foreground">Passport Photo</h4>
                    {selectedApp.passportPhoto ? (
                      <img 
                        src={assetUrl(selectedApp.passportPhoto)} 
                        alt="passport" 
                        className="h-24 w-24 sm:h-32 sm:w-32 object-cover rounded-lg cursor-pointer border hover:shadow-md transition-all"
                        onClick={() => openViewer(assetUrl(selectedApp.passportPhoto))}
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDMTMuMSAyIDE0IDIuOSAxNCA0VjE2QzE0IDE3LjEgMTMuMSAxOCA5LjUgMTJDOS41IDE4IDkgMTcuMSAxOSA5QzkgOC45IDkuMSAxOCA5LjUgMTJDOS41IDE4IDEwIDE3LjEgMTAgMTZWMTRDMTAgMi45IDEwLjkgMiAxMiAyWk0xMiA3QzEyLjU1IDcgMTMgNy40NSAxMyA4UzEyLjU1IDkgMTIgOVMxMSA4LjU1IDExIDhTMTIuNDUgNyAxMiA3Wk0xMiAxNWMtMS42NiAwLTMtMS4zNC0zLTNTMTAuMzQgMTMgMTIgMTNTMTQuMzQgMTYgMTYgMTZTMzMuNjYgMTUgMTIgMTVaIiBmaWxsPSIjOWNhM2FmIi8+Cjwvc3ZnPgo=';
                          e.currentTarget.alt = 'Image not available';
                        }}
                      />
                    ) : (
                      <div className="text-xs sm:text-sm text-muted-foreground">No passport image uploaded</div>
                    )}
                  </div>

                  <div>
                    <h4 className="font-semibold mb-1 sm:mb-2 text-xs sm:text-sm text-muted-foreground">Certificate</h4>
                    {selectedApp.certificateFile ? (
                      selectedApp.certificateFile.includes('application/pdf') || selectedApp.certificateFile.toLowerCase().endsWith('.pdf') ? (
                        <a 
                          href={assetUrl(selectedApp.certificateFile)} 
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 sm:gap-2 px-3 py-1 sm:px-4 sm:py-2 border rounded-lg hover:bg-blue-50 transition-colors text-xs sm:text-sm"
                        >
                          <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
                          View Certificate (PDF)
                        </a>
                      ) : (
                        <img 
                          src={assetUrl(selectedApp.certificateFile)} 
                          alt="certificate" 
                          className="h-24 w-32 sm:h-32 sm:w-48 object-cover rounded-lg cursor-pointer border hover:shadow-md transition-all"
                          onClick={() => openViewer(assetUrl(selectedApp.certificateFile))}
                          onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDMTMuMSAyIDE0IDIuOSAxNCA0VjE2QzE0IDE3LjEgMTMuMSAxOCA5LjUgMTJDOS41IDE4IDkgMTcuMSAxOSA5QzkgOC45IDkuMSAxOCA5LjUgMTJDOS41IDE4IDEwIDE3LjEgMTAgMTZWMTRDMTAgMi45IDEwLjkgMiAxMiAyWk0xMiA3QzEyLjU1IDcgMTMgNy40NSAxMyA4UzEyLjU1IDkgMTIgOVMxMSA4LjU1IDExIDhTMTIuNDUgNyAxMiA3Wk0xMiAxNWMtMS42NiAwLTMtMS4zNC0zLTNTMTAuMzQgMTMgMTIgMTNTMTQuMzQgMTYgMTYgMTZTMzMuNjYgMTUgMTIgMTVaIiBmaWxsPSIjOWNhM2FmIi8+Cjwvc3ZnPgo=';
                            e.currentTarget.alt = 'Image not available';
                          }}
                        />
                      )
                    ) : (
                      <div className="text-xs sm:text-sm text-muted-foreground">No certificate uploaded</div>
                    )}
                  </div>

                  {(selectedApp.type === 'doctor' || selectedApp.type === 'dentist') && selectedApp.clinicPhotos && selectedApp.clinicPhotos.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-1 sm:mb-2 text-xs sm:text-sm text-muted-foreground">Clinic Photos ({selectedApp.clinicPhotos.length})</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
                        {selectedApp.clinicPhotos.map((photo: string, index: number) => (
                          <img 
                            key={index}
                            src={assetUrl(photo)} 
                            alt={`clinic-${index + 1}`} 
                            className="h-16 sm:h-20 w-full object-cover rounded-lg cursor-pointer border hover:shadow-md transition-all"
                            onClick={() => openViewer(assetUrl(photo))}
                            onError={(e) => {
                              e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDMTMuMSAyIDE0IDIuOSAxNCA0VjE2QzE0IDE3LjEgMTMuMSAxOCA5LjUgMTJDOS41IDE4IDkgMTcuMSAxOSA5QzkgOC45IDkuMSAxOCA5LjUgMTJDOS41IDE4IDEwIDE3LjEgMTAgMTZWMTRDMTAgMi45IDEwLjkgMiAxMiAyWk0xMiA3QzEyLjU1IDcgMTMgNy40NSAxMyA4UzEyLjU1IDkgMTIgOVMxMSA4LjU1IDExIDhTMTIuNDUgNyAxMiA3Wk0xMiAxNWMtMS42NiAwLTMtMS4zNC0zLTNTMTAuMzQgMTMgMTIgMTNTMTQuMzQgMTYgMTYgMTZTMzMuNjYgMTUgMTIgMTVaIiBmaWxsPSIjOWNhM2FmIi8+Cjwvc3ZnPgo=';
                              e.currentTarget.alt = 'Image not available';
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Discount Information Section */}
              <section className="space-y-4 sm:space-y-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-1.5 h-6 sm:w-2 sm:h-8 bg-green-600 rounded-full"></div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Discount Information</h3>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <div className="space-y-1">
                    <h4 className="font-semibold text-xs sm:text-sm text-muted-foreground">Discount Amount</h4>
                    <div className="text-sm sm:text-base">{selectedApp.discountAmount || 'Not specified'}</div>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-xs sm:text-sm text-muted-foreground">Services/Procedures for Discount</h4>
                    <div className="text-sm sm:text-base">
                      {selectedApp.discountItems && selectedApp.discountItems.length > 0 
                        ? selectedApp.discountItems.join(', ') 
                        : 'Not specified'}
                    </div>
                  </div>
                </div>
              </section>

              <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-3 sm:pt-4">
                <Button variant="outline" onClick={closeAppDialog} className="text-sm w-full sm:w-auto">Close</Button>
                <Button 
                  onClick={() => { approve(selectedApp._id); closeAppDialog(); }}
                  className="bg-green-600 hover:bg-green-700 text-sm w-full sm:w-auto"
                >
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Approve Application
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => { reject(selectedApp._id); closeAppDialog(); }}
                  className="text-sm w-full sm:w-auto"
                >
                  <XCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Reject Application
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Image Viewer Dialog */}
      <Dialog open={!!viewerImage} onOpenChange={(v) => { if (!v) setViewerImage(null); }}>
        <DialogContent className="max-w-4xl w-full mx-2 sm:mx-4">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Document Preview</DialogTitle>
            <DialogDescription className="text-sm sm:text-base">Enlarged view of the selected document</DialogDescription>
          </DialogHeader>
          <div className="flex justify-center items-center min-h-[50vh] sm:min-h-[60vh]">
            {viewerImage && (
              <img 
                src={viewerImage} 
                alt="preview" 
                className="max-h-[50vh] sm:max-h-[60vh] max-w-full object-contain rounded-lg" 
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDMTMuMSAyIDE0IDIuOSAxNCA0VjE2QzE0IDE3LjEgMTMuMSAxOCA5LjUgMTJDOS41IDE4IDkgMTcuMSAxOSA5QzkgOC45IDkuMSAxOCA5LjUgMTJDOS41IDE4IDEwIDE3LjEgMTAgMTZWMTRDMTAgMi45IDEwLjkgMiAxMiAyWk0xMiA3QzEyLjU1IDcgMTMgNy40NSAxMyA4UzEyLjU1IDkgMTIgOVMxMSA4LjU1IDExIDhTMTIuNDUgNyAxMiA3Wk0xMiAxNWMtMS42NiAwLTMtMS4zNC0zLTNTMTAuMzQgMTMgMTIgMTNTMTQuMzQgMTYgMTYgMTZTMzMuNjYgMTUgMTIgMTVaIiBmaWxsPSIjOWNhM2FmIi8+Cjwvc3ZnPgo=';
                  e.currentTarget.alt = 'Image not available';
                }}
              />
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setViewerImage(null)} className="w-full sm:w-auto text-sm">Close Preview</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Query View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl w-full mx-2 sm:mx-4">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Query Details</DialogTitle>
            <DialogDescription className="text-sm sm:text-base">Full details of the user query</DialogDescription>
          </DialogHeader>
          {selectedQuery && (
            <div className="space-y-3 sm:space-y-4 mt-2">
              <div className="space-y-1">
                <h3 className="font-semibold text-xs sm:text-sm text-muted-foreground">Subject</h3>
                <div className="text-sm sm:text-base">{selectedQuery.subject}</div>
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-xs sm:text-sm text-muted-foreground">Message</h3>
                <div className="text-sm sm:text-base whitespace-pre-line bg-muted/30 p-2 sm:p-3 rounded-lg">
                  {selectedQuery.message}
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-xs sm:text-sm text-muted-foreground">User Details</h3>
                <div className="text-sm sm:text-base">
                  {selectedQuery.name} • {selectedQuery.email} • {selectedQuery.phone}
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-xs sm:text-sm text-muted-foreground">Status</h3>
                <Badge variant={selectedQuery.status === 'pending' ? 'destructive' : selectedQuery.status === 'resolved' ? 'default' : 'secondary'} className="text-xs">
                  {selectedQuery.status}
                </Badge>
              </div>
              <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-3 sm:pt-4">
                <Button variant="outline" onClick={() => { setViewDialogOpen(false); setSelectedQuery(null); }} className="text-sm w-full sm:w-auto">
                  Close
                </Button>
                <Button 
                  onClick={() => { updateQueryStatus(selectedQuery._id, 'resolved'); setViewDialogOpen(false); setSelectedQuery(null); }}
                  className="bg-green-600 hover:bg-green-700 text-sm w-full sm:w-auto"
                >
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Mark as Resolved
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Partner Confirmation Dialog */}
      <Dialog open={deletePartnerDialog} onOpenChange={setDeletePartnerDialog}>
        <DialogContent className="max-w-md mx-2 sm:mx-4">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl text-red-600">Delete Partner</DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Are you sure you want to delete this partner? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {partnerToDelete && (
            <div className="py-4">
              <div className="space-y-2">
                <div className="font-semibold">{partnerToDelete.name || partnerToDelete.clinicName}</div>
                <div className="text-sm text-muted-foreground">{partnerToDelete.email || partnerToDelete.contactEmail}</div>
                <div className="text-sm text-muted-foreground">{partnerToDelete.facilityType || partnerToDelete.type}</div>
              </div>
            </div>
          )}
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => { setDeletePartnerDialog(false); setPartnerToDelete(null); }} className="text-sm w-full sm:w-auto">
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => partnerToDelete && deletePartner(partnerToDelete._id)}
              className="text-sm w-full sm:w-auto"
            >
              <XCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Delete Partner
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Confirmation Dialog */}
      <Dialog open={deleteUserDialog} onOpenChange={setDeleteUserDialog}>
        <DialogContent className="max-w-md mx-2 sm:mx-4">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl text-red-600">Delete User</DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {userToDelete && (
            <div className="py-4">
              <div className="space-y-2">
                <div className="font-semibold">{userToDelete.name}</div>
                <div className="text-sm text-muted-foreground">{userToDelete.email}</div>
                <div className="text-sm text-muted-foreground">Membership: {userToDelete.membershipId}</div>
              </div>
            </div>
          )}
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => { setDeleteUserDialog(false); setUserToDelete(null); }} className="text-sm w-full sm:w-auto">
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => userToDelete && deleteUser(userToDelete._id)}
              className="text-sm w-full sm:w-auto"
            >
              <XCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
