import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Stethoscope, Pill, Microscope, Eye, EyeOff, ArrowRight, Heart } from "lucide-react";
import { apiUrl } from "@/lib/api";
import Navbar from "@/components/Navbar";

const PartnerLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(apiUrl('api/partners/login'), {
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
      localStorage.setItem('partnerToken', token);
      navigate('/partner/dashboard');
    } catch (err) {
      console.error(err);
      setError('Network error');
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-emerald-50 to-cyan-50 flex items-center justify-center p-3 sm:p-4">
        <div className="w-full max-w-md mx-auto">
          {/* Logo */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-600 to-emerald-600 flex items-center justify-center shadow-lg">
                <Heart className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                  MEDI COST SAVER
                </h1>
                <p className="text-gray-600 text-xs sm:text-sm mt-0.5 sm:mt-1">Partner Portal</p>
              </div>
            </div>
          </div>

          {/* Login Form */}
          <Card className="bg-white shadow-xl sm:shadow-2xl border-0 rounded-2xl sm:rounded-3xl">
            <CardHeader className="text-center pb-4 sm:pb-6 pt-6 sm:pt-8 px-4 sm:px-6">
              <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <Stethoscope className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-blue-600" />
                <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Partner Login</CardTitle>
              </div>
              <CardDescription className="text-gray-600 text-sm sm:text-base md:text-lg">
                Access your partner dashboard
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
                {/* Email Field */}
                <div className="space-y-2 sm:space-y-3">
                  <Label htmlFor="email" className="text-gray-900 font-semibold text-sm sm:text-base">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="partner@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-lg sm:rounded-xl border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 py-2 sm:py-3 text-sm sm:text-base"
                    disabled={loading}
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-2 sm:space-y-3">
                  <Label htmlFor="password" className="text-gray-900 font-semibold text-sm sm:text-base">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full rounded-lg sm:rounded-xl border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 py-2 sm:py-3 text-sm sm:text-base pr-10 sm:pr-12"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                      disabled={loading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                      ) : (
                        <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Error Alert */}
                {error && (
                  <Alert variant="destructive" className="rounded-lg sm:rounded-xl border-red-200 bg-red-50">
                    <AlertDescription className="text-red-800 text-xs sm:text-sm">{error}</AlertDescription>
                  </Alert>
                )}
              </CardContent>

              <CardFooter className="flex flex-col gap-3 sm:gap-4 pt-4 sm:pt-6 px-4 sm:px-6 pb-6 sm:pb-8">
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white py-2 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base md:text-lg font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm sm:text-base">Signing In...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-sm sm:text-base">Partner Login</span>
                      <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                  )}
                </Button>

                <div className="text-center space-y-2 sm:space-y-3">
                  <p className="text-gray-600 text-xs sm:text-sm md:text-base">
                    Don't have a partner account?{" "}
                    <button
                      type="button"
                      onClick={() => navigate('/partner/register')}
                      className="text-blue-600 hover:text-blue-700 font-bold hover:underline transition-colors duration-200 text-xs sm:text-sm md:text-base"
                    >
                      Register here
                    </button>
                  </p>

                  <div className="pt-2 sm:pt-3 border-t border-gray-200">
                    <button
                      onClick={() => navigate('/login')}
                      className="text-gray-500 hover:text-blue-600 text-xs sm:text-sm transition-colors duration-200"
                    >
                      Member login →
                    </button>
                  </div>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </>
  );
};

export default PartnerLogin;
