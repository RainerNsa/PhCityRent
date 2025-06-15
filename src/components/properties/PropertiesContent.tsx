
import React from "react";
import PropertiesResultsHeader from "./PropertiesResultsHeader";
import PropertiesLoadingState from "./PropertiesLoadingState";
import PropertiesErrorState from "./PropertiesErrorState";
import PropertiesEmptyState from "./PropertiesEmptyState";
import PropertiesMapView from "./PropertiesMapView";
import PropertyCard from "./PropertyCard";
import AuthPrompt from "@/components/auth/AuthPrompt";

interface PropertiesContentProps {
  properties: any[];
  isLoading: boolean;
  error: any;
  sortBy: string;
  setSortBy: (value: string) => void;
  viewMode: "grid" | "list" | "map";
  setViewMode: (value: "grid" | "list" | "map") => void;
  onPropertySelect: (property: any) => void;
  user: any;
  isInComparison: (propertyId: string) => boolean;
  onAddToComparison: (property: any) => void;
  onRemoveFromComparison: (propertyId: string) => void;
}

const PropertiesContent = ({
  properties,
  isLoading,
  error,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  onPropertySelect,
  user,
  isInComparison,
  onAddToComparison,
  onRemoveFromComparison
}: PropertiesContentProps) => {
  return (
    <>
      {/* Results Header */}
      <PropertiesResultsHeader
        propertiesCount={properties.length}
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
          properties={properties}
          onPropertySelect={onPropertySelect}
          setViewMode={setViewMode}
        />
      )}

      {/* Grid/List View */}
      {!isLoading && !error && viewMode !== "map" && properties.length > 0 && (
        <div className={
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            : "space-y-6"
        }>
          {properties.map((property) => (
            <PropertyCard 
              key={property.id} 
              property={property}
              showCompareButton={true}
              isInComparison={isInComparison(property.id)}
              onAddToComparison={onAddToComparison}
              onRemoveFromComparison={onRemoveFromComparison}
            />
          ))}
        </div>
      )}

      {/* No Results */}
      {!isLoading && !error && properties.length === 0 && (
        <PropertiesEmptyState />
      )}

      {/* Auth Prompt for Non-Users at Bottom */}
      {!user && properties.length > 0 && (
        <div className="mt-12">
          <AuthPrompt />
        </div>
      )}
    </>
  );
};

export default PropertiesContent;
