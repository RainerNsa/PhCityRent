
import React from 'react';
import PropertyMap from './PropertyMap';
import PropertyCard from './PropertyCard';

interface Property {
  id: string;
  title: string;
  location: string;
  price_per_year: number;
  bedrooms: number;
  bathrooms: number;
  area_sqft?: number;
  images?: string[];
  featured?: boolean;
  is_verified?: boolean;
}

interface PropertiesMapViewProps {
  properties: Property[];
  onPropertySelect: (property: Property) => void;
  setViewMode: (mode: "grid" | "list" | "map") => void;
}

const PropertiesMapView = ({ properties, onPropertySelect, setViewMode }: PropertiesMapViewProps) => {
  return (
    <div className="space-y-6">
      <PropertyMap 
        properties={properties} 
        onPropertySelect={onPropertySelect}
        height="600px"
      />
      
      {/* Properties list below map */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.slice(0, 6).map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
      
      {properties.length > 6 && (
        <div className="text-center">
          <button
            onClick={() => setViewMode("grid")}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            View All {properties.length} Properties
          </button>
        </div>
      )}
    </div>
  );
};

export default PropertiesMapView;
