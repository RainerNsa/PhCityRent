
import { useState, useCallback } from 'react';

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

export const usePropertyComparison = () => {
  const [comparisonList, setComparisonList] = useState<Property[]>([]);
  const [isComparing, setIsComparing] = useState(false);

  const addToComparison = useCallback((property: Property) => {
    setComparisonList(prev => {
      if (prev.some(p => p.id === property.id)) {
        return prev; // Already in comparison
      }
      if (prev.length >= 3) {
        // Replace oldest with new property
        return [...prev.slice(1), property];
      }
      return [...prev, property];
    });
  }, []);

  const removeFromComparison = useCallback((propertyId: string) => {
    setComparisonList(prev => prev.filter(p => p.id !== propertyId));
  }, []);

  const clearComparison = useCallback(() => {
    setComparisonList([]);
    setIsComparing(false);
  }, []);

  const isInComparison = useCallback((propertyId: string) => {
    return comparisonList.some(p => p.id === propertyId);
  }, [comparisonList]);

  const startComparison = useCallback(() => {
    setIsComparing(true);
  }, []);

  const stopComparison = useCallback(() => {
    setIsComparing(false);
  }, []);

  return {
    comparisonList,
    isComparing,
    addToComparison,
    removeFromComparison,
    clearComparison,
    isInComparison,
    startComparison,
    stopComparison,
    comparisonCount: comparisonList.length,
  };
};
