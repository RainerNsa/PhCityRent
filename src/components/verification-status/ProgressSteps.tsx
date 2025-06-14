
import React from 'react';
import { Card } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { VerificationStatusData } from '@/hooks/useVerificationStatus';

interface ProgressStepsProps {
  statusData: VerificationStatusData;
}

const ProgressSteps = ({ statusData }: ProgressStepsProps) => {
  const verificationSteps = [
    { step: 1, title: "Application Submitted", description: "Your verification form has been received", status: "pending_review" },
    { step: 2, title: "Document Review", description: "Our team is reviewing your documents", status: "documents_reviewed" },
    { step: 3, title: "Referee Contact", description: "We're contacting your provided referee", status: "referee_contacted" },
    { step: 4, title: "Final Review", description: "Final verification and approval process", status: "approved" },
    { step: 5, title: "Completion", description: "Verification complete and agent ID assigned", status: "approved" }
  ];

  const getCurrentStep = (status: string) => {
    switch (status) {
      case 'pending_review':
        return 1;
      case 'documents_reviewed':
        return 2;
      case 'referee_contacted':
        return 3;
      case 'approved':
        return 5;
      case 'rejected':
      case 'needs_info':
        return 1; // Reset to first step for rejected/needs info
      default:
        return 1;
    }
  };

  const currentStep = getCurrentStep(statusData.status);

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-6">Verification Progress</h3>
      <div className="space-y-4">
        {verificationSteps.map((step) => (
          <div key={step.step} className="flex items-start gap-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step.step <= currentStep 
                ? 'bg-pulse-500 text-white' 
                : 'bg-gray-200 text-gray-600'
            }`}>
              {step.step <= currentStep ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <span className="text-sm font-medium">{step.step}</span>
              )}
            </div>
            <div className="flex-1">
              <h4 className={`font-medium ${
                step.step <= currentStep ? 'text-gray-900' : 'text-gray-500'
              }`}>
                {step.title}
              </h4>
              <p className="text-sm text-gray-600">{step.description}</p>
              {step.step === currentStep && statusData.next_action && (
                <p className="text-sm text-pulse-600 font-medium mt-1">
                  Current: {statusData.next_action}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ProgressSteps;
