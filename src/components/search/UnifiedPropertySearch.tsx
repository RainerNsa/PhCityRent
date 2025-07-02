import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Filter, X, MapPin, Home, Bed, Bath, DollarSign } from 'lucide-react';

export interface SearchFilters {
  search: string;
  location: string;
  propertyType: string;
  priceRange: [number, number];
  bedrooms: string;
  bathrooms: string;
  amenities: string[];
  isVerified: boolean;
  isFeatured: boolean;
}

interface UnifiedPropertySearchProps {
  onFiltersChange: (filters: SearchFilters) => void;
  onSearchResults?: (results: any[]) => void;
  showAdvanced?: boolean;
  compact?: boolean;
}

const UnifiedPropertySearch = ({ 
  onFiltersChange, 
  onSearchResults,
  showAdvanced = true,
  compact = false
}: UnifiedPropertySearchProps) => {
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

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

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
    "Swimming Pool", "Gym", "Security", "Generator", 
    "Air Conditioning", "Parking Space", "Garden", "Boys Quarters",
    "Internet", "Water Supply", "CCTV", "Fence"
  ];

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
    updateActiveFilters(newFilters);
  };

  const updateActiveFilters = (currentFilters: SearchFilters) => {
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
    const defaultFilters: SearchFilters = {
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

  const toggleAmenity = (amenity: string) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter(a => a !== amenity)
      : [...filters.amenities, amenity];
    
    handleFilterChange('amenities', newAmenities);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search logic will be handled by parent component through onFiltersChange
  };

  useEffect(() => {
    onFiltersChange(filters);
  }, []);

  if (compact) {
    return (
      <Card className="p-4">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search properties..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              Search
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Select value={filters.location} onValueChange={(value) => handleFilterChange('location', value)}>
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Areas</SelectItem>
                {portHarcourtAreas.map((area) => (
                  <SelectItem key={area} value={area}>{area}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.propertyType} onValueChange={(value) => handleFilterChange('propertyType', value)}>
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Type" />
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
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Bedrooms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any</SelectItem>
                <SelectItem value="1">1 Bedroom</SelectItem>
                <SelectItem value="2">2 Bedrooms</SelectItem>
                <SelectItem value="3">3 Bedrooms</SelectItem>
                <SelectItem value="4">4+ Bedrooms</SelectItem>
              </SelectContent>
            </Select>

            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="text-sm"
            >
              <Filter className="w-4 h-4 mr-1" />
              More
            </Button>
          </div>

          {showAdvancedFilters && (
            <div className="pt-4 border-t space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Price Range: ₦{filters.priceRange[0].toLocaleString()} - ₦{filters.priceRange[1].toLocaleString()}
                </label>
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) => handleFilterChange('priceRange', value as [number, number])}
                  max={5000000}
                  min={0}
                  step={100000}
                  className="w-full"
                />
              </div>
              
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={filters.isVerified}
                    onCheckedChange={(checked) => handleFilterChange('isVerified', checked)}
                  />
                  Verified Only
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={filters.isFeatured}
                    onCheckedChange={(checked) => handleFilterChange('isFeatured', checked)}
                  />
                  Featured
                </label>
              </div>
            </div>
          )}
        </form>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSearch} className="space-y-6">
        {/* Main Search Bar */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="Search properties, locations, or features in Port Harcourt..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-10 pr-4 py-3 text-lg"
            />
          </div>
          
          <div className="flex gap-2">
            {showAdvanced && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                {showAdvancedFilters ? 'Hide Filters' : 'Advanced Filters'}
              </Button>
            )}
            
            <Button type="submit" className="bg-primary hover:bg-primary/90 px-8">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Location
            </label>
            <Select value={filters.location} onValueChange={(value) => handleFilterChange('location', value)}>
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
            <label className="block text-sm font-medium text-foreground mb-2">
              <Home className="w-4 h-4 inline mr-1" />
              Property Type
            </label>
            <Select value={filters.propertyType} onValueChange={(value) => handleFilterChange('propertyType', value)}>
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
            <label className="block text-sm font-medium text-foreground mb-2">
              <Bed className="w-4 h-4 inline mr-1" />
              Bedrooms
            </label>
            <Select value={filters.bedrooms} onValueChange={(value) => handleFilterChange('bedrooms', value)}>
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
            <label className="block text-sm font-medium text-foreground mb-2">
              <Bath className="w-4 h-4 inline mr-1" />
              Bathrooms
            </label>
            <Select value={filters.bathrooms} onValueChange={(value) => handleFilterChange('bathrooms', value)}>
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

        {/* Advanced Filters */}
        {showAdvanced && showAdvancedFilters && (
          <div className="pt-6 border-t space-y-6">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                <DollarSign className="w-4 h-4 inline mr-1" />
                Price Range: ₦{filters.priceRange[0].toLocaleString()} - ₦{filters.priceRange[1].toLocaleString()} /year
              </label>
              <div className="px-3">
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) => handleFilterChange('priceRange', value as [number, number])}
                  max={5000000}
                  min={0}
                  step={100000}
                  className="w-full"
                />
              </div>
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Amenities</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {commonAmenities.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={amenity}
                      checked={filters.amenities.includes(amenity)}
                      onCheckedChange={() => toggleAmenity(amenity)}
                    />
                    <label htmlFor={amenity} className="text-sm text-foreground cursor-pointer">
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
                  onCheckedChange={(checked) => handleFilterChange('isVerified', checked)}
                />
                <label htmlFor="verified" className="text-sm text-foreground cursor-pointer">
                  Verified Properties Only
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={filters.isFeatured}
                  onCheckedChange={(checked) => handleFilterChange('isFeatured', checked)}
                />
                <label htmlFor="featured" className="text-sm text-foreground cursor-pointer">
                  Featured Properties
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="button" onClick={clearAllFilters} variant="outline">
                Clear All Filters
              </Button>
            </div>
          </div>
        )}

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="pt-4 border-t">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {activeFilters.map((filter, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {filter}
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-destructive" 
                    onClick={clearAllFilters}
                  />
                </Badge>
              ))}
            </div>
          </div>
        )}
      </form>
    </Card>
  );
};

export default UnifiedPropertySearch;