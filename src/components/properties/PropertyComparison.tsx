
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import PropertyComparisonCard from './PropertyComparisonCard';
import AmenitiesComparisonTable from './AmenitiesComparisonTable';

interface Property {
  id: string;
  title: string;
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
}

interface PropertyComparisonProps {
  properties: Property[];
  onRemoveProperty: (propertyId: string) => void;
  onClose: () => void;
}

const PropertyComparison = ({ properties, onRemoveProperty, onClose }: PropertyComparisonProps) => {
  if (properties.length === 0) {
    return (
      <Card className="p-8 text-center">
        <h3 className="text-lg font-semibold mb-2">No Properties to Compare</h3>
        <p className="text-gray-600">Add properties to your comparison list to see them here.</p>
        <Button onClick={onClose} className="mt-4">Close</Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Property Comparison</h2>
        <Button variant="outline" onClick={onClose}>
          <X className="w-4 h-4 mr-2" />
          Close
        </Button>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyComparisonCard
              key={property.id}
              property={property}
              onRemove={onRemoveProperty}
            />
          ))}
        </div>
      </div>

      <AmenitiesComparisonTable properties={properties} />
    </div>
  );
};

export default PropertyComparison;
