
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import VerificationProgressTracker from '@/components/verification/VerificationProgressTracker';
import { 
  Shield, 
  FileText, 
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
  next_action?: string;
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
          <p className="text-gray-600">Track your verification progress in real-time</p>
        </div>

        {/* Enhanced Progress Tracker */}
        <VerificationProgressTracker 
          currentStatus={application.status}
          applicationDate={application.created_at}
          estimatedCompletion={application.estimated_completion}
          nextAction={application.next_action}
          reviewerNotes={application.reviewer_notes}
        />

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
              <span className="font-medium">Agent ID:</span> {application.agent_id}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {application.verification_documents.map((doc) => (
                <div key={doc.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{doc.document_type.replace('_', ' ').toUpperCase()}</p>
                      <p className="text-sm text-gray-600 mt-1">{doc.file_name}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      ✓ Uploaded
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p>No documents found</p>
            </div>
          )}
        </Card>

        {/* Referee Information */}
        {application.referee_verifications && application.referee_verifications.length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Referee Verification</h3>
            {application.referee_verifications.map((referee, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <span className="font-medium">Name:</span> {referee.referee_full_name}
                  </div>
                  <div>
                    <span className="font-medium">WhatsApp:</span> {referee.referee_whatsapp_number}
                  </div>
                  <div>
                    <span className="font-medium">Role:</span> {referee.referee_role}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Status:</span>
                    <Badge 
                      variant="outline" 
                      className={referee.status === 'confirmed' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}
                    >
                      {referee.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </Card>
        )}
      </div>
    </div>
  );
};

export default AgentDashboard;
