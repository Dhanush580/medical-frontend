import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Users, Building2, CreditCard, TrendingUp, Calendar } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import React from 'react';

// Admin actions require an admin token; this UI assumes you're authenticated as admin and have token in localStorage

const Admin = () => {
  const navigate = useNavigate();
  const [stats, setStats] = React.useState([
    { label: "Total Members", value: "Loading...", change: "", icon: Users, color: "text-primary" },
    { label: "Active Partners", value: "Loading...", change: "", icon: Building2, color: "text-secondary" },
    { label: "Monthly Revenue", value: "₹24.5L", change: "+18%", icon: CreditCard, color: "text-accent" },
    { label: "Avg. Discount", value: "16.5%", change: "+2%", icon: TrendingUp, color: "text-orange-500" },
  ]);

  const [recentMembers, setRecentMembers] = React.useState([
    { name: "Loading...", plan: "", date: "", status: "" }
  ]);

  const [recentPartners, setRecentPartners] = React.useState([
    { name: "Loading...", type: "", members: 0, status: "" }
  ]);

  const [applications, setApplications] = React.useState<any[]>([]);
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
  const BACKEND_ORIGIN = (import.meta.env.VITE_BACKEND_URL as string) || `${window.location.protocol}//${window.location.hostname}:5000`;
  const assetUrl = (p?: string) => {
    if (!p) return '';
    if (p.startsWith('http://') || p.startsWith('https://')) return p;
    const path = p.startsWith('/') ? p.slice(1) : p;
    return `${BACKEND_ORIGIN}/${path}`;
  };

  const loadApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/partners/applications', { headers: { Authorization: `Bearer ${token}` } });
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
      const res = await fetch('/api/partners/stats', { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) return;
      const data = await res.json();
      setStats([
        { label: "Total Members", value: data.totalUsers.toString(), change: "", icon: Users, color: "text-primary" },
        { label: "Active Partners", value: data.approvedPartners.toString(), change: "", icon: Building2, color: "text-secondary" },
        { label: "Monthly Revenue", value: "₹24.5L", change: "+18%", icon: CreditCard, color: "text-accent" },
        { label: "Avg. Discount", value: "16.5%", change: "+2%", icon: TrendingUp, color: "text-orange-500" },
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  const loadRecentMembers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/partners/recent-members', { headers: { Authorization: `Bearer ${token}` } });
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
      const res = await fetch('/api/partners/recent-partners', { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) return;
      const data = await res.json();
      setRecentPartners(data);
    } catch (err) {
      console.error(err);
    }
  };

  React.useEffect(() => {
    loadApplications();
    loadStats();
    loadRecentMembers();
    loadRecentPartners();
  }, []);

  const approve = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/partners/applications/${id}/approve`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) loadApplications();
    } catch (err) { console.error(err); }
  };

  const reject = async (id: string) => {
    const reason = prompt('Reason for rejection (optional)') || '';
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/partners/applications/${id}/reject`, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ reason }) });
      if (res.ok) loadApplications();
    } catch (err) { console.error(err); }
  };

  const openAppDialog = (app:any) => { setSelectedApp(app); setAppDialogOpen(true); };
  const closeAppDialog = () => { setSelectedApp(null); setAppDialogOpen(false); };
  const openViewer = (src:string) => setViewerImage(src);
  const closeViewer = () => setViewerImage(null);

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null; // Will redirect
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
            <Badge variant="outline">Admin Portal</Badge>
            <Button variant="ghost" size="sm" onClick={() => { localStorage.removeItem('token'); navigate('/'); }}>Logout</Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage users, partners, and monitor platform performance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <Card key={idx}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">{stat.label}</div>
                    <div className="text-3xl font-bold mb-1">{stat.value}</div>
                    <div className="text-sm text-accent">{stat.change} this month</div>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Members */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Members</CardTitle>
              <CardDescription>Latest user registrations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentMembers.map((member, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-semibold">{member.name}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                        <Calendar className="h-3 w-3" />
                        {member.date}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">{member.plan}</Badge>
                      <div className="text-sm text-muted-foreground mt-1">{member.status}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Members
              </Button>
            </CardContent>
          </Card>

          {/* Recent Partners */}
          <Card>
            <CardHeader>
              <CardTitle>Partner Facilities</CardTitle>
              <CardDescription>Active healthcare partners</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                  {recentPartners.map((partner, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-semibold">{partner.name}</div>
                        <div className="text-sm text-muted-foreground">{partner.type}</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {partner.members.toLocaleString()} members served
                        </div>
                      </div>
                      <Badge variant="outline">{partner.status}</Badge>
                    </div>
                  ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Partners
              </Button>
            </CardContent>
          </Card>

            {/* Pending Applications */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Pending Partner Applications</CardTitle>
                <CardDescription>Review and approve or reject partner registrations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applications.length === 0 && <div className="text-sm text-muted-foreground">No pending applications</div>}
                  {applications.map((app) => (
                    <div key={app._id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="w-2/3">
                          <div className="font-semibold text-lg">{app.name}</div>
                          <div className="text-sm text-muted-foreground">Type: {app.type} • Status: {app.status}</div>
                          <div className="text-sm mt-2">Contact: {app.contactEmail} • {app.contactPhone}</div>
                          <div className="text-sm mt-2">Location: {app.state}, {app.district} - {app.pincode}</div>
                          <div className="text-sm mt-2">Responsible: {app.responsible?.name} • {app.responsible?.sex} • {app.responsible?.age}</div>
                          <div className="flex gap-3 mt-3 items-center">
                            {app.passportPhoto && (
                              <img src={assetUrl(app.passportPhoto)} alt="passport" className="h-16 w-16 object-cover rounded cursor-pointer border" onClick={() => openViewer(assetUrl(app.passportPhoto))} />
                            )}
                            {app.certificateFile && (
                              // if certificate is pdf, show an icon/link; else show image
                              (app.certificateFile.toLowerCase().endsWith('.pdf')
                                ? <a href={assetUrl(app.certificateFile)} target="_blank" rel="noreferrer" className="text-primary underline">Certificate (PDF)</a>
                                : <img src={assetUrl(app.certificateFile)} alt="certificate" className="h-16 w-16 object-cover rounded cursor-pointer border" onClick={() => openViewer(assetUrl(app.certificateFile))} />)
                            )}
                            {app.clinicPhotos && app.clinicPhotos.map((p:string, i:number) => (
                              <img key={i} src={assetUrl(p)} alt={`clinic-${i}`} className="h-16 w-16 object-cover rounded cursor-pointer border" onClick={() => openViewer(assetUrl(p))} />
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 items-end">
                          <div className="flex flex-col gap-2">
                            <Button variant="ghost" onClick={() => openAppDialog(app)}>View</Button>
                            <Button variant="ghost" onClick={() => approve(app._id)}>Approve</Button>
                            <Button variant="destructive" onClick={() => reject(app._id)}>Reject</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

          {/* Quick Actions */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Users className="h-6 w-6" />
                  <span className="text-sm">Manage Users</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Building2 className="h-6 w-6" />
                  <span className="text-sm">Manage Partners</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <CreditCard className="h-6 w-6" />
                  <span className="text-sm">Payment Reports</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <TrendingUp className="h-6 w-6" />
                  <span className="text-sm">Analytics</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Application detail dialog */}
      {/* Application detail dialog */}
      <Dialog open={appDialogOpen} onOpenChange={setAppDialogOpen}>
        <DialogContent className="max-w-5xl w-full">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>Full details for review</DialogDescription>
          </DialogHeader>
          {selectedApp && (
            <div className="max-h-[70vh] overflow-auto pr-2 space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold">Name</h3>
                  <div className="text-sm">{selectedApp.name}</div>
                </div>
                <div>
                  <h3 className="font-semibold">Type</h3>
                  <div className="text-sm">{selectedApp.type}</div>
                </div>
                <div>
                  <h3 className="font-semibold">Contact Email</h3>
                  <div className="text-sm">{selectedApp.contactEmail}</div>
                </div>
                <div>
                  <h3 className="font-semibold">Contact Phone</h3>
                  <div className="text-sm">{selectedApp.contactPhone}</div>
                </div>
                <div>
                  <h3 className="font-semibold">Address</h3>
                  <div className="text-sm">{selectedApp.address}</div>
                </div>
                <div>
                  <h3 className="font-semibold">State</h3>
                  <div className="text-sm">{selectedApp.state}</div>
                </div>
                <div>
                  <h3 className="font-semibold">District</h3>
                  <div className="text-sm">{selectedApp.district}</div>
                </div>
                <div>
                  <h3 className="font-semibold">Pincode</h3>
                  <div className="text-sm">{selectedApp.pincode}</div>
                </div>
                <div>
                  <h3 className="font-semibold">Timings</h3>
                  <div className="text-sm">{selectedApp.timings}</div>
                </div>
                <div>
                  <h3 className="font-semibold">Website</h3>
                  <div className="text-sm">{selectedApp.website}</div>
                </div>
                {selectedApp.type === 'doctor' && (
                  <div>
                    <h3 className="font-semibold">Clinic Name</h3>
                    <div className="text-sm">{selectedApp.clinicName}</div>
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-semibold">Responsible / Doctor</h3>
                <div className="text-sm">{selectedApp.responsible?.name} • {selectedApp.responsible?.sex} • {selectedApp.responsible?.age} • DOB: {selectedApp.responsible?.dob}</div>
              </div>

              <div>
                <h3 className="font-semibold">Council</h3>
                <div className="text-sm">{selectedApp.council?.name} • {selectedApp.council?.number}</div>
              </div>

              <div>
                <h3 className="font-semibold">Passport size image {selectedApp.type === 'doctor' ? '(Required)' : '(Optional)'}</h3>
                <div className="mt-2">
                  {selectedApp.passportPhoto ? (
                    <img src={assetUrl(selectedApp.passportPhoto)} alt="passport" className="h-32 w-32 object-cover rounded cursor-pointer border" onClick={() => openViewer(assetUrl(selectedApp.passportPhoto))} />
                  ) : (
                    <div className="text-sm text-muted-foreground">No passport image uploaded</div>
                  )}
                </div>

                <h3 className="font-semibold mt-4">Certificate {selectedApp.type !== 'doctor' ? '(Required)' : '(Optional)'}</h3>
                <div className="mt-2">
                  {selectedApp.certificateFile ? (
                    (selectedApp.certificateFile.toLowerCase().endsWith('.pdf') ? (
                      <a key="cert" href={assetUrl(selectedApp.certificateFile)} target="_blank" rel="noreferrer" className="text-primary underline">Open Certificate (PDF)</a>
                    ) : (
                      <img key="cert" src={assetUrl(selectedApp.certificateFile)} alt="certificate" className="h-32 w-48 object-cover rounded cursor-pointer border" onClick={() => openViewer(assetUrl(selectedApp.certificateFile))} />
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground">No certificate uploaded</div>
                  )}
                </div>

                {selectedApp.type === 'doctor' && (
                  <>
                    <h3 className="font-semibold mt-4">Clinic photos (Optional)</h3>
                    <div className="flex gap-3 mt-2 flex-wrap">
                      {selectedApp.clinicPhotos && selectedApp.clinicPhotos.length > 0 ? (
                        selectedApp.clinicPhotos.map((p:string, i:number) => (
                          <img key={i} src={assetUrl(p)} alt={`clinic-${i}`} className="h-28 w-28 object-cover rounded cursor-pointer border" onClick={() => openViewer(assetUrl(p))} />
                        ))
                      ) : (
                        <div className="text-sm text-muted-foreground">No clinic photos uploaded</div>
                      )}
                    </div>
                  </>
                )}
              </div>

              <div className="flex gap-2 justify-end mt-4">
                <Button variant="ghost" onClick={closeAppDialog}>Close</Button>
                <Button variant="ghost" onClick={() => { approve(selectedApp._id); closeAppDialog(); }}>Approve</Button>
                <Button variant="destructive" onClick={() => { reject(selectedApp._id); closeAppDialog(); }}>Reject</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Image viewer dialog */}
      <Dialog open={!!viewerImage} onOpenChange={(v) => { if (!v) setViewerImage(null); }}>
        <DialogContent className="max-w-4xl w-full">
            <DialogHeader>
              <DialogTitle>Preview</DialogTitle>
              <DialogDescription>Enlarged preview of the selected upload</DialogDescription>
            </DialogHeader>
          <div className="flex justify-center items-center">
            {viewerImage && (
              <img src={viewerImage} alt="preview" className="max-h-[70vh] max-w-full object-contain" />
            )}
          </div>
          <DialogFooter>
            <Button className="w-full" onClick={() => setViewerImage(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
