
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PropertyDetailsSectionProps {
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  areaSqft: number;
  onInputChange: (field: string, value: any) => void;
}

const PropertyDetailsSection = ({
  propertyType,
  bedrooms,
  bathrooms,
  areaSqft,
  onInputChange,
}: PropertyDetailsSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div>
        <Label htmlFor="property_type">Property Type</Label>
        <Select value={propertyType} onValueChange={(value) => onInputChange('property_type', value)}>
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
          value={bedrooms}
          onChange={(e) => onInputChange('bedrooms', parseInt(e.target.value))}
        />
      </div>
      <div>
        <Label htmlFor="bathrooms">Bathrooms</Label>
        <Input
          id="bathrooms"
          type="number"
          min="0"
          value={bathrooms}
          onChange={(e) => onInputChange('bathrooms', parseInt(e.target.value))}
        />
      </div>
      <div>
        <Label htmlFor="area_sqft">Area (sq ft)</Label>
        <Input
          id="area_sqft"
          type="number"
          min="0"
          value={areaSqft}
          onChange={(e) => onInputChange('area_sqft', parseInt(e.target.value))}
        />
      </div>
    </div>
  );
};

export default PropertyDetailsSection;
