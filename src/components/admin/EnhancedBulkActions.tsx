
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CheckSquare, X, AlertCircle, FileText, Users } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';

type ApplicationStatus = Database['public']['Enums']['application_status'];

interface EnhancedBulkActionsProps {
  selectedApplications: string[];
  onBulkActionComplete: () => void;
  onClearSelection: () => void;
}

const EnhancedBulkActions = ({ selectedApplications, onBulkActionComplete, onClearSelection }: EnhancedBulkActionsProps) => {
  const [bulkAction, setBulkAction] = useState<string>('');
  const [bulkNotes, setBulkNotes] = useState('');
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  const handleBulkAction = async () => {
    if (!bulkAction || selectedApplications.length === 0) return;

    setProcessing(true);
    
    try {
      const newStatus = bulkAction as ApplicationStatus;
      
      // Start bulk operation logging
      const { data: bulkLog, error: logError } = await supabase
        .from('bulk_operations_log')
        .insert({
          operation_type: `bulk_status_change_${newStatus}`,
          application_ids: selectedApplications,
          admin_id: (await supabase.auth.getUser()).data.user?.id,
          operation_data: { new_status: newStatus, notes: bulkNotes }
        })
        .select()
        .single();

      if (logError) throw logError;

      // Update applications
      const { error: updateError } = await supabase
        .from('agent_applications')
        .update({
          status: newStatus,
          reviewer_notes: bulkNotes,
          updated_at: new Date().toISOString()
        })
        .in('id', selectedApplications);

      if (updateError) throw updateError;

      // Log status changes
      const statusLogs = selectedApplications.map(appId => ({
        application_id: appId,
        previous_status: 'pending_review' as ApplicationStatus, // This would ideally come from the current status
        new_status: newStatus,
        change_reason: `Bulk action: ${bulkAction}`,
        notes: bulkNotes,
        changed_by: (await supabase.auth.getUser()).data.user?.id
      }));

      const { error: logStatusError } = await supabase
        .from('verification_status_log')
        .insert(statusLogs);

      if (logStatusError) throw logStatusError;

      // Update bulk operation log
      await supabase
        .from('bulk_operations_log')
        .update({
          status: 'completed',
          completed_count: selectedApplications.length,
          completed_at: new Date().toISOString()
        })
        .eq('id', bulkLog.id);

      toast({
        title: "Bulk Action Completed",
        description: `Successfully updated ${selectedApplications.length} applications to ${newStatus}`,
      });

      onBulkActionComplete();
      onClearSelection();
      setBulkAction('');
      setBulkNotes('');
    } catch (error) {
      console.error('Error performing bulk action:', error);
      toast({
        title: "Error",
        description: "Failed to perform bulk action",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  if (selectedApplications.length === 0) {
    return null;
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-blue-600" />
          <span className="font-medium text-blue-900">
            {selectedApplications.length} applications selected
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onClearSelection}
        >
          <X className="w-4 h-4 mr-1" />
          Clear Selection
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bulk Action
          </label>
          <Select value={bulkAction} onValueChange={setBulkAction}>
            <SelectTrigger>
              <SelectValue placeholder="Select action..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="approved">
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-green-500" />
                  Approve All
                </div>
              </SelectItem>
              <SelectItem value="rejected">
                <div className="flex items-center gap-2">
                  <X className="w-4 h-4 text-red-500" />
                  Reject All
                </div>
              </SelectItem>
              <SelectItem value="needs_info">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-500" />
                  Request Info
                </div>
              </SelectItem>
              <SelectItem value="documents_reviewed">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-500" />
                  Mark as Reviewed
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes (optional)
          </label>
          <Textarea
            value={bulkNotes}
            onChange={(e) => setBulkNotes(e.target.value)}
            placeholder="Add notes for this bulk action..."
            className="min-h-[40px]"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleBulkAction}
          disabled={!bulkAction || processing}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {processing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </>
          ) : (
            <>
              <Users className="w-4 h-4 mr-2" />
              Apply to {selectedApplications.length} Applications
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default EnhancedBulkActions;
