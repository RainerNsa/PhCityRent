
import React, { useState } from 'react';
import ApplicationDetailsModal from './ApplicationDetailsModal';
import ApplicationsFilter from './applications/ApplicationsFilter';
import ApplicationsToolbar from './applications/ApplicationsToolbar';
import ApplicationsGrid from './applications/ApplicationsGrid';
import { useApplicationsData } from './applications/useApplicationsData';
import { useApplicationsFilters } from './applications/useApplicationsFilters';
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

const AdminApplicationsList = () => {
  const { applications, loading, refetch } = useApplicationsData();
  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    areaFilter,
    setAreaFilter,
    dateRange,
    setDateRange,
    filteredApplications,
    getActiveFilters,
    clearAllFilters
  } = useApplicationsFilters(applications);

  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  const handleSelectApplication = (applicationId: string, checked: boolean) => {
    if (checked) {
      setSelectedApplications(prev => [...prev, applicationId]);
    } else {
      setSelectedApplications(prev => prev.filter(id => id !== applicationId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedApplications(filteredApplications.map(app => app.id));
    } else {
      setSelectedApplications([]);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pulse-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ApplicationsFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        areaFilter={areaFilter}
        onAreaChange={setAreaFilter}
        activeFilters={getActiveFilters()}
        onClearFilters={clearAllFilters}
      />

      <ApplicationsToolbar
        selectedApplications={selectedApplications}
        onBulkActionComplete={refetch}
        onClearSelection={() => setSelectedApplications([])}
      />

      <ApplicationsGrid
        applications={filteredApplications}
        selectedApplications={selectedApplications}
        onSelectApplication={handleSelectApplication}
        onSelectAll={handleSelectAll}
        onViewDetails={setSelectedApplication}
      />

      <ApplicationDetailsModal
        application={selectedApplication}
        isOpen={!!selectedApplication}
        onClose={() => setSelectedApplication(null)}
        onUpdate={refetch}
      />
    </div>
  );
};

export default AdminApplicationsList;
