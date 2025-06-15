
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useSavedSearches, useCreateSavedSearch, useDeleteSavedSearch } from '@/hooks/useSavedSearches';
import { Search, Bell, Trash2, Plus } from 'lucide-react';

// Define the search criteria type
interface SearchCriteria {
  location?: string;
  priceRange?: string;
  bedrooms?: string;
}

const SavedSearches = () => {
  const { data: searches, isLoading } = useSavedSearches();
  const createSearch = useCreateSavedSearch();
  const deleteSearch = useDeleteSavedSearch();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newSearch, setNewSearch] = useState({
    searchName: '',
    location: '',
    priceMin: '',
    priceMax: '',
    bedrooms: '',
    alertFrequency: 'daily',
  });

  const handleCreateSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const searchCriteria: SearchCriteria = {
      location: newSearch.location,
      priceRange: newSearch.priceMin && newSearch.priceMax ? 
        `${parseInt(newSearch.priceMin) * 12}-${parseInt(newSearch.priceMax) * 12}` : '',
      bedrooms: newSearch.bedrooms,
    };

    createSearch.mutate({
      searchName: newSearch.searchName,
      searchCriteria,
      alertFrequency: newSearch.alertFrequency,
    });

    setNewSearch({
      searchName: '',
      location: '',
      priceMin: '',
      priceMax: '',
      bedrooms: '',
      alertFrequency: 'daily',
    });
    setIsDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Saved Searches</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Save New Search
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save New Search</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateSearch} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="searchName">Search Name</Label>
                <Input
                  id="searchName"
                  value={newSearch.searchName}
                  onChange={(e) => setNewSearch(prev => ({ ...prev, searchName: e.target.value }))}
                  placeholder="e.g., Downtown 2BR under $2000"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newSearch.location}
                  onChange={(e) => setNewSearch(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="City or area"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priceMin">Min Price/Month</Label>
                  <Input
                    id="priceMin"
                    type="number"
                    value={newSearch.priceMin}
                    onChange={(e) => setNewSearch(prev => ({ ...prev, priceMin: e.target.value }))}
                    placeholder="500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priceMax">Max Price/Month</Label>
                  <Input
                    id="priceMax"
                    type="number"
                    value={newSearch.priceMax}
                    onChange={(e) => setNewSearch(prev => ({ ...prev, priceMax: e.target.value }))}
                    placeholder="2000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Select
                    value={newSearch.bedrooms}
                    onValueChange={(value) => setNewSearch(prev => ({ ...prev, bedrooms: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any</SelectItem>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alertFrequency">Alert Frequency</Label>
                  <Select
                    value={newSearch.alertFrequency}
                    onValueChange={(value) => setNewSearch(prev => ({ ...prev, alertFrequency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instant">Instant</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={createSearch.isPending}>
                {createSearch.isPending ? 'Saving...' : 'Save Search'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {!searches?.length ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Saved Searches</h3>
            <p className="text-gray-600 mb-4">Save your search criteria to get notified of new matching properties.</p>
            <Button onClick={() => setIsDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Save Your First Search
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {searches.map((search) => {
            // Type cast the search_criteria to our SearchCriteria interface
            const criteria = search.search_criteria as SearchCriteria;
            
            return (
              <Card key={search.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{search.search_name}</CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => deleteSearch.mutate(search.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    {criteria?.location && (
                      <div>
                        <span className="font-medium">Location:</span> {criteria.location}
                      </div>
                    )}
                    {criteria?.priceRange && (
                      <div>
                        <span className="font-medium">Price:</span> ${Math.round(parseInt(criteria.priceRange.split('-')[0]) / 12)}-${Math.round(parseInt(criteria.priceRange.split('-')[1]) / 12)}/month
                      </div>
                    )}
                    {criteria?.bedrooms && (
                      <div>
                        <span className="font-medium">Bedrooms:</span> {criteria.bedrooms}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bell className="w-4 h-4 text-blue-600" />
                      <Badge variant="outline">{search.alert_frequency}</Badge>
                    </div>
                    <Badge variant={search.is_active ? "default" : "secondary"}>
                      {search.is_active ? 'Active' : 'Paused'}
                    </Badge>
                  </div>

                  <div className="text-xs text-gray-500">
                    Created {new Date(search.created_at).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SavedSearches;
