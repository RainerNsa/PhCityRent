
import React, { useState } from "react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/Footer";
import AdvancedSearch from "@/components/search/AdvancedSearch";
import AuthPrompt from "@/components/auth/AuthPrompt";
import PropertiesHeader from "@/components/properties/PropertiesHeader";
import PropertiesResultsHeader from "@/components/properties/PropertiesResultsHeader";
import PropertiesLoadingState from "@/components/properties/PropertiesLoadingState";
import PropertiesErrorState from "@/components/properties/PropertiesErrorState";
import PropertiesEmptyState from "@/components/properties/PropertiesEmptyState";
import PropertiesMapView from "@/components/properties/PropertiesMapView";
import PropertyCard from "@/components/properties/PropertyCard";
import PropertyComparison from "@/components/properties/PropertyComparison";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Compare, X } from "lucide-react";
import { useProperties } from "@/hooks/useProperties";
import { useAuth } from "@/hooks/useAuth";
import { usePropertyComparison } from "@/hooks/usePropertyComparison";

const Properties = () => {
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
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20">
        <PropertiesHeader />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Authentication Prompt for Non-Users */}
          {!user && (
            <div className="mb-8">
              <AuthPrompt 
                variant="compact"
                title="Get the Full Experience"
                description="Sign up to save properties, get alerts, and contact agents directly"
              />
            </div>
          )}
          
          <div className="mb-8">
            <AdvancedSearch onFiltersChange={handleFilterChange} />
          </div>

          {/* Comparison Bar */}
          {comparisonCount > 0 && (
            <div className="mb-6 bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Compare className="w-5 h-5 text-orange-600" />
                  <span className="font-medium">
                    {comparisonCount} {comparisonCount === 1 ? 'property' : 'properties'} selected for comparison
                  </span>
                  <Badge variant="secondary">{comparisonCount}/3</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    onClick={isComparing ? stopComparison : startComparison}
                    variant={isComparing ? "default" : "outline"}
                  >
                    {isComparing ? 'Hide Comparison' : 'Compare Now'}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={clearComparison}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Comparison View */}
          {isComparing && (
            <div className="mb-8">
              <PropertyComparison
                properties={comparisonList}
                onRemoveProperty={removeFromComparison}
                onClose={stopComparison}
              />
            </div>
          )}

          {/* Results Header */}
          <PropertiesResultsHeader
            propertiesCount={sortedProperties.length}
            isLoading={isLoading}
            sortBy={sortBy}
            setSortBy={setSortBy}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />

          {/* Error State */}
          {error && <PropertiesErrorState />}

          {/* Loading State */}
          {isLoading && <PropertiesLoadingState />}

          {/* Map View */}
          {!isLoading && !error && viewMode === "map" && (
            <PropertiesMapView
              properties={sortedProperties}
              onPropertySelect={handlePropertySelect}
              setViewMode={setViewMode}
            />
          )}

          {/* Grid/List View */}
          {!isLoading && !error && viewMode !== "map" && sortedProperties.length > 0 && (
            <div className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                : "space-y-6"
            }>
              {sortedProperties.map((property) => (
                <PropertyCard 
                  key={property.id} 
                  property={property}
                  showCompareButton={true}
                  isInComparison={isInComparison(property.id)}
                  onAddToComparison={addToComparison}
                  onRemoveFromComparison={removeFromComparison}
                />
              ))}
            </div>
          )}

          {/* No Results */}
          {!isLoading && !error && sortedProperties.length === 0 && (
            <PropertiesEmptyState />
          )}

          {/* Auth Prompt for Non-Users at Bottom */}
          {!user && sortedProperties.length > 0 && (
            <div className="mt-12">
              <AuthPrompt />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Properties;
