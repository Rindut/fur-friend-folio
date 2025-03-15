
import { Service, ServiceSource } from '@/types/petServices';

// Define interface for Google Maps Place Result
export interface GooglePlaceResult {
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
export interface GoogleMapsPlacesResponse {
  results: GooglePlaceResult[];
  status: string;
  next_page_token?: string;
}

// Define interface for Place Details Response
export interface GoogleMapsPlaceDetailsResponse {
  result: GooglePlaceResult;
  status: string;
}
