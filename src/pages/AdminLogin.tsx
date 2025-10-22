import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiUrl } from "@/lib/api";
import Navbar from "@/components/Navbar";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('admin@local.test');
  const [password, setPassword] = React.useState('admin123');
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(apiUrl('api/auth/admin/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const body = await res.json();
      if (!res.ok) {
        setError(body?.message || 'Login failed');
        setLoading(false);
        return;
      }
      const token = body.token;
      if (!token) {
        setError('No token returned');
        setLoading(false);
        return;
      }
      localStorage.setItem('token', token);
      navigate('/admin');
    } catch (err) {
      console.error(err);
      setError('Network error');
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-background p-3 sm:p-4">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-xl sm:text-2xl">Admin Login</CardTitle>
            <CardDescription className="text-sm sm:text-base">Access the admin dashboard</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div>
                <Label htmlFor="email" className="text-sm sm:text-base">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 text-sm sm:text-base"
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-sm sm:text-base">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 text-sm sm:text-base"
                />
              </div>
              {error && (
                <Alert variant="destructive" className="mt-3 sm:mt-4">
                  <AlertDescription className="text-sm sm:text-base">{error}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full text-sm sm:text-base" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
            <div className="mt-3 sm:mt-4 text-center">
              <p className="text-xs sm:text-sm text-muted-foreground">
                Don't have an admin account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/admin/register')}
                  className="text-primary hover:underline text-xs sm:text-sm"
                >
                  Register here
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AdminLogin;
