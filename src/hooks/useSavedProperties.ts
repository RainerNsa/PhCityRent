
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export const useSavedProperties = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['saved-properties', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('saved_properties')
        .select(`
          id,
          property_id,
          created_at,
          properties (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
};

export const useToggleSavedProperty = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ propertyId, isSaved }: { propertyId: string; isSaved: boolean }) => {
      if (!user) throw new Error('User not authenticated');

      if (isSaved) {
        // Remove from saved properties
        const { error } = await supabase
          .from('saved_properties')
          .delete()
          .eq('property_id', propertyId)
          .eq('user_id', user.id);

        if (error) throw error;
        return { action: 'removed' };
      } else {
        // Add to saved properties
        const { error } = await supabase
          .from('saved_properties')
          .insert({
            property_id: propertyId,
            user_id: user.id,
          });

        if (error) throw error;
        return { action: 'added' };
      }
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['saved-properties'] });
      toast({
        title: result.action === 'added' ? "Property Saved" : "Property Removed",
        description: result.action === 'added' 
          ? "Property added to your favorites" 
          : "Property removed from your favorites",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update saved property",
        variant: "destructive",
      });
    },
  });
};

export const useIsSavedProperty = (propertyId: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['is-saved-property', propertyId, user?.id],
    queryFn: async () => {
      if (!user) return false;
      
      const { data, error } = await supabase
        .from('saved_properties')
        .select('id')
        .eq('property_id', propertyId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    },
    enabled: !!user && !!propertyId,
  });
};
