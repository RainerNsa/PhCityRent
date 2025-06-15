
import React from "react";
import { MapPin, Bed, Bath, Square, Star, Shield, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePropertyInquiry } from "@/hooks/useProperties";
import { useToast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";

type Property = Database['public']['Tables']['properties']['Row'];

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const { mutate: createInquiry } = usePropertyInquiry();
  const { toast } = useToast();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleContactAgent = () => {
    if (property.contact_whatsapp) {
      const message = `Hi! I'm interested in your property: ${property.title}`;
      const whatsappUrl = `https://wa.me/${property.contact_whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const handleViewDetails = () => {
    // Create an inquiry when someone views details
    createInquiry({
      property_id: property.id,
      inquirer_name: "Anonymous Viewer",
      inquirer_email: "viewer@example.com",
      inquiry_type: "property_view",
      message: `Viewed property: ${property.title}`,
    }, {
      onSuccess: () => {
        toast({
          title: "Interest Recorded",
          description: "Your interest has been noted. Contact the agent for more details.",
        });
      },
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="relative">
        <img 
          src={property.images?.[0] || '/placeholder.svg'} 
          alt={property.title}
          className="w-full h-48 object-cover"
        />
        {property.is_verified && (
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
        
        {property.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{property.description}</p>
        )}
        
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
            {property.area_sqft && (
              <div className="flex items-center">
                <Square className="w-4 h-4 mr-1" />
                {property.area_sqft} sqft
              </div>
            )}
          </div>
        </div>

        {property.amenities && property.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {property.amenities.slice(0, 3).map((amenity) => (
              <span key={amenity} className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
                {amenity}
              </span>
            ))}
            {property.amenities.length > 3 && (
              <span className="text-xs text-gray-500">+{property.amenities.length - 3} more</span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <div className="text-right">
            <div className="text-2xl font-bold text-orange-600">
              {formatPrice(property.price_per_year)}/year
            </div>
            {property.price_per_month && (
              <div className="text-sm text-gray-500">
                {formatPrice(property.price_per_month)}/month
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={handleViewDetails}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
          >
            View Details
          </Button>
          {property.contact_whatsapp && (
            <Button 
              onClick={handleContactAgent}
              variant="outline"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              <Phone className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
