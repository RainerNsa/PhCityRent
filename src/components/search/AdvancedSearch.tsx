
import React, { useState } from "react";
import { Search, Filter, MapPin, Home, Bed, Bath, DollarSign, Map } from "lucide-react";
import { useProperties } from "@/hooks/useProperties";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

interface AdvancedSearchProps {
  onSearchResults?: (results: any[]) => void;
  onFiltersChange?: (filters: any) => void;
}

const AdvancedSearch = ({ onSearchResults, onFiltersChange }: AdvancedSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    location: "all",
    propertyType: "all",
    priceRange: [0, 2000000],
    bedrooms: "all",
    bathrooms: "all",
    amenities: [] as string[],
    isVerified: false,
    isFeatured: false
  });
  const [showMap, setShowMap] = useState(false);

  const { data: properties = [], isLoading } = useProperties({
    search: searchQuery,
    location: filters.location !== "all" ? filters.location : undefined,
    propertyType: filters.propertyType !== "all" ? filters.propertyType : undefined,
    minPrice: filters.priceRange[0],
    maxPrice: filters.priceRange[1],
    bedrooms: filters.bedrooms !== "all" ? filters.bedrooms : undefined,
    bathrooms: filters.bathrooms !== "all" ? filters.bathrooms : undefined,
    isVerified: filters.isVerified,
    isFeatured: filters.isFeatured
  });

  const portHarcourtAreas = [
    "Old Government Residential Area (Old GRA)",
    "New Government Residential Area (New GRA)", 
    "Trans Amadi",
    "D-Line",
    "Eliozu",
    "Rumuola",
    "Ada George",
    "Mile 3",
    "Rumuokoro",
    "Woji",
    "Choba",
    "Alakahia"
  ];

  const commonAmenities = [
    "Swimming Pool",
    "Gym",
    "Security",
    "Generator",
    "Air Conditioning",
    "Parking Space",
    "Garden",
    "Boys Quarters"
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchResults) {
      onSearchResults(properties);
    }
    if (onFiltersChange) {
      onFiltersChange({ search: searchQuery, ...filters });
    }
  };

  const updateFilter = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    if (onFiltersChange) {
      onFiltersChange({ search: searchQuery, ...newFilters });
    }
  };

  const toggleAmenity = (amenity: string) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter(a => a !== amenity)
      : [...filters.amenities, amenity];
    updateFilter('amenities', newAmenities);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-lg p-6">
        {/* Main Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search properties, locations, or features in Port Harcourt..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg border-2 border-gray-200 focus:border-orange-500"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowMap(!showMap)}
              className="flex items-center gap-2"
            >
              <Map className="w-4 h-4" />
              {showMap ? 'Hide Map' : 'Show Map'}
            </Button>
            
            <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white px-8">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Location in Port Harcourt
            </label>
            <Select value={filters.location} onValueChange={(value) => updateFilter('location', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Areas</SelectItem>
                {portHarcourtAreas.map((area) => (
                  <SelectItem key={area} value={area}>{area}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Home className="w-4 h-4 inline mr-1" />
              Property Type
            </label>
            <Select value={filters.propertyType} onValueChange={(value) => updateFilter('propertyType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="duplex">Duplex</SelectItem>
                <SelectItem value="bungalow">Bungalow</SelectItem>
                <SelectItem value="studio">Studio</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Bed className="w-4 h-4 inline mr-1" />
              Bedrooms
            </label>
            <Select value={filters.bedrooms} onValueChange={(value) => updateFilter('bedrooms', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any</SelectItem>
                <SelectItem value="1">1 Bedroom</SelectItem>
                <SelectItem value="2">2 Bedrooms</SelectItem>
                <SelectItem value="3">3 Bedrooms</SelectItem>
                <SelectItem value="4">4 Bedrooms</SelectItem>
                <SelectItem value="5">5+ Bedrooms</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Bath className="w-4 h-4 inline mr-1" />
              Bathrooms
            </label>
            <Select value={filters.bathrooms} onValueChange={(value) => updateFilter('bathrooms', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any</SelectItem>
                <SelectItem value="1">1 Bathroom</SelectItem>
                <SelectItem value="2">2 Bathrooms</SelectItem>
                <SelectItem value="3">3 Bathrooms</SelectItem>
                <SelectItem value="4">4+ Bathrooms</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <DollarSign className="w-4 h-4 inline mr-1" />
            Price Range (₦ per year)
          </label>
          <div className="px-3">
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => updateFilter('priceRange', value)}
              max={3000000}
              min={200000}
              step={50000}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-1">
              <span>₦{filters.priceRange[0].toLocaleString()}</span>
              <span>₦{filters.priceRange[1].toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Amenities
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {commonAmenities.map((amenity) => (
              <div key={amenity} className="flex items-center space-x-2">
                <Checkbox
                  id={amenity}
                  checked={filters.amenities.includes(amenity)}
                  onCheckedChange={() => toggleAmenity(amenity)}
                />
                <label htmlFor={amenity} className="text-sm text-gray-700">
                  {amenity}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Property Status */}
        <div className="flex gap-6">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="verified"
              checked={filters.isVerified}
              onCheckedChange={(checked) => updateFilter('isVerified', checked)}
            />
            <label htmlFor="verified" className="text-sm text-gray-700">
              Verified Properties Only
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={filters.isFeatured}
              onCheckedChange={(checked) => updateFilter('isFeatured', checked)}
            />
            <label htmlFor="featured" className="text-sm text-gray-700">
              Featured Properties
            </label>
          </div>
        </div>

        {isLoading && (
          <div className="mt-4 text-center text-gray-500">
            Searching properties...
          </div>
        )}

        {searchQuery && !isLoading && (
          <div className="mt-4 text-sm text-gray-600">
            Found {properties.length} properties matching your criteria
          </div>
        )}
      </form>

      {/* Map Placeholder */}
      {showMap && (
        <div className="mt-6 bg-gray-100 rounded-2xl p-8 text-center">
          <Map className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Map View Coming Soon</h3>
          <p className="text-gray-500">Interactive map showing property locations in Port Harcourt</p>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;
