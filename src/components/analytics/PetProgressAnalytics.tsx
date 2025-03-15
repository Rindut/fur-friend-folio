
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WeightChart from './WeightChart';
import MilestoneTracker from './MilestoneTracker';
import { useLanguage } from '@/context/LanguageContext';

const PetProgressAnalytics = () => {
  const [activeTab, setActiveTab] = useState('weight');
  const { language } = useLanguage();

  const translations = {
    en: {
      title: 'Pet Progress & Analytics',
      weight: 'Weight Tracking',
      health: 'Health Milestones',
      lastEntry: 'Last entry',
      weightGoal: 'Weight goal',
      progress: 'Progress',
      milestones: 'Milestones',
      nextVisit: 'Next visit',
      viewMore: 'View More'
    },
    id: {
      title: 'Perkembangan & Analitik Hewan',
      weight: 'Pelacakan Berat',
      health: 'Tonggak Kesehatan',
      lastEntry: 'Entri terakhir',
      weightGoal: 'Target berat',
      progress: 'Kemajuan',
      milestones: 'Tonggak Sejarah',
      nextVisit: 'Kunjungan selanjutnya',
      viewMore: 'Lihat Lainnya'
    }
  };

  const t = translations[language];

  return (
    <div className="mt-12">
      <h2 className="text-xl font-semibold mb-6">{t.title}</h2>

      <Card>
        <Tabs defaultValue="weight" value={activeTab} onValueChange={setActiveTab}>
          <CardHeader className="pb-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <CardTitle>{activeTab === 'weight' ? t.weight : t.health}</CardTitle>
              <TabsList>
                <TabsTrigger value="weight">{t.weight}</TabsTrigger>
                <TabsTrigger value="health">{t.health}</TabsTrigger>
              </TabsList>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <TabsContent value="weight" className="mt-0">
              <WeightChart language={language} />
            </TabsContent>
            <TabsContent value="health" className="mt-0">
              <MilestoneTracker language={language} />
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default PetProgressAnalytics;
