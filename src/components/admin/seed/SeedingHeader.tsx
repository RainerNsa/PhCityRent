
import React from 'react';

const SeedingHeader = () => {
  return (
    <div className="text-center space-y-4">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
        PhCityRent Data Seeding
      </h2>
      <p className="text-gray-600 max-w-2xl mx-auto">
        Populate your PhCityRent platform with high-quality sample data including properties, 
        agent profiles, and content to showcase the platform's capabilities.
      </p>
    </div>
  );
};

export default SeedingHeader;
