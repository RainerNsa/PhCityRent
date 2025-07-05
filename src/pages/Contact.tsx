
import React, { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send, MessageSquare, Shield, AlertTriangle } from "lucide-react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/Footer";
import EnhancedBreadcrumb from "@/components/ui/enhanced-breadcrumb";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: "Message Sent Successfully!",
      description: "We'll get back to you within 24 hours.",
    });

    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <EnhancedBreadcrumb 
            items={[{ label: 'Contact Us' }]} 
          />

          {/* Enhanced Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-8 lg:p-12 mb-12 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10 rounded-3xl"></div>
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                      <MessageSquare className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl lg:text-5xl font-bold">Contact Our Port Harcourt Team</h1>
                  </div>
                  <p className="text-orange-100 text-lg lg:text-xl max-w-4xl leading-relaxed">
                    Get in touch with our Rivers State team for safe rental solutions. We're here to help you find 
                    your perfect home safely in Port Harcourt.
                  </p>
                </div>
                <div className="hidden lg:flex items-center justify-center w-24 h-24 bg-white/10 rounded-full backdrop-blur-sm">
                  <Phone className="w-12 h-12" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Our verified agents cover GRA, Trans Amadi, D-Line, Eliozu and all major areas in Port Harcourt.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Phone Numbers</h3>
                      <div className="space-y-1">
                        <p className="text-gray-600">
                          <a href="tel:+2348031234567" className="hover:text-orange-600 transition-colors">
                            +234 803 123 4567
                          </a> (Primary)
                        </p>
                        <p className="text-gray-600">
                          <a href="tel:+2348069876543" className="hover:text-orange-600 transition-colors">
                            +234 806 987 6543
                          </a> (Alternative)
                        </p>
                        <p className="text-sm text-gray-500">WhatsApp available on both numbers</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                      <div className="space-y-1">
                        <p className="text-gray-600">
                          <a href="mailto:info@phcityrent.com" className="hover:text-orange-600 transition-colors">
                            info@phcityrent.com
                          </a>
                        </p>
                        <p className="text-gray-600">
                          <a href="mailto:support@phcityrent.com" className="hover:text-orange-600 transition-colors">
                            support@phcityrent.com
                          </a>
                        </p>
                        <p className="text-gray-600">
                          <a href="mailto:scam.report@phcityrent.com" className="hover:text-orange-600 transition-colors">
                            scam.report@phcityrent.com
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Port Harcourt Office</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Plot 15, Aba Road, GRA Phase 2<br />
                        Port Harcourt, Rivers State, Nigeria
                      </p>
                      <p className="text-sm text-gray-500 mt-1">Near First Bank, GRA Junction</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Business Hours (WAT)</h3>
                      <div className="space-y-1 text-gray-600">
                        <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                        <p>Saturday: 9:00 AM - 4:00 PM</p>
                        <p>Sunday: Emergency calls only</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Emergency Contacts */}
              <div className="bg-red-50 rounded-2xl p-6 border border-red-200">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                  <h3 className="font-semibold text-red-800">Emergency Scam Reporting</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="font-medium text-red-700">EFCC (Economic Crimes)</span>
                    <a href="tel:08093253322" className="text-red-600 hover:text-red-700 font-medium">
                      0809 325 3322
                    </a>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="font-medium text-red-700">Rivers State Police</span>
                    <a href="tel:08037723634" className="text-red-600 hover:text-red-700 font-medium">
                      0803 772 3634
                    </a>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="font-medium text-red-700">Nigeria Police Force</span>
                    <a href="tel:199" className="text-red-600 hover:text-red-700 font-medium">
                      199
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-10">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Send us a Message</h2>
                  <p className="text-gray-600">We typically respond within 2-4 hours during business hours</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter your full name"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                        placeholder="+234 803 123 4567"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                        Subject *
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="">Select a subject</option>
                        <option value="property-inquiry">Property Inquiry (GRA/Trans Amadi)</option>
                        <option value="agent-verification">Agent Verification</option>
                        <option value="scam-report">Report Rental Scam</option>
                        <option value="technical-support">Technical Support</option>
                        <option value="partnership">Business Partnership</option>
                        <option value="landlord-services">Landlord Services</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none transition-all duration-200"
                      placeholder="Tell us how we can help you with your Port Harcourt rental needs..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-4 font-semibold text-lg rounded-xl flex items-center justify-center gap-3 transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-8 p-6 bg-orange-50 rounded-xl border border-orange-200">
                  <div className="flex items-center gap-3 mb-3">
                    <Shield className="w-6 h-6 text-orange-600" />
                    <h4 className="font-semibold text-orange-800">Privacy & Security</h4>
                  </div>
                  <p className="text-orange-700 text-sm">
                    Your information is secure and will only be used to respond to your inquiry. 
                    We never share your details with third parties.
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

export default Contact;
