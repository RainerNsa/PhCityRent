
import React from 'react';
import AdvancedFilters from '../AdvancedFilters';

interface ApplicationsFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  dateRange: { from?: Date; to?: Date };
  onDateRangeChange: (range: { from?: Date; to?: Date }) => void;
  areaFilter: string;
  onAreaChange: (value: string) => void;
  activeFilters: string[];
  onClearFilters: () => void;
}

const ApplicationsFilter = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  dateRange,
  onDateRangeChange,
  areaFilter,
  onAreaChange,
  activeFilters,
  onClearFilters
}: ApplicationsFilterProps) => {
  return (
    <AdvancedFilters
      searchTerm={searchTerm}
      onSearchChange={onSearchChange}
      statusFilter={statusFilter}
      onStatusChange={onStatusChange}
      dateRange={dateRange}
      onDateRangeChange={onDateRangeChange}
      areaFilter={areaFilter}
      onAreaChange={onAreaChange}
      activeFilters={activeFilters}
      onClearFilters={onClearFilters}
    />
  );
};

export default ApplicationsFilter;
