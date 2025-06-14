
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User } from 'lucide-react';
import { VerificationStatusData } from '@/hooks/useVerificationStatus';

interface ApplicationOverviewProps {
  statusData: VerificationStatusData;
  getStatusIcon: (status: string) => React.ReactNode;
  getStatusColor: (status: string) => string;
}

const ApplicationOverview = ({ statusData, getStatusIcon, getStatusColor }: ApplicationOverviewProps) => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-pulse-100 p-2 rounded-lg">
            <User className="w-5 h-5 text-pulse-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">{statusData.applicantName}</h3>
            <p className="text-sm text-gray-600">Agent ID: {statusData.agentId}</p>
          </div>
        </div>
        <Badge className={getStatusColor(statusData.status)}>
          {getStatusIcon(statusData.status)}
          <span className="ml-2">{statusData.status.replace('_', ' ').toUpperCase()}</span>
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div>
          <p className="text-gray-600">Submitted</p>
          <p className="font-medium">
            {new Date(statusData.submissionDate).toLocaleDateString()}
          </p>
        </div>
        <div>
          <p className="text-gray-600">Progress</p>
          <p className="font-medium">
            Step {statusData.currentStep} of {statusData.totalSteps}
          </p>
        </div>
        <div>
          <p className="text-gray-600">Est. Completion</p>
          <p className="font-medium">
            {statusData.estimatedCompletion ? 
              new Date(statusData.estimatedCompletion).toLocaleDateString() : 
              "TBD"
            }
          </p>
        </div>
      </div>
    </Card>
  );
};

export default ApplicationOverview;
