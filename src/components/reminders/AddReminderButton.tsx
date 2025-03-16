
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface AddReminderButtonProps {
  petId?: string;
  healthRecordId?: string;
  className?: string;
  size?: 'default' | 'sm' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  showLabel?: boolean;
}

const AddReminderButton = ({ 
  petId, 
  healthRecordId,
  className, 
  size = 'sm',
  variant = 'outline',
  showLabel = true
}: AddReminderButtonProps) => {
  const { language } = useLanguage();
  
  const translations = {
    en: {
      addReminder: 'Add Reminder'
    },
    id: {
      addReminder: 'Tambah Pengingat'
    }
  };
  
  const t = translations[language];
  
  // Build query params for the reminder form
  const queryParams = new URLSearchParams();
  if (petId) queryParams.append('pet', petId);
  if (healthRecordId) queryParams.append('record', healthRecordId);
  
  const linkTo = `/reminders/new${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  
  return (
    <Button 
      variant={variant} 
      size={size}
      className={className}
      asChild
    >
      <Link to={linkTo} className="flex items-center gap-1">
        <Plus className="w-4 h-4" />
        {showLabel && t.addReminder}
      </Link>
    </Button>
  );
};

export default AddReminderButton;
