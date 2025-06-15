
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useSavedSearches } from '@/hooks/useSavedSearches';
import { Plus } from 'lucide-react';
import SavedSearchForm from './SavedSearchForm';
import SavedSearchCard from './SavedSearchCard';
import SavedSearchesEmpty from './SavedSearchesEmpty';

const SavedSearches = () => {
  const { data: searches, isLoading } = useSavedSearches();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleFormSuccess = () => {
    setIsDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse bg-gray-200 rounded-lg h-32"></div>
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
            <SavedSearchForm onSuccess={handleFormSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      {!searches?.length ? (
        <SavedSearchesEmpty onCreateClick={() => setIsDialogOpen(true)} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {searches.map((search) => (
            <SavedSearchCard key={search.id} search={search} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedSearches;
