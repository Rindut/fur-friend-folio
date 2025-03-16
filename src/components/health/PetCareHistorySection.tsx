
import { Link } from 'react-router-dom';
import { Heart, Plus } from 'lucide-react';
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
  showTabs?: boolean;
}

const PetCareHistorySection = ({
  t,
  healthRecords,
  activeTab,
  setActiveTab,
  selectedPet,
  getRecordIcon,
  getRecordTypeColor,
  showTabs = true
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
      
      {/* Record Type Tabs - Only show if showTabs is true */}
      {showTabs ? (
        <Tabs 
          defaultValue="all" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          {/* Tab triggers would be here but are now moved to the main page */}
          <TabsList className="bg-white/70 p-1 mb-6">
            {/* The tab triggers that have been moved to the parent component */}
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
      ) : (
        // If tabs are not shown, just display the records directly
        <div className="mt-0">
          <HealthRecordsList 
            records={healthRecords} 
            getRecordIcon={getRecordIcon} 
            getRecordTypeColor={getRecordTypeColor} 
            detailsText={t.details}
            noRecordsText={t.noRecords}
          />
        </div>
      )}
    </section>
  );
};

export default PetCareHistorySection;
