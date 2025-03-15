import { supabase } from '@/integrations/supabase/client';
import { Service, Review, ServiceSource, ExternalPlatformService, mapDbServiceToService } from '@/types/petServices';
import { useGoogleMapsApi } from '@/hooks/useGoogleMapsApi';
import GoogleMapsService from './GoogleMapsService';

// Google Maps API key - Replace with your actual API key or use Supabase secrets
const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';

class RealGoogleMapsService implements ExternalPlatformService {
  name = 'Google Maps';
  enabled = true;
  private googleMapsService: GoogleMapsService;
  
  constructor(apiKey: string) {
    this.googleMapsService = new GoogleMapsService(apiKey);
  }

  async fetchServices(category: string, location: string): Promise<Service[]> {
    console.log(`Fetching ${category} services in ${location} from Google Maps API`);
    return this.googleMapsService.searchNearbyPlaces(category, location);
  }

  async fetchReviews(serviceId: string): Promise<Review[]> {
    console.log(`Fetching reviews for service ${serviceId} from Google Maps`);
    // Google Maps API doesn't easily allow review fetching without significant complexity
    // Would require additional API calls and processing
    return [];
  }

  async searchServices(query: string, category?: string, location?: string): Promise<Service[]> {
    console.log(`Searching for ${query} in ${category || 'all categories'} at ${location || 'all locations'} on Google Maps`);
    return this.googleMapsService.searchPlacesByText(query, category, location);
  }
}

// Continue with mock services for other platforms
class MockInstagramService implements ExternalPlatformService {
  name = 'Instagram';
  enabled = true;

  async fetchServices(category: string, location: string): Promise<Service[]> {
    console.log(`Fetching ${category} services in ${location} from Instagram`);
    const mockData = this.generateMockData(category, location, 4);
    return mockData;
  }

  async fetchReviews(serviceId: string): Promise<Review[]> {
    console.log(`Fetching reviews for service ${serviceId} from Instagram`);
    return [];
  }

  async searchServices(query: string, category?: string, location?: string): Promise<Service[]> {
    console.log(`Searching for ${query} in ${category || 'all categories'} at ${location || 'all locations'} on Instagram`);
    return this.generateMockData(category || 'search', location || 'nearby', 3, query);
  }

  private generateMockData(category: string, location: string, count: number, query?: string): Service[] {
    const services: Service[] = [];
    const searchTerm = query ? ` ${query}` : '';
    
    for (let i = 0; i < count; i++) {
      const name = `${category.charAt(0).toUpperCase() + category.slice(1)}${searchTerm} #${i + 1} (Instagram)`;
      services.push({
        id: `ig-${category}-${i}-${Date.now()}`,
        name,
        address: `${i + 200} ${location.charAt(0).toUpperCase() + location.slice(1)} Avenue`,
        city: location.charAt(0).toUpperCase() + location.slice(1),
        categoryId: category,
        contactPhone: `+62 822-${Math.floor(10000000 + Math.random() * 90000000)}`,
        website: `https://instagram.com/example-${i}`,
        priceRange: Math.floor(1 + Math.random() * 3),
        verified: Math.random() > 0.5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        avgRating: 3.5 + Math.random() * 1.5,
        reviewCount: Math.floor(Math.random() * 100),
        source: ServiceSource.INSTAGRAM,
        externalId: `ig-${i}-${Date.now()}`,
        externalUrl: `https://instagram.com/example-${i}`
      });
    }
    return services;
  }
}

class MockTokopediaService implements ExternalPlatformService {
  name = 'Tokopedia';
  enabled = true;

  async fetchServices(category: string, location: string): Promise<Service[]> {
    console.log(`Fetching ${category} services in ${location} from Tokopedia`);
    const mockData = this.generateMockData(category, location, 5);
    return mockData;
  }

  async fetchReviews(serviceId: string): Promise<Review[]> {
    console.log(`Fetching reviews for service ${serviceId} from Tokopedia`);
    return [];
  }

  async searchServices(query: string, category?: string, location?: string): Promise<Service[]> {
    console.log(`Searching for ${query} in ${category || 'all categories'} at ${location || 'all locations'} on Tokopedia`);
    return this.generateMockData(category || 'search', location || 'nearby', 3, query);
  }

  private generateMockData(category: string, location: string, count: number, query?: string): Service[] {
    const services: Service[] = [];
    const searchTerm = query ? ` ${query}` : '';
    
    for (let i = 0; i < count; i++) {
      const name = `${category.charAt(0).toUpperCase() + category.slice(1)}${searchTerm} #${i + 1} (Tokopedia)`;
      services.push({
        id: `tokopedia-${category}-${i}-${Date.now()}`,
        name,
        address: `${i + 300} ${location.charAt(0).toUpperCase() + location.slice(1)} Boulevard`,
        city: location.charAt(0).toUpperCase() + location.slice(1),
        categoryId: category,
        contactPhone: `+62 823-${Math.floor(10000000 + Math.random() * 90000000)}`,
        website: `https://tokopedia.com/example-${i}`,
        priceRange: Math.floor(1 + Math.random() * 3),
        verified: Math.random() > 0.4,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        avgRating: 4 + Math.random() * 1,
        reviewCount: Math.floor(Math.random() * 200),
        source: ServiceSource.TOKOPEDIA,
        externalId: `tokopedia-${i}-${Date.now()}`,
        externalUrl: `https://tokopedia.com/example-${i}`
      });
    }
    return services;
  }
}

class MockFacebookService implements ExternalPlatformService {
  name = 'Facebook';
  enabled = true;

  async fetchServices(category: string, location: string): Promise<Service[]> {
    console.log(`Fetching ${category} services in ${location} from Facebook`);
    const mockData = this.generateMockData(category, location, 4);
    return mockData;
  }

  async fetchReviews(serviceId: string): Promise<Review[]> {
    console.log(`Fetching reviews for service ${serviceId} from Facebook`);
    return [];
  }

  async searchServices(query: string, category?: string, location?: string): Promise<Service[]> {
    console.log(`Searching for ${query} in ${category || 'all categories'} at ${location || 'all locations'} on Facebook`);
    return this.generateMockData(category || 'search', location || 'nearby', 3, query);
  }

  private generateMockData(category: string, location: string, count: number, query?: string): Service[] {
    const services: Service[] = [];
    const searchTerm = query ? ` ${query}` : '';
    
    for (let i = 0; i < count; i++) {
      const name = `${category.charAt(0).toUpperCase() + category.slice(1)}${searchTerm} #${i + 1} (Facebook)`;
      services.push({
        id: `fb-${category}-${i}-${Date.now()}`,
        name,
        address: `${i + 400} ${location.charAt(0).toUpperCase() + location.slice(1)} Road`,
        city: location.charAt(0).toUpperCase() + location.slice(1),
        categoryId: category,
        contactPhone: `+62 824-${Math.floor(10000000 + Math.random() * 90000000)}`,
        website: `https://facebook.com/example-${i}`,
        priceRange: Math.floor(1 + Math.random() * 3),
        verified: Math.random() > 0.6,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        avgRating: 3 + Math.random() * 2,
        reviewCount: Math.floor(Math.random() * 150),
        source: ServiceSource.FACEBOOK,
        externalId: `fb-${i}-${Date.now()}`,
        externalUrl: `https://facebook.com/example-${i}`
      });
    }
    return services;
  }
}

class MockShopeeService implements ExternalPlatformService {
  name = 'Shopee';
  enabled = true;

  async fetchServices(category: string, location: string): Promise<Service[]> {
    console.log(`Fetching ${category} services in ${location} from Shopee`);
    const mockData = this.generateMockData(category, location, 3);
    return mockData;
  }

  async fetchReviews(serviceId: string): Promise<Review[]> {
    console.log(`Fetching reviews for service ${serviceId} from Shopee`);
    return [];
  }

  async searchServices(query: string, category?: string, location?: string): Promise<Service[]> {
    console.log(`Searching for ${query} in ${category || 'all categories'} at ${location || 'all locations'} on Shopee`);
    return this.generateMockData(category || 'search', location || 'nearby', 3, query);
  }

  private generateMockData(category: string, location: string, count: number, query?: string): Service[] {
    const services: Service[] = [];
    const searchTerm = query ? ` ${query}` : '';
    
    for (let i = 0; i < count; i++) {
      const name = `${category.charAt(0).toUpperCase() + category.slice(1)}${searchTerm} #${i + 1} (Shopee)`;
      services.push({
        id: `shopee-${category}-${i}-${Date.now()}`,
        name,
        address: `${i + 500} ${location.charAt(0).toUpperCase() + location.slice(1)} Lane`,
        city: location.charAt(0).toUpperCase() + location.slice(1),
        categoryId: category,
        contactPhone: `+62 825-${Math.floor(10000000 + Math.random() * 90000000)}`,
        website: `https://shopee.co.id/example-${i}`,
        priceRange: Math.floor(1 + Math.random() * 3),
        verified: Math.random() > 0.3,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        avgRating: 4 + Math.random() * 1,
        reviewCount: Math.floor(Math.random() * 300),
        source: ServiceSource.SHOPEE,
        externalId: `shopee-${i}-${Date.now()}`,
        externalUrl: `https://shopee.co.id/example-${i}`
      });
    }
    return services;
  }
}

export class ExternalPlatformsService {
  private platforms: ExternalPlatformService[] = [];
  
  constructor() {
    // Initialize supported platforms
    this.platforms = [
      new RealGoogleMapsService(GOOGLE_MAPS_API_KEY),
      new MockInstagramService(),
      new MockFacebookService(),
      new MockTokopediaService(),
      new MockShopeeService()
    ];
  }

  // Get all enabled platforms
  getPlatforms(): ExternalPlatformService[] {
    return this.platforms.filter(platform => platform.enabled);
  }

  // Get platform by name
  getPlatform(name: string): ExternalPlatformService | undefined {
    return this.platforms.find(platform => 
      platform.name.toLowerCase() === name.toLowerCase() && platform.enabled
    );
  }

  // Fetch services from all enabled platforms
  async fetchServicesFromAll(category: string, location: string): Promise<Service[]> {
    const enabledPlatforms = this.getPlatforms();
    const allResults: Service[] = [];
    
    const promises = enabledPlatforms.map(platform => 
      platform.fetchServices(category, location)
        .then(services => {
          allResults.push(...services);
          return services;
        })
        .catch(error => {
          console.error(`Error fetching from ${platform.name}:`, error);
          return [] as Service[];
        })
    );
    
    await Promise.all(promises);
    return allResults;
  }
  
  // Search across all enabled platforms
  async searchAcrossAll(query: string, category?: string, location?: string): Promise<Service[]> {
    const enabledPlatforms = this.getPlatforms();
    const allResults: Service[] = [];
    
    const promises = enabledPlatforms.map(platform => 
      platform.searchServices(query, category, location)
        .then(services => {
          allResults.push(...services);
          return services;
        })
        .catch(error => {
          console.error(`Error searching on ${platform.name}:`, error);
          return [] as Service[];
        })
    );
    
    await Promise.all(promises);
    return allResults;
  }

  // Save external services to database for persistence
  async saveExternalService(service: Service): Promise<Service | null> {
    try {
      const { data, error } = await supabase
        .from('services')
        .insert({
          name: service.name,
          description: service.description,
          address: service.address,
          city: service.city,
          category_id: service.categoryId,
          contact_phone: service.contactPhone,
          contact_email: service.contactEmail,
          website: service.website,
          operating_hours: service.operatingHours,
          price_range: service.priceRange,
          latitude: service.latitude,
          longitude: service.longitude,
          verified: service.verified,
          source: service.source,
          external_id: service.externalId,
          external_url: service.externalUrl
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error saving external service:', error);
        return null;
      }
      
      return mapDbServiceToService(data);
    } catch (error) {
      console.error('Error in saveExternalService:', error);
      return null;
    }
  }
}

// Singleton instance
const externalPlatformsService = new ExternalPlatformsService();
export default externalPlatformsService;
