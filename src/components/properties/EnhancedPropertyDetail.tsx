
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Bed, Bath, Square, Star, Calendar, MessageSquare, Eye, Share2 } from 'lucide-react';
import PropertyViewingScheduler from './PropertyViewingScheduler';
import PropertyReviews from './PropertyReviews';
import VirtualTour from './VirtualTour';
import SavePropertyButton from './SavePropertyButton';

interface Property {
  id: string;
  title: string;
  description?: string;
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
  contact_email?: string;
  contact_whatsapp?: string;
}

interface EnhancedPropertyDetailProps {
  property: Property;
  tourImages?: string[];
  tour360Url?: string;
  videoTourUrl?: string;
  reviews?: any[];
}

const EnhancedPropertyDetail = ({ 
  property, 
  tourImages = [], 
  tour360Url, 
  videoTourUrl,
  reviews = []
}: EnhancedPropertyDetailProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `₦${(price / 1000000).toFixed(1)}M`;
    }
    return `₦${price.toLocaleString()}`;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: `Check out this property: ${property.title}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Share failed:', error);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="space-y-6">
      {/* Property Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
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
                <Badge variant="outline">{property.property_type || 'Apartment'}</Badge>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="w-5 h-5 mr-2" />
                {property.location}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <SavePropertyButton propertyId={property.id} />
              <Button variant="outline" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Price and Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {formatPrice(property.price_per_year)}/year
              </div>
              <div className="text-lg text-gray-600">
                ₦{Math.round(property.price_per_year / 12).toLocaleString()}/month
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center">
                <Bed className="w-5 h-5 mr-2" />
                <span className="font-medium">{property.bedrooms} Bedrooms</span>
              </div>
              <div className="flex items-center">
                <Bath className="w-5 h-5 mr-2" />
                <span className="font-medium">{property.bathrooms} Bathrooms</span>
              </div>
              {property.area_sqft && (
                <div className="flex items-center">
                  <Square className="w-5 h-5 mr-2" />
                  <span className="font-medium">{property.area_sqft} sqft</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabbed Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tour">
            <Eye className="w-4 h-4 mr-2" />
            Virtual Tour
          </TabsTrigger>
          <TabsTrigger value="schedule">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Viewing
          </TabsTrigger>
          <TabsTrigger value="reviews">
            <MessageSquare className="w-4 h-4 mr-2" />
            Reviews ({reviews.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Description */}
          {property.description && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">About This Property</h3>
                <p className="text-gray-700 leading-relaxed">{property.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {property.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-green-600 mr-2">✓</span>
                      {amenity}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Contact Information */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {property.contact_email && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-lg">{property.contact_email}</p>
                  </div>
                )}
                {property.contact_whatsapp && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">WhatsApp</label>
                    <p className="text-lg">{property.contact_whatsapp}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tour">
          <VirtualTour
            propertyId={property.id}
            tourImages={tourImages}
            tour360Url={tour360Url}
            videoTourUrl={videoTourUrl}
          />
        </TabsContent>

        <TabsContent value="schedule">
          <PropertyViewingScheduler
            propertyId={property.id}
            propertyTitle={property.title}
            onScheduled={() => {
              // Handle successful scheduling
              console.log('Viewing scheduled successfully');
            }}
          />
        </TabsContent>

        <TabsContent value="reviews">
          <PropertyReviews
            propertyId={property.id}
            reviews={reviews}
            allowReview={true}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedPropertyDetail;
