
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ApplicationDetailsModal from './ApplicationDetailsModal';
import ApplicationFilters from './ApplicationFilters';
import ApplicationCard from './ApplicationCard';
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
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pulse-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ApplicationFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      <div className="grid gap-4">
        {filteredApplications.map((application) => (
          <ApplicationCard
            key={application.id}
            application={application}
            onViewDetails={setSelectedApplication}
          />
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
