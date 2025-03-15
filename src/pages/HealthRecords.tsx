
import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Heart, 
  Pill, 
  Droplets, 
  Weight, 
  AlertCircle,
  Plus,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import PetAvatar from '@/components/ui/PetAvatar';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Pet, mapDbPetToPet } from '@/types/pet';
import { HealthRecord, mapDbHealthRecordToHealthRecord } from '@/types/healthRecord';
import { useToast } from '@/hooks/use-toast';

const HealthRecords = () => {
  const [searchParams] = useSearchParams();
  const preSelectedPetId = searchParams.get('pet');
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [selectedPet, setSelectedPet] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('all');
  const { language } = useLanguage();
  
  const [pets, setPets] = useState<Pet[]>([]);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  
  const translations = {
    en: {
      pageTitle: 'Health Records',
      all: 'All',
      vaccinations: 'Vaccinations',
      medications: 'Medications',
      visits: 'Vet Visits',
      weights: 'Weight Records',
      addRecord: 'Add Record',
      noRecords: 'No health records found. Add a new record to get started.',
      details: 'Details',
      loadingPets: 'Loading pets...',
      errorLoadingPets: 'Error loading pets',
      errorLoadingRecords: 'Error loading health records'
    },
    id: {
      pageTitle: 'Catatan Kesehatan',
      all: 'Semua',
      vaccinations: 'Vaksinasi',
      medications: 'Pengobatan',
      visits: 'Kunjungan Dokter',
      weights: 'Catatan Berat',
      addRecord: 'Tambah Catatan',
      noRecords: 'Tidak ada catatan kesehatan. Tambahkan catatan baru untuk memulai.',
      details: 'Detail',
      loadingPets: 'Memuat hewan...',
      errorLoadingPets: 'Kesalahan saat memuat hewan',
      errorLoadingRecords: 'Kesalahan saat memuat catatan kesehatan'
    }
  };
  
  const t = translations[language];
  
  useEffect(() => {
    const fetchPets = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('pets')
          .select('*')
          .eq('user_id', user.id)
          .order('name', { ascending: true });
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          const petsList = data.map(pet => mapDbPetToPet(pet));
          setPets(petsList);
          
          // Set default selection to preselected pet or first active pet
          let petToSelect = '';
          
          if (preSelectedPetId) {
            // If there's a pet ID in the URL, use it if it exists in the list
            const preselectedPetExists = petsList.some(pet => pet.id === preSelectedPetId);
            if (preselectedPetExists) {
              petToSelect = preSelectedPetId;
            }
          }
          
          // If no pet is selected yet, use the first active one
          if (!petToSelect) {
            const activePet = petsList.find(pet => pet.is_active);
            if (activePet) {
              petToSelect = activePet.id;
            } else if (petsList.length > 0) {
              // If no active pets, use the first one
              petToSelect = petsList[0].id;
            }
          }
          
          setSelectedPet(petToSelect);
        }
      } catch (error) {
        console.error('Error fetching pets:', error);
        toast({
          title: t.errorLoadingPets,
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchPets();
  }, [user, toast, t, preSelectedPetId]);
  
  useEffect(() => {
    const fetchHealthRecords = async () => {
      if (!selectedPet || !user) return;
      
      try {
        const { data, error } = await supabase
          .from('health_records')
          .select('*')
          .eq('pet_id', selectedPet)
          .eq('user_id', user.id)
          .order('date', { ascending: false });
          
        if (error) throw error;
        
        if (data) {
          setHealthRecords(data.map(record => mapDbHealthRecordToHealthRecord(record)));
        }
      } catch (error) {
        console.error('Error fetching health records:', error);
        toast({
          title: t.errorLoadingRecords,
          variant: 'destructive'
        });
      }
    };
    
    fetchHealthRecords();
  }, [selectedPet, user, toast, t]);
  
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
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', options);
  };
  
  const currentPetRecords = healthRecords.filter(record => 
    (activeTab === 'all' || record.type === activeTab)
  );
  
  if (loading) {
    return (
      <div className="container px-4 mx-auto py-12 flex items-center justify-center">
        <div className="animate-pulse">{t.loadingPets}</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pb-20">
      <div className="bg-gradient-to-b from-lavender/20 to-transparent pt-8 pb-12">
        <div className="container px-4 mx-auto">
          <h1 className="text-3xl font-bold mb-8">{t.pageTitle}</h1>
          
          {/* Pet Selector */}
          <div className="flex flex-wrap gap-3 mb-8">
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
                <PetAvatar 
                  src={pet.image_url} 
                  name={pet.name} 
                  size="sm" 
                />
                <span>{pet.name}</span>
                {!pet.is_active && (
                  <span className="ml-1 text-xs px-1.5 py-0.5 bg-gray-200 text-gray-600 rounded-full">
                    Inactive
                  </span>
                )}
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
            <div className="flex items-center justify-between mb-6">
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
                  value="weight"
                  className="data-[state=active]:bg-lavender/30 data-[state=active]:text-charcoal rounded-lg"
                >
                  <Weight className="w-4 h-4 mr-2" />
                  {t.weights}
                </TabsTrigger>
                <TabsTrigger 
                  value="visit"
                  className="data-[state=active]:bg-lavender/30 data-[state=active]:text-charcoal rounded-lg"
                >
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {t.visits}
                </TabsTrigger>
              </TabsList>
              
              <Button className="rounded-full bg-lavender hover:bg-lavender/90 ml-2" asChild>
                <Link to={`/health/add${selectedPet ? `?pet=${selectedPet}` : ''}`}>
                  <Plus className="w-4 h-4 mr-2" />
                  {t.addRecord}
                </Link>
              </Button>
            </div>
            
            <TabsContent value="all" className="mt-0">
              <HealthRecordsList 
                records={currentPetRecords} 
                getRecordIcon={getRecordIcon} 
                getRecordTypeColor={getRecordTypeColor} 
                formatDate={formatDate}
                detailsText={t.details}
                noRecordsText={t.noRecords}
              />
            </TabsContent>
            <TabsContent value="vaccination" className="mt-0">
              <HealthRecordsList 
                records={currentPetRecords} 
                getRecordIcon={getRecordIcon} 
                getRecordTypeColor={getRecordTypeColor}
                formatDate={formatDate}
                detailsText={t.details}
                noRecordsText={t.noRecords}
              />
            </TabsContent>
            <TabsContent value="medication" className="mt-0">
              <HealthRecordsList 
                records={currentPetRecords} 
                getRecordIcon={getRecordIcon} 
                getRecordTypeColor={getRecordTypeColor}
                formatDate={formatDate} 
                detailsText={t.details}
                noRecordsText={t.noRecords}
              />
            </TabsContent>
            <TabsContent value="weight" className="mt-0">
              <HealthRecordsList 
                records={currentPetRecords} 
                getRecordIcon={getRecordIcon} 
                getRecordTypeColor={getRecordTypeColor}
                formatDate={formatDate}
                detailsText={t.details}
                noRecordsText={t.noRecords}
              />
            </TabsContent>
            <TabsContent value="visit" className="mt-0">
              <HealthRecordsList 
                records={currentPetRecords} 
                getRecordIcon={getRecordIcon} 
                getRecordTypeColor={getRecordTypeColor}
                formatDate={formatDate}
                detailsText={t.details}
                noRecordsText={t.noRecords}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

interface HealthRecordsListProps {
  records: HealthRecord[];
  getRecordIcon: (type: HealthRecord['type']) => JSX.Element;
  getRecordTypeColor: (type: HealthRecord['type']) => string;
  formatDate: (dateString: string) => string;
  detailsText: string;
  noRecordsText: string;
}

const HealthRecordsList = ({ 
  records, 
  getRecordIcon, 
  getRecordTypeColor,
  formatDate,
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
                    <span>{formatDate(record.date)}</span>
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
