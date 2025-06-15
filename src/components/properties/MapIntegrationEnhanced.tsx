
import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import PropertyMap from './PropertyMap';
import PropertyCard from './PropertyCard';
import { Search, Filter, List, Map, Layers } from 'lucide-react';

interface Property {
  id: string;
  title: string;
  location: string;
  price_per_year: number;
  bedrooms: number;
  bathrooms: number;
  area_sqft?: number;
  images?: string[];
  featured?: boolean;
  is_verified?: boolean;
}

interface MapIntegrationEnhancedProps {
  properties: Property[];
  onPropertySelect?: (property: Property) => void;
  filters?: any;
  onFiltersChange?: (filters: any) => void;
}

const MapIntegrationEnhanced = ({ 
  properties, 
  onPropertySelect, 
  filters,
  onFiltersChange 
}: MapIntegrationEnhancedProps) => {
  const [viewMode, setViewMode] = useState<'map' | 'list' | 'split'>('split');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [mapBounds, setMapBounds] = useState<any>(null);
  const [visibleProperties, setVisibleProperties] = useState<Property[]>(properties);
  const [searchLocation, setSearchLocation] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setVisibleProperties(properties);
  }, [properties]);

  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property);
    if (onPropertySelect) {
      onPropertySelect(property);
    }
  };

  const handleLocationSearch = () => {
    if (searchLocation) {
      const filtered = properties.filter(prop => 
        prop.location.toLowerCase().includes(searchLocation.toLowerCase()) ||
        prop.title.toLowerCase().includes(searchLocation.toLowerCase())
      );
      setVisibleProperties(filtered);
    } else {
      setVisibleProperties(properties);
    }
  };

  const getViewModeButton = (mode: typeof viewMode, icon: React.ReactNode, label: string) => (
    <Button
      variant={viewMode === mode ? "default" : "outline"}
      size="sm"
      onClick={() => setViewMode(mode)}
      className="flex items-center gap-2"
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </Button>
  );

  return (
    <div className="space-y-4">
      {/* Controls Header */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by location or property name..."
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLocationSearch()}
                className="pl-10"
              />
            </div>
            <Button onClick={handleLocationSearch} size="sm">Search</Button>
          </div>

          {/* View Mode Controls */}
          <div className="flex gap-2">
            {getViewModeButton('map', <Map className="w-4 h-4" />, 'Map')}
            {getViewModeButton('list', <List className="w-4 h-4" />, 'List')}
            {getViewModeButton('split', <Layers className="w-4 h-4" />, 'Split')}
          </div>

          {/* Filters Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Results Summary */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>{visibleProperties.length} properties found</span>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{visibleProperties.filter(p => p.featured).length} Featured</Badge>
            <Badge variant="outline">{visibleProperties.filter(p => p.is_verified).length} Verified</Badge>
          </div>
        </div>
      </Card>

      {/* Selected Property Details */}
      {selectedProperty && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Selected Property</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSelectedProperty(null)}
            >
              ×
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <PropertyCard property={selectedProperty} />
            <div className="md:col-span-2 space-y-2">
              <h4 className="font-medium">{selectedProperty.title}</h4>
              <p className="text-gray-600">{selectedProperty.location}</p>
              <p className="text-lg font-bold text-orange-500">
                ₦{selectedProperty.price_per_year.toLocaleString()}/year
              </p>
              <div className="flex gap-4 text-sm text-gray-600">
                <span>{selectedProperty.bedrooms} bedrooms</span>
                <span>{selectedProperty.bathrooms} bathrooms</span>
                {selectedProperty.area_sqft && (
                  <span>{selectedProperty.area_sqft} sqft</span>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Main Content Area */}
      <div className={`grid gap-4 ${
        viewMode === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'
      }`}>
        {/* Map View */}
        {(viewMode === 'map' || viewMode === 'split') && (
          <Card className="overflow-hidden">
            <PropertyMap 
              properties={visibleProperties}
              onPropertySelect={handlePropertySelect}
              height={viewMode === 'split' ? '500px' : '600px'}
            />
          </Card>
        )}

        {/* List View */}
        {(viewMode === 'list' || viewMode === 'split') && (
          <div className="space-y-4">
            {visibleProperties.length === 0 ? (
              <Card className="p-8 text-center">
                <Map className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Properties Found</h3>
                <p className="text-gray-600">Try adjusting your search criteria or location</p>
              </Card>
            ) : (
              <div className={`grid gap-4 ${
                viewMode === 'list' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
              }`}>
                {visibleProperties.slice(0, viewMode === 'split' ? 6 : 12).map((property) => (
                  <div
                    key={property.id}
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      selectedProperty?.id === property.id 
                        ? 'ring-2 ring-orange-500' 
                        : ''
                    }`}
                    onClick={() => handlePropertySelect(property)}
                  >
                    <PropertyCard property={property} />
                  </div>
                ))}
              </div>
            )}

            {/* Load More Button */}
            {visibleProperties.length > (viewMode === 'split' ? 6 : 12) && (
              <div className="text-center">
                <Button variant="outline">
                  Load More Properties ({visibleProperties.length - (viewMode === 'split' ? 6 : 12)} remaining)
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Map Legend */}
      {(viewMode === 'map' || viewMode === 'split') && (
        <Card className="p-4">
          <h4 className="font-medium mb-3">Map Legend</h4>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
              <span>Available Properties</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span>Verified Properties</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              <span>Featured Properties</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
              <span>Selected Property</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default MapIntegrationEnhanced;
