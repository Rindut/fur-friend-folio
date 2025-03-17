
import React from 'react';
import { PetBasicInfoStep } from './PetBasicInfoStep';
import { PetVaccinationStep } from './PetVaccinationStep';
import { PetSubmitStep } from './PetSubmitStep';
import { FormProvider } from 'react-hook-form';
import { usePetForm } from './PetFormContext';

interface StepContentRendererProps {
  step: number;
}

export const StepContentRenderer: React.FC<StepContentRendererProps> = ({ step }) => {
  const { form } = usePetForm();
  
  // Ensure we wrap all content in FormProvider
  return (
    <FormProvider {...form}>
      {(() => {
        switch (step) {
          case 1:
            return <PetBasicInfoStep />;
          case 2:
            return <PetVaccinationStep />;
          case 3:
            return <PetSubmitStep />;
          default:
            return null;
        }
      })()}
    </FormProvider>
  );
};
