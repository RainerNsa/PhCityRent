import { useMemo } from 'react';
import { useProperties } from './useProperties';

interface UseOptimizedPropertiesParams {
  search?: string;
  location?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: string;
  bathrooms?: string;
  isVerified?: boolean;
  isFeatured?: boolean;
}

export const useOptimizedProperties = (params: UseOptimizedPropertiesParams) => {
  // Use debounced search to avoid too many API calls
  const debouncedParams = useMemo(() => {
    const timer = setTimeout(() => params, 300);
    return () => clearTimeout(timer);
  }, [JSON.stringify(params)]);

  const { data: properties = [], isLoading, error } = useProperties({
    search: params.search?.length >= 2 ? params.search : undefined,
    location: params.location !== 'all' ? params.location : undefined,
    propertyType: params.propertyType !== 'all' ? params.propertyType : undefined,
    minPrice: params.minPrice,
    maxPrice: params.maxPrice,
    bedrooms: params.bedrooms !== 'all' ? params.bedrooms : undefined,
    bathrooms: params.bathrooms !== 'all' ? params.bathrooms : undefined,
    isVerified: params.isVerified,
    isFeatured: params.isFeatured
  });

  // Memoize filtered results to avoid recalculation
  const filteredProperties = useMemo(() => {
    return properties.filter(property => {
      // Client-side filters for immediate feedback
      if (params.search && params.search.length < 2) {
        const searchLower = params.search.toLowerCase();
        const matchesSearch = 
          property.title.toLowerCase().includes(searchLower) ||
          property.location.toLowerCase().includes(searchLower) ||
          property.description?.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }

      return true;
    });
  }, [properties, params.search]);

  return {
    data: filteredProperties,
    isLoading,
    error,
    count: filteredProperties.length
  };
};