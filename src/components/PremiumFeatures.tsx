
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Smartphone, Shield, MapPin, Bell, CreditCard, Users, Zap, Eye } from 'lucide-react';

const PremiumFeatures = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: Smartphone,
      title: "AI-Powered Property Matching",
      description: "Our advanced AI learns your preferences and automatically suggests perfect rental matches based on your lifestyle, budget, and location preferences.",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80",
      benefits: ["Smart recommendations", "Preference learning", "Time-saving automation"]
    },
    {
      icon: Shield,
      title: "Blockchain-Secured Transactions",
      description: "Revolutionary escrow system using blockchain technology ensures your payments are completely secure and transparent throughout the rental process.",
      image: "https://images.unsplash.com/photo-1559526324-593bc073d938?auto=format&fit=crop&w=800&q=80",
      benefits: ["100% secure payments", "Transparent transactions", "Smart contract protection"]
    },
    {
      icon: MapPin,
      title: "Hyper-Local Market Intelligence",
      description: "Get real-time insights on neighborhood trends, price analytics, and community data to make informed rental decisions with confidence.",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
      benefits: ["Market trend analysis", "Neighborhood insights", "Price optimization"]
    },
    {
      icon: Eye,
      title: "Virtual Reality Property Tours",
      description: "Experience properties like never before with immersive VR tours that let you explore every corner from the comfort of your current home.",
      image: "https://images.unsplash.com/photo-1592928302636-c83cf1e1c887?auto=format&fit=crop&w=800&q=80",
      benefits: ["Immersive VR experience", "Remote property viewing", "360° property exploration"]
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-20 left-20 w-96 h-96 bg-orange-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 text-orange-400 rounded-full text-sm font-semibold mb-6">
            <Zap className="w-4 h-4 mr-2" />
            Next-Generation Technology
          </div>
          <h2 className="text-5xl lg:text-6xl font-bold text-white mb-6">
            The Future of
            <br />
            <span className="bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
              Property Rental
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience cutting-edge technology that transforms how you discover, evaluate, and secure your perfect rental property in Nigeria.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Feature Navigation */}
          <div className="space-y-6">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className={`cursor-pointer transition-all duration-300 border-2 ${
                  activeFeature === index 
                    ? 'border-orange-500 bg-gradient-to-r from-orange-500/10 to-red-500/10 shadow-2xl' 
                    : 'border-gray-800 bg-gray-900/50 hover:border-gray-700'
                }`}
                onClick={() => setActiveFeature(index)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      activeFeature === index 
                        ? 'bg-gradient-to-r from-orange-500 to-red-500' 
                        : 'bg-gray-800'
                    }`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                      <p className="text-gray-400 mb-4">{feature.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {feature.benefits.map((benefit, i) => (
                          <span 
                            key={i}
                            className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-full"
                          >
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Feature Showcase */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src={features[activeFeature].image}
                alt={features[activeFeature].title}
                className="w-full h-[600px] object-cover transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent">
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-full text-sm font-semibold mb-4">
                    {React.createElement(features[activeFeature].icon, { className: "w-4 h-4 mr-2" })}
                    Featured Technology
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-2">
                    {features[activeFeature].title}
                  </h3>
                  <p className="text-white/80 text-lg">
                    {features[activeFeature].description}
                  </p>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
              <Shield className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Button 
            size="lg"
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-12 py-6 text-xl font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
          >
            Experience the Future
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PremiumFeatures;
