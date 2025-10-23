import { Heart, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";

const Navbar = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const loginTimeoutRef = useRef<NodeJS.Timeout>();
  const registerTimeoutRef = useRef<NodeJS.Timeout>();
  const loginButtonRef = useRef<HTMLButtonElement>(null);
  const registerButtonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  const handleLoginMouseEnter = () => {
    if (loginTimeoutRef.current) {
      clearTimeout(loginTimeoutRef.current);
    }
    setLoginOpen(true);
  };

  const handleLoginMouseLeave = () => {
    loginTimeoutRef.current = setTimeout(() => {
      setLoginOpen(false);
    }, 200);
  };

  const handleRegisterMouseEnter = () => {
    if (registerTimeoutRef.current) {
      clearTimeout(registerTimeoutRef.current);
    }
    setRegisterOpen(true);
  };

  const handleRegisterMouseLeave = () => {
    registerTimeoutRef.current = setTimeout(() => {
      setRegisterOpen(false);
    }, 200);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (loginButtonRef.current && !loginButtonRef.current.contains(event.target as Node)) {
        setLoginOpen(false);
      }
      if (registerButtonRef.current && !registerButtonRef.current.contains(event.target as Node)) {
        setRegisterOpen(false);
      }
      // Close mobile menu when clicking outside
      if (mobileMenuOpen && !(event.target as Element).closest('.mobile-menu') && !(event.target as Element).closest('.hamburger-btn')) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  return (
    <>
      <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-[100]">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Mobile: Hamburger Menu */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="hamburger-btn p-2"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {/* Logo - Centered on mobile, left on desktop */}
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 md:h-8 md:w-8 text-primary" />
            <span className="text-sm md:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              MEDI COST SAVER
            </span>
          </div>

          {/* Desktop: Centered menu */}
          <div className="hidden md:flex gap-6 items-center flex-1 justify-center">
            <Link to="/" className="text-sm font-medium hover:text-primary">Home</Link>
            <Link to="/about" className="text-sm font-medium hover:text-primary">About Us</Link>
            <Link to="/how-it-works" className="text-sm font-medium hover:text-primary">How It Works</Link>
            <Link to="/membership-fee" className="text-sm font-medium hover:text-primary">Membership Fee</Link>
            <Link to="/faq" className="text-sm font-medium hover:text-primary">FAQ</Link>
            <Link to="/contact" className="text-sm font-medium hover:text-primary">Contact Us</Link>
          </div>

          {/* Desktop & Mobile: Login/Register buttons */}
          <div className="flex gap-2 md:gap-4 relative mr-4 md:mr-0">
            {/* Login Dropdown */}
            <div className="relative">
              <Button
                ref={loginButtonRef}
                variant="ghost"
                size="sm"
                className="hidden md:flex"
                onMouseEnter={handleLoginMouseEnter}
                onMouseLeave={handleLoginMouseLeave}
              >
                Login
              </Button>
              {/* Mobile Login Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden text-xs px-3 py-1"
                onClick={() => setLoginOpen(!loginOpen)}
              >
                Login
              </Button>
              {/* Desktop Login Dropdown */}
              <div
                className={`hidden md:block absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-popover border border-border rounded-md shadow-lg py-2 w-56 transition-all duration-200 ${
                  loginOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                }`}
                onMouseEnter={handleLoginMouseEnter}
                onMouseLeave={handleLoginMouseLeave}
              >
                <div 
                  className="relative px-4 py-2 text-sm transition-colors duration-150 group cursor-pointer"
                  onClick={() => {
                    setLoginOpen(false);
                    navigate('/login');
                  }}
                >
                  <span className="block w-full">Login as Member</span>
                  <div className="absolute bottom-0 left-4 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-300 group-hover:w-24"></div>
                </div>
                <div 
                  className="relative px-4 py-2 text-sm transition-colors duration-150 group cursor-pointer"
                  onClick={() => {
                    setLoginOpen(false);
                    navigate('/partner/login');
                  }}
                >
                  <span className="block w-full">Login as Partner</span>
                  <div className="absolute bottom-0 left-4 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-300 group-hover:w-24"></div>
                </div>
              </div>
              {/* Mobile Login Dropdown */}
              <div
                className={`md:hidden absolute top-full right-0 mt-1 bg-popover border border-border rounded-md shadow-lg py-2 w-48 transition-all duration-200 ${
                  loginOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                }`}
              >
                <Link
                  to="/login"
                  className="block px-4 py-3 text-sm hover:bg-accent hover:text-accent-foreground transition-colors duration-150 rounded-t-md"
                  onClick={() => setLoginOpen(false)}
                >
                  Login as Member
                </Link>
                <div className="h-px bg-border mx-2"></div>
                <Link
                  to="/partner/login"
                  className="block px-4 py-3 text-sm hover:bg-accent hover:text-accent-foreground transition-colors duration-150 rounded-b-md"
                  onClick={() => setLoginOpen(false)}
                >
                  Login as Partner
                </Link>
              </div>
            </div>

            {/* Register Dropdown */}
            <div className="relative">
              <Button
                ref={registerButtonRef}
                size="sm"
                className="hidden md:flex"
                onMouseEnter={handleRegisterMouseEnter}
                onMouseLeave={handleRegisterMouseLeave}
              >
                Get Started
              </Button>
              {/* Mobile Register Button */}
              <Button
                size="sm"
                className="md:hidden text-xs px-3 py-1"
                onClick={() => setRegisterOpen(!registerOpen)}
              >
                Register
              </Button>
              {/* Desktop Register Dropdown */}
              <div
                className={`hidden md:block absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-popover border border-border rounded-md shadow-lg py-2 w-56 transition-all duration-200 ${
                  registerOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                }`}
                onMouseEnter={handleRegisterMouseEnter}
                onMouseLeave={handleRegisterMouseLeave}
              >
                <div 
                  className="relative px-4 py-2 text-sm transition-colors duration-150 group cursor-pointer"
                  onClick={() => {
                    setRegisterOpen(false);
                    navigate('/signup');
                  }}
                >
                  <span className="block w-full">Register as Member</span>
                  <div className="absolute bottom-0 left-4 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-300 group-hover:w-28"></div>
                </div>
                <div 
                  className="relative px-4 py-2 text-sm transition-colors duration-150 group cursor-pointer"
                  onClick={() => {
                    setRegisterOpen(false);
                    navigate('/partner/register');
                  }}
                >
                  <span className="block w-full">Register as Partner</span>
                  <div className="absolute bottom-0 left-4 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-300 group-hover:w-28"></div>
                </div>
              </div>
              {/* Mobile Register Dropdown */}
              <div
                className={`md:hidden absolute top-full right-0 mt-1 bg-popover border border-border rounded-md shadow-lg py-2 w-48 transition-all duration-200 ${
                  registerOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                }`}
              >
                <Link
                  to="/signup"
                  className="block px-4 py-3 text-sm hover:bg-accent hover:text-accent-foreground transition-colors duration-150 rounded-t-md"
                  onClick={() => setRegisterOpen(false)}
                >
                  Register as Member
                </Link>
                <div className="h-px bg-border mx-2"></div>
                <Link
                  to="/partner/register"
                  className="block px-4 py-3 text-sm hover:bg-accent hover:text-accent-foreground transition-colors duration-150 rounded-b-md"
                  onClick={() => setRegisterOpen(false)}
                >
                  Register as Partner
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`mobile-menu fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Menu Panel */}
        <div
          className={`absolute left-0 top-0 h-full w-[70%] bg-card border-r border-border shadow-xl transform transition-transform duration-300 ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-6">
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <Heart className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  MEDI COST SAVER
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Mobile Menu Items */}
            <div className="space-y-4">
              <Link
                to="/"
                className="block py-3 px-4 text-base font-medium hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/about"
                className="block py-3 px-4 text-base font-medium hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                to="/how-it-works"
                className="block py-3 px-4 text-base font-medium hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                to="/membership-fee"
                className="block py-3 px-4 text-base font-medium hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Membership Fee
              </Link>
              <Link
                to="/faq"
                className="block py-3 px-4 text-base font-medium hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </Link>
              <Link
                to="/contact"
                className="block py-3 px-4 text-base font-medium hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
