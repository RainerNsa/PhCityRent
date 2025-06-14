
import React from "react";
import { AlertTriangle, Shield, CheckCircle, Phone, MessageCircle } from "lucide-react";

const ScamEducation = () => {
  const scamTypes = [
    {
      title: "Fake Agent Numbers",
      description: "Someone poses as an agent with stolen photos and fake contact details",
      prevention: "Always verify agent ID and visit their physical office"
    },
    {
      title: "Double Payment Scam",
      description: "Multiple people pay for the same property that doesn't exist or isn't available",
      prevention: "Use our escrow service - money only releases when you get keys"
    },
    {
      title: "Photo Fraud",
      description: "Beautiful photos of properties that don't match reality or location",
      prevention: "All our properties are physically verified by our team"
    },
    {
      title: "Advance Fee Fraud",
      description: "Asking for full rent payment before viewing or key collection",
      prevention: "Never pay until you've seen the property and signed documents"
    }
  ];

  const emergencyContacts = [
    { name: "Police Emergency", number: "199", type: "Emergency" },
    { name: "Economic Crime Unit", number: "08033129210", type: "Fraud Report" },
    { name: "PHCityRent Support", number: "08012345678", type: "Platform Help" }
  ];

  return (
    <section className="py-16 bg-red-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full mb-4">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-medium">Scam Prevention Education</span>
          </div>
          <h2 className="text-3xl font-bold mb-4">Don't Fall Victim to Port Harcourt Rental Scams</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn how to identify and avoid the most common rental scams in Port Harcourt
          </p>
        </div>

        {/* Common Scam Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {scamTypes.map((scam, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-start gap-4">
                <div className="bg-red-100 p-2 rounded-lg flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-2">{scam.title}</h3>
                  <p className="text-gray-600 mb-3">{scam.description}</p>
                  <div className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-green-700 font-medium">{scam.prevention}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* What to Do If Scammed */}
        <div className="bg-white rounded-2xl p-8 mb-12">
          <h3 className="text-2xl font-bold text-center mb-6">What to Do If You've Been Scammed</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h4 className="font-bold mb-2">Document Everything</h4>
              <p className="text-sm text-gray-600">Save all messages, receipts, and contact details</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <h4 className="font-bold mb-2">Report Immediately</h4>
              <p className="text-sm text-gray-600">Contact police and our support team</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">3</span>
              </div>
              <h4 className="font-bold mb-2">Warn Others</h4>
              <p className="text-sm text-gray-600">Share scammer details to protect community</p>
            </div>
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="bg-gray-900 text-white rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-center mb-6">Emergency & Support Contacts</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {emergencyContacts.map((contact, index) => (
              <div key={index} className="text-center">
                <div className="bg-white/10 p-4 rounded-lg">
                  <Phone className="w-6 h-6 mx-auto mb-2" />
                  <h4 className="font-bold mb-1">{contact.name}</h4>
                  <p className="text-2xl font-bold text-orange-400 mb-1">{contact.number}</p>
                  <span className="text-sm text-gray-300">{contact.type}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-6 pt-6 border-t border-gray-700">
            <p className="text-sm text-gray-300">
              Available 24/7 via WhatsApp for immediate assistance
            </p>
            <div className="flex justify-center gap-4 mt-3">
              <a href="https://wa.me/2348012345678" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center">
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScamEducation;
