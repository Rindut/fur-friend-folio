
import React from 'react';
import { PetBasicInfoStep } from './PetBasicInfoStep';
import { PetVaccinationStep } from './PetVaccinationStep';
import { PetSubmitStep } from './PetSubmitStep';

interface StepContentRendererProps {
  step: number;
}

export const StepContentRenderer: React.FC<StepContentRendererProps> = ({ step }) => {
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
