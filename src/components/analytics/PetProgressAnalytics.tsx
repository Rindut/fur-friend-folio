
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WeightChart from './WeightChart';
import HealthTimeline from '@/components/health/HealthTimeline';
import { TimelineEvent } from '@/components/health/HealthTimelineEvent';
import { useLanguage } from '@/context/LanguageContext';
import { addDays, subDays } from 'date-fns';

const PetProgressAnalytics = () => {
  const [activeTab, setActiveTab] = useState('weight');
  const { language } = useLanguage();

  const translations = {
    en: {
      title: 'Pet Progress & Analytics',
      weight: 'Weight Tracking',
      timeline: 'Health Timeline',
      petWeight: 'Pet Weight',
      healthTimeline: 'Health Timeline',
      petWeightDesc: 'Track your pet\'s weight over time to monitor their health and ensure they maintain a healthy weight.',
      healthTimelineDesc: 'View your pet\'s health history and upcoming appointments on an interactive timeline.',
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
      timeline: 'Linimasa Kesehatan',
      petWeight: 'Berat Hewan',
      healthTimeline: 'Linimasa Kesehatan',
      petWeightDesc: 'Lacak berat hewan peliharaan Anda dari waktu ke waktu untuk memantau kesehatan mereka dan memastikan mereka mempertahankan berat yang sehat.',
      healthTimelineDesc: 'Lihat riwayat kesehatan hewan peliharaan Anda dan janji temu mendatang pada linimasa interaktif.',
      lastEntry: 'Entri terakhir',
      weightGoal: 'Target berat',
      progress: 'Kemajuan',
      milestones: 'Tonggak Sejarah',
      nextVisit: 'Kunjungan selanjutnya',
      viewMore: 'Lihat Lainnya'
    }
  };

  const t = translations[language];
  
  // Sample timeline events with proper typing
  const today = new Date();
  const sampleEvents: TimelineEvent[] = [
    {
      id: '1',
      date: subDays(today, 60),
      title: 'Annual Checkup',
      type: 'checkup',
      completed: true,
      details: 'Regular annual health examination. All tests normal.'
    },
    {
      id: '2',
      date: subDays(today, 45),
      title: 'Rabies Vaccine',
      type: 'vaccination',
      completed: true,
      petName: 'Max',
      details: '3-year rabies vaccination administered.'
    },
    {
      id: '3',
      date: subDays(today, 30),
      title: 'Dental Cleaning',
      type: 'grooming',
      completed: true,
      petName: 'Bella',
      details: 'Full dental cleaning and examination.'
    },
    {
      id: '4',
      date: subDays(today, 15),
      title: 'Heartworm Test',
      type: 'checkup',
      completed: true,
      petName: 'Max'
    },
    {
      id: '5',
      date: subDays(today, 5),
      title: 'Flea Treatment',
      type: 'medication',
      completed: true,
      petName: 'Bella'
    },
    {
      id: '6',
      date: addDays(today, 10),
      title: 'Booster Shot',
      type: 'vaccination',
      completed: false,
      petName: 'Max',
      details: 'DHPP booster vaccination due.'
    },
    {
      id: '7',
      date: addDays(today, 30),
      title: 'Grooming Session',
      type: 'grooming',
      completed: false,
      petName: 'Bella'
    },
    {
      id: '8',
      date: addDays(today, 45),
      title: 'Medication Refill',
      type: 'medication',
      completed: false,
      petName: 'Max',
      details: 'Refill arthritis medication prescription.'
    },
    {
      id: '9',
      date: addDays(today, 60),
      title: 'Annual Checkup',
      type: 'checkup',
      completed: false,
      petName: 'Bella',
      details: 'Schedule for regular annual health examination.'
    }
  ];

  return (
    <div className="mt-0">
      <Card>
        <Tabs defaultValue="weight" value={activeTab} onValueChange={setActiveTab}>
          <CardHeader className="pb-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <CardTitle>
                {activeTab === 'weight' && t.petWeight}
                {activeTab === 'timeline' && t.healthTimeline}
              </CardTitle>
              <TabsList>
                <TabsTrigger value="weight">{t.weight}</TabsTrigger>
                <TabsTrigger value="timeline">{t.timeline}</TabsTrigger>
              </TabsList>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <TabsContent value="weight" className="mt-0">
              <p className="text-muted-foreground mb-6">{t.petWeightDesc}</p>
              <WeightChart />
            </TabsContent>
            <TabsContent value="timeline" className="mt-0">
              <p className="text-muted-foreground mb-6">{t.healthTimelineDesc}</p>
              <HealthTimeline events={sampleEvents} language={language} />
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default PetProgressAnalytics;
