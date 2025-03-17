
import { useForm } from 'react-hook-form';
import { PetFormValues } from '../PetFormContext';

export const useVaccinations = (form: ReturnType<typeof useForm<PetFormValues>>) => {
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
  
  // Add a custom vaccination
  const addCustomVaccination = () => {
    const currentVaccinations = form.getValues('vaccinations') || [];
    form.setValue('vaccinations', [
      ...currentVaccinations,
      { type: 'other', isCustom: true, customName: '' }
    ]);
  };

  return {
    setVaccinationsForSpecies,
    addCustomVaccination
  };
};
