import React, { useState } from 'react';
import { useApplicationsData } from './applications/useApplicationsData';
import { useApplicationsFilters } from './applications/useApplicationsFilters';
import { usePagination } from '@/hooks/usePagination';
import ApplicationsToolbar from './applications/ApplicationsToolbar';
import ApplicationsGrid from './applications/ApplicationsGrid';
import ApplicationsLoadingSkeleton from './applications/ApplicationsLoadingSkeleton';
import ApplicationDetailsModal from './ApplicationDetailsModal';
import ErrorState from '@/components/common/ErrorState';
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
  const { applications, loading, error, refetch } = useApplicationsData();
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  const [filters, setFilters] = useState({
    status: '',
    operatingArea: '',
    dateRange: null,
    searchTerm: '',
  });

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const filteredApplications = React.useMemo(() => {
    let filtered = [...applications];

    if (filters.status) {
      filtered = filtered.filter(app => app.status === filters.status);
    }

    if (filters.operatingArea) {
      filtered = filtered.filter(app => app.operating_areas.includes(filters.operatingArea));
    }

    if (filters.dateRange) {
      const [startDate, endDate] = filters.dateRange;
      filtered = filtered.filter(app => {
        const appDate = new Date(app.created_at);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        if (start && appDate < start) return false;
        if (end && appDate > end) return false;

        return true;
      });
    }

    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(app =>
        app.full_name.toLowerCase().includes(term) ||
        app.email.toLowerCase().includes(term) ||
        app.whatsapp_number.includes(term) ||
        app.agent_id.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [applications, filters]);

  const pagination = usePagination({
    data: filteredApplications,
    itemsPerPage: 10
  });

  const handleSelectApplication = (applicationId: string, checked: boolean) => {
    setSelectedApplications(prev => {
      if (checked) {
        return [...prev, applicationId];
      } else {
        return prev.filter(id => id !== applicationId);
      }
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedApplications(pagination.paginatedData.map(app => app.id));
    } else {
      setSelectedApplications([]);
    }
  };

  const handleClearSelection = () => {
    setSelectedApplications([]);
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} on ${selectedApplications.length} applications`);
    // Implement bulk action logic here
  };

  if (loading) {
    return <ApplicationsLoadingSkeleton count={10} />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Agent Applications</h1>
            <p className="text-gray-600 mt-1">Manage and review agent applications</p>
          </div>
        </div>
        
        <ErrorState
          title="Failed to Load Applications"
          message={error}
          onRetry={refetch}
          showRetry={true}
          showHome={true}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agent Applications</h1>
          <p className="text-gray-600 mt-1">Manage and review agent applications</p>
        </div>
      </div>

      {/* Toolbar */}
      <ApplicationsToolbar
        selectedCount={selectedApplications.length}
        totalCount={filteredApplications.length}
        onClearSelection={handleClearSelection}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onBulkAction={handleBulkAction}
      />

      {/* Applications Grid */}
      <ApplicationsGrid
        applications={filteredApplications}
        selectedApplications={selectedApplications}
        onSelectApplication={handleSelectApplication}
        onSelectAll={handleSelectAll}
        onViewDetails={setSelectedApplication}
        // Pagination props
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={pagination.goToPage}
        hasNextPage={pagination.hasNextPage}
        hasPreviousPage={pagination.hasPreviousPage}
        startIndex={pagination.startIndex}
        endIndex={pagination.endIndex}
        totalItems={pagination.totalItems}
        paginatedApplications={pagination.paginatedData}
      />

      {/* Application Details Modal */}
      {selectedApplication && (
        <ApplicationDetailsModal
          application={selectedApplication}
          isOpen={!!selectedApplication}
          onClose={() => setSelectedApplication(null)}
        />
      )}
    </div>
  );
};

export default AdminApplicationsList;
