
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Star,
  StarHalf,
  ChevronDown,
  Filter,
  Search,
  Check,
  Bookmark,
  Share2,
  ExternalLink,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { Service, ServiceCategory, ServiceSource, mapDbCategoryToServiceCategory, mapDbServiceToService } from '@/types/petServices';
import { useLanguage } from '@/context/LanguageContext';
import externalPlatformsService from '@/services/ExternalPlatformsService';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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
      searchPlaceholder: 'Search pet services...',
      allCategories: 'All Categories',
      filterBy: 'Filter by',
      category: 'Category',
      topRated: 'Top Rated',
      nearest: 'Nearest',
      priceRange: 'Price Range',
      verified: 'Verified',
      search: 'Search',
      noServices: 'No services found',
      tryDifferent: 'Try a different search or filter',
      reviews: 'Reviews',
      noRating: 'No ratings yet',
      open: 'Open',
      closed: 'Closed',
      viewProfile: 'View Profile',
      saveToFavorites: 'Save to Favorites',
      share: 'Share',
      localDatabase: 'Our Database',
      externalPlatforms: 'External Platforms',
      source: 'Source',
      fetchExternal: 'Fetch from External Platforms',
      refreshing: 'Refreshing data...',
      platforms: 'Platforms',
      city: 'City',
      jakarta: 'Jakarta',
      bandung: 'Bandung',
      surabaya: 'Surabaya',
      externalLink: 'View Original',
      importToDb: 'Import to Database',
      importSuccess: 'Service imported successfully',
      importError: 'Error importing service',
    },
    id: {
      title: 'Layanan Hewan Peliharaan Lokal',
      searchPlaceholder: 'Cari layanan hewan...',
      allCategories: 'Semua Kategori',
      filterBy: 'Filter berdasarkan',
      category: 'Kategori',
      topRated: 'Penilaian Tertinggi',
      nearest: 'Terdekat',
      priceRange: 'Rentang Harga',
      verified: 'Terverifikasi',
      search: 'Cari',
      noServices: 'Tidak ada layanan ditemukan',
      tryDifferent: 'Coba pencarian atau filter yang berbeda',
      reviews: 'Ulasan',
      noRating: 'Belum ada penilaian',
      open: 'Buka',
      closed: 'Tutup',
      viewProfile: 'Lihat Profil',
      saveToFavorites: 'Simpan ke Favorit',
      share: 'Bagikan',
      localDatabase: 'Database Kami',
      externalPlatforms: 'Platform Eksternal',
      source: 'Sumber',
      fetchExternal: 'Ambil dari Platform Eksternal',
      refreshing: 'Memperbarui data...',
      platforms: 'Platform',
      city: 'Kota',
      jakarta: 'Jakarta',
      bandung: 'Bandung',
      surabaya: 'Surabaya',
      externalLink: 'Lihat Asli',
      importToDb: 'Impor ke Database',
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

  const getSourceBadgeColor = (source?: ServiceSource): string => {
    switch (source) {
      case ServiceSource.GOOGLE_MAPS: return 'bg-red-500';
      case ServiceSource.INSTAGRAM: return 'bg-purple-500';
      case ServiceSource.FACEBOOK: return 'bg-blue-500';
      case ServiceSource.TOKOPEDIA: return 'bg-green-500';
      case ServiceSource.SHOPEE: return 'bg-orange-500';
      case ServiceSource.INTERNAL: return 'bg-gray-500';
      case ServiceSource.OTHER: return 'bg-gray-400';
      default: return 'bg-gray-300';
    }
  };

  const renderRatingStars = (rating?: number) => {
    if (!rating) return <span className="text-sm text-gray-500">{t.noRating}</span>;
    
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && <StarHalf className="w-4 h-4 fill-yellow-400 text-yellow-400" />}
        {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
          <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
        ))}
        <span className="ml-1 text-sm font-medium">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  const renderPriceRange = (priceRange?: number) => {
    if (!priceRange) return null;
    
    return (
      <span className="font-medium text-gray-700">
        {[...Array(priceRange)].map((_, i) => '₨').join('')}
      </span>
    );
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

  const renderServiceCard = (service: Service, isExternal: boolean = false) => (
    <Card key={service.id} className="overflow-hidden">
      <div className="h-48 bg-gray-100 relative">
        {service.photos && service.photos.length > 0 ? (
          <img 
            src={service.photos.find(p => p.isPrimary)?.url || service.photos[0].url} 
            alt={service.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
            <MapPin className="w-12 h-12 opacity-20" />
          </div>
        )}
        {service.categoryName && (
          <Badge className="absolute top-3 left-3 bg-coral text-white">
            {service.categoryName}
          </Badge>
        )}
        {service.verified && (
          <Badge className="absolute top-3 right-3 bg-green-500 text-white">
            <Check className="mr-1 h-3 w-3" /> {t.verified}
          </Badge>
        )}
        {service.source && service.source !== ServiceSource.INTERNAL && (
          <Badge className={`absolute bottom-3 right-3 text-white ${getSourceBadgeColor(service.source)}`}>
            {getSourceDisplayName(service.source)}
          </Badge>
        )}
      </div>
      
      <CardHeader>
        <CardTitle className="flex justify-between items-start">
          <div>
            {service.name}
            <div className="flex mt-1 text-sm font-normal">
              {renderRatingStars(service.avgRating)}
              {service.reviewCount && (
                <span className="ml-2 text-gray-500">
                  ({service.reviewCount} {t.reviews})
                </span>
              )}
            </div>
          </div>
          <div>{renderPriceRange(service.priceRange)}</div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-2 pb-0">
        <div className="flex items-start">
          <MapPin className="mr-2 h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
          <span className="text-sm">{service.address}, {service.city}</span>
        </div>
        
        {service.operatingHours && (
          <div className="flex items-start">
            <Clock className="mr-2 h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <span className="text-sm">{service.operatingHours}</span>
          </div>
        )}
        
        {service.contactPhone && (
          <div className="flex items-start">
            <Phone className="mr-2 h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <span className="text-sm">{service.contactPhone}</span>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between pt-4">
        {isExternal && service.externalUrl ? (
          <Button 
            onClick={() => window.open(service.externalUrl, '_blank')} 
            variant="default"
            className="flex items-center"
          >
            {t.externalLink}
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button 
            onClick={() => navigate(`/services/${service.id}`)} 
            variant="default"
          >
            {t.viewProfile}
          </Button>
        )}
        
        <div className="flex gap-2">
          {isExternal && (
            <Button onClick={() => handleImportService(service)} variant="outline">
              {t.importToDb}
            </Button>
          )}
          <Button size="icon" variant="outline">
            <Bookmark className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="outline">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );

  return (
    <div className="container px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t.title}</h1>
      
      <Tabs defaultValue="internal" value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="internal">{t.localDatabase}</TabsTrigger>
          <TabsTrigger value="external">{t.externalPlatforms}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="internal">
          {/* Search and Filter Section for Internal */}
          <div className="mb-8 bg-white p-4 rounded-lg shadow-sm">
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t.searchPlaceholder}
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select 
                value={selectedCategory} 
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t.allCategories} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t.allCategories}</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button type="submit">
                <Filter className="mr-2 h-4 w-4" />
                {t.search}
              </Button>
            </form>
          </div>
          
          {/* Internal Services Listing */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <CardHeader>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="h-9 bg-gray-200 rounded w-full"></div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => renderServiceCard(service))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">{t.noServices}</h3>
              <p className="text-gray-500">{t.tryDifferent}</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="external">
          {/* External Platforms Search and Filter */}
          <div className="mb-8 bg-white p-4 rounded-lg shadow-sm">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t.searchPlaceholder}
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <Select 
                  value={selectedCategory} 
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t.allCategories} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">{t.allCategories}</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select
                  value={selectedCity}
                  onValueChange={setSelectedCity}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t.city} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jakarta">{t.jakarta}</SelectItem>
                    <SelectItem value="bandung">{t.bandung}</SelectItem>
                    <SelectItem value="surabaya">{t.surabaya}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium mb-2">{t.platforms}</h4>
                <div className="flex flex-wrap gap-2">
                  {['Google Maps', 'Instagram', 'Facebook', 'Tokopedia', 'Shopee'].map((platform) => (
                    <Badge 
                      key={platform}
                      variant={enabledPlatforms.includes(platform) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => togglePlatform(platform)}
                    >
                      {platform}
                      {enabledPlatforms.includes(platform) && <Check className="ml-1 h-3 w-3" />}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <Button 
                type="button" 
                onClick={handleFetchExternal} 
                disabled={externalLoading} 
                className="w-full"
              >
                {externalLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    {t.refreshing}
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    {t.fetchExternal}
                  </>
                )}
              </Button>
            </form>
          </div>
          
          {/* External Results */}
          {externalLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <CardHeader>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="h-9 bg-gray-200 rounded w-full"></div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : externalServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {externalServices.map((service) => renderServiceCard(service, true))}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed rounded-lg">
              <AlertCircle className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium mb-2">No external data</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Use the search form above to fetch data from external platforms like Google Maps, Instagram, Facebook, etc.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LocalServices;
