import { supabase } from '@/integrations/supabase/client';
import {
  AgentProfile,
  AgentApplication,
  AgentPerformanceMetrics,
  AgentGoal,
  ClientProfile,
  CommunicationHistory,
  CommissionStructure,
  CommissionPayment,
  CommissionDispute,
  AgentVerificationStep,
  AgentActivity,
  CreateAgentProfileRequest,
  UpdateAgentProfileRequest,
  CreateClientRequest,
  UpdateClientRequest,
  CreateCommunicationRequest,
  AgentDashboardData,
  AgentAnalytics,
  AgentServiceError
} from '@/types/agent';

/**
 * Comprehensive Agent Management Service
 * Handles all agent-related operations including CRUD, performance tracking,
 * commission management, and client relationship management
 */
export class AgentService {
  private static instance: AgentService;

  public static getInstance(): AgentService {
    if (!AgentService.instance) {
      AgentService.instance = new AgentService();
    }
    return AgentService.instance;
  }

  // =====================================================
  // AGENT PROFILE MANAGEMENT
  // =====================================================

  /**
   * Get agent profile by agent ID
   */
  async getAgentProfile(agentId: string): Promise<AgentProfile> {
    try {
      const { data, error } = await supabase
        .from('agent_profiles')
        .select('*')
        .eq('agent_id', agentId)
        .single();

      if (error) throw new AgentServiceError('Failed to fetch agent profile', 'FETCH_ERROR', error);
      if (!data) throw new AgentServiceError('Agent profile not found', 'NOT_FOUND');

      return data;
    } catch (error) {
      if (error instanceof AgentServiceError) throw error;
      throw new AgentServiceError('Unexpected error fetching agent profile', 'UNKNOWN_ERROR', error);
    }
  }

  /**
   * Get agent application by agent ID
   */
  async getAgentApplication(agentId: string): Promise<AgentApplication> {
    try {
      const { data, error } = await supabase
        .from('agent_applications')
        .select('*')
        .eq('agent_id', agentId)
        .single();

      if (error) throw new AgentServiceError('Failed to fetch agent application', 'FETCH_ERROR', error);
      if (!data) throw new AgentServiceError('Agent application not found', 'NOT_FOUND');

      return data;
    } catch (error) {
      if (error instanceof AgentServiceError) throw error;
      throw new AgentServiceError('Unexpected error fetching agent application', 'UNKNOWN_ERROR', error);
    }
  }

  /**
   * Update agent profile
   */
  async updateAgentProfile(agentId: string, updates: UpdateAgentProfileRequest): Promise<AgentProfile> {
    try {
      const { data, error } = await supabase
        .from('agent_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('agent_id', agentId)
        .select()
        .single();

      if (error) throw new AgentServiceError('Failed to update agent profile', 'UPDATE_ERROR', error);
      if (!data) throw new AgentServiceError('Agent profile not found', 'NOT_FOUND');

      // Log activity
      await this.logAgentActivity(agentId, 'profile_updated', 'agent_profile', data.id, 'Agent profile updated', updates);

      return data;
    } catch (error) {
      if (error instanceof AgentServiceError) throw error;
      throw new AgentServiceError('Unexpected error updating agent profile', 'UNKNOWN_ERROR', error);
    }
  }

  /**
   * Get all agents with optional filtering
   */
  async getAgents(filters?: {
    status?: string;
    operating_area?: string;
    is_active?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<{ agents: AgentProfile[]; total: number }> {
    try {
      let query = supabase.from('agent_profiles').select('*', { count: 'exact' });

      if (filters?.is_active !== undefined) {
        query = query.eq('is_active', filters.is_active);
      }

      if (filters?.operating_area) {
        query = query.contains('operating_areas', [filters.operating_area]);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error, count } = await query;

      if (error) throw new AgentServiceError('Failed to fetch agents', 'FETCH_ERROR', error);

      return {
        agents: data || [],
        total: count || 0
      };
    } catch (error) {
      if (error instanceof AgentServiceError) throw error;
      throw new AgentServiceError('Unexpected error fetching agents', 'UNKNOWN_ERROR', error);
    }
  }

  // =====================================================
  // PERFORMANCE METRICS
  // =====================================================

  /**
   * Get agent performance metrics
   */
  async getAgentPerformance(agentId: string): Promise<AgentPerformanceMetrics> {
    try {
      const { data, error } = await supabase
        .from('agent_performance_analytics')
        .select('*')
        .eq('agent_id', agentId)
        .single();

      if (error) throw new AgentServiceError('Failed to fetch agent performance', 'FETCH_ERROR', error);
      if (!data) throw new AgentServiceError('Agent performance data not found', 'NOT_FOUND');

      return data;
    } catch (error) {
      if (error instanceof AgentServiceError) throw error;
      throw new AgentServiceError('Unexpected error fetching agent performance', 'UNKNOWN_ERROR', error);
    }
  }

  /**
   * Get performance history for an agent
   */
  async getPerformanceHistory(agentId: string, days: number = 30): Promise<AgentPerformanceMetrics[]> {
    try {
      const { data, error } = await supabase
        .from('agent_performance_history')
        .select('*')
        .eq('agent_id', agentId)
        .gte('performance_date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .order('performance_date', { ascending: false });

      if (error) throw new AgentServiceError('Failed to fetch performance history', 'FETCH_ERROR', error);

      return data || [];
    } catch (error) {
      if (error instanceof AgentServiceError) throw error;
      throw new AgentServiceError('Unexpected error fetching performance history', 'UNKNOWN_ERROR', error);
    }
  }

  /**
   * Calculate real-time performance metrics
   */
  async calculateRealTimeMetrics(agentId: string): Promise<AgentPerformanceMetrics> {
    try {
      const { data, error } = await supabase.rpc('get_agent_performance', {
        agent_id: agentId
      });

      if (error) throw new AgentServiceError('Failed to calculate performance metrics', 'CALCULATION_ERROR', error);
      if (!data) throw new AgentServiceError('No performance data available', 'NOT_FOUND');

      return data;
    } catch (error) {
      if (error instanceof AgentServiceError) throw error;
      throw new AgentServiceError('Unexpected error calculating metrics', 'UNKNOWN_ERROR', error);
    }
  }

  // =====================================================
  // GOAL MANAGEMENT
  // =====================================================

  /**
   * Get agent goals
   */
  async getAgentGoals(agentId: string): Promise<AgentGoal[]> {
    try {
      const { data, error } = await supabase
        .from('agent_goals')
        .select('*')
        .eq('agent_id', agentId)
        .order('created_at', { ascending: false });

      if (error) throw new AgentServiceError('Failed to fetch agent goals', 'FETCH_ERROR', error);

      return data || [];
    } catch (error) {
      if (error instanceof AgentServiceError) throw error;
      throw new AgentServiceError('Unexpected error fetching agent goals', 'UNKNOWN_ERROR', error);
    }
  }

  /**
   * Create agent goal
   */
  async createAgentGoal(agentId: string, goal: Omit<AgentGoal, 'id' | 'agent_id' | 'created_at' | 'updated_at'>): Promise<AgentGoal> {
    try {
      const { data, error } = await supabase
        .from('agent_goals')
        .insert({
          agent_id: agentId,
          ...goal
        })
        .select()
        .single();

      if (error) throw new AgentServiceError('Failed to create agent goal', 'CREATE_ERROR', error);

      // Log activity
      await this.logAgentActivity(agentId, 'goal_created', 'agent_goal', data.id, `Goal created: ${goal.description}`);

      return data;
    } catch (error) {
      if (error instanceof AgentServiceError) throw error;
      throw new AgentServiceError('Unexpected error creating agent goal', 'UNKNOWN_ERROR', error);
    }
  }

  /**
   * Update goal progress
   */
  async updateGoalProgress(goalId: string, currentValue: number): Promise<AgentGoal> {
    try {
      const { data, error } = await supabase
        .from('agent_goals')
        .update({
          current_value: currentValue,
          is_achieved: currentValue >= (await this.getGoalTargetValue(goalId)),
          updated_at: new Date().toISOString()
        })
        .eq('id', goalId)
        .select()
        .single();

      if (error) throw new AgentServiceError('Failed to update goal progress', 'UPDATE_ERROR', error);

      return data;
    } catch (error) {
      if (error instanceof AgentServiceError) throw error;
      throw new AgentServiceError('Unexpected error updating goal progress', 'UNKNOWN_ERROR', error);
    }
  }

  /**
   * Helper to get goal target value
   */
  private async getGoalTargetValue(goalId: string): Promise<number> {
    const { data, error } = await supabase
      .from('agent_goals')
      .select('target_value')
      .eq('id', goalId)
      .single();

    if (error || !data) return 0;
    return data.target_value;
  }

  // =====================================================
  // COMMISSION MANAGEMENT
  // =====================================================

  /**
   * Get agent commissions
   */
  async getAgentCommissions(agentId: string, filters?: {
    status?: string;
    from_date?: string;
    to_date?: string;
    limit?: number;
  }): Promise<any[]> {
    try {
      let query = supabase
        .from('agent_commissions')
        .select(`
          *,
          property:properties(title, location, price_per_year),
          transaction:payment_transactions(amount, status, created_at)
        `)
        .eq('agent_id', agentId);

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.from_date) {
        query = query.gte('created_at', filters.from_date);
      }

      if (filters?.to_date) {
        query = query.lte('created_at', filters.to_date);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw new AgentServiceError('Failed to fetch agent commissions', 'FETCH_ERROR', error);

      return data || [];
    } catch (error) {
      if (error instanceof AgentServiceError) throw error;
      throw new AgentServiceError('Unexpected error fetching agent commissions', 'UNKNOWN_ERROR', error);
    }
  }

  /**
   * Calculate commission for a transaction
   */
  async calculateCommission(transactionId: string, agentId: string): Promise<number> {
    try {
      // Get transaction details
      const { data: transaction, error: transactionError } = await supabase
        .from('payment_transactions')
        .select('amount, property_id')
        .eq('id', transactionId)
        .single();

      if (transactionError) throw new AgentServiceError('Failed to fetch transaction', 'FETCH_ERROR', transactionError);

      // Get commission structure for agent
      const { data: commissionStructure, error: structureError } = await supabase
        .from('commission_structures')
        .select('*')
        .eq('agent_id', agentId)
        .eq('is_active', true)
        .single();

      if (structureError || !commissionStructure) {
        // Use default 5% commission if no structure found
        return transaction.amount * 0.05;
      }

      // Calculate based on commission structure
      if (commissionStructure.commission_type === 'percentage') {
        return transaction.amount * (commissionStructure.base_rate / 100);
      } else if (commissionStructure.commission_type === 'fixed') {
        return commissionStructure.base_rate;
      } else if (commissionStructure.commission_type === 'tiered' && commissionStructure.tiers) {
        // Find appropriate tier
        const tier = commissionStructure.tiers.find((t: any) =>
          transaction.amount >= t.min_amount &&
          (t.max_amount === null || transaction.amount <= t.max_amount)
        );

        if (tier) {
          return transaction.amount * (tier.rate / 100);
        }
      }

      // Fallback to base rate
      return transaction.amount * (commissionStructure.base_rate / 100);
    } catch (error) {
      if (error instanceof AgentServiceError) throw error;
      throw new AgentServiceError('Unexpected error calculating commission', 'UNKNOWN_ERROR', error);
    }
  }

  /**
   * Create commission record
   */
  async createCommissionRecord(data: {
    agent_id: string;
    property_id: string;
    transaction_id: string;
    commission_amount: number;
    commission_rate: number;
  }): Promise<any> {
    try {
      const { data: commission, error } = await supabase
        .from('agent_commissions')
        .insert({
          ...data,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw new AgentServiceError('Failed to create commission record', 'CREATE_ERROR', error);

      // Log activity
      await this.logAgentActivity(
        data.agent_id,
        'commission_created',
        'commission',
        commission.id,
        `Commission created: ₦${data.commission_amount.toLocaleString()}`
      );

      return commission;
    } catch (error) {
      if (error instanceof AgentServiceError) throw error;
      throw new AgentServiceError('Unexpected error creating commission record', 'UNKNOWN_ERROR', error);
    }
  }

  /**
   * Update commission status
   */
  async updateCommissionStatus(commissionId: string, status: string, notes?: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('agent_commissions')
        .update({
          status,
          notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', commissionId)
        .select()
        .single();

      if (error) throw new AgentServiceError('Failed to update commission status', 'UPDATE_ERROR', error);

      // Log activity
      await this.logAgentActivity(
        data.agent_id,
        'commission_status_updated',
        'commission',
        commissionId,
        `Commission status updated to: ${status}`
      );

      return data;
    } catch (error) {
      if (error instanceof AgentServiceError) throw error;
      throw new AgentServiceError('Unexpected error updating commission status', 'UNKNOWN_ERROR', error);
    }
  }

  /**
   * Get commission summary for agent
   */
  async getCommissionSummary(agentId: string, period: 'month' | 'quarter' | 'year' = 'month'): Promise<{
    total_earned: number;
    total_pending: number;
    total_paid: number;
    commission_count: number;
    avg_commission: number;
  }> {
    try {
      const { data, error } = await supabase.rpc('get_commission_summary', {
        agent_id: agentId,
        period_type: period
      });

      if (error) throw new AgentServiceError('Failed to fetch commission summary', 'FETCH_ERROR', error);

      return data || {
        total_earned: 0,
        total_pending: 0,
        total_paid: 0,
        commission_count: 0,
        avg_commission: 0
      };
    } catch (error) {
      if (error instanceof AgentServiceError) throw error;
      throw new AgentServiceError('Unexpected error fetching commission summary', 'UNKNOWN_ERROR', error);
    }
  }

  // =====================================================
  // CLIENT MANAGEMENT
  // =====================================================

  /**
   * Get agent clients
   */
  async getAgentClients(agentId: string, filters?: {
    status?: string;
    lead_score_min?: number;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ clients: ClientProfile[]; total: number }> {
    try {
      let query = supabase
        .from('agent_clients')
        .select('*', { count: 'exact' })
        .eq('agent_id', agentId);

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.lead_score_min) {
        query = query.gte('lead_score', filters.lead_score_min);
      }

      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error, count } = await query;

      if (error) throw new AgentServiceError('Failed to fetch agent clients', 'FETCH_ERROR', error);

      return {
        clients: data || [],
        total: count || 0
      };
    } catch (error) {
      if (error instanceof AgentServiceError) throw error;
      throw new AgentServiceError('Unexpected error fetching agent clients', 'UNKNOWN_ERROR', error);
    }
  }

  /**
   * Create new client
   */
  async createClient(agentId: string, clientData: CreateClientRequest): Promise<ClientProfile> {
    try {
      // Calculate initial lead score
      const leadScore = this.calculateLeadScore(clientData);

      const { data, error } = await supabase
        .from('agent_clients')
        .insert({
          agent_id: agentId,
          ...clientData,
          lead_score: leadScore,
          status: 'new'
        })
        .select()
        .single();

      if (error) throw new AgentServiceError('Failed to create client', 'CREATE_ERROR', error);

      // Log activity
      await this.logAgentActivity(
        agentId,
        'client_created',
        'client',
        data.id,
        `New client added: ${clientData.name}`
      );

      return data;
    } catch (error) {
      if (error instanceof AgentServiceError) throw error;
      throw new AgentServiceError('Unexpected error creating client', 'UNKNOWN_ERROR', error);
    }
  }

  /**
   * Update client
   */
  async updateClient(clientId: string, updates: UpdateClientRequest): Promise<ClientProfile> {
    try {
      const { data, error } = await supabase
        .from('agent_clients')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', clientId)
        .select()
        .single();

      if (error) throw new AgentServiceError('Failed to update client', 'UPDATE_ERROR', error);

      // Log activity
      await this.logAgentActivity(
        data.agent_id,
        'client_updated',
        'client',
        clientId,
        `Client updated: ${data.name}`
      );

      return data;
    } catch (error) {
      if (error instanceof AgentServiceError) throw error;
      throw new AgentServiceError('Unexpected error updating client', 'UNKNOWN_ERROR', error);
    }
  }

  /**
   * Calculate lead score based on client data
   */
  private calculateLeadScore(clientData: CreateClientRequest): number {
    let score = 50; // Base score

    // Budget range scoring
    const budgetRange = clientData.budget_max - clientData.budget_min;
    if (budgetRange < 500000) score += 20; // Specific budget = higher intent
    else if (budgetRange < 1000000) score += 15;
    else score += 10;

    // Source scoring
    if (clientData.source === 'referral') score += 25;
    else if (clientData.source === 'website') score += 15;
    else if (clientData.source === 'social_media') score += 10;

    // Preferences specificity
    const preferences = clientData.property_preferences;
    if (preferences.bedrooms) score += 5;
    if (preferences.bathrooms) score += 5;
    if (preferences.property_type) score += 5;
    if (preferences.amenities && preferences.amenities.length > 0) score += 10;

    // Location specificity
    if (clientData.preferred_locations.length === 1) score += 15;
    else if (clientData.preferred_locations.length <= 3) score += 10;

    return Math.min(100, Math.max(0, score));
  }

  /**
   * Get client communication history
   */
  async getClientCommunications(clientId: string): Promise<CommunicationHistory[]> {
    try {
      const { data, error } = await supabase
        .from('client_communications')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

      if (error) throw new AgentServiceError('Failed to fetch client communications', 'FETCH_ERROR', error);

      return data || [];
    } catch (error) {
      if (error instanceof AgentServiceError) throw error;
      throw new AgentServiceError('Unexpected error fetching client communications', 'UNKNOWN_ERROR', error);
    }
  }

  /**
   * Create communication record
   */
  async createCommunication(agentId: string, communication: CreateCommunicationRequest): Promise<CommunicationHistory> {
    try {
      const { data, error } = await supabase
        .from('client_communications')
        .insert({
          agent_id: agentId,
          ...communication,
          status: 'sent'
        })
        .select()
        .single();

      if (error) throw new AgentServiceError('Failed to create communication record', 'CREATE_ERROR', error);

      // Update client last contact
      await supabase
        .from('agent_clients')
        .update({ last_contact: new Date().toISOString() })
        .eq('id', communication.client_id);

      // Log activity
      await this.logAgentActivity(
        agentId,
        'communication_created',
        'communication',
        data.id,
        `${communication.type} communication: ${communication.subject}`
      );

      return data;
    } catch (error) {
      if (error instanceof AgentServiceError) throw error;
      throw new AgentServiceError('Unexpected error creating communication record', 'UNKNOWN_ERROR', error);
    }
  }

  // =====================================================
  // VERIFICATION WORKFLOW
  // =====================================================

  /**
   * Get agent verification steps
   */
  async getVerificationSteps(agentId: string): Promise<AgentVerificationStep[]> {
    try {
      const { data, error } = await supabase
        .from('agent_verification_steps')
        .select('*')
        .eq('agent_id', agentId)
        .order('step_order', { ascending: true });

      if (error) throw new AgentServiceError('Failed to fetch verification steps', 'FETCH_ERROR', error);

      return data || [];
    } catch (error) {
      if (error instanceof AgentServiceError) throw error;
      throw new AgentServiceError('Unexpected error fetching verification steps', 'UNKNOWN_ERROR', error);
    }
  }

  /**
   * Update verification step status
   */
  async updateVerificationStep(stepId: string, status: string, completionData?: any): Promise<AgentVerificationStep> {
    try {
      const { data, error } = await supabase
        .from('agent_verification_steps')
        .update({
          status,
          completion_data: completionData,
          completed_at: status === 'completed' ? new Date().toISOString() : null,
          completed_by: status === 'completed' ? (await supabase.auth.getUser()).data.user?.id : null
        })
        .eq('id', stepId)
        .select()
        .single();

      if (error) throw new AgentServiceError('Failed to update verification step', 'UPDATE_ERROR', error);

      return data;
    } catch (error) {
      if (error instanceof AgentServiceError) throw error;
      throw new AgentServiceError('Unexpected error updating verification step', 'UNKNOWN_ERROR', error);
    }
  }

  /**
   * Get verification progress
   */
  async getVerificationProgress(agentId: string): Promise<{
    total_steps: number;
    completed_steps: number;
    progress_percentage: number;
    current_step: AgentVerificationStep | null;
  }> {
    try {
      const steps = await this.getVerificationSteps(agentId);
      const completedSteps = steps.filter(step => step.status === 'completed');
      const currentStep = steps.find(step => step.status === 'in_progress') ||
                         steps.find(step => step.status === 'pending');

      return {
        total_steps: steps.length,
        completed_steps: completedSteps.length,
        progress_percentage: steps.length > 0 ? (completedSteps.length / steps.length) * 100 : 0,
        current_step: currentStep || null
      };
    } catch (error) {
      if (error instanceof AgentServiceError) throw error;
      throw new AgentServiceError('Unexpected error calculating verification progress', 'UNKNOWN_ERROR', error);
    }
  }

  // =====================================================
  // DASHBOARD AND ANALYTICS
  // =====================================================

  /**
   * Get comprehensive agent dashboard data
   */
  async getAgentDashboard(agentId: string): Promise<AgentDashboardData> {
    try {
      const [
        agent,
        performance,
        goals,
        recentClients,
        recentCommunications,
        pendingCommissions,
        properties
      ] = await Promise.all([
        this.getAgentProfile(agentId),
        this.getAgentPerformance(agentId),
        this.getAgentGoals(agentId),
        this.getAgentClients(agentId, { limit: 5 }),
        this.getRecentCommunications(agentId, 10),
        this.getAgentCommissions(agentId, { status: 'pending', limit: 5 }),
        this.getAgentProperties(agentId, { limit: 10 })
      ]);

      // Get upcoming follow-ups
      const upcomingFollowUps = await this.getUpcomingFollowUps(agentId);

      return {
        agent,
        performance,
        goals,
        recentClients: recentClients.clients,
        recentCommunications,
        pendingCommissions,
        upcomingFollowUps,
        properties
      };
    } catch (error) {
      if (error instanceof AgentServiceError) throw error;
      throw new AgentServiceError('Unexpected error fetching agent dashboard', 'UNKNOWN_ERROR', error);
    }
  }

  /**
   * Get agent analytics
   */
  async getAgentAnalytics(agentId: string): Promise<AgentAnalytics> {
    try {
      const { data, error } = await supabase.rpc('get_agent_analytics', {
        agent_id: agentId
      });

      if (error) throw new AgentServiceError('Failed to fetch agent analytics', 'FETCH_ERROR', error);

      return data || {
        performance_trends: [],
        comparison_data: {
          rank_in_area: 0,
          total_agents_in_area: 0,
          percentile: 0,
          top_performers: []
        },
        goal_progress: []
      };
    } catch (error) {
      if (error instanceof AgentServiceError) throw error;
      throw new AgentServiceError('Unexpected error fetching agent analytics', 'UNKNOWN_ERROR', error);
    }
  }

  // =====================================================
  // UTILITY METHODS
  // =====================================================

  /**
   * Log agent activity
   */
  private async logAgentActivity(
    agentId: string,
    activityType: string,
    entityType?: string,
    entityId?: string,
    description?: string,
    metadata?: any
  ): Promise<void> {
    try {
      await supabase.from('agent_activities').insert({
        agent_id: agentId,
        activity_type: activityType,
        entity_type: entityType,
        entity_id: entityId,
        description: description || activityType,
        metadata
      });
    } catch (error) {
      // Don't throw errors for activity logging
      console.error('Failed to log agent activity:', error);
    }
  }

  /**
   * Get recent communications
   */
  private async getRecentCommunications(agentId: string, limit: number): Promise<CommunicationHistory[]> {
    const { data, error } = await supabase
      .from('client_communications')
      .select(`
        *,
        client:agent_clients(name, email)
      `)
      .eq('agent_id', agentId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw new AgentServiceError('Failed to fetch recent communications', 'FETCH_ERROR', error);
    return data || [];
  }

  /**
   * Get upcoming follow-ups
   */
  private async getUpcomingFollowUps(agentId: string): Promise<ClientProfile[]> {
    const { data, error } = await supabase
      .from('agent_clients')
      .select('*')
      .eq('agent_id', agentId)
      .not('next_follow_up', 'is', null)
      .gte('next_follow_up', new Date().toISOString())
      .order('next_follow_up', { ascending: true })
      .limit(10);

    if (error) throw new AgentServiceError('Failed to fetch upcoming follow-ups', 'FETCH_ERROR', error);
    return data || [];
  }

  /**
   * Get agent properties
   */
  private async getAgentProperties(agentId: string, filters?: { limit?: number }): Promise<Property[]> {
    let query = supabase
      .from('properties')
      .select('*')
      .eq('agent_id', agentId);

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) throw new AgentServiceError('Failed to fetch agent properties', 'FETCH_ERROR', error);
    return data || [];
  }
}

// Export singleton instance
export const agentService = AgentService.getInstance();
