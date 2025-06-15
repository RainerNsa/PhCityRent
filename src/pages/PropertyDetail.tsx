
import React from "react";
import { useParams, Link } from "react-router-dom";
import { useProperty } from "@/hooks/useProperty";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/Footer";
import PropertyImageGallery from "@/components/properties/PropertyImageGallery";
import PropertyInquiryForm from "@/components/properties/PropertyInquiryForm";
import RelatedProperties from "@/components/properties/RelatedProperties";
import { 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  DollarSign, 
  Shield, 
  Star,
  Share2,
  ArrowLeft,
  Phone,
  Mail,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: property, isLoading, error } = useProperty(id || '');
  const { toast } = useToast();

  const handleShare = async () => {
    if (navigator.share && property) {
      try {
        await navigator.share({
          title: property.title,
          text: `Check out this property: ${property.title}`,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link Copied!",
          description: "Property link copied to clipboard",
        });
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied!",
        description: "Property link copied to clipboard",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="aspect-video bg-gray-200 rounded-lg"></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="h-6 bg-gray-200 rounded w-2/3"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
                <div className="h-96 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h1>
              <p className="text-gray-600 mb-8">The property you're looking for doesn't exist or is no longer available.</p>
              <Link to="/properties">
                <Button className="bg-orange-500 hover:bg-orange-600">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Properties
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
            <Link to="/" className="hover:text-orange-500">Home</Link>
            <span>/</span>
            <Link to="/properties" className="hover:text-orange-500">Properties</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{property.title}</span>
          </nav>

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
                {property.is_verified && (
                  <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                    <Shield className="w-4 h-4 mr-1" />
                    PH Verified
                  </div>
                )}
                {property.featured && (
                  <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    Featured
                  </div>
                )}
              </div>
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{property.location}</span>
              </div>
              <div className="flex items-center text-orange-500 font-bold text-2xl">
                <DollarSign className="w-6 h-6 mr-1" />
                <span>₦{property.price_per_year.toLocaleString()}/year</span>
                <span className="text-gray-500 text-lg ml-2">(₦{(property.price_per_year / 12).toLocaleString()}/month)</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 mt-4 md:mt-0">
              <Button
                variant="outline"
                onClick={handleShare}
                className="flex items-center"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Link to="/properties">
                <Button variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Properties
                </Button>
              </Link>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Property Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image Gallery */}
              <PropertyImageGallery propertyId={property.id} title={property.title} />

              {/* Property Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <Bed className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                  <div className="font-semibold text-gray-900">{property.bedrooms}</div>
                  <div className="text-sm text-gray-600">Bedrooms</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <Bath className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                  <div className="font-semibold text-gray-900">{property.bathrooms}</div>
                  <div className="text-sm text-gray-600">Bathrooms</div>
                </div>
                {property.area_sqft && (
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <Square className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                    <div className="font-semibold text-gray-900">{property.area_sqft}</div>
                    <div className="text-sm text-gray-600">Sq Ft</div>
                  </div>
                )}
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-lg font-semibold text-gray-900 capitalize">{property.property_type}</div>
                  <div className="text-sm text-gray-600">Property Type</div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Description</h3>
                <p className="text-gray-700 leading-relaxed">
                  {property.description || `Beautiful ${property.property_type} located in ${property.location}. This property offers comfortable living with ${property.bedrooms} bedrooms and ${property.bathrooms} bathrooms, perfect for those seeking quality accommodation in Port Harcourt.`}
                </p>
              </div>

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {property.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center text-gray-700">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Information */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Agent</h3>
                <div className="space-y-3">
                  {property.contact_whatsapp && (
                    <div className="flex items-center text-gray-700">
                      <Phone className="w-5 h-5 text-green-500 mr-3" />
                      <span>WhatsApp: {property.contact_whatsapp}</span>
                    </div>
                  )}
                  {property.contact_email && (
                    <div className="flex items-center text-gray-700">
                      <Mail className="w-5 h-5 text-blue-500 mr-3" />
                      <span>Email: {property.contact_email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Inquiry Form */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <PropertyInquiryForm 
                  propertyId={property.id} 
                  propertyTitle={property.title} 
                />
              </div>
            </div>
          </div>

          {/* Related Properties */}
          <RelatedProperties currentProperty={property} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PropertyDetail;
