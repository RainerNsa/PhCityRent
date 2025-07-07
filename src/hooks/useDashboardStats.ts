import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface DashboardStats {
  user_id: string;
  saved_properties_count: number;
  pending_applications_count: number;
  total_applications_count: number;
  unread_messages_count: number;
  total_messages_count: number;
  active_searches_count: number;
}

export const useDashboardStats = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['dashboard-stats', user?.id],
    queryFn: async (): Promise<DashboardStats | null> => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('user_dashboard_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        // If view doesn't exist or fails, return default stats
        console.warn('Dashboard stats view not available, using fallback');
        return {
          user_id: user.id,
          saved_properties_count: 0,
          pending_applications_count: 0,
          total_applications_count: 0,
          unread_messages_count: 0,
          total_messages_count: 0,
          active_searches_count: 0,
        };
      }
      
      return data;
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
  });
};
