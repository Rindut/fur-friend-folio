
import { Service, ServiceSource } from '@/types/petServices';
import { GooglePlaceResult } from './types';
import { detectCategoryFromPlaceTypes } from './categoryMapper';

/**
 * Map Google Place to our Service interface
 */
export function mapPlaceToService(
  place: GooglePlaceResult, 
  placeDetails: GooglePlaceResult | null,
  category: string
): Service {
  try {
    const mergedPlace = placeDetails ? { ...place, ...placeDetails } : place;
    
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
      categoryId: category || detectCategoryFromPlaceTypes(mergedPlace.types || []),
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
