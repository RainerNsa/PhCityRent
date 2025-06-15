
import mapboxgl from 'mapbox-gl';

interface Property {
  id: string;
  title: string;
  location: string;
  price_per_year: number;
  bedrooms: number;
  bathrooms: number;
}

interface MapMarkerProps {
  property: Property;
  coordinates: [number, number];
  map: mapboxgl.Map;
  onPropertySelect?: (property: Property) => void;
}

export const createMapMarker = ({ property, coordinates, map, onPropertySelect }: MapMarkerProps) => {
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
  const marker = new mapboxgl.Marker(markerElement)
    .setLngLat(coordinates)
    .setPopup(popup)
    .addTo(map);

  // Handle property selection
  markerElement.addEventListener('click', () => {
    if (onPropertySelect) {
      onPropertySelect(property);
    }
  });

  return marker;
};
