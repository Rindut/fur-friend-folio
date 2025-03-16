
import { Globe } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface LanguageToggleProps {
  mobile?: boolean;
}

const LanguageToggle = ({ mobile = false }: LanguageToggleProps) => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button 
      onClick={toggleLanguage}
      className={`${mobile ? 'p-2' : 'p-1.5'} rounded-full hover:bg-muted/30 text-charcoal/80`}
      aria-label="Toggle language"
    >
      <Globe className={`${mobile ? 'w-5 h-5' : 'w-4 h-4'}`} />
      <span className="sr-only">
        {language === 'en' ? 'Switch to Bahasa Indonesia' : 'Switch to English'}
      </span>
    </button>
  );
};

export default LanguageToggle;
