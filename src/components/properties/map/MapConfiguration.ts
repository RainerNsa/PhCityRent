
// Port Harcourt area coordinates
export const PORT_HARCOURT_LOCATIONS = {
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

// Map configuration constants
export const MAP_CONFIG = {
  style: 'mapbox://styles/mapbox/light-v11',
  center: [7.0134, 4.8156] as [number, number], // Port Harcourt center
  zoom: 11,
};

export const getPropertyCoordinates = (location: string): [number, number] => {
  const coordinates = PORT_HARCOURT_LOCATIONS[location as keyof typeof PORT_HARCOURT_LOCATIONS] || 
                    PORT_HARCOURT_LOCATIONS['GRA'];
  return [coordinates[1], coordinates[0]]; // Return as [lng, lat] for Mapbox
};
