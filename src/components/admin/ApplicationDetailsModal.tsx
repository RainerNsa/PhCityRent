
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User, Phone, Mail, MapPin, FileText, MessageSquare, Clock } from 'lucide-react';
import DocumentViewer from './DocumentViewer';
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
            {/* Personal Information */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <User className="w-4 h-4" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span>{application.whatsapp_number}</span>
                </div>
                {application.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span>{application.email}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span>Submitted: {new Date(application.created_at).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Business:</span>
                  <Badge variant={application.is_registered_business ? "default" : "outline"}>
                    {application.is_registered_business ? "Registered" : "Individual"}
                  </Badge>
                </div>
              </div>
              <div className="mt-3">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                  <span className="text-sm">{application.residential_address}</span>
                </div>
              </div>
            </Card>

            {/* Operating Areas */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Operating Areas
              </h3>
              <div className="flex flex-wrap gap-2">
                {application.operating_areas?.map((area, index) => (
                  <Badge key={index} variant="outline">{area}</Badge>
                ))}
              </div>
            </Card>

            {/* Documents */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Documents ({documents.length})
              </h3>
              {documents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {documents.map((doc) => (
                    <div key={doc.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{doc.document_type.replace('_', ' ').toUpperCase()}</p>
                          <p className="text-xs text-gray-500">{doc.file_name}</p>
                          <p className="text-xs text-gray-500">
                            {(doc.file_size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSelectedDocument(doc)}
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No documents uploaded</p>
              )}
            </Card>

            {/* Referee Information */}
            {application.referee_verifications && application.referee_verifications.length > 0 && (
              <Card className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Referee Information
                </h3>
                {application.referee_verifications.map((referee, index) => (
                  <div key={index} className="space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500">Name:</span>
                        <p className="font-medium">{referee.referee_full_name}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Phone:</span>
                        <p>{referee.referee_whatsapp_number}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Role:</span>
                        <p>{referee.referee_role}</p>
                      </div>
                    </div>
                    <Badge className={
                      referee.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800'
                        : referee.status === 'failed'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }>
                      {referee.status.toUpperCase()}
                    </Badge>
                  </div>
                ))}
              </Card>
            )}

            <Separator />

            {/* Status Update Section */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Update Application Status</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Status</label>
                  <Select value={newStatus} onValueChange={(value: ApplicationStatus) => setNewStatus(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending_review">Pending Review</SelectItem>
                      <SelectItem value="documents_reviewed">Documents Reviewed</SelectItem>
                      <SelectItem value="referee_contacted">Referee Contacted</SelectItem>
                      <SelectItem value="needs_info">Needs More Info</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Reviewer Notes</label>
                  <Textarea
                    placeholder="Add notes about the application review..."
                    value={reviewerNotes}
                    onChange={(e) => setReviewerNotes(e.target.value)}
                    rows={3}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Next Action Required</label>
                  <Textarea
                    placeholder="Describe what needs to happen next..."
                    value={nextAction}
                    onChange={(e) => setNextAction(e.target.value)}
                    rows={2}
                  />
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={handleStatusUpdate}
                disabled={updating || newStatus === application.status}
                className="flex-1 bg-pulse-500 hover:bg-pulse-600"
              >
                {updating ? "Updating..." : "Update Application"}
              </Button>
            </div>
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
