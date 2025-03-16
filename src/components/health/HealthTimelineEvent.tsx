
import React from 'react';
import { format } from 'date-fns';
import { Check, Clock } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';
import { useRecordUtils, RecordType } from './useRecordUtils';

export interface TimelineEvent {
  id: string;
  date: Date | string;
  title: string;
  type: RecordType | 'checkup' | 'grooming';
  completed: boolean;
  petId?: string;
  petName?: string;
  details?: string;
}

interface HealthTimelineEventProps {
  event: TimelineEvent;
  language?: 'en' | 'id';
}

export const getEventTypeColor = (type: TimelineEvent['type']): string => {
  switch (type) {
    case 'checkup':
      return 'bg-blue-400/20 text-blue-500 border-blue-400';
    case 'vaccination':
      return 'bg-green-400/20 text-green-500 border-green-400';
    case 'medication':
      return 'bg-coral/20 text-coral border-coral';
    case 'grooming':
      return 'bg-lavender/20 text-lavender border-lavender';
    case 'weight':
      return 'bg-sage/20 text-sage border-sage';
    case 'visit':
      return 'bg-blue-400/20 text-blue-500 border-blue-400';
    default:
      return 'bg-blue-400/20 text-blue-500 border-blue-400';
  }
};

const HealthTimelineEvent: React.FC<HealthTimelineEventProps> = ({ event, language = 'en' }) => {
  const { getRecordIcon } = useRecordUtils();
  const dateStr = typeof event.date === 'string' ? event.date : format(event.date, 'MMM d, yyyy');
  
  const translations = {
    en: {
      completed: 'Completed',
      pending: 'Pending',
      detailsLabel: 'Details',
      noDetails: 'No additional details available'
    },
    id: {
      completed: 'Selesai',
      pending: 'Tertunda',
      detailsLabel: 'Detail',
      noDetails: 'Tidak ada detail tambahan'
    }
  };
  
  const t = translations[language];
  
  const statusText = event.completed ? t.completed : t.pending;
  const typeColor = getEventTypeColor(event.type);
  
  // Get appropriate icon
  const getEventIcon = () => {
    if (event.type === 'checkup') {
      return getRecordIcon('visit');
    } else if (event.type === 'grooming') {
      return getRecordIcon('visit'); // Using visit icon for grooming
    } else {
      return getRecordIcon(event.type as RecordType);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className={cn(
              "relative flex flex-col items-center group cursor-pointer",
              { "opacity-75": !event.completed }
            )}
          >
            <div 
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center border-2",
                typeColor
              )}
            >
              {getEventIcon()}
            </div>
            <div className="mt-1 absolute top-12 text-xs whitespace-nowrap">
              {dateStr}
            </div>
            <div className="mt-8 max-w-[80px] text-center text-xs truncate">
              {event.title}
            </div>
            <div className={cn(
              "absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center",
              event.completed ? "bg-green-500" : "bg-amber-500"
            )}>
              {event.completed ? (
                <Check className="w-3 h-3 text-white" />
              ) : (
                <Clock className="w-3 h-3 text-white" />
              )}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent className="p-3 max-w-xs">
          <div>
            <p className="font-semibold">{event.title}</p>
            <p className="text-xs text-muted-foreground">{dateStr}</p>
            {event.petName && (
              <p className="text-xs mt-1">{event.petName}</p>
            )}
            <div className={cn(
              "text-xs mt-2 px-2 py-0.5 rounded-full inline-flex items-center gap-1",
              event.completed ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"
            )}>
              {event.completed ? (
                <Check className="w-3 h-3" />
              ) : (
                <Clock className="w-3 h-3" />
              )}
              <span>{statusText}</span>
            </div>
            {event.details && (
              <div className="mt-2 border-t pt-2 text-xs">
                <p className="font-medium">{t.detailsLabel}:</p>
                <p className="text-muted-foreground">{event.details}</p>
              </div>
            )}
            {!event.details && (
              <div className="mt-2 border-t pt-2 text-xs text-muted-foreground">
                {t.noDetails}
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default HealthTimelineEvent;
