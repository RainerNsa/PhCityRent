import { useState, useEffect, useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { 
  realTimeDataService, 
  AgentMetrics, 
  PropertyUpdate, 
  PaymentAlert, 
  DashboardMetrics 
} from '@/services/realTimeDataService';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook for real-time agent metrics
 */
export const useRealTimeAgentMetrics = (agentId: string | null) => {
  const [metrics, setMetrics] = useState<AgentMetrics | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const subscriptionRef = useRef<string | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleMetricsUpdate = useCallback((newMetrics: AgentMetrics) => {
    setMetrics(newMetrics);
    setError(null);
    
    // Invalidate related queries
    queryClient.invalidateQueries(['agent-performance', agentId]);
    queryClient.invalidateQueries(['agent-dashboard', agentId]);
    
    // Show toast notification for significant changes
    if (metrics && newMetrics.deals_completed > metrics.deals_completed) {
      toast({
        title: "New Deal Completed! 🎉",
        description: `Congratulations! You've completed ${newMetrics.deals_completed} deals.`,
        duration: 5000,
      });
    }
  }, [metrics, agentId, queryClient, toast]);

  useEffect(() => {
    if (!agentId) {
      setMetrics(null);
      setIsConnected(false);
      return;
    }

    try {
      // Subscribe to real-time updates
      const subscriptionId = realTimeDataService.subscribeToAgentMetrics(
        agentId,
        handleMetricsUpdate
      );
      
      subscriptionRef.current = subscriptionId;
      setIsConnected(realTimeDataService.getConnectionStatus());
      setError(null);

      // Cleanup function
      return () => {
        if (subscriptionRef.current) {
          realTimeDataService.unsubscribe(subscriptionRef.current);
          subscriptionRef.current = null;
        }
      };
    } catch (err) {
      setError(err as Error);
      setIsConnected(false);
    }
  }, [agentId, handleMetricsUpdate]);

  // Monitor connection status
  useEffect(() => {
    const interval = setInterval(() => {
      setIsConnected(realTimeDataService.getConnectionStatus());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return {
    metrics,
    isConnected,
    error,
    refresh: () => {
      if (agentId && subscriptionRef.current) {
        realTimeDataService.unsubscribe(subscriptionRef.current);
        const newSubscriptionId = realTimeDataService.subscribeToAgentMetrics(
          agentId,
          handleMetricsUpdate
        );
        subscriptionRef.current = newSubscriptionId;
      }
    }
  };
};

/**
 * Hook for real-time property updates
 */
export const useRealTimePropertyUpdates = (propertyId: string | null) => {
  const [propertyUpdate, setPropertyUpdate] = useState<PropertyUpdate | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const subscriptionRef = useRef<string | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handlePropertyUpdate = useCallback((update: PropertyUpdate) => {
    setPropertyUpdate(update);
    setError(null);
    
    // Invalidate related queries
    queryClient.invalidateQueries(['property', propertyId]);
    queryClient.invalidateQueries(['properties']);
    
    // Show notifications for important updates
    if (update.status === 'rented') {
      toast({
        title: "Property Rented! 🏠",
        description: "Your property has been successfully rented.",
        duration: 5000,
      });
    } else if (update.inquiries_count > (propertyUpdate?.inquiries_count || 0)) {
      toast({
        title: "New Inquiry! 📞",
        description: "Someone is interested in your property.",
        duration: 3000,
      });
    }
  }, [propertyUpdate, propertyId, queryClient, toast]);

  useEffect(() => {
    if (!propertyId) {
      setPropertyUpdate(null);
      setIsConnected(false);
      return;
    }

    try {
      const subscriptionId = realTimeDataService.subscribeToPropertyUpdates(
        propertyId,
        handlePropertyUpdate
      );
      
      subscriptionRef.current = subscriptionId;
      setIsConnected(realTimeDataService.getConnectionStatus());
      setError(null);

      return () => {
        if (subscriptionRef.current) {
          realTimeDataService.unsubscribe(subscriptionRef.current);
          subscriptionRef.current = null;
        }
      };
    } catch (err) {
      setError(err as Error);
      setIsConnected(false);
    }
  }, [propertyId, handlePropertyUpdate]);

  return {
    propertyUpdate,
    isConnected,
    error,
    refresh: () => {
      if (propertyId && subscriptionRef.current) {
        realTimeDataService.unsubscribe(subscriptionRef.current);
        const newSubscriptionId = realTimeDataService.subscribeToPropertyUpdates(
          propertyId,
          handlePropertyUpdate
        );
        subscriptionRef.current = newSubscriptionId;
      }
    }
  };
};

/**
 * Hook for real-time payment status updates
 */
export const useRealTimePaymentStatus = (transactionId: string | null) => {
  const [paymentAlert, setPaymentAlert] = useState<PaymentAlert | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const subscriptionRef = useRef<string | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handlePaymentUpdate = useCallback((alert: PaymentAlert) => {
    setPaymentAlert(alert);
    setError(null);
    
    // Invalidate related queries
    queryClient.invalidateQueries(['payment-status', transactionId]);
    queryClient.invalidateQueries(['transactions']);
    queryClient.invalidateQueries(['commissions']);
    
    // Show status-specific notifications
    switch (alert.status) {
      case 'completed':
        toast({
          title: "Payment Successful! ✅",
          description: `Payment of ₦${alert.amount.toLocaleString()} has been completed.`,
          duration: 5000,
        });
        break;
      case 'failed':
        toast({
          title: "Payment Failed ❌",
          description: "The payment could not be processed. Please try again.",
          variant: "destructive",
          duration: 5000,
        });
        break;
      case 'processing':
        toast({
          title: "Payment Processing ⏳",
          description: "Your payment is being processed...",
          duration: 3000,
        });
        break;
    }
  }, [transactionId, queryClient, toast]);

  useEffect(() => {
    if (!transactionId) {
      setPaymentAlert(null);
      setIsConnected(false);
      return;
    }

    try {
      const subscriptionId = realTimeDataService.subscribeToPaymentStatus(
        transactionId,
        handlePaymentUpdate
      );
      
      subscriptionRef.current = subscriptionId;
      setIsConnected(realTimeDataService.getConnectionStatus());
      setError(null);

      return () => {
        if (subscriptionRef.current) {
          realTimeDataService.unsubscribe(subscriptionRef.current);
          subscriptionRef.current = null;
        }
      };
    } catch (err) {
      setError(err as Error);
      setIsConnected(false);
    }
  }, [transactionId, handlePaymentUpdate]);

  return {
    paymentAlert,
    isConnected,
    error,
    refresh: () => {
      if (transactionId && subscriptionRef.current) {
        realTimeDataService.unsubscribe(subscriptionRef.current);
        const newSubscriptionId = realTimeDataService.subscribeToPaymentStatus(
          transactionId,
          handlePaymentUpdate
        );
        subscriptionRef.current = newSubscriptionId;
      }
    }
  };
};

/**
 * Hook for real-time dashboard metrics
 */
export const useRealTimeDashboard = (userId: string | null) => {
  const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetrics | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const subscriptionRef = useRef<string | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleDashboardUpdate = useCallback((metrics: DashboardMetrics) => {
    const previousMetrics = dashboardMetrics;
    setDashboardMetrics(metrics);
    setError(null);
    
    // Invalidate dashboard-related queries
    queryClient.invalidateQueries(['dashboard-metrics', userId]);
    queryClient.invalidateQueries(['user-analytics', userId]);
    
    // Show notifications for significant changes
    if (previousMetrics) {
      if (metrics.new_inquiries > previousMetrics.new_inquiries) {
        toast({
          title: "New Inquiry! 📧",
          description: `You have ${metrics.new_inquiries} new inquiries.`,
          duration: 3000,
        });
      }
      
      if (metrics.total_revenue > previousMetrics.total_revenue) {
        const increase = metrics.total_revenue - previousMetrics.total_revenue;
        toast({
          title: "Revenue Increase! 💰",
          description: `Your revenue increased by ₦${increase.toLocaleString()}.`,
          duration: 5000,
        });
      }
    }
  }, [dashboardMetrics, userId, queryClient, toast]);

  useEffect(() => {
    if (!userId) {
      setDashboardMetrics(null);
      setIsConnected(false);
      return;
    }

    try {
      const subscriptionId = realTimeDataService.subscribeToDashboardMetrics(
        userId,
        handleDashboardUpdate
      );
      
      subscriptionRef.current = subscriptionId;
      setIsConnected(realTimeDataService.getConnectionStatus());
      setError(null);

      return () => {
        if (subscriptionRef.current) {
          realTimeDataService.unsubscribe(subscriptionRef.current);
          subscriptionRef.current = null;
        }
      };
    } catch (err) {
      setError(err as Error);
      setIsConnected(false);
    }
  }, [userId, handleDashboardUpdate]);

  return {
    dashboardMetrics,
    isConnected,
    error,
    refresh: () => {
      if (userId && subscriptionRef.current) {
        realTimeDataService.unsubscribe(subscriptionRef.current);
        const newSubscriptionId = realTimeDataService.subscribeToDashboardMetrics(
          userId,
          handleDashboardUpdate
        );
        subscriptionRef.current = newSubscriptionId;
      }
    }
  };
};

/**
 * Hook for managing multiple real-time subscriptions
 */
export const useRealTimeManager = () => {
  const [connectionStatus, setConnectionStatus] = useState(false);
  const [activeSubscriptions, setActiveSubscriptions] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setConnectionStatus(realTimeDataService.getConnectionStatus());
      setActiveSubscriptions(realTimeDataService.getActiveSubscriptionsCount());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const disconnectAll = useCallback(() => {
    realTimeDataService.unsubscribeAll();
    setActiveSubscriptions(0);
  }, []);

  return {
    connectionStatus,
    activeSubscriptions,
    disconnectAll
  };
};
