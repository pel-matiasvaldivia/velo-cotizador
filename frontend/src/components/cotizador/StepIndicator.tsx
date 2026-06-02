import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex items-center justify-between mb-12">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <React.Fragment key={i}>
          <div className="flex flex-col items-center gap-2">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                currentStep >= i + 1 
                  ? 'bg-velo-accent text-white shadow-lg shadow-velo-accent/20 scale-110' 
                  : 'bg-velo-steel text-white'
              }`}
            >
              {i + 1}
            </div>
          </div>
          {i < totalSteps - 1 && (
            <div className={`flex-grow h-1 mx-4 rounded-full transition-all duration-500 ${
              currentStep > i + 1 ? 'bg-velo-accent' : 'bg-velo-steel opacity-30'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StepIndicator;
