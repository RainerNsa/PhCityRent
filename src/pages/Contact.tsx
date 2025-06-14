
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Send,
  Facebook,
  Twitter,
  Instagram,
  Linkedin
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    inquiryType: "general",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "We'll get back to you within 24 hours.",
    });
    setFormData({ name: "", email: "", inquiryType: "general", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: ["+234 803 RENTPH (736874)", "+234 806 123 4567"],
      description: "Call us for immediate assistance"
    },
    {
      icon: Mail,
      title: "Email",
      details: ["support@rentphsafe.com", "agents@rentphsafe.com"],
      description: "Send us an email anytime"
    },
    {
      icon: MapPin,
      title: "Office",
      details: ["123 Trans Amadi Industrial Layout", "Port Harcourt, Rivers State"],
      description: "Visit our headquarters"
    },
    {
      icon: Clock,
      title: "Hours",
      details: ["Monday - Friday: 8AM - 6PM", "Saturday: 9AM - 4PM"],
      description: "We're here when you need us"
    }
  ];

  const faqs = [
    {
      question: "How do I verify my property listing?",
      answer: "Submit your property documents through our verification form. Our team will review and approve within 48 hours."
    },
    {
      question: "Is the escrow service really secure?",
      answer: "Yes! Our escrow service is backed by licensed financial institutions and includes full insurance coverage."
    },
    {
      question: "How much does it cost to list properties?",
      answer: "Listing is completely free. We only charge a 5% commission on successful rentals."
    },
    {
      question: "Can I cancel an escrow transaction?",
      answer: "Yes, escrow transactions can be cancelled within the agreed terms. Conditions apply based on the rental agreement."
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl opacity-90">Get in touch with our support team</p>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Inquiry Type</label>
                  <select
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="property">Property Listing</option>
                    <option value="escrow">Escrow Service</option>
                    <option value="agent">Agent Verification</option>
                    <option value="technical">Technical Support</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Tell us how we can help you..."
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
              <div className="space-y-6">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <div key={index} className="flex items-start">
                      <div className="bg-orange-100 p-3 rounded-lg mr-4">
                        <Icon className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{info.title}</h3>
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="text-gray-600">{detail}</p>
                        ))}
                        <p className="text-sm text-gray-500 mt-1">{info.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Social Media */}
              <div className="mt-8">
                <h3 className="font-bold text-lg mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <a href="#" className="bg-blue-600 p-3 rounded-lg text-white hover:bg-blue-700 transition-colors">
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a href="#" className="bg-blue-400 p-3 rounded-lg text-white hover:bg-blue-500 transition-colors">
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a href="#" className="bg-pink-600 p-3 rounded-lg text-white hover:bg-pink-700 transition-colors">
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a href="#" className="bg-blue-800 p-3 rounded-lg text-white hover:bg-blue-900 transition-colors">
                    <Linkedin className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="font-bold text-lg mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Live Chat CTA */}
          <div className="mt-16 bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-8 text-center">
            <MessageCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Immediate Help?</h2>
            <p className="text-gray-600 mb-6">
              Chat with our support team for instant assistance with your rental needs
            </p>
            <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full font-medium transition-colors">
              Start Live Chat
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
