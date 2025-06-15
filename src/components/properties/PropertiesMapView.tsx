
import React, { useState } from 'react';
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
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property);
    onPropertySelect(property);
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Map with selected property highlighting */}
      <div className="relative">
        <PropertyMap 
          properties={properties} 
          onPropertySelect={handlePropertySelect}
          selectedProperty={selectedProperty}
          height="600px"
        />
        
        {/* Map controls */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-md border p-2">
          <button
            onClick={() => setViewMode("grid")}
            className="px-3 py-1 text-sm bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
          >
            Grid View
          </button>
        </div>
      </div>

      {/* Selected Property Details */}
      {selectedProperty && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Selected Property</h3>
            <button
              onClick={() => setSelectedProperty(null)}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
              ×
            </button>
          </div>
          <PropertyCard property={selectedProperty} />
        </div>
      )}
      
      {/* Properties grid below map */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">All Properties</h3>
          <div className="text-sm text-gray-600">
            {properties.length} properties found
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.slice(0, 6).map((property) => (
            <div
              key={property.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedProperty?.id === property.id 
                  ? 'ring-2 ring-orange-500 shadow-lg' 
                  : ''
              }`}
              onClick={() => handlePropertySelect(property)}
            >
              <PropertyCard property={property} />
            </div>
          ))}
        </div>
        
        {properties.length > 6 && (
          <div className="text-center">
            <button
              onClick={() => setViewMode("grid")}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              View All {properties.length} Properties
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertiesMapView;
