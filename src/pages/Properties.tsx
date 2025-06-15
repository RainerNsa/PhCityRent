
import React, { useState } from "react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/properties/PropertyCard";
import PropertyFilters from "@/components/properties/PropertyFilters";
import { useProperties } from "@/hooks/useProperties";
import { Home } from "lucide-react";

const Properties = () => {
  const [filters, setFilters] = useState({
    search: "",
    location: "all",
    priceRange: "all",
    bedrooms: "all",
  });

  const { data: properties = [], isLoading, error } = useProperties(filters);

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-4">Find Your Perfect Home</h1>
            <p className="text-xl opacity-90">Browse verified properties in Port Harcourt</p>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <PropertyFilters filters={filters} onFiltersChange={handleFilterChange} />

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              {isLoading ? "Loading..." : `Showing ${properties.length} properties`}
            </p>
          </div>

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">
                <Home className="w-16 h-16 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Error Loading Properties</h3>
                <p>Please try again later.</p>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200" />
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-gray-200 rounded" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Properties Grid */}
          {!isLoading && !error && properties.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}

          {/* No Results */}
          {!isLoading && !error && properties.length === 0 && (
            <div className="text-center py-12">
              <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-600 mb-2">No Properties Found</h3>
              <p className="text-gray-500">Try adjusting your search criteria to find more properties.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Properties;
