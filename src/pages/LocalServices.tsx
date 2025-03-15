
import { useLanguage } from '@/context/LanguageContext';
import LocalServicesTabs from './local-services/LocalServicesTabs';

const LocalServices = () => {
  const { language } = useLanguage();
  
  const translations = {
    en: {
      title: 'Local Pet Services',
    },
    id: {
      title: 'Layanan Hewan Peliharaan Lokal',
    }
  };
  
  const t = translations[language];

  return (
    <div className="container px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t.title}</h1>
      <LocalServicesTabs />
    </div>
  );
};

export default LocalServices;
