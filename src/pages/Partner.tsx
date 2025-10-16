import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Heart, Search, CheckCircle, XCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Partner = () => {
  const navigate = useNavigate();
  const [membershipId, setMembershipId] = useState("");
  const [verificationResult, setVerificationResult] = useState<any>(null);

  useEffect(() => {
    // Check if partner is already logged in
    const token = localStorage.getItem('partnerToken');
    if (token) {
      // Redirect to dashboard if already authenticated
      navigate('/partner/dashboard');
      return;
    }
    // If not authenticated, redirect to login
    navigate('/partner/login');
  }, [navigate]);

  // This component will redirect, so we don't need the rest of the content
  return null;
};

export default Partner;
