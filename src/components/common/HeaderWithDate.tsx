
import { useLanguage } from '@/context/LanguageContext';

interface HeaderWithDateProps {
  title: string;
  actions?: React.ReactNode;
}

const HeaderWithDate = ({ title, actions }: HeaderWithDateProps) => {
  const { language } = useLanguage();
  
  // Get current date
  const today = new Date();
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', options);
  
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
      <div>
        <p className="text-muted-foreground text-sm">{formattedDate}</p>
        <h1 className="text-3xl font-bold">{title}</h1>
      </div>
      {actions && (
        <div className="md:self-end">
          {actions}
        </div>
      )}
    </div>
  );
};

export default HeaderWithDate;
