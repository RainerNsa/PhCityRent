
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import ApplicationCard from '../ApplicationCard';
import PaginationControls from './PaginationControls';
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
  // Pagination props
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startIndex: number;
  endIndex: number;
  totalItems: number;
  paginatedApplications: Application[];
}

const ApplicationsGrid = ({
  applications,
  selectedApplications,
  onSelectApplication,
  onSelectAll,
  onViewDetails,
  currentPage,
  totalPages,
  onPageChange,
  hasNextPage,
  hasPreviousPage,
  startIndex,
  endIndex,
  totalItems,
  paginatedApplications
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
      {/* Select All Checkbox - Mobile Optimized */}
      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
        <Checkbox
          id="select-all"
          checked={selectedApplications.length === paginatedApplications.length && paginatedApplications.length > 0}
          onCheckedChange={onSelectAll}
          className="min-w-[16px]"
        />
        <label htmlFor="select-all" className="text-sm font-medium cursor-pointer flex-1">
          <span className="block sm:inline">Select all on this page ({paginatedApplications.length} applications)</span>
          {selectedApplications.length > 0 && (
            <span className="block sm:inline sm:ml-2 text-blue-600">
              ({selectedApplications.length} total selected)
            </span>
          )}
        </label>
      </div>

      {/* Applications Grid - Mobile Optimized */}
      <div className="space-y-3">
        {paginatedApplications.map((application) => (
          <div key={application.id} className="flex items-start gap-3 p-1">
            <div className="pt-2">
              <Checkbox
                checked={selectedApplications.includes(application.id)}
                onCheckedChange={(checked) => onSelectApplication(application.id, checked as boolean)}
                className="min-w-[16px]"
              />
            </div>
            <div className="flex-1 min-w-0">
              <ApplicationCard
                application={application}
                onViewDetails={onViewDetails}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
          startIndex={startIndex}
          endIndex={endIndex}
          totalItems={totalItems}
        />
      )}
    </div>
  );
};

export default ApplicationsGrid;
