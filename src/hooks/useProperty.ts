
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { sampleProperties } from '@/components/admin/seed/SampleData';

type Property = Database['public']['Tables']['properties']['Row'];

export const useProperty = (id: string) => {
  return useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      // Use sample data in development mode for immediate preview
      const isDevelopment = import.meta.env.DEV;

      if (isDevelopment) {
        // Find property in sample data by ID
        await new Promise(resolve => setTimeout(resolve, 300)); // Simulate loading
        const property = sampleProperties.find(p => p.id === id && p.is_available);

        if (!property) {
          throw new Error('Property not found');
        }

        return property;
      }

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
