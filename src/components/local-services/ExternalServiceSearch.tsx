
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ServiceCategory } from '@/types/petServices';
import { useLanguage } from '@/context/LanguageContext';
import { Search, RefreshCw, Check } from 'lucide-react';

interface ExternalServiceSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  enabledPlatforms: string[];
  togglePlatform: (platform: string) => void;
  categories: ServiceCategory[];
  onSearch: (e: React.FormEvent) => void;
  handleFetchExternal: () => Promise<void>;
  externalLoading: boolean;
}

const ExternalServiceSearch = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedCity,
  setSelectedCity,
  enabledPlatforms,
  togglePlatform,
  categories,
  onSearch,
  handleFetchExternal,
  externalLoading
}: ExternalServiceSearchProps) => {
  const { language } = useLanguage();
  
  const translations = {
    en: {
      searchPlaceholder: 'Search pet services...',
      allCategories: 'All Categories',
      city: 'City',
      jakarta: 'Jakarta',
      bandung: 'Bandung',
      surabaya: 'Surabaya',
      platforms: 'Platforms',
      fetchExternal: 'Fetch from External Platforms',
      refreshing: 'Refreshing data...',
    },
    id: {
      searchPlaceholder: 'Cari layanan hewan...',
      allCategories: 'Semua Kategori',
      city: 'Kota',
      jakarta: 'Jakarta',
      bandung: 'Bandung',
      surabaya: 'Surabaya',
      platforms: 'Platform',
      fetchExternal: 'Ambil dari Platform Eksternal',
      refreshing: 'Memperbarui data...',
    }
  };
  
  const t = translations[language];

  return (
    <div className="mb-8 bg-white p-4 rounded-lg shadow-sm">
      <form onSubmit={onSearch} className="space-y-4">
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
              <SelectItem value="all">{t.allCategories}</SelectItem>
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
  );
};

export default ExternalServiceSearch;
