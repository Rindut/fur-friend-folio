
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePetImage } from './hooks/usePetImage';
import { useVaccinations } from './hooks/useVaccinations';
import { usePetSubmit } from './hooks/usePetSubmit';

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

interface PetFormProviderProps {
  children: ReactNode;
}

export const PetFormProvider: React.FC<PetFormProviderProps> = ({ children }) => {
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
  
  const { imageUrl, setImageUrl, uploading, setUploading, handleImageUpload: baseHandleImageUpload } = usePetImage();
  const { setVaccinationsForSpecies, addCustomVaccination } = useVaccinations(form);
  const { onSubmit } = usePetSubmit();
  
  const watchSpecies = form.watch('species');
  
  // React to species changes
  useEffect(() => {
    if (watchSpecies) {
      setVaccinationsForSpecies(watchSpecies);
    }
  }, [watchSpecies]);
  
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const url = await baseHandleImageUpload(event);
    if (url) {
      form.setValue('imageUrl', url);
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
