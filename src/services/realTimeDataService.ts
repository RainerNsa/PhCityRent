import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';
import { WebSocketManager } from '@/lib/websocketManager';

// Types for real-time data
export interface AgentMetrics {
  agent_id: string;
  total_properties: number;
  active_clients: number;
  monthly_earnings: number;
  conversion_rate: number;
  response_time: number;
  client_satisfaction: number;
  deals_completed: number;
  last_updated: string;
}

export interface PropertyUpdate {
  property_id: string;
  status: 'available' | 'rented' | 'maintenance' | 'pending';
  views_count: number;
  inquiries_count: number;
  last_viewed: string;
  price_changes: Array<{
    old_price: number;
    new_price: number;
    changed_at: string;
  }>;
}

export interface PaymentAlert {
  transaction_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  amount: number;
  property_id: string;
  agent_id: string;
  tenant_id: string;
  payment_method: string;
  timestamp: string;
}

export interface DashboardMetrics {
  user_id: string;
  total_revenue: number;
  active_properties: number;
  pending_payments: number;
  new_inquiries: number;
  conversion_rate: number;
  growth_rate: number;
  last_updated: string;
}

// Event types for subscriptions
export type RealTimeEventType = 
  | 'agent_metrics'
  | 'property_updates'
  | 'payment_alerts'
  | 'dashboard_metrics'
  | 'system_notifications';

export type RealTimeCallback<T = any> = (data: T) => void;

interface Subscription {
  id: string;
  eventType: RealTimeEventType;
  callback: RealTimeCallback;
  filter?: Record<string, any>;
}

/**
 * Singleton service for managing real-time data subscriptions
 * Integrates with Supabase Realtime and WebSocket connections
 */
export class RealTimeDataService {
  private static instance: RealTimeDataService;
  private subscriptions: Map<string, Subscription> = new Map();
  private channels: Map<string, RealtimeChannel> = new Map();
  private websocketManager: WebSocketManager;
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 1000;

  private constructor() {
    this.websocketManager = WebSocketManager.getInstance();
    this.initializeConnection();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): RealTimeDataService {
    if (!RealTimeDataService.instance) {
      RealTimeDataService.instance = new RealTimeDataService();
    }
    return RealTimeDataService.instance;
  }

  /**
   * Initialize real-time connection
   */
  private async initializeConnection(): Promise<void> {
    try {
      // Initialize WebSocket manager
      await this.websocketManager.connect();
      this.isConnected = true;
      this.reconnectAttempts = 0;
      
      console.log('Real-time data service connected');
    } catch (error) {
      console.error('Failed to initialize real-time connection:', error);
      this.handleConnectionError();
    }
  }

  /**
   * Handle connection errors with exponential backoff
   */
  private handleConnectionError(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      
      console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
      
      setTimeout(() => {
        this.initializeConnection();
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
      this.isConnected = false;
    }
  }

  /**
   * Subscribe to real-time agent metrics
   */
  public subscribeToAgentMetrics(
    agentId: string, 
    callback: RealTimeCallback<AgentMetrics>
  ): string {
    const subscriptionId = `agent_metrics_${agentId}_${Date.now()}`;
    
    // Create Supabase channel for agent metrics
    const channel = supabase
      .channel(`agent_metrics_${agentId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'agent_performance_view',
          filter: `agent_id=eq.${agentId}`
        },
        (payload) => {
          console.log('Agent metrics update:', payload);
          callback(payload.new as AgentMetrics);
        }
      )
      .subscribe();

    this.channels.set(subscriptionId, channel);
    this.subscriptions.set(subscriptionId, {
      id: subscriptionId,
      eventType: 'agent_metrics',
      callback,
      filter: { agent_id: agentId }
    });

    return subscriptionId;
  }

  /**
   * Subscribe to real-time property updates
   */
  public subscribeToPropertyUpdates(
    propertyId: string,
    callback: RealTimeCallback<PropertyUpdate>
  ): string {
    const subscriptionId = `property_updates_${propertyId}_${Date.now()}`;
    
    const channel = supabase
      .channel(`property_updates_${propertyId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'properties',
          filter: `id=eq.${propertyId}`
        },
        (payload) => {
          console.log('Property update:', payload);
          callback(this.transformPropertyUpdate(payload.new));
        }
      )
      .subscribe();

    this.channels.set(subscriptionId, channel);
    this.subscriptions.set(subscriptionId, {
      id: subscriptionId,
      eventType: 'property_updates',
      callback,
      filter: { property_id: propertyId }
    });

    return subscriptionId;
  }

  /**
   * Subscribe to real-time payment status updates
   */
  public subscribeToPaymentStatus(
    transactionId: string,
    callback: RealTimeCallback<PaymentAlert>
  ): string {
    const subscriptionId = `payment_status_${transactionId}_${Date.now()}`;
    
    const channel = supabase
      .channel(`payment_status_${transactionId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'payment_transactions',
          filter: `id=eq.${transactionId}`
        },
        (payload) => {
          console.log('Payment status update:', payload);
          callback(this.transformPaymentAlert(payload.new));
        }
      )
      .subscribe();

    this.channels.set(subscriptionId, channel);
    this.subscriptions.set(subscriptionId, {
      id: subscriptionId,
      eventType: 'payment_alerts',
      callback,
      filter: { transaction_id: transactionId }
    });

    return subscriptionId;
  }

  /**
   * Subscribe to real-time dashboard metrics
   */
  public subscribeToDashboardMetrics(
    userId: string,
    callback: RealTimeCallback<DashboardMetrics>
  ): string {
    const subscriptionId = `dashboard_metrics_${userId}_${Date.now()}`;
    
    // Subscribe to multiple tables that affect dashboard metrics
    const channel = supabase
      .channel(`dashboard_metrics_${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'properties',
          filter: `landlord_id=eq.${userId}`
        },
        () => this.updateDashboardMetrics(userId, callback)
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'payment_transactions',
          filter: `user_id=eq.${userId}`
        },
        () => this.updateDashboardMetrics(userId, callback)
      )
      .subscribe();

    this.channels.set(subscriptionId, channel);
    this.subscriptions.set(subscriptionId, {
      id: subscriptionId,
      eventType: 'dashboard_metrics',
      callback,
      filter: { user_id: userId }
    });

    return subscriptionId;
  }

  /**
   * Unsubscribe from real-time updates
   */
  public unsubscribe(subscriptionId: string): void {
    const channel = this.channels.get(subscriptionId);
    if (channel) {
      supabase.removeChannel(channel);
      this.channels.delete(subscriptionId);
    }
    
    this.subscriptions.delete(subscriptionId);
    console.log(`Unsubscribed from ${subscriptionId}`);
  }

  /**
   * Unsubscribe from all subscriptions
   */
  public unsubscribeAll(): void {
    this.channels.forEach((channel) => {
      supabase.removeChannel(channel);
    });
    
    this.channels.clear();
    this.subscriptions.clear();
    console.log('Unsubscribed from all real-time updates');
  }

  /**
   * Get connection status
   */
  public getConnectionStatus(): boolean {
    return this.isConnected && this.websocketManager.isConnected();
  }

  /**
   * Get active subscriptions count
   */
  public getActiveSubscriptionsCount(): number {
    return this.subscriptions.size;
  }

  /**
   * Transform property data for updates
   */
  private transformPropertyUpdate(data: any): PropertyUpdate {
    return {
      property_id: data.id,
      status: data.is_available ? 'available' : 'rented',
      views_count: data.views_count || 0,
      inquiries_count: data.inquiries_count || 0,
      last_viewed: data.last_viewed || new Date().toISOString(),
      price_changes: data.price_history || []
    };
  }

  /**
   * Transform payment data for alerts
   */
  private transformPaymentAlert(data: any): PaymentAlert {
    return {
      transaction_id: data.id,
      status: data.status,
      amount: data.amount,
      property_id: data.property_id,
      agent_id: data.agent_id,
      tenant_id: data.user_id,
      payment_method: data.payment_method,
      timestamp: data.updated_at || new Date().toISOString()
    };
  }

  /**
   * Update dashboard metrics
   */
  private async updateDashboardMetrics(
    userId: string, 
    callback: RealTimeCallback<DashboardMetrics>
  ): Promise<void> {
    try {
      // Fetch updated metrics from database
      const { data, error } = await supabase.rpc('get_dashboard_metrics', {
        user_id: userId
      });

      if (error) throw error;

      const dashboardMetrics: DashboardMetrics = {
        user_id: userId,
        total_revenue: data.total_revenue || 0,
        active_properties: data.active_properties || 0,
        pending_payments: data.pending_payments || 0,
        new_inquiries: data.new_inquiries || 0,
        conversion_rate: data.conversion_rate || 0,
        growth_rate: data.growth_rate || 0,
        last_updated: new Date().toISOString()
      };

      callback(dashboardMetrics);
    } catch (error) {
      console.error('Failed to update dashboard metrics:', error);
    }
  }
}

// Export singleton instance
export const realTimeDataService = RealTimeDataService.getInstance();
