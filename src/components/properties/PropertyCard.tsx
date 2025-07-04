
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { MapPin, Bed, Bath, Square, Phone, Mail, Calendar, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { designTokens } from "@/lib/design-tokens";

interface Property {
  id: string;
  title: string;
  location: string;
  price_per_year: number;
  bedrooms: number;
  bathrooms: number;
  area_sqft?: number;
  images?: string[];
  property_type?: string;
  is_verified?: boolean;
  featured?: boolean;
  contact_whatsapp?: string;
  contact_email?: string;
  description?: string;
}

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(price);
  };

  const handleContactPhone = () => {
    if (property.contact_whatsapp) {
      window.open(`tel:${property.contact_whatsapp}`, '_self');
    }
  };

  const handleContactEmail = () => {
    if (property.contact_email) {
      window.open(`mailto:${property.contact_email}?subject=Inquiry about ${property.title}`, '_self');
    }
  };

  const handleScheduleViewing = () => {
    // This would open a scheduling modal - for now, redirect to contact
    if (property.contact_whatsapp) {
      const message = encodeURIComponent(`Hi, I'm interested in scheduling a viewing for ${property.title} located at ${property.location}.`);
      window.open(`https://wa.me/${property.contact_whatsapp.replace(/\D/g, '')}?text=${message}`, '_blank');
    }
  };

  const handleSaveProperty = () => {
    // This would integrate with saved properties functionality
    console.log('Save property:', property.id);
    // TODO: Implement save property functionality
  };

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-white border-0 shadow-lg">
      <div className="relative">
        <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          {property.images && property.images.length > 0 ? (
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <Square className="w-12 h-12" />
            </div>
          )}
        </div>
        
        <div className="absolute top-4 left-4 flex gap-2">
          {property.featured && (
            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-md">
              Featured
            </Badge>
          )}
          {property.is_verified && (
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-md">
              Verified
            </Badge>
          )}
        </div>

        <button
          onClick={handleSaveProperty}
          className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all duration-200 hover:scale-110"
        >
          <Heart className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors" />
        </button>
      </div>

      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
              {property.title}
            </h3>
            <div className="flex items-center text-gray-600 mb-3">
              <MapPin className="w-4 h-4 mr-1 text-orange-500" />
              <span className="text-sm">{property.location}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              {formatPrice(property.price_per_year)}/year
            </div>
            {property.property_type && (
              <Badge variant="outline" className="border-orange-200 text-orange-600">
                {property.property_type}
              </Badge>
            )}
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Bed className="w-4 h-4 mr-1 text-orange-500" />
              <span>{property.bedrooms} beds</span>
            </div>
            <div className="flex items-center">
              <Bath className="w-4 h-4 mr-1 text-orange-500" />
              <span>{property.bathrooms} baths</span>
            </div>
            {property.area_sqft && (
              <div className="flex items-center">
                <Square className="w-4 h-4 mr-1 text-orange-500" />
                <span>{property.area_sqft} sqft</span>
              </div>
            )}
          </div>

          {property.description && (
            <p className="text-gray-600 text-sm line-clamp-2">
              {property.description}
            </p>
          )}

          <div className="grid grid-cols-2 gap-2 pt-4 border-t">
            <div className="flex gap-1">
              {property.contact_whatsapp && (
                <EnhancedButton
                  variant="outline"
                  size="sm"
                  onClick={handleContactPhone}
                  className="flex-1 text-xs"
                >
                  <Phone className="w-3 h-3 mr-1" />
                  Call
                </EnhancedButton>
              )}
              {property.contact_email && (
                <EnhancedButton
                  variant="outline"
                  size="sm"
                  onClick={handleContactEmail}
                  className="flex-1 text-xs"
                >
                  <Mail className="w-3 h-3 mr-1" />
                  Email
                </EnhancedButton>
              )}
            </div>
            <EnhancedButton
              variant="primary"
              size="sm"
              onClick={handleScheduleViewing}
              className="text-xs"
            >
              <Calendar className="w-3 h-3 mr-1" />
              Schedule
            </EnhancedButton>
          </div>

          <Link to={`/property/${property.id}`}>
            <EnhancedButton variant="secondary" className="w-full mt-2">
              View Details
            </EnhancedButton>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
