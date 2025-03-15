
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PawPrint, Clock, ArrowRight, Calendar, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PetProfileCard, { PetData } from '@/components/ui/PetProfileCard';
import CareTaskCard, { CareTask } from '@/components/ui/CareTaskCard';
import AddPetButton from '@/components/ui/AddPetButton';

// Sample data
const samplePets: PetData[] = [
  {
    id: '1',
    name: 'Luna',
    species: 'dog',
    breed: 'Golden Retriever',
    age: '3 years',
    imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZG9nfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
    upcomingCare: {
      type: 'Vaccination',
      date: 'Tomorrow'
    }
  },
  {
    id: '2',
    name: 'Oliver',
    species: 'cat',
    breed: 'Siamese',
    age: '2 years',
    imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y2F0fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
    upcomingCare: {
      type: 'Grooming',
      date: 'In 3 days'
    }
  }
];

const sampleTasks: CareTask[] = [
  {
    id: '1',
    type: 'medication',
    title: 'Heart Medication',
    petName: 'Luna',
    petId: '1',
    dueDate: 'Today',
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
    dueDate: 'Tomorrow',
    time: '10:30 AM',
    completed: false
  },
  {
    id: '3',
    type: 'grooming',
    title: 'Grooming Appointment',
    petName: 'Oliver',
    petId: '2',
    dueDate: 'In 3 days',
    completed: false
  },
  {
    id: '4',
    type: 'feeding',
    title: 'Special Diet Food',
    petName: 'Oliver',
    petId: '2',
    dueDate: 'Today',
    time: '6:00 PM',
    completed: true
  }
];

const Dashboard = () => {
  const [tasks, setTasks] = useState<CareTask[]>(sampleTasks);

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Get current date
  const today = new Date();
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', options);

  // Filter tasks
  const upcomingTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <div className="min-h-screen pb-20">
      <div className="bg-gradient-to-b from-lavender/20 to-transparent pt-8 pb-12">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <p className="text-muted-foreground text-sm">{formattedDate}</p>
              <h1 className="text-3xl font-bold">Hello, Pet Parent!</h1>
            </div>
            
            <Button className="rounded-full bg-coral hover:bg-coral/90 md:self-end">
              <Link to="/reminders/new" className="flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add Reminder
              </Link>
            </Button>
          </div>
          
          {/* Pets section */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <PawPrint className="text-coral w-5 h-5" /> Your Pets
              </h2>
              <Link to="/pets" className="text-sm text-coral hover:text-coral/80 font-medium flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {samplePets.map(pet => (
                <PetProfileCard key={pet.id} pet={pet} />
              ))}
              <AddPetButton variant="outline" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Tasks section */}
      <div className="container px-4 mx-auto mt-8">
        <div className="grid grid-cols-1 md:grid-cols-7 gap-8">
          <div className="md:col-span-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Clock className="text-coral w-5 h-5" /> Upcoming Tasks
              </h2>
              <Link to="/reminders" className="text-sm text-coral hover:text-coral/80 font-medium flex items-center gap-1">
                View Calendar <Calendar className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="space-y-4">
              {upcomingTasks.length > 0 ? (
                upcomingTasks.map(task => (
                  <CareTaskCard 
                    key={task.id} 
                    task={task} 
                    onComplete={toggleTaskCompletion} 
                  />
                ))
              ) : (
                <div className="glass-morphism rounded-xl p-6 text-center">
                  <p className="text-muted-foreground">No upcoming tasks. Enjoy the time with your pets!</p>
                </div>
              )}
              
              <Link to="/reminders/new">
                <div className="glass-morphism rounded-xl p-4 border-dashed border-2 border-slate-200/50 flex items-center justify-center text-muted-foreground hover:text-coral hover:border-coral/30 transition-colors">
                  <Plus className="w-4 h-4 mr-2" />
                  <span>Add New Task</span>
                </div>
              </Link>
            </div>
            
            {completedTasks.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4 text-muted-foreground">Completed</h3>
                <div className="space-y-4">
                  {completedTasks.map(task => (
                    <CareTaskCard 
                      key={task.id} 
                      task={task} 
                      onComplete={toggleTaskCompletion} 
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="md:col-span-3">
            <div className="glass-morphism rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Quick Access</h2>
              
              <div className="space-y-4">
                <Link to="/health">
                  <div className="flex items-center p-3 rounded-lg hover:bg-muted/20 transition-colors">
                    <div className="bg-lavender/20 text-lavender p-2 rounded-full mr-4">
                      <Heart className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Health Records</h3>
                      <p className="text-sm text-muted-foreground">Track vaccinations and vet visits</p>
                    </div>
                  </div>
                </Link>
                
                <Link to="/reminders">
                  <div className="flex items-center p-3 rounded-lg hover:bg-muted/20 transition-colors">
                    <div className="bg-coral/20 text-coral p-2 rounded-full mr-4">
                      <Bell className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Reminders</h3>
                      <p className="text-sm text-muted-foreground">Create and manage care reminders</p>
                    </div>
                  </div>
                </Link>
                
                <Link to="/pets/new">
                  <div className="flex items-center p-3 rounded-lg hover:bg-muted/20 transition-colors">
                    <div className="bg-sage/20 text-sage p-2 rounded-full mr-4">
                      <PawPrint className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Add a Pet</h3>
                      <p className="text-sm text-muted-foreground">Create a new pet profile</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
