
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { isApiKeyConfigured } from "./services/maps.ts";
import { 
  searchNearbyPlaces, 
  searchPlacesByText, 
  getPlaceDetails 
} from "./services/places.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Ensure we have API key configured
  if (!isApiKeyConfigured()) {
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
