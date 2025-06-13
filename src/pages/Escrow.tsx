
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, Lock, CheckCircle, Clock } from "lucide-react";

const Escrow = () => {
  const steps = [
    {
      icon: Lock,
      title: "Secure Payment",
      description: "Your rent payment is held securely until move-in conditions are met"
    },
    {
      icon: CheckCircle,
      title: "Property Verification",
      description: "We verify the property exists and landlord is legitimate"
    },
    {
      icon: Shield,
      title: "Protected Release",
      description: "Funds are only released when you confirm everything is as promised"
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-4">Secure Rent Escrow Service</h1>
            <p className="text-xl opacity-90">Protect your rent payments with our trusted escrow service</p>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How Our Escrow Service Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Never worry about rental scams again. Our escrow service ensures your money is safe until you move in.
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

          <div className="bg-gray-50 rounded-2xl p-8 mb-16">
            <h3 className="text-2xl font-bold mb-6 text-center">Start Your Secure Transaction</h3>
            <div className="max-w-md mx-auto space-y-4">
              <input 
                type="text" 
                placeholder="Property Address" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <input 
                type="text" 
                placeholder="Rent Amount (₦)" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <input 
                type="text" 
                placeholder="Landlord Contact" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-medium transition-colors">
                Start Escrow Transaction
              </button>
            </div>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-full">
              <Shield className="w-5 h-5" />
              <span className="font-medium">Your money is 100% protected</span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Escrow;
