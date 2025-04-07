import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PawPrint, CalendarClock, Heart, Edit, ArrowLeft, AlertTriangle, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PetAvatar from '@/components/ui/PetAvatar';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
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
import { Switch } from '@/components/ui/switch';

interface PetDetails {
  id: string;
  name: string;
  species: 'dog' | 'cat' | 'bird' | 'rabbit' | 'fish' | 'other';
  breed?: string;
  age?: string;
  ageYears?: number;
  ageMonths?: number;
  weight?: string;
  weightKg?: number;
  birthday?: string;
  imageUrl?: string;
  notes?: string;
  isActive?: boolean;
}

const PetProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [pet, setPet] = useState<PetDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language } = useLanguage();

  const translations = {
    en: {
      backToDashboard: 'Back to Dashboard',
      loading: 'Loading pet profile...',
      petNotFound: 'Pet Not Found',
      petNotFoundDesc: "We couldn't find the pet you're looking for.",
      returnToDashboard: 'Return to Dashboard',
      inactiveWarning: 'This pet is currently inactive',
      editProfile: 'Edit Profile',
      delete: 'Delete',
      deleteTitle: 'Delete Pet Profile',
      deleteDesc: 'Are you sure you want to delete {name}\'s profile? This action cannot be undone.',
      cancel: 'Cancel',
      confirmDelete: 'Delete',
      species: 'Species',
      breed: 'Breed',
      age: 'Age',
      year: 'year',
      years: 'years',
      month: 'month',
      months: 'months',
      weight: 'Weight',
      birthday: 'Birthday',
      status: 'Status',
      active: 'Active',
      inactive: 'Inactive',
      about: 'About',
      healthRecords: 'Health Records',
      viewHealthRecords: 'View Health Records',
      addHealthRecord: 'Add Health Record',
      careReminders: 'Care Reminders',
      viewCareReminders: 'View Care Reminders',
      addReminder: 'Add Reminder'
    },
    id: {
      backToDashboard: 'Kembali ke Dasbor',
      loading: 'Memuat profil hewan...',
      petNotFound: 'Hewan Tidak Ditemukan',
      petNotFoundDesc: 'Kami tidak dapat menemukan hewan yang Anda cari.',
      returnToDashboard: 'Kembali ke Dasbor',
      inactiveWarning: 'Hewan ini saat ini tidak aktif',
      editProfile: 'Edit Profil',
      delete: 'Hapus',
      deleteTitle: 'Hapus Profil Hewan',
      deleteDesc: 'Apakah Anda yakin ingin menghapus profil {name}? Tindakan ini tidak dapat dibatalkan.',
      cancel: 'Batal',
      confirmDelete: 'Hapus',
      species: 'Jenis',
      breed: 'Ras',
      age: 'Umur',
      year: 'tahun',
      years: 'tahun',
      month: 'bulan',
      months: 'bulan',
      weight: 'Berat',
      birthday: 'Tanggal Lahir',
      status: 'Status',
      active: 'Aktif',
      inactive: 'Tidak Aktif',
      about: 'Tentang',
      healthRecords: 'Catatan Kesehatan',
      viewHealthRecords: 'Lihat Catatan Kesehatan',
      addHealthRecord: 'Tambah Catatan Kesehatan',
      careReminders: 'Pengingat Perawatan',
      viewCareReminders: 'Lihat Pengingat Perawatan',
      addReminder: 'Tambah Pengingat'
    }
  };

  const t = translations[language];

  useEffect(() => {
    const fetchPet = async () => {
      if (!user || !id) return;

      try {
        // First try to fetch by UUID
        let petData;
        
        try {
          const { data, error } = await supabase
            .from('pets')
            .select('*')
            .eq('id', id)
            .eq('user_id', user.id)
            .single();
            
          if (!error) {
            petData = data;
          }
        } catch (error) {
          console.log('Not a UUID, might be a number index:', error);
        }
        
        // If not found by UUID, try to fetch by index
        if (!petData && !isNaN(Number(id))) {
          const { data: petsData, error: petsError } = await supabase
            .from('pets')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: true });
            
          if (!petsError && petsData && petsData.length > 0) {
            const index = Number(id) - 1;
            if (index >= 0 && index < petsData.length) {
              petData = petsData[index];
            }
          }
        }
        
        if (petData) {
          setPet({
            id: petData.id,
            name: petData.name,
            species: petData.species,
            breed: petData.breed,
            age: petData.age,
            ageYears: petData.age_years,
            ageMonths: petData.age_months,
            weight: petData.weight,
            weightKg: petData.weight_kg,
            birthday: petData.birthday,
            imageUrl: petData.image_url,
            notes: petData.notes,
            isActive: petData.is_active
          });
        }
      } catch (error) {
        console.error('Error fetching pet:', error);
        toast({
          title: 'Error',
          description: 'Failed to load pet information',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchPet();
  }, [id, user, toast]);
  
  const handleToggleActive = async () => {
    if (!pet || !user) return;
    
    try {
      const { error } = await supabase
        .from('pets')
        .update({ is_active: !pet.isActive })
        .eq('id', pet.id)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      setPet(prev => prev ? {...prev, isActive: !prev.isActive} : null);
      
      toast({
        title: pet.isActive ? t.inactive : t.active,
        description: `${pet.name} ${pet.isActive ? t.inactive.toLowerCase() : t.active.toLowerCase()}.`,
      });
    } catch (error) {
      console.error('Error toggling pet status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update pet status',
        variant: 'destructive'
      });
    }
  };
  
  const handleDeletePet = async () => {
    if (!pet || !user) return;
    
    try {
      // Delete pet from database
      const { error } = await supabase
        .from('pets')
        .delete()
        .eq('id', pet.id)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      toast({
        title: 'Pet deleted',
        description: `${pet.name}'s profile has been deleted.`,
      });
      
      // Navigate back to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error deleting pet:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete pet profile',
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
            {t.petNotFoundDesc}
          </p>
          <Button asChild>
            <Link to="/dashboard">{t.returnToDashboard}</Link>
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
        {pet.isActive === false && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2 text-amber-700">
            <AlertTriangle size={18} />
            <span>{t.inactiveWarning}</span>
          </div>
        )}
        
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          <PetAvatar
            src={pet.imageUrl}
            name={pet.name}
            species={pet.species}
            size="xl"
            className="flex-shrink-0"
          />
          
          <div className="flex-grow text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
              <h1 className="text-3xl font-bold">{pet.name}</h1>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="flex items-center gap-1" asChild>
                  <Link to={`/pets/${pet.id}/edit`}>
                    <Edit className="w-4 h-4" /> {t.editProfile}
                  </Link>
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="outline" className="flex items-center gap-1 text-destructive border-destructive/30 hover:bg-destructive/10">
                      <Trash2 className="w-4 h-4" /> {t.delete}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t.deleteTitle}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t.deleteDesc.replace('{name}', pet.name)}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeletePet}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        {t.confirmDelete}
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
              {(pet.ageYears !== undefined || pet.ageMonths !== undefined) && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="font-medium">{t.age}:</span> 
                  {pet.ageYears !== undefined && pet.ageYears > 0 ? `${pet.ageYears} ${pet.ageYears === 1 ? t.year : t.years}` : ''}
                  {pet.ageYears !== undefined && pet.ageYears > 0 && pet.ageMonths !== undefined && pet.ageMonths > 0 ? ', ' : ''}
                  {pet.ageMonths !== undefined && pet.ageMonths > 0 ? `${pet.ageMonths} ${pet.ageMonths === 1 ? t.month : t.months}` : ''}
                  {!pet.ageYears && !pet.ageMonths && pet.age ? pet.age : ''}
                </div>
              )}
              {(pet.weightKg !== undefined || pet.weight) && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="font-medium">{t.weight}:</span> 
                  {pet.weightKg !== undefined ? `${pet.weightKg} kg` : pet.weight}
                </div>
              )}
              {pet.birthday && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CalendarClock className="w-4 h-4" />
                  <span className="font-medium">{t.birthday}:</span> {pet.birthday}
                </div>
              )}
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="font-medium">{t.status}:</span>
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={pet.isActive !== false} 
                    onCheckedChange={handleToggleActive}
                  />
                  <span className={pet.isActive !== false ? "text-green-600" : "text-gray-500"}>
                    {pet.isActive !== false ? t.active : t.inactive}
                  </span>
                </div>
              </div>
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
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <Link to={`/health?pet=${pet.id}`} className="text-coral hover:text-coral/80 font-medium">
              {t.viewHealthRecords}
            </Link>
            <Button size="sm" asChild className="bg-coral hover:bg-coral/90">
              <Link to={`/health/add?pet=${pet.id}`} className="flex items-center gap-2">
                <Plus className="w-4 h-4" /> {t.addHealthRecord}
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="glass-morphism rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <PawPrint className="text-sage w-5 h-5" /> {t.careReminders}
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <Link to={`/reminders?pet=${pet.id}`} className="text-sage hover:text-sage/80 font-medium">
              {t.viewCareReminders}
            </Link>
            <Button size="sm" asChild className="bg-sage hover:bg-sage/90">
              <Link to={`/reminders?pet=${pet.id}&add=true`} className="flex items-center gap-2">
                <Plus className="w-4 h-4" /> {t.addReminder}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetProfile;
