
import React, { useState, useRef, useEffect } from 'react';
import { addDays, subDays, isAfter, isBefore, isToday, parseISO } from 'date-fns';
import TimelineControls from './timeline/TimelineControls';
import HorizontalTimeline from './timeline/HorizontalTimeline';
import VerticalTimeline from './timeline/VerticalTimeline';
import { TimelineEvent, getEventTypeColor } from './HealthTimelineEvent';

interface HealthTimelineProps {
  events: TimelineEvent[];
  language?: 'en' | 'id';
}

const HealthTimeline: React.FC<HealthTimelineProps> = ({ 
  events = [], 
  language = 'en' 
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [centerPosition, setCenterPosition] = useState(50); // 50% by default
  const [sortedEvents, setSortedEvents] = useState<TimelineEvent[]>([]);
  const [viewMode, setViewMode] = useState<'horizontal' | 'vertical'>('horizontal');
  const [showAllPast, setShowAllPast] = useState(false);
  const [showAllUpcoming, setShowAllUpcoming] = useState(false);
  
  // Sort and process events
  useEffect(() => {
    const processedEvents = events.map(event => ({
      ...event,
      date: typeof event.date === 'string' ? parseISO(event.date) : event.date,
    }));
    
    const sorted = [...processedEvents].sort((a, b) => {
      const dateA = a.date instanceof Date ? a.date : parseISO(a.date as string);
      const dateB = b.date instanceof Date ? b.date : parseISO(b.date as string);
      return dateA.getTime() - dateB.getTime();
    });
    
    setSortedEvents(sorted);
  }, [events]);
  
  const translations = {
    en: {
      today: 'Today',
      zoomIn: 'Zoom in',
      zoomOut: 'Zoom out',
      noEvents: 'No health events to display',
      past: 'Past',
      upcoming: 'Upcoming',
      horizontal: 'Horizontal View',
      vertical: 'Vertical View',
      showMore: 'Show More',
      showLess: 'Show Less',
      completed: 'Completed',
    },
    id: {
      today: 'Hari ini',
      zoomIn: 'Perbesar',
      zoomOut: 'Perkecil',
      noEvents: 'Tidak ada peristiwa kesehatan untuk ditampilkan',
      past: 'Sebelumnya',
      upcoming: 'Mendatang',
      horizontal: 'Tampilan Horizontal',
      vertical: 'Tampilan Vertikal',
      showMore: 'Tampilkan Lebih',
      showLess: 'Tampilkan Kurang',
      completed: 'Selesai',
    }
  };
  
  const t = translations[language];
  
  // Determine the date range to display
  const today = new Date();
  const timelineWidth = zoomLevel * 90; // increase width as zoom increases
  const pastDays = Math.round(30 * zoomLevel);
  const futureDays = Math.round(30 * zoomLevel);
  const startDate = subDays(today, pastDays);
  const endDate = addDays(today, futureDays);
  
  // Handle zoom controls
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.5, 4));
  };
  
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.5, 0.5));
  };
  
  // Handle scroll position
  const handleSliderChange = (value: number[]) => {
    setCenterPosition(value[0]);
  };
  
  // Position events on timeline
  const getEventPosition = (eventDate: Date) => {
    const totalDays = pastDays + futureDays;
    const daysPassed = Math.max(0, (eventDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return (daysPassed / totalDays) * 100;
  };
  
  // Split events into past and future
  const pastEvents = sortedEvents.filter(event => {
    const eventDate = event.date instanceof Date ? event.date : parseISO(event.date as string);
    return isBefore(eventDate, today) || isToday(eventDate);
  });
  
  const futureEvents = sortedEvents.filter(event => {
    const eventDate = event.date instanceof Date ? event.date : parseISO(event.date as string);
    return isAfter(eventDate, today) && !isToday(eventDate);
  });

  // Limit displayed events in vertical view
  const displayedPastEvents = showAllPast ? pastEvents : pastEvents.slice(0, 3);
  const displayedFutureEvents = showAllUpcoming ? futureEvents : futureEvents.slice(0, 3);
  
  return (
    <div className="mt-4">
      {/* Timeline Controls */}
      <TimelineControls
        zoomLevel={zoomLevel}
        centerPosition={centerPosition}
        viewMode={viewMode}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onSliderChange={handleSliderChange}
        onViewModeChange={(mode) => setViewMode(mode)}
        translations={{
          horizontal: t.horizontal,
          vertical: t.vertical,
          past: t.past,
          upcoming: t.upcoming
        }}
      />
      
      {/* Timeline */}
      <div className="relative overflow-hidden mt-2">
        {sortedEvents.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            {t.noEvents}
          </div>
        ) : viewMode === 'horizontal' ? (
          <HorizontalTimeline
            today={today}
            pastEvents={pastEvents}
            futureEvents={futureEvents}
            timelineWidth={timelineWidth}
            getEventPosition={getEventPosition}
            translations={{ today: t.today }}
            language={language}
          />
        ) : (
          <VerticalTimeline
            pastEvents={pastEvents}
            futureEvents={futureEvents}
            displayedPastEvents={displayedPastEvents}
            displayedFutureEvents={displayedFutureEvents}
            showAllPast={showAllPast}
            showAllUpcoming={showAllUpcoming}
            setShowAllPast={setShowAllPast}
            setShowAllUpcoming={setShowAllUpcoming}
            translations={{
              today: t.today,
              past: t.past,
              upcoming: t.upcoming,
              showMore: t.showMore,
              showLess: t.showLess,
              completed: t.completed
            }}
          />
        )}
      </div>
    </div>
  );
};

export default HealthTimeline;
