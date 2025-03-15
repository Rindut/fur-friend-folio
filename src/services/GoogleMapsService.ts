
import { Service, ServiceSource } from '@/types/petServices';

// Define interface for Google Maps Place Result
interface GooglePlaceResult {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    }
  };
  rating?: number;
  user_ratings_total?: number;
  vicinity?: string;
  website?: string;
  formatted_phone_number?: string;
  price_level?: number;
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
  opening_hours?: {
    open_now?: boolean;
    weekday_text?: string[];
  };
  types?: string[];
}

// Define interface for Google Maps API Response
interface GoogleMapsPlacesResponse {
  results: GooglePlaceResult[];
  status: string;
  next_page_token?: string;
}

// Define interface for Place Details Response
interface GoogleMapsPlaceDetailsResponse {
  result: GooglePlaceResult;
  status: string;
}

class GoogleMapsService {
  private apiKey: string;
  private baseUrl = 'https://maps.googleapis.com/maps/api/place';
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
  
  /**
   * Search for nearby places based on category and location
   */
  async searchNearbyPlaces(
    category: string, 
    location: string,
    radius: number = 5000
  ): Promise<Service[]> {
    try {
      // Map our category to Google Maps type/keyword
      const googleType = this.mapCategoryToGoogleType(category);
      const keyword = this.getCategoryKeyword(category);
      
      // Get coordinates for the location
      const coordinates = await this.getCoordinatesForLocation(location);
      if (!coordinates) {
        console.error('Could not get coordinates for location:', location);
        return [];
      }
      
      // Build the URL for nearby search
      let url = `${this.baseUrl}/nearbysearch/json?location=${coordinates.lat},${coordinates.lng}&radius=${radius}&key=${this.apiKey}`;
      
      // Add type and keyword if available
      if (googleType) url += `&type=${googleType}`;
      if (keyword) url += `&keyword=${keyword}`;
      
      // Make the API request
      const response = await fetch(url);
      const data = await response.json() as GoogleMapsPlacesResponse;
      
      if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
        console.error('Google Maps API error:', data.status);
        return [];
      }
      
      // Map the Google Places results to our Service interface
      const services = await Promise.all(
        (data.results || []).map(place => this.mapPlaceToService(place, category))
      );
      
      return services;
    } catch (error) {
      console.error('Error in searchNearbyPlaces:', error);
      return [];
    }
  }
  
  /**
   * Search for places by text query
   */
  async searchPlacesByText(
    query: string, 
    category?: string,
    location?: string
  ): Promise<Service[]> {
    try {
      // Get coordinates for the location (if provided)
      let locationParam = '';
      if (location) {
        const coordinates = await this.getCoordinatesForLocation(location);
        if (coordinates) {
          locationParam = `&location=${coordinates.lat},${coordinates.lng}&radius=5000`;
        }
      }
      
      // Build category-specific query
      let enhancedQuery = query;
      if (category && category !== 'all') {
        const keyword = this.getCategoryKeyword(category);
        if (keyword) {
          enhancedQuery = `${keyword} ${query}`;
        }
      }
      
      // Build the URL for text search
      const url = `${this.baseUrl}/textsearch/json?query=${encodeURIComponent(enhancedQuery)} pet services${locationParam}&key=${this.apiKey}`;
      
      // Make the API request
      const response = await fetch(url);
      const data = await response.json() as GoogleMapsPlacesResponse;
      
      if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
        console.error('Google Maps API error:', data.status);
        return [];
      }
      
      // Map the Google Places results to our Service interface
      const categoryToUse = category || this.detectCategory(query);
      const services = await Promise.all(
        (data.results || []).map(place => this.mapPlaceToService(place, categoryToUse))
      );
      
      return services;
    } catch (error) {
      console.error('Error in searchPlacesByText:', error);
      return [];
    }
  }
  
  /**
   * Get additional details for a specific place
   */
  async getPlaceDetails(placeId: string): Promise<GooglePlaceResult | null> {
    try {
      const url = `${this.baseUrl}/details/json?place_id=${placeId}&fields=name,formatted_address,geometry,rating,user_ratings_total,formatted_phone_number,website,price_level,opening_hours,types&key=${this.apiKey}`;
      
      const response = await fetch(url);
      const data = await response.json() as GoogleMapsPlaceDetailsResponse;
      
      if (data.status !== 'OK') {
        console.error('Google Maps API error when fetching place details:', data.status);
        return null;
      }
      
      return data.result;
    } catch (error) {
      console.error('Error in getPlaceDetails:', error);
      return null;
    }
  }
  
  /**
   * Get coordinates for a location name
   */
  private async getCoordinatesForLocation(location: string): Promise<{lat: number, lng: number} | null> {
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
      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${this.apiKey}`;
      
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
  
  /**
   * Map Google Place to our Service interface
   */
  private async mapPlaceToService(place: GooglePlaceResult, category: string): Promise<Service> {
    try {
      // For more details, fetch additional place data
      const placeDetails = await this.getPlaceDetails(place.place_id);
      const mergedPlace = { ...place, ...placeDetails };
      
      // Extract city from address
      const addressParts = (mergedPlace.formatted_address || mergedPlace.vicinity || '').split(',');
      let city = addressParts.length > 1 ? addressParts[addressParts.length - 2].trim() : 'Unknown';
      // Clean up city name (remove postal codes, etc.)
      city = city.replace(/\d+/g, '').trim();
      
      const service: Service = {
        id: `gmaps-${place.place_id}`,
        name: mergedPlace.name,
        address: mergedPlace.formatted_address || mergedPlace.vicinity || '',
        city: city,
        categoryId: category || this.detectCategoryFromPlaceTypes(mergedPlace.types || []),
        contactPhone: mergedPlace.formatted_phone_number || '',
        website: mergedPlace.website || `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
        operatingHours: mergedPlace.opening_hours?.weekday_text?.join(', ') || '',
        priceRange: mergedPlace.price_level || 2,
        latitude: mergedPlace.geometry.location.lat,
        longitude: mergedPlace.geometry.location.lng,
        verified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        avgRating: mergedPlace.rating || 0,
        reviewCount: mergedPlace.user_ratings_total || 0,
        source: ServiceSource.GOOGLE_MAPS,
        externalId: place.place_id,
        externalUrl: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`
      };
      
      return service;
    } catch (error) {
      console.error('Error in mapPlaceToService:', error);
      
      // Return basic service data if detailed fetching fails
      return {
        id: `gmaps-${place.place_id}`,
        name: place.name,
        address: place.formatted_address || place.vicinity || '',
        city: 'Unknown',
        categoryId: category || 'unknown',
        verified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        source: ServiceSource.GOOGLE_MAPS,
        externalId: place.place_id,
        externalUrl: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`
      };
    }
  }
  
  /**
   * Map our category to Google Places API type
   */
  private mapCategoryToGoogleType(category: string): string {
    const categoryMap: {[key: string]: string} = {
      'veterinary_clinics': 'veterinary_care',
      'pet_shops': 'pet_store',
      'grooming_services': 'pet_store',
      'pet_hotels': 'lodging',
      'pet_cafes': 'cafe',
      'pet_friendly_restaurants': 'restaurant',
      'pet_parks': 'park',
      'pet_training': 'point_of_interest'
    };
    
    return categoryMap[category] || '';
  }
  
  /**
   * Get keyword for our category to enhance search
   */
  private getCategoryKeyword(category: string): string {
    const keywordMap: {[key: string]: string} = {
      'veterinary_clinics': 'veterinary clinic pet',
      'pet_shops': 'pet shop store',
      'grooming_services': 'pet grooming salon',
      'pet_hotels': 'pet hotel boarding',
      'pet_cafes': 'pet cafe',
      'pet_friendly_restaurants': 'pet friendly restaurant',
      'pet_parks': 'dog park',
      'pet_training': 'pet training school'
    };
    
    return keywordMap[category] || 'pet';
  }
  
  /**
   * Detect category from place types
   */
  private detectCategoryFromPlaceTypes(types: string[]): string {
    if (types.includes('veterinary_care')) return 'veterinary_clinics';
    if (types.includes('pet_store')) return 'pet_shops';
    if (types.includes('lodging') && types.includes('point_of_interest')) return 'pet_hotels';
    if ((types.includes('cafe') || types.includes('restaurant')) && types.includes('point_of_interest')) return 'pet_cafes';
    if (types.includes('park')) return 'pet_parks';
    if (types.includes('restaurant')) return 'pet_friendly_restaurants';
    
    return 'pet_shops'; // Default to pet shops
  }
  
  /**
   * Detect category from search query
   */
  private detectCategory(query: string): string {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('vet') || lowerQuery.includes('clinic') || lowerQuery.includes('dokter hewan')) 
      return 'veterinary_clinics';
    if (lowerQuery.includes('groom') || lowerQuery.includes('salon')) 
      return 'grooming_services';
    if (lowerQuery.includes('hotel') || lowerQuery.includes('boarding') || lowerQuery.includes('penginapan')) 
      return 'pet_hotels';
    if (lowerQuery.includes('cafe') || lowerQuery.includes('kafe')) 
      return 'pet_cafes';
    if (lowerQuery.includes('park') || lowerQuery.includes('taman')) 
      return 'pet_parks';
    if (lowerQuery.includes('train') || lowerQuery.includes('school') || lowerQuery.includes('latih')) 
      return 'pet_training';
    if (lowerQuery.includes('restaurant') || lowerQuery.includes('restoran')) 
      return 'pet_friendly_restaurants';
    
    return 'pet_shops'; // Default to pet shops
  }
}

export default GoogleMapsService;
