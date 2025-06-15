
import React from 'react';
import { Home } from 'lucide-react';

const PropertiesErrorState = () => {
  return (
    <div className="text-center py-12">
      <div className="text-red-500 mb-4">
        <Home className="w-16 h-16 mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">Error Loading Properties</h3>
        <p>Please try again later.</p>
      </div>
    </div>
  );
};

export default PropertiesErrorState;
