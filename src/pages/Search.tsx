
import React, { useState } from "react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/Footer";
import AdvancedSearch from "@/components/search/AdvancedSearch";
import PropertyCard from "@/components/properties/PropertyCard";
import PropertyAuthPrompt from "@/components/properties/PropertyAuthPrompt";
import { MapPin, SortAsc } from "lucide-react";

const Search = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const handleSearchResults = (results: any[]) => {
    setSearchResults(results);
  };

  const sortedResults = [...searchResults].sort((a, b) => {
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
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-4">Advanced Property Search</h1>
            <p className="text-xl opacity-90">Find your perfect home in Port Harcourt with powerful search tools</p>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <PropertyAuthPrompt />
          
          {/* Search Component */}
          <div className="mb-8">
            <AdvancedSearch onSearchResults={handleSearchResults} />
          </div>

          {/* Results Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Search Results</h2>
              <p className="text-gray-600">
                {searchResults.length} properties found
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <SortAsc className="w-4 h-4 text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm"
                >
                  <option value="newest">Newest First</option>
                  <option value="featured">Featured First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>

              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-2 text-sm ${
                    viewMode === "grid"
                      ? "bg-orange-500 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-2 text-sm ${
                    viewMode === "list"
                      ? "bg-orange-500 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  List
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          {searchResults.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-600 mb-2">Start Your Property Search</h3>
              <p className="text-gray-500">Use the advanced search above to find properties that match your criteria</p>
            </div>
          ) : (
            <div className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                : "space-y-6"
            }>
              {sortedResults.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Search;
