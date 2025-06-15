
import React, { useState } from "react";
import { useProperties } from "@/hooks/useProperties";
import { useAuth } from "@/hooks/useAuth";
import { usePropertyComparison } from "@/hooks/usePropertyComparison";
import PropertiesFilters from "./PropertiesFilters";
import PropertiesContent from "./PropertiesContent";
import PropertiesComparison from "./PropertiesComparison";

const PropertiesContainer = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    search: "",
    location: "all",
    priceRange: [0, 2000000],
    bedrooms: "all",
    propertyType: "all"
  });
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list" | "map">("grid");

  const {
    comparisonList,
    isComparing,
    addToComparison,
    removeFromComparison,
    clearComparison,
    isInComparison,
    startComparison,
    stopComparison,
    comparisonCount
  } = usePropertyComparison();

  const { data: properties = [], isLoading, error } = useProperties({
    search: filters.search,
    location: filters.location !== "all" ? filters.location : undefined,
    propertyType: filters.propertyType !== "all" ? filters.propertyType : undefined,
    minPrice: filters.priceRange[0],
    maxPrice: filters.priceRange[1],
    bedrooms: filters.bedrooms !== "all" ? filters.bedrooms : undefined,
  });

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const handlePropertySelect = (property: any) => {
    window.location.href = `/properties/${property.id}`;
  };

  const sortedProperties = [...properties].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price_per_year - b.price_per_year;
      case "price-high":
        return b.price_per_year - a.price_per_year;
      case "newest":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case "featured":
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      default:
        return 0;
    }
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <PropertiesFilters 
        onFiltersChange={handleFilterChange}
        user={user}
      />

      <PropertiesComparison
        comparisonCount={comparisonCount}
        isComparing={isComparing}
        comparisonList={comparisonList}
        onStartComparison={startComparison}
        onStopComparison={stopComparison}
        onClearComparison={clearComparison}
        onRemoveFromComparison={removeFromComparison}
      />

      <PropertiesContent
        properties={sortedProperties}
        isLoading={isLoading}
        error={error}
        sortBy={sortBy}
        setSortBy={setSortBy}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onPropertySelect={handlePropertySelect}
        user={user}
        isInComparison={isInComparison}
        onAddToComparison={addToComparison}
        onRemoveFromComparison={removeFromComparison}
      />
    </div>
  );
};

export default PropertiesContainer;
