
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateSavedSearch } from '@/hooks/useSavedSearches';

interface SearchCriteria {
  location?: string;
  priceRange?: string;
  bedrooms?: string;
}

interface SavedSearchFormProps {
  onSuccess: () => void;
}

const SavedSearchForm = ({ onSuccess }: SavedSearchFormProps) => {
  const createSearch = useCreateSavedSearch();
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
    onSuccess();
  };

  return (
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
  );
};

export default SavedSearchForm;
