import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  CreditCard, 
  Users, 
  Search, 
  FileText, 
  Shield, 
  ArrowRight,
  CheckCircle,
  Star,
  Heart
} from "lucide-react";

const HowItWorks = () => {
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

  const steps = [
    {
      icon: <CreditCard className="w-8 h-8" />,
      step: "01",
      title: "Get Your Membership",
      description: "Sign up for MCS Discount Card with a simple yearly subscription of ₹365 + tax. Complete your profile and get instant access.",
      features: ["₹365/year", "Instant Activation", "Digital Card"],
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <Users className="w-8 h-8" />,
      step: "02",
      title: "Add Family Members",
      description: "Extend your benefits to family members. Add spouses, children, or parents to your family plan for comprehensive coverage.",
      features: ["Family Plans", "Multiple Members", "Shared Benefits"],
      color: "from-green-500 to-green-600"
    },
    {
      icon: <Search className="w-8 h-8" />,
      step: "03",
      title: "Find Healthcare Partners",
      description: "Use our search feature to find verified doctors, pharmacies, and diagnostic centers in your area or across India.",
      features: ["Verified Partners", "Location Search", "Specialty Filters"],
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <FileText className="w-8 h-8" />,
      step: "04",
      title: "Avail Discounts",
      description: "Show your MCS digital card at partner facilities and save up to 25% on medical bills, pharmacy purchases, and diagnostic tests.",
      features: ["Up to 25% Savings", "Instant Discounts", "No Hidden Charges"],
      color: "from-orange-500 to-orange-600"
    }
  ];

  const benefits = [
    {
      icon: <Shield className="w-6 h-6" />,
      text: "Verified Healthcare Providers"
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      text: "Instant Discounts at Partner Facilities"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      text: "Family Coverage Options"
    },
    {
      icon: <Star className="w-6 h-6" />,
      text: "24/7 Customer Support"
    }
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
            How MCS{" "}
            <span className="text-blue-600 relative">
              Works
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
            Get comprehensive healthcare savings in just 4 simple steps. 
            Your journey to affordable healthcare starts here with MCS Discount Cards.
          </motion.p>

          {/* Benefits Grid */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-blue-600">
                  {benefit.icon}
                </div>
                <span className="text-sm font-medium text-gray-700">{benefit.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Steps Section */}
      <motion.section 
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="container mx-auto px-4 mb-20"
      >
        <div className="max-w-6xl mx-auto">
          <div className="relative">
            {/* Connecting Line */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 1.5, delay: 0.5 }}
              className="absolute left-4 md:left-1/2 top-20 h-0.5 bg-gradient-to-r from-blue-500 to-green-500 w-[calc(100%-2rem)] md:w-0 hidden md:block"
            />
            
            <div className="space-y-16 md:space-y-20">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className={`flex flex-col md:flex-row items-center gap-8 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Step Content */}
                  <div className="flex-1 md:px-8">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center text-white`}
                        >
                          {step.icon}
                        </motion.div>
                        <div>
                          <span className="text-sm font-semibold text-gray-500">STEP {step.step}</span>
                          <h3 className="text-2xl font-bold text-gray-900">{step.title}</h3>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {step.description}
                      </p>
                      
                      <div className="space-y-2">
                        {step.features.map((feature, featureIndex) => (
                          <motion.div
                            key={featureIndex}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: featureIndex * 0.1 }}
                            className="flex items-center gap-3"
                          >
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-gray-700">{feature}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </div>

                  {/* Step Number */}
                  <div className="flex-shrink-0">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className={`w-20 h-20 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg`}
                    >
                      {step.step}
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Membership Plans */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="container mx-auto px-4 mb-20"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Simple & Affordable
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 mb-8"
          >
            Choose the plan that works best for you and your family
          </motion.p>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              whileHover={{ y: -10 }}
              className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-blue-100"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Individual Plan</h3>
              <div className="text-4xl font-bold text-blue-600 mb-6">₹365<span className="text-lg text-gray-500">/year</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Single Member Coverage</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Up to 25% Savings</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>All Partner Facilities</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              whileHover={{ y: -10 }}
              className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 rounded-3xl shadow-2xl text-white relative overflow-hidden"
            >
              <div className="absolute top-4 right-4 bg-yellow-500 text-blue-900 px-3 py-1 rounded-full text-sm font-bold">
                POPULAR
              </div>
              <h3 className="text-2xl font-bold mb-4">Family Plan</h3>
              <div className="text-4xl font-bold mb-6">₹365<span className="text-lg opacity-90">/year + Add-ons</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-yellow-400" />
                  <span>Multiple Family Members</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-yellow-400" />
                  <span>Up to 25% Savings</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-yellow-400" />
                  <span>All Partner Facilities</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-yellow-400" />
                  <span>Shared Digital Cards</span>
                </li>
              </ul>
            </motion.div>
          </div>
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
            Ready to Start Saving on Healthcare?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl mb-8 opacity-90"
          >
            Join MCS today and get your discount card in minutes
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/membership">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
              >
                Get Your Card Now
              </motion.button>
            </Link>
            <Link to="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-blue-600 transition-colors"
              >
                Contact Support
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default HowItWorks;