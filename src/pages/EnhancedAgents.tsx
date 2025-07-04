import React, { useState } from "react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/Footer";
import VerificationForm from "@/components/VerificationForm";
import { Card } from "@/components/ui/card";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { Badge } from "@/components/ui/badge";
import { 
  Star, Phone, Mail, MapPin, Home, Calendar, Shield, 
  CheckCircle, Filter, UserPlus, Users, Award, TrendingUp 
} from "lucide-react";
import { designTokens } from "@/lib/design-tokens";

const EnhancedAgents = () => {
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const [showVerificationForm, setShowVerificationForm] = useState(false);

  const agents = [
    {
      id: 1,
      name: "Emeka Okafor",
      rating: 4.8,
      reviews: 127,
      location: "GRA",
      phone: "+234 803 123 4567",
      email: "emeka.okafor@rentph.com",
      specialties: ["Luxury Apartments", "Commercial Properties"],
      properties: 23,
      verified: true,
      joinedDate: "2022",
      image: "/lovable-uploads/22d31f51-c174-40a7-bd95-00e4ad00eaf3.png",
      description: "Experienced real estate agent specializing in luxury properties in GRA and Trans Amadi areas."
    },
    {
      id: 2,
      name: "Blessing Eze",
      rating: 4.9,
      reviews: 89,
      location: "Trans Amadi",
      phone: "+234 806 987 6543",
      email: "blessing.eze@rentph.com",
      specialties: ["Family Homes", "Budget-Friendly"],
      properties: 31,
      verified: true,
      joinedDate: "2021",
      image: "/lovable-uploads/5663820f-6c97-4492-9210-9eaa1a8dc415.png",
      description: "Dedicated to helping families find affordable and comfortable homes in Port Harcourt."
    },
    {
      id: 3,
      name: "Chinedu Okoro",
      rating: 4.7,
      reviews: 156,
      location: "Eliozu",
      phone: "+234 815 456 7890",
      email: "chinedu.okoro@rentph.com",
      specialties: ["New Developments", "Student Housing"],
      properties: 18,
      verified: true,
      joinedDate: "2023",
      image: "/lovable-uploads/af412c03-21e4-4856-82ff-d1a975dc84a9.png",
      description: "Expert in new property developments and student accommodations around universities."
    },
  ];

  const filteredAgents = agents.filter(agent => {
    const locationMatch = selectedLocation === "all" || agent.location === selectedLocation;
    const ratingMatch = selectedRating === "all" || agent.rating >= parseFloat(selectedRating);
    return locationMatch && ratingMatch;
  });

  const stats = [
    { icon: Users, number: "50+", label: "Verified Agents", color: "text-green-600" },
    { icon: Award, number: "4.8", label: "Average Rating", color: "text-yellow-600" },
    { icon: TrendingUp, number: "95%", label: "Success Rate", color: "text-blue-600" },
    { icon: Shield, number: "100%", label: "Verified", color: "text-orange-600" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-20">
        {/* Enhanced Header */}
        <section className="relative bg-gradient-to-br from-green-50 via-white to-green-50 py-16 md:py-20">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 left-10 w-32 h-32 bg-green-500 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-500 rounded-full blur-3xl" />
          </div>

          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto mb-12">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Trusted Real Estate
                <span className="block bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Agents in Port Harcourt
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Connect with verified, professional agents who know Port Harcourt inside out. 
                Find the perfect agent for your property needs.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 mb-4">
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Enhanced Filters */}
          <Card className="p-6 mb-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <h2 className="text-xl font-bold mb-6 flex items-center text-gray-900">
              <Filter className="w-5 h-5 mr-3 text-green-600" />
              Find Your Perfect Agent
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Location</label>
                <select 
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white shadow-sm transition-all duration-200"
                >
                  <option value="all">All Locations</option>
                  <option value="GRA">GRA</option>
                  <option value="Trans Amadi">Trans Amadi</option>
                  <option value="Eliozu">Eliozu</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Minimum Rating</label>
                <select 
                  value={selectedRating}
                  onChange={(e) => setSelectedRating(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white shadow-sm transition-all duration-200"
                >
                  <option value="all">Any Rating</option>
                  <option value="4.5">4.5+ Stars</option>
                  <option value="4.0">4.0+ Stars</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Enhanced Agents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filteredAgents.map((agent) => (
              <Card key={agent.id} className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white">
                <div className="relative">
                  <img 
                    src={agent.image} 
                    alt={agent.name}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {agent.verified && (
                    <Badge className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-md">
                      <Shield className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{agent.name}</h3>
                    
                    <div className="flex items-center mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < Math.floor(agent.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600 font-medium">
                        {agent.rating} ({agent.reviews} reviews)
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-3 text-green-600" />
                      <span className="font-medium">{agent.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Home className="w-4 h-4 mr-3 text-blue-600" />
                      <span className="font-medium">{agent.properties} Properties Listed</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-3 text-purple-600" />
                      <span className="font-medium">Agent since {agent.joinedDate}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed">{agent.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {agent.specialties.map((specialty) => (
                      <Badge key={specialty} variant="outline" className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 transition-colors">
                        {specialty}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <EnhancedButton 
                      variant="primary" 
                      size="sm" 
                      className="flex-1"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </EnhancedButton>
                    <EnhancedButton 
                      variant="secondary" 
                      size="sm" 
                      className="flex-1"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </EnhancedButton>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Enhanced CTA Section */}
          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-green-50 to-blue-50">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-green-500 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500 rounded-full blur-3xl" />
            </div>
            
            <div className="relative p-8 md:p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mb-6">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Ready to Join Our Agent Network?
              </h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
                Become a verified agent and get access to exclusive tools, verified listings, 
                and direct client connections in Port Harcourt's growing real estate market.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <EnhancedButton 
                  variant="primary"
                  size="lg"
                  onClick={() => setShowVerificationForm(true)}
                >
                  <UserPlus className="w-5 h-5 mr-2" />
                  Apply for Verification
                </EnhancedButton>
                <EnhancedButton 
                  variant="outline"
                  size="lg"
                >
                  Learn More About Benefits
                </EnhancedButton>
              </div>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
      
      <VerificationForm 
        isOpen={showVerificationForm}
        onClose={() => setShowVerificationForm(false)}
        type="agent"
      />
    </div>
  );
};

export default EnhancedAgents;
