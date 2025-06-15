import React from "react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/Footer";
import { Home, DollarSign, Shield, Users, TrendingUp, CheckCircle } from "lucide-react";

const Landlords = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-4">For Landlords</h1>
            <p className="text-xl opacity-90">Maximize your rental income with our comprehensive landlord services</p>
          </div>
        </div>

        {/* Benefits */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose PHCityRent for Your Properties?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We provide comprehensive property management and marketing services to help you maximize your rental income
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Home className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Property Marketing</h3>
              <p className="text-gray-600">
                Professional photography and marketing to showcase your property to quality tenants
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Tenant Screening</h3>
              <p className="text-gray-600">
                Comprehensive background checks and verification to find reliable tenants
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Rent Collection</h3>
              <p className="text-gray-600">
                Automated rent collection and financial reporting for hassle-free income
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Legal Protection</h3>
              <p className="text-gray-600">
                Legal document templates and support for lease agreements and disputes
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Market Analysis</h3>
              <p className="text-gray-600">
                Regular market reports and pricing recommendations to optimize your returns
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Property Maintenance</h3>
              <p className="text-gray-600">
                Coordination of maintenance and repairs with trusted local contractors
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to List Your Property?</h2>
                <p className="text-lg text-gray-600 mb-6">
                  Join thousands of landlords who trust PHCityRent to manage and market their properties. 
                  Get started today and see the difference professional property management makes.
                </p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Free property valuation</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Professional photography included</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">No upfront fees</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors">
                    List Your Property
                  </button>
                  <button className="border border-purple-600 text-purple-600 hover:bg-purple-50 font-semibold py-3 px-8 rounded-lg transition-colors">
                    Learn More
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Our Commission Structure</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2">
                    <span className="font-medium text-gray-700">Property Marketing</span>
                    <span className="text-purple-600 font-semibold">Free</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="font-medium text-gray-700">Tenant Placement</span>
                    <span className="text-purple-600 font-semibold">10% of first month</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="font-medium text-gray-700">Property Management</span>
                    <span className="text-purple-600 font-semibold">8% monthly</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between items-center py-2">
                      <span className="font-bold text-gray-900">Complete Package</span>
                      <span className="text-purple-600 font-bold text-lg">15% monthly</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-500 mt-4">
                  * All prices are competitive and include comprehensive services
                </p>
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
