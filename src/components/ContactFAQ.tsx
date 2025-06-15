
import React, { useState } from "react";
import { Phone, Mail, MapPin, MessageCircle, Plus, Minus } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const ContactFAQ = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: "How do I know if a Port Harcourt listing is verified?",
      answer: "All verified listings display a green 'PH Verified' badge. Our local team physically inspects each property in areas like GRA, Trans Amadi, and Eliozu, and verifies the agent's credentials with Rivers State authorities."
    },
    {
      question: "How does the naira escrow service work?",
      answer: "You pay your rent in naira into our secure escrow account through your Nigerian bank. Funds are only released to the landlord after you've inspected the property in Port Harcourt and received the keys."
    },
    {
      question: "What happens if I encounter a rental scam in Port Harcourt?",
      answer: "Report it immediately to EFCC (0809 325 3322) and through our platform. We investigate all reports and provide full naira refunds for verified scam cases through our protection guarantee."
    },
    {
      question: "How long does Rivers State agent verification take?",
      answer: "Agent verification typically takes 3-5 business days. We verify identity with valid Nigerian ID, Rivers State business registration, and references from past Port Harcourt clients."
    },
    {
      question: "Are there any hidden fees in naira?",
      answer: "No hidden fees. Our service fee is clearly stated in naira upfront, and the escrow service has a small transaction fee disclosed before payment - all in Nigerian naira."
    },
    {
      question: "Can I cancel my Port Harcourt rental agreement?",
      answer: "Cancellation terms depend on your specific rental agreement with the Rivers State landlord. Our escrow service protects your naira deposit during the initial verification period."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <section className="section-container bg-white animate-on-scroll" id="contact">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Section */}
        <div>
          <div className="mb-8">
            <h2 className="section-title text-gray-900 mb-4">
              Get in Touch - Port Harcourt Office
            </h2>
            <p className="section-subtitle">
              Have questions? We're here to help you find your perfect home safely in Port Harcourt, Rivers State.
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="bg-pulse-100 p-3 rounded-lg mr-4">
                <Phone className="w-6 h-6 text-pulse-600" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-gray-900 mb-1">Call Us</h3>
                <p className="text-gray-600">+234 (0) 803 123 4567</p>
                <p className="text-sm text-gray-500">Mon-Fri 8AM-6PM WAT</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-green-100 p-3 rounded-lg mr-4">
                <MessageCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-gray-900 mb-1">WhatsApp</h3>
                <p className="text-gray-600">+234 (0) 803 123 4567</p>
                <p className="text-sm text-gray-500">Quick responses 24/7</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-purple-100 p-3 rounded-lg mr-4">
                <Mail className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-gray-900 mb-1">Email</h3>
                <p className="text-gray-600">support@phcityrent.com</p>
                <p className="text-sm text-gray-500">We'll respond within 24 hours</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-orange-100 p-3 rounded-lg mr-4">
                <MapPin className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-gray-900 mb-1">Port Harcourt Office</h3>
                <p className="text-gray-600">Plot 15, Aba Road, GRA Phase 2</p>
                <p className="text-gray-600">Port Harcourt, Rivers State, Nigeria</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 glass-card feature-card">
            <h3 className="font-display font-semibold text-gray-900 mb-2">Need Immediate Help with Scams?</h3>
            <p className="text-gray-600 mb-4">
              For urgent rental scam issues in Port Harcourt, contact Nigerian authorities immediately
            </p>
            <div className="space-y-2">
              <button className="w-full bg-red-600 text-white px-6 py-2 rounded-full font-medium hover:bg-red-700 transition-colors">
                EFCC Hotline: 0809 325 3322
              </button>
              <button className="w-full bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition-colors">
                Rivers Police: 08037723634
              </button>
            </div>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div>
          <div className="mb-8">
            <h2 className="section-title text-gray-900 mb-4">
              Port Harcourt Rental FAQ
            </h2>
            <p className="section-subtitle">
              Find answers to common questions about renting safely in Port Harcourt, Rivers State.
            </p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="glass-card overflow-hidden">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50/50 transition-colors"
                >
                  <span className="font-display font-medium text-gray-900">{faq.question}</span>
                  {openFAQ === index ? (
                    <Minus className="w-5 h-5 text-gray-500" />
                  ) : (
                    <Plus className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {openFAQ === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">Still have questions about Port Harcourt rentals?</p>
            <button className="button-primary">
              Contact PH Support
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactFAQ;
