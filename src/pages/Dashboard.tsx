
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PawPrint, Clock, ArrowRight, Calendar, Plus, Heart, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PetProfileCard, { PetData } from '@/components/ui/PetProfileCard';
import CareTaskCard, { CareTask } from '@/components/ui/CareTaskCard';
import AddPetButton from '@/components/ui/AddPetButton';
import PetProgressAnalytics from '@/components/analytics/PetProgressAnalytics';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

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
  const [pets, setPets] = useState<PetData[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { language } = useLanguage();

  const translations = {
    en: {
      loading: 'Loading pets...',
      noPets: 'No pets added yet. Add your first pet!',
      hello: 'Hello, Pet Parent!',
      yourPets: 'Your Pets',
      viewAll: 'View All',
      upcomingTasks: 'Upcoming Tasks',
      viewCalendar: 'View Calendar',
      noTasks: 'No upcoming tasks. Enjoy the time with your pets!',
      addTask: 'Add New Task',
      completed: 'Completed',
      quickAccess: 'Quick Access',
      healthRecords: 'Health Records',
      healthRecordsDesc: 'Track vaccinations and vet visits',
      reminders: 'Reminders',
      remindersDesc: 'Create and manage care reminders',
      addPet: 'Add a Pet',
      addPetDesc: 'Create a new pet profile',
      addReminder: 'Add Reminder'
    },
    id: {
      loading: 'Memuat hewan peliharaan...',
      noPets: 'Belum ada hewan peliharaan. Tambahkan hewan pertama Anda!',
      hello: 'Halo, Pemilik Hewan!',
      yourPets: 'Hewan Peliharaan Anda',
      viewAll: 'Lihat Semua',
      upcomingTasks: 'Tugas Mendatang',
      viewCalendar: 'Lihat Kalender',
      noTasks: 'Tidak ada tugas mendatang. Nikmati waktu Anda bersama hewan peliharaan!',
      addTask: 'Tambah Tugas Baru',
      completed: 'Selesai',
      quickAccess: 'Akses Cepat',
      healthRecords: 'Catatan Kesehatan',
      healthRecordsDesc: 'Lacak vaksinasi dan kunjungan dokter hewan',
      reminders: 'Pengingat',
      remindersDesc: 'Buat dan kelola pengingat perawatan',
      addPet: 'Tambah Hewan',
      addPetDesc: 'Buat profil hewan baru',
      addReminder: 'Tambah Pengingat'
    }
  };

  const t = translations[language];

  useEffect(() => {
    const fetchPets = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('pets')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        if (data) {
          const formattedPets: PetData[] = data.map(pet => ({
            id: pet.id,
            name: pet.name,
            species: pet.species as 'dog' | 'cat' | 'bird' | 'rabbit' | 'fish' | 'other',
            breed: pet.breed || undefined,
            age: pet.age || undefined,
            imageUrl: pet.image_url || undefined,
            isActive: pet.is_active
          }));
          
          setPets(formattedPets);
        }
      } catch (error) {
        console.error('Error fetching pets:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPets();
  }, [user]);

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
  const formattedDate = today.toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', options);

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
              <h1 className="text-3xl font-bold">{t.hello}</h1>
            </div>
            
            <Button className="rounded-full bg-coral hover:bg-coral/90 md:self-end">
              <Link to="/reminders/new" className="flex items-center gap-2">
                <Plus className="w-4 h-4" /> {t.addReminder}
              </Link>
            </Button>
          </div>
          
          {/* Pets section */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <PawPrint className="text-coral w-5 h-5" /> {t.yourPets}
              </h2>
              <Link to="/pets" className="text-sm text-coral hover:text-coral/80 font-medium flex items-center gap-1">
                {t.viewAll} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {loading ? (
                <div className="col-span-full text-center py-8">{t.loading}</div>
              ) : pets.length > 0 ? (
                <>
                  {pets.map(pet => (
                    <PetProfileCard key={pet.id} pet={pet} />
                  ))}
                  <AddPetButton variant="outline" />
                </>
              ) : (
                <div className="col-span-full flex flex-col items-center py-8">
                  <p className="text-muted-foreground mb-4">{t.noPets}</p>
                  <AddPetButton variant="outline" />
                </div>
              )}
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
                <Clock className="text-coral w-5 h-5" /> {t.upcomingTasks}
              </h2>
              <Link to="/reminders" className="text-sm text-coral hover:text-coral/80 font-medium flex items-center gap-1">
                {t.viewCalendar} <Calendar className="w-4 h-4" />
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
                  <p className="text-muted-foreground">{t.noTasks}</p>
                </div>
              )}
              
              <Link to="/reminders/new">
                <div className="glass-morphism rounded-xl p-4 border-dashed border-2 border-slate-200/50 flex items-center justify-center text-muted-foreground hover:text-coral hover:border-coral/30 transition-colors">
                  <Plus className="w-4 h-4 mr-2" />
                  <span>{t.addTask}</span>
                </div>
              </Link>
            </div>
            
            {completedTasks.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4 text-muted-foreground">{t.completed}</h3>
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
              <h2 className="text-xl font-semibold mb-4">{t.quickAccess}</h2>
              
              <div className="space-y-4">
                <Link to="/health">
                  <div className="flex items-center p-3 rounded-lg hover:bg-muted/20 transition-colors">
                    <div className="bg-lavender/20 text-lavender p-2 rounded-full mr-4">
                      <Heart className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">{t.healthRecords}</h3>
                      <p className="text-sm text-muted-foreground">{t.healthRecordsDesc}</p>
                    </div>
                  </div>
                </Link>
                
                <Link to="/reminders">
                  <div className="flex items-center p-3 rounded-lg hover:bg-muted/20 transition-colors">
                    <div className="bg-coral/20 text-coral p-2 rounded-full mr-4">
                      <Bell className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">{t.reminders}</h3>
                      <p className="text-sm text-muted-foreground">{t.remindersDesc}</p>
                    </div>
                  </div>
                </Link>
                
                <Link to="/pets/new">
                  <div className="flex items-center p-3 rounded-lg hover:bg-muted/20 transition-colors">
                    <div className="bg-sage/20 text-sage p-2 rounded-full mr-4">
                      <PawPrint className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">{t.addPet}</h3>
                      <p className="text-sm text-muted-foreground">{t.addPetDesc}</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Pet Progress & Analytics */}
        <PetProgressAnalytics />
      </div>
    </div>
  );
};

export default Dashboard;
