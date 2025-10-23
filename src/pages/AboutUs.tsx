import { motion } from "framer-motion";
import { Heart, Shield, Users, Award, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const AboutUs = () => {
  const navigate = useNavigate();
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

  const features = [
    {
      icon: <Heart className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />,
      title: "Healthcare Savings",
      description: "Save up to 25% on medical bills, pharmacy purchases, and diagnostic tests through our extensive network."
    },
    {
      icon: <Shield className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />,
      title: "Trusted Network",
      description: "Verified doctors, pharmacies, and diagnostic centers ensuring quality healthcare services across India."
    },
    {
      icon: <Users className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />,
      title: "Family Coverage",
      description: "Extend your benefits to family members with our flexible family membership plans."
    },
    {
      icon: <Award className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />,
      title: "🎁 FREE Dental Consultation",
      description: "Unlimited free dental consultations throughout the year for all verified members and their families. No limits, no hidden costs!",
      highlight: true
    }
  ];

  const stats = [
    { number: "25%", label: "Average Savings" },
    { number: "365", label: "Days Coverage" },
    { number: "1000+", label: "Verified Partners" },
    { number: "24/7", label: "Support" }
  ];

  return (
    <>
      <Helmet>
        <title>About Us | MEDI COST SAVER - Healthcare Savings Made Affordable</title>
        <meta name="description" content="Learn about MEDI COST SAVER's mission to make healthcare affordable for every Indian family. Discover our healthcare discount network, verified partners, and commitment to quality medical care." />
        <meta name="keywords" content="about MEDI COST SAVER, healthcare discount card, medical savings India, affordable healthcare, healthcare network India" />
        <meta property="og:title" content="About MEDI COST SAVER - Making Healthcare Affordable" />
        <meta property="og:description" content="Revolutionizing healthcare accessibility by connecting members with trusted medical professionals across India for significant savings." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://medicostsaver.com/about" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 sm:py-12 md:py-20 pb-8 md:pb-12">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-4 mb-12 md:mb-20"
      >
        <div className="text-center max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6"
          >
            Making Healthcare{" "}
            <span className="text-blue-600 relative">
              Affordable
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
            className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 md:mb-8 leading-relaxed"
          >
            MCS Discount Cards is revolutionizing healthcare accessibility by connecting members 
            with trusted medical professionals, pharmacies, and diagnostic centers across India, 
            ensuring significant savings on healthcare expenses.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/coming-soon')}
              className="w-full sm:w-auto bg-blue-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold text-sm md:text-base flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
            >
              Get Your Card Now
              <ArrowRight className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/how-it-works'}
              className="w-full sm:w-auto border-2 border-gray-300 text-gray-700 px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold text-sm md:text-base hover:border-blue-600 hover:text-blue-600 transition-colors"
            >
              How It Works
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section 
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="container mx-auto px-4 mb-12 md:mb-20"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="text-center p-4 md:p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-2xl md:text-3xl font-bold text-blue-600 mb-2"
              >
                {stat.number}
              </motion.div>
              <div className="text-sm md:text-base text-gray-600 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="container mx-auto px-4 mb-12 md:mb-20"
      >
        <motion.div
          variants={fadeInUp}
          className="text-center max-w-2xl mx-auto mb-12 sm:mb-14 md:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose MCS?
          </h2>
          <p className="text-base md:text-lg text-gray-600">
            We're committed to making quality healthcare accessible and affordable for every Indian family
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              whileHover={{ y: -10 }}
              className={`p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 group ${
                feature.highlight 
                  ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 ring-2 ring-green-100' 
                  : 'bg-white'
              }`}
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:text-white transition-colors ${
                  feature.highlight 
                    ? 'bg-green-100 text-green-600 group-hover:bg-green-600' 
                    : 'bg-blue-100 text-blue-600 group-hover:bg-blue-600'
                }`}
              >
                {feature.icon}
              </motion.div>
              <h3 className={`text-lg md:text-xl font-semibold mb-3 md:mb-4 ${
                feature.highlight ? 'text-green-800' : 'text-gray-900'
              }`}>
                {feature.title}
              </h3>
              <p className={`text-sm md:text-base leading-relaxed ${
                feature.highlight ? 'text-green-700 font-medium' : 'text-gray-600'
              }`}>
                {feature.description}
              </p>
              {feature.highlight && (
                <div className="mt-3">
                  <span className="inline-block bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                    EXCLUSIVE
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Mission Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="container mx-auto px-4 mb-12 md:mb-20"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl"
          >
            <h2 className="text-2xl sm:text-3xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">
              Our Mission
            </h2>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-6 md:mb-8">
              To democratize healthcare access by creating a sustainable ecosystem where members 
              save significantly on medical expenses while healthcare providers expand their reach 
              to genuine patients. We believe that quality healthcare should be a right, not a privilege.
            </p>
            <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
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
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-6 md:p-12 text-center text-white">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-2xl md:text-3xl font-bold mb-4"
          >
            Ready to Start Saving?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl mb-6 md:mb-8 opacity-90"
          >
            Join thousands of members who are already saving on their healthcare expenses
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/coming-soon')}
              className="w-full sm:w-auto bg-white text-blue-600 px-6 md:px-8 py-3 md:py-4 rounded-lg font-bold text-base md:text-lg hover:bg-gray-100 transition-colors"
            >
              Get Started - ₹365/Year
            </motion.button>
          </motion.div>
        </div>
      </motion.section>
    </div>
    </>
  );
};

export default AboutUs;
