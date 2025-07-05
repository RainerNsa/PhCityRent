
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/Footer";
import EnhancedBreadcrumb from "@/components/ui/enhanced-breadcrumb";
import { Button } from "@/components/ui/button";
import { Home, DollarSign, Shield, Users, TrendingUp, CheckCircle, Star, Phone, Mail } from "lucide-react";

const Landlords = () => {
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'premium' | 'enterprise'>('premium');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <EnhancedBreadcrumb 
            items={[{ label: 'For Landlords' }]} 
          />

          {/* Enhanced Header */}
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-3xl p-8 lg:p-12 mb-12 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10 rounded-3xl"></div>
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                      <Home className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl lg:text-5xl font-bold">For Landlords</h1>
                  </div>
                  <p className="text-purple-100 text-lg lg:text-xl max-w-4xl leading-relaxed">
                    Maximize your rental income with our comprehensive property management and marketing services. 
                    Join thousands of successful landlords in Port Harcourt.
                  </p>
                </div>
                <div className="hidden lg:flex items-center justify-center w-24 h-24 bg-white/10 rounded-full backdrop-blur-sm">
                  <DollarSign className="w-12 h-12" />
                </div>
              </div>
            </div>
          </div>

          {/* Benefits Grid */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Why Choose PHCityRent?</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                We provide comprehensive property management and marketing services to help you maximize your rental income
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 group">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-200 transition-colors">
                  <Home className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Professional Marketing</h3>
                <p className="text-gray-600 leading-relaxed">
                  Professional photography, virtual tours, and strategic marketing to showcase your property to quality tenants across all major platforms.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 group">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-200 transition-colors">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Tenant Screening</h3>
                <p className="text-gray-600 leading-relaxed">
                  Comprehensive background checks, credit verification, and employment screening to find reliable, long-term tenants.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 group">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-200 transition-colors">
                  <DollarSign className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Automated Rent Collection</h3>
                <p className="text-gray-600 leading-relaxed">
                  Secure online rent collection with automatic reminders, late fee processing, and detailed financial reporting.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 group">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-200 transition-colors">
                  <Shield className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Legal Protection</h3>
                <p className="text-gray-600 leading-relaxed">
                  Legal document templates, eviction support, and compliance assistance to protect your investment.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 group">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-200 transition-colors">
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Market Intelligence</h3>
                <p className="text-gray-600 leading-relaxed">
                  Regular market reports, competitive analysis, and pricing recommendations to optimize your returns.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 group">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-200 transition-colors">
                  <CheckCircle className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">24/7 Maintenance</h3>
                <p className="text-gray-600 leading-relaxed">
                  Round-the-clock maintenance coordination with trusted local contractors and emergency response services.
                </p>
              </div>
            </div>
          </div>

          {/* Pricing Plans */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
              <p className="text-lg text-gray-600">Transparent pricing with no hidden fees</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Basic Plan */}
              <div className={`bg-white rounded-2xl p-8 shadow-lg border-2 transition-all duration-300 ${
                selectedPlan === 'basic' ? 'border-purple-500 shadow-xl' : 'border-gray-200 hover:border-purple-300'
              }`}>
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2">Basic</h3>
                  <div className="text-3xl font-bold text-purple-600 mb-2">8%</div>
                  <p className="text-gray-600 text-sm">of monthly rent</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Property listing</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Tenant screening</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Rent collection</span>
                  </li>
                </ul>
                <Button 
                  onClick={() => setSelectedPlan('basic')}
                  className="w-full"
                  variant={selectedPlan === 'basic' ? 'default' : 'outline'}
                >
                  Choose Basic
                </Button>
              </div>

              {/* Premium Plan */}
              <div className={`bg-white rounded-2xl p-8 shadow-lg border-2 transition-all duration-300 relative ${
                selectedPlan === 'premium' ? 'border-purple-500 shadow-xl' : 'border-gray-200 hover:border-purple-300'
              }`}>
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </div>
                </div>
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2">Premium</h3>
                  <div className="text-3xl font-bold text-purple-600 mb-2">12%</div>
                  <p className="text-gray-600 text-sm">of monthly rent</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Everything in Basic</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Professional photography</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Maintenance coordination</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Legal document support</span>
                  </li>
                </ul>
                <Button 
                  onClick={() => setSelectedPlan('premium')}
                  className="w-full"
                  variant={selectedPlan === 'premium' ? 'default' : 'outline'}
                >
                  Choose Premium
                </Button>
              </div>

              {/* Enterprise Plan */}
              <div className={`bg-white rounded-2xl p-8 shadow-lg border-2 transition-all duration-300 ${
                selectedPlan === 'enterprise' ? 'border-purple-500 shadow-xl' : 'border-gray-200 hover:border-purple-300'
              }`}>
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
                  <div className="text-3xl font-bold text-purple-600 mb-2">15%</div>
                  <p className="text-gray-600 text-sm">of monthly rent</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Everything in Premium</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">24/7 emergency support</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Dedicated account manager</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Custom marketing campaigns</span>
                  </li>
                </ul>
                <Button 
                  onClick={() => setSelectedPlan('enterprise')}
                  className="w-full"
                  variant={selectedPlan === 'enterprise' ? 'default' : 'outline'}
                >
                  Choose Enterprise
                </Button>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-3xl p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Ready to Get Started?</h2>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  Join thousands of landlords who trust PHCityRent to manage and market their properties. 
                  Get started today and see the difference professional property management makes.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">Free property valuation and market analysis</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">Professional photography and virtual tours included</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">No setup fees or long-term contracts</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/auth">
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg">
                      List Your Property
                    </Button>
                  </Link>
                  <a href="mailto:landlords@phcityrent.com">
                    <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50 font-semibold py-3 px-8 rounded-xl transition-all duration-200">
                      Schedule Consultation
                    </Button>
                  </a>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Get In Touch</h3>
                
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Phone className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Call Us</p>
                      <a href="tel:+2348031234567" className="text-purple-600 hover:text-purple-700">
                        +234 803 123 4567
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Mail className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Email Us</p>
                      <a href="mailto:landlords@phcityrent.com" className="text-purple-600 hover:text-purple-700">
                        landlords@phcityrent.com
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-purple-50 rounded-xl">
                  <p className="text-sm text-purple-700 text-center">
                    <strong>Special Offer:</strong> First month management fee waived for new landlords!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Landlords;
