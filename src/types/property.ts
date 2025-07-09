import { Database } from '@/integrations/supabase/types';

// Database types
export type Property = Database['public']['Tables']['properties']['Row'];
export type PropertyInsert = Database['public']['Tables']['properties']['Insert'];
export type PropertyUpdate = Database['public']['Tables']['properties']['Update'];
export type PropertyInquiry = Database['public']['Tables']['property_inquiries']['Row'];

// Enhanced Property types
export interface PropertyWithAnalytics extends Property {
  views_count: number;
  unique_views: number;
  views_last_30_days: number;
  last_viewed: string | null;
  inquiries_count: number;
  inquiries_last_30_days: number;
  responded_inquiries: number;
  unique_inquirers: number;
  last_inquiry: string | null;
  first_inquiry: string | null;
  inquiry_conversion_rate: number;
  response_rate: number;
  price_percentile_in_location: number;
  days_on_market: number | null;
}

export interface PropertyImage {
  id: string;
  property_id: string;
  url: string;
  thumbnail_url: string;
  alt_text: string;
  order_index: number;
  file_size: number;
  file_type: string;
  width: number;
  height: number;
  is_primary: boolean;
  uploaded_at: string;
}

export interface PropertyVerificationStep {
  id: string;
  property_id: string;
  step_name: string;
  step_order: number;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'skipped';
  required: boolean;
  description: string;
  completion_data: Record<string, any> | null;
  completed_by: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface PropertyDocument {
  id: string;
  property_id: string;
  document_type: 'title_deed' | 'survey_plan' | 'building_approval' | 'tax_receipt' | 'other';
  document_name: string;
  file_url: string;
  file_size: number;
  file_type: string;
  verification_status: 'pending' | 'verified' | 'rejected';
  uploaded_by: string;
  uploaded_at: string;
  verified_by: string | null;
  verified_at: string | null;
}

export interface PropertyInspection {
  id: string;
  property_id: string;
  inspector_id: string;
  inspection_type: 'initial' | 'follow_up' | 'maintenance' | 'final';
  scheduled_date: string;
  completed_date: string | null;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  inspection_notes: string;
  quality_score: number | null;
  issues_found: string[];
  recommendations: string[];
  photos: string[];
  created_at: string;
}

export interface PropertyAnalytics {
  property_id: string;
  total_views: number;
  unique_views: number;
  view_sources: Record<string, number>;
  inquiry_rate: number;
  conversion_rate: number;
  average_time_on_page: number;
  bounce_rate: number;
  popular_times: Record<string, number>;
  demographic_data: {
    age_groups: Record<string, number>;
    locations: Record<string, number>;
    devices: Record<string, number>;
  };
  performance_score: number;
  market_position: {
    price_rank: number;
    view_rank: number;
    inquiry_rank: number;
  };
  calculated_at: string;
}

export interface SearchFilters {
  search?: string;
  location?: string;
  property_type?: string;
  min_price?: number;
  max_price?: number;
  bedrooms?: number;
  bathrooms?: number;
  min_area?: number;
  max_area?: number;
  amenities?: string[];
  is_verified?: boolean;
  is_featured?: boolean;
  available_from?: string;
  sort_by?: 'price_asc' | 'price_desc' | 'date_desc' | 'date_asc' | 'relevance';
  radius?: number; // for geolocation search
  lat?: number;
  lng?: number;
}

export interface SavedSearch {
  id: string;
  user_id: string;
  name: string;
  filters: SearchFilters;
  alert_frequency: 'immediate' | 'daily' | 'weekly' | 'never';
  is_active: boolean;
  last_run: string | null;
  results_count: number;
  created_at: string;
  updated_at: string;
}

export interface PropertyAlert {
  id: string;
  user_id: string;
  property_id: string;
  alert_type: 'price_drop' | 'new_match' | 'back_available' | 'status_change';
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface VirtualTour {
  id: string;
  property_id: string;
  tour_type: '360_photos' | 'video_walkthrough' | 'interactive_3d';
  tour_url: string;
  thumbnail_url: string;
  duration_minutes: number | null;
  view_count: number;
  is_active: boolean;
  created_at: string;
}

// Request/Response types
export interface CreatePropertyRequest {
  title: string;
  description: string;
  location: string;
  price_per_year: number;
  bedrooms: number;
  bathrooms: number;
  area_sqft?: number;
  property_type: string;
  amenities: string[];
  contact_whatsapp?: string;
  contact_email?: string;
  agent_id?: string;
  landlord_id?: string;
}

export interface UpdatePropertyRequest {
  title?: string;
  description?: string;
  location?: string;
  price_per_year?: number;
  bedrooms?: number;
  bathrooms?: number;
  area_sqft?: number;
  property_type?: string;
  amenities?: string[];
  contact_whatsapp?: string;
  contact_email?: string;
  is_available?: boolean;
  featured?: boolean;
}

export interface ImageUploadRequest {
  property_id: string;
  files: File[];
  alt_texts?: string[];
  is_primary_index?: number;
}

export interface ImageUploadProgress {
  file_name: string;
  progress: number;
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
  url?: string;
}

export interface PropertySearchResult {
  properties: PropertyWithAnalytics[];
  total_count: number;
  page: number;
  page_size: number;
  filters_applied: SearchFilters;
  search_metadata: {
    search_time_ms: number;
    suggestions: string[];
    facets: Record<string, Record<string, number>>;
  };
}

export interface PropertyMarketData {
  location: string;
  property_type: string;
  average_price: number;
  median_price: number;
  price_per_sqft: number;
  total_properties: number;
  available_properties: number;
  average_days_on_market: number;
  price_trend: 'rising' | 'falling' | 'stable';
  demand_score: number;
  competition_level: 'low' | 'medium' | 'high';
}

export interface PropertyRecommendation {
  property: PropertyWithAnalytics;
  score: number;
  reasons: string[];
  match_percentage: number;
}

// Error types
export class PropertyServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'PropertyServiceError';
  }
}

// Utility types
export type PropertyStatus = 'available' | 'rented' | 'maintenance' | 'pending_approval';
export type PropertyType = 'apartment' | 'house' | 'duplex' | 'bungalow' | 'flat' | 'studio' | 'penthouse';
export type VerificationStatus = 'pending' | 'in_progress' | 'verified' | 'rejected';
export type InspectionStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
export type DocumentType = 'title_deed' | 'survey_plan' | 'building_approval' | 'tax_receipt' | 'other';

// Constants
export const PROPERTY_TYPES: PropertyType[] = [
  'apartment', 'house', 'duplex', 'bungalow', 'flat', 'studio', 'penthouse'
];

export const AMENITIES_LIST = [
  'Parking', 'Generator', 'Security', 'Water', 'Internet', 'Air Conditioning',
  'Swimming Pool', 'Gym', 'Elevator', 'Balcony', 'Garden', 'Garage',
  'Furnished', 'Kitchen Appliances', 'Laundry', 'Storage', 'Pet Friendly',
  'Wheelchair Accessible', 'CCTV', 'Intercom', 'Backup Power', 'Borehole'
];

export const LOCATIONS_PORT_HARCOURT = [
  'Government Residential Area (GRA)',
  'Old GRA',
  'New GRA',
  'Trans Amadi',
  'Woji',
  'Eagle Island',
  'D-Line',
  'Aba Road',
  'East West Road',
  'Ada George',
  'Eliozu',
  'Choba',
  'Alakahia',
  'Port Harcourt Township',
  'Mile 1',
  'Mile 2',
  'Mile 3',
  'Rumuola',
  'Rumuokwuta',
  'Rumuigbo'
];
