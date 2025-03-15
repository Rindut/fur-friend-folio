
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Service, ServiceSource } from '@/types/petServices';

// Interface for Google Places API result
interface GooglePlaceResult {
  place_id: string;
  name: string;
  formatted_address?: string;
  vicinity?: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    }
  };
  rating?: number;
  user_ratings_total?: number;
  website?: string;
  formatted_phone_number?: string;
  price_level?: number;
  opening_hours?: {
    weekday_text?: string[];
  };
  types?: string[];
}

// Google Maps API response interfaces
interface GoogleMapsResponse {
  results?: GooglePlaceResult[];
  result?: GooglePlaceResult;
  status: string;
  error?: string;
}

export const useGoogleMapsApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Call the Google Maps API via Supabase Edge Function
   */
  const callGoogleMapsApi = async (action: string, params: any): Promise<GoogleMapsResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('google-maps-api', {
        body: { action, params }
      });
      
      if (error) {
        console.error('Edge function error:', error);
        setError(error.message);
        return { status: 'ERROR', error: error.message };
      }
      
      return data as GoogleMapsResponse;
    } catch (err) {
      console.error('Error calling Google Maps API:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return { status: 'ERROR', error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Search for nearby places
   */
  const searchNearbyPlaces = async (
    category: string,
    location: string,
    radius?: number
  ): Promise<Service[]> => {
    const response = await callGoogleMapsApi('searchNearby', { category, location, radius });
    
    if (response.status !== 'OK' || !response.results) {
      return [];
    }
    
    return mapGooglePlacesToServices(response.results, category);
  };

  /**
   * Search places by text query
   */
  const searchPlacesByText = async (
    query: string,
    category?: string,
    location?: string
  ): Promise<Service[]> => {
    const response = await callGoogleMapsApi('textSearch', { query, category, location });
    
    if (response.status !== 'OK' || !response.results) {
      return [];
    }
    
    return mapGooglePlacesToServices(response.results, category || 'unknown');
  };

  /**
   * Get place details
   */
  const getPlaceDetails = async (placeId: string): Promise<GooglePlaceResult | null> => {
    const response = await callGoogleMapsApi('placeDetails', { placeId });
    
    if (response.status !== 'OK' || !response.result) {
      return null;
    }
    
    return response.result;
  };

  /**
   * Map Google Places results to our Service interface
   */
  const mapGooglePlacesToServices = (places: GooglePlaceResult[], category: string): Service[] => {
    return places.map(place => {
      // Extract city from address
      const addressParts = (place.formatted_address || place.vicinity || '').split(',');
      let city = addressParts.length > 1 ? addressParts[addressParts.length - 2].trim() : 'Unknown';
      // Clean up city name (remove postal codes, etc.)
      city = city.replace(/\d+/g, '').trim();
      
      // Map to our Service interface
      const service: Service = {
        id: `gmaps-${place.place_id}`,
        name: place.name,
        address: place.formatted_address || place.vicinity || '',
        city: city,
        categoryId: category,
        contactPhone: place.formatted_phone_number || '',
        website: place.website || `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
        operatingHours: place.opening_hours?.weekday_text?.join(', ') || '',
        priceRange: place.price_level || 2,
        latitude: place.geometry.location.lat,
        longitude: place.geometry.location.lng,
        verified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        avgRating: place.rating || 0,
        reviewCount: place.user_ratings_total || 0,
        source: ServiceSource.GOOGLE_MAPS,
        externalId: place.place_id,
        externalUrl: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`
      };
      
      return service;
    });
  };

  return {
    loading,
    error,
    searchNearbyPlaces,
    searchPlacesByText,
    getPlaceDetails
  };
};
