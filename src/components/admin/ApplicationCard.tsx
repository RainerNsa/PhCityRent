
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Clock, CheckCircle, XCircle, AlertCircle, Phone, Mail, MapPin } from 'lucide-react';
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
        return <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />;
      case 'documents_reviewed':
        return <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />;
      case 'referee_contacted':
        return <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />;
      case 'approved':
        return <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />;
      case 'needs_info':
        return <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500" />;
      default:
        return <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />;
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
    <Card className="p-4 sm:p-6">
      <div className="space-y-4">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="space-y-2 min-w-0 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h3 className="font-semibold text-base sm:text-lg truncate">{application.full_name}</h3>
              <Badge className={`${getStatusColor(application.status)} text-xs w-fit`}>
                {getStatusIcon(application.status)}
                <span className="ml-1 sm:ml-2">{application.status.replace('_', ' ').toUpperCase()}</span>
              </Badge>
            </div>
            
            {/* Agent ID - Prominent on mobile */}
            <div className="text-sm font-medium text-pulse-600 bg-pulse-50 px-2 py-1 rounded w-fit">
              ID: {application.agent_id}
            </div>
          </div>
          
          {/* Action Button */}
          <Button
            onClick={() => onViewDetails(application)}
            className="bg-pulse-500 hover:bg-pulse-600 w-full sm:w-auto shrink-0"
            size="sm"
          >
            <Eye className="w-4 h-4 mr-2" />
            <span className="sm:hidden">Details</span>
            <span className="hidden sm:inline">View Details</span>
          </Button>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-400 shrink-0" />
            <span className="truncate">{application.whatsapp_number}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-400 shrink-0" />
            <span className="truncate">{application.email}</span>
          </div>
        </div>

        {/* Areas and Date */}
        <div className="space-y-2">
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <span className="font-medium">Areas: </span>
              <span className="break-words">
                {application.operating_areas?.slice(0, 2).join(', ')}
                {application.operating_areas?.length > 2 && (
                  <span className="text-gray-500"> +{application.operating_areas.length - 2} more</span>
                )}
              </span>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Submitted: {new Date(application.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ApplicationCard;
