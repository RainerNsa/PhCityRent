
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Bed, Bath, Square, Star, Plus, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SavePropertyButton from './SavePropertyButton';

interface Property {
  id: string;
  title: string;
  location: string;
  price_per_year: number;
  bedrooms: number;
  bathrooms: number;
  area_sqft?: number;
  images?: string[];
  featured?: boolean;
  is_verified?: boolean;
  amenities?: string[];
  property_type?: string;
}

interface PropertyCardProps {
  property: Property;
  showCompareButton?: boolean;
  isInComparison?: boolean;
  onAddToComparison?: (property: Property) => void;
  onRemoveFromComparison?: (propertyId: string) => void;
}

const PropertyCard = ({ 
  property, 
  showCompareButton = true,
  isInComparison = false,
  onAddToComparison,
  onRemoveFromComparison 
}: PropertyCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/properties/${property.id}`);
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `₦${(price / 1000000).toFixed(1)}M`;
    }
    return `₦${price.toLocaleString()}`;
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInComparison) {
      onRemoveFromComparison?.(property.id);
    } else {
      onAddToComparison?.(property);
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
      <div className="relative" onClick={handleClick}>
        <div className="aspect-video bg-gray-200">
          {property.images && property.images.length > 0 ? (
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image Available
            </div>
          )}
        </div>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {property.featured && (
            <Badge className="bg-orange-500 text-white">
              <Star className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          )}
          {property.is_verified && (
            <Badge variant="secondary" className="bg-green-500 text-white">
              Verified
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex gap-2">
          <SavePropertyButton propertyId={property.id} />
          {showCompareButton && (
            <Button
              size="sm"
              variant={isInComparison ? "default" : "secondary"}
              onClick={handleCompareClick}
              className={`opacity-0 group-hover:opacity-100 transition-opacity ${
                isInComparison ? 'bg-orange-500 hover:bg-orange-600' : ''
              }`}
            >
              {isInComparison ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </Button>
          )}
        </div>
      </div>

      <CardContent className="p-4" onClick={handleClick}>
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors">
              {property.title}
            </h3>
            <div className="flex items-center text-gray-600 text-sm mt-1">
              <MapPin className="w-4 h-4 mr-1" />
              {property.location}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-xl font-bold text-orange-600">
              {formatPrice(property.price_per_year)}/year
            </div>
            <div className="text-sm text-gray-500">
              ₦{Math.round(property.price_per_year / 12).toLocaleString()}/month
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Bed className="w-4 h-4 mr-1" />
              {property.bedrooms} beds
            </div>
            <div className="flex items-center">
              <Bath className="w-4 h-4 mr-1" />
              {property.bathrooms} baths
            </div>
            {property.area_sqft && (
              <div className="flex items-center">
                <Square className="w-4 h-4 mr-1" />
                {property.area_sqft} sqft
              </div>
            )}
          </div>

          {/* Amenities Preview */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {property.amenities.slice(0, 2).map((amenity) => (
                <Badge key={amenity} variant="outline" className="text-xs">
                  {amenity}
                </Badge>
              ))}
              {property.amenities.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{property.amenities.length - 2} more
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
