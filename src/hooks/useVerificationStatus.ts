
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface VerificationStatusData {
  agentId: string;
  applicantName: string;
  submissionDate: string;
  status: string;
  currentStep: number;
  totalSteps: number;
  reviewerNotes?: string;
  refereeStatus?: string;
  nextAction?: string;
  estimatedCompletion?: string;
}

export const useVerificationStatus = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [statusData, setStatusData] = useState<VerificationStatusData | null>(null);

  const checkStatus = async (agentId: string) => {
    setIsLoading(true);
    
    try {
      // Get application data
      const { data: application, error: appError } = await supabase
        .from('agent_applications')
        .select(`
          *,
          referee_verifications (
            status,
            contacted_at,
            confirmed_at
          )
        `)
        .eq('agent_id', agentId.toUpperCase())
        .single();

      if (appError || !application) {
        setStatusData(null);
        return { found: false };
      }

      // Map status to step number
      const statusStepMap = {
        'pending_review': 1,
        'documents_reviewed': 2,
        'referee_contacted': 3,
        'approved': 5,
        'rejected': 5,
        'needs_info': 2
      };

      const currentStep = statusStepMap[application.status as keyof typeof statusStepMap] || 1;
      const refereeStatus = application.referee_verifications?.[0]?.status || 'pending';

      const statusData: VerificationStatusData = {
        agentId: application.agent_id,
        applicantName: application.full_name,
        submissionDate: application.created_at,
        status: application.status,
        currentStep,
        totalSteps: 5,
        reviewerNotes: application.reviewer_notes,
        refereeStatus,
        nextAction: application.next_action,
        estimatedCompletion: application.estimated_completion
      };

      setStatusData(statusData);
      return { found: true, data: statusData };
      
    } catch (error) {
      console.error('Error checking verification status:', error);
      setStatusData(null);
      return { found: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    checkStatus,
    isLoading,
    statusData
  };
};
