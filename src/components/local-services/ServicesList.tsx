
import { Service } from '@/types/petServices';
import ServiceCard from './ServiceCard';
import ServiceCardSkeleton from './ServiceCardSkeleton';
import { useLanguage } from '@/context/LanguageContext';
import { Search } from 'lucide-react';

interface ServicesListProps {
  services: Service[];
  loading: boolean;
  isExternal?: boolean;
  onImport?: (service: Service) => Promise<void>;
}

const ServicesList = ({ services, loading, isExternal = false, onImport }: ServicesListProps) => {
  const { language } = useLanguage();
  
  const translations = {
    en: {
      noServices: 'No services found',
      tryDifferent: 'Try a different search or filter',
    },
    id: {
      noServices: 'Tidak ada layanan ditemukan',
      tryDifferent: 'Coba pencarian atau filter yang berbeda',
    }
  };
  
  const t = translations[language];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <ServiceCardSkeleton key={i} />
        ))}
      </div>
    );
  }
  
  if (services.length > 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <ServiceCard 
            key={service.id} 
            service={service} 
            isExternal={isExternal} 
            onImport={onImport} 
          />
        ))}
      </div>
    );
  }
  
  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
        <Search className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium mb-2">{t.noServices}</h3>
      <p className="text-gray-500">{t.tryDifferent}</p>
    </div>
  );
};

export default ServicesList;
