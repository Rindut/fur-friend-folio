import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PawPrint, CalendarClock, Heart, Edit, ArrowLeft, Trash2, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PetAvatar from '@/components/ui/PetAvatar';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Pet, mapDbPetToPet } from '@/types/pet';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from '@/components/ui/badge';

const PetProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { language } = useLanguage();
  
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);

  const translations = {
    en: {
      backToDashboard: 'Back to Dashboard',
      species: 'Species',
      breed: 'Breed',
      age: 'Age',
      weight: 'Weight',
      birthday: 'Birthday',
      about: 'About',
      editProfile: 'Edit Profile',
      healthRecords: 'Health Records',
      viewHealthRecords: 'View Health Records',
      careReminders: 'Care Reminders',
      viewCareReminders: 'View Care Reminders',
      loading: 'Loading pet profile...',
      petNotFound: 'Pet Not Found',
      petNotFoundMessage: "We couldn't find the pet you're looking for.",
      deletePet: 'Delete Profile',
      confirmDelete: 'Are you sure you want to delete this pet profile?',
      confirmDeleteDescription: 'This action cannot be undone. This will permanently delete your pet profile and all related data.',
      cancel: 'Cancel',
      confirmDeleteAction: 'Yes, delete pet',
      petDeleted: 'Pet profile deleted successfully',
      active: 'Active',
      inactive: 'Inactive',
      errorLoading: 'Error loading pet profile'
    },
    id: {
      backToDashboard: 'Kembali ke Dashboard',
      species: 'Jenis',
      breed: 'Ras',
      age: 'Umur',
      weight: 'Berat',
      birthday: 'Tanggal Lahir',
      about: 'Tentang',
      editProfile: 'Edit Profil',
      healthRecords: 'Catatan Kesehatan',
      viewHealthRecords: 'Lihat Catatan Kesehatan',
      careReminders: 'Pengingat Perawatan',
      viewCareReminders: 'Lihat Pengingat Perawatan',
      loading: 'Memuat profil hewan...',
      petNotFound: 'Hewan Tidak Ditemukan',
      petNotFoundMessage: 'Kami tidak dapat menemukan hewan yang Anda cari.',
      deletePet: 'Hapus Profil',
      confirmDelete: 'Apakah Anda yakin ingin menghapus profil hewan ini?',
      confirmDeleteDescription: 'Tindakan ini tidak dapat dibatalkan. Ini akan menghapus profil hewan Anda secara permanen beserta semua data terkait.',
      cancel: 'Batal',
      confirmDeleteAction: 'Ya, hapus hewan',
      petDeleted: 'Profil hewan berhasil dihapus',
      active: 'Aktif',
      inactive: 'Tidak Aktif',
      errorLoading: 'Kesalahan saat memuat profil hewan'
    }
  };

  const t = translations[language];

  useEffect(() => {
    const fetchPet = async () => {
      if (!id || !user) return;
      
      try {
        console.log("Fetching pet with ID:", id);
        
        let query = supabase
          .from('pets')
          .select('*')
          .eq('user_id', user.id);
        
        // Check if id is a valid UUID
        const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        
        if (UUID_REGEX.test(id)) {
          // If ID is in UUID format, use it directly
          query = query.eq('id', id);
        } else {
          // For numeric IDs or other formats, we need a different approach
          // First, get all pets for this user and then filter by position
          const { data: allPets, error: petsError } = await supabase
            .from('pets')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: true });
            
          if (petsError) throw petsError;
          
          // Parse the ID as a number (1-based index) and get that pet
          const petIndex = parseInt(id) - 1;
          if (allPets && petIndex >= 0 && petIndex < allPets.length) {
            setPet(mapDbPetToPet(allPets[petIndex]));
          }
          setLoading(false);
          return;
        }
          
        const { data, error } = await query.single();
        
        if (error) throw error;
        
        if (data) {
          setPet(mapDbPetToPet(data));
        }
      } catch (error) {
        console.error('Error fetching pet:', error);
        toast({
          title: t.errorLoading,
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchPet();
  }, [id, user, toast, t]);

  const handleDeletePet = async () => {
    if (!id || !user) return;
    
    try {
      const { error } = await supabase
        .from('pets')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      toast({
        title: t.petDeleted
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Error deleting pet:', error);
      toast({
        title: 'Error deleting pet',
        variant: 'destructive'
      });
    }
  };

  if (loading) {
    return (
      <div className="container px-4 mx-auto py-12 flex items-center justify-center">
        <div className="animate-pulse">{t.loading}</div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="container px-4 mx-auto py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{t.petNotFound}</h2>
          <p className="text-muted-foreground mb-6">
            {t.petNotFoundMessage}
          </p>
          <Button asChild>
            <Link to="/dashboard">{t.backToDashboard}</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 mx-auto py-8">
      <Button variant="ghost" asChild className="mb-6">
        <Link to="/dashboard" className="flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" /> {t.backToDashboard}
        </Link>
      </Button>

      <div className="glass-morphism rounded-xl p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          <div className="relative">
            <PetAvatar
              src={pet.image_url}
              name={pet.name}
              size="xl"
              className="flex-shrink-0"
            />
            {pet.is_active ? (
              <Badge className="absolute -top-2 -right-2 bg-green-500">{t.active}</Badge>
            ) : (
              <Badge className="absolute -top-2 -right-2 bg-gray-400">{t.inactive}</Badge>
            )}
          </div>
          
          <div className="flex-grow text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
              <h1 className="text-3xl font-bold">{pet.name}</h1>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex items-center gap-1" asChild>
                  <Link to={`/pets/${pet.id}/edit`}>
                    <Pencil className="w-4 h-4" /> {t.editProfile}
                  </Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="destructive" className="flex items-center gap-1">
                      <Trash2 className="w-4 h-4" /> {t.deletePet}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t.confirmDelete}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t.confirmDeleteDescription}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDeletePet}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {t.confirmDeleteAction}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="font-medium">{t.species}:</span> {pet.species}
              </div>
              {pet.breed && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="font-medium">{t.breed}:</span> {pet.breed}
                </div>
              )}
              {pet.age && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="font-medium">{t.age}:</span> {pet.age}
                </div>
              )}
              {pet.weight && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="font-medium">{t.weight}:</span> {pet.weight}
                </div>
              )}
              {pet.birthday && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CalendarClock className="w-4 h-4" />
                  <span className="font-medium">{t.birthday}:</span> {new Date(pet.birthday).toLocaleDateString()}
                </div>
              )}
            </div>
            
            {pet.notes && (
              <div className="mb-4">
                <h3 className="font-medium mb-2">{t.about} {pet.name}</h3>
                <p className="text-muted-foreground">{pet.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="glass-morphism rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Heart className="text-coral w-5 h-5" /> {t.healthRecords}
          </h2>
          <Link to={`/health?pet=${pet.id}`} className="text-coral hover:text-coral/80 font-medium">
            {t.viewHealthRecords}
          </Link>
        </div>
        
        <div className="glass-morphism rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <PawPrint className="text-sage w-5 h-5" /> {t.careReminders}
          </h2>
          <Link to={`/reminders?pet=${pet.id}`} className="text-sage hover:text-sage/80 font-medium">
            {t.viewCareReminders}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PetProfile;
