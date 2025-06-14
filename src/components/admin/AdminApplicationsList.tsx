
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Eye, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ApplicationDetailsModal from './ApplicationDetailsModal';

interface Application {
  id: string;
  agent_id: string;
  full_name: string;
  whatsapp_number: string;
  email: string;
  status: string;
  created_at: string;
  operating_areas: string[];
  referee_verifications?: {
    status: string;
    referee_full_name: string;
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
            referee_full_name
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending_review':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'documents_reviewed':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'referee_contacted':
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'needs_info':
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'needs_info':
        return 'bg-orange-100 text-orange-800';
      case 'pending_review':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
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
      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
            <Input
              placeholder="Search by name, Agent ID, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending_review">Pending Review</SelectItem>
              <SelectItem value="documents_reviewed">Documents Reviewed</SelectItem>
              <SelectItem value="referee_contacted">Referee Contacted</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="needs_info">Needs Info</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Applications List */}
      <div className="grid gap-4">
        {filteredApplications.map((application) => (
          <Card key={application.id} className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-lg">{application.full_name}</h3>
                  <Badge className={getStatusColor(application.status)}>
                    {getStatusIcon(application.status)}
                    <span className="ml-2">{application.status.replace('_', ' ').toUpperCase()}</span>
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>ID: {application.agent_id}</span>
                  <span>Phone: {application.whatsapp_number}</span>
                  <span>Submitted: {new Date(application.created_at).toLocaleDateString()}</span>
                </div>
                <div className="text-sm text-gray-600">
                  Areas: {application.operating_areas?.slice(0, 3).join(', ')}
                  {application.operating_areas?.length > 3 && ` +${application.operating_areas.length - 3} more`}
                </div>
              </div>
              <Button
                onClick={() => setSelectedApplication(application)}
                className="bg-pulse-500 hover:bg-pulse-600"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredApplications.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-gray-600">No applications found matching your criteria.</p>
        </Card>
      )}

      {/* Application Details Modal */}
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
