
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type MaintenanceRequest = Database['public']['Tables']['maintenance_requests']['Row'];
type MaintenanceRequestInsert = Database['public']['Tables']['maintenance_requests']['Insert'];

export const useMaintenanceRequests = (propertyId?: string) => {
  return useQuery({
    queryKey: ['maintenance-requests', propertyId],
    queryFn: async () => {
      let query = supabase
        .from('maintenance_requests')
        .select('*, properties(title, location)')
        .order('created_at', { ascending: false });

      if (propertyId) {
        query = query.eq('property_id', propertyId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching maintenance requests:', error);
        throw error;
      }

      return data || [];
    },
  });
};

export const useCreateMaintenanceRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: MaintenanceRequestInsert) => {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .insert(request)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance-requests'] });
    },
  });
};

export const useUpdateMaintenanceRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<MaintenanceRequest> }) => {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance-requests'] });
    },
  });
};
