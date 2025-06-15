
import { useState, useMemo } from 'react';
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

export const useApplicationsFilters = (applications: Application[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [areaFilter, setAreaFilter] = useState('all');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});

  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      const matchesSearch = app.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           app.agent_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           app.whatsapp_number.includes(searchTerm);
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
      const matchesArea = areaFilter === 'all' || app.operating_areas?.some(area => 
        area.toLowerCase().includes(areaFilter.toLowerCase())
      );
      
      let matchesDate = true;
      if (dateRange.from) {
        const appDate = new Date(app.created_at);
        matchesDate = appDate >= dateRange.from;
        if (dateRange.to) {
          matchesDate = matchesDate && appDate <= dateRange.to;
        }
      }
      
      return matchesSearch && matchesStatus && matchesArea && matchesDate;
    });
  }, [applications, searchTerm, statusFilter, areaFilter, dateRange]);

  const getActiveFilters = () => {
    const filters = [];
    if (searchTerm) filters.push(`Search: ${searchTerm}`);
    if (statusFilter !== 'all') filters.push(`Status: ${statusFilter}`);
    if (areaFilter !== 'all') filters.push(`Area: ${areaFilter}`);
    if (dateRange.from) filters.push('Date filtered');
    return filters;
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setAreaFilter('all');
    setDateRange({});
  };

  return {
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
  };
};
