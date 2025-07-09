
import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { realTimeDataService } from '@/services/realTimeDataService';
import { WebSocketManager } from '@/lib/websocketManager';

export interface RealTimeUpdateConfig {
  enableToasts?: boolean;
  enableQueryInvalidation?: boolean;
  filter?: Record<string, any>;
  onUpdate?: (payload: any) => void;
  onError?: (error: Error) => void;
  retryOnFailure?: boolean;
  maxRetries?: number;
}

/**
 * Enhanced real-time updates hook with advanced features
 */
export const useRealTimeUpdates = (
  tableName: string,
  config: RealTimeUpdateConfig = {}
) => {
  const {
    enableToasts = true,
    enableQueryInvalidation = true,
    filter,
    onUpdate,
    onError,
    retryOnFailure = true,
    maxRetries = 3
  } = config;

  const [isConnected, setIsConnected] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'poor' | 'disconnected'>('disconnected');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [updateCount, setUpdateCount] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const retryCountRef = useRef(0);
  const channelRef = useRef<any>(null);
  const wsManager = WebSocketManager.getInstance();

  // Monitor connection quality
  const monitorConnectionQuality = useCallback(() => {
    const isRealTimeConnected = realTimeDataService.getConnectionStatus();
    const isWebSocketConnected = wsManager.isConnected();

    if (isRealTimeConnected && isWebSocketConnected) {
      setConnectionQuality('excellent');
    } else if (isRealTimeConnected || isWebSocketConnected) {
      setConnectionQuality('good');
    } else if (navigator.onLine) {
      setConnectionQuality('poor');
    } else {
      setConnectionQuality('disconnected');
    }
  }, [wsManager]);

  // Handle real-time updates
  const handleUpdate = useCallback((payload: any) => {
    console.log(`Real-time update on ${tableName}:`, payload);

    setLastUpdate(new Date());
    setUpdateCount(prev => prev + 1);
    setError(null);
    retryCountRef.current = 0;

    // Show toast notification for updates
    if (enableToasts) {
      const eventType = payload.eventType || payload.event;
      let title = "Update Received";
      let description = `${tableName} has been updated in real-time`;

      switch (eventType) {
        case 'INSERT':
          title = "New Record Added";
          description = `A new ${tableName.slice(0, -1)} has been added`;
          break;
        case 'UPDATE':
          title = "Record Updated";
          description = `A ${tableName.slice(0, -1)} has been updated`;
          break;
        case 'DELETE':
          title = "Record Deleted";
          description = `A ${tableName.slice(0, -1)} has been removed`;
          break;
      }

      toast({
        title,
        description,
        duration: 3000,
      });
    }

    // Invalidate related queries
    if (enableQueryInvalidation) {
      queryClient.invalidateQueries([tableName]);

      // Invalidate specific queries based on table
      switch (tableName) {
        case 'properties':
          queryClient.invalidateQueries(['properties']);
          queryClient.invalidateQueries(['agent-properties']);
          break;
        case 'payment_transactions':
          queryClient.invalidateQueries(['transactions']);
          queryClient.invalidateQueries(['commissions']);
          queryClient.invalidateQueries(['dashboard-metrics']);
          break;
        case 'agent_applications':
          queryClient.invalidateQueries(['agents']);
          queryClient.invalidateQueries(['agent-performance']);
          break;
      }
    }

    // Call custom update handler
    if (onUpdate) {
      try {
        onUpdate(payload);
      } catch (err) {
        console.error('Error in custom update handler:', err);
      }
    }
  }, [tableName, enableToasts, enableQueryInvalidation, onUpdate, toast, queryClient]);

  // Handle connection errors
  const handleError = useCallback((error: Error) => {
    console.error(`Real-time connection error for ${tableName}:`, error);
    setError(error);

    if (onError) {
      onError(error);
    }

    if (retryOnFailure && retryCountRef.current < maxRetries) {
      retryCountRef.current++;

      if (enableToasts) {
        toast({
          title: "Connection Issue",
          description: `Attempting to reconnect... (${retryCountRef.current}/${maxRetries})`,
          variant: "destructive",
          duration: 3000,
        });
      }

      // Retry connection after delay
      setTimeout(() => {
        setupRealTimeSubscription();
      }, 1000 * retryCountRef.current);
    }
  }, [tableName, onError, retryOnFailure, maxRetries, enableToasts, toast]);

  // Setup real-time subscription
  const setupRealTimeSubscription = useCallback(() => {
    try {
      // Remove existing channel
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }

      // Create new channel
      let channelBuilder = supabase.channel(`${tableName}-changes-${Date.now()}`);

      // Add postgres changes listener
      let changeConfig: any = {
        event: '*',
        schema: 'public',
        table: tableName
      };

      // Apply filter if provided
      if (filter) {
        const filterString = Object.entries(filter)
          .map(([key, value]) => `${key}=eq.${value}`)
          .join(',');
        changeConfig.filter = filterString;
      }

      channelBuilder = channelBuilder.on('postgres_changes', changeConfig, handleUpdate);

      // Subscribe to channel
      channelRef.current = channelBuilder.subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');

        if (status === 'SUBSCRIBED') {
          console.log(`Real-time connection established for ${tableName}`);
          setError(null);
          retryCountRef.current = 0;
        } else if (status === 'CHANNEL_ERROR') {
          handleError(new Error('Channel subscription failed'));
        }
      });

    } catch (err) {
      handleError(err as Error);
    }
  }, [tableName, filter, handleUpdate, handleError]);

  // Setup subscription on mount
  useEffect(() => {
    setupRealTimeSubscription();

    // Monitor connection quality
    const qualityInterval = setInterval(monitorConnectionQuality, 5000);

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      clearInterval(qualityInterval);
      setIsConnected(false);
    };
  }, [setupRealTimeSubscription, monitorConnectionQuality]);

  // Reconnect function
  const reconnect = useCallback(() => {
    retryCountRef.current = 0;
    setupRealTimeSubscription();
  }, [setupRealTimeSubscription]);

  // Get connection statistics
  const getConnectionStats = useCallback(() => {
    return {
      isConnected,
      connectionQuality,
      lastUpdate,
      updateCount,
      error,
      retryCount: retryCountRef.current,
      maxRetries
    };
  }, [isConnected, connectionQuality, lastUpdate, updateCount, error, maxRetries]);

  return {
    isConnected,
    connectionQuality,
    lastUpdate,
    updateCount,
    error,
    reconnect,
    getConnectionStats
  };
};
