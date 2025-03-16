
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Heart, 
  Pill, 
  Droplets, 
  Weight, 
  AlertCircle,
  Plus,
  Calendar,
  Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import PetSelector from '@/components/health/PetSelector';
import HealthRecordsList from '@/components/health/HealthRecordsList';
import UpcomingCareList from '@/components/health/UpcomingCareList';
import { useHealthRecords } from '@/components/health/useHealthRecords';

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
  
  // Check if we should scroll to a specific section based on URL hash
  useState(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
  
  const translations = {
    en: {
      pageTitle: 'Health',
      greeting: 'Hello, Pet Parent!',
      petCareHistory: 'Pet Care History',
      petCareHistoryDesc: 'Track your pet\'s complete medical history in one place. Store past veterinary visits, vaccinations, medications, surgeries, and health conditions.',
      upcomingPetCare: 'Upcoming Pet Care',
      upcomingPetCareDesc: 'Never miss important pet care schedules with smart reminders for upcoming appointments.',
      all: 'All',
      vaccinations: 'Vaccinations',
      medications: 'Medications',
      visits: 'Vet Visits',
      addRecord: 'Add Record',
      addReminder: 'Add Reminder',
      noRecords: 'No health records found. Add a new record to get started.',
      noUpcoming: 'No upcoming health tasks.',
      details: 'Details',
      viewCalendar: 'View Calendar',
      selectPet: 'Select Pet',
      noPets: 'No pets found. Add a pet first to track health records.',
      loading: 'Loading...',
      addPet: 'Add Pet'
    },
    id: {
      pageTitle: 'Kesehatan',
      greeting: 'Halo, Pemilik Hewan!',
      petCareHistory: 'Riwayat Perawatan Hewan',
      petCareHistoryDesc: 'Lacak riwayat medis lengkap hewan peliharaan Anda dalam satu tempat. Simpan kunjungan dokter hewan, vaksinasi, pengobatan, operasi, dan kondisi kesehatan.',
      upcomingPetCare: 'Perawatan Hewan Mendatang',
      upcomingPetCareDesc: 'Jangan pernah melewatkan jadwal perawatan hewan peliharaan penting dengan pengingat pintar untuk janji temu mendatang.',
      all: 'Semua',
      vaccinations: 'Vaksinasi',
      medications: 'Pengobatan',
      visits: 'Kunjungan Dokter',
      addRecord: 'Tambah Catatan',
      addReminder: 'Tambah Pengingat',
      noRecords: 'Tidak ada catatan kesehatan. Tambahkan catatan baru untuk memulai.',
      noUpcoming: 'Tidak ada tugas kesehatan mendatang.',
      details: 'Detail',
      viewCalendar: 'Lihat Kalender',
      selectPet: 'Pilih Hewan',
      noPets: 'Tidak ada hewan ditemukan. Tambahkan hewan terlebih dahulu untuk melacak catatan kesehatan.',
      loading: 'Memuat...',
      addPet: 'Tambah Hewan'
    }
  };
  
  const t = translations[language];
  
  // Get current date - added to match Dashboard
  const today = new Date();
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', options);
  
  const getRecordIcon = (type: 'vaccination' | 'medication' | 'weight' | 'visit') => {
    switch (type) {
      case 'vaccination':
        return <Droplets className="w-4 h-4" />;
      case 'medication':
        return <Pill className="w-4 h-4" />;
      case 'weight':
        return <Weight className="w-4 h-4" />;
      case 'visit':
        return <AlertCircle className="w-4 h-4" />;
    }
  };
  
  const getRecordTypeColor = (type: 'vaccination' | 'medication' | 'weight' | 'visit') => {
    switch (type) {
      case 'vaccination':
        return 'bg-lavender/20 text-lavender';
      case 'medication':
        return 'bg-coral/20 text-coral';
      case 'weight':
        return 'bg-sage/20 text-sage';
      case 'visit':
        return 'bg-blue-400/20 text-blue-500';
    }
  };
  
  return (
    <div className="min-h-screen pb-20">
      <div className="bg-gradient-to-b from-lavender/20 to-transparent pt-8 pb-12">
        <div className="container px-4 mx-auto">
          {/* Added greeting and date to match Dashboard */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <p className="text-muted-foreground text-sm">{formattedDate}</p>
              <h1 className="text-3xl font-bold">{t.greeting}</h1>
            </div>
          </div>
          
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
          
          {/* Pet Care History Section - updated to soft peach */}
          <section id="pet-care-history" className="mb-12">
            <div className="bg-soft-peach py-4 px-6 rounded-lg mb-6 flex items-center">
              <Heart className="text-coral w-5 h-5 mr-2" />
              <h2 className="text-xl font-semibold">{t.petCareHistory}</h2>
              
              <div className="ml-auto">
                <Button className="rounded-full bg-lavender hover:bg-lavender/90" asChild>
                  <Link to={`/health/add${selectedPet ? `?pet=${selectedPet}` : ''}`}>
                    <Plus className="w-4 h-4 mr-2" />
                    {t.addRecord}
                  </Link>
                </Button>
              </div>
            </div>
            
            <p className="text-muted-foreground mb-6">{t.petCareHistoryDesc}</p>
            
            {/* Record Type Tabs */}
            <Tabs 
              defaultValue="all" 
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="bg-white/70 p-1 mb-6">
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
              
              <TabsContent value="all" className="mt-0">
                <HealthRecordsList 
                  records={healthRecords} 
                  getRecordIcon={getRecordIcon} 
                  getRecordTypeColor={getRecordTypeColor} 
                  detailsText={t.details}
                  noRecordsText={t.noRecords}
                />
              </TabsContent>
              <TabsContent value="vaccination" className="mt-0">
                <HealthRecordsList 
                  records={healthRecords} 
                  getRecordIcon={getRecordIcon} 
                  getRecordTypeColor={getRecordTypeColor} 
                  detailsText={t.details}
                  noRecordsText={t.noRecords}
                />
              </TabsContent>
              <TabsContent value="medication" className="mt-0">
                <HealthRecordsList 
                  records={healthRecords} 
                  getRecordIcon={getRecordIcon} 
                  getRecordTypeColor={getRecordTypeColor} 
                  detailsText={t.details}
                  noRecordsText={t.noRecords}
                />
              </TabsContent>
              <TabsContent value="visit" className="mt-0">
                <HealthRecordsList 
                  records={healthRecords} 
                  getRecordIcon={getRecordIcon} 
                  getRecordTypeColor={getRecordTypeColor} 
                  detailsText={t.details}
                  noRecordsText={t.noRecords}
                />
              </TabsContent>
            </Tabs>
          </section>
          
          {/* Upcoming Pet Care Section - updated to soft peach */}
          <section id="upcoming-pet-care">
            <div className="bg-soft-peach py-4 px-6 rounded-lg mb-6 flex items-center">
              <Bell className="text-coral w-5 h-5 mr-2" />
              <h2 className="text-xl font-semibold">{t.upcomingPetCare}</h2>
              
              <div className="ml-auto flex gap-3">
                <Button variant="outline" className="rounded-full" asChild>
                  <Link to="/reminders">
                    <Calendar className="w-4 h-4 mr-2" />
                    {t.viewCalendar}
                  </Link>
                </Button>
                <Button className="rounded-full bg-coral hover:bg-coral/90" asChild>
                  <Link to="/reminders/new">
                    <Plus className="w-4 h-4 mr-2" />
                    {t.addReminder}
                  </Link>
                </Button>
              </div>
            </div>
            
            <p className="text-muted-foreground mb-6">{t.upcomingPetCareDesc}</p>
            
            <UpcomingCareList
              tasks={upcomingTasks}
              detailsText={t.details}
              noUpcomingText={t.noUpcoming}
            />
          </section>
        </div>
      </div>
    </div>
  );
};

export default HealthRecords;
