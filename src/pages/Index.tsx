import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import heroImage from "../assets/hero-healthcare.jpg";
import { 
  ArrowRight,
  CheckCircle,
  Shield,
  Users,
  Heart,
  Star,
  BadgePercent,
  Clock,
  Stethoscope,
  Pill,
  ClipboardCheck,
  Crown
} from "lucide-react";
import { useState } from "react";

const Index = () => {
  const [familyMembers, setFamilyMembers] = useState(1);

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const features = [
    {
      icon: <BadgePercent className="w-8 h-8" />,
      title: "Save Up to 25%",
      description: "Significant discounts on medical bills, pharmacy purchases, and diagnostic tests"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Verified Network",
      description: "Trusted doctors, pharmacies, and diagnostic centers with proper credentials"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Family Coverage",
      description: "Extend benefits to your entire family with special discounts"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Instant Activation",
      description: "Get your digital membership card immediately after registration"
    }
  ];

  const plans = [
    {
      name: "Individual Plan",
      price: 365,
      duration: "per year",
      popular: false,
      features: [
        "Single member coverage",
        "Up to 25% savings",
        "All partner facilities",
        "Digital membership card",
        "24/7 support"
      ]
    },
    {
      name: "Family Plan",
      price: 365,
      duration: "per year + add-ons",
      popular: true,
      features: [
        "Multiple family members",
        "10% discount on total",
        "All individual benefits",
        "Shared digital cards",
        "Family management"
      ]
    }
  ];

  const calculateFamilyPrice = (members) => {
    const basePrice = 365;
    const total = basePrice * members;
    const discount = members > 1 ? total * 0.10 : 0;
    return total - discount;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Full Height Banner */}
      <section className="min-h-screen relative flex items-center justify-center"
               style={{
                 backgroundImage: `url(${heroImage})`,
                 backgroundSize: 'cover',
                 backgroundPosition: 'center',
                 backgroundRepeat: 'no-repeat'
               }}>
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"></div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight px-2 md:px-0"
          >
            <span className="block md:inline">Affordable Healthcare</span>
            <br />
            <span className="text-blue-300">For Every Indian Family</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg sm:text-xl md:text-2xl mb-6 md:mb-8 text-blue-100 max-w-2xl mx-auto leading-relaxed px-2 md:px-0"
          >
            MCS Discount Cards - Saving you up to 25% on medical expenses through our trusted network of healthcare providers
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center text-center"
          >
            <Link to="/how-it-works" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-auto mx-auto bg-white text-blue-900 px-4 md:px-8 py-2 md:py-4 rounded-xl font-bold text-sm md:text-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 md:gap-3"
              >
                Know How This Works
                <ArrowRight className="w-3 h-3 md:w-5 md:h-5" />
              </motion.button>
            </Link>
            
            <Link to="/signup" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-auto mx-auto bg-blue-600 text-white px-4 md:px-8 py-2 md:py-4 rounded-xl font-bold text-sm md:text-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 md:gap-3 border-2 border-blue-600"
              >
                Become a Member
                <Users className="w-3 h-3 md:w-5 md:h-5" />
              </motion.button>
            </Link>

            <Link to="/partner/register" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-auto mx-auto border-2 border-white text-white px-4 md:px-8 py-2 md:py-4 rounded-xl font-bold text-sm md:text-lg hover:bg-white hover:text-blue-900 transition-colors flex items-center justify-center gap-2 md:gap-3"
              >
                Become a Partner
                <Stethoscope className="w-3 h-3 md:w-5 md:h-5" />
              </motion.button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-8 md:mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-2xl mx-auto pb-8 md:pb-0"
          >
            <div className="text-center">
              <div className="text-xl md:text-2xl font-bold">25%</div>
              <div className="text-blue-200 text-xs md:text-sm">Max Savings</div>
            </div>
            <div className="text-center">
              <div className="text-xl md:text-2xl font-bold">₹365</div>
              <div className="text-blue-200 text-xs md:text-sm">Yearly Cost</div>
            </div>
            <div className="text-center">
              <div className="text-xl md:text-2xl font-bold">1000+</div>
              <div className="text-blue-200 text-xs md:text-sm">Partners</div>
            </div>
            <div className="text-center">
              <div className="text-xl md:text-2xl font-bold">50K+</div>
              <div className="text-blue-200 text-xs md:text-sm">Members</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose MCS Section */}
      <section className="py-16 bg-white px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Choose MCS Discount Cards?
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Experience healthcare savings like never before with our comprehensive benefits
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-white to-blue-50 p-4 md:p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-3 md:mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 md:mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Available Plans Section */}
      <section className="py-16 bg-gray-50 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-600">
              Flexible plans to suit your healthcare needs
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Individual Plan */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border-2 border-blue-200 flex flex-col h-auto md:h-full"
            >
              <div className="flex-grow">
                <div className="text-center mb-4 md:mb-6">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Individual Plan</h3>
                  <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">₹365</div>
                  <div className="text-gray-600 text-sm md:text-base">{plans[0].duration}</div>
                </div>

                <ul className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                  {plans[0].features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm md:text-base">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link to="/signup">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-blue-600 text-white py-3 md:py-4 rounded-xl font-semibold text-sm md:text-base hover:bg-blue-700 transition-colors"
                >
                  Get Individual Plan
                </motion.button>
              </Link>
            </motion.div>

            {/* Family Plan */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 md:p-8 text-white shadow-xl relative flex flex-col h-auto md:h-full"
            >
              {plans[1].popular && (
                <div className="absolute -top-3 md:-top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-yellow-400 text-blue-900 px-3 md:px-4 py-1 md:py-2 rounded-full font-bold text-xs md:text-sm flex items-center gap-1 md:gap-2">
                    <Crown className="w-3 h-3 md:w-4 md:h-4" />
                    MOST POPULAR
                  </div>
                </div>
              )}

              <div className="flex-grow pt-2 md:pt-0">
                <div className="text-center mb-4 md:mb-6">
                  <h3 className="text-xl md:text-2xl font-bold mb-2">Family Plan</h3>

                  <div className="bg-white/10 rounded-xl p-3 md:p-4 mb-4">
                    <div className="flex items-center justify-between mb-2 md:mb-3">
                      <span className="font-semibold text-sm md:text-base">Family Members</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setFamilyMembers(Math.max(1, familyMembers - 1))}
                          className="w-7 h-7 md:w-8 md:h-8 bg-white/20 rounded flex items-center justify-center hover:bg-white/30 transition-colors text-sm md:text-base"
                        >
                          -
                        </button>
                        <span className="font-bold text-base md:text-lg w-6 md:w-8 text-center">{familyMembers}</span>
                        <button
                          onClick={() => setFamilyMembers(familyMembers + 1)}
                          className="w-7 h-7 md:w-8 md:h-8 bg-white/20 rounded flex items-center justify-center hover:bg-white/30 transition-colors text-sm md:text-base"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="text-2xl md:text-3xl font-bold">₹{calculateFamilyPrice(familyMembers)}</div>
                    <div className="text-white/80 text-xs md:text-sm">total per year</div>
                    {familyMembers > 1 && (
                      <div className="text-green-300 text-xs md:text-sm mt-1">
                        Save ₹{365 * familyMembers * 0.10} with family discount
                      </div>
                    )}
                  </div>
                </div>

                <ul className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                  {plans[1].features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm md:text-base">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link to="/signup">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-white text-blue-600 py-3 md:py-4 rounded-xl font-semibold text-sm md:text-base hover:bg-gray-100 transition-colors"
                >
                  Get Family Plan
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Additional Sections */}
      <section className="py-16 bg-white px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Ready to Start Your Healthcare Savings Journey?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied members who are already saving on their medical expenses
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-blue-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-base md:text-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
                >
                  Get Started Now
                </motion.button>
              </Link>
              <Link to="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-gray-300 text-gray-700 px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-base md:text-lg hover:border-blue-600 hover:text-blue-600 transition-colors w-full sm:w-auto"
                >
                  Contact Support
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold">MCS Cards</span>
              </div>
              <p className="text-gray-400 text-sm">
                Making healthcare affordable for every Indian family
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">For Members</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/signup" className="hover:text-white transition-colors">Register</Link></li>
                <li><Link to="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
                <li><Link to="/membership-fee" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">For Partners</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/partner/register" className="hover:text-white transition-colors">Become a Partner</Link></li>
                <li><Link to="/partner/login" className="hover:text-white transition-colors">Login</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              &copy; 2025 MCS Discount Cards. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;