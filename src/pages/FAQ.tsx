import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { 
  Search, 
  Plus, 
  Minus, 
  Users, 
  CreditCard, 
  Shield, 
  FileText,
  Heart,
  Star,
  ArrowRight,
  MessageCircle
} from "lucide-react";

const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [openItems, setOpenItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const faqData = [
    {
      id: 1,
      question: "How do I subscribe to MCS Discount Cards?",
      answer: "Click the 'Get Started' button on our website, complete the registration form with your personal details, upload required documents, and make the payment of ₹365 + tax. You'll receive your digital membership card immediately after payment verification.",
      category: "membership"
    },
    {
      id: 2,
      question: "Can I add family members to my plan?",
      answer: "Yes! You can add family members during signup or later from your dashboard. Each additional member costs ₹365 per year, and when you add multiple family members, you get a 10% discount on the total amount. For example: 2 members = ₹657, 3 members = ₹985.5, and so on.",
      category: "family"
    },
    {
      id: 3,
      question: "How much can I save with MCS Discount Card?",
      answer: "Members save up to 25% on medical bills, pharmacy purchases, and diagnostic tests. The exact discount varies by partner facility, but most offer between 15-25% savings. Some examples: Doctor consultations (20%), Medical tests (25%), Pharmacy bills (15%), Health checkups (25%).",
      category: "usage"
    },
    {
      id: 4,
      question: "How do I use my discount card?",
      answer: "After registration, you'll receive a digital membership card in your dashboard. Simply show this card at any of our partner doctors, pharmacies, or diagnostic centers before availing services. The discount will be applied directly to your bill. You can also search for nearby partners through our website.",
      category: "usage"
    },
    {
      id: 5,
      question: "What is the membership duration and renewal process?",
      answer: "Membership is valid for 365 days from the date of registration. You'll receive reminders 30 days, 15 days, and 7 days before expiry. Renewal can be done easily from your dashboard with one click. The renewal amount remains ₹365 + tax per member.",
      category: "membership"
    },
    {
      id: 6,
      question: "Can I use the card across India?",
      answer: "Yes! MCS Discount Cards are accepted at all our partner facilities across India. We have a growing network of verified doctors, pharmacies, and diagnostic centers in all major cities and towns. Use our search feature to find partners in any location.",
      category: "usage"
    },
    {
      id: 7,
      question: "What documents are required for registration?",
      answer: "For members: Basic personal details, passport photo, and address proof. For doctors: Medical council registration certificate, clinic photos, and identity proof. For pharmacies/diagnostic centers: Government registration certificate and identity proof of responsible person.",
      category: "technical"
    },
    {
      id: 8,
      question: "How do doctors/pharmacies join as partners?",
      answer: "Healthcare providers can register through our 'Doctors Registration' or respective registration pages. After verification of documents and credentials, they become part of our network and can start offering discounts to MCS members.",
      category: "technical"
    },
    {
      id: 9,
      question: "What happens if I lose access to my digital card?",
      answer: "You can always access your digital card by logging into your account. If you've lost login credentials, use the 'Forgot Password' feature. For additional security, you can also download and print your card, or we can send it via email on request.",
      category: "technical"
    },
    {
      id: 10,
      question: "Is there any hidden charges or extra costs?",
      answer: "No hidden charges. The yearly fee of ₹365 + tax is all you pay. There are no transaction fees, service charges, or additional costs when availing discounts at partner facilities. The discount is applied directly to your bill without any extra charges.",
      category: "membership"
    },
    {
      id: 11,
      question: "Can I cancel my membership and get a refund?",
      answer: "Memberships can be cancelled within 7 days of purchase for a full refund, provided no discounts have been availed. After 7 days or if discounts have been used, the membership is non-refundable as the service has been rendered.",
      category: "membership"
    },
    {
      id: 12,
      question: "How do I search for partner facilities?",
      answer: "Use our search feature on the website. You can search by: 1) Service type (Doctor/Pharmacy/Diagnostic), 2) Location or city, 3) Specialty or service needed. The results will show verified partners with complete details including address, timings, and contact information.",
      category: "usage"
    }
  ];

  const categories = [
    { id: "all", name: "All Questions", icon: <FileText className="w-5 h-5" />, count: faqData.length },
    { id: "membership", name: "Membership", icon: <CreditCard className="w-5 h-5" />, count: faqData.filter(faq => faq.category === "membership").length },
    { id: "usage", name: "Usage & Benefits", icon: <Star className="w-5 h-5" />, count: faqData.filter(faq => faq.category === "usage").length },
    { id: "family", name: "Family Plans", icon: <Users className="w-5 h-5" />, count: faqData.filter(faq => faq.category === "family").length },
    { id: "technical", name: "Technical", icon: <Shield className="w-5 h-5" />, count: faqData.filter(faq => faq.category === "technical").length }
  ];

  const toggleItem = (id) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const filteredFaqs = faqData.filter(faq => {
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-20">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-4 mb-12"
      >
        <div className="text-center max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
          >
            Frequently Asked{" "}
            <span className="text-blue-600 relative">
              Questions
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
            Find quick answers to common questions about MCS Discount Cards. 
            Can't find what you're looking for? Contact our support team.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="max-w-2xl mx-auto relative"
          >
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl shadow-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            />
          </motion.div>
        </div>
      </motion.section>

      {/* Categories */}
      <motion.section
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="container mx-auto px-4 mb-12"
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-semibold transition-all ${
                  activeCategory === category.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 shadow-lg hover:shadow-xl'
                }`}
              >
                {category.icon}
                {category.name}
                <span className={`px-2 py-1 rounded-full text-sm ${
                  activeCategory === category.id
                    ? 'bg-white text-blue-600'
                    : 'bg-blue-100 text-blue-600'
                }`}>
                  {category.count}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.section>

      {/* FAQ Items */}
      <motion.section
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="container mx-auto px-4 mb-20"
      >
        <div className="max-w-4xl mx-auto">
          <AnimatePresence>
            {filteredFaqs.length > 0 ? (
              <div className="space-y-4">
                {filteredFaqs.map((faq, index) => (
                  <motion.div
                    key={faq.id}
                    variants={fadeInUp}
                    initial="initial"
                    animate="animate"
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
                  >
                    <button
                      onClick={() => toggleItem(faq.id)}
                      className="w-full px-6 py-6 text-left flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0 mt-1">
                          <span className="font-semibold text-sm">Q</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-lg mb-2 text-left">
                            {faq.question}
                          </h3>
                          <AnimatePresence>
                            {openItems.includes(faq.id) && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="text-gray-600 leading-relaxed text-left"
                              >
                                {faq.answer}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                      <motion.div
                        animate={{ rotate: openItems.includes(faq.id) ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0"
                      >
                        {openItems.includes(faq.id) ? (
                          <Minus className="w-4 h-4" />
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
                      </motion.div>
                    </button>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 mx-auto mb-4">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No questions found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search or browse different categories
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.section>

      {/* Support CTA */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="container mx-auto px-4"
      >
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-12 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-white mx-auto mb-6"
          >
            <MessageCircle className="w-8 h-8" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl font-bold mb-4"
          >
            Still Have Questions?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl mb-8 opacity-90"
          >
            Our support team is here to help you 24/7
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
            >
              Contact Support
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              Call +91-XXXXX-XXXXX
            </motion.button>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default FAQ;