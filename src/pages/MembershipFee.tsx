import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  CreditCard, 
  Users, 
  CheckCircle, 
  Star, 
  Shield,
  Heart,
  Zap,
  Crown,
  ArrowRight,
  Calculator,
  BadgePercent
} from "lucide-react";
import { useState } from "react";

const MembershipFee = () => {
  const [familyMembers, setFamilyMembers] = useState(1);
  
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const individualPlan = {
    name: "Individual Plan",
    price: 365,
    originalPrice: 365,
    description: "Perfect for single members looking for comprehensive healthcare savings",
    icon: <CreditCard className="w-8 h-8" />,
    features: [
      "Single Member Coverage",
      "Up to 25% Savings on Medical Bills",
      "Access to All Partner Doctors",
      "Pharmacy Discounts",
      "Diagnostic Center Savings",
      "Digital Membership Card",
      "24/7 Customer Support",
      "Yearly Renewal"
    ],
    popular: false,
    color: "from-blue-500 to-blue-600"
  };

  const calculateFamilyPrice = (members) => {
    const basePrice = 365;
    const totalWithoutDiscount = basePrice * members;
    const discount = members > 1 ? totalWithoutDiscount * 0.10 : 0;
    return {
      total: totalWithoutDiscount - discount,
      discount: discount,
      perMember: (totalWithoutDiscount - discount) / members
    };
  };

  const familyPrice = calculateFamilyPrice(familyMembers);

  const features = [
    {
      icon: <BadgePercent className="w-6 h-6" />,
      title: "Up to 25% Savings",
      description: "Significant discounts on medical, pharmacy, and diagnostic bills"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Verified Network",
      description: "Access to trusted doctors, pharmacies, and diagnostic centers"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Activation",
      description: "Get your digital card immediately after registration"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Family Coverage",
      description: "Extend benefits to your entire family with special discounts"
    }
  ];

  const savingsExamples = [
    { service: "Doctor Consultation", original: 500, discounted: 375, savings: 125 },
    { service: "Medical Tests", original: 2000, discounted: 1500, savings: 500 },
    { service: "Pharmacy Bill", original: 1000, discounted: 750, savings: 250 },
    { service: "Health Checkup", original: 3000, discounted: 2250, savings: 750 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-20">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-4 mb-20"
      >
        <div className="text-center max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
          >
            Affordable Healthcare{" "}
            <span className="text-blue-600 relative">
              Membership
              <motion.div
                className="absolute -bottom-2 left-0 w-full h-1 bg-blue-600"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              />
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-gray-600 mb-8 leading-relaxed"
          >
            Get comprehensive healthcare coverage for just ₹365 per year. 
            Less than ₹1 per day for significant savings on medical expenses.
          </motion.p>

          {/* Features Grid */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-center"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Pricing Plans */}
      <motion.section 
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="container mx-auto px-4 mb-20"
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            variants={fadeInUp}
            className="text-4xl font-bold text-center text-gray-900 mb-12"
          >
            Choose Your Plan
          </motion.h2>

          <div className="grid lg:grid-cols-2 gap-8 items-stretch">
            {/* Individual Plan */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -10 }}
              className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-blue-100 relative"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-4">
                  {individualPlan.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{individualPlan.name}</h3>
                <p className="text-gray-600 mb-6">{individualPlan.description}</p>
                
                <div className="mb-6">
                  <span className="text-5xl font-bold text-gray-900">₹{individualPlan.price}</span>
                  <span className="text-gray-500 ml-2">/year</span>
                </div>
                <div className="text-sm text-green-600 font-semibold mb-4">
                  Less than ₹1 per day
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {individualPlan.features.map((feature, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </motion.li>
                ))}
              </ul>

              <Link to="/members-registration">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  Get Individual Plan
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </motion.div>

            {/* Family Plan */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -10 }}
              className="bg-gradient-to-br from-blue-600 to-purple-600 p-8 rounded-3xl shadow-2xl text-white relative overflow-hidden"
            >
              <div className="absolute top-6 right-6">
                <div className="bg-yellow-400 text-blue-900 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                  <Crown className="w-4 h-4" />
                  MOST POPULAR
                </div>
              </div>

              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-white mx-auto mb-4">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Family Plan</h3>
                <p className="opacity-90 mb-6">Perfect for families with special discounts</p>

                {/* Family Member Selector */}
                <div className="bg-white/10 rounded-2xl p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-semibold">Family Members</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setFamilyMembers(Math.max(1, familyMembers - 1))}
                        className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
                      >
                        -
                      </button>
                      <span className="font-bold text-xl w-8 text-center">{familyMembers}</span>
                      <button
                        onClick={() => setFamilyMembers(familyMembers + 1)}
                        className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Base Price ({familyMembers} × ₹365)</span>
                      <span>₹{365 * familyMembers}</span>
                    </div>
                    {familyMembers > 1 && (
                      <div className="flex justify-between text-green-300">
                        <span>Family Discount (10%)</span>
                        <span>-₹{familyPrice.discount}</span>
                      </div>
                    )}
                    <div className="border-t border-white/20 pt-2 flex justify-between font-bold text-lg">
                      <span>Total Yearly</span>
                      <span>₹{familyPrice.total}</span>
                    </div>
                    <div className="text-center text-yellow-300 font-semibold">
                      Only ₹{Math.round(familyPrice.perMember)} per member
                    </div>
                  </div>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                  <span>Coverage for {familyMembers} Family Member{familyMembers > 1 ? 's' : ''}</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                  <span>All Individual Plan Features</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                  <span>Shared Digital Cards</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                  <span>Family Management Dashboard</span>
                </li>
              </ul>

              <Link to="/members-registration">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-white text-blue-600 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                >
                  Get Family Plan
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Savings Calculator */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="container mx-auto px-4 mb-20"
      >
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 shadow-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 mx-auto mb-4">
              <Calculator className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              See Your Potential Savings
            </h2>
            <p className="text-gray-600">
              Calculate how much you can save with MCS Discount Card
            </p>
          </motion.div>

          <div className="grid gap-4">
            {savingsExamples.map((example, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors"
              >
                <span className="font-semibold text-gray-700">{example.service}</span>
                <div className="flex items-center gap-4">
                  <span className="text-gray-500 line-through">₹{example.original}</span>
                  <span className="text-green-600 font-bold">₹{example.discounted}</span>
                  <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                    Save ₹{example.savings}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-8 p-6 bg-blue-50 rounded-2xl"
          >
            <p className="text-lg font-semibold text-gray-900">
              Total Potential Savings:{" "}
              <span className="text-green-600">
                ₹{savingsExamples.reduce((acc, curr) => acc + curr.savings, 0)} per year
              </span>
            </p>
            <p className="text-gray-600 mt-2">
              Your membership pays for itself with just a few visits!
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="container mx-auto px-4"
      >
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-12 text-center text-white">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold mb-4"
          >
            Start Saving on Healthcare Today
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl mb-8 opacity-90"
          >
            Join thousands of members who are already saving 25% on their medical expenses
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/members-registration">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
              >
                Get Started - ₹365/Year
              </motion.button>
            </Link>
            <Link to="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-blue-600 transition-colors"
              >
                Have Questions?
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default MembershipFee;