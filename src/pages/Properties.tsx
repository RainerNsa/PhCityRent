
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Home, MapPin, Bed, Bath, Square, Filter, Search, Star, Shield } from "lucide-react";

const Properties = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [bedrooms, setBedrooms] = useState("all");

  const properties = [
    {
      id: 1,
      title: "Modern 3BR Apartment in GRA",
      location: "Government Residential Area",
      price: "₦800,000/year",
      priceValue: 800000,
      bedrooms: 3,
      bathrooms: 2,
      area: "1,200 sq ft",
      image: "/lovable-uploads/22d31f51-c174-40a7-bd95-00e4ad00eaf3.png",
      verified: true,
      agent: "Emeka Okafor",
      rating: 4.8,
      features: ["Parking", "Generator", "Security", "Water"],
      description: "Spacious apartment with modern amenities in the prestigious GRA area."
    },
    {
      id: 2,
      title: "Luxury 2BR Flat in Trans Amadi",
      location: "Trans Amadi Industrial Layout",
      price: "₦600,000/year",
      priceValue: 600000,
      bedrooms: 2,
      bathrooms: 2,
      area: "900 sq ft",
      image: "/lovable-uploads/5663820f-6c97-4492-9210-9eaa1a8dc415.png",
      verified: true,
      agent: "Blessing Eze",
      rating: 4.9,
      features: ["Furnished", "AC", "Kitchen", "Balcony"],
      description: "Fully furnished luxury apartment perfect for young professionals."
    },
    {
      id: 3,
      title: "Spacious 4BR House in Eliozu",
      location: "Eliozu",
      price: "₦1,200,000/year",
      priceValue: 1200000,
      bedrooms: 4,
      bathrooms: 3,
      area: "1,800 sq ft",
      image: "/lovable-uploads/af412c03-21e4-4856-82ff-d1a975dc84a9.png",
      verified: true,
      agent: "Chinedu Okoro",
      rating: 4.7,
      features: ["Garden", "Garage", "Study Room", "CCTV"],
      description: "Perfect family home with large garden and modern security features."
    },
    {
      id: 4,
      title: "Executive 2BR in Old GRA",
      location: "Old Government Residential Area",
      price: "₦700,000/year",
      priceValue: 700000,
      bedrooms: 2,
      bathrooms: 2,
      area: "1,000 sq ft",
      image: "/lovable-uploads/22d31f51-c174-40a7-bd95-00e4ad00eaf3.png",
      verified: true,
      agent: "Emeka Okafor",
      rating: 4.6,
      features: ["Pool Access", "Gym", "24/7 Security", "Elevator"],
      description: "Executive apartment with access to premium facilities."
    },
    {
      id: 5,
      title: "Cozy 1BR Studio in Rumuola",
      location: "Rumuola",
      price: "₦400,000/year",
      priceValue: 400000,
      bedrooms: 1,
      bathrooms: 1,
      area: "500 sq ft",
      image: "/lovable-uploads/5663820f-6c97-4492-9210-9eaa1a8dc415.png",
      verified: true,
      agent: "Blessing Eze",
      rating: 4.4,
      features: ["WiFi", "Kitchenette", "Parking", "Laundry"],
      description: "Affordable studio apartment perfect for students and young professionals."
    },
    {
      id: 6,
      title: "Luxury 5BR Duplex in GRA Phase 2",
      location: "GRA Phase 2",
      price: "₦2,500,000/year",
      priceValue: 2500000,
      bedrooms: 5,
      bathrooms: 4,
      area: "2,500 sq ft",
      image: "/lovable-uploads/af412c03-21e4-4856-82ff-d1a975dc84a9.png",
      verified: true,
      agent: "Chinedu Okoro",
      rating: 5.0,
      features: ["Swimming Pool", "Gym", "Garden", "Staff Quarters"],
      description: "Ultra-luxury duplex with all premium amenities for executive living."
    }
  ];

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = selectedLocation === "all" || property.location.includes(selectedLocation);
    const matchesBedrooms = bedrooms === "all" || property.bedrooms.toString() === bedrooms;
    
    let matchesPrice = true;
    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map(p => parseInt(p));
      matchesPrice = property.priceValue >= min && (max ? property.priceValue <= max : true);
    }
    
    return matchesSearch && matchesLocation && matchesBedrooms && matchesPrice;
  });

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-4">Find Your Perfect Home</h1>
            <p className="text-xl opacity-90">Browse verified properties in Port Harcourt</p>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search properties or locations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">All Locations</option>
                <option value="GRA">GRA</option>
                <option value="Trans Amadi">Trans Amadi</option>
                <option value="Eliozu">Eliozu</option>
                <option value="Rumuola">Rumuola</option>
              </select>
              
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">Any Price</option>
                <option value="0-500000">Under ₦500k</option>
                <option value="500000-1000000">₦500k - ₦1M</option>
                <option value="1000000-2000000">₦1M - ₦2M</option>
                <option value="2000000">Above ₦2M</option>
              </select>
              
              <select
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">Any Bedrooms</option>
                <option value="1">1 Bedroom</option>
                <option value="2">2 Bedrooms</option>
                <option value="3">3 Bedrooms</option>
                <option value="4">4+ Bedrooms</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {filteredProperties.length} of {properties.length} properties
            </p>
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property) => (
              <div key={property.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <img 
                    src={property.image} 
                    alt={property.title}
                    className="w-full h-48 object-cover"
                  />
                  {property.verified && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                      <Shield className="w-3 h-3 mr-1" />
                      Verified
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
                    {property.bedrooms} BR
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{property.title}</h3>
                  
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{property.location}</span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">{property.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Bed className="w-4 h-4 mr-1" />
                        {property.bedrooms}
                      </div>
                      <div className="flex items-center">
                        <Bath className="w-4 h-4 mr-1" />
                        {property.bathrooms}
                      </div>
                      <div className="flex items-center">
                        <Square className="w-4 h-4 mr-1" />
                        {property.area}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {property.features.slice(0, 3).map((feature) => (
                      <span key={feature} className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
                        {feature}
                      </span>
                    ))}
                    {property.features.length > 3 && (
                      <span className="text-xs text-gray-500">+{property.features.length - 3} more</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-sm text-gray-600">Agent: {property.agent}</div>
                      <div className="flex items-center">
                        <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                        <span className="text-xs">{property.rating}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-orange-600">
                        {property.price}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                      View Details
                    </button>
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors">
                      Contact Agent
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProperties.length === 0 && (
            <div className="text-center py-12">
              <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-600 mb-2">No Properties Found</h3>
              <p className="text-gray-500">Try adjusting your search criteria to find more properties.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Properties;
