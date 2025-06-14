
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User } from 'lucide-react';
import DocumentViewer from './DocumentViewer';
import ApplicationPersonalInfo from './ApplicationPersonalInfo';  
import ApplicationOperatingAreas from './ApplicationOperatingAreas';
import ApplicationDocuments from './ApplicationDocuments';
import ApplicationRefereeInfo from './ApplicationRefereeInfo';
import ApplicationStatusUpdate from './ApplicationStatusUpdate';
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

interface ApplicationDetailsModalProps {
  application: Application | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const ApplicationDetailsModal = ({ application, isOpen, onClose, onUpdate }: ApplicationDetailsModalProps) => {
  const [newStatus, setNewStatus] = useState<ApplicationStatus>('pending_review');
  const [reviewerNotes, setReviewerNotes] = useState('');
  const [nextAction, setNextAction] = useState('');
  const [updating, setUpdating] = useState(false);
  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (application) {
      setNewStatus(application.status);
      setReviewerNotes(application.reviewer_notes || '');
      setNextAction(application.next_action || '');
      fetchDocuments();
    }
  }, [application]);

  const fetchDocuments = async () => {
    if (!application) return;
    
    try {
      const { data, error } = await supabase
        .from('verification_documents')
        .select('*')
        .eq('application_id', application.id);

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const handleStatusUpdate = async () => {
    if (!application) return;

    setUpdating(true);
    try {
      const { error } = await supabase
        .from('agent_applications')
        .update({
          status: newStatus,
          reviewer_notes: reviewerNotes,
          next_action: nextAction,
          updated_at: new Date().toISOString()
        })
        .eq('id', application.id);

      if (error) throw error;

      // Log the status change
      await supabase
        .from('verification_status_log')
        .insert({
          application_id: application.id,
          previous_status: application.status,
          new_status: newStatus,
          change_reason: reviewerNotes,
          notes: `Status updated by admin. Next action: ${nextAction}`
        });

      toast({
        title: "Application Updated",
        description: "Application status has been updated successfully.",
      });

      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating application:', error);
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  if (!application) return null;

  const hasChanges = newStatus !== application.status || 
                    reviewerNotes !== (application.reviewer_notes || '') ||
                    nextAction !== (application.next_action || '');

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <User className="w-5 h-5" />
              {application.full_name} - {application.agent_id}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <ApplicationPersonalInfo application={application} />
            
            <ApplicationOperatingAreas operatingAreas={application.operating_areas} />
            
            <ApplicationDocuments 
              documents={documents}
              onViewDocument={setSelectedDocument}
            />

            <ApplicationRefereeInfo 
              refereeVerifications={application.referee_verifications || []}
            />

            <Separator />

            <ApplicationStatusUpdate 
              newStatus={newStatus}
              onStatusChange={setNewStatus}
              reviewerNotes={reviewerNotes}
              onReviewerNotesChange={setReviewerNotes}
              nextAction={nextAction}
              onNextActionChange={setNextAction}
              onUpdate={handleStatusUpdate}
              onCancel={onClose}
              updating={updating}
              hasChanges={hasChanges}
            />
          </div>
        </DialogContent>
      </Dialog>

      <DocumentViewer
        document={selectedDocument}
        isOpen={!!selectedDocument}
        onClose={() => setSelectedDocument(null)}
      />
    </>
  );
};

export default ApplicationDetailsModal;
