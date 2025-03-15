
import { MapPin, Phone, Clock } from 'lucide-react';

interface ServiceDetailsProps {
  address: string;
  city: string;
  operatingHours?: string;
  contactPhone?: string;
}

export const ServiceDetails = ({ 
  address, 
  city, 
  operatingHours, 
  contactPhone 
}: ServiceDetailsProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-start">
        <MapPin className="mr-2 h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
        <span className="text-sm">{address}, {city}</span>
      </div>
      
      {operatingHours && (
        <div className="flex items-start">
          <Clock className="mr-2 h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
          <span className="text-sm">{operatingHours}</span>
        </div>
      )}
      
      {contactPhone && (
        <div className="flex items-start">
          <Phone className="mr-2 h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
          <span className="text-sm">{contactPhone}</span>
        </div>
      )}
    </div>
  );
};
