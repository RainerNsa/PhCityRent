
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';

type ApplicationStatus = Database['public']['Enums']['application_status'];

interface Application {
  id: string;
  agent_id: string;
  full_name: string;
  whatsapp_number: string;
  email: string;
  status: ApplicationStatus;
  created_at: string;
  operating_areas: string[];
  residential_address: string;
  is_registered_business: boolean;
  reviewer_notes?: string;
  next_action?: string;
  referee_verifications?: {
    status: string;
    referee_full_name: string;
    referee_whatsapp_number: string;
    referee_role: string;
  }[];
}

interface ApplicationCardProps {
  application: Application;
  onViewDetails: (application: Application) => void;
}

const ApplicationCard = ({ application, onViewDetails }: ApplicationCardProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending_review':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'documents_reviewed':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'referee_contacted':
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'needs_info':
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'needs_info':
        return 'bg-orange-100 text-orange-800';
      case 'pending_review':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-lg">{application.full_name}</h3>
            <Badge className={getStatusColor(application.status)}>
              {getStatusIcon(application.status)}
              <span className="ml-2">{application.status.replace('_', ' ').toUpperCase()}</span>
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>ID: {application.agent_id}</span>
            <span>Phone: {application.whatsapp_number}</span>
            <span>Submitted: {new Date(application.created_at).toLocaleDateString()}</span>
          </div>
          <div className="text-sm text-gray-600">
            Areas: {application.operating_areas?.slice(0, 3).join(', ')}
            {application.operating_areas?.length > 3 && ` +${application.operating_areas.length - 3} more`}
          </div>
        </div>
        <Button
          onClick={() => onViewDetails(application)}
          className="bg-pulse-500 hover:bg-pulse-600"
        >
          <Eye className="w-4 h-4 mr-2" />
          View Details
        </Button>
      </div>
    </Card>
  );
};

export default ApplicationCard;
