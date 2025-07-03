import { useState, useEffect } from 'react';

interface UseProgressiveLoadingProps<T> {
  data: T[];
  itemsPerPage?: number;
  initialLoad?: number;
}

export const useProgressiveLoading = <T>({
  data,
  itemsPerPage = 6,
  initialLoad = 6
}: UseProgressiveLoadingProps<T>) => {
  const [displayedItems, setDisplayedItems] = useState<T[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Reset when data changes
  useEffect(() => {
    if (data.length > 0) {
      const initial = data.slice(0, initialLoad);
      setDisplayedItems(initial);
      setCurrentPage(1);
      setHasMore(data.length > initialLoad);
    } else {
      setDisplayedItems([]);
      setHasMore(false);
    }
  }, [data, initialLoad]);

  const loadMore = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    
    // Simulate loading delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300));

    const nextPage = currentPage + 1;
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const nextItems = data.slice(0, endIndex);

    setDisplayedItems(nextItems);
    setCurrentPage(nextPage);
    setHasMore(endIndex < data.length);
    setIsLoading(false);
  };

  const loadAll = () => {
    setDisplayedItems(data);
    setHasMore(false);
  };

  return {
    displayedItems,
    hasMore,
    isLoading,
    loadMore,
    loadAll,
    totalItems: data.length,
    displayedCount: displayedItems.length
  };
};