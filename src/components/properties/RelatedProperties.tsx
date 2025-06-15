
import React from "react";
import { useProperties } from "@/hooks/useProperties";
import PropertyCard from "./PropertyCard";
import { Database } from "@/integrations/supabase/types";

type Property = Database['public']['Tables']['properties']['Row'];

interface RelatedPropertiesProps {
  currentProperty: Property;
}

const RelatedProperties = ({ currentProperty }: RelatedPropertiesProps) => {
  const { data: allProperties = [] } = useProperties();

  // Filter related properties based on location or property type
  const relatedProperties = allProperties
    .filter(property => 
      property.id !== currentProperty.id && // Exclude current property
      (
        property.location.toLowerCase().includes(currentProperty.location.split(',')[0].toLowerCase()) || // Same area
        property.property_type === currentProperty.property_type || // Same type
        Math.abs(property.price_per_year - currentProperty.price_per_year) < 300000 // Similar price range
      )
    )
    .slice(0, 3); // Limit to 3 properties

  if (relatedProperties.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-semibold text-gray-900 mb-6">Related Properties</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedProperties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
};

export default RelatedProperties;
