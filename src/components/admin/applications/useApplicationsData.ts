
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useRetry } from '@/hooks/useRetry';
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

export const useApplicationsData = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { executeWithRetry, isRetrying } = useRetry({
    maxAttempts: 3,
    delay: 1000,
    onError: (error, attempt) => {
      console.error(`Fetch attempt ${attempt} failed:`, error);
    }
  });

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await executeWithRetry(async () => {
        const { data, error } = await supabase
          .from('agent_applications')
          .select(`
            *,
            referee_verifications (
              status,
              referee_full_name,
              referee_whatsapp_number,
              referee_role
            )
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
      });

      setApplications(result);
    } catch (error) {
      console.error('Error fetching applications:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load applications';
      setError(errorMessage);
      
      // Only show toast for non-network errors or final failures
      if (!error?.message?.includes('fetch')) {
        toast({
          title: "Error Loading Applications",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return {
    applications,
    loading: loading || isRetrying,
    error,
    refetch: fetchApplications
  };
};
