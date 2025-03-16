
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import PetSelector from '@/components/health/PetSelector';
import HeaderWithDate from '@/components/common/HeaderWithDate';
import PetCareHistorySection from '@/components/health/PetCareHistorySection';
import UpcomingPetCareSection from '@/components/health/UpcomingPetCareSection';
import { useHealthRecords } from '@/components/health/useHealthRecords';
import { useRecordUtils } from '@/components/health/useRecordUtils';
import { getHealthTranslations } from '@/components/health/HealthTranslations';

const HealthRecords = () => {
  const location = useLocation();
  const { language } = useLanguage();
  const {
    pets,
    loading,
    selectedPet,
    setSelectedPet,
    activeTab,
    setActiveTab,
    healthRecords,
    upcomingTasks
  } = useHealthRecords();
  
  const { getRecordIcon, getRecordTypeColor } = useRecordUtils();
  const translations = getHealthTranslations();
  const t = translations[language];
  
  // Check if we should scroll to a specific section based on URL hash
  useState(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });

  return (
    <div className="min-h-screen pb-20">
      <div className="bg-gradient-to-b from-lavender/20 to-transparent pt-8 pb-12">
        <div className="container px-4 mx-auto">
          <HeaderWithDate title={t.greeting} />
          
          {/* Pet Selector */}
          {loading ? (
            <div className="mb-8 text-center">{t.loading}</div>
          ) : pets.length > 0 ? (
            <PetSelector
              pets={pets}
              selectedPet={selectedPet}
              onPetChange={setSelectedPet}
              selectPetLabel={t.selectPet}
              loading={loading}
              loadingText={t.loading}
            />
          ) : (
            <div className="mb-8 text-center">
              <p className="text-muted-foreground mb-4">{t.noPets}</p>
              <Button className="rounded-full bg-lavender hover:bg-lavender/90" asChild>
                <Link to="/pets/new">
                  <Plus className="w-4 h-4 mr-2" />
                  {t.addPet}
                </Link>
              </Button>
            </div>
          )}
          
          {/* Pet Care History Section */}
          <PetCareHistorySection
            t={t}
            healthRecords={healthRecords}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            selectedPet={selectedPet}
            getRecordIcon={getRecordIcon}
            getRecordTypeColor={getRecordTypeColor}
          />
          
          {/* Upcoming Pet Care Section */}
          <UpcomingPetCareSection
            t={t}
            upcomingTasks={upcomingTasks}
          />
        </div>
      </div>
    </div>
  );
};

export default HealthRecords;
