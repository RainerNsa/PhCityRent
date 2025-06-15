
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useCreateProperty } from '@/hooks/useProperties';
import { useAuth } from '@/hooks/useAuth';
import PropertyImageUpload from './PropertyImageUpload';
import BasicInfoSection from './form/BasicInfoSection';
import PropertyDetailsSection from './form/PropertyDetailsSection';
import PricingSection from './form/PricingSection';
import AmenitiesSection from './form/AmenitiesSection';
import ContactInfoSection from './form/ContactInfoSection';
import PropertyStatusSection from './form/PropertyStatusSection';

interface PropertyFormData {
  title: string;
  description: string;
  location: string;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  area_sqft: number;
  price_per_year: number;
  price_per_month: number;
  amenities: string[];
  contact_email: string;
  contact_whatsapp: string;
  is_available: boolean;
  featured: boolean;
  images: string[];
}

const PropertyCreationForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const createProperty = useCreateProperty();
  
  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    description: '',
    location: '',
    property_type: 'apartment',
    bedrooms: 1,
    bathrooms: 1,
    area_sqft: 0,
    price_per_year: 0,
    price_per_month: 0,
    amenities: [],
    contact_email: user?.email || '',
    contact_whatsapp: '',
    is_available: true,
    featured: false,
    images: [],
  });

  const handleInputChange = (field: keyof PropertyFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a property",
        variant: "destructive",
      });
      return;
    }

    try {
      await createProperty.mutateAsync({
        ...formData,
        landlord_id: user.id,
        agent_id: null,
      });

      toast({
        title: "Success",
        description: "Property created successfully!",
      });

      onSuccess?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create property. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Property</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <PropertyImageUpload
            images={formData.images}
            onImagesChange={(images) => handleInputChange('images', images)}
          />

          <BasicInfoSection
            title={formData.title}
            location={formData.location}
            description={formData.description}
            onInputChange={handleInputChange}
          />

          <PropertyDetailsSection
            propertyType={formData.property_type}
            bedrooms={formData.bedrooms}
            bathrooms={formData.bathrooms}
            areaSqft={formData.area_sqft}
            onInputChange={handleInputChange}
          />

          <PricingSection
            pricePerYear={formData.price_per_year}
            pricePerMonth={formData.price_per_month}
            onInputChange={handleInputChange}
          />

          <AmenitiesSection
            amenities={formData.amenities}
            onAmenitiesChange={(amenities) => handleInputChange('amenities', amenities)}
          />

          <ContactInfoSection
            contactEmail={formData.contact_email}
            contactWhatsapp={formData.contact_whatsapp}
            onInputChange={handleInputChange}
          />

          <PropertyStatusSection
            isAvailable={formData.is_available}
            featured={formData.featured}
            onInputChange={handleInputChange}
          />

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit" disabled={createProperty.isPending}>
              {createProperty.isPending ? 'Creating...' : 'Create Property'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PropertyCreationForm;
