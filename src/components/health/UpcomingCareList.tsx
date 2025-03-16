
import { Calendar } from "lucide-react";
import AddReminderButton from '@/components/reminders/AddReminderButton';
import { Button } from '@/components/ui/button';

interface UpcomingTask {
  id: string;
  title: string;
  date: string;
  petName: string;
  petId: string;
}

interface UpcomingCareListProps {
  tasks: UpcomingTask[];
  detailsText: string;
  noUpcomingText: string;
}

const UpcomingCareList = ({ tasks, detailsText, noUpcomingText }: UpcomingCareListProps) => {
  if (tasks.length === 0) {
    return (
      <div className="glass-morphism rounded-xl p-6 text-center">
        <p className="text-muted-foreground">{noUpcomingText}</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {tasks.map(task => (
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
          
          <div className="flex items-center gap-2">
            <AddReminderButton 
              petId={task.petId}
              healthRecordId={task.id}
              variant="ghost"
              size="sm"
              showLabel={false}
              className="text-coral hover:bg-coral/10 p-2 rounded-full"
            />
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              {detailsText}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UpcomingCareList;
