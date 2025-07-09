import { Database } from '@/integrations/supabase/types';

// Database types
export type AgentApplication = Database['public']['Tables']['agent_applications']['Row'];
export type AgentProfile = Database['public']['Tables']['agent_profiles']['Row'];
export type AgentCommission = Database['public']['Tables']['agent_commissions']['Row'];
export type PaymentTransaction = Database['public']['Tables']['payment_transactions']['Row'];
export type Property = Database['public']['Tables']['properties']['Row'];

// Enhanced Agent types
export interface AgentPerformanceMetrics {
  agent_id: string;
  full_name: string;
  email: string | null;
  whatsapp_number: string;
  operating_areas: string[];
  agent_status: string;
  agent_since: string;
  
  // Property metrics
  total_properties: number;
  available_properties: number;
  verified_properties: number;
  featured_properties: number;
  
  // Financial metrics
  monthly_earnings: number;
  yearly_earnings: number;
  total_earnings: number;
  
  // Client interaction metrics
  total_inquiries: number;
  monthly_inquiries: number;
  responded_inquiries: number;
  unique_clients: number;
  
  // Performance calculations
  response_rate: number;
  conversion_rate: number;
  avg_response_time_hours: number;
  
  // Property performance
  avg_property_price: number;
  highest_property_price: number;
  lowest_property_price: number;
  
  // Recent activity
  last_inquiry_date: string | null;
  last_transaction_date: string | null;
  last_property_update: string | null;
  
  // Ratings
  avg_rating: number;
  total_ratings: number;
  
  calculated_at: string;
}

export interface AgentGoal {
  id: string;
  agent_id: string;
  goal_type: 'properties' | 'earnings' | 'clients' | 'conversion_rate' | 'response_time';
  target_value: number;
  current_value: number;
  target_date: string;
  description: string;
  is_achieved: boolean;
  created_at: string;
  updated_at: string;
}

export interface ClientProfile {
  id: string;
  agent_id: string;
  name: string;
  email: string;
  phone: string;
  budget_min: number;
  budget_max: number;
  preferred_locations: string[];
  property_preferences: {
    bedrooms?: number;
    bathrooms?: number;
    property_type?: string;
    amenities?: string[];
  };
  lead_score: number;
  status: 'new' | 'contacted' | 'viewing' | 'negotiating' | 'closed' | 'lost';
  source: string;
  notes: string;
  last_contact: string | null;
  next_follow_up: string | null;
  created_at: string;
  updated_at: string;
}

export interface CommunicationHistory {
  id: string;
  client_id: string;
  agent_id: string;
  type: 'call' | 'whatsapp' | 'email' | 'meeting' | 'property_viewing';
  subject: string;
  content: string;
  direction: 'inbound' | 'outbound';
  status: 'sent' | 'delivered' | 'read' | 'responded';
  scheduled_at: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface CommissionStructure {
  id: string;
  agent_id: string;
  commission_type: 'percentage' | 'fixed' | 'tiered';
  base_rate: number;
  tiers?: {
    min_amount: number;
    max_amount: number;
    rate: number;
  }[];
  property_types?: string[];
  effective_from: string;
  effective_until: string | null;
  is_active: boolean;
  created_at: string;
}

export interface CommissionPayment {
  id: string;
  commission_id: string;
  agent_id: string;
  amount: number;
  payment_method: string;
  payment_reference: string;
  status: 'pending' | 'processing' | 'paid' | 'failed' | 'disputed';
  scheduled_date: string;
  paid_date: string | null;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface CommissionDispute {
  id: string;
  commission_id: string;
  agent_id: string;
  dispute_reason: string;
  dispute_details: string;
  status: 'open' | 'investigating' | 'resolved' | 'rejected';
  resolution_notes: string | null;
  resolved_by: string | null;
  resolved_at: string | null;
  created_at: string;
}

export interface AgentVerificationStep {
  id: string;
  agent_id: string;
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

export interface AgentActivity {
  id: string;
  agent_id: string;
  activity_type: string;
  entity_type: string | null;
  entity_id: string | null;
  description: string;
  metadata: Record<string, any> | null;
  created_at: string;
}

// Request/Response types
export interface CreateAgentProfileRequest {
  full_name: string;
  whatsapp_number: string;
  email?: string;
  operating_areas: string[];
  residential_address: string;
  is_registered_business: boolean;
}

export interface UpdateAgentProfileRequest {
  full_name?: string;
  whatsapp_number?: string;
  email?: string;
  operating_areas?: string[];
  is_active?: boolean;
}

export interface CreateClientRequest {
  name: string;
  email: string;
  phone: string;
  budget_min: number;
  budget_max: number;
  preferred_locations: string[];
  property_preferences: ClientProfile['property_preferences'];
  source: string;
  notes?: string;
}

export interface UpdateClientRequest {
  name?: string;
  email?: string;
  phone?: string;
  budget_min?: number;
  budget_max?: number;
  preferred_locations?: string[];
  property_preferences?: ClientProfile['property_preferences'];
  status?: ClientProfile['status'];
  notes?: string;
  next_follow_up?: string;
}

export interface CreateCommunicationRequest {
  client_id: string;
  type: CommunicationHistory['type'];
  subject: string;
  content: string;
  direction: CommunicationHistory['direction'];
  scheduled_at?: string;
}

export interface AgentDashboardData {
  agent: AgentProfile;
  performance: AgentPerformanceMetrics;
  goals: AgentGoal[];
  recentClients: ClientProfile[];
  recentCommunications: CommunicationHistory[];
  pendingCommissions: AgentCommission[];
  upcomingFollowUps: ClientProfile[];
  properties: Property[];
}

export interface AgentAnalytics {
  performance_trends: {
    date: string;
    earnings: number;
    properties: number;
    clients: number;
    conversion_rate: number;
  }[];
  comparison_data: {
    rank_in_area: number;
    total_agents_in_area: number;
    percentile: number;
    top_performers: {
      agent_id: string;
      name: string;
      metric_value: number;
    }[];
  };
  goal_progress: {
    goal_id: string;
    goal_type: string;
    progress_percentage: number;
    days_remaining: number;
  }[];
}

// Error types
export class AgentServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'AgentServiceError';
  }
}

// Utility types
export type AgentStatus = 'pending_review' | 'documents_reviewed' | 'referee_contacted' | 'approved' | 'rejected' | 'needs_info';
export type CommissionStatus = 'pending' | 'calculated' | 'approved' | 'paid' | 'disputed';
export type ClientStatus = 'new' | 'contacted' | 'viewing' | 'negotiating' | 'closed' | 'lost';
export type CommunicationType = 'call' | 'whatsapp' | 'email' | 'meeting' | 'property_viewing';
export type GoalType = 'properties' | 'earnings' | 'clients' | 'conversion_rate' | 'response_time';
