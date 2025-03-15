
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PawPrint, CalendarClock, Heart, Edit, ArrowLeft, AlertTriangle, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PetAvatar from '@/components/ui/PetAvatar';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
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
  species: string;
  breed?: string;
  age?: string;
  weight?: string;
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
            weight: petData.weight,
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
        title: pet.isActive ? 'Pet deactivated' : 'Pet activated',
        description: `${pet.name} has been ${pet.isActive ? 'deactivated' : 'activated'}.`,
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
        <div className="animate-pulse">Loading pet profile...</div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="container px-4 mx-auto py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Pet Not Found</h2>
          <p className="text-muted-foreground mb-6">
            We couldn't find the pet you're looking for.
          </p>
          <Button asChild>
            <Link to="/dashboard">Return to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 mx-auto py-8">
      <Button variant="ghost" asChild className="mb-6">
        <Link to="/dashboard" className="flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Link>
      </Button>

      <div className="glass-morphism rounded-xl p-6 mb-8">
        {pet.isActive === false && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2 text-amber-700">
            <AlertTriangle size={18} />
            <span>This pet is currently inactive</span>
          </div>
        )}
        
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          <PetAvatar
            src={pet.imageUrl}
            name={pet.name}
            size="xl"
            className="flex-shrink-0"
          />
          
          <div className="flex-grow text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
              <h1 className="text-3xl font-bold">{pet.name}</h1>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="flex items-center gap-1" asChild>
                  <Link to={`/pets/${pet.id}/edit`}>
                    <Edit className="w-4 h-4" /> Edit Profile
                  </Link>
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="outline" className="flex items-center gap-1 text-destructive border-destructive/30 hover:bg-destructive/10">
                      <Trash2 className="w-4 h-4" /> Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Pet Profile</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete {pet.name}'s profile? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeletePet}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="font-medium">Species:</span> {pet.species}
              </div>
              {pet.breed && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="font-medium">Breed:</span> {pet.breed}
                </div>
              )}
              {pet.age && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="font-medium">Age:</span> {pet.age}
                </div>
              )}
              {pet.weight && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="font-medium">Weight:</span> {pet.weight}
                </div>
              )}
              {pet.birthday && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CalendarClock className="w-4 h-4" />
                  <span className="font-medium">Birthday:</span> {pet.birthday}
                </div>
              )}
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="font-medium">Status:</span>
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={pet.isActive !== false} 
                    onCheckedChange={handleToggleActive}
                  />
                  <span>{pet.isActive !== false ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
            </div>
            
            {pet.notes && (
              <div className="mb-4">
                <h3 className="font-medium mb-2">About {pet.name}</h3>
                <p className="text-muted-foreground">{pet.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="glass-morphism rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Heart className="text-coral w-5 h-5" /> Health Records
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <Link to={`/health?pet=${pet.id}`} className="text-coral hover:text-coral/80 font-medium">
              View Health Records
            </Link>
            <Button size="sm" asChild className="bg-coral hover:bg-coral/90">
              <Link to={`/health/add?pet=${pet.id}`} className="flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add Health Record
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="glass-morphism rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <PawPrint className="text-sage w-5 h-5" /> Care Reminders
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <Link to={`/reminders?pet=${pet.id}`} className="text-sage hover:text-sage/80 font-medium">
              View Care Reminders
            </Link>
            <Button size="sm" asChild className="bg-sage hover:bg-sage/90">
              <Link to={`/reminders?pet=${pet.id}&add=true`} className="flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add Reminder
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetProfile;
