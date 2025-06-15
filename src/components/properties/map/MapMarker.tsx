
import mapboxgl from 'mapbox-gl';

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

interface MapMarkerProps {
  property: Property;
  coordinates: [number, number];
  map: mapboxgl.Map;
  onPropertySelect?: (property: Property) => void;
}

export const createMapMarker = ({ property, coordinates, map, onPropertySelect }: MapMarkerProps) => {
  // Create custom marker element with enhanced styling
  const markerElement = document.createElement('div');
  markerElement.className = 'custom-marker';
  
  // Determine marker color based on property status
  const getMarkerColor = () => {
    if (property.featured) return '#f59e0b'; // Yellow for featured
    if (property.is_verified) return '#10b981'; // Green for verified
    return '#f97316'; // Orange for regular
  };

  const markerColor = getMarkerColor();
  
  markerElement.innerHTML = `
    <div style="
      background: ${markerColor}; 
      color: white; 
      padding: 8px 12px; 
      border-radius: 20px; 
      font-size: 12px; 
      font-weight: bold;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      cursor: pointer;
      border: 2px solid white;
      position: relative;
      transition: all 0.2s ease;
    ">
      ₦${(property.price_per_year / 1000000).toFixed(1)}M
      ${property.featured ? '<div style="position: absolute; top: -8px; right: -8px; width: 16px; height: 16px; background: #fbbf24; border-radius: 50%; border: 2px solid white;"></div>' : ''}
    </div>
  `;

  // Add hover effects
  markerElement.addEventListener('mouseenter', () => {
    markerElement.style.transform = 'scale(1.1)';
    markerElement.style.zIndex = '1000';
  });

  markerElement.addEventListener('mouseleave', () => {
    markerElement.style.transform = 'scale(1)';
    markerElement.style.zIndex = 'auto';
  });

  // Create enhanced popup with better styling
  const popup = new mapboxgl.Popup({ 
    offset: 25,
    closeButton: true,
    closeOnClick: false,
    maxWidth: '300px'
  }).setHTML(`
    <div style="padding: 16px; font-family: system-ui, -apple-system, sans-serif;">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
        <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #1f2937; flex: 1;">${property.title}</h3>
        ${property.is_verified ? '<div style="background: #10b981; color: white; padding: 2px 6px; border-radius: 8px; font-size: 10px; font-weight: 500;">VERIFIED</div>' : ''}
        ${property.featured ? '<div style="background: #f59e0b; color: white; padding: 2px 6px; border-radius: 8px; font-size: 10px; font-weight: 500;">FEATURED</div>' : ''}
      </div>
      
      <div style="margin-bottom: 8px;">
        <div style="display: flex; align-items: center; gap: 4px; color: #6b7280; font-size: 12px;">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          <span>${property.location}</span>
        </div>
      </div>
      
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <div style="font-size: 18px; font-weight: 700; color: #f97316;">
          ₦${property.price_per_year.toLocaleString()}<span style="font-size: 12px; font-weight: 400; color: #6b7280;">/year</span>
        </div>
      </div>
      
      <div style="display: flex; gap: 16px; margin-bottom: 12px; font-size: 12px; color: #6b7280;">
        <div style="display: flex; align-items: center; gap: 4px;">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 14c1.66 0 3-1.34 3-3S8.66 8 7 8s-3 1.34-3 3 1.34 3 3 3zm0-4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm12-3h-8v8H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z"/>
          </svg>
          <span>${property.bedrooms} beds</span>
        </div>
        <div style="display: flex; align-items: center; gap: 4px;">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 2v1h6V2h2v1h1c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h1V2h2zm0 4H7v2h2V6zm4 0h-2v2h2V6zm4 0h-2v2h2V6zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/>
          </svg>
          <span>${property.bathrooms} baths</span>
        </div>
      </div>
      
      <button 
        onclick="window.selectProperty('${property.id}')"
        style="
          width: 100%;
          background: #f97316; 
          color: white; 
          border: none; 
          padding: 10px 16px; 
          border-radius: 8px; 
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease;
        "
        onmouseover="this.style.background='#ea580c'"
        onmouseout="this.style.background='#f97316'"
      >
        View Property Details
      </button>
    </div>
  `);

  // Add marker to map with enhanced styling
  const marker = new mapboxgl.Marker(markerElement)
    .setLngLat(coordinates)
    .setPopup(popup)
    .addTo(map);

  // Handle property selection with enhanced interaction
  markerElement.addEventListener('click', (e) => {
    e.stopPropagation();
    
    // Close other popups
    const existingPopups = document.querySelectorAll('.mapboxgl-popup');
    existingPopups.forEach(popup => {
      if (popup !== marker.getPopup().getElement()) {
        popup.remove();
      }
    });
    
    // Open this popup
    marker.togglePopup();
    
    if (onPropertySelect) {
      onPropertySelect(property);
    }
  });

  return marker;
};
