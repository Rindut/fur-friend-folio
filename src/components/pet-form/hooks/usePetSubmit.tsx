
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { PetFormValues } from '../PetFormContext';

export const usePetSubmit = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language } = useLanguage();
  const { user } = useAuth();

  const translations = {
    en: { 
      success: 'Pet profile created successfully',
      notLoggedIn: 'Not logged in',
      notLoggedInDesc: 'You need to be logged in to add a pet profile',
      error: 'Error',
      errorDesc: 'There was an error creating the pet profile.'
    },
    id: { 
      success: 'Profil hewan berhasil dibuat',
      notLoggedIn: 'Belum masuk',
      notLoggedInDesc: 'Anda perlu masuk untuk menambahkan profil hewan',
      error: 'Kesalahan',
      errorDesc: 'Terjadi kesalahan saat membuat profil hewan.'
    }
  };
  
  const t = translations[language];
  
  const onSubmit = async (data: PetFormValues) => {
    if (!user) {
      toast({
        title: t.notLoggedIn,
        description: t.notLoggedInDesc,
        variant: 'destructive',
      });
      return;
    }
    
    try {
      console.log("Submitting form data:", data);
      
      // Format vaccination data
      const formattedVaccinations = data.vaccinations?.map(vax => {
        return {
          type: vax.isCustom ? vax.customName : vax.type,
          date: vax.date ? format(vax.date, 'yyyy-MM-dd') : null,
          clinic: vax.clinic || null
        };
      });
      
      // Insert pet data into Supabase
      const { data: pet, error } = await supabase
        .from('pets')
        .insert([
          {
            name: data.name,
            species: data.species === 'other' ? data.otherSpecies : data.species,
            breed: data.breed || null,
            gender: data.gender,
            fur_color: data.fur_color || null,
            birthday: data.birthday ? format(data.birthday, 'yyyy-MM-dd') : null,
            notes: data.notes || null,
            image_url: data.imageUrl || null,
            user_id: user.id,
            age_years: data.isEstimatedAge ? data.ageYears || 0 : null,
            age_months: data.isEstimatedAge ? data.ageMonths || 0 : null,
            weight_kg: data.weight || null,
            vaccinations: formattedVaccinations || null
          }
        ])
        .select()
        .single();
        
      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      toast({
        title: t.success,
        duration: 3000
      });
      
      // Navigate to the pet profile page
      if (pet) {
        navigate(`/pets/${pet.id}`);
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error creating pet profile:', error);
      toast({
        title: t.error,
        description: t.errorDesc,
        variant: 'destructive',
      });
    }
  };

  return { onSubmit };
};
