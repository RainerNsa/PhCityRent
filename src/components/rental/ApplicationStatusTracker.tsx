
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Clock, 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Eye,
  User,
  Shield
} from 'lucide-react';

interface ApplicationStatus {
  id: string;
  status: 'submitted' | 'under_review' | 'approved' | 'rejected' | 'pending_documents';
  submittedAt: string;
  updatedAt: string;
  propertyTitle: string;
  propertyLocation: string;
  adminNotes?: string;
}

interface ApplicationStatusTrackerProps {
  application: ApplicationStatus;
}

const ApplicationStatusTracker: React.FC<ApplicationStatusTrackerProps> = ({ application }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'submitted':
        return {
          icon: FileText,
          color: 'bg-blue-500',
          textColor: 'text-blue-600',
          bgColor: 'bg-blue-50',
          label: 'Submitted',
          progress: 25
        };
      case 'under_review':
        return {
          icon: Eye,
          color: 'bg-yellow-500',
          textColor: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          label: 'Under Review',
          progress: 50
        };
      case 'pending_documents':
        return {
          icon: AlertCircle,
          color: 'bg-orange-500',
          textColor: 'text-orange-600',
          bgColor: 'bg-orange-50',
          label: 'Pending Documents',
          progress: 40
        };
      case 'approved':
        return {
          icon: CheckCircle,
          color: 'bg-green-500',
          textColor: 'text-green-600',
          bgColor: 'bg-green-50',
          label: 'Approved',
          progress: 100
        };
      case 'rejected':
        return {
          icon: XCircle,
          color: 'bg-red-500',
          textColor: 'text-red-600',
          bgColor: 'bg-red-50',
          label: 'Rejected',
          progress: 100
        };
      default:
        return {
          icon: Clock,
          color: 'bg-gray-500',
          textColor: 'text-gray-600',
          bgColor: 'bg-gray-50',
          label: 'Pending',
          progress: 0
        };
    }
  };

  const statusConfig = getStatusConfig(application.status);
  const StatusIcon = statusConfig.icon;

  const steps = [
    { key: 'submitted', label: 'Application Submitted', icon: FileText },
    { key: 'under_review', label: 'Under Review', icon: Eye },
    { key: 'background_check', label: 'Background Check', icon: Shield },
    { key: 'decision', label: 'Final Decision', icon: application.status === 'approved' ? CheckCircle : XCircle }
  ];

  const getCurrentStepIndex = () => {
    switch (application.status) {
      case 'submitted': return 0;
      case 'under_review': return 1;
      case 'pending_documents': return 1;
      case 'approved': return 3;
      case 'rejected': return 3;
      default: return 0;
    }
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{application.propertyTitle}</CardTitle>
            <CardDescription>{application.propertyLocation}</CardDescription>
          </div>
          <Badge 
            variant="outline" 
            className={`${statusConfig.bgColor} ${statusConfig.textColor} border-0`}
          >
            <StatusIcon className="w-3 h-3 mr-1" />
            {statusConfig.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Application Progress</span>
            <span>{statusConfig.progress}%</span>
          </div>
          <Progress value={statusConfig.progress} className="h-2" />
        </div>

        {/* Timeline Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isCompleted = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;
            
            return (
              <div key={step.key} className="flex items-center space-x-3">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  ${isCompleted 
                    ? isCurrent 
                      ? statusConfig.color + ' text-white'
                      : 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-400'
                  }
                `}>
                  <StepIcon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${
                    isCompleted ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.label}
                  </p>
                  {isCurrent && application.status === 'under_review' && (
                    <p className="text-sm text-gray-500">
                      Your application is being reviewed by our team
                    </p>
                  )}
                  {isCurrent && application.status === 'pending_documents' && (
                    <p className="text-sm text-orange-600">
                      Additional documents required
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Admin Notes */}
        {application.adminNotes && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-gray-600" />
              <span className="font-medium text-sm">Administrator Notes</span>
            </div>
            <p className="text-sm text-gray-700">{application.adminNotes}</p>
          </div>
        )}

        {/* Timestamps */}
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <span className="font-medium">Submitted:</span>
            <br />
            {new Date(application.submittedAt).toLocaleDateString()}
          </div>
          <div>
            <span className="font-medium">Last Updated:</span>
            <br />
            {new Date(application.updatedAt).toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationStatusTracker;
