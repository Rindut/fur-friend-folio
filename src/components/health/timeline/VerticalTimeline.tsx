
import React from 'react';
import { format, parseISO } from 'date-fns';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TimelineEvent {
  id: string;
  title: string;
  date: Date | string;
  type?: string;
  details?: string;
  completed?: boolean;
}

interface VerticalTimelineProps {
  pastEvents: TimelineEvent[];
  futureEvents: TimelineEvent[];
  displayedPastEvents: TimelineEvent[];
  displayedFutureEvents: TimelineEvent[];
  showAllPast: boolean;
  showAllUpcoming: boolean;
  setShowAllPast: (value: boolean) => void;
  setShowAllUpcoming: (value: boolean) => void;
  translations: {
    today: string;
    past: string;
    upcoming: string;
    showMore: string;
    showLess: string;
    completed: string;
  };
}

const VerticalTimeline: React.FC<VerticalTimelineProps> = ({
  pastEvents,
  futureEvents,
  displayedPastEvents,
  displayedFutureEvents,
  showAllPast,
  showAllUpcoming,
  setShowAllPast,
  setShowAllUpcoming,
  translations: t
}) => {
  return (
    <div className="relative py-4 pl-4">
      {/* Vertical Timeline */}
      <div className="relative border-l-2 border-gray-200 ml-4 pl-8">
        {/* Today Marker */}
        <div className="absolute left-0 transform -translate-x-1/2 flex items-center z-10 bg-white py-1">
          <div className="w-6 h-6 rounded-full bg-coral flex items-center justify-center">
            <span className="text-white text-xs font-bold">T</span>
          </div>
          <div className="ml-2 whitespace-nowrap text-xs font-medium bg-coral text-white px-2 py-0.5 rounded">
            {t.today}
          </div>
        </div>
        
        {/* Past Events Title */}
        <div className="mb-4 mt-10">
          <h3 className="text-lg font-medium flex items-center">
            <span className="text-green-500 mr-2">●</span> 
            {t.past} <span className="text-muted-foreground text-sm ml-2">({pastEvents.length})</span>
          </h3>
        </div>
        
        {/* Past Events */}
        <div className="space-y-6 mb-8">
          {displayedPastEvents.map((event) => (
            <div key={event.id} className="relative">
              <div className="absolute left-[-42px] w-4 h-4 rounded-full bg-green-500"></div>
              <div className="mb-1">
                <span className="text-sm font-medium">
                  {format(event.date instanceof Date ? event.date : parseISO(event.date as string), 'MMM dd, yyyy')}
                </span>
              </div>
              <div className="p-3 bg-background border rounded-md shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{event.title}</h4>
                    {event.details && <p className="text-sm text-muted-foreground mt-1">{event.details}</p>}
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full bg-green-100 text-green-800`}>
                    {t.completed}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Show More/Less Button for Past Events */}
          {pastEvents.length > 3 && (
            <div className="text-center">
              <Button 
                variant="ghost" 
                onClick={() => setShowAllPast(!showAllPast)}
                className="text-muted-foreground hover:text-foreground"
              >
                {showAllPast ? (
                  <><ChevronUp className="h-4 w-4 mr-1" /> {t.showLess}</>
                ) : (
                  <><ChevronDown className="h-4 w-4 mr-1" /> {t.showMore} ({pastEvents.length - 3})</>
                )}
              </Button>
            </div>
          )}
        </div>
        
        {/* Upcoming Events Title */}
        <div className="mb-4">
          <h3 className="text-lg font-medium flex items-center">
            <span className="text-amber-500 mr-2">●</span> 
            {t.upcoming} <span className="text-muted-foreground text-sm ml-2">({futureEvents.length})</span>
          </h3>
        </div>
        
        {/* Future Events */}
        <div className="space-y-6">
          {displayedFutureEvents.map(event => (
            <div key={event.id} className="relative">
              <div className="absolute left-[-42px] w-4 h-4 rounded-full bg-amber-500"></div>
              <div className="mb-1">
                <span className="text-sm font-medium">
                  {format(event.date instanceof Date ? event.date : parseISO(event.date as string), 'MMM dd, yyyy')}
                </span>
              </div>
              <div className="p-3 bg-background border rounded-md shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{event.title}</h4>
                    {event.details && <p className="text-sm text-muted-foreground mt-1">{event.details}</p>}
                  </div>
                  <div className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-800">
                    {t.upcoming}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Show More/Less Button for Future Events */}
          {futureEvents.length > 3 && (
            <div className="text-center">
              <Button 
                variant="ghost" 
                onClick={() => setShowAllUpcoming(!showAllUpcoming)}
                className="text-muted-foreground hover:text-foreground"
              >
                {showAllUpcoming ? (
                  <><ChevronUp className="h-4 w-4 mr-1" /> {t.showLess}</>
                ) : (
                  <><ChevronDown className="h-4 w-4 mr-1" /> {t.showMore} ({futureEvents.length - 3})</>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerticalTimeline;
