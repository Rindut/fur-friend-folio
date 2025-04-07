
import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import CtaSection from '@/components/home/CtaSection';
import { getHomeTranslations } from '@/components/home/HomeTranslations';

const Index = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const translationsData = getHomeTranslations();
  const t = translationsData[language];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection t={t} language={language} />

      {/* Features Section */}
      <FeaturesSection t={t} mounted={true} />

      {/* CTA Section */}
      <CtaSection t={t} />
    </div>
  );
};

export default Index;
