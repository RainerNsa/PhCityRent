
import React from 'react';
import { Search, Filter, MapPin, Bed, Bath, Home, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePropertiesSearch } from '@/hooks/usePropertiesSearch';
import { Badge } from '@/components/ui/badge';

const WorkingPropertiesSearch = () => {
  const { 
    properties, 
    filters, 
    updateFilter, 
    clearFilters, 
    isLoading, 
    totalCount, 
    filteredCount 
  } = usePropertiesSearch();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== '' && value !== 0
  ).length;

  return (
    <div className="space-y-8">
      {/* Search Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-6">Find Your Perfect Home</h1>
        
        {/* Main Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search by title, location, or description..."
            value={filters.query}
            onChange={(e) => updateFilter('query', e.target.value)}
            className="pl-12 py-4 text-lg bg-white border-0 rounded-xl shadow-lg"
          />
        </div>

        {/* Filter Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/90">Min Price (Monthly)</label>
            <Input
              type="number"
              placeholder="Min price"
              value={filters.minPrice || ''}
              onChange={(e) => updateFilter('minPrice', parseInt(e.target.value) || 0)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/90">Max Price (Monthly)</label>
            <Input
              type="number"
              placeholder="Max price"
              value={filters.maxPrice || ''}
              onChange={(e) => updateFilter('maxPrice', parseInt(e.target.value) || 0)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/90">Bedrooms</label>
            <Select value={filters.bedrooms} onValueChange={(value) => updateFilter('bedrooms', value)}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="1">1 Bedroom</SelectItem>
                <SelectItem value="2">2 Bedrooms</SelectItem>
                <SelectItem value="3">3 Bedrooms</SelectItem>
                <SelectItem value="4">4+ Bedrooms</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/90">Bathrooms</label>
            <Select value={filters.bathrooms} onValueChange={(value) => updateFilter('bathrooms', value)}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="1">1 Bathroom</SelectItem>
                <SelectItem value="2">2 Bathrooms</SelectItem>
                <SelectItem value="3">3+ Bathrooms</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/90">Property Type</label>
            <Select value={filters.propertyType} onValueChange={(value) => updateFilter('propertyType', value)}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Type</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="duplex">Duplex</SelectItem>
                <SelectItem value="bungalow">Bungalow</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/90">Location</label>
            <Input
              placeholder="Enter location"
              value={filters.location}
              onChange={(e) => updateFilter('location', e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
            />
          </div>
        </div>

        {/* Active Filters & Clear */}
        {activeFiltersCount > 0 && (
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-1 text-sm">
              <Filter className="w-4 h-4" />
              <span>{activeFiltersCount} filters active</span>
            </div>
            <Button 
              onClick={clearFilters}
              variant="outline"
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <X className="w-4 h-4 mr-1" />
              Clear All
            </Button>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isLoading ? 'Loading...' : `${filteredCount} Properties Found`}
          </h2>
          <p className="text-gray-600">
            {!isLoading && `Showing ${filteredCount} of ${totalCount} total properties`}
          </p>
        </div>
      </div>

      {/* Results Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-video bg-gray-200 animate-pulse" />
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="h-6 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-16">
          <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Properties Found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search criteria to find more properties.</p>
          <Button onClick={clearFilters} variant="outline">
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card key={property.id} className="overflow-hidden hover:shadow-xl transition-shadow group">
              <div className="aspect-video bg-gradient-to-r from-gray-200 to-gray-300 relative overflow-hidden">
                {property.images && property.images.length > 0 ? (
                  <img 
                    src={property.images[0]} 
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Home className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                {property.featured && (
                  <Badge className="absolute top-4 left-4 bg-orange-500 text-white">
                    Featured
                  </Badge>
                )}
              </div>
              
              <CardContent className="p-6">
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                    {property.title}
                  </h3>
                  
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="text-sm">{property.location}</span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Bed className="w-4 h-4 mr-1" />
                      <span>{property.bedrooms} bed</span>
                    </div>
                    <div className="flex items-center">
                      <Bath className="w-4 h-4 mr-1" />
                      <span>{property.bathrooms} bath</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-orange-600">
                        {formatPrice(property.price_per_year / 12)}
                      </p>
                      <p className="text-sm text-gray-500">per month</p>
                    </div>
                    <Button 
                      onClick={() => window.location.href = `/properties/${property.id}`}
                      className="bg-orange-500 hover:bg-orange-600"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkingPropertiesSearch;
