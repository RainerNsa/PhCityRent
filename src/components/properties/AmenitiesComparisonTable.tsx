
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

interface AmenitiesComparisonTableProps {
  properties: Property[];
}

const AmenitiesComparisonTable = ({ properties }: AmenitiesComparisonTableProps) => {
  const getUniqueAmenities = () => {
    const allAmenities = properties.flatMap(p => p.amenities || []);
    return [...new Set(allAmenities)];
  };

  if (properties.length <= 1) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Amenities Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Amenity</th>
                {properties.map((property) => (
                  <th key={property.id} className="text-center py-2 px-2">
                    {property.title.substring(0, 20)}...
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {getUniqueAmenities().map((amenity) => (
                <tr key={amenity} className="border-b">
                  <td className="py-2 font-medium">{amenity}</td>
                  {properties.map((property) => (
                    <td key={property.id} className="text-center py-2">
                      {(property.amenities || []).includes(amenity) ? (
                        <span className="text-green-600">✓</span>
                      ) : (
                        <span className="text-gray-300">✗</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AmenitiesComparisonTable;
