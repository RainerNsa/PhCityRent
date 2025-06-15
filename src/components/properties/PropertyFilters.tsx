
import React from "react";
import { Search, Filter } from "lucide-react";

interface PropertyFiltersProps {
  filters: {
    search: string;
    location: string;
    priceRange: string;
    bedrooms: string;
  };
  onFiltersChange: (filters: {
    search: string;
    location: string;
    priceRange: string;
    bedrooms: string;
  }) => void;
}

const PropertyFilters = ({ filters, onFiltersChange }: PropertyFiltersProps) => {
  const handleInputChange = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search properties or locations..."
              value={filters.search}
              onChange={(e) => handleInputChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <select
          value={filters.location}
          onChange={(e) => handleInputChange('location', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          <option value="all">All Locations</option>
          <option value="GRA">GRA</option>
          <option value="Trans Amadi">Trans Amadi</option>
          <option value="Eliozu">Eliozu</option>
          <option value="Rumuola">Rumuola</option>
          <option value="Ada George">Ada George</option>
        </select>
        
        <select
          value={filters.priceRange}
          onChange={(e) => handleInputChange('priceRange', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          <option value="all">Any Price</option>
          <option value="0-500000">Under ₦500k</option>
          <option value="500000-1000000">₦500k - ₦1M</option>
          <option value="1000000-2000000">₦1M - ₦2M</option>
          <option value="2000000">Above ₦2M</option>
        </select>
        
        <select
          value={filters.bedrooms}
          onChange={(e) => handleInputChange('bedrooms', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          <option value="all">Any Bedrooms</option>
          <option value="1">1 Bedroom</option>
          <option value="2">2 Bedrooms</option>
          <option value="3">3 Bedrooms</option>
          <option value="4">4+ Bedrooms</option>
        </select>
      </div>
    </div>
  );
};

export default PropertyFilters;
