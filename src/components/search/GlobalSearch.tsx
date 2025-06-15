
import React, { useState } from "react";
import { Search, Filter, MapPin, Home } from "lucide-react";
import { useProperties } from "@/hooks/useProperties";
import { Button } from "@/components/ui/button";

interface GlobalSearchProps {
  onSearchResults?: (results: any[]) => void;
  showFilters?: boolean;
}

const GlobalSearch = ({ onSearchResults, showFilters = true }: GlobalSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: properties = [], isLoading } = useProperties({
    search: searchQuery,
    location: location !== "all" ? location : undefined,
    priceRange: priceRange !== "all" ? priceRange : undefined,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchResults) {
      onSearchResults(properties);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search properties, locations, or features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
            />
          </div>
          
          {showFilters && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          )}
          
          <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white px-8">
            Search
          </Button>
        </div>

        {showFilters && isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Location
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="all">All Locations</option>
                  <option value="GRA">GRA</option>
                  <option value="Trans Amadi">Trans Amadi</option>
                  <option value="Eliozu">Eliozu</option>
                  <option value="Rumuola">Rumuola</option>
                  <option value="Ada George">Ada George</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Home className="w-4 h-4 inline mr-1" />
                  Price Range
                </label>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="all">Any Price</option>
                  <option value="0-500000">Under ₦500k</option>
                  <option value="500000-1000000">₦500k - ₦1M</option>
                  <option value="1000000-2000000">₦1M - ₦2M</option>
                  <option value="2000000">Above ₦2M</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="mt-4 text-center text-gray-500">
            Searching properties...
          </div>
        )}

        {searchQuery && !isLoading && (
          <div className="mt-4 text-sm text-gray-600">
            Found {properties.length} properties matching "{searchQuery}"
          </div>
        )}
      </form>
    </div>
  );
};

export default GlobalSearch;
