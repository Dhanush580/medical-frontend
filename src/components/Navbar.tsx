import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Heart className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            HealthConnect
          </span>
        </div>

        {/* Centered menu */}
        <div className="hidden md:flex gap-6 items-center">
          <Link to="/" className="text-sm font-medium hover:text-primary">Home</Link>
          <Link to="/about" className="text-sm font-medium hover:text-primary">About Us</Link>
          <Link to="/how-it-works" className="text-sm font-medium hover:text-primary">How It Works</Link>
          <Link to="/membership-fee" className="text-sm font-medium hover:text-primary">Membership Fee</Link>
          <Link to="/faq" className="text-sm font-medium hover:text-primary">FAQ</Link>
          <Link to="/contact" className="text-sm font-medium hover:text-primary">Contact Us</Link>
        </div>

        <div className="flex gap-4">
          <Link to="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link to="/signup">
            <Button>Get Started</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
