
import { Database } from '@/integrations/supabase/types';

// Service Category
export interface ServiceCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  createdAt: string;
}

// Service
export interface Service {
  id: string;
  name: string;
  description?: string;
  address: string;
  city: string;
  categoryId: string;
  categoryName?: string;
  contactPhone?: string;
  contactEmail?: string;
  website?: string;
  operatingHours?: string;
  priceRange?: number;
  latitude?: number;
  longitude?: number;
  verified: boolean;
  ownerId?: string;
  createdAt: string;
  updatedAt: string;
  avgRating?: number;
  reviewCount?: number;
  photos?: ServicePhoto[];
  source?: ServiceSource; // Added source tracking
  externalId?: string;    // ID from external platform
  externalUrl?: string;   // Link to the service on external platform
}

// External Data Sources
export enum ServiceSource {
  INTERNAL = 'internal',
  GOOGLE_MAPS = 'google_maps',
  INSTAGRAM = 'instagram',
  FACEBOOK = 'facebook',
  TOKOPEDIA = 'tokopedia',
  SHOPEE = 'shopee',
  OTHER = 'other'
}

// Service Photo
export interface ServicePhoto {
  id: string;
  serviceId: string;
  url: string;
  caption?: string;
  isPrimary: boolean;
  createdAt: string;
  updatedBy?: string;
  source?: ServiceSource;
}

// Review
export interface Review {
  id: string;
  serviceId: string;
  userId: string;
  overallRating: number;
  serviceQuality?: number;
  cleanliness?: number;
  staffFriendliness?: number;
  valueForMoney?: number;
  locationAccessibility?: number;
  facilityQuality?: number;
  content?: string;
  visitDate?: string;
  serviceUsed?: string;
  pricePaid?: number;
  wouldRecommend?: boolean;
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
  username?: string;
  userAvatar?: string;
  photos?: ReviewPhoto[];
  source?: ServiceSource;
  externalReviewUrl?: string;
}

// Review Photo
export interface ReviewPhoto {
  id: string;
  reviewId: string;
  url: string;
  createdAt: string;
  source?: ServiceSource;
}

// External Platform Service Interface
export interface ExternalPlatformService {
  fetchServices: (category: string, location: string) => Promise<Service[]>;
  fetchReviews: (serviceId: string) => Promise<Review[]>;
  searchServices: (query: string, category?: string, location?: string) => Promise<Service[]>;
  name: string;
  enabled: boolean;
}

// Helper functions to map DB records to our application types
export const mapDbCategoryToServiceCategory = (dbCategory: any): ServiceCategory => {
  return {
    id: dbCategory.id,
    name: dbCategory.name,
    description: dbCategory.description,
    icon: dbCategory.icon,
    createdAt: dbCategory.created_at
  };
};

export const mapDbServiceToService = (dbService: any): Service => {
  return {
    id: dbService.id,
    name: dbService.name,
    description: dbService.description,
    address: dbService.address,
    city: dbService.city,
    categoryId: dbService.category_id,
    categoryName: dbService.category_name,
    contactPhone: dbService.contact_phone,
    contactEmail: dbService.contact_email,
    website: dbService.website,
    operatingHours: dbService.operating_hours,
    priceRange: dbService.price_range,
    latitude: dbService.latitude,
    longitude: dbService.longitude,
    verified: dbService.verified,
    ownerId: dbService.owner_id,
    createdAt: dbService.created_at,
    updatedAt: dbService.updated_at,
    avgRating: dbService.avg_rating,
    reviewCount: dbService.review_count,
    source: dbService.source || ServiceSource.INTERNAL,
    externalId: dbService.external_id,
    externalUrl: dbService.external_url
  };
};

export const mapDbPhotoToServicePhoto = (dbPhoto: any): ServicePhoto => {
  return {
    id: dbPhoto.id,
    serviceId: dbPhoto.service_id,
    url: dbPhoto.url,
    caption: dbPhoto.caption,
    isPrimary: dbPhoto.is_primary,
    createdAt: dbPhoto.created_at,
    updatedBy: dbPhoto.updated_by,
    source: dbPhoto.source || ServiceSource.INTERNAL
  };
};

export const mapDbReviewToReview = (dbReview: any): Review => {
  return {
    id: dbReview.id,
    serviceId: dbReview.service_id,
    userId: dbReview.user_id,
    overallRating: dbReview.overall_rating,
    serviceQuality: dbReview.service_quality,
    cleanliness: dbReview.cleanliness,
    staffFriendliness: dbReview.staff_friendliness,
    valueForMoney: dbReview.value_for_money,
    locationAccessibility: dbReview.location_accessibility,
    facilityQuality: dbReview.facility_quality,
    content: dbReview.content,
    visitDate: dbReview.visit_date,
    serviceUsed: dbReview.service_used,
    pricePaid: dbReview.price_paid,
    wouldRecommend: dbReview.would_recommend,
    helpfulCount: dbReview.helpful_count,
    createdAt: dbReview.created_at,
    updatedAt: dbReview.updated_at,
    username: dbReview.username,
    userAvatar: dbReview.user_avatar,
    source: dbReview.source || ServiceSource.INTERNAL,
    externalReviewUrl: dbReview.external_review_url
  };
};

export const mapDbPhotoToReviewPhoto = (dbPhoto: any): ReviewPhoto => {
  return {
    id: dbPhoto.id,
    reviewId: dbPhoto.review_id,
    url: dbPhoto.url,
    createdAt: dbPhoto.created_at,
    source: dbPhoto.source || ServiceSource.INTERNAL
  };
};
