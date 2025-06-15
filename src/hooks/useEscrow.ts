
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useEscrowTransactions = () => {
  return useQuery({
    queryKey: ['escrow-transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('escrow_transactions')
        .select(`
          *,
          properties (
            title,
            location,
            price_per_month
          ),
          escrow_milestones (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
};

export const useCreateEscrowPayment = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: {
      propertyId: string;
      amount: number;
      tenantName: string;
      tenantEmail: string;
      tenantPhone?: string;
      transactionType: string;
    }) => {
      const { data: result, error } = await supabase.functions.invoke('create-escrow-payment', {
        body: data,
      });

      if (error) throw error;
      return result;
    },
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create escrow payment",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateEscrowMilestone = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ milestoneId, status, notes }: {
      milestoneId: string;
      status: string;
      notes?: string;
    }) => {
      const { data, error } = await supabase
        .from('escrow_milestones')
        .update({
          status,
          notes,
          completed_at: status === 'completed' ? new Date().toISOString() : null,
        })
        .eq('id', milestoneId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['escrow-transactions'] });
      toast({
        title: "Success",
        description: "Milestone updated successfully",
      });
    },
  });
};
