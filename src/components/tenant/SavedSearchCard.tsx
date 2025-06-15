
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Trash2 } from 'lucide-react';
import { useDeleteSavedSearch } from '@/hooks/useSavedSearches';

interface SearchCriteria {
  location?: string;
  priceRange?: string;
  bedrooms?: string;
}

interface SavedSearch {
  id: string;
  search_name: string;
  search_criteria: any;
  alert_frequency: string;
  is_active: boolean;
  created_at: string;
}

interface SavedSearchCardProps {
  search: SavedSearch;
}

const SavedSearchCard = ({ search }: SavedSearchCardProps) => {
  const deleteSearch = useDeleteSavedSearch();
  const criteria = search.search_criteria as SearchCriteria;

  return (
    <Card>
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
};

export default SavedSearchCard;
