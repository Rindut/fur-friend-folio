
import { Service } from '@/types/petServices';
import { GoogleMapsPlacesResponse, GoogleMapsPlaceDetailsResponse, GooglePlaceResult } from './google-maps/types';
import { mapCategoryToGoogleType, getCategoryKeyword, detectCategoryFromQuery } from './google-maps/categoryMapper';
import { getCoordinatesForLocation } from './google-maps/geocoder';
import { mapPlaceToService } from './google-maps/placeMapper';

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
      const googleType = mapCategoryToGoogleType(category);
      const keyword = getCategoryKeyword(category);
      
      // Get coordinates for the location
      const coordinates = await getCoordinatesForLocation(location, this.apiKey);
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
        (data.results || []).map(async place => {
          const details = await this.getPlaceDetails(place.place_id);
          return mapPlaceToService(place, details, category);
        })
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
        const coordinates = await getCoordinatesForLocation(location, this.apiKey);
        if (coordinates) {
          locationParam = `&location=${coordinates.lat},${coordinates.lng}&radius=5000`;
        }
      }
      
      // Build category-specific query
      let enhancedQuery = query;
      if (category && category !== 'all') {
        const keyword = getCategoryKeyword(category);
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
      const categoryToUse = category && category !== 'all' ? category : detectCategoryFromQuery(query);
      const services = await Promise.all(
        (data.results || []).map(async place => {
          const details = await this.getPlaceDetails(place.place_id);
          return mapPlaceToService(place, details, categoryToUse);
        })
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
}

export default GoogleMapsService;
