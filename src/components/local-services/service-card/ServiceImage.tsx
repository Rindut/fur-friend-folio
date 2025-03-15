
import { MapPin } from 'lucide-react';

interface ServiceImageProps {
  photos?: Array<{ url: string; isPrimary?: boolean }>;
  name: string;
}

export const ServiceImage = ({ photos, name }: ServiceImageProps) => {
  return (
    <div className="h-48 bg-gray-100 relative">
      {photos && photos.length > 0 ? (
        <img 
          src={photos.find(p => p.isPrimary)?.url || photos[0].url} 
          alt={name}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
          <MapPin className="w-12 h-12 opacity-20" />
        </div>
      )}
    </div>
  );
};
