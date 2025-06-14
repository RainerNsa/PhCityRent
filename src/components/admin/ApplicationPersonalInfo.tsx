
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Phone, Mail, Clock, MapPin } from 'lucide-react';
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
}

interface ApplicationPersonalInfoProps {
  application: Application;
}

const ApplicationPersonalInfo = ({ application }: ApplicationPersonalInfoProps) => {
  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-3 flex items-center gap-2">
        <User className="w-4 h-4" />
        Personal Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-gray-500" />
          <span>{application.whatsapp_number}</span>
        </div>
        {application.email && (
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-500" />
            <span>{application.email}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <span>Submitted: {new Date(application.created_at).toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-500">Business:</span>
          <Badge variant={application.is_registered_business ? "default" : "outline"}>
            {application.is_registered_business ? "Registered" : "Individual"}
          </Badge>
        </div>
      </div>
      <div className="mt-3">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
          <span className="text-sm">{application.residential_address}</span>
        </div>
      </div>
    </Card>
  );
};

export default ApplicationPersonalInfo;
