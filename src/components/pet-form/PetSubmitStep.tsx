
import React from 'react';
import { usePetForm } from './PetFormContext';
import { PawPrint } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';

export const PetSubmitStep: React.FC = () => {
  const { form, onSubmit } = usePetForm();
  const { language } = useLanguage();
  
  const translations = {
    en: {
      pageTitle: 'Add New Pet',
      pageDescription: 'Create a profile for your pet',
      reviewInfo: 'Please review your pet information before submitting',
      submitButton: 'Create Pet Profile'
    },
    id: {
      pageTitle: 'Tambah Hewan Peliharaan',
      pageDescription: 'Buat profil untuk hewan peliharaan Anda',
      reviewInfo: 'Harap tinjau informasi hewan peliharaan Anda sebelum mengirim',
      submitButton: 'Buat Profil Hewan'
    }
  };
  
  const t = translations[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submit triggered");
    form.handleSubmit(onSubmit)(e);
  };

  return (
    <div className="space-y-6">
      <div className="text-center py-4">
        <PawPrint className="mx-auto mb-4 h-12 w-12 text-lavender" />
        <h3 className="text-xl font-semibold mb-3">{t.pageTitle}</h3>
        <p className="text-base text-muted-foreground mb-2">
          {t.pageDescription}
        </p>
        <p className="text-sm text-muted-foreground">
          {t.reviewInfo}
        </p>
      </div>
      
      <div className="mt-6 flex justify-center">
        <Button 
          type="submit" 
          onClick={handleSubmit}
          className="bg-lavender hover:bg-lavender/90 text-base py-2 px-6"
        >
          {t.submitButton}
        </Button>
      </div>
    </div>
  );
};
