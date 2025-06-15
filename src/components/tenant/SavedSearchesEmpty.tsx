
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Plus } from 'lucide-react';

interface SavedSearchesEmptyProps {
  onCreateClick: () => void;
}

const SavedSearchesEmpty = ({ onCreateClick }: SavedSearchesEmptyProps) => {
  return (
    <Card>
      <CardContent className="p-8 text-center">
        <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Saved Searches</h3>
        <p className="text-gray-600 mb-4">Save your search criteria to get notified of new matching properties.</p>
        <Button onClick={onCreateClick} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Save Your First Search
        </Button>
      </CardContent>
    </Card>
  );
};

export default SavedSearchesEmpty;
