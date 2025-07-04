
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import OptimizedImage from '@/components/common/OptimizedImage';
import { MapPin, Bed, Bath, Square, Star, Plus, Check, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SavePropertyButton from './SavePropertyButton';
import { designTokens } from '@/lib/design-tokens';

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

interface EnhancedPropertyCardProps {
  property: Property;
  showCompareButton?: boolean;
  isInComparison?: boolean;
  onAddToComparison?: (property: Property) => void;
  onRemoveFromComparison?: (propertyId: string) => void;
  isLoading?: boolean;
}

const EnhancedPropertyCard = ({ 
  property, 
  showCompareButton = true,
  isInComparison = false,
  onAddToComparison,
  onRemoveFromComparison,
  isLoading = false
}: EnhancedPropertyCardProps) => {
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

  if (isLoading) {
    return <PropertyCardSkeleton />;
  }

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] bg-white border border-gray-100">
      <div className="relative cursor-pointer" onClick={handleClick}>
        {/* Image Section */}
        <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
          {property.images && property.images.length > 0 ? (
            <OptimizedImage
              src={property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              width={400}
              height={300}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gradient-to-br from-gray-50 to-gray-100">
              <div className="text-center">
                <Square className="w-12 h-12 mx-auto mb-2 opacity-40" />
                <span className="text-sm">No Image</span>
              </div>
            </div>
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        {/* Status Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {property.featured && (
            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-md">
              <Star className="w-3 h-3 mr-1 fill-current" />
              Featured
            </Badge>
          )}
          {property.is_verified && (
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-md">
              <Check className="w-3 h-3 mr-1" />
              Verified
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-1">
            <SavePropertyButton propertyId={property.id} />
          </div>
          {showCompareButton && (
            <Button
              size="sm"
              variant={isInComparison ? "default" : "secondary"}
              onClick={handleCompareClick}
              className={`bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-200 ${
                isInComparison ? 'bg-orange-500 text-white hover:bg-orange-600' : 'text-gray-700 hover:text-orange-600'
              }`}
            >
              {isInComparison ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </Button>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 space-y-4">
        {/* Title and Location */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors duration-200 leading-tight">
            {property.title}
          </h3>
          <div className="flex items-center text-gray-500 text-sm">
            <MapPin className="w-4 h-4 mr-1.5 text-gray-400" />
            <span className="truncate">{property.location}</span>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-3">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {formatPrice(property.price_per_year)}
              </div>
              <div className="text-sm text-gray-500">per year</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-gray-700">
                ₦{Math.round(property.price_per_year / 12).toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">per month</div>
            </div>
          </div>
        </div>

        {/* Property Details */}
        <div className="flex items-center justify-between py-2 border-t border-gray-100">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Bed className="w-4 h-4 text-gray-400" />
              <span className="font-medium">{property.bedrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="w-4 h-4 text-gray-400" />
              <span className="font-medium">{property.bathrooms}</span>
            </div>
            {property.area_sqft && (
              <div className="flex items-center gap-1">
                <Square className="w-4 h-4 text-gray-400" />
                <span className="font-medium">{property.area_sqft} sqft</span>
              </div>
            )}
          </div>
        </div>

        {/* Amenities */}
        {property.amenities && property.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {property.amenities.slice(0, 3).map((amenity) => (
              <Badge key={amenity} variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 transition-colors">
                {amenity}
              </Badge>
            ))}
            {property.amenities.length > 3 && (
              <Badge variant="outline" className="text-xs bg-orange-50 text-orange-600 border-orange-200">
                +{property.amenities.length - 3}
              </Badge>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

// Loading skeleton component
const PropertyCardSkeleton = () => (
  <Card className="overflow-hidden animate-pulse">
    <div className="aspect-[4/3] bg-gray-200" />
    <div className="p-5 space-y-4">
      <div className="space-y-2">
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>
      <div className="bg-gray-100 rounded-lg p-3">
        <div className="h-6 bg-gray-200 rounded w-1/3" />
      </div>
      <div className="flex gap-4">
        <div className="h-4 bg-gray-200 rounded w-12" />
        <div className="h-4 bg-gray-200 rounded w-12" />
        <div className="h-4 bg-gray-200 rounded w-16" />
      </div>
    </div>
  </Card>
);

export default EnhancedPropertyCard;
