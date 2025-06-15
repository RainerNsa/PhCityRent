
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface BasicInfoSectionProps {
  title: string;
  location: string;
  description: string;
  onInputChange: (field: string, value: string) => void;
}

const BasicInfoSection = ({
  title,
  location,
  description,
  onInputChange,
}: BasicInfoSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Property Title *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => onInputChange('title', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            value={location}
            onChange={(e) => onInputChange('location', e.target.value)}
            placeholder="e.g., Old GRA, Port Harcourt"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => onInputChange('description', e.target.value)}
          rows={4}
        />
      </div>
    </div>
  );
};

export default BasicInfoSection;
