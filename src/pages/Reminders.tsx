
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import CareTaskCard, { CareTask } from '@/components/ui/CareTaskCard';
import { Plus, Calendar as CalendarIcon, ListTodo } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';

// Sample data
const sampleTasks: CareTask[] = [
  {
    id: '1',
    type: 'medication',
    title: 'Heart Medication',
    petName: 'Luna',
    petId: '1',
    dueDate: '2023-06-15',
    time: '8:00 AM',
    completed: false,
    important: true
  },
  {
    id: '2',
    type: 'vaccination',
    title: 'Rabies Vaccination',
    petName: 'Luna',
    petId: '1',
    dueDate: '2023-06-16',
    time: '10:30 AM',
    completed: false
  },
  {
    id: '3',
    type: 'grooming',
    title: 'Grooming Appointment',
    petName: 'Oliver',
    petId: '2',
    dueDate: '2023-06-18',
    completed: false
  },
  {
    id: '4',
    type: 'feeding',
    title: 'Special Diet Food',
    petName: 'Oliver',
    petId: '2',
    dueDate: '2023-06-15',
    time: '6:00 PM',
    completed: true
  },
  {
    id: '5',
    type: 'walk',
    title: 'Evening Walk',
    petName: 'Luna',
    petId: '1',
    dueDate: '2023-06-15',
    time: '7:00 PM',
    completed: false
  },
  {
    id: '6',
    type: 'medication',
    title: 'Flea Treatment',
    petName: 'Oliver',
    petId: '2',
    dueDate: '2023-06-20',
    completed: false
  }
];

// Format the date for display
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

// Group tasks by date
const groupTasksByDate = (tasks: CareTask[]) => {
  const grouped: Record<string, CareTask[]> = {};
  
  tasks.forEach(task => {
    if (!grouped[task.dueDate]) {
      grouped[task.dueDate] = [];
    }
    grouped[task.dueDate].push(task);
  });
  
  return grouped;
};

const Reminders = () => {
  const [tasks, setTasks] = useState<CareTask[]>(sampleTasks);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<'list' | 'calendar'>('list');

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };
  
  const upcomingTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);
  
  const groupedUpcomingTasks = groupTasksByDate(upcomingTasks);
  const groupedCompletedTasks = groupTasksByDate(completedTasks);
  
  const taskDates = Object.keys(groupedUpcomingTasks).reduce((acc, date) => {
    acc[date] = groupedUpcomingTasks[date].length;
    return acc;
  }, {} as Record<string, number>);
  
  // Selected date tasks
  const selectedDateStr = date ? date.toISOString().split('T')[0] : '';
  const selectedDateTasks = tasks.filter(task => 
    task.dueDate === selectedDateStr
  );
  
  return (
    <div className="min-h-screen pb-20">
      <div className="bg-gradient-to-b from-coral/10 to-transparent pt-8 pb-12">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <h1 className="text-3xl font-bold">Reminders</h1>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                className={`rounded-l-full rounded-r-none ${view === 'list' ? 'bg-coral/20 text-coral border-coral/30' : ''}`}
                onClick={() => setView('list')}
              >
                <ListTodo className="w-4 h-4 mr-2" />
                List
              </Button>
              <Button 
                variant="outline" 
                className={`rounded-r-full rounded-l-none ${view === 'calendar' ? 'bg-coral/20 text-coral border-coral/30' : ''}`}
                onClick={() => setView('calendar')}
              >
                <CalendarIcon className="w-4 h-4 mr-2" />
                Calendar
              </Button>
              
              <Button className="rounded-full bg-coral hover:bg-coral/90 ml-2">
                <Plus className="w-4 h-4 mr-2" />
                Add Reminder
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-7 gap-8">
            {view === 'calendar' ? (
              <>
                <div className="md:col-span-3 glass-morphism rounded-xl p-6">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md"
                    modifiers={{
                      hasTasks: (date) => {
                        const dateStr = date.toISOString().split('T')[0];
                        return !!taskDates[dateStr];
                      }
                    }}
                    modifiersStyles={{
                      hasTasks: {
                        backgroundColor: 'rgba(255, 126, 103, 0.1)',
                        color: 'rgb(255, 126, 103)',
                        fontWeight: '500'
                      }
                    }}
                  />
                </div>
                
                <div className="md:col-span-4">
                  <h2 className="font-medium text-xl mb-4 flex items-center">
                    <CalendarIcon className="w-5 h-5 mr-2 text-coral" />
                    {date ? formatDate(date.toISOString().split('T')[0]) : 'Select a date'}
                  </h2>
                  
                  <div className="space-y-4">
                    {selectedDateTasks.length > 0 ? (
                      selectedDateTasks.map(task => (
                        <CareTaskCard 
                          key={task.id} 
                          task={{...task, dueDate: formatDate(task.dueDate)}} 
                          onComplete={toggleTaskCompletion} 
                        />
                      ))
                    ) : (
                      <div className="glass-morphism rounded-xl p-6 text-center">
                        <p className="text-muted-foreground">No reminders for this date.</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="md:col-span-7">
                {Object.entries(groupedUpcomingTasks).length > 0 ? (
                  Object.entries(groupedUpcomingTasks).map(([date, dateTasks]) => (
                    <div key={date} className="mb-8">
                      <h2 className="font-medium text-xl mb-4 flex items-center">
                        <CalendarIcon className="w-5 h-5 mr-2 text-coral" />
                        {formatDate(date)}
                      </h2>
                      
                      <div className="space-y-4">
                        {dateTasks.map(task => (
                          <CareTaskCard 
                            key={task.id} 
                            task={{...task, dueDate: formatDate(task.dueDate)}} 
                            onComplete={toggleTaskCompletion} 
                          />
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="glass-morphism rounded-xl p-6 text-center mb-8">
                    <p className="text-muted-foreground">No upcoming reminders.</p>
                  </div>
                )}
                
                {Object.entries(groupedCompletedTasks).length > 0 && (
                  <div className="mt-12">
                    <h2 className="font-medium text-xl mb-4 text-muted-foreground">Completed</h2>
                    
                    <div className="space-y-4">
                      {Object.entries(groupedCompletedTasks).flatMap(([date, dateTasks]) => 
                        dateTasks.map(task => (
                          <CareTaskCard 
                            key={task.id} 
                            task={{...task, dueDate: formatDate(task.dueDate)}} 
                            onComplete={toggleTaskCompletion} 
                          />
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reminders;
