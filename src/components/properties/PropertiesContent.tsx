
import React from "react";
import PropertiesResultsHeader from "./PropertiesResultsHeader";
import PropertiesLoadingState from "./PropertiesLoadingState";
import PropertiesErrorState from "./PropertiesErrorState";
import PropertiesEmptyState from "./PropertiesEmptyState";
import PropertiesMapView from "./PropertiesMapView";
import LazyPropertyGrid from "@/components/performance/LazyPropertyGrid";
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
        <LazyPropertyGrid 
          properties={properties} 
          viewMode={viewMode}
          itemsPerPage={8}
          initialLoad={12}
        />
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
