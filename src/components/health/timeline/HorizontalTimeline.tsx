
import React, { useRef, useEffect } from 'react';
import { format, isAfter, isBefore, isToday, parseISO } from 'date-fns';
import HealthTimelineEvent from '../HealthTimelineEvent';

interface TimelineEvent {
  id: string;
  title: string;
  date: Date | string;
  type?: string;
  details?: string;
  completed?: boolean;
}

interface HorizontalTimelineProps {
  today: Date;
  pastEvents: TimelineEvent[];
  futureEvents: TimelineEvent[];
  timelineWidth: number;
  getEventPosition: (eventDate: Date) => number;
  translations: {
    today: string;
  };
  language: 'en' | 'id';
}

const HorizontalTimeline: React.FC<HorizontalTimelineProps> = ({
  today,
  pastEvents,
  futureEvents,
  timelineWidth,
  getEventPosition,
  translations: t,
  language
}) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  
  // Scroll to today initially
  useEffect(() => {
    if (timelineRef.current) {
      const todayPos = getEventPosition(today);
      const scrollPos = (timelineRef.current.scrollWidth * todayPos / 100) - (timelineRef.current.clientWidth / 2);
      timelineRef.current.scrollLeft = scrollPos;
    }
  }, [timelineWidth, pastEvents, futureEvents, getEventPosition, today]);
  
  return (
    <div 
      ref={timelineRef}
      className="relative overflow-x-auto pb-4"
      style={{ 
        minHeight: '180px',
      }}
    >
      <div 
        className="relative"
        style={{ 
          width: `${timelineWidth}%`,
          minWidth: '100%'
        }}
      >
        {/* Timeline Bar */}
        <div className="relative h-0.5 bg-gray-200 mt-5 mb-16">
          {/* Today Marker */}
          <div className="absolute top-1/2 -translate-y-1/2" style={{ left: `${getEventPosition(today)}%` }}>
            <div className="relative flex flex-col items-center">
              <div className="h-12 w-0.5 bg-coral -mb-0.5"></div>
              <div className="w-4 h-4 rounded-full bg-coral"></div>
              <div className="h-12 w-0.5 bg-coral -mt-0.5"></div>
              <div className="absolute top-full mt-1 whitespace-nowrap text-xs font-medium bg-coral text-white px-2 py-0.5 rounded">
                {t.today}
              </div>
            </div>
          </div>
        
          {/* Past Events */}
          {pastEvents.map(event => (
            <div 
              key={event.id} 
              className="absolute bottom-4"
              style={{ 
                left: `${getEventPosition(
                  event.date instanceof Date ? event.date : parseISO(event.date as string)
                )}%` 
              }}
            >
              <HealthTimelineEvent event={event} language={language} />
            </div>
          ))}
          
          {/* Future Events */}
          {futureEvents.map(event => (
            <div 
              key={event.id} 
              className="absolute top-4"
              style={{ 
                left: `${getEventPosition(
                  event.date instanceof Date ? event.date : parseISO(event.date as string)
                )}%` 
              }}
            >
              <HealthTimelineEvent event={event} language={language} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HorizontalTimeline;
