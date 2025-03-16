
import React, { useState, useRef, useEffect } from 'react';
import { addDays, subDays, format, isAfter, isBefore, isToday, parseISO } from 'date-fns';
import { Slider } from '@/components/ui/slider';
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Calendar, Rows, Columns, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Toggle } from '@/components/ui/toggle';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import HealthTimelineEvent, { TimelineEvent, getEventTypeColor } from './HealthTimelineEvent';

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
  const timelineRef = useRef<HTMLDivElement>(null);
  
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
    if (timelineRef.current) {
      const maxScroll = timelineRef.current.scrollWidth - timelineRef.current.clientWidth;
      timelineRef.current.scrollLeft = maxScroll * (value[0] / 100);
    }
  };
  
  // Position events on timeline
  const getEventPosition = (eventDate: Date) => {
    const totalDays = pastDays + futureDays;
    const daysPassed = Math.max(0, (eventDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return (daysPassed / totalDays) * 100;
  };
  
  // Scroll to today initially
  useEffect(() => {
    if (timelineRef.current && viewMode === 'horizontal') {
      const todayPos = getEventPosition(today);
      const scrollPos = (timelineRef.current.scrollWidth * todayPos / 100) - (timelineRef.current.clientWidth / 2);
      timelineRef.current.scrollLeft = scrollPos;
    }
  }, [zoomLevel, sortedEvents, viewMode]);
  
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
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleZoomOut}
            disabled={zoomLevel <= 0.5}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Slider
            value={[centerPosition]}
            min={0}
            max={100}
            step={1}
            onValueChange={handleSliderChange}
            className="w-40"
          />
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleZoomIn}
            disabled={zoomLevel >= 4}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-4">
          <TooltipProvider>
            <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as 'horizontal' | 'vertical')}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <ToggleGroupItem value="horizontal" aria-label={t.horizontal}>
                    <Rows className="h-4 w-4" />
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>{t.horizontal}</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <ToggleGroupItem value="vertical" aria-label={t.vertical}>
                    <Columns className="h-4 w-4" />
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>{t.vertical}</p>
                </TooltipContent>
              </Tooltip>
            </ToggleGroup>
          </TooltipProvider>
          
          <div className="flex items-center text-sm">
            <span className="text-green-500 mr-2">●</span>
            <span className="mr-4">{t.past}</span>
            <span className="text-amber-500 mr-2">●</span>
            <span>{t.upcoming}</span>
          </div>
        </div>
      </div>
      
      {/* Timeline */}
      <div className="relative overflow-hidden mt-2">
        {sortedEvents.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            {t.noEvents}
          </div>
        ) : viewMode === 'horizontal' ? (
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
        ) : (
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
                {displayedPastEvents.map((event, index) => (
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
        )}
      </div>
    </div>
  );
};

export default HealthTimeline;
