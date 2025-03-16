
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
      petCareHistory: 'Pet Care History',
      upcomingPetCare: 'Upcoming Pet Care',
      petCareHistoryDesc: 'Track your pet\'s complete medical history in one place. Store past veterinary visits, vaccinations, medications, surgeries, and health conditions.',
      upcomingPetCareDesc: 'Never miss important pet care schedules with smart reminders for upcoming appointments.',
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
      petCareHistory: 'Riwayat Perawatan Hewan',
      upcomingPetCare: 'Perawatan Hewan Mendatang',
      petCareHistoryDesc: 'Lacak seluruh riwayat medis hewan peliharaan Anda dalam satu tempat. Simpan kunjungan dokter hewan, vaksinasi, pengobatan, operasi, dan kondisi kesehatan di masa lalu.',
      upcomingPetCareDesc: 'Jangan lewatkan jadwal perawatan hewan penting dengan pengingat pintar untuk janji temu mendatang.',
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
              <CardTitle>{activeTab === 'weight' ? t.petCareHistory : t.upcomingPetCare}</CardTitle>
              <TabsList>
                <TabsTrigger value="weight">{t.petCareHistory}</TabsTrigger>
                <TabsTrigger value="health">{t.upcomingPetCare}</TabsTrigger>
              </TabsList>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <TabsContent value="weight" className="mt-0">
              <p className="text-muted-foreground mb-6">{t.petCareHistoryDesc}</p>
              <WeightChart language={language} />
            </TabsContent>
            <TabsContent value="health" className="mt-0">
              <p className="text-muted-foreground mb-6">{t.upcomingPetCareDesc}</p>
              <MilestoneTracker language={language} />
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default PetProgressAnalytics;
