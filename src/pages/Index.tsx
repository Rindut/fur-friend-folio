
import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { getHomeTranslations } from '@/components/home/HomeTranslations';
import MobileHeader from '@/components/home/MobileHeader';
import ServiceIcons from '@/components/home/ServiceIcons';
import PromoSection from '@/components/home/PromoSection';
import MobileNavBar from '@/components/home/MobileNavBar';

const Index = () => {
  const [mounted, setMounted] = useState(false);
  const { language } = useLanguage();
  const { user } = useAuth();
  const translationsData = getHomeTranslations();
  const t = translationsData[language];

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header with User Info */}
      <MobileHeader />
      
      {/* Balance Card */}
      <div className="px-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-pink-600 rounded-full w-8 h-8 flex items-center justify-center">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <div className="font-medium">{t.halocoins}</div>
          </div>
          <div className="flex items-center justify-between">
            <span>{t.balance}: 0 {t.coins}</span>
            <span className="ml-2">&gt;</span>
          </div>
        </div>
      </div>
      
      {/* Service Icons Grid */}
      <ServiceIcons t={t} />
      
      {/* Promotions Section */}
      <PromoSection t={t} />
      
      {/* Mobile Navigation Bar */}
      <MobileNavBar />
    </div>
  );
};

export default Index;
