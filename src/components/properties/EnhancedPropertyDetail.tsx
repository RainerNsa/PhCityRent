
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MapPin, Bed, Bath, Square, Star, Calendar, MessageSquare, Eye, Share2, 
  Shield, Phone, Mail, CheckCircle, Heart, ArrowLeft, Camera, Play,
  Wifi, Car, Zap, Droplets, Wind, Sun, TreePine, MapIcon
} from 'lucide-react';
import PropertyViewingScheduler from './PropertyViewingScheduler';
import PropertyReviews from './PropertyReviews';
import VirtualTour from './VirtualTour';
import SavePropertyButton from './SavePropertyButton';
import { useToast } from '@/hooks/use-toast';

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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageGalleryOpen, setIsImageGalleryOpen] = useState(false);
  const { toast } = useToast();

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
        navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link Copied!",
          description: "Property link copied to clipboard",
        });
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied!",
        description: "Property link copied to clipboard",
      });
    }
  };

  const handleContactAgent = (type: 'phone' | 'email' | 'whatsapp') => {
    switch (type) {
      case 'phone':
        if (property.contact_whatsapp) {
          window.open(`tel:${property.contact_whatsapp}`, '_self');
        }
        break;
      case 'email':
        if (property.contact_email) {
          window.open(`mailto:${property.contact_email}?subject=Inquiry about ${property.title}`, '_self');
        }
        break;
      case 'whatsapp':
        if (property.contact_whatsapp) {
          const message = encodeURIComponent(`Hi, I'm interested in the property: ${property.title}`);
          window.open(`https://wa.me/${property.contact_whatsapp.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
        }
        break;
    }
  };

  const amenityIcons: { [key: string]: React.ReactNode } = {
    'WiFi': <Wifi className="w-5 h-5 text-blue-500" />,
    'Parking': <Car className="w-5 h-5 text-gray-600" />,
    'Generator': <Zap className="w-5 h-5 text-yellow-500" />,
    'Water': <Droplets className="w-5 h-5 text-blue-400" />,
    'AC': <Wind className="w-5 h-5 text-cyan-500" />,
    'Balcony': <Sun className="w-5 h-5 text-orange-500" />,
    'Garden': <TreePine className="w-5 h-5 text-green-500" />,
  };

  const defaultImages = [
    "/placeholder.svg",
    "/placeholder.svg",
    "/placeholder.svg"
  ];

  const displayImages = property.images && property.images.length > 0 ? property.images : defaultImages;

  return (
    <div className="space-y-8">
      {/* Enhanced Property Header */}
      <Card className="overflow-hidden shadow-2xl border-0 bg-gradient-to-r from-white to-gray-50">
        <CardContent className="p-0">
          {/* Hero Image Section */}
          <div className="relative h-80 lg:h-96 overflow-hidden">
            <img 
              src={displayImages[currentImageIndex]} 
              alt={property.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Image Navigation */}
            {displayImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {displayImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Image Gallery Button */}
            <Button
              onClick={() => setIsImageGalleryOpen(true)}
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white border-0 backdrop-blur-sm"
            >
              <Camera className="w-4 h-4 mr-2" />
              View All ({displayImages.length})
            </Button>

            {/* Quick Actions Overlay */}
            <div className="absolute top-4 left-4 flex space-x-2">
              {property.featured && (
                <Badge className="bg-orange-500 text-white border-0 shadow-lg">
                  <Star className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              )}
              {property.is_verified && (
                <Badge className="bg-green-500 text-white border-0 shadow-lg">
                  <Shield className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>

            {/* Property Title Overlay */}
            <div className="absolute bottom-6 left-6 text-white">
              <h1 className="text-3xl lg:text-4xl font-bold mb-2 drop-shadow-lg">{property.title}</h1>
              <div className="flex items-center text-white/90">
                <MapPin className="w-5 h-5 mr-2" />
                <span className="text-lg">{property.location}</span>
              </div>
            </div>
          </div>

          {/* Property Info Bar */}
          <div className="p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Price Section */}
              <div className="flex-1">
                <div className="text-4xl font-bold text-orange-600 mb-2">
                  {formatPrice(property.price_per_year)}/year
                </div>
                <div className="text-lg text-gray-600">
                  ₦{Math.round(property.price_per_year / 12).toLocaleString()}/month
                </div>
              </div>

              {/* Property Stats */}
              <div className="flex items-center gap-8">
                <div className="flex items-center">
                  <Bed className="w-6 h-6 mr-2 text-gray-600" />
                  <span className="font-semibold text-lg">{property.bedrooms}</span>
                  <span className="text-gray-600 ml-1">Bedrooms</span>
                </div>
                <div className="flex items-center">
                  <Bath className="w-6 h-6 mr-2 text-gray-600" />
                  <span className="font-semibold text-lg">{property.bathrooms}</span>
                  <span className="text-gray-600 ml-1">Bathrooms</span>
                </div>
                {property.area_sqft && (
                  <div className="flex items-center">
                    <Square className="w-6 h-6 mr-2 text-gray-600" />
                    <span className="font-semibold text-lg">{property.area_sqft}</span>
                    <span className="text-gray-600 ml-1">sqft</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <SavePropertyButton propertyId={property.id} />
                <Button variant="outline" onClick={handleShare} className="rounded-xl">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Tabbed Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="bg-white rounded-2xl shadow-lg p-2">
          <TabsList className="grid w-full grid-cols-4 bg-transparent">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white rounded-xl py-3 font-semibold"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="tour"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white rounded-xl py-3 font-semibold"
            >
              <Eye className="w-4 h-4 mr-2" />
              Virtual Tour
            </TabsTrigger>
            <TabsTrigger 
              value="schedule"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white rounded-xl py-3 font-semibold"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Schedule
            </TabsTrigger>
            <TabsTrigger 
              value="reviews"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white rounded-xl py-3 font-semibold"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Reviews ({reviews.length})
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <TabsContent value="overview" className="space-y-6 mt-0">
              {/* Description */}
              {property.description && (
                <Card className="shadow-lg border-0">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-semibold mb-6 text-gray-900">About This Property</h3>
                    <p className="text-gray-700 leading-relaxed text-lg">{property.description}</p>
                  </CardContent>
                </Card>
              )}

              {/* Enhanced Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <Card className="shadow-lg border-0">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-semibold mb-6 text-gray-900">Amenities & Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {property.amenities.map((amenity) => (
                        <div key={amenity} className="flex items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-orange-50 hover:to-red-50 transition-all duration-200">
                          {amenityIcons[amenity] || <CheckCircle className="w-5 h-5 text-green-500" />}
                          <span className="ml-3 font-medium text-gray-700">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Location & Neighborhood */}
              <Card className="shadow-lg border-0">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-semibold mb-6 text-gray-900">Location & Neighborhood</h3>
                  <div className="flex items-start space-x-4 mb-6">
                    <MapIcon className="w-6 h-6 text-orange-500 mt-1" />
                    <div>
                      <p className="text-lg font-medium text-gray-900 mb-2">{property.location}</p>
                      <p className="text-gray-600">
                        Located in one of Port Harcourt's most desirable neighborhoods with easy access 
                        to shopping centers, schools, and major transportation routes.
                      </p>
                    </div>
                  </div>
                  <div className="h-64 bg-gray-200 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <MapIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Interactive map coming soon</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tour" className="mt-0">
              <VirtualTour
                propertyId={property.id}
                tourImages={tourImages}
                tour360Url={tour360Url}
                videoTourUrl={videoTourUrl}
              />
            </TabsContent>

            <TabsContent value="schedule" className="mt-0">
              <PropertyViewingScheduler
                propertyId={property.id}
                propertyTitle={property.title}
                onScheduled={() => {
                  toast({
                    title: "Viewing Scheduled!",
                    description: "We'll send you a confirmation shortly.",
                  });
                }}
              />
            </TabsContent>

            <TabsContent value="reviews" className="mt-0">
              <PropertyReviews
                propertyId={property.id}
                reviews={reviews}
                allowReview={true}
              />
            </TabsContent>
          </div>

          {/* Sidebar - Contact & Quick Info */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Contact Agent Card */}
              <Card className="shadow-xl border-0 bg-gradient-to-br from-orange-50 to-red-50">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-semibold mb-6 text-gray-900">Contact Agent</h3>
                  
                  <div className="space-y-4">
                    {property.contact_whatsapp && (
                      <Button 
                        onClick={() => handleContactAgent('phone')}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
                      >
                        <Phone className="w-5 h-5 mr-2" />
                        Call Now: {property.contact_whatsapp}
                      </Button>
                    )}
                    
                    {property.contact_whatsapp && (
                      <Button 
                        onClick={() => handleContactAgent('whatsapp')}
                        className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
                      >
                        <MessageSquare className="w-5 h-5 mr-2" />
                        WhatsApp Chat
                      </Button>
                    )}
                    
                    {property.contact_email && (
                      <Button 
                        onClick={() => handleContactAgent('email')}
                        variant="outline" 
                        className="w-full border-orange-300 text-orange-600 hover:bg-orange-50 py-3 rounded-xl font-semibold"
                      >
                        <Mail className="w-5 h-5 mr-2" />
                        Send Email
                      </Button>
                    )}
                  </div>

                  <div className="mt-6 p-4 bg-white rounded-xl border border-orange-200">
                    <p className="text-sm text-gray-600 text-center">
                      <strong>Response Time:</strong> Usually within 2 hours
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Property Summary */}
              <Card className="shadow-lg border-0">
                <CardContent className="p-6">
                  <h4 className="text-lg font-semibold mb-4 text-gray-900">Property Summary</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Property Type</span>
                      <span className="font-medium capitalize">{property.property_type || 'Apartment'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bedrooms</span>
                      <span className="font-medium">{property.bedrooms}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bathrooms</span>
                      <span className="font-medium">{property.bathrooms}</span>
                    </div>
                    {property.area_sqft && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Area</span>
                        <span className="font-medium">{property.area_sqft} sqft</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t pt-3">
                      <span className="text-gray-600">Annual Rent</span>
                      <span className="font-bold text-orange-600">{formatPrice(property.price_per_year)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default EnhancedPropertyDetail;
