
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PawPrint, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import HeaderWithDate from '@/components/common/HeaderWithDate';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import PetProgressAnalytics from '@/components/analytics/PetProgressAnalytics';

const Dashboard = () => {
  const { user } = useAuth();
  const { language } = useLanguage();

  const translations = {
    en: {
      hello: 'Hello, Pet Parent!',
      yourPetProgress: 'Your Pet Progress',
      viewPetFamily: 'View Pet Family',
    },
    id: {
      hello: 'Halo, Pemilik Hewan!',
      yourPetProgress: 'Perkembangan Hewan Peliharaan Anda',
      viewPetFamily: 'Lihat Keluarga Hewan',
    }
  };

  const t = translations[language];

  const viewPetFamilyButton = (
    <Button className="rounded-full bg-coral hover:bg-coral/90" asChild>
      <Link to="/pet-family" className="flex items-center gap-2">
        <PawPrint className="w-4 h-4" /> {t.viewPetFamily}
      </Link>
    </Button>
  );

  return (
    <div className="min-h-screen pb-20">
      <div className="bg-gradient-to-b from-lavender/20 to-transparent pt-8 pb-12">
        <div className="container px-4 mx-auto">
          <HeaderWithDate 
            title={t.hello}
            actions={viewPetFamilyButton}
          />
        </div>
      </div>
      
      {/* Pet Progress Section with colorful header */}
      <div className="container px-4 mx-auto">
        <div className="bg-soft-peach py-4 px-6 rounded-lg mb-6 flex items-center">
          <BarChart className="text-coral w-5 h-5 mr-2" />
          <h2 className="text-xl font-semibold">{t.yourPetProgress}</h2>
        </div>
        
        {/* Analytics content without the title */}
        <div className="mt-0">
          <PetProgressAnalytics />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
