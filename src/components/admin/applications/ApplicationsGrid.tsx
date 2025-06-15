
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import ApplicationCard from '../ApplicationCard';
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

interface ApplicationsGridProps {
  applications: Application[];
  selectedApplications: string[];
  onSelectApplication: (applicationId: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onViewDetails: (application: Application) => void;
}

const ApplicationsGrid = ({
  applications,
  selectedApplications,
  onSelectApplication,
  onSelectAll,
  onViewDetails
}: ApplicationsGridProps) => {
  if (applications.length === 0) {
    return (
      <div className="text-center p-8 text-gray-600">
        No applications found matching your criteria.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Select All Checkbox */}
      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
        <Checkbox
          id="select-all"
          checked={selectedApplications.length === applications.length}
          onCheckedChange={onSelectAll}
        />
        <label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
          Select all {applications.length} applications
        </label>
      </div>

      {/* Applications Grid */}
      <div className="grid gap-4">
        {applications.map((application) => (
          <div key={application.id} className="flex items-center gap-3">
            <Checkbox
              checked={selectedApplications.includes(application.id)}
              onCheckedChange={(checked) => onSelectApplication(application.id, checked as boolean)}
            />
            <div className="flex-1">
              <ApplicationCard
                application={application}
                onViewDetails={onViewDetails}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicationsGrid;
