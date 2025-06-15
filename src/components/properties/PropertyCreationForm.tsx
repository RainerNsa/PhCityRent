
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useCreateProperty } from '@/hooks/useProperties';
import { useAuth } from '@/hooks/useAuth';
import { Plus, Minus } from 'lucide-react';

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
  });

  const [amenityInput, setAmenityInput] = useState('');

  const commonAmenities = [
    'Air Conditioning', 'Parking', 'Swimming Pool', 'Gym', 'Security',
    'Generator', 'Water Supply', 'Internet', 'Furnished', 'Balcony'
  ];

  const handleInputChange = (field: keyof PropertyFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addAmenity = (amenity: string) => {
    if (amenity && !formData.amenities.includes(amenity)) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, amenity]
      }));
    }
    setAmenityInput('');
  };

  const removeAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter(a => a !== amenity)
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
        agent_id: null, // Set if user is an agent
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
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Property Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="e.g., Old GRA, Port Harcourt"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
            />
          </div>

          {/* Property Details */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="property_type">Property Type</Label>
              <Select value={formData.property_type} onValueChange={(value) => handleInputChange('property_type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="duplex">Duplex</SelectItem>
                  <SelectItem value="bungalow">Bungalow</SelectItem>
                  <SelectItem value="office">Office</SelectItem>
                  <SelectItem value="shop">Shop</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input
                id="bedrooms"
                type="number"
                min="0"
                value={formData.bedrooms}
                onChange={(e) => handleInputChange('bedrooms', parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input
                id="bathrooms"
                type="number"
                min="0"
                value={formData.bathrooms}
                onChange={(e) => handleInputChange('bathrooms', parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="area_sqft">Area (sq ft)</Label>
              <Input
                id="area_sqft"
                type="number"
                min="0"
                value={formData.area_sqft}
                onChange={(e) => handleInputChange('area_sqft', parseInt(e.target.value))}
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price_per_year">Annual Rent (₦) *</Label>
              <Input
                id="price_per_year"
                type="number"
                min="0"
                value={formData.price_per_year}
                onChange={(e) => handleInputChange('price_per_year', parseInt(e.target.value))}
                required
              />
            </div>
            <div>
              <Label htmlFor="price_per_month">Monthly Rent (₦)</Label>
              <Input
                id="price_per_month"
                type="number"
                min="0"
                value={formData.price_per_month}
                onChange={(e) => handleInputChange('price_per_month', parseInt(e.target.value))}
              />
            </div>
          </div>

          {/* Amenities */}
          <div>
            <Label>Amenities</Label>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {commonAmenities.map((amenity) => (
                  <Button
                    key={amenity}
                    type="button"
                    variant={formData.amenities.includes(amenity) ? "default" : "outline"}
                    size="sm"
                    onClick={() => 
                      formData.amenities.includes(amenity) 
                        ? removeAmenity(amenity)
                        : addAmenity(amenity)
                    }
                  >
                    {amenity}
                  </Button>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Input
                  placeholder="Add custom amenity"
                  value={amenityInput}
                  onChange={(e) => setAmenityInput(e.target.value)}
                />
                <Button
                  type="button"
                  onClick={() => addAmenity(amenityInput)}
                  disabled={!amenityInput}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {formData.amenities.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-1 bg-blue-100 px-2 py-1 rounded">
                      <span className="text-sm">{amenity}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAmenity(amenity)}
                        className="h-4 w-4 p-0"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contact_email">Contact Email</Label>
              <Input
                id="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={(e) => handleInputChange('contact_email', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="contact_whatsapp">WhatsApp Number</Label>
              <Input
                id="contact_whatsapp"
                value={formData.contact_whatsapp}
                onChange={(e) => handleInputChange('contact_whatsapp', e.target.value)}
                placeholder="+234 xxx xxx xxxx"
              />
            </div>
          </div>

          {/* Property Status */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_available"
                checked={formData.is_available}
                onCheckedChange={(checked) => handleInputChange('is_available', checked)}
              />
              <Label htmlFor="is_available">Available for rent</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => handleInputChange('featured', checked)}
              />
              <Label htmlFor="featured">Featured property</Label>
            </div>
          </div>

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
