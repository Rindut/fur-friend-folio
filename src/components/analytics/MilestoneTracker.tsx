
import { CheckCircle, Clock, CalendarClock } from 'lucide-react';

interface MilestoneTrackerProps {
  language?: 'en' | 'id';
}

const MilestoneTracker = ({ language = 'en' }: MilestoneTrackerProps) => {
  const translations = {
    en: {
      completed: 'Completed',
      upcoming: 'Upcoming',
      lastVaccination: 'Last Vaccination',
      vaccineDate: 'January 15, 2023',
      annualCheckup: 'Annual Checkup',
      checkupDate: 'March 10, 2023',
      dentalCleaning: 'Dental Cleaning',
      cleaningDate: 'May 5, 2023',
      rabiesVaccine: 'Rabies Vaccine',
      rabiesDate: 'July 20, 2023',
      nextCheckup: 'Next Checkup',
      nextDate: 'March 10, 2024',
      daysLeft: 'days left'
    },
    id: {
      completed: 'Selesai',
      upcoming: 'Mendatang',
      lastVaccination: 'Vaksinasi Terakhir',
      vaccineDate: '15 Januari 2023',
      annualCheckup: 'Pemeriksaan Tahunan',
      checkupDate: '10 Maret 2023',
      dentalCleaning: 'Pembersihan Gigi',
      cleaningDate: '5 Mei 2023',
      rabiesVaccine: 'Vaksin Rabies',
      rabiesDate: '20 Juli 2023',
      nextCheckup: 'Pemeriksaan Berikutnya',
      nextDate: '10 Maret 2024',
      daysLeft: 'hari lagi'
    }
  };

  const t = translations[language];

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">{t.completed}</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="text-green-500 mt-0.5">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-medium">{t.lastVaccination}</h4>
              <p className="text-sm text-muted-foreground">{t.vaccineDate}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="text-green-500 mt-0.5">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-medium">{t.annualCheckup}</h4>
              <p className="text-sm text-muted-foreground">{t.checkupDate}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="text-green-500 mt-0.5">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-medium">{t.dentalCleaning}</h4>
              <p className="text-sm text-muted-foreground">{t.cleaningDate}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="text-green-500 mt-0.5">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-medium">{t.rabiesVaccine}</h4>
              <p className="text-sm text-muted-foreground">{t.rabiesDate}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">{t.upcoming}</h3>
        <div className="flex items-start gap-3 p-4 rounded-lg border border-amber-200 bg-amber-50">
          <div className="text-amber-600 mt-0.5">
            <CalendarClock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-medium">{t.nextCheckup}</h4>
            <p className="text-sm text-muted-foreground">{t.nextDate}</p>
            <div className="mt-2 flex items-center gap-1 text-sm">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>45 {t.daysLeft}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MilestoneTracker;
