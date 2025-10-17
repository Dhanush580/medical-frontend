import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { 
  Phone, 
  Mail, 
  MessageCircle, 
  MapPin, 
  Clock,
  Send,
  User,
  MessageSquare,
  Shield,
  Heart,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import { apiUrl } from "@/lib/api";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    userType: "member"
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  const handleContactAction = (action) => {
    if (action.startsWith('tel:') || action.startsWith('mailto:')) {
      window.location.href = action;
    } else {
      window.open(action, '_blank');
    }
  };

  const contactMethods = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Call Us",
      description: "Speak directly with our support team",
      details: "+91-98765-43210",
      action: "tel:+919876543210",
      buttonText: "Call Now",
      color: "from-green-500 to-green-600",
      hoverColor: "hover:from-green-600 hover:to-green-700"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Us",
      description: "Send us an email anytime",
      details: "support@mcsdiscount.com",
      action: "mailto:support@mcsdiscount.com",
      buttonText: "Email Now",
      color: "from-blue-500 to-blue-600",
      hoverColor: "hover:from-blue-600 hover:to-blue-700"
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "WhatsApp",
      description: "Quick chat support",
      details: "+91-98765-43210",
      action: "https://wa.me/919876543210",
      buttonText: "Message Now",
      color: "from-green-400 to-green-500",
      hoverColor: "hover:from-green-500 hover:to-green-600"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Visit Office",
      description: "Meet us in person",
      details: "123 Healthcare Street, Medical District, Mumbai, Maharashtra 400001",
      action: "https://maps.google.com",
      buttonText: "Get Directions",
      color: "from-purple-500 to-purple-600",
      hoverColor: "hover:from-purple-600 hover:to-purple-700"
    }
  ];

  const supportHours = [
    { day: "Monday - Friday", hours: "9:00 AM - 6:00 PM" },
    { day: "Saturday", hours: "10:00 AM - 4:00 PM" },
    { day: "Sunday", hours: "Emergency Support Only" }
  ];

  const userTypes = [
    { value: "member", label: "MCS Member" },
    { value: "doctor", label: "Healthcare Provider" },
    { value: "pharmacy", label: "Pharmacy Partner" },
    { value: "diagnostic", label: "Diagnostic Center" },
    { value: "general", label: "General Inquiry" }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(apiUrl('api/contact/submit'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
          userType: "member"
        });
        setTimeout(() => setIsSubmitted(false), 5000);
      } else {
        alert(data.message || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Contact form submission error:', error);
      alert('Network error. Please check your connection and try again.');
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-20">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-4 mb-16"
      >
        <div className="text-center max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
          >
            Get in{" "}
            <span className="text-blue-600 relative">
              Touch
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
            We're here to help you with any questions about MCS Discount Cards. 
            Reach out to our support team through any channel below.
          </motion.p>
        </div>
      </motion.section>

      {/* Contact Methods */}
      <motion.section
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="container mx-auto px-4 mb-20"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {contactMethods.map((method, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className={`bg-gradient-to-r ${method.color} p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col min-h-[280px]`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                      {method.icon}
                    </div>
                    <h3 className="font-bold text-lg">{method.title}</h3>
                  </div>
                  <p className="opacity-90 mb-3 text-sm">{method.description}</p>
                  <p className="font-semibold">{method.details}</p>
                </div>
                <motion.button
                  onClick={() => handleContactAction(method.action)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-white/90 hover:bg-white text-gray-800 hover:text-gray-900 font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg backdrop-blur-sm border border-white/20"
                >
                  {method.buttonText}
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Main Content */}
      <motion.section
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="container mx-auto px-4 mb-20"
      >
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            variants={fadeInUp}
            className="bg-white rounded-3xl p-8 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Send us a Message</h2>
                <p className="text-gray-600">We'll respond within 24 hours</p>
              </div>
            </div>

            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-600 mb-6">
                  Thank you for contacting us. We'll get back to you within 24 hours.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsSubmitted(false)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Send Another Message
                </motion.button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    I am a...
                  </label>
                  <select
                    name="userType"
                    value={formData.userType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  >
                    {userTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    placeholder="What is this regarding?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
                    placeholder="Please describe your inquiry in detail..."
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-3"
                >
                  <Send className="w-5 h-5" />
                  Send Message
                </motion.button>
              </form>
            )}
          </motion.div>

          {/* Support Information */}
          <motion.div
            variants={fadeInUp}
            className="space-y-8"
          >
            {/* Support Hours */}
            <div className="bg-white rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Support Hours</h2>
                  <p className="text-gray-600">We're here when you need us</p>
                </div>
              </div>

              <div className="space-y-4">
                {supportHours.map((schedule, index) => (
                  <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                    <span className="font-semibold text-gray-700">{schedule.day}</span>
                    <span className="text-gray-600">{schedule.hours}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                <p className="text-sm text-blue-700">
                  <strong>Emergency Support:</strong> Available 24/7 for critical membership issues
                </p>
              </div>
            </div>

            {/* Why Choose MCS */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-8 text-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Why Choose MCS?</h2>
                  <p className="opacity-90">Trusted by thousands across India</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-yellow-300" />
                  <span>Up to 25% savings on healthcare</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-yellow-300" />
                  <span>Verified healthcare partners</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-yellow-300" />
                  <span>Instant digital membership card</span>
                </div>
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-yellow-300" />
                  <span>Family coverage options</span>
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="mt-6 bg-white text-blue-600 py-3 px-6 rounded-xl font-semibold text-center hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Learn More About MCS
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Quick Actions */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="container mx-auto px-4"
      >
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 shadow-2xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-center text-gray-900 mb-8"
          >
            Quick Actions
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-6">
            <motion.a
              whileHover={{ scale: 1.05 }}
              href="/members-registration"
              className="bg-blue-50 p-6 rounded-2xl text-center hover:bg-blue-100 transition-colors group"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                <User className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Become a Member</h3>
              <p className="text-sm text-gray-600">Get your discount card today</p>
            </motion.a>

            <motion.a
              whileHover={{ scale: 1.05 }}
              href="/doctors-registration"
              className="bg-green-50 p-6 rounded-2xl text-center hover:bg-green-100 transition-colors group"
            >
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Partner With Us</h3>
              <p className="text-sm text-gray-600">Join as healthcare provider</p>
            </motion.a>

            <motion.a
              whileHover={{ scale: 1.05 }}
              href="/faq"
              className="bg-purple-50 p-6 rounded-2xl text-center hover:bg-purple-100 transition-colors group"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">View FAQ</h3>
              <p className="text-sm text-gray-600">Find quick answers</p>
            </motion.a>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default ContactUs;