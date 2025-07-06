
import React from 'react';
import { Shield, Users, Award, Clock, CheckCircle, Star } from 'lucide-react';

const TrustIndicators = () => {
  const stats = [
    {
      icon: Users,
      number: "10,000+",
      label: "Happy Tenants",
      description: "Families finding homes monthly",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Shield,
      number: "100%",
      label: "Verified Properties",
      description: "Every listing thoroughly checked",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Award,
      number: "500+",
      label: "Trusted Agents",
      description: "Licensed professionals nationwide",
      color: "from-purple-500 to-indigo-500"
    },
    {
      icon: Clock,
      number: "24/7",
      label: "Support Available",
      description: "Always here when you need us",
      color: "from-orange-500 to-red-500"
    }
  ];

  const certifications = [
    { name: "ISO 27001", desc: "Security Management" },
    { name: "SSL Encrypted", desc: "Data Protection" },
    { name: "PCI Compliant", desc: "Payment Security" },
    { name: "GDPR Ready", desc: "Privacy Standard" }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute top-10 left-10 w-96 h-96 bg-orange-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative">
        {/* Trust Stats */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-6 py-3 bg-orange-100 text-orange-600 rounded-full text-sm font-semibold mb-6">
            <CheckCircle className="w-4 h-4 mr-2" />
            Trusted by Thousands
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Nigeria's Most Trusted
            <br />
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Rental Platform
            </span>
          </h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-300`}></div>
              
              <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
              <div className="text-lg font-semibold text-gray-800 mb-2">{stat.label}</div>
              <div className="text-sm text-gray-600">{stat.description}</div>
            </div>
          ))}
        </div>

        {/* Certifications */}
        <div className="bg-white rounded-3xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Security & Compliance</h3>
            <p className="text-gray-600">Your data and transactions are protected by industry-leading security standards</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:from-orange-100 group-hover:to-orange-200 transition-all duration-300">
                  <Shield className="w-8 h-8 text-gray-600 group-hover:text-orange-600 transition-colors duration-300" />
                </div>
                <div className="font-semibold text-gray-900 text-sm mb-1">{cert.name}</div>
                <div className="text-xs text-gray-600">{cert.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Rating Banner */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-4 rounded-full shadow-lg">
            <div className="flex items-center mr-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-white fill-current" />
              ))}
            </div>
            <div className="text-lg font-semibold">4.9/5 Rating</div>
            <div className="mx-3 w-px h-6 bg-white opacity-30"></div>
            <div className="text-sm">Based on 2,500+ reviews</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustIndicators;
