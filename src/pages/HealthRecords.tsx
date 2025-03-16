
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plus, Heart, Droplets, Pill, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/context/LanguageContext';
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
          
          {/* Pet Buttons (without dropdown) */}
          {loading ? (
            <div className="mb-8 text-center">{t.loading}</div>
          ) : pets.length > 0 ? (
            <div className="mb-8">
              <div className="flex flex-wrap gap-3">
                {pets.map(pet => (
                  <button
                    key={pet.id}
                    className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-200 ${
                      selectedPet === pet.id 
                        ? 'bg-lavender/30 text-charcoal' 
                        : 'bg-white/70 text-muted-foreground hover:bg-lavender/10'
                    }`}
                    onClick={() => setSelectedPet(pet.id)}
                  >
                    <span>{pet.name}</span>
                  </button>
                ))}
              </div>
              
              {/* Record Type Tabs moved here under pet selection */}
              {selectedPet && (
                <Tabs 
                  defaultValue="all" 
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full mt-4"
                >
                  <TabsList className="bg-white/70 p-1">
                    <TabsTrigger 
                      value="all"
                      className="data-[state=active]:bg-lavender/30 data-[state=active]:text-charcoal rounded-lg"
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      {t.all}
                    </TabsTrigger>
                    <TabsTrigger 
                      value="vaccination"
                      className="data-[state=active]:bg-lavender/30 data-[state=active]:text-charcoal rounded-lg"
                    >
                      <Droplets className="w-4 h-4 mr-2" />
                      {t.vaccinations}
                    </TabsTrigger>
                    <TabsTrigger 
                      value="medication"
                      className="data-[state=active]:bg-lavender/30 data-[state=active]:text-charcoal rounded-lg"
                    >
                      <Pill className="w-4 h-4 mr-2" />
                      {t.medications}
                    </TabsTrigger>
                    <TabsTrigger 
                      value="visit"
                      className="data-[state=active]:bg-lavender/30 data-[state=active]:text-charcoal rounded-lg"
                    >
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {t.visits}
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              )}
            </div>
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
          
          {/* Pet Care History Section - without tabs since they moved up */}
          <PetCareHistorySection
            t={t}
            healthRecords={healthRecords}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            selectedPet={selectedPet}
            getRecordIcon={getRecordIcon}
            getRecordTypeColor={getRecordTypeColor}
            showTabs={false}
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
