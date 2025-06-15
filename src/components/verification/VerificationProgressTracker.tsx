
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  User, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Phone,
  Mail,
  Calendar
} from 'lucide-react';

interface VerificationStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in_progress' | 'pending' | 'failed';
  icon: React.ElementType;
  completedAt?: string;
  estimatedDays?: number;
}

interface VerificationProgressTrackerProps {
  currentStatus: string;
  applicationDate: string;
  estimatedCompletion?: string;
  nextAction?: string;
  reviewerNotes?: string;
}

const VerificationProgressTracker = ({ 
  currentStatus, 
  applicationDate, 
  estimatedCompletion,
  nextAction,
  reviewerNotes 
}: VerificationProgressTrackerProps) => {
  
  const getVerificationSteps = (status: string): VerificationStep[] => {
    const baseSteps: VerificationStep[] = [
      {
        id: 'application_submitted',
        title: 'Application Submitted',
        description: 'Your verification application has been received',
        status: 'completed',
        icon: FileText,
        completedAt: applicationDate,
        estimatedDays: 0
      },
      {
        id: 'documents_review',
        title: 'Document Review',
        description: 'Our team is reviewing your submitted documents',
        status: ['pending_review'].includes(status) ? 'in_progress' : 
               ['documents_reviewed', 'referee_contacted', 'approved'].includes(status) ? 'completed' : 'pending',
        icon: FileText,
        estimatedDays: 1
      },
      {
        id: 'referee_verification',
        title: 'Referee Verification',
        description: 'Contacting and verifying your referee information',
        status: status === 'referee_contacted' ? 'in_progress' :
               status === 'approved' ? 'completed' : 
               ['documents_reviewed'].includes(status) ? 'pending' : 'pending',
        icon: Phone,
        estimatedDays: 2
      },
      {
        id: 'final_approval',
        title: 'Final Approval',
        description: 'Final review and approval of your verification',
        status: status === 'approved' ? 'completed' : 
               status === 'rejected' ? 'failed' : 'pending',
        icon: CheckCircle,
        estimatedDays: 1
      }
    ];

    // Handle special statuses
    if (status === 'needs_info') {
      baseSteps[1].status = 'failed';
      baseSteps[1].description = 'Additional information required - please check your email';
    }

    if (status === 'rejected') {
      const rejectedStepIndex = baseSteps.findIndex(step => step.status === 'in_progress' || step.status === 'pending');
      if (rejectedStepIndex !== -1) {
        baseSteps[rejectedStepIndex].status = 'failed';
      }
    }

    return baseSteps;
  };

  const steps = getVerificationSteps(currentStatus);
  const completedSteps = steps.filter(step => step.status === 'completed').length;
  const totalSteps = steps.length;
  const progressPercentage = (completedSteps / totalSteps) * 100;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-500 animate-pulse" />;
      case 'failed':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-green-200 bg-green-50';
      case 'in_progress':
        return 'border-blue-200 bg-blue-50';
      case 'failed':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">Verification Progress</h3>
            <p className="text-gray-600">Track your application status in real-time</p>
          </div>
          <Badge variant="outline" className="text-sm">
            {completedSteps} of {totalSteps} completed
          </Badge>
        </div>
        
        <div className="space-y-2 mb-6">
          <div className="flex justify-between text-sm">
            <span>Overall Progress</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {estimatedCompletion && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>Estimated completion: {formatDate(estimatedCompletion)}</span>
          </div>
        )}
      </Card>

      {/* Progress Steps */}
      <Card className="p-6">
        <h4 className="font-semibold mb-4">Verification Steps</h4>
        <div className="space-y-4">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            return (
              <div key={step.id} className={`border rounded-lg p-4 ${getStatusColor(step.status)}`}>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getStatusIcon(step.status)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="font-medium">{step.title}</h5>
                      {step.status === 'completed' && step.completedAt && (
                        <Badge variant="secondary" className="text-xs">
                          {formatDate(step.completedAt)}
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                    
                    {step.status === 'in_progress' && (
                      <div className="flex items-center gap-2 text-xs text-blue-600">
                        <Clock className="w-3 h-3" />
                        <span>Estimated: {step.estimatedDays} day{step.estimatedDays !== 1 ? 's' : ''}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Additional Information */}
      {(nextAction || reviewerNotes) && (
        <Card className="p-6">
          <h4 className="font-semibold mb-4">Additional Information</h4>
          
          {nextAction && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-900">Action Required</span>
              </div>
              <p className="text-blue-800 text-sm">{nextAction}</p>
            </div>
          )}
          
          {reviewerNotes && (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-gray-600" />
                <span className="font-medium text-gray-900">Reviewer Notes</span>
              </div>
              <p className="text-gray-700 text-sm">{reviewerNotes}</p>
            </div>
          )}
        </Card>
      )}

      {/* Support Section */}
      <Card className="p-6 bg-gradient-to-r from-pulse-50 to-blue-50">
        <div className="flex items-center gap-3 mb-3">
          <Mail className="w-5 h-5 text-pulse-600" />
          <h4 className="font-semibold text-pulse-900">Need Help?</h4>
        </div>
        <p className="text-pulse-700 text-sm mb-3">
          If you have any questions about your verification status, our support team is here to help.
        </p>
        <div className="flex items-center gap-2 text-sm text-pulse-600">
          <Phone className="w-4 h-4" />
          <span>WhatsApp: +234 XXX XXX XXXX</span>
        </div>
      </Card>
    </div>
  );
};

export default VerificationProgressTracker;
