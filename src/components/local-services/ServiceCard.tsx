
import { Service, ServiceSource } from '@/types/petServices';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bookmark, Share2, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { BadgeDisplay } from './service-card/BadgeDisplay';
import { ServiceImage } from './service-card/ServiceImage';
import { RatingDisplay } from './service-card/RatingDisplay';
import { ServiceDetails } from './service-card/ServiceDetails';
import { PriceDisplay } from './service-card/PriceDisplay';

interface ServiceCardProps {
  service: Service;
  isExternal?: boolean;
  onImport?: (service: Service) => Promise<void>;
}

const ServiceCard = ({ service, isExternal = false, onImport }: ServiceCardProps) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  
  const translations = {
    en: {
      viewProfile: 'View Profile',
      externalLink: 'View Original',
      importToDb: 'Import to Database',
    },
    id: {
      viewProfile: 'Lihat Profil',
      externalLink: 'Lihat Asli',
      importToDb: 'Impor ke Database',
    }
  };
  
  const t = translations[language];

  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <ServiceImage photos={service.photos} name={service.name} />
        <BadgeDisplay 
          categoryName={service.categoryName} 
          verified={service.verified} 
          source={service.source} 
        />
      </div>
      
      <CardHeader>
        <CardTitle className="flex justify-between items-start">
          <div>
            {service.name}
            <div className="flex mt-1 text-sm font-normal">
              <RatingDisplay rating={service.avgRating} reviewCount={service.reviewCount} />
            </div>
          </div>
          <PriceDisplay priceRange={service.priceRange} />
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-2 pb-0">
        <ServiceDetails 
          address={service.address}
          city={service.city}
          operatingHours={service.operatingHours}
          contactPhone={service.contactPhone}
        />
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
          {isExternal && onImport && (
            <Button onClick={() => onImport(service)} variant="outline">
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
};

export default ServiceCard;
