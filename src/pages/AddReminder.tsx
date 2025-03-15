
import { useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import ReminderForm from '@/components/reminders/ReminderForm';
import { useLanguage } from '@/context/LanguageContext';

const AddReminder = () => {
  const [searchParams] = useSearchParams();
  const petId = searchParams.get('pet') || undefined;
  const { language } = useLanguage();

  const translations = {
    en: {
      back: 'Back to Reminders'
    },
    id: {
      back: 'Kembali ke Pengingat'
    }
  };

  const t = translations[language];

  return (
    <div className="min-h-screen pb-20">
      <div className="bg-gradient-to-b from-lavender/20 to-transparent pt-8 pb-12">
        <div className="container px-4 mx-auto">
          <Button variant="ghost" asChild className="mb-6">
            <Link to="/reminders" className="flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" /> {t.back}
            </Link>
          </Button>
          
          <div className="max-w-2xl mx-auto">
            <ReminderForm petId={petId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddReminder;
