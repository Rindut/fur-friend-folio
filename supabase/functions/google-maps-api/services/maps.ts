
// Geographic utility functions for the Google Maps API
import { corsHeaders } from "../../_shared/cors.ts";

const GOOGLE_MAPS_API_KEY = Deno.env.get("GOOGLE_MAPS_API_KEY") || "";

// Common city coordinates in Indonesia for optimization
const CITY_COORDINATES: { [key: string]: { lat: number; lng: number } } = {
  jakarta: { lat: -6.2088, lng: 106.8456 },
  bandung: { lat: -6.9175, lng: 107.6191 },
  surabaya: { lat: -7.2575, lng: 112.7521 },
  yogyakarta: { lat: -7.7972, lng: 110.3688 },
  bali: { lat: -8.3405, lng: 115.092 },
  denpasar: { lat: -8.6705, lng: 115.2126 },
};

/**
 * Get coordinates for a location, using hardcoded values for common Indonesian cities
 * or the Geocoding API for other locations
 */
export async function getCoordinatesForLocation(location: string) {
  try {
    const normalizedLocation = location.toLowerCase();
    if (CITY_COORDINATES[normalizedLocation]) {
      return CITY_COORDINATES[normalizedLocation];
    }

    // If not a known city, use geocoding API
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${GOOGLE_MAPS_API_KEY}`;

    const response = await fetch(geocodeUrl);
    const data = await response.json();

    if (data.status === "OK" && data.results && data.results.length > 0) {
      return data.results[0].geometry.location;
    }

    return null;
  } catch (error) {
    console.error("Error in getCoordinatesForLocation:", error);
    return null;
  }
}

/**
 * Map our category identifiers to Google Maps place type
 */
export function mapCategoryToGoogleType(category: string): string {
  const categoryMap: { [key: string]: string } = {
    veterinary_clinics: "veterinary_care",
    pet_shops: "pet_store",
    grooming_services: "pet_store",
    pet_hotels: "lodging",
    pet_cafes: "cafe",
    pet_friendly_restaurants: "restaurant",
    pet_parks: "park",
    pet_training: "point_of_interest",
  };

  return categoryMap[category] || "";
}

/**
 * Get relevant keyword for Google Maps search based on our category
 */
export function getCategoryKeyword(category: string): string {
  const keywordMap: { [key: string]: string } = {
    veterinary_clinics: "veterinary clinic pet",
    pet_shops: "pet shop store",
    grooming_services: "pet grooming salon",
    pet_hotels: "pet hotel boarding",
    pet_cafes: "pet cafe",
    pet_friendly_restaurants: "pet friendly restaurant",
    pet_parks: "dog park",
    pet_training: "pet training school",
  };

  return keywordMap[category] || "pet";
}

/**
 * Check if the Google Maps API key is configured
 */
export function isApiKeyConfigured(): boolean {
  return !!GOOGLE_MAPS_API_KEY;
}

/**
 * Get the Google Maps API key
 */
export function getApiKey(): string {
  return GOOGLE_MAPS_API_KEY;
}
