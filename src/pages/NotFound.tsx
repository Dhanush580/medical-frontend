import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Home, ArrowLeft, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-emerald-50 p-4 sm:p-6">
      <Card className="w-full max-w-md mx-auto shadow-2xl border-0 rounded-2xl sm:rounded-3xl overflow-hidden">
        <CardHeader className="text-center pb-4 sm:pb-6 pt-6 sm:pt-8 bg-gradient-to-r from-rose-50 to-orange-50">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center shadow-lg">
            <AlertTriangle className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
          </div>
          <CardTitle className="text-3xl sm:text-4xl font-bold text-gray-900">404</CardTitle>
          <CardDescription className="text-lg sm:text-xl text-gray-600 mt-2">
            Page Not Found
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6 sm:p-8 text-center">
          <div className="space-y-4 sm:space-y-6">
            <div className="space-y-2 sm:space-y-3">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                Oops! Lost your way?
              </h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                The page you're looking for doesn't exist or has been moved. 
                Let's get you back to familiar territory.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg sm:rounded-xl p-3 sm:p-4 mt-4">
                <p className="text-amber-800 text-xs sm:text-sm font-medium">
                  Attempted to access: <code className="bg-amber-100 px-2 py-1 rounded text-xs font-mono break-all">{location.pathname}</code>
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
              <Button 
                asChild
                variant="outline" 
                className="flex-1 rounded-lg sm:rounded-xl py-2 sm:py-3 text-sm sm:text-base border-gray-300 hover:bg-gray-50 transition-all duration-200"
              >
                <Link to="/" className="flex items-center justify-center gap-2">
                  <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                  Go Back
                </Link>
              </Button>
              <Button 
                asChild
                className="flex-1 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white rounded-lg sm:rounded-xl py-2 sm:py-3 text-sm sm:text-base transition-all duration-200 hover:shadow-lg"
              >
                <Link to="/" className="flex items-center justify-center gap-2">
                  <Home className="h-4 w-4 sm:h-5 sm:w-5" />
                  Home
                </Link>
              </Button>
            </div>

            <div className="pt-4 sm:pt-6 border-t border-gray-200">
              <Link 
                to="/" 
                className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors duration-200 group"
              >
                <Heart className="h-4 w-4 text-rose-500 group-hover:scale-110 transition-transform duration-200" />
                <span className="text-sm sm:text-base">Return to MEDI COST SAVER</span>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
