
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Minus } from 'lucide-react';

interface AmenitiesSectionProps {
  amenities: string[];
  onAmenitiesChange: (amenities: string[]) => void;
}

const AmenitiesSection = ({
  amenities,
  onAmenitiesChange,
}: AmenitiesSectionProps) => {
  const [amenityInput, setAmenityInput] = useState('');

  const commonAmenities = [
    'Air Conditioning', 'Parking', 'Swimming Pool', 'Gym', 'Security',
    'Generator', 'Water Supply', 'Internet', 'Furnished', 'Balcony'
  ];

  const addAmenity = (amenity: string) => {
    if (amenity && !amenities.includes(amenity)) {
      onAmenitiesChange([...amenities, amenity]);
    }
    setAmenityInput('');
  };

  const removeAmenity = (amenity: string) => {
    onAmenitiesChange(amenities.filter(a => a !== amenity));
  };

  return (
    <div>
      <Label>Amenities</Label>
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {commonAmenities.map((amenity) => (
            <Button
              key={amenity}
              type="button"
              variant={amenities.includes(amenity) ? "default" : "outline"}
              size="sm"
              onClick={() => 
                amenities.includes(amenity) 
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

        {amenities.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {amenities.map((amenity) => (
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
  );
};

export default AmenitiesSection;
