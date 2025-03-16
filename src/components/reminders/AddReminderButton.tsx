
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Plus, Bell, Calendar } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface AddReminderButtonProps {
  petId?: string;
  healthRecordId?: string;
  className?: string;
  size?: 'default' | 'sm' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  showLabel?: boolean;
  showTooltip?: boolean;
  icon?: 'plus' | 'bell' | 'calendar';
}

const AddReminderButton = ({ 
  petId, 
  healthRecordId,
  className, 
  size = 'sm',
  variant = 'outline',
  showLabel = true,
  showTooltip = true,
  icon = 'plus'
}: AddReminderButtonProps) => {
  const { language } = useLanguage();
  
  const translations = {
    en: {
      addReminder: 'Add Reminder',
      tooltipText: 'Create a reminder for this item'
    },
    id: {
      addReminder: 'Tambah Pengingat',
      tooltipText: 'Buat pengingat untuk item ini'
    }
  };
  
  const t = translations[language];
  
  // Build query params for the reminder form
  const queryParams = new URLSearchParams();
  if (petId) queryParams.append('pet', petId);
  if (healthRecordId) queryParams.append('record', healthRecordId);
  
  const linkTo = `/reminders/new${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  
  const getIcon = () => {
    switch (icon) {
      case 'bell':
        return <Bell className="w-4 h-4" />;
      case 'calendar':
        return <Calendar className="w-4 h-4" />;
      case 'plus':
      default:
        return <Plus className="w-4 h-4" />;
    }
  };

  const button = (
    <Button 
      variant={variant} 
      size={size}
      className={className}
      asChild
    >
      <Link to={linkTo} className="flex items-center gap-1">
        {getIcon()}
        {showLabel && t.addReminder}
      </Link>
    </Button>
  );
  
  if (showTooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {button}
          </TooltipTrigger>
          <TooltipContent>
            <p>{t.tooltipText}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return button;
};

export default AddReminderButton;
