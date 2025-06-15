
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, XCircle, MessageSquare, Users } from 'lucide-react';

interface EnhancedBulkActionsProps {
  selectedApplications: string[];
  onBulkActionComplete: () => void;
  onClearSelection: () => void;
}

const EnhancedBulkActions = ({ selectedApplications, onBulkActionComplete, onClearSelection }: EnhancedBulkActionsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [actionType, setActionType] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleBulkAction = async () => {
    if (!actionType || selectedApplications.length === 0) {
      toast({
        title: "Error",
        description: "Please select an action and at least one application",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      let newStatus = '';
      let actionDescription = '';

      switch (actionType) {
        case 'approve':
          newStatus = 'approved';
          actionDescription = 'Bulk approval';
          break;
        case 'reject':
          newStatus = 'rejected';
          actionDescription = 'Bulk rejection';
          break;
        case 'needs_info':
          newStatus = 'needs_info';
          actionDescription = 'Request additional information';
          break;
        case 'contact_referees':
          actionDescription = 'Contact referees';
          break;
        default:
          throw new Error('Invalid action type');
      }

      // Log the bulk operation
      const { data: operationLog, error: logError } = await supabase
        .from('bulk_operations_log')
        .insert({
          operation_type: actionType,
          application_ids: selectedApplications,
          operation_data: { notes, action_description: actionDescription },
          status: 'in_progress'
        })
        .select()
        .single();

      if (logError) throw logError;

      let successCount = 0;
      let failureCount = 0;

      for (const applicationId of selectedApplications) {
        try {
          if (actionType === 'contact_referees') {
            // Handle referee contact logic
            const { data: referees } = await supabase
              .from('referee_verifications')
              .select('*')
              .eq('application_id', applicationId);

            // Mock referee contact functionality
            await new Promise(resolve => setTimeout(resolve, 100));
            successCount++;
          } else {
            // Update application status
            const { error: updateError } = await supabase
              .from('agent_applications')
              .update({
                status: newStatus,
                reviewer_notes: notes,
                updated_at: new Date().toISOString()
              })
              .eq('id', applicationId);

            if (updateError) throw updateError;

            // Log status change
            await supabase
              .from('verification_status_log')
              .insert({
                application_id: applicationId,
                previous_status: 'pending_review', // This would ideally be fetched
                new_status: newStatus,
                change_reason: actionDescription,
                notes: notes,
                changed_by: (await supabase.auth.getUser()).data.user?.id
              });

            successCount++;
          }
        } catch (error) {
          console.error(`Failed to process application ${applicationId}:`, error);
          failureCount++;
        }
      }

      // Update operation log
      await supabase
        .from('bulk_operations_log')
        .update({
          status: failureCount === 0 ? 'completed' : 'partially_completed',
          completed_count: successCount,
          failed_count: failureCount,
          completed_at: new Date().toISOString()
        })
        .eq('id', operationLog.id);

      toast({
        title: "Bulk Action Completed",
        description: `${successCount} applications processed successfully. ${failureCount} failed.`,
      });

      setIsDialogOpen(false);
      setActionType('');
      setNotes('');
      onBulkActionComplete();
      onClearSelection();

    } catch (error) {
      console.error('Bulk action error:', error);
      toast({
        title: "Error",
        description: "Failed to complete bulk action",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (selectedApplications.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <Users className="w-5 h-5 text-blue-600" />
      <span className="text-sm font-medium text-blue-900">
        {selectedApplications.length} application(s) selected
      </span>
      
      <div className="flex gap-2 ml-auto">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="w-4 h-4 mr-1" />
              Bulk Approve
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Bulk Action</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Action</label>
                <Select value={actionType} onValueChange={setActionType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select action..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approve">Approve Applications</SelectItem>
                    <SelectItem value="reject">Reject Applications</SelectItem>
                    <SelectItem value="needs_info">Request More Information</SelectItem>
                    <SelectItem value="contact_referees">Contact Referees</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Notes (Optional)</label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes for this bulk action..."
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleBulkAction} disabled={isLoading}>
                  {isLoading ? 'Processing...' : `Apply to ${selectedApplications.length} applications`}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Button 
          size="sm" 
          variant="destructive" 
          onClick={() => {
            setActionType('reject');
            setIsDialogOpen(true);
          }}
        >
          <XCircle className="w-4 h-4 mr-1" />
          Bulk Reject
        </Button>
        
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => {
            setActionType('contact_referees');
            setIsDialogOpen(true);
          }}
        >
          <MessageSquare className="w-4 h-4 mr-1" />
          Contact Referees
        </Button>
        
        <Button size="sm" variant="ghost" onClick={onClearSelection}>
          Clear Selection
        </Button>
      </div>
    </div>
  );
};

export default EnhancedBulkActions;
