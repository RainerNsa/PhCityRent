
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
  // Expanded array of authentic Nigerian/Port Harcourt property images
  const nigerianPropertyImages = [
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80", // Modern Nigerian house with contemporary design
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80", // Traditional Nigerian residential building
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80", // Nigerian duplex with modern architecture
    "https://images.unsplash.com/photo-1571055107559-3e67626fa8be?auto=format&fit=crop&w=800&q=80", // West African style residential home
    "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=800&q=80", // Nigerian family house with compound
    "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=800&q=80"  // Nigerian modern home exterior
  ];

  // Always use Nigerian property images with consistent selection logic
  const imageIndex = parseInt(property.id) % nigerianPropertyImages.length;
  const propertyImage = nigerianPropertyImages[imageIndex];

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
