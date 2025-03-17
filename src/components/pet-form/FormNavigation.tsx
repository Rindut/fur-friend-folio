
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface FormNavigationProps {
  step: number;
  totalSteps: number;
  nextStep: () => void;
  prevStep: () => void;
}

export const FormNavigation: React.FC<FormNavigationProps> = ({ 
  step, 
  totalSteps, 
  nextStep, 
  prevStep 
}) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  
  const translations = {
    en: {
      prevButton: 'Previous',
      nextButton: 'Next',
      cancelButton: 'Cancel',
      saveButton: 'Save Pet Profile'
    },
    id: {
      prevButton: 'Sebelumnya',
      nextButton: 'Selanjutnya',
      cancelButton: 'Batal',
      saveButton: 'Simpan Profil'
    }
  };
  
  const t = translations[language];
  
  return (
    <div className="flex justify-between">
      <div>
        {step > 1 ? (
          <Button 
            type="button" 
            variant="outline"
            onClick={prevStep}
            className="flex items-center text-sm"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            {t.prevButton}
          </Button>
        ) : (
          <Button 
            type="button" 
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="text-sm"
          >
            {t.cancelButton}
          </Button>
        )}
      </div>
      
      <div>
        {step < totalSteps ? (
          <Button 
            type="button"
            onClick={nextStep}
            className="bg-lavender hover:bg-lavender/90 flex items-center text-sm"
          >
            {t.nextButton}
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        ) : (
          <Button 
            form="pet-form"
            type="submit"
            className="bg-lavender hover:bg-lavender/90 text-sm"
          >
            {t.saveButton}
          </Button>
        )}
      </div>
    </div>
  );
};
