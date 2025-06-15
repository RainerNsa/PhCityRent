
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
import PropertiesGridView from "@/components/properties/PropertiesGridView";
import { useProperties } from "@/hooks/useProperties";
import { useAuth } from "@/hooks/useAuth";

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
            <PropertiesGridView
              properties={sortedProperties}
              viewMode={viewMode}
            />
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
