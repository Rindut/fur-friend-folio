
/**
 * Get coordinates for a location name
 */
export async function getCoordinatesForLocation(
  location: string, 
  apiKey: string
): Promise<{lat: number, lng: number} | null> {
  try {
    // For common Indonesian cities, use hardcoded coordinates for efficiency
    const cityCoordinates: {[key: string]: {lat: number, lng: number}} = {
      'jakarta': {lat: -6.2088, lng: 106.8456},
      'bandung': {lat: -6.9175, lng: 107.6191},
      'surabaya': {lat: -7.2575, lng: 112.7521},
      'yogyakarta': {lat: -7.7972, lng: 110.3688},
      'bali': {lat: -8.3405, lng: 115.0920},
      'denpasar': {lat: -8.6705, lng: 115.2126}
    };
    
    const normalizedLocation = location.toLowerCase();
    if (cityCoordinates[normalizedLocation]) {
      return cityCoordinates[normalizedLocation];
    }
    
    // If not a known city, use geocoding API
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${apiKey}`;
    
    const response = await fetch(geocodeUrl);
    const data = await response.json();
    
    if (data.status === 'OK' && data.results && data.results.length > 0) {
      return data.results[0].geometry.location;
    }
    
    return null;
  } catch (error) {
    console.error('Error in getCoordinatesForLocation:', error);
    return null;
  }
}
