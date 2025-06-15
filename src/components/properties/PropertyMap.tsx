
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxTokenInput from './map/MapboxTokenInput';
import { createMapMarker } from './map/MapMarker';
import { MAP_CONFIG, getPropertyCoordinates } from './map/MapConfiguration';

interface Property {
  id: string;
  title: string;
  location: string;
  price_per_year: number;
  bedrooms: number;
  bathrooms: number;
}

interface PropertyMapProps {
  properties: Property[];
  onPropertySelect?: (property: Property) => void;
  height?: string;
}

const PropertyMap = ({ properties, onPropertySelect, height = "400px" }: PropertyMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(false);

  useEffect(() => {
    // Check if we have a token from environment or show input
    const token = import.meta.env.VITE_MAPBOX_PUBLIC_TOKEN;
    if (token) {
      setMapboxToken(token);
    } else {
      setShowTokenInput(true);
    }
  }, []);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: MAP_CONFIG.style,
        center: MAP_CONFIG.center,
        zoom: MAP_CONFIG.zoom,
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Add markers for properties
      properties.forEach((property) => {
        const coordinates = getPropertyCoordinates(property.location);
        createMapMarker({
          property,
          coordinates,
          map: map.current!,
          onPropertySelect
        });
      });

      // Global function for popup button
      (window as any).selectProperty = (propertyId: string) => {
        const property = properties.find(p => p.id === propertyId);
        if (property && onPropertySelect) {
          onPropertySelect(property);
        }
      };

    } catch (error) {
      console.error('Error initializing map:', error);
      setShowTokenInput(true);
    }

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [mapboxToken, properties, onPropertySelect]);

  const handleTokenSubmit = (token: string) => {
    setMapboxToken(token);
    setShowTokenInput(false);
  };

  if (showTokenInput) {
    return <MapboxTokenInput onTokenSubmit={handleTokenSubmit} height={height} />;
  }

  return (
    <div className="relative">
      <div 
        ref={mapContainer} 
        className="w-full rounded-lg border border-gray-200"
        style={{ height }}
      />
      <div className="absolute top-2 left-2 bg-white px-3 py-1 rounded-full text-sm font-medium shadow-md">
        {properties.length} properties in Port Harcourt
      </div>
    </div>
  );
};

export default PropertyMap;
