
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { PetFormProvider } from '@/components/pet-form/PetFormContext';
import { PetFormSteps } from '@/components/pet-form/PetFormSteps';
import { StepContentRenderer } from '@/components/pet-form/StepContentRenderer';
import { FormNavigation } from '@/components/pet-form/FormNavigation';
import { FormHeader } from '@/components/pet-form/FormHeader';

const AddPet = () => {
  const [step, setStep] = useState(1);
  const [totalSteps] = useState(3);
  
  // Navigation between steps
  const nextStep = () => {
    setStep(current => Math.min(current + 1, totalSteps));
  };
  
  const prevStep = () => {
    setStep(current => Math.max(current - 1, 1));
  };
  
  return (
    <PetFormProvider>
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
                  <StepContentRenderer step={step} />
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
    </PetFormProvider>
  );
};

export default AddPet;
