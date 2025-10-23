import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Heart, Search, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Partner = () => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if partner is already logged in
    const token = localStorage.getItem('partnerToken');
    
    // Small delay to show loading state
    const timer = setTimeout(() => {
      if (token) {
        // Redirect to dashboard if already authenticated
        navigate('/partner/dashboard');
      } else {
        // If not authenticated, redirect to login
        navigate('/partner/login');
      }
      setIsChecking(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [navigate]);

  // Show loading state while checking authentication
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-emerald-50 to-cyan-50">
        <Card className="w-full max-w-md mx-4 shadow-2xl border-0 rounded-3xl">
          <CardHeader className="text-center pb-6 pt-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-600 to-emerald-600 flex items-center justify-center">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">MEDI COST SAVER</CardTitle>
            <CardDescription className="text-gray-600 text-lg">
              Partner Portal
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center pb-8">
            <div className="flex items-center justify-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              <p className="text-gray-600">Checking authentication...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // This will redirect, so no need to render anything else
  return null;
};

export default Partner;
