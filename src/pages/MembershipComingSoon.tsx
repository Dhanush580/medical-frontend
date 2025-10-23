import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Clock, Users, Heart, Shield, Star, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';

const MembershipComingSoon = () => {
  return (
    <>
      <Helmet>
        <title>Membership Registration - Coming Soon | MEDI COST SAVER</title>
        <meta name="description" content="MEDI COST SAVER membership registration will be available soon. Join our healthcare discount network and save on medical expenses." />
        <meta name="keywords" content="MEDI COST SAVER membership, healthcare discount card, medical savings membership, healthcare registration coming soon" />
        <meta property="og:title" content="Membership Registration Coming Soon | MEDI COST SAVER" />
        <meta property="og:description" content="We're building a comprehensive healthcare discount network. Membership registration will be available soon!" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://medicostsaver.vercel.app/coming-soon" />
      </Helmet>

      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center px-4 py-12 pt-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Clock className="h-4 w-4" />
              Coming Soon
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              Membership Registration
              <span className="block text-blue-600">Coming Soon</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're currently focusing on building our network of healthcare partners.
              Membership registration will be available in the coming months.
            </p>
          </div>

          {/* Main Content Card */}
          <Card className="mb-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Left Side - Benefits */}
                <div className="text-left">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    What You'll Get When We Launch
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Heart className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">10% Discount</h3>
                        <p className="text-gray-600 text-sm">On all medical services at partner facilities</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <Shield className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Comprehensive Coverage</h3>
                        <p className="text-gray-600 text-sm">Hospitals, clinics, pharmacies, and diagnostics</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-purple-100 p-2 rounded-lg">
                        <Users className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Family Coverage</h3>
                        <p className="text-gray-600 text-sm">Add unlimited family members to your plan</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-orange-100 p-2 rounded-lg">
                        <Star className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Priority Access</h3>
                        <p className="text-gray-600 text-sm">Skip queues and get priority consultations</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side - Timeline */}
                <div className="text-center md:text-left">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-2xl">
                    <Calendar className="h-12 w-12 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Launch Timeline</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span>Partner Network Building</span>
                        <span className="bg-white/20 px-2 py-1 rounded">Current</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Membership Registration</span>
                        <span className="bg-white/20 px-2 py-1 rounded">Soon</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Full Launch</span>
                        <span className="bg-white/20 px-2 py-1 rounded">Q1 2026</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Want to Stay Updated?
            </h2>
            <p className="text-gray-600 mb-6">
              Be the first to know when membership registration opens. Join our waitlist for exclusive early access.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold"
                onClick={() => window.location.href = '/contact'}
              >
                Join Waitlist
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-blue-200 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold"
                onClick={() => window.location.href = '/partner'}
              >
                Become a Partner
              </Button>
            </div>
          </div>

          {/* Footer Message */}
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              Questions? <a href="/contact" className="text-blue-600 hover:text-blue-700 font-medium">Contact us</a> or email us at{' '}
              <a href="mailto:medicostsaver@gmail.com" className="text-blue-600 hover:text-blue-700 font-medium">
                medicostsaver@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default MembershipComingSoon;