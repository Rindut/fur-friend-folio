
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Heart, 
  Pill, 
  Droplets, 
  Weight, 
  AlertCircle,
  Plus,
  Calendar,
  ArrowRight,
  Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import PetAvatar from '@/components/ui/PetAvatar';
import { useLanguage } from '@/context/LanguageContext';

interface HealthRecord {
  id: string;
  type: 'vaccination' | 'medication' | 'weight' | 'visit';
  title: string;
  date: string;
  details?: string;
  petId: string;
}

interface Pet {
  id: string;
  name: string;
  imageUrl?: string;
}

// Sample data
const samplePets: Pet[] = [
  {
    id: '1',
    name: 'Luna',
    imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZG9nfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: '2',
    name: 'Oliver',
    imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y2F0fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
  }
];

const sampleHealthRecords: HealthRecord[] = [
  {
    id: '1',
    type: 'vaccination',
    title: 'Rabies Vaccination',
    date: 'May 15, 2023',
    details: 'Three-year vaccination.',
    petId: '1'
  },
  {
    id: '2',
    type: 'vaccination',
    title: 'DHPP Booster',
    date: 'May 15, 2023',
    details: 'Annual booster shot.',
    petId: '1'
  },
  {
    id: '3',
    type: 'medication',
    title: 'Heart Medication',
    date: 'Started: January 10, 2023',
    details: '10mg daily with food.',
    petId: '1'
  },
  {
    id: '4',
    type: 'visit',
    title: 'Annual Checkup',
    date: 'May 15, 2023',
    details: 'All vitals normal. Slight tartar buildup on teeth.',
    petId: '1'
  },
  {
    id: '5',
    type: 'weight',
    title: 'Weight Check',
    date: 'May 15, 2023',
    details: '65 lbs - Healthy weight range.',
    petId: '1'
  },
  {
    id: '6',
    type: 'vaccination',
    title: 'FVRCP Vaccination',
    date: 'April 3, 2023',
    details: 'Annual vaccination.',
    petId: '2'
  },
  {
    id: '7',
    type: 'medication',
    title: 'Flea Treatment',
    date: 'Started: April 3, 2023',
    details: 'Monthly application.',
    petId: '2'
  }
];

// Sample upcoming health tasks
const upcomingTasks = [
  {
    id: '1',
    title: 'Rabies Vaccination',
    date: 'June 15, 2023',
    petName: 'Luna',
    petId: '1',
  },
  {
    id: '2',
    title: 'Annual Checkup',
    date: 'June 20, 2023',
    petName: 'Oliver',
    petId: '2',
  }
];

const HealthRecords = () => {
  const [selectedPet, setSelectedPet] = useState<string>(samplePets[0].id);
  const [activeTab, setActiveTab] = useState<string>('all');
  const { language } = useLanguage();
  
  const translations = {
    en: {
      pageTitle: 'Health',
      healthRecords: 'Health Records',
      healthRecordsDesc: 'Track your pet\'s complete medical history in one place. Store past veterinary visits, vaccinations, medications, surgeries, and health conditions.',
      upcoming: 'Upcoming',
      upcomingDesc: 'Never miss important pet care schedules with smart reminders for upcoming appointments.',
      all: 'All',
      vaccinations: 'Vaccinations',
      medications: 'Medications',
      visits: 'Vet Visits',
      addRecord: 'Add Record',
      addReminder: 'Add Reminder',
      noRecords: 'No health records found. Add a new record to get started.',
      noUpcoming: 'No upcoming health tasks.',
      details: 'Details',
      viewCalendar: 'View Calendar'
    },
    id: {
      pageTitle: 'Kesehatan',
      healthRecords: 'Catatan Kesehatan',
      healthRecordsDesc: 'Lacak riwayat medis lengkap hewan peliharaan Anda dalam satu tempat. Simpan kunjungan dokter hewan, vaksinasi, pengobatan, operasi, dan kondisi kesehatan.',
      upcoming: 'Mendatang',
      upcomingDesc: 'Jangan pernah melewatkan jadwal perawatan hewan peliharaan penting dengan pengingat pintar untuk janji temu mendatang.',
      all: 'Semua',
      vaccinations: 'Vaksinasi',
      medications: 'Pengobatan',
      visits: 'Kunjungan Dokter',
      addRecord: 'Tambah Catatan',
      addReminder: 'Tambah Pengingat',
      noRecords: 'Tidak ada catatan kesehatan. Tambahkan catatan baru untuk memulai.',
      noUpcoming: 'Tidak ada tugas kesehatan mendatang.',
      details: 'Detail',
      viewCalendar: 'Lihat Kalender'
    }
  };
  
  const t = translations[language];
  
  const getRecordIcon = (type: HealthRecord['type']) => {
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
  
  const getRecordTypeColor = (type: HealthRecord['type']) => {
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
  
  const currentPetRecords = sampleHealthRecords.filter(record => 
    record.petId === selectedPet && 
    (activeTab === 'all' || record.type === activeTab)
  );
  
  return (
    <div className="min-h-screen pb-20">
      <div className="bg-gradient-to-b from-lavender/20 to-transparent pt-8 pb-12">
        <div className="container px-4 mx-auto">
          <h1 className="text-3xl font-bold mb-8">{t.pageTitle}</h1>
          
          {/* Health Records Section */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Heart className="text-coral w-5 h-5" /> {t.healthRecords}
              </h2>
              
              <Button className="rounded-full bg-lavender hover:bg-lavender/90" asChild>
                <Link to="/health/add">
                  <Plus className="w-4 h-4 mr-2" />
                  {t.addRecord}
                </Link>
              </Button>
            </div>
            
            <p className="text-muted-foreground mb-6">{t.healthRecordsDesc}</p>
            
            {/* Pet Selector */}
            <div className="flex flex-wrap gap-3 mb-6">
              {samplePets.map(pet => (
                <button
                  key={pet.id}
                  className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-200 ${
                    selectedPet === pet.id 
                      ? 'bg-lavender/30 text-charcoal' 
                      : 'bg-white/70 text-muted-foreground hover:bg-lavender/10'
                  }`}
                  onClick={() => setSelectedPet(pet.id)}
                >
                  <PetAvatar 
                    src={pet.imageUrl} 
                    name={pet.name} 
                    size="sm" 
                  />
                  <span>{pet.name}</span>
                </button>
              ))}
            </div>
            
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
                  records={currentPetRecords} 
                  getRecordIcon={getRecordIcon} 
                  getRecordTypeColor={getRecordTypeColor} 
                  detailsText={t.details}
                  noRecordsText={t.noRecords}
                />
              </TabsContent>
              <TabsContent value="vaccination" className="mt-0">
                <HealthRecordsList 
                  records={currentPetRecords} 
                  getRecordIcon={getRecordIcon} 
                  getRecordTypeColor={getRecordTypeColor} 
                  detailsText={t.details}
                  noRecordsText={t.noRecords}
                />
              </TabsContent>
              <TabsContent value="medication" className="mt-0">
                <HealthRecordsList 
                  records={currentPetRecords} 
                  getRecordIcon={getRecordIcon} 
                  getRecordTypeColor={getRecordTypeColor} 
                  detailsText={t.details}
                  noRecordsText={t.noRecords}
                />
              </TabsContent>
              <TabsContent value="visit" className="mt-0">
                <HealthRecordsList 
                  records={currentPetRecords} 
                  getRecordIcon={getRecordIcon} 
                  getRecordTypeColor={getRecordTypeColor} 
                  detailsText={t.details}
                  noRecordsText={t.noRecords}
                />
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Upcoming Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Bell className="text-coral w-5 h-5" /> {t.upcoming}
              </h2>
              
              <div className="flex gap-3">
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
            
            <p className="text-muted-foreground mb-6">{t.upcomingDesc}</p>
            
            {upcomingTasks.length > 0 ? (
              <div className="space-y-4">
                {upcomingTasks.map(task => (
                  <div 
                    key={task.id}
                    className="glass-morphism rounded-xl p-5 hover:shadow-md transition-shadow flex items-center"
                  >
                    <div className="bg-coral/20 text-coral p-2 rounded-full mr-4">
                      <Calendar className="w-4 h-4" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-medium">{task.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <span>{task.date}</span>
                        <span>•</span>
                        <span>{task.petName}</span>
                      </div>
                    </div>
                    
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      {t.details}
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-morphism rounded-xl p-6 text-center">
                <p className="text-muted-foreground">{t.noUpcoming}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface HealthRecordsListProps {
  records: HealthRecord[];
  getRecordIcon: (type: HealthRecord['type']) => JSX.Element;
  getRecordTypeColor: (type: HealthRecord['type']) => string;
  detailsText: string;
  noRecordsText: string;
}

const HealthRecordsList = ({ 
  records, 
  getRecordIcon, 
  getRecordTypeColor,
  detailsText,
  noRecordsText
}: HealthRecordsListProps) => {
  if (records.length === 0) {
    return (
      <div className="glass-morphism rounded-xl p-6 text-center">
        <p className="text-muted-foreground">{noRecordsText}</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {records.map(record => (
        <div 
          key={record.id}
          className="glass-morphism rounded-xl p-5 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start">
            <div className={`p-2 rounded-full mr-4 ${getRecordTypeColor(record.type)}`}>
              {getRecordIcon(record.type)}
            </div>
            
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium">{record.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <Calendar className="w-3 h-3" />
                    <span>{record.date}</span>
                  </div>
                </div>
                
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  {detailsText}
                </Button>
              </div>
              
              {record.details && (
                <p className="text-sm text-muted-foreground mt-3">
                  {record.details}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HealthRecords;
