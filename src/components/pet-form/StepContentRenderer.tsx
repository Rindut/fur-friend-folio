
import React from 'react';
import { PetBasicInfoStep } from './PetBasicInfoStep';
import { PetVaccinationStep } from './PetVaccinationStep';
import { PetSubmitStep } from './PetSubmitStep';
import { usePetForm } from './PetFormContext';

interface StepContentRendererProps {
  step: number;
}

export const StepContentRenderer: React.FC<StepContentRendererProps> = ({ step }) => {
  // We don't need to wrap components in FormProvider here since it's already done in the parent component
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
};
