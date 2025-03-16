import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

const petSchema = z.object({
  name: z.string().min(1, "Pet name is required"),
  species: z.string().min(1, "Species is required"),
  otherSpecies: z.string().optional(),
  breed: z.string().optional(),
  gender: z.enum(['male', 'female']),
  fur_color: z.string().optional(),
  birthday: z.date().optional(),
  isEstimatedAge: z.boolean().optional(),
  ageYears: z.coerce.number().min(0).optional(),
  ageMonths: z.coerce.number().min(0).max(11).optional(),
  weight: z.coerce.number().min(0).optional(),
  notes: z.string().optional(),
  imageUrl: z.string().optional(),
  vaccinations: z.array(z.object({
    type: z.string(),
    date: z.date().optional(),
    clinic: z.string().optional(),
    isCustom: z.boolean().optional(),
    customName: z.string().optional(),
  })).optional(),
});

export type PetFormValues = z.infer<typeof petSchema>;

interface PetFormContextType {
  form: ReturnType<typeof useForm<PetFormValues>>;
  imageUrl: string | null;
  setImageUrl: (url: string | null) => void;
  uploading: boolean;
  setUploading: (uploading: boolean) => void;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  onSubmit: (data: PetFormValues) => Promise<void>;
  addCustomVaccination: () => void;
}

const PetFormContext = createContext<PetFormContextType | undefined>(undefined);

export const PetFormProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language } = useLanguage();
  const { user } = useAuth();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const form = useForm<PetFormValues>({
    resolver: zodResolver(petSchema),
    defaultValues: {
      name: '',
      species: '',
      otherSpecies: '',
      breed: '',
      gender: 'male',
      fur_color: '',
      ageYears: 0,
      ageMonths: 0,
      weight: undefined,
      notes: '',
      imageUrl: '',
      isEstimatedAge: false,
      vaccinations: [],
    }
  });
  
  const watchSpecies = form.watch('species');
  
  // Set up available vaccinations based on species
  const setVaccinationsForSpecies = (species: string) => {
    if (!species) return;
    
    let vaccinations: any[] = [];
    
    if (species === 'cat') {
      vaccinations = [
        { type: 'tricat', isCustom: false },
        { type: 'tetracat', isCustom: false },
        { type: 'rabies', isCustom: false },
        { type: 'fvrfe', isCustom: false }
      ];
    } else if (species === 'dog') {
      vaccinations = [
        { type: 'dhpp', isCustom: false },
        { type: 'rabies', isCustom: false },
        { type: 'leptospirosis', isCustom: false },
        { type: 'bordetella', isCustom: false }
      ];
    } else if (species === 'rabbit') {
      vaccinations = [
        { type: 'myxomatosis', isCustom: false },
        { type: 'vhd', isCustom: false }
      ];
    } else if (species === 'bird') {
      vaccinations = [
        { type: 'newcastle', isCustom: false },
        { type: 'pacheco', isCustom: false }
      ];
    }
    
    // Add an "other" option for all species except fish
    if (species !== 'fish') {
      form.setValue('vaccinations', vaccinations);
    } else {
      form.setValue('vaccinations', []);
    }
  };
  
  // React to species changes
  useEffect(() => {
    if (watchSpecies) {
      setVaccinationsForSpecies(watchSpecies);
    }
  }, [watchSpecies]);
  
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    
    const file = event.target.files[0];
    const fileExt = file.name.split('.').pop();
    const filePath = `${user?.id}/${Math.random().toString(36).substring(2)}${Date.now()}.${fileExt}`;
    
    setUploading(true);
    
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const objectUrl = URL.createObjectURL(file);
      setImageUrl(objectUrl);
      form.setValue('imageUrl', objectUrl);
      
      toast({
        title: 'Image uploaded',
        description: 'Your pet photo has been uploaded.',
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Upload failed',
        description: 'There was an error uploading your image.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };
  
  // Add a custom vaccination
  const addCustomVaccination = () => {
    const currentVaccinations = form.getValues('vaccinations') || [];
    form.setValue('vaccinations', [
      ...currentVaccinations,
      { type: 'other', isCustom: true, customName: '' }
    ]);
  };
  
  const onSubmit = async (data: PetFormValues) => {
    if (!user) {
      toast({
        title: 'Not logged in',
        description: 'You need to be logged in to add a pet profile',
        variant: 'destructive',
      });
      return;
    }
    
    try {
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
        
      if (error) throw error;
      
      const translations = {
        en: { success: 'Pet profile created successfully' },
        id: { success: 'Profil hewan berhasil dibuat' }
      };
      
      toast({
        title: translations[language].success,
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
        title: 'Error',
        description: 'There was an error creating the pet profile.',
        variant: 'destructive',
      });
    }
  };

  return (
    <PetFormContext.Provider value={{ 
      form,
      imageUrl,
      setImageUrl,
      uploading,
      setUploading,
      handleImageUpload,
      onSubmit,
      addCustomVaccination
    }}>
      {children}
    </PetFormContext.Provider>
  );
};

export const usePetForm = () => {
  const context = useContext(PetFormContext);
  
  if (context === undefined) {
    throw new Error('usePetForm must be used within a PetFormProvider');
  }
  
  return context;
};
