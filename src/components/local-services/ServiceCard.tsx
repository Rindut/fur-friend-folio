
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Service, ServiceSource } from '@/types/petServices';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Clock, Star, StarHalf, Check, Bookmark, Share2, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

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
      reviews: 'Reviews',
      noRating: 'No ratings yet',
      verified: 'Verified',
    },
    id: {
      viewProfile: 'Lihat Profil',
      externalLink: 'Lihat Asli',
      importToDb: 'Impor ke Database',
      reviews: 'Ulasan',
      noRating: 'Belum ada penilaian',
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

  return (
    <Card className="overflow-hidden">
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
