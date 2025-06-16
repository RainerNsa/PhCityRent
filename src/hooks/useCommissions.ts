
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Commission = Database['public']['Tables']['agent_commissions']['Row'];
type CommissionInsert = Database['public']['Tables']['agent_commissions']['Insert'];

export const useCommissions = (agentId?: string) => {
  return useQuery({
    queryKey: ['commissions', agentId],
    queryFn: async () => {
      let query = supabase
        .from('agent_commissions')
        .select('*, properties(title, location)')
        .order('created_at', { ascending: false });

      if (agentId) {
        query = query.eq('agent_id', agentId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching commissions:', error);
        throw error;
      }

      return data || [];
    },
  });
};

export const useCreateCommission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commission: CommissionInsert) => {
      const { data, error } = await supabase
        .from('agent_commissions')
        .insert(commission)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commissions'] });
    },
  });
};

export const useUpdateCommission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Commission> }) => {
      const { data, error } = await supabase
        .from('agent_commissions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commissions'] });
    },
  });
};
