
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface PropertyStatusSectionProps {
  isAvailable: boolean;
  featured: boolean;
  onInputChange: (field: string, value: boolean) => void;
}

const PropertyStatusSection = ({
  isAvailable,
  featured,
  onInputChange,
}: PropertyStatusSectionProps) => {
  return (
    <div className="flex items-center space-x-6">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="is_available"
          checked={isAvailable}
          onCheckedChange={(checked) => onInputChange('is_available', checked as boolean)}
        />
        <Label htmlFor="is_available">Available for rent</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="featured"
          checked={featured}
          onCheckedChange={(checked) => onInputChange('featured', checked as boolean)}
        />
        <Label htmlFor="featured">Featured property</Label>
      </div>
    </div>
  );
};

export default PropertyStatusSection;
