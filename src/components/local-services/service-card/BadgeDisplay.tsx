
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { ServiceSource } from '@/types/petServices';
import { useLanguage } from '@/context/LanguageContext';

interface BadgeDisplayProps {
  categoryName?: string;
  verified?: boolean;
  source?: ServiceSource;
}

export const BadgeDisplay = ({ categoryName, verified, source }: BadgeDisplayProps) => {
  const { language } = useLanguage();
  
  const translations = {
    en: {
      verified: 'Verified',
    },
    id: {
      verified: 'Terverifikasi',
    }
  };
  
  const t = translations[language];

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

  return (
    <>
      {categoryName && (
        <Badge className="absolute top-3 left-3 bg-coral text-white">
          {categoryName}
        </Badge>
      )}
      
      {verified && (
        <Badge className="absolute top-3 right-3 bg-green-500 text-white">
          <Check className="mr-1 h-3 w-3" /> {t.verified}
        </Badge>
      )}
      
      {source && source !== ServiceSource.INTERNAL && (
        <Badge className={`absolute bottom-3 right-3 text-white ${getSourceBadgeColor(source)}`}>
          {getSourceDisplayName(source)}
        </Badge>
      )}
    </>
  );
};
