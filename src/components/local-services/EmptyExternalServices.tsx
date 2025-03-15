
import { useLanguage } from '@/context/LanguageContext';
import { AlertCircle } from 'lucide-react';

const EmptyExternalServices = () => {
  const { language } = useLanguage();
  
  const translations = {
    en: {
      noExternalData: 'No external data',
      useSearchForm: 'Use the search form above to fetch data from external platforms like Google Maps, Instagram, Facebook, etc.',
    },
    id: {
      noExternalData: 'Tidak ada data eksternal',
      useSearchForm: 'Gunakan formulir pencarian di atas untuk mengambil data dari platform eksternal seperti Google Maps, Instagram, Facebook, dll.',
    }
  };
  
  const t = translations[language];

  return (
    <div className="text-center py-12 border border-dashed rounded-lg">
      <AlertCircle className="mx-auto h-12 w-12 text-gray-300 mb-4" />
      <h3 className="text-lg font-medium mb-2">{t.noExternalData}</h3>
      <p className="text-gray-500 max-w-md mx-auto">
        {t.useSearchForm}
      </p>
    </div>
  );
};

export default EmptyExternalServices;
