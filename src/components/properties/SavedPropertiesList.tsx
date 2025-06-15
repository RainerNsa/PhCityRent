
import React from 'react';
import { useSavedProperties } from '@/hooks/useSavedProperties';
import PropertyCard from './PropertyCard';
import { Heart, Home } from 'lucide-react';

const SavedPropertiesList = () => {
  const { data: savedProperties = [], isLoading, error } = useSavedProperties();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-200" />
            <div className="p-6 space-y-4">
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <Home className="w-16 h-16 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Error Loading Saved Properties</h3>
          <p>Please try again later.</p>
        </div>
      </div>
    );
  }

  if (savedProperties.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-600 mb-2">No Saved Properties Yet</h3>
        <p className="text-gray-500 mb-6">Start browsing properties and save your favorites!</p>
        <a
          href="/properties"
          className="inline-flex items-center px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          <Home className="w-4 h-4 mr-2" />
          Browse Properties
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Heart className="w-5 h-5 text-red-500" />
        <h2 className="text-xl font-bold">Your Saved Properties ({savedProperties.length})</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedProperties.map((savedProperty) => (
          <PropertyCard key={savedProperty.id} property={savedProperty.properties} />
        ))}
      </div>
    </div>
  );
};

export default SavedPropertiesList;
