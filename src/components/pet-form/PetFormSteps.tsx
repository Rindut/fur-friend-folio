
import React from 'react';

interface PetFormStepsProps {
  step: number;
  totalSteps: number;
}

export const PetFormSteps: React.FC<PetFormStepsProps> = ({ step, totalSteps }) => {
  return (
    <div className="w-full mt-4">
      <div className="flex justify-between mb-2">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                i + 1 === step 
                  ? 'bg-lavender text-white' 
                  : i + 1 < step 
                    ? 'bg-lavender/20 text-lavender' 
                    : 'bg-muted text-muted-foreground'
              }`}
            >
              {i + 1}
            </div>
          </div>
        ))}
      </div>
      <div className="relative w-full bg-muted h-1 rounded-full overflow-hidden">
        <div 
          className="absolute top-0 left-0 h-full bg-lavender transition-all duration-300 ease-in-out"
          style={{ width: `${(step / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );
};
