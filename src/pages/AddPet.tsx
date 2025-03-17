
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { PetFormProvider, usePetForm } from '@/components/pet-form/PetFormContext';
import { PetFormSteps } from '@/components/pet-form/PetFormSteps';
import { StepContentRenderer } from '@/components/pet-form/StepContentRenderer';
import { FormNavigation } from '@/components/pet-form/FormNavigation';
import { FormHeader } from '@/components/pet-form/FormHeader';
import { FormProvider } from 'react-hook-form';

const AddPetContent = () => {
  const [step, setStep] = useState(1);
  const [totalSteps] = useState(3);
  const formContext = usePetForm();
  
  // Navigation between steps
  const nextStep = () => {
    setStep(current => Math.min(current + 1, totalSteps));
  };
  
  const prevStep = () => {
    setStep(current => Math.max(current - 1, 1));
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="bg-gradient-to-b from-lavender/20 to-transparent pt-8 pb-12">
        <div className="container px-4 mx-auto">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <FormHeader step={step} totalSteps={totalSteps} />
                <PetFormSteps step={step} totalSteps={totalSteps} />
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Wrap in FormProvider to ensure form context is available */}
                <FormProvider {...formContext.form}>
                  <StepContentRenderer step={step} />
                </FormProvider>
              </CardContent>
              
              <CardFooter>
                <FormNavigation 
                  step={step} 
                  totalSteps={totalSteps} 
                  nextStep={nextStep} 
                  prevStep={prevStep} 
                />
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const AddPet = () => {
  return (
    <PetFormProvider>
      <AddPetContent />
    </PetFormProvider>
  );
};

export default AddPet;
