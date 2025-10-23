import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { apiUrl } from "@/lib/api";
import Navbar from "@/components/Navbar";
import { Helmet } from "react-helmet-async";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/loading";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await fetch(apiUrl('api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      if (!res.ok) {
        const err = await res.json();
        toast({
          title: "Login Failed",
          description: err.message || 'Please check your credentials and try again.',
          variant: "destructive",
        });
        return;
      }
      
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        toast({
          title: "Login Successful",
          description: "Welcome back! Redirecting to your dashboard...",
        });
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Connection Error",
        description: "Unable to connect to the server. Please check your internet connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login | MEDI COST SAVER - Access Your Healthcare Account</title>
        <meta name="description" content="Login to your MEDI COST SAVER account to access healthcare discounts, view your membership card, and manage your medical savings benefits." />
        <meta name="keywords" content="MEDI COST SAVER login, healthcare account login, medical discount card login, member login India" />
        <meta property="og:title" content="Login to MEDI COST SAVER - Healthcare Account Access" />
        <meta property="og:description" content="Access your healthcare discount account and manage your medical savings benefits." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://medicostsaver.com/login" />
      </Helmet>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-emerald-50 to-cyan-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto">
          {/* Logo */}
          <div className="text-center mb-4 sm:mb-6 md:mb-8">
            <Link to="/" className="inline-flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 group">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-600 to-emerald-600 flex items-center justify-center group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Heart className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                  MEDI COST SAVER
                </h1>
                <p className="text-gray-600 text-xs sm:text-sm mt-0.5 sm:mt-1">Your Health Partner</p>
              </div>
            </Link>
          </div>

          {/* Login Form */}
          <Card className="bg-white shadow-xl sm:shadow-2xl border-0 rounded-2xl sm:rounded-3xl">
            <CardHeader className="text-center pb-4 sm:pb-6 pt-6 sm:pt-8 px-4 sm:px-6">
              <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Welcome Back</CardTitle>
              <CardDescription className="text-gray-600 text-sm sm:text-base md:text-lg">
                Sign in to your account
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
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-lg sm:rounded-xl border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 py-2 sm:py-3 text-sm sm:text-base"
                    disabled={isLoading}
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
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                      ) : (
                        <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Forgot Password */}
                <div className="text-right">
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-700 font-medium text-xs sm:text-sm transition-colors duration-200 hover:underline"
                    disabled={isLoading}
                  >
                    Forgot password?
                  </button>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col gap-3 sm:gap-4 pt-4 sm:pt-6 px-4 sm:px-6 pb-6 sm:pb-8">
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white py-2 sm:py-3 rounded-lg sm:rounded-xl text-base sm:text-lg font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <LoadingSpinner size="sm" />
                      <span className="text-sm sm:text-base">Signing In...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-sm sm:text-base">Sign In</span>
                      <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                  )}
                </Button>

                <div className="text-center space-y-2 sm:space-y-3">
                  <p className="text-gray-600 text-sm sm:text-base">
                    Don't have an account?{" "}
                    <Link 
                      to="/coming-soon" 
                      className="text-blue-600 hover:text-blue-700 font-bold hover:underline transition-colors duration-200"
                    >
                      Sign up
                    </Link>
                  </p>

                  <div className="pt-2 sm:pt-3 border-t border-gray-200">
                    <Link 
                      to="/partner" 
                      className="text-gray-500 hover:text-blue-600 text-xs sm:text-sm transition-colors duration-200"
                    >
                      Partner login →
                    </Link>
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

export default Login;
