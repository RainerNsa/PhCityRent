
import React from "react";
import { MapPin, Bed, Bath, DollarSign, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Property {
  id: string;
  title: string;
  location: string;
  price_per_year: number;
  bedrooms: number;
  bathrooms: number;
  images?: string[];
  is_verified?: boolean;
  featured?: boolean;
}

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  // Authentic Nigerian property images - same as FeaturedListings
  const nigerianPropertyImages = [
    "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=800&q=80", // Modern Nigerian duplex
    "https://images.unsplash.com/photo-1565402170291-8491f14678db?auto=format&fit=crop&w=800&q=80", // Nigerian residential building
    "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?auto=format&fit=crop&w=800&q=80"  // Nigerian modern home
  ];

  // Use property images or fallback to Nigerian property images
  const imageIndex = parseInt(property.id) % nigerianPropertyImages.length;
  const propertyImage = property.images?.[0] || nigerianPropertyImages[imageIndex];

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <img 
          src={propertyImage}
          alt={property.title}
          className="w-full h-48 object-cover"
        />
        {property.is_verified && (
          <div className="absolute top-4 right-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
            <Shield className="w-3 h-3 mr-1" />
            PH Verified
          </div>
        )}
        {property.featured && (
          <div className="absolute top-4 left-4 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Featured
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{property.title}</h3>
        
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
          <div className="flex items-center text-orange-500 font-semibold">
            <DollarSign className="w-4 h-4 mr-1" />
            <span>₦{property.price_per_year.toLocaleString()}/year</span>
          </div>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
