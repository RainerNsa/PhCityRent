
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type RentalAgreement = Database['public']['Tables']['rental_agreements']['Row'];
type RentalAgreementInsert = Database['public']['Tables']['rental_agreements']['Insert'];

export const useRentalAgreements = (userId?: string) => {
  return useQuery({
    queryKey: ['rental-agreements', userId],
    queryFn: async () => {
      let query = supabase
        .from('rental_agreements')
        .select('*, properties(title, location)')
        .order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching rental agreements:', error);
        throw error;
      }

      return data || [];
    },
  });
};

export const useCreateRentalAgreement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (agreement: RentalAgreementInsert) => {
      const { data, error } = await supabase
        .from('rental_agreements')
        .insert(agreement)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rental-agreements'] });
    },
  });
};

export const useUpdateRentalAgreement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<RentalAgreement> }) => {
      const { data, error } = await supabase
        .from('rental_agreements')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rental-agreements'] });
    },
  });
};
