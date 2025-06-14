
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ApplicationDetailsModal from './ApplicationDetailsModal';
import AdvancedFilters from './AdvancedFilters';
import ApplicationCard from './ApplicationCard';
import BulkActions from './BulkActions';
import ExportTools from './ExportTools';
import { Checkbox } from '@/components/ui/checkbox';
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
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [areaFilter, setAreaFilter] = useState('all');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('agent_applications')
        .select(`
          *,
          referee_verifications (
            status,
            referee_full_name,
            referee_whatsapp_number,
            referee_role
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: "Error",
        description: "Failed to load applications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.agent_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.whatsapp_number.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesArea = areaFilter === 'all' || app.operating_areas?.includes(areaFilter);
    
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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pulse-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdvancedFilters
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

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <BulkActions
            selectedApplications={selectedApplications}
            onBulkActionComplete={fetchApplications}
            onClearSelection={() => setSelectedApplications([])}
          />
        </div>
        
        <ExportTools selectedApplications={selectedApplications} />
      </div>

      {/* Select All Checkbox */}
      {filteredApplications.length > 0 && (
        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
          <Checkbox
            id="select-all"
            checked={selectedApplications.length === filteredApplications.length}
            onCheckedChange={handleSelectAll}
          />
          <label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
            Select all {filteredApplications.length} applications
          </label>
        </div>
      )}

      <div className="grid gap-4">
        {filteredApplications.map((application) => (
          <div key={application.id} className="flex items-center gap-3">
            <Checkbox
              checked={selectedApplications.includes(application.id)}
              onCheckedChange={(checked) => handleSelectApplication(application.id, checked as boolean)}
            />
            <div className="flex-1">
              <ApplicationCard
                application={application}
                onViewDetails={setSelectedApplication}
              />
            </div>
          </div>
        ))}
      </div>

      {filteredApplications.length === 0 && (
        <div className="text-center p-8 text-gray-600">
          No applications found matching your criteria.
        </div>
      )}

      <ApplicationDetailsModal
        application={selectedApplication}
        isOpen={!!selectedApplication}
        onClose={() => setSelectedApplication(null)}
        onUpdate={fetchApplications}
      />
    </div>
  );
};

export default AdminApplicationsList;
