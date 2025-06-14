
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CheckSquare, Users, Mail, MessageSquare } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';

type ApplicationStatus = Database['public']['Enums']['application_status'];

interface BulkActionsProps {
  selectedApplications: string[];
  onBulkActionComplete: () => void;
  onClearSelection: () => void;
}

const BulkActions = ({ selectedApplications, onBulkActionComplete, onClearSelection }: BulkActionsProps) => {
  const [bulkAction, setBulkAction] = useState<string>('');
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  const handleBulkStatusUpdate = async (newStatus: ApplicationStatus) => {
    setProcessing(true);
    try {
      const { error } = await supabase
        .from('agent_applications')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .in('id', selectedApplications);

      if (error) throw error;

      toast({
        title: "Bulk Update Successful",
        description: `Updated ${selectedApplications.length} applications to ${newStatus}`,
      });

      onBulkActionComplete();
      onClearSelection();
      setBulkAction('');
    } catch (error) {
      console.error('Bulk update error:', error);
      toast({
        title: "Error",
        description: "Failed to update applications",
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
        handleBulkStatusUpdate('approved');
        break;
      case 'reject':
        handleBulkStatusUpdate('rejected');
        break;
      case 'needs_info':
        handleBulkStatusUpdate('needs_info');
        break;
      case 'documents_reviewed':
        handleBulkStatusUpdate('documents_reviewed');
        break;
    }
  };

  if (selectedApplications.length === 0) {
    return null;
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CheckSquare className="w-5 h-5 text-blue-600" />
          <span className="font-medium text-blue-900">
            {selectedApplications.length} application{selectedApplications.length > 1 ? 's' : ''} selected
          </span>
          <Badge variant="secondary">{selectedApplications.length}</Badge>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={bulkAction} onValueChange={setBulkAction}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Choose bulk action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="approve">Approve Selected</SelectItem>
              <SelectItem value="reject">Reject Selected</SelectItem>
              <SelectItem value="needs_info">Mark as Needs Info</SelectItem>
              <SelectItem value="documents_reviewed">Mark Documents Reviewed</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            onClick={handleBulkAction}
            disabled={!bulkAction || processing}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {processing ? 'Processing...' : 'Apply'}
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
  );
};

export default BulkActions;
