
import React, { useState, useEffect } from "react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/Footer";
import UnifiedPropertySearch, { SearchFilters } from "@/components/search/UnifiedPropertySearch";
import PropertyCard from "@/components/properties/PropertyCard";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PropertyAuthPrompt from "@/components/properties/PropertyAuthPrompt";
import { useProperties } from "@/hooks/useProperties";
import { useProgressiveLoading } from "@/hooks/useProgressiveLoading";
import { MapPin, SortAsc, ChevronDown, Search, Filter, Grid, List, Map } from "lucide-react";
import { designTokens } from "@/lib/design-tokens";

const EnhancedSearch = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    search: '',
    location: 'all',
    propertyType: 'all',
    priceRange: [0, 5000000],
    bedrooms: 'all',
    bathrooms: 'all',
    amenities: [],
    isVerified: false,
    isFeatured: false
  });
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: properties = [], isLoading } = useProperties({
    search: filters.search || undefined,
    location: filters.location !== 'all' ? filters.location : undefined,
    propertyType: filters.propertyType !== 'all' ? filters.propertyType : undefined,
    minPrice: filters.priceRange[0],
    maxPrice: filters.priceRange[1],
    bedrooms: filters.bedrooms !== 'all' ? filters.bedrooms : undefined,
    bathrooms: filters.bathrooms !== 'all' ? filters.bathrooms : undefined,
    isVerified: filters.isVerified,
    isFeatured: filters.isFeatured
  });

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };

  // Load filters from sessionStorage on component mount
  useEffect(() => {
    const savedFilters = sessionStorage.getItem('searchFilters');
    if (savedFilters) {
      try {
        const parsedFilters = JSON.parse(savedFilters);
        setFilters(parsedFilters);
        sessionStorage.removeItem('searchFilters');
      } catch (error) {
        console.error('Error parsing saved filters:', error);
      }
    }
  }, []);

  const sortedResults = React.useMemo(() => {
    return [...properties].sort((a, b) => {
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
  }, [properties, sortBy]);

  const {
    displayedItems: displayedProperties,
    hasMore,
    isLoading: isLoadingMore,
    loadMore,
    displayedCount,
    totalItems
  } = useProgressiveLoading({
    data: sortedResults,
    itemsPerPage: 6,
    initialLoad: 9
  });

  const quickStats = [
    { label: "Total Properties", value: totalItems, color: "text-blue-600" },
    { label: "Verified", value: properties.filter(p => p.is_verified).length, color: "text-green-600" },
    { label: "Featured", value: properties.filter(p => p.featured).length, color: "text-orange-600" },
    { label: "Areas", value: new Set(properties.map(p => p.location)).size, color: "text-purple-600" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-20">
        {/* Enhanced Header */}
        <section className="relative bg-gradient-to-br from-orange-50 via-white to-red-50 py-16 md:py-20">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 left-10 w-32 h-32 bg-orange-500 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-red-500 rounded-full blur-3xl" />
          </div>

          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto mb-12">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Advanced Property
                <span className="block bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Search & Discovery
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Use our powerful search tools to find your perfect home in Port Harcourt. 
                Filter by location, price, amenities, and more.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {quickStats.map((stat, index) => (
                <div 
                  key={index} 
                  className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                >
                  <div className={`text-2xl md:text-3xl font-bold ${stat.color} mb-1`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <PropertyAuthPrompt />
          
          {/* Enhanced Search Component */}
          <div className="mb-8">
            <UnifiedPropertySearch onFiltersChange={handleFiltersChange} />
          </div>

          {/* Enhanced Results Header */}
          <Card className="p-6 mb-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Search className="w-6 h-6 mr-3 text-orange-600" />
                  Search Results
                </h2>
                <p className="text-gray-600 mt-1">
                  {isLoading ? 'Searching properties...' : `Showing ${displayedCount} of ${totalItems} properties`}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <SortAsc className="w-4 h-4 text-gray-500" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white shadow-sm text-sm transition-all duration-200"
                  >
                    <option value="newest">Newest First</option>
                    <option value="featured">Featured First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>

                <div className="flex border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`px-4 py-2 text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                      viewMode === "grid"
                        ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-sm"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`px-4 py-2 text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                      viewMode === "list"
                        ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-sm"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <List className="w-4 h-4" />
                    List
                  </button>
                </div>
              </div>
            </div>
          </Card>

          {/* Results */}
          {isLoading ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-6 animate-spin">
                <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full"></div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Searching Properties</h3>
              <p className="text-gray-500">Finding the best matches for your criteria...</p>
            </div>
          ) : totalItems === 0 ? (
            <Card className="p-12 text-center border-0 shadow-lg">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full mb-6">
                <MapPin className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Start Your Property Search</h3>
              <p className="text-gray-500 mb-6">Use the advanced search above to find properties that match your criteria</p>
              <EnhancedButton 
                variant="primary" 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                <Filter className="w-4 h-4 mr-2" />
                Try Different Filters
              </EnhancedButton>
            </Card>
          ) : (
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
              
              {/* Progressive Loading Controls */}
              {hasMore && (
                <div className="flex justify-center mt-12">
                  <EnhancedButton
                    onClick={loadMore}
                    disabled={isLoadingMore}
                    variant="outline"
                    size="lg"
                    loading={isLoadingMore}
                    loadingText="Loading more properties..."
                    className="min-w-[200px]"
                  >
                    <ChevronDown className="w-4 h-4 mr-2" />
                    Load More Properties
                  </EnhancedButton>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EnhancedSearch;
