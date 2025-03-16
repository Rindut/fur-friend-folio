
import { Link } from 'react-router-dom';
import { Bell, Calendar, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import UpcomingCareList from '@/components/health/UpcomingCareList';

interface UpcomingTask {
  id: string;
  title: string;
  date: string;
  petName: string;
  petId: string;
}

interface UpcomingPetCareSectionProps {
  t: Record<string, string>;
  upcomingTasks: UpcomingTask[];
}

const UpcomingPetCareSection = ({ t, upcomingTasks }: UpcomingPetCareSectionProps) => {
  return (
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
  );
};

export default UpcomingPetCareSection;
