
import React from 'react';
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

interface PropertiesGridViewProps {
  properties: Property[];
  viewMode: "grid" | "list" | "map";
}

const PropertiesGridView = ({ properties, viewMode }: PropertiesGridViewProps) => {
  return (
    <div className={
      viewMode === "grid"
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        : "space-y-6"
    }>
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
};

export default PropertiesGridView;
