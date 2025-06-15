
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Property = Database['public']['Tables']['properties']['Row'];
type PropertyInsert = Database['public']['Tables']['properties']['Insert'];

export const useProperties = (filters?: {
  search?: string;
  location?: string;
  priceRange?: string;
  bedrooms?: string;
}) => {
  return useQuery({
    queryKey: ['properties', filters],
    queryFn: async () => {
      let query = supabase
        .from('properties')
        .select('*')
        .eq('is_available', true)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,location.ilike.%${filters.search}%`);
      }

      if (filters?.location && filters.location !== 'all') {
        query = query.ilike('location', `%${filters.location}%`);
      }

      if (filters?.bedrooms && filters.bedrooms !== 'all') {
        const bedroomCount = parseInt(filters.bedrooms);
        if (bedroomCount === 4) {
          query = query.gte('bedrooms', 4);
        } else {
          query = query.eq('bedrooms', bedroomCount);
        }
      }

      if (filters?.priceRange && filters.priceRange !== 'all') {
        const [min, max] = filters.priceRange.split('-').map(p => parseInt(p));
        query = query.gte('price_per_year', min);
        if (max) {
          query = query.lte('price_per_year', max);
        }
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching properties:', error);
        throw error;
      }

      return data || [];
    },
  });
};

export const useCreateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (property: PropertyInsert) => {
      const { data, error } = await supabase
        .from('properties')
        .insert(property)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
};

export const useUpdateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Property> }) => {
      const { data, error } = await supabase
        .from('properties')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
};

export const usePropertyInquiry = () => {
  return useMutation({
    mutationFn: async (inquiry: {
      property_id: string;
      inquirer_name: string;
      inquirer_email: string;
      inquirer_phone?: string;
      message?: string;
      inquiry_type?: string;
    }) => {
      const { data, error } = await supabase
        .from('property_inquiries')
        .insert(inquiry)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  });
};
