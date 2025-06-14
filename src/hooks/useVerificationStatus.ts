
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface VerificationStatusData {
  id: string;
  agent_id: string;
  full_name: string;
  status: string;
  created_at: string;
  updated_at: string;
  reviewer_notes?: string;
  next_action?: string;
  estimated_completion?: string;
  referee_verifications?: Array<{
    status: string;
    referee_full_name: string;
    referee_role: string;
  }>;
}

export const useVerificationStatus = () => {
  const [loading, setLoading] = useState(false);
  const [application, setApplication] = useState<VerificationStatusData | null>(null);
  const { toast } = useToast();

  const checkStatus = async (agentId: string) => {
    setLoading(true);
    
    try {
      const { data: applicationData, error: appError } = await supabase
        .from('agent_applications')
        .select(`
          *,
          referee_verifications (
            status,
            referee_full_name,
            referee_role
          )
        `)
        .eq('agent_id', agentId.toUpperCase())
        .single();

      if (appError) {
        if (appError.code === 'PGRST116') {
          setApplication(null);
          return { found: false };
        }
        throw appError;
      }

      setApplication(applicationData);
      return { found: true, data: applicationData };
    } catch (error) {
      console.error('Error checking verification status:', error);
      toast({
        title: "Error",
        description: "Failed to check verification status. Please try again.",
        variant: "destructive",
      });
      return { found: false, error };
    } finally {
      setLoading(false);
    }
  };

  return {
    checkStatus,
    loading,
    application,
    setApplication
  };
};
