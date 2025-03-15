
// Place search-related functions for the Google Maps API
import { 
  getApiKey, 
  getCoordinatesForLocation, 
  mapCategoryToGoogleType, 
  getCategoryKeyword 
} from "./maps.ts";

/**
 * Search for nearby places using Google Places API
 */
export async function searchNearbyPlaces(category: string, location: string, radius: number = 5000) {
  try {
    // Get coordinates for the location
    const coordinates = await getCoordinatesForLocation(location);
    if (!coordinates) {
      return { error: "Could not get coordinates for location", results: [] };
    }

    // Map our category to Google Maps type/keyword
    const googleType = mapCategoryToGoogleType(category);
    const keyword = getCategoryKeyword(category);

    // Build the URL for nearby search
    let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${coordinates.lat},${coordinates.lng}&radius=${radius}&key=${getApiKey()}`;

    // Add type and keyword if available
    if (googleType) url += `&type=${googleType}`;
    if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`;

    // Make the API request
    const response = await fetch(url);
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error in searchNearbyPlaces:", error);
    return { error: error.message, results: [] };
  }
}

/**
 * Search for places by text query using Google Places API
 */
export async function searchPlacesByText(query: string, category?: string, location?: string) {
  try {
    // Get coordinates for the location (if provided)
    let locationParam = "";
    if (location) {
      const coordinates = await getCoordinatesForLocation(location);
      if (coordinates) {
        locationParam = `&location=${coordinates.lat},${coordinates.lng}&radius=5000`;
      }
    }

    // Build category-specific query
    let enhancedQuery = query;
    if (category && category !== "all") {
      const keyword = getCategoryKeyword(category);
      if (keyword) {
        enhancedQuery = `${keyword} ${query}`;
      }
    }

    // Build the URL for text search
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(enhancedQuery)} pet services${locationParam}&key=${getApiKey()}`;

    // Make the API request
    const response = await fetch(url);
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error in searchPlacesByText:", error);
    return { error: error.message, results: [] };
  }
}

/**
 * Get details for a specific place using its place_id
 */
export async function getPlaceDetails(placeId: string) {
  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,geometry,rating,user_ratings_total,formatted_phone_number,website,price_level,opening_hours,types&key=${getApiKey()}`;

    const response = await fetch(url);
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error in getPlaceDetails:", error);
    return { error: error.message, result: null };
  }
}
