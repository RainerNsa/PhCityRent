
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
  is_verified?: boolean;
  featured?: boolean;
}

interface PropertyMapProps {
  properties: Property[];
  onPropertySelect?: (property: Property) => void;
  height?: string;
  selectedProperty?: Property | null;
}

const PropertyMap = ({ properties, onPropertySelect, height = "400px", selectedProperty }: PropertyMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [mapboxToken, setMapboxToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

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
      
      // Add fullscreen control
      map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');

      // Wait for map to load before adding markers
      map.current.on('load', () => {
        setIsMapLoaded(true);
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
      // Clean up markers
      markers.current.forEach(marker => marker.remove());
      markers.current = [];
      
      if (map.current) {
        map.current.remove();
      }
    };
  }, [mapboxToken]);

  // Add markers when map is loaded and properties change
  useEffect(() => {
    if (!map.current || !isMapLoaded || properties.length === 0) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add markers for properties
    const bounds = new mapboxgl.LngLatBounds();
    let hasValidCoordinates = false;

    properties.forEach((property) => {
      const coordinates = getPropertyCoordinates(property.location);
      
      // Add to bounds
      bounds.extend(coordinates);
      hasValidCoordinates = true;
      
      const marker = createMapMarker({
        property,
        coordinates,
        map: map.current!,
        onPropertySelect
      });
      
      markers.current.push(marker);
    });

    // Fit map to show all markers if we have properties
    if (hasValidCoordinates && properties.length > 1) {
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15
      });
    }

  }, [properties, isMapLoaded, onPropertySelect]);

  // Handle selected property highlighting
  useEffect(() => {
    if (!selectedProperty || !map.current || !isMapLoaded) return;

    const coordinates = getPropertyCoordinates(selectedProperty.location);
    
    // Center map on selected property
    map.current.flyTo({
      center: coordinates,
      zoom: 14,
      duration: 1000
    });

    // Find and open popup for selected property
    const selectedMarker = markers.current.find(marker => {
      // This is a bit hacky, but we need to identify the marker somehow
      const popup = marker.getPopup();
      return popup && popup.getHTML().includes(selectedProperty.id);
    });

    if (selectedMarker) {
      selectedMarker.togglePopup();
    }

  }, [selectedProperty, isMapLoaded]);

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
      
      {/* Map overlay with property count and legend */}
      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md border">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
          <span>{properties.length} properties</span>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-md border">
        <div className="text-xs font-medium text-gray-700 mb-2">Property Types</div>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full border border-white"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full border border-white"></div>
            <span>Verified</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full border border-white relative">
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full border border-white"></div>
            </div>
            <span>Featured</span>
          </div>
        </div>
      </div>

      {/* Loading indicator */}
      {!isMapLoaded && (
        <div className="absolute inset-0 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
            <div className="text-sm text-gray-600">Loading map...</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyMap;
