// Supabase Configuration
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

const supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Database types (these would be generated from your Supabase schema)
export interface Database {
  public: {
    Tables: {
      payment_history: {
        Row: {
          id: string;
          tenant_id: string;
          property_id: string;
          reference: string;
          amount: number;
          fees: number;
          status: string;
          payment_method: string;
          provider: string;
          transaction_id: string;
          payment_items: any[];
          metadata: any;
          created_at: string;
          updated_at: string;
          customer_email: string;
          customer_name: string;
          property_title: string;
          property_location: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          property_id: string;
          reference: string;
          amount: number;
          fees: number;
          status: string;
          payment_method: string;
          provider: string;
          transaction_id: string;
          payment_items: any[];
          metadata: any;
          created_at?: string;
          updated_at?: string;
          customer_email: string;
          customer_name: string;
          property_title: string;
          property_location: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          property_id?: string;
          reference?: string;
          amount?: number;
          fees?: number;
          status?: string;
          payment_method?: string;
          provider?: string;
          transaction_id?: string;
          payment_items?: any[];
          metadata?: any;
          created_at?: string;
          updated_at?: string;
          customer_email?: string;
          customer_name?: string;
          property_title?: string;
          property_location?: string;
        };
      };
      payment_summary: {
        Row: {
          id: string;
          tenant_id: string;
          total_paid: number;
          total_pending: number;
          total_failed: number;
          payment_count: number;
          last_payment_date: string | null;
          average_payment: number;
          preferred_method: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          total_paid: number;
          total_pending: number;
          total_failed: number;
          payment_count: number;
          last_payment_date?: string | null;
          average_payment: number;
          preferred_method: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          total_paid?: number;
          total_pending?: number;
          total_failed?: number;
          payment_count?: number;
          last_payment_date?: string | null;
          average_payment?: number;
          preferred_method?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      properties: {
        Row: {
          id: string;
          title: string;
          description: string;
          price: number;
          location: string;
          bedrooms: number;
          bathrooms: number;
          size: number;
          property_type: string;
          amenities: string[];
          images: string[];
          landlord_id: string;
          status: string;
          available_from: string;
          lease_terms: string[];
          created_at: string;
          updated_at: string;
          views_count: number;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          price: number;
          location: string;
          bedrooms: number;
          bathrooms: number;
          size: number;
          property_type: string;
          amenities: string[];
          images: string[];
          landlord_id: string;
          status: string;
          available_from: string;
          lease_terms: string[];
          created_at?: string;
          updated_at?: string;
          views_count?: number;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          price?: number;
          location?: string;
          bedrooms?: number;
          bathrooms?: number;
          size?: number;
          property_type?: string;
          amenities?: string[];
          images?: string[];
          landlord_id?: string;
          status?: string;
          available_from?: string;
          lease_terms?: string[];
          created_at?: string;
          updated_at?: string;
          views_count?: number;
        };
      };
      whatsapp_messages: {
        Row: {
          id: string;
          from: string;
          to: string;
          message_type: string;
          content: string;
          media_url: string | null;
          template_name: string | null;
          template_params: string[] | null;
          status: string;
          created_at: string;
          updated_at: string;
          property_id: string | null;
          user_id: string | null;
          conversation_id: string;
        };
        Insert: {
          id: string;
          from: string;
          to: string;
          message_type: string;
          content: string;
          media_url?: string | null;
          template_name?: string | null;
          template_params?: string[] | null;
          status: string;
          created_at: string;
          updated_at: string;
          property_id?: string | null;
          user_id?: string | null;
          conversation_id: string;
        };
        Update: {
          id?: string;
          from?: string;
          to?: string;
          message_type?: string;
          content?: string;
          media_url?: string | null;
          template_name?: string | null;
          template_params?: string[] | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
          property_id?: string | null;
          user_id?: string | null;
          conversation_id?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Mock implementation for development
class MockSupabase {
  from(table: string) {
    return {
      select: (columns?: string) => ({
        eq: (column: string, value: any) => ({
          single: () => Promise.resolve({ data: null, error: { code: 'PGRST116' } }),
          limit: (count: number) => Promise.resolve({ data: [], error: null }),
          order: (column: string, options?: any) => ({
            limit: (count: number) => Promise.resolve({ data: [], error: null }),
            range: (start: number, end: number) => Promise.resolve({ data: [], error: null })
          })
        }),
        gte: (column: string, value: any) => ({
          lte: (column: string, value: any) => ({
            order: (column: string, options?: any) => Promise.resolve({ data: [], error: null })
          })
        }),
        ilike: (column: string, pattern: string) => ({
          limit: (count: number) => Promise.resolve({ data: [], error: null })
        }),
        in: (column: string, values: any[]) => ({
          limit: (count: number) => Promise.resolve({ data: [], error: null })
        }),
        lte: (column: string, value: any) => Promise.resolve({ data: [], error: null }),
        order: (column: string, options?: any) => ({
          limit: (count: number) => Promise.resolve({ data: [], error: null })
        }),
        limit: (count: number) => Promise.resolve({ data: [], error: null })
      }),
      insert: (data: any[]) => ({
        select: () => ({
          single: () => Promise.resolve({ data: data[0], error: null })
        })
      }),
      update: (data: any) => ({
        eq: (column: string, value: any) => Promise.resolve({ error: null })
      }),
      upsert: (data: any[], options?: any) => Promise.resolve({ error: null })
    };
  }
}

// Use mock for development if no Supabase URL is provided
const supabaseClient = supabaseUrl.includes('your-project')
  ? new MockSupabase() as any
  : supabaseInstance;

// Export the client (override the original supabase export)
export { supabaseClient as supabase };
export default supabaseClient;
