
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Property = Database['public']['Tables']['properties']['Row'];

export const useProperty = (id: string) => {
  return useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .eq('is_available', true)
        .single();

      if (error) {
        console.error('Error fetching property:', error);
        throw error;
      }

      return data;
    },
    enabled: !!id,
  });
};
