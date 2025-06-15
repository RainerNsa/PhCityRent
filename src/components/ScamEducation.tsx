
import React from "react";
import { AlertTriangle, Shield, CheckCircle, Phone, MessageCircle } from "lucide-react";

const ScamEducation = () => {
  const scamTypes = [
    {
      title: "Fake Agent Numbers",
      description: "Someone poses as an agent with stolen photos and fake contact details from GRA or Trans Amadi areas",
      prevention: "Always verify agent ID at their physical office in Port Harcourt"
    },
    {
      title: "Double Payment Scam",
      description: "Multiple people pay for the same property in popular areas like D-Line or Old GRA",
      prevention: "Use our escrow service - money only releases when you get keys"
    },
    {
      title: "Photo Fraud",
      description: "Beautiful photos of properties that don't match reality or aren't in the claimed Port Harcourt location",
      prevention: "All our properties are physically verified by our local team"
    },
    {
      title: "Advance Fee Fraud",
      description: "Asking for full rent payment before viewing properties in areas like Eliozu or Rumuokwurushi",
      prevention: "Never pay until you've seen the property and signed documents"
    }
  ];

  const emergencyContacts = [
    { name: "EFCC (Economic Crimes)", number: "0809 325 3322", type: "Fraud Report" },
    { name: "Nigeria Police Force", number: "199", type: "Emergency" },
    { name: "Rivers State Police", number: "08037723634", type: "Local Police" },
    { name: "PHCityRent Support", number: "08012345678", type: "Platform Help" }
  ];

  return (
    <section className="py-16 bg-red-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Scam Alert Banner */}
        <div className="mb-8 p-4 bg-red-100 border border-red-300 rounded-lg flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-700">
            <strong>Scam Alert:</strong> Over 200 rental scams reported in Port Harcourt last month. Report to EFCC: 0809 325 3322
          </p>
        </div>

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full mb-4">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-medium">Scam Prevention Education</span>
          </div>
          <h2 className="text-3xl font-bold mb-4">Don't Fall Victim to Port Harcourt Rental Scams</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn how to identify and avoid the most common rental scams in Port Harcourt, Rivers State
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
          <h3 className="text-2xl font-bold text-center mb-6">What to Do If You've Been Scammed in Port Harcourt</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h4 className="font-bold mb-2">Document Everything</h4>
              <p className="text-sm text-gray-600">Save all WhatsApp messages, bank receipts, and contact details</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <h4 className="font-bold mb-2">Report to Authorities</h4>
              <p className="text-sm text-gray-600">Contact EFCC and Rivers State Police immediately</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">3</span>
              </div>
              <h4 className="font-bold mb-2">Warn the Community</h4>
              <p className="text-sm text-gray-600">Share scammer details to protect other Port Harcourt residents</p>
            </div>
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="bg-gray-900 text-white rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-center mb-6">Emergency & Support Contacts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            <p className="text-sm text-gray-300 mb-4">
              Report rental scams via WhatsApp 24/7 or visit our office in GRA Phase 2
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
