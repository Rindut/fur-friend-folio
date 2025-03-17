
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface FormHeaderProps {
  step: number;
  totalSteps: number;
}

export const FormHeader: React.FC<FormHeaderProps> = ({ step, totalSteps }) => {
  const { language } = useLanguage();
  
  const translations = {
    en: {
      pageTitle: 'Add New Pet',
      pageDescription: 'Create a profile for your pet',
      step1: 'Pet Information',
      step2: 'Vaccination Information',
      step3: 'Submit & Save'
    },
    id: {
      pageTitle: 'Tambah Hewan Peliharaan',
      pageDescription: 'Buat profil untuk hewan peliharaan Anda',
      step1: 'Informasi Hewan',
      step2: 'Informasi Vaksinasi',
      step3: 'Simpan & Selesai'
    }
  };
  
  const t = translations[language];
  
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-semibold">{t.pageTitle}</h2>
        <p className="text-base mt-1 text-muted-foreground">{t.pageDescription}</p>
      </div>
      <div className="text-sm font-medium">
        {t[`step${step}`]} ({step}/{totalSteps})
      </div>
    </div>
  );
};
