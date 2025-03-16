
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface AddReminderButtonProps {
  petId?: string;
  className?: string;
}

const AddReminderButton = ({ petId, className }: AddReminderButtonProps) => {
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
  
  const linkTo = petId 
    ? `/reminders/new?pet=${petId}` 
    : '/reminders/new';
  
  return (
    <Button 
      variant="outline" 
      size="sm" 
      className={className}
      asChild
    >
      <Link to={linkTo} className="flex items-center gap-1">
        <Plus className="w-4 h-4" />
        {t.addReminder}
      </Link>
    </Button>
  );
};

export default AddReminderButton;
