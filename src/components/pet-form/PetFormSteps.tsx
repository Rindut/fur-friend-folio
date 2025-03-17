
import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface PetFormStepsProps {
  step: number;
  totalSteps: number;
}

export const PetFormSteps: React.FC<PetFormStepsProps> = ({ step, totalSteps }) => {
  return (
    <div className="flex items-center justify-center space-x-2 pt-4">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === step;
        const isCompleted = stepNumber < step;
        
        return (
          <div key={index} className="flex items-center">
            <div 
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full border text-sm transition-colors",
                isActive && "border-lavender bg-lavender/10 text-lavender font-medium",
                isCompleted && "border-lavender bg-lavender text-white",
                !isActive && !isCompleted && "border-gray-200 text-gray-400"
              )}
            >
              {isCompleted ? (
                <Check className="w-4 h-4" />
              ) : (
                <span className="text-sm">{stepNumber}</span>
              )}
            </div>
            
            {stepNumber < totalSteps && (
              <div 
                className={cn(
                  "w-12 h-0.5 mx-1",
                  stepNumber < step ? "bg-lavender" : "bg-gray-200"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
