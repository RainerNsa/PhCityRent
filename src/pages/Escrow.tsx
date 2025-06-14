
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, Lock, CheckCircle, Clock, CreditCard, AlertTriangle, Phone } from "lucide-react";

const Escrow = () => {
  const steps = [
    {
      icon: Lock,
      title: "Secure Payment with Nigerian Banks",
      description: "Your rent is held safely in partnership with GTBank, First Bank, and Access Bank"
    },
    {
      icon: CheckCircle,
      title: "Physical Property Verification",
      description: "Our Port Harcourt team physically visits and verifies every property exists"
    },
    {
      icon: Shield,
      title: "Keys-in-Hand Guarantee",
      description: "Funds only release when you confirm you have the keys and property access"
    }
  ];

  const protectionStats = [
    { amount: "₦50,000,000+", label: "Protected from Scams" },
    { amount: "1,200+", label: "Successful Transactions" },
    { amount: "0", label: "Money Lost by Users" },
    { amount: "24hrs", label: "Average Resolution Time" }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-4">
                <Shield className="w-5 h-5" />
                <span>Bank-Grade Security</span>
              </div>
              <h1 className="text-4xl font-bold mb-4">Never Lose Your Rent Money Again</h1>
              <p className="text-xl opacity-90">
                Port Harcourt's most trusted escrow service. Your money stays safe until you get your keys.
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Protection Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {protectionStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">{stat.amount}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Alert Box */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-12">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-yellow-800 mb-2">Common Port Harcourt Rental Scams Prevented:</h3>
                <ul className="text-yellow-700 space-y-1 text-sm">
                  <li>• Fake agents collecting rent for properties they don't own</li>
                  <li>• Multiple people paying for the same property</li>
                  <li>• Advance fee fraud before property viewing</li>
                  <li>• Property photos that don't match reality</li>
                </ul>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How Our Escrow Service Protects You</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Backed by Nigerian banks and regulated financial institutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              );
            })}
          </div>

          {/* Banking Partners */}
          <div className="bg-gray-50 rounded-2xl p-8 mb-16">
            <h3 className="text-2xl font-bold text-center mb-6">Trusted by Major Nigerian Banks</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center justify-items-center">
              <div className="text-center">
                <div className="bg-red-600 text-white p-4 rounded-lg mb-2">
                  <span className="font-bold text-lg">GTB</span>
                </div>
                <span className="text-sm text-gray-600">Guaranty Trust Bank</span>
              </div>
              <div className="text-center">
                <div className="bg-blue-900 text-white p-4 rounded-lg mb-2">
                  <span className="font-bold text-lg">FBN</span>
                </div>
                <span className="text-sm text-gray-600">First Bank Nigeria</span>
              </div>
              <div className="text-center">
                <div className="bg-orange-600 text-white p-4 rounded-lg mb-2">
                  <span className="font-bold text-lg">ACC</span>
                </div>
                <span className="text-sm text-gray-600">Access Bank</span>
              </div>
              <div className="text-center">
                <div className="bg-purple-700 text-white p-4 rounded-lg mb-2">
                  <span className="font-bold text-lg">PST</span>
                </div>
                <span className="text-sm text-gray-600">Paystack</span>
              </div>
            </div>
          </div>

          {/* Transaction Form */}
          <div className="bg-white border-2 border-purple-200 rounded-2xl p-8 mb-16">
            <h3 className="text-2xl font-bold mb-6 text-center">Start Your Protected Transaction</h3>
            <div className="max-w-md mx-auto space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Property Address in Port Harcourt</label>
                <input 
                  type="text" 
                  placeholder="e.g., 123 Trans Amadi Industrial Layout" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Annual Rent Amount</label>
                <input 
                  type="text" 
                  placeholder="e.g., ₦800,000" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Verified Agent/Landlord Contact</label>
                <input 
                  type="text" 
                  placeholder="Agent's verified phone number" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-bold text-blue-800 mb-2">Transaction Fee: Only 2%</h4>
                <p className="text-sm text-blue-700">
                  Much cheaper than losing your entire rent to scammers. Fee only charged on successful transactions.
                </p>
              </div>

              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Start Protected Transaction
              </button>
            </div>
          </div>

          {/* Support */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 text-green-600 bg-green-50 px-6 py-3 rounded-full">
              <Phone className="w-5 h-5" />
              <span className="font-medium">24/7 WhatsApp Support: +234 801 ESCROW (372769)</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Speak to a real person in Port Harcourt, not a bot
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Escrow;
