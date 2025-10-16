import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Heart, Shield, Users, Stethoscope, Pill, ClipboardCheck } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-healthcare.jpg";

const Index = () => {
  const plans = [
    {
      name: 'Annual',
      price: 365,
      duration: '12 Months',
      discount: '10% when family added',
      popular: true,
      features: [
        'Access to partner hospitals nationwide',
        'Digital membership card',
        'Add family members for ₹365/person',
        '10% discount applied on total when family members added',
      ],
    },
  ];

  const features = [
    {
      icon: Shield,
      title: "Trusted Network",
      description: "100+ verified hospitals, clinics, and diagnostic centers across the country",
    },
    {
      icon: Heart,
      title: "Quality Healthcare",
      description: "Access premium healthcare services at discounted rates with our subscription",
    },
    {
      icon: Users,
      title: "Family Coverage",
      description: "Extend benefits to your entire family with our comprehensive family plans",
    },
    {
      icon: Stethoscope,
      title: "Specialist Access",
      description: "Connect with top specialists and get priority appointments at partner facilities",
    },
    {
      icon: Pill,
      title: "Pharmacy Benefits",
      description: "Save on medicines with exclusive discounts at partnered pharmacies nationwide",
    },
    {
      icon: ClipboardCheck,
      title: "Easy Verification",
      description: "Quick verification with QR code or membership ID at any partner facility",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar provided by NavLayout for navbar routes */}

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-background z-0" />
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Affordable Healthcare for{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Everyone
                </span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Subscribe once. Save forever. Access quality healthcare at discounted rates across our trusted
                network of hospitals and clinics.
              </p>
              <div className="flex gap-4">
                <Link to="/signup">
                  <Button size="lg" className="text-lg px-8">
                    Subscribe Now
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8"
                  onClick={() => {
                    const el = document.getElementById("pricing-section");
                    if (el) {
                      el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                  }}
                >
                  View Plans
                </Button>
              </div>
              <div className="flex gap-8 pt-4">
                <div>
                  <div className="text-3xl font-bold text-primary">100+</div>
                  <div className="text-sm text-muted-foreground">Partner Hospitals</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-secondary">50K+</div>
                  <div className="text-sm text-muted-foreground">Active Members</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-accent">25%</div>
                  <div className="text-sm text-muted-foreground">Max Savings</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src={heroImage}
                alt="Healthcare professionals and happy patients"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose HealthConnect?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive healthcare benefits designed to keep you and your family healthy
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 hover:border-primary transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <feature.icon className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

  {/* Pricing Section */}
  <section id="pricing-section" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Choose Your Plan</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Flexible subscription plans to match your healthcare needs and budget
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`relative ${
                  plan.popular
                    ? "border-primary border-2 shadow-xl scale-105"
                    : "border-2 hover:border-primary transition-all duration-300"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-secondary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.duration}</CardDescription>
                  <div className="mt-4">
                    <span className="text-5xl font-bold text-primary">₹{plan.price}</span>
                  </div>
                  <div className="text-lg font-semibold text-secondary">{plan.discount} Discount</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link to="/signup" className="w-full">
                    <Button className="w-full" variant={plan.popular ? "default" : "outline"} size="lg">
                      Subscribe Now
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-secondary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Saving on Healthcare?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of satisfied members who are already enjoying quality healthcare at discounted rates
          </p>
          <Link to="/signup">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">HealthConnect</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Making quality healthcare accessible and affordable for everyone
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Partner Network</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">How It Works</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Partners</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/partner" className="hover:text-primary transition-colors">Partner Portal</Link></li>
                <li><Link to="/partner/register" className="hover:text-primary transition-colors">Become a Partner</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
                <li><Link to="/admin" className="hover:text-primary transition-colors">Admin Portal</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 HealthConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
