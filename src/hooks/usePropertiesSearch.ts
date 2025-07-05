
import { useState, useEffect, useMemo } from 'react';
import { useProperties } from './useProperties';

interface SearchFilters {
  query: string;
  minPrice: number;
  maxPrice: number;
  bedrooms: string;
  bathrooms: string;
  propertyType: string;
  location: string;
}

export const usePropertiesSearch = () => {
  const { data: allProperties = [], isLoading, error } = useProperties();
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    minPrice: 0,
    maxPrice: 0,
    bedrooms: '',
    bathrooms: '',
    propertyType: '',
    location: ''
  });

  const filteredProperties = useMemo(() => {
    if (!allProperties) return [];

    return allProperties.filter((property) => {
      // Text search
      if (filters.query) {
        const searchTerm = filters.query.toLowerCase();
        const matchesQuery = 
          property.title?.toLowerCase().includes(searchTerm) ||
          property.location?.toLowerCase().includes(searchTerm) ||
          property.description?.toLowerCase().includes(searchTerm);
        if (!matchesQuery) return false;
      }

      // Price range
      if (filters.minPrice > 0 && property.price_per_year < filters.minPrice * 12) return false;
      if (filters.maxPrice > 0 && property.price_per_year > filters.maxPrice * 12) return false;

      // Bedrooms
      if (filters.bedrooms && filters.bedrooms !== 'any') {
        const bedroomCount = parseInt(filters.bedrooms);
        if (property.bedrooms !== bedroomCount) return false;
      }

      // Bathrooms
      if (filters.bathrooms && filters.bathrooms !== 'any') {
        const bathroomCount = parseInt(filters.bathrooms);
        if (property.bathrooms !== bathroomCount) return false;
      }

      // Property type
      if (filters.propertyType && filters.propertyType !== 'any') {
        if (property.property_type !== filters.propertyType) return false;
      }

      // Location
      if (filters.location) {
        const locationTerm = filters.location.toLowerCase();
        if (!property.location?.toLowerCase().includes(locationTerm)) return false;
      }

      return true;
    });
  }, [allProperties, filters]);

  const updateFilter = (key: keyof SearchFilters, value: string | number) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      minPrice: 0,
      maxPrice: 0,
      bedrooms: '',
      bathrooms: '',
      propertyType: '',
      location: ''
    });
  };

  return {
    properties: filteredProperties,
    filters,
    updateFilter,
    clearFilters,
    isLoading,
    error,
    totalCount: allProperties?.length || 0,
    filteredCount: filteredProperties.length
  };
};
