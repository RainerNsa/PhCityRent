import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VerificationForm from "@/components/VerificationForm";
import { Star, Phone, Mail, MapPin, Home, Calendar, Shield, CheckCircle, Filter, UserPlus } from "lucide-react";

const Agents = () => {
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

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20">
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-4">Verified Real Estate Agents</h1>
            <p className="text-xl opacity-90">Connect with trusted, verified agents in Port Harcourt</p>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filter Agents
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <select 
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">All Locations</option>
                  <option value="GRA">GRA</option>
                  <option value="Trans Amadi">Trans Amadi</option>
                  <option value="Eliozu">Eliozu</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
                <select 
                  value={selectedRating}
                  onChange={(e) => setSelectedRating(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">Any Rating</option>
                  <option value="4.5">4.5+ Stars</option>
                  <option value="4.0">4.0+ Stars</option>
                </select>
              </div>
            </div>
          </div>

          {/* Agents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAgents.map((agent) => (
              <div key={agent.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <img 
                    src={agent.image} 
                    alt={agent.name}
                    className="w-full h-48 object-cover"
                  />
                  {agent.verified && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                      <Shield className="w-3 h-3 mr-1" />
                      Verified
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{agent.name}</h3>
                  
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < Math.floor(agent.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      {agent.rating} ({agent.reviews} reviews)
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      {agent.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Home className="w-4 h-4 mr-2" />
                      {agent.properties} Properties Listed
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      Agent since {agent.joinedDate}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">{agent.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {agent.specialties.map((specialty) => (
                      <span key={specialty} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                        {specialty}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center">
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </button>
                    <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center">
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Become an Agent CTA */}
          <div className="mt-16 bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Want to Become a Verified Agent?</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join our network of trusted real estate professionals and get access to exclusive tools, 
              verified listings, and direct client connections in Port Harcourt.
            </p>
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => setShowVerificationForm(true)}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full font-medium transition-colors flex items-center gap-2"
              >
                <UserPlus className="w-5 h-5" />
                Apply for Verification
              </button>
              <button className="bg-white hover:bg-gray-50 text-green-600 border border-green-200 px-8 py-3 rounded-full font-medium transition-colors">
                Learn More
              </button>
            </div>
          </div>
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

export default Agents;
