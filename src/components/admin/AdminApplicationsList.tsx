
import React, { useState } from 'react';
import { useApplicationsData } from '@/components/admin/applications/useApplicationsData';
import ApplicationsToolbar from '@/components/admin/applications/ApplicationsToolbar';
import ApplicationsGrid from '@/components/admin/applications/ApplicationsGrid';
import ApplicationDetailsModal from '@/components/admin/ApplicationDetailsModal';
import { usePagination } from '@/hooks/usePagination';
import { Database } from '@/integrations/supabase/types';
import ErrorState from '@/components/common/ErrorState';

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
  const { applications, loading, error, refetch } = useApplicationsData();
  
  const [filters, setFilters] = useState({
    status: 'all',
    operatingArea: 'all',
    dateRange: null,
    searchTerm: '',
  });
  
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter applications based on current filters
  const filteredApplications = applications.filter((app) => {
    if (filters.status !== 'all' && app.status !== filters.status) return false;
    if (filters.operatingArea !== 'all' && !app.operating_areas.includes(filters.operatingArea)) return false;
    if (filters.searchTerm && !app.full_name.toLowerCase().includes(filters.searchTerm.toLowerCase()) && 
        !app.email.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
        !app.agent_id.toLowerCase().includes(filters.searchTerm.toLowerCase())) return false;
    return true;
  });

  const {
    currentPage,
    totalPages,
    paginatedItems: paginatedApplications,
    goToPage,
    goToNextPage,
    goToPreviousPage,
  } = usePagination(filteredApplications, 10);

  const handleApplicationSelect = (applicationId: string) => {
    setSelectedApplications(prev => 
      prev.includes(applicationId)
        ? prev.filter(id => id !== applicationId)
        : [...prev, applicationId]
    );
  };

  const handleSelectAll = (selectAll: boolean) => {
    setSelectedApplications(selectAll ? paginatedApplications.map(app => app.id) : []);
  };

  const handleApplicationClick = (application: Application) => {
    setSelectedApplication(application);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedApplication(null);
  };

  const handleApplicationUpdate = async (updatedApplication: Application) => {
    // Refetch data to get the latest updates
    await refetch();
    setIsModalOpen(false);
    setSelectedApplication(null);
  };

  const handleBulkAction = (action: string) => {
    console.log(`Performing bulk action: ${action} on applications:`, selectedApplications);
    // Implement bulk actions here
  };

  const handleClearSelection = () => {
    setSelectedApplications([]);
  };

  if (error) {
    return (
      <ErrorState
        title="Failed to Load Applications"
        message={error}
        onRetry={refetch}
        showRetry={true}
        showHome={false}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Agent Applications</h2>
          <p className="text-gray-600 mt-1">
            Manage and review agent verification applications
          </p>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md">
            {filteredApplications.length} Total
          </span>
          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-md">
            {filteredApplications.filter(app => app.status === 'pending_review').length} Pending
          </span>
          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md">
            {filteredApplications.filter(app => app.status === 'approved').length} Approved
          </span>
        </div>
      </div>

      <ApplicationsToolbar
        selectedCount={selectedApplications.length}
        totalCount={filteredApplications.length}
        onClearSelection={handleClearSelection}
        filters={filters}
        onFiltersChange={setFilters}
        onBulkAction={handleBulkAction}
      />

      <ApplicationsGrid
        applications={paginatedApplications}
        loading={loading}
        selectedApplications={selectedApplications}
        onApplicationSelect={handleApplicationSelect}
        onSelectAll={handleSelectAll}
        onApplicationClick={handleApplicationClick}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={goToPage}
        onNextPage={goToNextPage}
        onPreviousPage={goToPreviousPage}
      />

      {selectedApplication && (
        <ApplicationDetailsModal
          application={selectedApplication}
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onUpdate={handleApplicationUpdate}
        />
      )}
    </div>
  );
};

export default AdminApplicationsList;
