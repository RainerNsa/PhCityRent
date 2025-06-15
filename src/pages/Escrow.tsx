import React from "react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/Footer";
import { Shield, Lock, CheckCircle, Clock, DollarSign, FileText } from "lucide-react";

const Escrow = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-4">Secure Escrow Service</h1>
            <p className="text-xl opacity-90">Safe and secure transactions for peace of mind</p>
          </div>
        </div>

        {/* How It Works */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How Our Escrow Service Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our secure escrow service protects both landlords and tenants during rental transactions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Deposit Funds</h3>
              <p className="text-gray-600">
                Tenant deposits rent and security fees into our secure escrow account
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Verify Agreement</h3>
              <p className="text-gray-600">
                We verify the rental agreement and property details with both parties
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Release Payment</h3>
              <p className="text-gray-600">
                Once conditions are met, funds are securely released to the landlord
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Use Our Escrow Service?</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Secure Transactions</h3>
                    <p className="text-gray-600">Your money is protected in regulated escrow accounts</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Lock className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Fraud Prevention</h3>
                    <p className="text-gray-600">Eliminates risk of fraudulent transactions and fake properties</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Fast Processing</h3>
                    <p className="text-gray-600">Quick verification and release process, usually within 24-48 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Dispute Resolution</h3>
                    <p className="text-gray-600">Professional mediation service for any transaction disputes</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Start Secure Transaction</h3>
              
              <div className="space-y-4 mb-6">
                <div className="bg-white rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">Escrow Fee</span>
                    <span className="text-blue-600 font-semibold">2.5% of transaction</span>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">Processing Time</span>
                    <span className="text-green-600 font-semibold">24-48 hours</span>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">Security</span>
                    <span className="text-green-600 font-semibold">Bank-level encryption</span>
                  </div>
                </div>
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                Start Escrow Process
              </button>
              
              <p className="text-sm text-gray-600 mt-4 text-center">
                Secure, regulated, and trusted by thousands of users
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Escrow;
