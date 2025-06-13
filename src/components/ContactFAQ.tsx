
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
      question: "How do I know if a listing is verified?",
      answer: "All verified listings display a green 'Verified' badge. Our team physically inspects each property and verifies the agent's credentials before approval."
    },
    {
      question: "How does the escrow service work?",
      answer: "You pay your rent into our secure escrow account. The funds are only released to the landlord after you've inspected the property and received the keys."
    },
    {
      question: "What happens if I encounter a scam?",
      answer: "Report it immediately through our platform. We investigate all reports and provide full refunds for verified scam cases through our protection guarantee."
    },
    {
      question: "How long does agent verification take?",
      answer: "Agent verification typically takes 3-5 business days. We verify identity, business registration, and past client references."
    },
    {
      question: "Are there any hidden fees?",
      answer: "No hidden fees. Our service fee is clearly stated upfront, and the escrow service has a small transaction fee that's disclosed before payment."
    },
    {
      question: "Can I cancel my rental agreement?",
      answer: "Cancellation terms depend on your specific rental agreement with the landlord. Our escrow service protects your deposit during the initial verification period."
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
              Get in Touch
            </h2>
            <p className="section-subtitle">
              Have questions? We're here to help you find your perfect home safely and securely.
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
                <p className="text-gray-600">support@rentphsafe.com</p>
                <p className="text-sm text-gray-500">We'll respond within 24 hours</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-orange-100 p-3 rounded-lg mr-4">
                <MapPin className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-gray-900 mb-1">Office</h3>
                <p className="text-gray-600">123 Aba Road, GRA Phase 2</p>
                <p className="text-gray-600">Port Harcourt, Rivers State</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 glass-card feature-card">
            <h3 className="font-display font-semibold text-gray-900 mb-2">Need Immediate Help?</h3>
            <p className="text-gray-600 mb-4">
              For urgent issues or suspected scams, contact our emergency hotline
            </p>
            <button className="bg-red-600 text-white px-6 py-2 rounded-full font-medium hover:bg-red-700 transition-colors">
              Emergency Hotline: +234 (0) 700 SCAM HELP
            </button>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div>
          <div className="mb-8">
            <h2 className="section-title text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="section-subtitle">
              Find answers to common questions about our platform and services.
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
            <p className="text-gray-600 mb-4">Still have questions?</p>
            <button className="button-primary">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactFAQ;
