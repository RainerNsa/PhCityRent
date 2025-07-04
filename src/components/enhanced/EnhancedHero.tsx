
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Home, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { designTokens } from "@/lib/design-tokens";

const EnhancedHero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedLocation) params.set('location', selectedLocation);
    if (propertyType) params.set('type', propertyType);
    
    navigate(`/properties?${params.toString()}`);
  };

  const locations = [
    "Mile 1", "Mile 2", "Mile 3", "Old GRA", "New GRA", 
    "Trans Amadi", "D-Line", "Rumuola", "Eliozu", "Ada George"
  ];

  const propertyTypes = [
    "Apartment", "House", "Duplex", "Bungalow", "Office Space", "Shop"
  ];

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background with improved gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-red-50">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5" />
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-orange-200/30 to-red-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-red-200/20 to-orange-200/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main heading */}
        <div className="max-w-4xl mx-auto mb-12">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Find Your Perfect
            <span className="block bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Home in Port Harcourt
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover verified properties, connect with trusted agents, and secure your dream home with confidence.
          </p>
        </div>

        {/* Enhanced search form */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-2">
              {/* Search input */}
              <div className="md:col-span-2 relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Search className="w-5 h-5" />
                </div>
                <Input
                  type="text"
                  placeholder="Search properties, areas, or features..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 border-gray-200 focus:border-orange-500 focus:ring-orange-500 text-base rounded-xl"
                />
              </div>

              {/* Location select */}
              <div className="relative">
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="h-14 border-gray-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <SelectValue placeholder="Location" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Property type select */}
              <div className="relative">
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger className="h-14 border-gray-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Home className="w-4 h-4 text-gray-400" />
                      <SelectValue placeholder="Type" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {propertyTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Search button */}
            <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleSearch}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-xl text-base font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
                size="lg"
              >
                <Search className="w-5 h-5 mr-2" />
                Search Properties
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/properties')}
                className="border-2 border-gray-200 hover:border-orange-500 text-gray-700 hover:text-orange-600 px-6 py-4 rounded-xl text-base font-semibold hover:bg-orange-50 transition-all duration-200"
                size="lg"
              >
                <Filter className="w-5 h-5 mr-2" />
                Advanced Search
              </Button>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {[
            { number: "500+", label: "Verified Properties" },
            { number: "50+", label: "Trusted Agents" },
            { number: "1000+", label: "Happy Tenants" },
            { number: "15+", label: "Areas Covered" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                {stat.number}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating elements for visual interest */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-orange-400 rounded-full opacity-60 animate-ping" />
      <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-red-400 rounded-full opacity-40 animate-pulse" />
      <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-orange-500 rounded-full opacity-80 animate-bounce" />
    </section>
  );
};

export default EnhancedHero;
