
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, MapPin, Bed, Bath, Square, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Property {
  id: string;
  title: string;
  location: string;
  price_per_year: number;
  bedrooms: number;
  bathrooms: number;
  area_sqft?: number;
  images?: string[];
  amenities?: string[];
  featured?: boolean;
  is_verified?: boolean;
  property_type?: string;
}

interface PropertyComparisonCardProps {
  property: Property;
  onRemove: (propertyId: string) => void;
}

const PropertyComparisonCard = ({ property, onRemove }: PropertyComparisonCardProps) => {
  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `₦${(price / 1000000).toFixed(1)}M`;
    }
    return `₦${price.toLocaleString()}`;
  };

  return (
    <Card className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2 z-10"
        onClick={() => onRemove(property.id)}
      >
        <X className="w-4 h-4" />
      </Button>

      <CardHeader className="pb-4">
        <div className="aspect-video bg-gray-200 rounded-lg mb-3">
          {property.images && property.images.length > 0 ? (
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
        </div>
        <CardTitle className="text-lg">{property.title}</CardTitle>
        <div className="flex items-center text-gray-600 text-sm">
          <MapPin className="w-4 h-4 mr-1" />
          {property.location}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-orange-600">
            {formatPrice(property.price_per_year)}/year
          </span>
          {property.featured && (
            <Badge className="bg-orange-500">
              <Star className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 text-sm">
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
            {property.area_sqft || 'N/A'}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Type</h4>
          <Badge variant="outline">{property.property_type || 'Apartment'}</Badge>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Monthly Rent</h4>
          <p className="text-gray-600">
            ₦{Math.round(property.price_per_year / 12).toLocaleString()}
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Amenities</h4>
          <div className="flex flex-wrap gap-1">
            {(property.amenities || []).slice(0, 3).map((amenity) => (
              <Badge key={amenity} variant="secondary" className="text-xs">
                {amenity}
              </Badge>
            ))}
            {(property.amenities || []).length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{(property.amenities || []).length - 3} more
              </Badge>
            )}
          </div>
        </div>

        <Button 
          onClick={() => navigate(`/properties/${property.id}`)}
          className="w-full"
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default PropertyComparisonCard;
