
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Service, ServiceSource } from '@/types/petServices';
import externalPlatformsService from '@/services/ExternalPlatformsService';

export const useExternalServices = (onServiceImported: () => void) => {
  const { toast } = useToast();
  const [externalServices, setExternalServices] = useState<Service[]>([]);
  const [externalLoading, setExternalLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState('jakarta');
  const [enabledPlatforms, setEnabledPlatforms] = useState<string[]>([
    'Google Maps', 'Instagram', 'Facebook', 'Tokopedia', 'Shopee'
  ]);

  const handleFetchExternal = async (searchQuery: string, selectedCategory: string) => {
    setExternalLoading(true);
    try {
      let externalData: Service[] = [];
      
      if (searchQuery) {
        // Search across platforms
        externalData = await externalPlatformsService.searchAcrossAll(
          searchQuery, 
          selectedCategory === "all" ? undefined : selectedCategory, 
          selectedCity
        );
      } else {
        // Fetch by category and location
        externalData = await externalPlatformsService.fetchServicesFromAll(
          selectedCategory === "all" ? "all" : selectedCategory,
          selectedCity
        );
      }
      
      // Filter by enabled platforms
      const filteredData = externalData.filter(service => 
        service.source && 
        enabledPlatforms.includes(getSourceDisplayName(service.source))
      );
      
      setExternalServices(filteredData);
      
      toast({
        title: 'Success',
        description: `Found ${filteredData.length} external services`,
      });
    } catch (error) {
      console.error('Error fetching external services:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch from external platforms',
        variant: 'destructive',
      });
    } finally {
      setExternalLoading(false);
    }
  };

  const handleImportService = async (service: Service) => {
    try {
      const result = await externalPlatformsService.saveExternalService(service);
      
      if (result) {
        toast({
          title: 'Success',
          description: 'Service imported successfully',
        });
        
        // Refresh internal services list
        onServiceImported();
      } else {
        toast({
          title: 'Error',
          description: 'Error importing service',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error importing service:', error);
      toast({
        title: 'Error',
        description: 'Error importing service',
        variant: 'destructive',
      });
    }
  };

  const togglePlatform = (platform: string) => {
    setEnabledPlatforms(prev => {
      if (prev.includes(platform)) {
        return prev.filter(p => p !== platform);
      } else {
        return [...prev, platform];
      }
    });
  };

  return {
    externalServices,
    externalLoading,
    selectedCity,
    setSelectedCity,
    enabledPlatforms,
    togglePlatform,
    handleFetchExternal,
    handleImportService
  };
};

// Helper function to get the display name of a service source
function getSourceDisplayName(source?: ServiceSource): string {
  switch (source) {
    case ServiceSource.GOOGLE_MAPS: return 'Google Maps';
    case ServiceSource.INSTAGRAM: return 'Instagram';
    case ServiceSource.FACEBOOK: return 'Facebook';
    case ServiceSource.TOKOPEDIA: return 'Tokopedia';
    case ServiceSource.SHOPEE: return 'Shopee';
    case ServiceSource.INTERNAL: return 'Our Database';
    case ServiceSource.OTHER: return 'Other';
    default: return 'Unknown';
  }
}
