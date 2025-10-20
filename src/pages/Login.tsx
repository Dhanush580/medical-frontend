import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { apiUrl } from "@/lib/api";
import Navbar from "@/components/Navbar";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

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
        alert(err.message || 'Login failed');
        return;
      }
      
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
      alert('Login error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-emerald-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                HealthConnect
              </h1>
              <p className="text-gray-600 text-sm mt-1">Your Health Partner</p>
            </div>
          </Link>
        </div>

        {/* Login Form */}
        <Card className="bg-white shadow-2xl border-0 rounded-3xl">
          <CardHeader className="text-center pb-6 pt-8">
            <CardTitle className="text-3xl font-bold text-gray-900">Welcome Back</CardTitle>
            <CardDescription className="text-gray-600 text-lg">
              Sign in to your account
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6 px-6">
              {/* Email Field */}
              <div className="space-y-3">
                <Label htmlFor="email" className="text-gray-900 font-semibold text-base">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-xl border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 py-3 text-base"
                  disabled={isLoading}
                />
              </div>

              {/* Password Field */}
              <div className="space-y-3">
                <Label htmlFor="password" className="text-gray-900 font-semibold text-base">
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
                    className="w-full rounded-xl border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 py-3 text-base pr-12"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-200 hover:underline"
                  disabled={isLoading}
                >
                  Forgot password?
                </button>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 pt-6 px-6 pb-8">
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white py-3 rounded-xl text-lg font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing In...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Sign In
                    <ArrowRight className="h-5 w-5" />
                  </div>
                )}
              </Button>

              <div className="text-center space-y-3">
                <p className="text-gray-600 text-base">
                  Don't have an account?{" "}
                  <Link 
                    to="/signup" 
                    className="text-blue-600 hover:text-blue-700 font-bold hover:underline transition-colors duration-200"
                  >
                    Sign up
                  </Link>
                </p>

                <div className="pt-3 border-t border-gray-200">
                  <Link 
                    to="/partner" 
                    className="text-gray-500 hover:text-blue-600 text-sm transition-colors duration-200"
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

export default Login;