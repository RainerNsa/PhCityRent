
import React, { useState, useEffect } from 'react';
import ApplicationDetailsModal from './ApplicationDetailsModal';
import ApplicationsFilter from './applications/ApplicationsFilter';
import ApplicationsToolbar from './applications/ApplicationsToolbar';
import ApplicationsGrid from './applications/ApplicationsGrid';
import ApplicationsLoadingSkeleton from './applications/ApplicationsLoadingSkeleton';
import { useApplicationsData } from './applications/useApplicationsData';
import { useApplicationsFilters } from './applications/useApplicationsFilters';
import { usePagination } from '@/hooks/usePagination';
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

  // Pagination hook
  const {
    currentPage,
    totalPages,
    paginatedData: paginatedApplications,
    goToPage,
    hasNextPage,
    hasPreviousPage,
    totalItems,
    startIndex,
    endIndex,
    resetPage
  } = usePagination({
    data: filteredApplications,
    itemsPerPage: 10
  });

  // Reset pagination when filters change
  useEffect(() => {
    resetPage();
  }, [searchTerm, statusFilter, areaFilter, dateRange, resetPage]);

  // Clear selection when page changes
  useEffect(() => {
    setSelectedApplications([]);
  }, [currentPage]);

  const handleSelectApplication = (applicationId: string, checked: boolean) => {
    if (checked) {
      setSelectedApplications(prev => [...prev, applicationId]);
    } else {
      setSelectedApplications(prev => prev.filter(id => id !== applicationId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // Select all applications on current page
      setSelectedApplications(prev => {
        const currentPageIds = paginatedApplications.map(app => app.id);
        const newIds = currentPageIds.filter(id => !prev.includes(id));
        return [...prev, ...newIds];
      });
    } else {
      // Deselect all applications on current page
      const currentPageIds = paginatedApplications.map(app => app.id);
      setSelectedApplications(prev => prev.filter(id => !currentPageIds.includes(id)));
    }
  };

  const handleBulkActionComplete = () => {
    setSelectedApplications([]);
    refetch();
  };

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6 p-4 sm:p-0">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="space-y-3">
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="flex gap-2">
                  <div className="h-8 bg-gray-200 rounded w-24"></div>
                  <div className="h-8 bg-gray-200 rounded w-32"></div>
                  <div className="h-8 bg-gray-200 rounded w-28"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ApplicationsLoadingSkeleton count={5} />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-0">
      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-sm">
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
      </div>

      {/* Results Summary - Mobile Optimized */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
        <div className="text-sm text-gray-600">
          <span className="font-medium">{totalItems}</span> applications found
          {getActiveFilters().length > 0 && (
            <span className="block sm:inline sm:ml-2 text-xs text-gray-500">
              ({getActiveFilters().length} filters active)
            </span>
          )}
          {totalItems > 0 && (
            <span className="block sm:inline sm:ml-2 text-xs text-gray-500">
              Page {currentPage} of {totalPages}
            </span>
          )}
        </div>
        {selectedApplications.length > 0 && (
          <div className="text-sm font-medium text-blue-600">
            {selectedApplications.length} selected across all pages
          </div>
        )}
      </div>

      {/* Toolbar */}
      {selectedApplications.length > 0 && (
        <ApplicationsToolbar
          selectedApplications={selectedApplications}
          onBulkActionComplete={handleBulkActionComplete}
          onClearSelection={() => setSelectedApplications([])}
        />
      )}

      {/* Applications Grid */}
      <ApplicationsGrid
        applications={filteredApplications}
        selectedApplications={selectedApplications}
        onSelectApplication={handleSelectApplication}
        onSelectAll={handleSelectAll}
        onViewDetails={setSelectedApplication}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={goToPage}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
        startIndex={startIndex}
        endIndex={endIndex}
        totalItems={totalItems}
        paginatedApplications={paginatedApplications}
      />

      {/* Application Details Modal */}
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
