
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { 
  CheckSquare, 
  Users, 
  MessageSquare, 
  FileCheck, 
  Clock,
  AlertTriangle,
  Send
} from 'lucide-react';
import { Database } from '@/integrations/supabase/types';

type ApplicationStatus = Database['public']['Enums']['application_status'];

interface EnhancedBulkActionsProps {
  selectedApplications: string[];
  onBulkActionComplete: () => void;
  onClearSelection: () => void;
}

const EnhancedBulkActions = ({ selectedApplications, onBulkActionComplete, onClearSelection }: EnhancedBulkActionsProps) => {
  const [bulkAction, setBulkAction] = useState<string>('');
  const [processing, setProcessing] = useState(false);
  const [showNotesDialog, setShowNotesDialog] = useState(false);
  const [bulkNotes, setBulkNotes] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus>('approved');
  const { toast } = useToast();
  const { user } = useAuth();

  const handleBulkStatusUpdate = async (newStatus: ApplicationStatus, notes?: string) => {
    setProcessing(true);
    try {
      // Log bulk operation start
      const { data: bulkOpLog, error: logError } = await supabase
        .from('bulk_operations_log')
        .insert({
          admin_id: user?.id,
          operation_type: `bulk_${newStatus}`,
          application_ids: selectedApplications,
          operation_data: { notes, status: newStatus }
        })
        .select()
        .single();

      if (logError) throw logError;

      let completedCount = 0;
      let failedCount = 0;
      const errorDetails: any[] = [];

      // Process each application
      for (const appId of selectedApplications) {
        try {
          const { error } = await supabase
            .from('agent_applications')
            .update({ 
              status: newStatus,
              reviewer_notes: notes,
              updated_at: new Date().toISOString()
            })
            .eq('id', appId);

          if (error) throw error;
          completedCount++;
        } catch (error) {
          failedCount++;
          errorDetails.push({ application_id: appId, error: error.message });
        }
      }

      // Update bulk operation log
      await supabase
        .from('bulk_operations_log')
        .update({
          status: failedCount === 0 ? 'completed' : 'partially_completed',
          completed_count: completedCount,
          failed_count: failedCount,
          error_details: errorDetails,
          completed_at: new Date().toISOString()
        })
        .eq('id', bulkOpLog.id);

      toast({
        title: "Bulk Update Completed",
        description: `Successfully updated ${completedCount} applications${failedCount > 0 ? `, ${failedCount} failed` : ''}`,
        variant: failedCount > 0 ? "destructive" : "default"
      });

      onBulkActionComplete();
      onClearSelection();
      setBulkAction('');
      setBulkNotes('');
      setShowNotesDialog(false);
    } catch (error) {
      console.error('Bulk update error:', error);
      toast({
        title: "Error",
        description: "Failed to perform bulk update",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleBulkContactReferees = async () => {
    setProcessing(true);
    try {
      // Log bulk operation
      const { data: bulkOpLog, error: logError } = await supabase
        .from('bulk_operations_log')
        .insert({
          admin_id: user?.id,
          operation_type: 'bulk_contact_referees',
          application_ids: selectedApplications,
          operation_data: { action: 'contact_referees' }
        })
        .select()
        .single();

      if (logError) throw logError;

      let completedCount = 0;
      let failedCount = 0;

      // Get referee information for selected applications
      const { data: applications, error: appError } = await supabase
        .from('agent_applications')
        .select(`
          id, full_name,
          referee_verifications (
            referee_whatsapp_number,
            referee_full_name
          )
        `)
        .in('id', selectedApplicationions);

      if (appError) throw appError;

      // Process referee contacts (this would integrate with WhatsApp API)
      for (const app of applications) {
        try {
          if (app.referee_verifications?.[0]) {
            // Log notification (actual WhatsApp sending would be implemented via edge function)
            await supabase
              .from('notification_log')
              .insert({
                application_id: app.id,
                notification_type: 'referee_contact',
                recipient_type: 'referee',
                recipient_number: app.referee_verifications[0].referee_whatsapp_number,
                message: `Hello ${app.referee_verifications[0].referee_full_name}, we need to verify your reference for ${app.full_name}'s agent verification application. Please contact us.`,
                status: 'pending'
              });
            
            completedCount++;
          }
        } catch (error) {
          failedCount++;
        }
      }

      // Update bulk operation log
      await supabase
        .from('bulk_operations_log')
        .update({
          status: 'completed',
          completed_count: completedCount,
          failed_count: failedCount,
          completed_at: new Date().toISOString()
        })
        .eq('id', bulkOpLog.id);

      toast({
        title: "Referees Contacted",
        description: `Initiated contact with ${completedCount} referees`,
      });

      onBulkActionComplete();
      onClearSelection();
      setBulkAction('');
    } catch (error) {
      console.error('Bulk referee contact error:', error);
      toast({
        title: "Error",
        description: "Failed to contact referees",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleBulkAction = () => {
    if (!bulkAction) return;
    
    switch (bulkAction) {
      case 'approve':
      case 'reject':
      case 'needs_info':
      case 'documents_reviewed':
        setSelectedStatus(bulkAction as ApplicationStatus);
        setShowNotesDialog(true);
        break;
      case 'contact_referees':
        handleBulkContactReferees();
        break;
    }
  };

  if (selectedApplications.length === 0) {
    return null;
  }

  return (
    <>
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <CheckSquare className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <span className="font-medium text-blue-900">
                {selectedApplications.length} application{selectedApplications.length > 1 ? 's' : ''} selected
              </span>
              <Badge variant="secondary" className="ml-2">{selectedApplications.length}</Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Select value={bulkAction} onValueChange={setBulkAction}>
              <SelectTrigger className="w-56">
                <SelectValue placeholder="Choose bulk action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="approve">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-green-500" />
                    Approve Selected
                  </div>
                </SelectItem>
                <SelectItem value="reject">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    Reject Selected
                  </div>
                </SelectItem>
                <SelectItem value="needs_info">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-500" />
                    Mark as Needs Info
                  </div>
                </SelectItem>
                <SelectItem value="documents_reviewed">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-blue-500" />
                    Mark Documents Reviewed
                  </div>
                </SelectItem>
                <SelectItem value="contact_referees">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-purple-500" />
                    Contact All Referees
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              onClick={handleBulkAction}
              disabled={!bulkAction || processing}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {processing ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Processing...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Apply
                </div>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={onClearSelection}
            >
              Clear Selection
            </Button>
          </div>
        </div>
      </div>

      {/* Bulk Action Notes Dialog */}
      <Dialog open={showNotesDialog} onOpenChange={setShowNotesDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Notes for Bulk Action</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Action: <span className="capitalize">{selectedStatus.replace('_', ' ')}</span>
              </label>
              <Badge variant="outline">{selectedApplications.length} applications</Badge>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Notes (Optional)</label>
              <Textarea
                placeholder="Add notes for this bulk action..."
                value={bulkNotes}
                onChange={(e) => setBulkNotes(e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowNotesDialog(false)} className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={() => handleBulkStatusUpdate(selectedStatus, bulkNotes)}
                disabled={processing}
                className="flex-1 bg-pulse-500 hover:bg-pulse-600"
              >
                {processing ? "Processing..." : "Confirm Action"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EnhancedBulkActions;
