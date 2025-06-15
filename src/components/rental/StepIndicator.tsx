
import React from 'react';
import { User, Home, Briefcase, FileText, Check } from 'lucide-react';

interface Step {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
}

interface StepIndicatorProps {
  currentStep: number;
  steps: Step[];
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, steps }) => {
  return (
    <div className="flex justify-center space-x-4">
      {steps.map((step, index) => {
        const Icon = step.icon;
        return (
          <div
            key={step.id}
            className={`flex flex-col items-center p-2 rounded-lg ${
              index === currentStep
                ? 'bg-blue-100 text-blue-600'
                : index < currentStep
                ? 'bg-green-100 text-green-600'
                : 'bg-gray-100 text-gray-400'
            }`}
          >
            <Icon className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">{step.title}</span>
          </div>
        );
      })}
    </div>
  );
};

export default StepIndicator;

export const applicationSteps = [
  { id: 'personal', title: 'Personal Info', icon: User },
  { id: 'address', title: 'Address History', icon: Home },
  { id: 'employment', title: 'Employment', icon: Briefcase },
  { id: 'references', title: 'References', icon: FileText },
  { id: 'additional', title: 'Additional Info', icon: Check }
];
