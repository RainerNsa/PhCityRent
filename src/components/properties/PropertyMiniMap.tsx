
import React from 'react';
import { MapPin } from 'lucide-react';

interface PropertyMiniMapProps {
  location: string;
  className?: string;
}

// Port Harcourt area coordinates for mini map
const LOCATION_COORDINATES = {
  'Old GRA': { lat: 4.8156, lng: 7.0134 },
  'New GRA': { lat: 4.8200, lng: 7.0200 },
  'Trans Amadi': { lat: 4.7833, lng: 7.0167 },
  'D-Line': { lat: 4.8044, lng: 7.0134 },
  'Ada George': { lat: 4.8500, lng: 7.0500 },
  'Rumuola': { lat: 4.8367, lng: 7.0233 },
  'Eliozu': { lat: 4.8700, lng: 7.0400 },
  'Rumuokwurushi': { lat: 4.8600, lng: 7.0300 },
  'Woji': { lat: 4.8200, lng: 7.0100 },
  'GRA': { lat: 4.8156, lng: 7.0134 }
};

const PropertyMiniMap = ({ location, className = "" }: PropertyMiniMapProps) => {
  const coordinates = LOCATION_COORDINATES[location as keyof typeof LOCATION_COORDINATES] || 
                     LOCATION_COORDINATES['GRA'];

  const staticMapUrl = `https://api.mapbox.com/styles/v1/mapbox/light-v11/static/pin-s+f97316(${coordinates.lng},${coordinates.lat})/${coordinates.lng},${coordinates.lat},13,0/150x100@2x?access_token=${import.meta.env.VITE_MAPBOX_PUBLIC_TOKEN || 'pk.placeholder'}`;

  return (
    <div className={`relative ${className}`}>
      {import.meta.env.VITE_MAPBOX_PUBLIC_TOKEN ? (
        <img 
          src={staticMapUrl}
          alt={`Map of ${location}`}
          className="w-full h-full object-cover rounded"
          onError={(e) => {
            // Fallback to placeholder if map fails to load
            (e.target as HTMLImageElement).style.display = 'none';
            const fallback = (e.target as HTMLImageElement).nextElementSibling;
            if (fallback) {
              (fallback as HTMLElement).style.display = 'flex';
            }
          }}
        />
      ) : null}
      
      <div 
        className="w-full h-full bg-gray-100 flex items-center justify-center rounded"
        style={{ display: import.meta.env.VITE_MAPBOX_PUBLIC_TOKEN ? 'none' : 'flex' }}
      >
        <MapPin className="w-6 h-6 text-gray-400" />
      </div>
      
      <div className="absolute bottom-1 left-1 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
        {location}
      </div>
    </div>
  );
};

export default PropertyMiniMap;
