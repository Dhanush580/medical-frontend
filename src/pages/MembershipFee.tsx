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
import { Helmet } from "react-helmet-async";

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
    icon: <CreditCard className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />,
    features: [
      "Single Member Coverage",
      "Up to 25% Savings on Medical Bills",
      "Free Dental Consultation (Unlimited Visits)",
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
      icon: <BadgePercent className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Up to 25% Savings",
      description: "Significant discounts on medical, pharmacy, and diagnostic bills"
    },
    {
      icon: <Shield className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Verified Network",
      description: "Access to trusted doctors, pharmacies, and diagnostic centers"
    },
    {
      icon: <Zap className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Instant Activation",
      description: "Get your digital card immediately after registration"
    },
    {
      icon: <Heart className="w-5 h-5 sm:w-6 sm:h-6" />,
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
    <>
      <Helmet>
        <title>Membership Fee | MEDI COST SAVER - Healthcare Discount Card Pricing</title>
        <meta name="description" content="Check MEDI COST SAVER membership fees and pricing. Individual plan ₹365/year, family plans available. Get up to 25% savings on medical expenses with our healthcare discount card." />
        <meta name="keywords" content="MEDI COST SAVER membership fee, healthcare discount card price, medical savings cost, family healthcare plan pricing, discount card subscription" />
        <meta property="og:title" content="MEDI COST SAVER Membership Fees - Healthcare Discount Pricing" />
        <meta property="og:description" content="Affordable healthcare savings with MEDI COST SAVER. Individual ₹365/year, family plans available. 25% medical bill discounts." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://medicostsaver.com/membership-fee" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 sm:py-12 md:py-16 lg:py-20">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-4 mb-12 sm:mb-16 md:mb-20"
      >
        <div className="text-center max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-5 md:mb-6"
          >
            Affordable Healthcare{" "}
            <span className="text-blue-600 relative">
              Membership
              <motion.div
                className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-0.5 sm:h-1 bg-blue-600"
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
            className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-7 md:mb-8 leading-relaxed"
          >
            Get comprehensive healthcare coverage for just ₹365 per year. 
            Less than ₹1 per day for significant savings on medical expenses.
          </motion.p>

          {/* Features Grid */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 mb-8 sm:mb-10 md:mb-12"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className="bg-white p-4 sm:p-5 md:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-center"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-3 sm:mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-1 sm:mb-2">{feature.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600">{feature.description}</p>
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
        className="container mx-auto px-4 mb-12 sm:mb-16 md:mb-20"
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            variants={fadeInUp}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8 sm:mb-10 md:mb-12"
          >
            Choose Your Plan
          </motion.h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-7 md:gap-8 items-stretch">
            {/* Individual Plan */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -10 }}
              className="bg-white p-6 sm:p-7 md:p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-blue-100 relative"
            >
              <div className="text-center mb-6 sm:mb-7 md:mb-8">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-3 sm:mb-4">
                  {individualPlan.icon}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{individualPlan.name}</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-5 md:mb-6">{individualPlan.description}</p>
                
                <div className="mb-4 sm:mb-5 md:mb-6">
                  <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">₹{individualPlan.price}</span>
                  <span className="text-sm sm:text-base text-gray-500 ml-2">/year</span>
                </div>
                <div className="text-xs sm:text-sm text-green-600 font-semibold mb-3 sm:mb-4">
                  Less than ₹1 per day
                </div>
              </div>

              <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-7 md:mb-8">
                {individualPlan.features.map((feature, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center gap-2 sm:gap-3"
                  >
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm sm:text-base text-gray-700">{feature}</span>
                  </motion.li>
                ))}
              </ul>

              <Link to="/coming-soon" className="block w-full">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-blue-600 text-white py-3 sm:py-3.5 md:py-4 rounded-xl font-semibold text-sm sm:text-base hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
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
              className="bg-gradient-to-br from-blue-600 to-purple-600 p-6 sm:p-7 md:p-8 rounded-3xl shadow-2xl text-white relative overflow-hidden"
            >
              <div className="absolute top-4 sm:top-5 md:top-6 right-4 sm:right-5 md:right-6">
                <div className="bg-yellow-400 text-blue-900 px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full text-xs sm:text-sm font-bold flex items-center gap-1 sm:gap-2">
                  <Crown className="w-3 h-3 sm:w-4 sm:h-4" />
                  MOST POPULAR
                </div>
              </div>

              <div className="text-center mb-6 sm:mb-7 md:mb-8">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/20 rounded-2xl flex items-center justify-center text-white mx-auto mb-3 sm:mb-4">
                  <Users className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2">Family Plan</h3>
                <p className="text-sm sm:text-base opacity-90 mb-4 sm:mb-5 md:mb-6">Perfect for families with special discounts</p>

                {/* Family Member Selector */}
                <div className="bg-white/10 rounded-2xl p-4 sm:p-5 md:p-6 mb-4 sm:mb-5 md:mb-6">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <span className="text-sm sm:text-base font-semibold">Family Members</span>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <button
                        onClick={() => setFamilyMembers(Math.max(1, familyMembers - 1))}
                        className="w-7 h-7 sm:w-8 sm:h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors text-sm sm:text-base"
                      >
                        -
                      </button>
                      <span className="font-bold text-lg sm:text-xl w-7 sm:w-8 text-center">{familyMembers}</span>
                      <button
                        onClick={() => setFamilyMembers(familyMembers + 1)}
                        className="w-7 h-7 sm:w-8 sm:h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors text-sm sm:text-base"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
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
                    <div className="border-t border-white/20 pt-2 flex justify-between font-bold text-base sm:text-lg">
                      <span>Total Yearly</span>
                      <span>₹{familyPrice.total}</span>
                    </div>
                    <div className="text-center text-yellow-300 font-semibold text-xs sm:text-sm">
                      Only ₹{Math.round(familyPrice.perMember)} per member
                    </div>
                  </div>
                </div>
              </div>

              <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-7 md:mb-8">
                <li className="flex items-center gap-2 sm:gap-3">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 flex-shrink-0" />
                  <span className="text-sm sm:text-base">Coverage for {familyMembers} Family Member{familyMembers > 1 ? 's' : ''}</span>
                </li>
                <li className="flex items-center gap-2 sm:gap-3">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 flex-shrink-0" />
                  <span className="text-sm sm:text-base">All Individual Plan Features</span>
                </li>
                <li className="flex items-center gap-2 sm:gap-3">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 flex-shrink-0" />
                  <span className="text-sm sm:text-base">Shared Digital Cards</span>
                </li>
                <li className="flex items-center gap-2 sm:gap-3">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 flex-shrink-0" />
                  <span className="text-sm sm:text-base">Family Management Dashboard</span>
                </li>
              </ul>

              <Link to="/coming-soon" className="block w-full">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-white text-blue-600 py-3 sm:py-3.5 md:py-4 rounded-xl font-semibold text-sm sm:text-base hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
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
        className="container mx-auto px-4 mb-12 sm:mb-16 md:mb-20"
      >
        <div className="max-w-4xl mx-auto bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-7 md:p-8 shadow-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-6 sm:mb-7 md:mb-8"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 mx-auto mb-3 sm:mb-4">
              <Calculator className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              See Your Potential Savings
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Calculate how much you can save with MCS Discount Card
            </p>
          </motion.div>

          <div className="grid gap-3 sm:gap-4">
            {savingsExamples.map((example, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors"
              >
                <span className="font-semibold text-sm sm:text-base text-gray-700">{example.service}</span>
                <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-wrap">
                  <span className="text-xs sm:text-sm text-gray-500 line-through">₹{example.original}</span>
                  <span className="text-sm sm:text-base text-green-600 font-bold">₹{example.discounted}</span>
                  <div className="bg-green-100 text-green-700 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-semibold">
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
            className="text-center mt-6 sm:mt-7 md:mt-8 p-4 sm:p-5 md:p-6 bg-blue-50 rounded-2xl"
          >
            <p className="text-base sm:text-lg font-semibold text-gray-900">
              Total Potential Savings:{" "}
              <span className="text-green-600">
                ₹{savingsExamples.reduce((acc, curr) => acc + curr.savings, 0)} per year
              </span>
            </p>
            <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
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
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 text-center text-white">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4"
          >
            Start Saving on Healthcare Today
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl mb-6 sm:mb-7 md:mb-8 opacity-90"
          >
            Join thousands of members who are already saving 25% on their medical expenses
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
          >
            <Link to="/coming-soon" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-white text-blue-600 px-6 sm:px-7 md:px-8 py-3 sm:py-3.5 md:py-4 rounded-lg font-bold text-sm sm:text-base md:text-lg hover:bg-gray-100 transition-colors"
              >
                Get Started - ₹365/Year
              </motion.button>
            </Link>
            <Link to="/contact" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full border-2 border-white text-white px-6 sm:px-7 md:px-8 py-3 sm:py-3.5 md:py-4 rounded-lg font-bold text-sm sm:text-base md:text-lg hover:bg-white hover:text-blue-600 transition-colors"
              >
                Have Questions?
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
    </>
  );
};

export default MembershipFee;
