
import React from 'react';
import { Home } from 'lucide-react';

const PropertiesEmptyState = () => {
  return (
    <div className="text-center py-12">
      <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-xl font-bold text-gray-600 mb-2">No Properties Found</h3>
      <p className="text-gray-500">Try adjusting your search criteria to find more properties.</p>
    </div>
  );
};

export default PropertiesEmptyState;
