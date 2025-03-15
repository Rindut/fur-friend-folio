
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ServiceCategory } from '@/types/petServices';
import { useLanguage } from '@/context/LanguageContext';
import { Search } from 'lucide-react';

interface ServiceSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: ServiceCategory[];
  onSearch: (e: React.FormEvent) => void;
}

const ServiceSearch = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
  onSearch
}: ServiceSearchProps) => {
  const { language } = useLanguage();
  
  const translations = {
    en: {
      searchPlaceholder: 'Search pet services...',
      allCategories: 'All Categories',
      search: 'Search',
    },
    id: {
      searchPlaceholder: 'Cari layanan hewan...',
      allCategories: 'Semua Kategori',
      search: 'Cari',
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
          
          <Button type="submit">
            <Search className="mr-2 h-4 w-4" />
            {t.search}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ServiceSearch;
