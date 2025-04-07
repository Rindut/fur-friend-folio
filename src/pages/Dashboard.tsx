
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PawPrint, BarChart, Calendar, Plus, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import HeaderWithDate from '@/components/common/HeaderWithDate';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import PetProfileCard, { PetData } from '@/components/ui/PetProfileCard';
import AddPetButton from '@/components/ui/AddPetButton';
import HealthTimeline from '@/components/health/HealthTimeline';
import { useHealthRecords } from '@/components/health/useHealthRecords';
import { TimelineEvent } from '@/components/health/HealthTimelineEvent';

const Dashboard = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [pets, setPets] = useState<PetData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch health records for timeline
  const { healthRecords, upcomingTasks, loading: recordsLoading } = useHealthRecords();
  
  // Convert health records to timeline events
  const timelineEvents: TimelineEvent[] = [...healthRecords, ...upcomingTasks].map(record => ({
    id: record.id,
    title: record.title,
    date: record.date,
    type: record.type || 'vaccination',
    petName: record.petName || '',
    petId: record.petId || '',
    completed: !record.upcoming
  }));

  const translations = {
    en: {
      hello: 'Hello, Pet Parent!',
      yourPetFamily: 'Your Pet Family',
      viewAll: 'See More',
      addPet: 'Add Pet',
      healthTimeline: 'Health Timeline',
      upcomingEvents: 'Upcoming Events',
      historyEvents: 'History',
      addRecord: 'Add Record',
      loading: 'Loading...',
      noPets: 'No pets added yet. Add your first pet!',
    },
    id: {
      hello: 'Halo, Pemilik Hewan!',
      yourPetFamily: 'Keluarga Hewan Anda',
      viewAll: 'Lihat Semua',
      addPet: 'Tambah Hewan',
      healthTimeline: 'Timeline Kesehatan',
      upcomingEvents: 'Agenda Mendatang',
      historyEvents: 'Riwayat',
      addRecord: 'Tambah Catatan',
      loading: 'Memuat...',
      noPets: 'Belum ada hewan peliharaan. Tambahkan hewan pertama Anda!',
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
          .order('created_at', { ascending: false })
          .limit(3); // Only get 3 pets for the dashboard
          
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

  // Get user's first name from metadata or email
  const userName = user?.user_metadata?.username || 
                  user?.user_metadata?.first_name || 
                  (user?.email ? user.email.split('@')[0] : 'Pet Parent');

  return (
    <div className="min-h-screen pb-20">
      <div className="bg-gradient-to-b from-lavender/20 to-transparent pt-8 pb-12">
        <div className="container px-4 mx-auto">
          {/* Greeting with profile icon */}
          <div className="flex items-center justify-between mb-8">
            <HeaderWithDate title={`${t.hello.replace('Pet Parent', userName)}`} />
            <Link to="/profile">
              <Avatar className="h-10 w-10 border border-sage/20">
                {user?.user_metadata?.avatar_url ? (
                  <AvatarImage src={user.user_metadata.avatar_url} alt="Profile" />
                ) : (
                  <AvatarFallback className="bg-sage/20 text-sage">
                    {user ? user.email.substring(0, 2).toUpperCase() : 'U'}
                  </AvatarFallback>
                )}
              </Avatar>
            </Link>
          </div>
          
          {/* Pet Family Section */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">{t.yourPetFamily}</h2>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/pet-family">{t.viewAll}</Link>
                </Button>
                <Button size="sm" className="bg-coral hover:bg-coral/90" asChild>
                  <Link to="/pets/new" className="flex items-center gap-1">
                    <Plus className="w-3 h-3" /> {t.addPet}
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {loading ? (
                <div className="col-span-full text-center py-8">{t.loading}</div>
              ) : pets.length > 0 ? (
                pets.map(pet => (
                  <PetProfileCard key={pet.id} pet={pet} compact />
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center py-8">
                  <p className="text-muted-foreground mb-4">{t.noPets}</p>
                  <AddPetButton variant="outline" />
                </div>
              )}
            </div>
          </section>
          
          {/* Health Timeline Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Heart className="w-5 h-5 text-coral" />
                {t.healthTimeline}
              </h2>
              <Button size="sm" className="bg-lavender hover:bg-lavender/90" asChild>
                <Link to="/health/add" className="flex items-center gap-1">
                  <Plus className="w-3 h-3" /> {t.addRecord}
                </Link>
              </Button>
            </div>
            
            {recordsLoading ? (
              <div className="text-center py-8">{t.loading}</div>
            ) : (
              <HealthTimeline events={timelineEvents} language={language} />
            )}
            
            <div className="mt-4 flex justify-center">
              <Button variant="outline" asChild>
                <Link to="/health" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> {t.viewAll}
                </Link>
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
