import React, { useState, useEffect, useRef } from 'react';
import PropertyCard from '@/components/properties/PropertyCard';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';

type Property = Database['public']['Tables']['properties']['Row'];

interface LazyPropertyGridProps {
  properties: Property[];
  viewMode?: 'grid' | 'list';
  itemsPerPage?: number;
  initialLoad?: number;
}

const LazyPropertyGrid: React.FC<LazyPropertyGridProps> = ({
  properties,
  viewMode = 'grid',
  itemsPerPage = 6,
  initialLoad = 9
}) => {
  const [displayedCount, setDisplayedCount] = useState(initialLoad);
  const [isLoading, setIsLoading] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const displayedProperties = properties.slice(0, displayedCount);
  const hasMore = displayedCount < properties.length;

  // Intersection Observer for auto-loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoading]);

  const loadMore = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    
    // Simulate loading delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setDisplayedCount(prev => Math.min(prev + itemsPerPage, properties.length));
    setIsLoading(false);
  };

  // Reset when properties change
  useEffect(() => {
    setDisplayedCount(initialLoad);
  }, [properties.length, initialLoad]);

  return (
    <>
      <div className={
        viewMode === "grid"
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          : "space-y-6"
      }>
        {displayedProperties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
      
      {/* Loading indicator and manual load more */}
      {hasMore && (
        <div ref={loadMoreRef} className="flex justify-center mt-12">
          <Button
            onClick={loadMore}
            disabled={isLoading}
            variant="outline"
            size="lg"
            className="min-w-[200px]"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                Loading more...
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-2" />
                Load More Properties ({properties.length - displayedCount} remaining)
              </>
            )}
          </Button>
        </div>
      )}
      
      {/* Results summary */}
      <div className="text-center mt-8 text-sm text-gray-600">
        Showing {displayedProperties.length} of {properties.length} properties
      </div>
    </>
  );
};

export default LazyPropertyGrid;