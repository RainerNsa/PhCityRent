import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Database } from '@/integrations/supabase/types';

type RentalApplication = Database['public']['Tables']['rental_applications']['Row'];
type RentalApplicationInsert = Database['public']['Tables']['rental_applications']['Insert'];

export const useRentalApplications = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['rental-applications', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('rental_applications')
        .select(`
          *,
          properties (
            id,
            title,
            location,
            price,
            images
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
};

export const useCreateRentalApplication = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: {
      propertyId: string;
      applicationData: any;
    }) => {
      if (!user) throw new Error('User not authenticated');

      const applicationData: RentalApplicationInsert = {
        user_id: user.id,
        property_id: data.propertyId,
        application_data: data.applicationData,
        status: 'submitted',
        submitted_at: new Date().toISOString(),
      };

      const { data: result, error } = await supabase
        .from('rental_applications')
        .insert(applicationData)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rental-applications'] });
      toast({
        title: "Application Submitted",
        description: "Your rental application has been submitted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive"
      });
    },
  });
};

export const useUpdateRentalApplication = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<RentalApplication> }) => {
      const { data, error } = await supabase
        .from('rental_applications')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rental-applications'] });
      toast({
        title: "Application Updated",
        description: "Your application has been updated successfully.",
      });
    },
  });
};

export const useRentalApplicationStats = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['rental-application-stats', user?.id],
    queryFn: async () => {
      if (!user) return { total: 0, pending: 0, approved: 0, rejected: 0 };
      
      const { data, error } = await supabase
        .from('rental_applications')
        .select('status')
        .eq('user_id', user.id);

      if (error) throw error;
      
      const stats = {
        total: data.length,
        pending: data.filter(app => app.status === 'submitted' || app.status === 'under_review').length,
        approved: data.filter(app => app.status === 'approved').length,
        rejected: data.filter(app => app.status === 'rejected').length,
      };
      
      return stats;
    },
    enabled: !!user,
  });
};
