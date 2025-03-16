
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
    },
    id: {
      pageTitle: 'Tambah Hewan Peliharaan',
      pageDescription: 'Buat profil untuk hewan peliharaan Anda',
    }
  };
  
  const t = translations[language];

  return (
    <form id="pet-form" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="text-center py-8">
        <PawPrint className="mx-auto mb-4 h-12 w-12 text-lavender" />
        <h3 className="text-xl font-semibold mb-2">{t.pageTitle}</h3>
        <p className="text-muted-foreground">
          {t.pageDescription}
        </p>
      </div>
    </form>
  );
};
