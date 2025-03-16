
import React from 'react';
import { usePetForm } from './PetFormContext';
import { PawPrint } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

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

  return (
    <form id="pet-form" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="text-center py-8">
        <PawPrint className="mx-auto mb-4 h-12 w-12 text-lavender" />
        <h3 className="text-2xl font-semibold mb-3">{t.pageTitle}</h3>
        <p className="text-base text-muted-foreground mb-2">
          {t.pageDescription}
        </p>
        <p className="text-sm text-muted-foreground">
          {t.reviewInfo}
        </p>
      </div>
    </form>
  );
};
