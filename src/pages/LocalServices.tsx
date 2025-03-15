import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Service, ServiceCategory, ServiceSource, mapDbCategoryToServiceCategory, mapDbServiceToService } from '@/types/petServices';
import { useLanguage } from '@/context/LanguageContext';
import externalPlatformsService from '@/services/ExternalPlatformsService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import our new components
import ServiceSearch from '@/components/local-services/ServiceSearch';
import ExternalServiceSearch from '@/components/local-services/ExternalServiceSearch';
import ServicesList from '@/components/local-services/ServicesList';
import EmptyExternalServices from '@/components/local-services/EmptyExternalServices';

const LocalServices = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { language } = useLanguage();
  
  const [services, setServices] = useState<Service[]>([]);
  const [externalServices, setExternalServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [externalLoading, setExternalLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('internal');
  const [selectedCity, setSelectedCity] = useState('jakarta');
  const [enabledPlatforms, setEnabledPlatforms] = useState<string[]>([
    'Google Maps', 'Instagram', 'Facebook', 'Tokopedia', 'Shopee'
  ]);
  
  const translations = {
    en: {
      title: 'Local Pet Services',
      localDatabase: 'Our Database',
      externalPlatforms: 'External Platforms',
      importSuccess: 'Service imported successfully',
      importError: 'Error importing service',
    },
    id: {
      title: 'Layanan Hewan Peliharaan Lokal',
      localDatabase: 'Database Kami',
      externalPlatforms: 'Platform Eksternal',
      importSuccess: 'Layanan berhasil diimpor',
      importError: 'Gagal mengimpor layanan',
    }
  };
  
  const t = translations[language];

  useEffect(() => {
    fetchCategories();
    fetchServices();
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('service_categories')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: 'Error',
        description: 'Failed to load service categories',
        variant: 'destructive',
      });
    } else {
      setCategories(data.map(mapDbCategoryToServiceCategory));
    }
  };

  const fetchServices = async () => {
    setLoading(true);
    
    let query = supabase
      .from('services')
      .select(`
        *,
        service_categories(name)
      `);
    
    if (selectedCategory) {
      query = query.eq('category_id', selectedCategory);
    }
    
    if (searchQuery) {
      query = query.ilike('name', `%${searchQuery}%`);
    }
    
    const { data, error } = await query.order('name');
    
    if (error) {
      console.error('Error fetching services:', error);
      toast({
        title: 'Error',
        description: 'Failed to load pet services',
        variant: 'destructive',
      });
    } else {
      // Process data to get category name and convert to our Service type
      const processedServices = data.map(service => {
        return mapDbServiceToService({
          ...service,
          category_name: service.service_categories?.name
        });
      });
      
      setServices(processedServices);
    }
    
    setLoading(false);
  };

  // Filter services when category or search query changes
  useEffect(() => {
    fetchServices();
  }, [selectedCategory, searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'internal') {
      fetchServices();
    } else {
      handleFetchExternal();
    }
  };

  const handleFetchExternal = async () => {
    setExternalLoading(true);
    try {
      let externalData: Service[] = [];
      
      if (searchQuery) {
        // Search across platforms
        externalData = await externalPlatformsService.searchAcrossAll(
          searchQuery, 
          selectedCategory, 
          selectedCity
        );
      } else {
        // Fetch by category and location
        externalData = await externalPlatformsService.fetchServicesFromAll(
          selectedCategory || 'all',
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
          description: t.importSuccess,
        });
        
        // Refresh internal services list
        fetchServices();
      } else {
        toast({
          title: 'Error',
          description: t.importError,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error importing service:', error);
      toast({
        title: 'Error',
        description: t.importError,
        variant: 'destructive',
      });
    }
  };

  const getSourceDisplayName = (source?: ServiceSource): string => {
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

  return (
    <div className="container px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t.title}</h1>
      
      <Tabs defaultValue="internal" value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="internal">{t.localDatabase}</TabsTrigger>
          <TabsTrigger value="external">{t.externalPlatforms}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="internal">
          {/* Internal Services Search */}
          <ServiceSearch 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categories={categories}
            onSearch={handleSearch}
          />
          
          {/* Internal Services List */}
          <ServicesList 
            services={services} 
            loading={loading} 
          />
        </TabsContent>
        
        <TabsContent value="external">
          {/* External Services Search */}
          <ExternalServiceSearch 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            enabledPlatforms={enabledPlatforms}
            togglePlatform={togglePlatform}
            categories={categories}
            onSearch={handleSearch}
            handleFetchExternal={handleFetchExternal}
            externalLoading={externalLoading}
          />
          
          {/* External Services List */}
          {externalServices.length > 0 || externalLoading ? (
            <ServicesList 
              services={externalServices} 
              loading={externalLoading} 
              isExternal={true}
              onImport={handleImportService}
            />
          ) : (
            <EmptyExternalServices />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LocalServices;
