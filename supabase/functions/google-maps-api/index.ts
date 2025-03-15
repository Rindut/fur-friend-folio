
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

// Get Google Maps API key from environment variable
const GOOGLE_MAPS_API_KEY = Deno.env.get("GOOGLE_MAPS_API_KEY") || "";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Ensure we have API key configured
  if (!GOOGLE_MAPS_API_KEY) {
    return new Response(
      JSON.stringify({ error: "Google Maps API key not configured" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  try {
    // Parse request body
    const { action, params } = await req.json();

    // Validate request
    if (!action) {
      return new Response(
        JSON.stringify({ error: "Missing required 'action' parameter" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    let responseData;

    // Handle different actions
    switch (action) {
      case "searchNearby":
        // Search nearby places
        const { category, location, radius } = params || {};
        responseData = await searchNearbyPlaces(category, location, radius);
        break;

      case "textSearch":
        // Text search for places
        const { query, category: searchCategory, location: searchLocation } = params || {};
        responseData = await searchPlacesByText(query, searchCategory, searchLocation);
        break;

      case "placeDetails":
        // Get place details
        const { placeId } = params || {};
        responseData = await getPlaceDetails(placeId);
        break;

      default:
        return new Response(
          JSON.stringify({ error: `Unsupported action: ${action}` }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
    }

    // Return response
    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error handling request:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

// Google Maps API helpers
async function searchNearbyPlaces(category: string, location: string, radius: number = 5000) {
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
    let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${coordinates.lat},${coordinates.lng}&radius=${radius}&key=${GOOGLE_MAPS_API_KEY}`;

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

async function searchPlacesByText(query: string, category?: string, location?: string) {
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
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(enhancedQuery)} pet services${locationParam}&key=${GOOGLE_MAPS_API_KEY}`;

    // Make the API request
    const response = await fetch(url);
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error in searchPlacesByText:", error);
    return { error: error.message, results: [] };
  }
}

async function getPlaceDetails(placeId: string) {
  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,geometry,rating,user_ratings_total,formatted_phone_number,website,price_level,opening_hours,types&key=${GOOGLE_MAPS_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error in getPlaceDetails:", error);
    return { error: error.message, result: null };
  }
}

async function getCoordinatesForLocation(location: string) {
  try {
    // For common Indonesian cities, use hardcoded coordinates for efficiency
    const cityCoordinates: { [key: string]: { lat: number; lng: number } } = {
      jakarta: { lat: -6.2088, lng: 106.8456 },
      bandung: { lat: -6.9175, lng: 107.6191 },
      surabaya: { lat: -7.2575, lng: 112.7521 },
      yogyakarta: { lat: -7.7972, lng: 110.3688 },
      bali: { lat: -8.3405, lng: 115.092 },
      denpasar: { lat: -8.6705, lng: 115.2126 },
    };

    const normalizedLocation = location.toLowerCase();
    if (cityCoordinates[normalizedLocation]) {
      return cityCoordinates[normalizedLocation];
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

// Helper functions
function mapCategoryToGoogleType(category: string): string {
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

function getCategoryKeyword(category: string): string {
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
