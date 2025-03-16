
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PawPrint, ArrowRight, User, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PetProfileCard, { PetData } from '@/components/ui/PetProfileCard';
import AddPetButton from '@/components/ui/AddPetButton';
import PetProgressAnalytics from '@/components/analytics/PetProgressAnalytics';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Dashboard = () => {
  const [pets, setPets] = useState<PetData[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { language } = useLanguage();

  const translations = {
    en: {
      loading: 'Loading pets...',
      noPets: 'No pets added yet. Add your first pet!',
      hello: 'Hello, Pet Parent!',
      petParent: 'Pet Parent',
      yourPets: 'Your Pets',
      yourPetFamily: 'Your Pet Family',
      yourPetProgress: 'Your Pet Progress',
      viewAll: 'View All',
      profile: 'Profile',
      addPet: 'Add a Pet'
    },
    id: {
      loading: 'Memuat hewan peliharaan...',
      noPets: 'Belum ada hewan peliharaan. Tambahkan hewan pertama Anda!',
      hello: 'Halo, Pemilik Hewan!',
      petParent: 'Pemilik Hewan',
      yourPets: 'Hewan Peliharaan Anda',
      yourPetFamily: 'Keluarga Hewan Peliharaan Anda',
      yourPetProgress: 'Perkembangan Hewan Peliharaan Anda',
      viewAll: 'Lihat Semua',
      profile: 'Profil',
      addPet: 'Tambah Hewan'
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

  // Get current date
  const today = new Date();
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', options);

  return (
    <div className="min-h-screen pb-20">
      <div className="bg-gradient-to-b from-lavender/20 to-transparent pt-8 pb-12">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <p className="text-muted-foreground text-sm">{formattedDate}</p>
              <h1 className="text-3xl font-bold">{t.hello}</h1>
            </div>
            
            <Button className="rounded-full bg-coral hover:bg-coral/90 md:self-end" asChild>
              <Link to="/pets/new" className="flex items-center gap-2">
                <PawPrint className="w-4 h-4" /> {t.addPet}
              </Link>
            </Button>
          </div>
          
          {/* Pet Family Section with colorful header */}
          <section className="mb-12">
            <div className="bg-soft-blue py-4 px-6 rounded-lg mb-6 flex items-center">
              <User className="text-sage w-5 h-5 mr-2" />
              <h2 className="text-xl font-semibold">{t.yourPetFamily}</h2>
            </div>
            
            {/* Pet Parent subsection */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">{t.petParent}</h3>
              <div className="glass-morphism rounded-xl p-5 flex items-center mb-6">
                <Avatar className="h-12 w-12 mr-4 border border-sage/20">
                  {user?.user_metadata?.avatar_url ? (
                    <AvatarImage src={user.user_metadata.avatar_url} alt="Profile" />
                  ) : (
                    <AvatarFallback className="bg-sage/20 text-sage">
                      {user ? user.email.substring(0, 2).toUpperCase() : 'U'}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <h4 className="font-medium">{user?.user_metadata?.username || 'Pet Parent'}</h4>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
                <Link to="/profile" className="ml-auto">
                  <Button variant="outline" size="sm" className="rounded-full">
                    <User className="w-4 h-4 mr-1" />
                    <span>{t.profile}</span>
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Pets subsection */}
            <div>
              <h3 className="text-lg font-medium mb-4">{t.yourPets}</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {loading ? (
                  <div className="col-span-full text-center py-8">{t.loading}</div>
                ) : pets.length > 0 ? (
                  <>
                    {pets.map(pet => (
                      <PetProfileCard key={pet.id} pet={pet} />
                    ))}
                    <AddPetButton variant="outline" className="h-full min-h-[200px]" />
                  </>
                ) : (
                  <div className="col-span-full flex flex-col items-center py-8">
                    <p className="text-muted-foreground mb-4">{t.noPets}</p>
                    <AddPetButton variant="outline" />
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
      
      {/* Pet Progress Section with colorful header */}
      <div className="container px-4 mx-auto">
        <div className="bg-soft-peach py-4 px-6 rounded-lg mb-6 flex items-center">
          <BarChart className="text-coral w-5 h-5 mr-2" />
          <h2 className="text-xl font-semibold">{t.yourPetProgress}</h2>
        </div>
        
        {/* Analytics content without the title */}
        <div className="mt-0">
          <PetProgressAnalytics />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
