
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X, Bell, Map } from 'lucide-react';
import { useProperties } from '@/hooks/useProperties';

interface EnhancedPropertySearchProps {
  onFiltersChange: (filters: any) => void;
  onSaveSearch?: (searchCriteria: any) => void;
  showMapToggle?: boolean;
  onMapToggle?: () => void;
}

const EnhancedPropertySearch = ({ 
  onFiltersChange, 
  onSaveSearch,
  showMapToggle = false,
  onMapToggle
}: EnhancedPropertySearchProps) => {
  const [filters, setFilters] = useState({
    search: '',
    location: 'all',
    propertyType: 'all',
    priceRange: [0, 5000000],
    bedrooms: 'all',
    bathrooms: 'all',
    amenities: [] as string[],
    isVerified: false,
    isFeatured: false
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const availableAmenities = [
    'Parking', 'Security', 'Generator', 'Water Supply', 'Internet',
    'Swimming Pool', 'Gym', 'Garden', 'Balcony', 'Air Conditioning'
  ];

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
    updateActiveFilters(newFilters);
  };

  const updateActiveFilters = (currentFilters: typeof filters) => {
    const active: string[] = [];
    
    if (currentFilters.search) active.push(`Search: ${currentFilters.search}`);
    if (currentFilters.location !== 'all') active.push(`Location: ${currentFilters.location}`);
    if (currentFilters.propertyType !== 'all') active.push(`Type: ${currentFilters.propertyType}`);
    if (currentFilters.bedrooms !== 'all') active.push(`Bedrooms: ${currentFilters.bedrooms}`);
    if (currentFilters.bathrooms !== 'all') active.push(`Bathrooms: ${currentFilters.bathrooms}`);
    if (currentFilters.priceRange[0] > 0 || currentFilters.priceRange[1] < 5000000) {
      active.push(`Price: ₦${currentFilters.priceRange[0].toLocaleString()}-₦${currentFilters.priceRange[1].toLocaleString()}`);
    }
    if (currentFilters.amenities.length > 0) active.push(`Amenities: ${currentFilters.amenities.length}`);
    if (currentFilters.isVerified) active.push('Verified Only');
    if (currentFilters.isFeatured) active.push('Featured Only');
    
    setActiveFilters(active);
  };

  const clearAllFilters = () => {
    const defaultFilters = {
      search: '',
      location: 'all',
      propertyType: 'all',
      priceRange: [0, 5000000],
      bedrooms: 'all',
      bathrooms: 'all',
      amenities: [],
      isVerified: false,
      isFeatured: false
    };
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
    setActiveFilters([]);
  };

  const handleAmenityToggle = (amenity: string) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter(a => a !== amenity)
      : [...filters.amenities, amenity];
    
    handleFilterChange('amenities', newAmenities);
  };

  const handleSaveSearch = () => {
    if (onSaveSearch) {
      onSaveSearch({
        ...filters,
        searchName: `Search ${new Date().toLocaleDateString()}`,
        alertFrequency: 'daily'
      });
    }
  };

  return (
    <Card className="p-6">
      {/* Basic Search */}
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by location, property type, or keywords..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="shrink-0"
          >
            <Filter className="w-4 h-4 mr-2" />
            Advanced
          </Button>
          {showMapToggle && (
            <Button variant="outline" onClick={onMapToggle}>
              <Map className="w-4 h-4 mr-2" />
              Map View
            </Button>
          )}
        </div>

        {/* Quick Filters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Select value={filters.location} onValueChange={(value) => handleFilterChange('location', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="GRA">GRA</SelectItem>
              <SelectItem value="Trans Amadi">Trans Amadi</SelectItem>
              <SelectItem value="Eliozu">Eliozu</SelectItem>
              <SelectItem value="Rumuola">Rumuola</SelectItem>
              <SelectItem value="Ada George">Ada George</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.propertyType} onValueChange={(value) => handleFilterChange('propertyType', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Property Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="house">House</SelectItem>
              <SelectItem value="duplex">Duplex</SelectItem>
              <SelectItem value="bungalow">Bungalow</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.bedrooms} onValueChange={(value) => handleFilterChange('bedrooms', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Bedrooms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Bedrooms</SelectItem>
              <SelectItem value="1">1 Bedroom</SelectItem>
              <SelectItem value="2">2 Bedrooms</SelectItem>
              <SelectItem value="3">3 Bedrooms</SelectItem>
              <SelectItem value="4">4+ Bedrooms</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.bathrooms} onValueChange={(value) => handleFilterChange('bathrooms', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Bathrooms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Bathrooms</SelectItem>
              <SelectItem value="1">1 Bathroom</SelectItem>
              <SelectItem value="2">2 Bathrooms</SelectItem>
              <SelectItem value="3">3+ Bathrooms</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="mt-6 pt-6 border-t space-y-6">
          {/* Price Range */}
          <div>
            <label className="text-sm font-medium mb-3 block">
              Price Range: ₦{filters.priceRange[0].toLocaleString()} - ₦{filters.priceRange[1].toLocaleString()} /year
            </label>
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => handleFilterChange('priceRange', value)}
              max={5000000}
              min={0}
              step={100000}
              className="w-full"
            />
          </div>

          {/* Amenities */}
          <div>
            <label className="text-sm font-medium mb-3 block">Amenities</label>
            <div className="flex flex-wrap gap-2">
              {availableAmenities.map((amenity) => (
                <Badge
                  key={amenity}
                  variant={filters.amenities.includes(amenity) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-orange-100"
                  onClick={() => handleAmenityToggle(amenity)}
                >
                  {amenity}
                </Badge>
              ))}
            </div>
          </div>

          {/* Special Filters */}
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.isVerified}
                onChange={(e) => handleFilterChange('isVerified', e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Verified Properties Only</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.isFeatured}
                onChange={(e) => handleFilterChange('isFeatured', e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Featured Properties Only</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button onClick={handleSaveSearch} variant="outline">
              <Bell className="w-4 h-4 mr-2" />
              Save Search
            </Button>
            <Button onClick={clearAllFilters} variant="outline">
              Clear All Filters
            </Button>
          </div>
        </div>
      )}

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600">Active filters:</span>
            {activeFilters.map((filter, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {filter}
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-red-500" 
                  onClick={() => {
                    // Handle individual filter removal
                    clearAllFilters();
                  }}
                />
              </Badge>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default EnhancedPropertySearch;
