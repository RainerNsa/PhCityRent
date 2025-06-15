
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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

// Port Harcourt area coordinates
const PORT_HARCOURT_LOCATIONS = {
  'Old GRA': [7.0134, 4.8156],
  'New GRA': [7.0200, 4.8200],
  'Trans Amadi': [4.7833, 7.0167],
  'D-Line': [4.8044, 7.0134],
  'Ada George': [4.8500, 7.0500],
  'Rumuola': [4.8367, 7.0233],
  'Eliozu': [4.8700, 7.0400],
  'Rumuokwurushi': [4.8600, 7.0300],
  'Woji': [4.8200, 7.0100],
  'GRA': [7.0134, 4.8156] // Default to Old GRA
};

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
        style: 'mapbox://styles/mapbox/light-v11',
        center: [7.0134, 4.8156], // Port Harcourt center
        zoom: 11,
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Add markers for properties
      properties.forEach((property) => {
        const coordinates = PORT_HARCOURT_LOCATIONS[property.location as keyof typeof PORT_HARCOURT_LOCATIONS] || 
                          PORT_HARCOURT_LOCATIONS['GRA'];

        // Create custom marker element
        const markerElement = document.createElement('div');
        markerElement.className = 'custom-marker';
        markerElement.innerHTML = `
          <div style="
            background: #f97316; 
            color: white; 
            padding: 8px 12px; 
            border-radius: 20px; 
            font-size: 12px; 
            font-weight: bold;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            cursor: pointer;
            border: 2px solid white;
          ">
            ₦${(property.price_per_year / 1000000).toFixed(1)}M
          </div>
        `;

        // Create popup
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div style="padding: 10px; max-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">${property.title}</h3>
            <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">
              <strong>Location:</strong> ${property.location}
            </p>
            <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">
              <strong>Price:</strong> ₦${property.price_per_year.toLocaleString()}/year
            </p>
            <p style="margin: 0 0 8px 0; font-size: 12px; color: #666;">
              ${property.bedrooms} beds • ${property.bathrooms} baths
            </p>
            <button 
              onclick="window.selectProperty('${property.id}')"
              style="
                background: #f97316; 
                color: white; 
                border: none; 
                padding: 6px 12px; 
                border-radius: 4px; 
                font-size: 12px;
                cursor: pointer;
              "
            >
              View Details
            </button>
          </div>
        `);

        // Add marker to map
        new mapboxgl.Marker(markerElement)
          .setLngLat([coordinates[1], coordinates[0]])
          .setPopup(popup)
          .addTo(map.current!);

        // Handle property selection
        markerElement.addEventListener('click', () => {
          if (onPropertySelect) {
            onPropertySelect(property);
          }
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

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const token = formData.get('token') as string;
    if (token) {
      setMapboxToken(token);
      setShowTokenInput(false);
    }
  };

  if (showTokenInput) {
    return (
      <div 
        className="flex items-center justify-center bg-gray-100 border border-gray-300 rounded-lg"
        style={{ height }}
      >
        <div className="text-center p-6">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Map Integration Available</h3>
          <p className="text-gray-600 mb-4 max-w-md">
            To view properties on the map, please enter your Mapbox public token. 
            Get one free at <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-orange-500 underline">mapbox.com</a>
          </p>
          
          <form onSubmit={handleTokenSubmit} className="space-y-3 max-w-sm mx-auto">
            <div>
              <Label htmlFor="token">Mapbox Public Token</Label>
              <Input
                id="token"
                name="token"
                type="text"
                placeholder="pk.eyJ1..."
                required
              />
            </div>
            <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">
              <Settings className="w-4 h-4 mr-2" />
              Enable Map
            </Button>
          </form>
        </div>
      </div>
    );
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
