
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  User,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ApplicationData {
  id: string;
  agent_id: string;
  full_name: string;
  whatsapp_number: string;
  email?: string;
  status: string;
  created_at: string;
  operating_areas: string[];
  residential_address: string;
  reviewer_notes?: string;
  estimated_completion?: string;
  verification_documents?: Array<{
    id: string;
    document_type: string;
    file_name: string;
    uploaded_at: string;
  }>;
  referee_verifications?: Array<{
    referee_full_name: string;
    referee_whatsapp_number: string;
    referee_role: string;
    status: string;
  }>;
}

const AgentDashboard = () => {
  const { user } = useAuth();
  const [application, setApplication] = useState<ApplicationData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchApplicationData();
    }
  }, [user]);

  const fetchApplicationData = async () => {
    try {
      // First try to get application by user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('agent_id')
        .eq('id', user?.id)
        .single();

      let query = supabase
        .from('agent_applications')
        .select(`
          *,
          verification_documents (
            id,
            document_type,
            file_name,
            uploaded_at
          ),
          referee_verifications (
            referee_full_name,
            referee_whatsapp_number,
            referee_role,
            status
          )
        `);

      if (profile?.agent_id) {
        query = query.eq('agent_id', profile.agent_id);
      } else {
        // Fallback: try to match by email if available
        if (user?.email) {
          query = query.eq('email', user.email);
        }
      }

      const { data, error } = await query.single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setApplication(data);
    } catch (error) {
      console.error('Error fetching application:', error);
      toast({
        title: "Error",
        description: "Failed to load application data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending_review':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'documents_reviewed':
        return <FileText className="w-5 h-5 text-blue-500" />;
      case 'referee_contacted':
        return <Phone className="w-5 h-5 text-blue-500" />;
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'needs_info':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
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
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getProgressPercentage = (status: string) => {
    switch (status) {
      case 'pending_review':
        return 25;
      case 'documents_reviewed':
        return 50;
      case 'referee_contacted':
        return 75;
      case 'approved':
        return 100;
      case 'rejected':
        return 0;
      case 'needs_info':
        return 40;
      default:
        return 0;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pulse-500"></div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Application Found</h2>
            <p className="text-gray-600 mb-6">
              You haven't submitted a verification application yet.
            </p>
            <Button onClick={() => window.location.href = '/'} className="bg-pulse-500 hover:bg-pulse-600">
              Apply for Verification
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="bg-pulse-100 p-3 rounded-lg w-fit mx-auto mb-4">
            <Shield className="w-8 h-8 text-pulse-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Agent Dashboard</h1>
          <p className="text-gray-600">Track your verification progress</p>
        </div>

        {/* Status Overview */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {getStatusIcon(application.status)}
              <div>
                <h2 className="text-xl font-semibold">Application Status</h2>
                <p className="text-gray-600">Agent ID: {application.agent_id}</p>
              </div>
            </div>
            <Badge className={getStatusColor(application.status)}>
              {application.status.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{getProgressPercentage(application.status)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-pulse-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgressPercentage(application.status)}%` }}
              ></div>
            </div>
          </div>

          {application.estimated_completion && (
            <p className="text-sm text-gray-600">
              Estimated completion: {new Date(application.estimated_completion).toLocaleDateString()}
            </p>
          )}
        </Card>

        {/* Personal Information */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <User className="w-5 h-5" />
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Name:</span> {application.full_name}
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-500" />
              <span className="font-medium">WhatsApp:</span> {application.whatsapp_number}
            </div>
            {application.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Email:</span> {application.email}
              </div>
            )}
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Address:</span> {application.residential_address}
            </div>
          </div>
        </Card>

        {/* Operating Areas */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Operating Areas
          </h3>
          <div className="flex flex-wrap gap-2">
            {application.operating_areas.map((area, index) => (
              <Badge key={index} variant="outline">
                {area}
              </Badge>
            ))}
          </div>
        </Card>

        {/* Documents */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Uploaded Documents
          </h3>
          {application.verification_documents && application.verification_documents.length > 0 ? (
            <div className="space-y-3">
              {application.verification_documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{doc.document_type.replace('_', ' ').toUpperCase()}</p>
                    <p className="text-sm text-gray-600">{doc.file_name}</p>
                    <p className="text-xs text-gray-500">
                      Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}
                    </p>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No documents uploaded yet.</p>
          )}
        </Card>

        {/* Referee Information */}
        {application.referee_verifications && application.referee_verifications.length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Referee Verification</h3>
            {application.referee_verifications.map((referee, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                  <div>
                    <span className="font-medium">Name:</span> {referee.referee_full_name}
                  </div>
                  <div>
                    <span className="font-medium">WhatsApp:</span> {referee.referee_whatsapp_number}
                  </div>
                  <div>
                    <span className="font-medium">Role:</span> {referee.referee_role}
                  </div>
                  <div>
                    <span className="font-medium">Status:</span>
                    <Badge className="ml-2" variant="outline">
                      {referee.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </Card>
        )}

        {/* Review Notes */}
        {application.reviewer_notes && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-3">Review Notes</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800">{application.reviewer_notes}</p>
            </div>
          </Card>
        )}

        {/* Actions */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Need Help?</h3>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" onClick={() => window.location.href = '/verification-status'}>
              Check Status
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/contact'}>
              Contact Support
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AgentDashboard;
