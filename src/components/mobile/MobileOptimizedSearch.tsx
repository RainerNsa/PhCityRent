
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Search, Filter, MapPin, SlidersHorizontal } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileOptimizedSearchProps {
  onSearch?: (filters: any) => void;
}

const MobileOptimizedSearch = ({ onSearch }: MobileOptimizedSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    priceRange: [0, 2000000],
    bedrooms: '',
    propertyType: ''
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const isMobile = useIsMobile();

  const activeFiltersCount = Object.values(filters).filter(value => 
    value && value !== '' && !(Array.isArray(value) && value.every(v => v === 0 || v === 2000000))
  ).length;

  const handleSearch = () => {
    onSearch?.({ search: searchQuery, ...filters });
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      priceRange: [0, 2000000],
      bedrooms: '',
      propertyType: ''
    });
  };

  if (!isMobile) return null;

  return (
    <Card className="md:hidden">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search properties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4"
            />
          </div>

          {/* Quick Location Tags */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {['Victoria Island', 'Lekki', 'Ikoyi', 'Yaba', 'Surulere'].map((location) => (
              <Badge
                key={location}
                variant="outline"
                className="whitespace-nowrap cursor-pointer hover:bg-orange-50"
                onClick={() => setFilters(prev => ({ ...prev, location }))}
              >
                <MapPin className="w-3 h-3 mr-1" />
                {location}
              </Badge>
            ))}
          </div>

          {/* Search Button and Filters */}
          <div className="flex gap-2">
            <Button onClick={handleSearch} className="flex-1">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
            
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="relative">
                  <SlidersHorizontal className="w-4 h-4" />
                  {activeFiltersCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center p-0">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              
              <SheetContent side="bottom" className="h-auto max-h-[80vh] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filter Properties</SheetTitle>
                </SheetHeader>
                
                <div className="py-4 space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Location</label>
                    <Select value={filters.location} onValueChange={(value) => 
                      setFilters(prev => ({ ...prev, location: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="victoria-island">Victoria Island</SelectItem>
                        <SelectItem value="lekki">Lekki</SelectItem>
                        <SelectItem value="ikoyi">Ikoyi</SelectItem>
                        <SelectItem value="yaba">Yaba</SelectItem>
                        <SelectItem value="surulere">Surulere</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Property Type</label>
                    <Select value={filters.propertyType} onValueChange={(value) => 
                      setFilters(prev => ({ ...prev, propertyType: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="house">House</SelectItem>
                        <SelectItem value="duplex">Duplex</SelectItem>
                        <SelectItem value="studio">Studio</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Bedrooms</label>
                    <div className="flex gap-2">
                      {['1', '2', '3', '4', '5+'].map((bed) => (
                        <Button
                          key={bed}
                          variant={filters.bedrooms === bed ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setFilters(prev => ({ 
                            ...prev, 
                            bedrooms: prev.bedrooms === bed ? '' : bed 
                          }))}
                        >
                          {bed}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" onClick={clearFilters} className="flex-1">
                      Clear All
                    </Button>
                    <Button onClick={() => {
                      handleSearch();
                      setIsFilterOpen(false);
                    }} className="flex-1">
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MobileOptimizedSearch;
