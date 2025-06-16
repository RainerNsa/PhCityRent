
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Users, Shield, ArrowRight, Star } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  const stats = [
    { icon: Building2, value: "500+", label: "Premium Properties" },
    { icon: Users, value: "2000+", label: "Happy Tenants" },
    { icon: Shield, value: "100%", label: "Verified Listings" },
    { icon: Star, value: "4.9", label: "Average Rating" },
  ];

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-orange-100/20 to-red-100/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative container mx-auto px-4 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-2">
              <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 px-4 py-2 text-sm font-medium">
                🏆 #1 Rental Platform in Port Harcourt
              </Badge>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Find Your
                <span className="block bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Perfect Home
                </span>
                in Port Harcourt
              </h1>
            </div>

            <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
              Discover premium rental properties with verified listings, transparent pricing, 
              and secure transactions. Your dream home is just a click away.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/properties">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 group"
                >
                  Explore Properties
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
              </Link>
              <Link to="/agents">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-orange-300 text-orange-600 hover:bg-orange-50 px-8 py-4 text-lg font-semibold"
                >
                  Find an Agent
                </Button>
              </Link>
            </div>

            {/* Quick Search */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Quick Property Search</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Location</label>
                  <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="h-4 w-4 text-orange-500" />
                    <span className="text-sm text-gray-700">Port Harcourt, Rivers</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Property Type</label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">Apartment</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Budget</label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">₦200k - ₦500k</span>
                  </div>
                </div>
              </div>
              <Link to="/properties">
                <Button className="w-full mt-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                  Search Properties
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Content - Image */}
          <div className="relative">
            <div className="relative z-10">
              <img 
                src="https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&w=800&q=80" 
                alt="Modern apartment interior"
                className="rounded-3xl shadow-2xl w-full h-[600px] object-cover"
              />
              
              {/* Floating Stats Card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-2 mx-auto">
                        <stat.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="text-lg font-bold text-gray-900">{stat.value}</div>
                      <div className="text-xs text-gray-600">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-200/20 to-red-200/20 rounded-3xl transform rotate-3 scale-105 -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
