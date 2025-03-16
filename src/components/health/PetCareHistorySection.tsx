
import { Link } from 'react-router-dom';
import { Heart, Droplets, Pill, AlertCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import HealthRecordsList from '@/components/health/HealthRecordsList';

interface HealthRecord {
  id: string;
  type: 'vaccination' | 'medication' | 'weight' | 'visit';
  title: string;
  date: string;
  details?: string;
  petId: string;
}

interface PetCareHistorySectionProps {
  t: Record<string, string>;
  healthRecords: HealthRecord[];
  activeTab: string;
  setActiveTab: (value: string) => void;
  selectedPet: string;
  getRecordIcon: (type: HealthRecord['type']) => JSX.Element;
  getRecordTypeColor: (type: HealthRecord['type']) => string;
}

const PetCareHistorySection = ({
  t,
  healthRecords,
  activeTab,
  setActiveTab,
  selectedPet,
  getRecordIcon,
  getRecordTypeColor
}: PetCareHistorySectionProps) => {
  return (
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
  );
};

export default PetCareHistorySection;
