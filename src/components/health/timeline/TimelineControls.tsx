
import React from 'react';
import { ZoomIn, ZoomOut, Rows, Columns } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface TimelineControlsProps {
  zoomLevel: number;
  centerPosition: number;
  viewMode: 'horizontal' | 'vertical';
  onZoomIn: () => void;
  onZoomOut: () => void;
  onSliderChange: (value: number[]) => void;
  onViewModeChange: (value: 'horizontal' | 'vertical') => void;
  translations: {
    horizontal: string;
    vertical: string;
    past: string;
    upcoming: string;
  };
}

const TimelineControls: React.FC<TimelineControlsProps> = ({
  zoomLevel,
  centerPosition,
  viewMode,
  onZoomIn,
  onZoomOut,
  onSliderChange,
  onViewModeChange,
  translations: t
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="icon"
          onClick={onZoomOut}
          disabled={zoomLevel <= 0.5}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Slider
          value={[centerPosition]}
          min={0}
          max={100}
          step={1}
          onValueChange={onSliderChange}
          className="w-40"
        />
        <Button 
          variant="outline" 
          size="icon"
          onClick={onZoomIn}
          disabled={zoomLevel >= 4}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex items-center gap-4">
        <TooltipProvider>
          <ToggleGroup 
            type="single" 
            value={viewMode} 
            onValueChange={(value) => value && onViewModeChange(value as 'horizontal' | 'vertical')}
          >
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
  );
};

export default TimelineControls;
