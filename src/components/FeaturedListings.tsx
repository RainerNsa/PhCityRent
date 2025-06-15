
import React from "react";
import { MapPin, Bed, Bath, DollarSign, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProperties } from "@/hooks/useProperties";
import { Link } from "react-router-dom";

const FeaturedListings = () => {
  const { data: properties = [], isLoading } = useProperties();
  
  // Get featured properties or first 3 if none are marked as featured
  const featuredProperties = properties.filter(p => p.featured).slice(0, 3);
  const displayProperties = featuredProperties.length > 0 
    ? featuredProperties 
    : properties.slice(0, 3);

  return (
    <section className="section-container bg-white animate-on-scroll" id="listings">
      <div className="text-center mb-12">
        <div className="pulse-chip mb-4">
          <Shield className="w-4 h-4 mr-2" />
          <span>Verified Listings</span>
        </div>
        <h2 className="section-title text-gray-900 mb-4">
          Featured Properties
        </h2>
        <p className="section-subtitle">
          Discover verified rental properties from trusted agents across Port Harcourt
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card animate-pulse h-80"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProperties.map((property, index) => (
            <div key={property.id} className={`glass-card feature-card hover-lift fadeIn stagger-${(index % 3) + 1}`}>
              <div className="relative">
                <img 
                  src={property.images?.[0] || '/placeholder.svg'} 
                  alt={property.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
                {property.is_verified && (
                  <div className="absolute top-4 right-4 bg-pulse-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                    <Shield className="w-3 h-3 mr-1" />
                    Verified
                  </div>
                )}
              </div>
              
              <div className="pt-4">
                <h3 className="text-xl font-display font-semibold text-gray-900 mb-2">{property.title}</h3>
                
                <div className="flex items-center text-gray-600 mb-3">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{property.location}</span>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Bed className="w-4 h-4 mr-1" />
                      <span>{property.bedrooms} beds</span>
                    </div>
                    <div className="flex items-center">
                      <Bath className="w-4 h-4 mr-1" />
                      <span>{property.bathrooms} baths</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-pulse-500 font-semibold">
                    <DollarSign className="w-4 h-4 mr-1" />
                    <span>₦{property.price_per_year.toLocaleString()}/year</span>
                  </div>
                  <Link to="/properties">
                    <button className="button-primary text-sm py-2 px-4">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="text-center mt-12">
        <Link to="/properties">
          <button className="button-primary">
            View All Properties
          </button>
        </Link>
      </div>
    </section>
  );
};

export default FeaturedListings;
