
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Database } from '@/integrations/supabase/types';

type ApplicationStatus = Database['public']['Enums']['application_status'];

interface ApplicationStatusUpdateProps {
  newStatus: ApplicationStatus;
  onStatusChange: (status: ApplicationStatus) => void;
  reviewerNotes: string;
  onReviewerNotesChange: (notes: string) => void;
  nextAction: string;
  onNextActionChange: (action: string) => void;
  onUpdate: () => void;
  onCancel: () => void;
  updating: boolean;
  hasChanges: boolean;
}

const ApplicationStatusUpdate = ({
  newStatus,
  onStatusChange,
  reviewerNotes,
  onReviewerNotesChange,
  nextAction,
  onNextActionChange,
  onUpdate,
  onCancel,
  updating,
  hasChanges
}: ApplicationStatusUpdateProps) => {
  return (
    <>
      <Card className="p-4">
        <h3 className="font-semibold mb-4">Update Application Status</h3>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Status</label>
            <Select value={newStatus} onValueChange={onStatusChange}>
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
              onChange={(e) => onReviewerNotesChange(e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Next Action Required</label>
            <Textarea
              placeholder="Describe what needs to happen next..."
              value={nextAction}
              onChange={(e) => onNextActionChange(e.target.value)}
              rows={2}
            />
          </div>
        </div>
      </Card>

      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button 
          onClick={onUpdate}
          disabled={updating || !hasChanges}
          className="flex-1 bg-pulse-500 hover:bg-pulse-600"
        >
          {updating ? "Updating..." : "Update Application"}
        </Button>
      </div>
    </>
  );
};

export default ApplicationStatusUpdate;
