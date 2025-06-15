
import React from 'react';
import { SortAsc, Grid3X3, MapPin } from 'lucide-react';

interface PropertiesResultsHeaderProps {
  propertiesCount: number;
  isLoading: boolean;
  sortBy: string;
  setSortBy: (value: string) => void;
  viewMode: "grid" | "list" | "map";
  setViewMode: (value: "grid" | "list" | "map") => void;
}

const PropertiesResultsHeader = ({
  propertiesCount,
  isLoading,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode
}: PropertiesResultsHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Properties in Port Harcourt</h2>
        <p className="text-gray-600">
          {isLoading ? "Loading..." : `Showing ${propertiesCount} properties`}
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
            className={`px-3 py-2 text-sm flex items-center gap-1 ${
              viewMode === "grid"
                ? "bg-orange-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Grid3X3 className="w-4 h-4" />
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
          <button
            onClick={() => setViewMode("map")}
            className={`px-3 py-2 text-sm flex items-center gap-1 ${
              viewMode === "map"
                ? "bg-orange-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            <MapPin className="w-4 h-4" />
            Map
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertiesResultsHeader;
