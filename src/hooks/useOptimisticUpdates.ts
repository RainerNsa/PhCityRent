import { useState, useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

/**
 * Types for optimistic updates
 */
export interface OptimisticUpdate<T = any> {
  id: string;
  type: 'create' | 'update' | 'delete';
  queryKey: string[];
  optimisticData: T;
  originalData?: T;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed' | 'rolled_back';
  retryCount: number;
  maxRetries: number;
}

export interface OptimisticUpdateConfig {
  maxRetries?: number;
  retryDelay?: number;
  timeout?: number;
  enableRollback?: boolean;
  showNotifications?: boolean;
}

export interface ConflictResolution<T = any> {
  strategy: 'server_wins' | 'client_wins' | 'merge' | 'manual';
  resolver?: (serverData: T, clientData: T) => T;
}

/**
 * Hook for managing optimistic updates with rollback and conflict resolution
 */
export const useOptimisticUpdates = <T = any>(
  config: OptimisticUpdateConfig = {}
) => {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    timeout = 10000,
    enableRollback = true,
    showNotifications = true
  } = config;

  const [pendingUpdates, setPendingUpdates] = useState<Map<string, OptimisticUpdate<T>>>(
    new Map()
  );
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const timeoutRefs = useRef<Map<string, NodeJS.Timeout>>(new Map());

  /**
   * Apply optimistic update immediately
   */
  const applyOptimisticUpdate = useCallback(
    async <TData = T>(
      queryKey: string[],
      updateFn: (oldData: TData | undefined) => TData,
      updateType: 'create' | 'update' | 'delete' = 'update'
    ): Promise<string> => {
      const updateId = generateUpdateId();
      const originalData = queryClient.getQueryData<TData>(queryKey);
      const optimisticData = updateFn(originalData);

      // Store the optimistic update
      const update: OptimisticUpdate<TData> = {
        id: updateId,
        type: updateType,
        queryKey,
        optimisticData,
        originalData,
        timestamp: Date.now(),
        status: 'pending',
        retryCount: 0,
        maxRetries
      };

      setPendingUpdates(prev => new Map(prev.set(updateId, update as OptimisticUpdate<T>)));

      // Apply optimistic update to query cache
      queryClient.setQueryData(queryKey, optimisticData);

      // Set timeout for automatic rollback
      if (enableRollback) {
        const timeoutId = setTimeout(() => {
          handleUpdateTimeout(updateId);
        }, timeout);
        
        timeoutRefs.current.set(updateId, timeoutId);
      }

      if (showNotifications) {
        toast({
          title: "Updating...",
          description: "Your changes are being saved.",
          duration: 2000,
        });
      }

      return updateId;
    },
    [queryClient, maxRetries, timeout, enableRollback, showNotifications, toast]
  );

  /**
   * Confirm optimistic update (call when server confirms)
   */
  const confirmUpdate = useCallback(
    (updateId: string, serverData?: T) => {
      const update = pendingUpdates.get(updateId);
      if (!update) return;

      // Clear timeout
      const timeoutId = timeoutRefs.current.get(updateId);
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutRefs.current.delete(updateId);
      }

      // Update status
      setPendingUpdates(prev => {
        const newMap = new Map(prev);
        newMap.set(updateId, { ...update, status: 'confirmed' });
        return newMap;
      });

      // Update query cache with server data if provided
      if (serverData) {
        queryClient.setQueryData(update.queryKey, serverData);
      }

      if (showNotifications) {
        toast({
          title: "Saved ✅",
          description: "Your changes have been saved successfully.",
          duration: 2000,
        });
      }

      // Clean up after a delay
      setTimeout(() => {
        setPendingUpdates(prev => {
          const newMap = new Map(prev);
          newMap.delete(updateId);
          return newMap;
        });
      }, 5000);
    },
    [pendingUpdates, queryClient, showNotifications, toast]
  );

  /**
   * Rollback optimistic update
   */
  const rollbackUpdate = useCallback(
    (updateId: string, reason?: string) => {
      const update = pendingUpdates.get(updateId);
      if (!update || !enableRollback) return;

      // Clear timeout
      const timeoutId = timeoutRefs.current.get(updateId);
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutRefs.current.delete(updateId);
      }

      // Restore original data
      if (update.originalData !== undefined) {
        queryClient.setQueryData(update.queryKey, update.originalData);
      } else {
        // If no original data, invalidate the query
        queryClient.invalidateQueries(update.queryKey);
      }

      // Update status
      setPendingUpdates(prev => {
        const newMap = new Map(prev);
        newMap.set(updateId, { ...update, status: 'rolled_back' });
        return newMap;
      });

      if (showNotifications) {
        toast({
          title: "Changes Reverted",
          description: reason || "Your changes could not be saved and have been reverted.",
          variant: "destructive",
          duration: 4000,
        });
      }

      // Clean up after a delay
      setTimeout(() => {
        setPendingUpdates(prev => {
          const newMap = new Map(prev);
          newMap.delete(updateId);
          return newMap;
        });
      }, 5000);
    },
    [pendingUpdates, enableRollback, queryClient, showNotifications, toast]
  );

  /**
   * Handle update failure with retry logic
   */
  const handleUpdateFailure = useCallback(
    (updateId: string, error: Error) => {
      const update = pendingUpdates.get(updateId);
      if (!update) return;

      const newRetryCount = update.retryCount + 1;

      if (newRetryCount <= update.maxRetries) {
        // Retry the update
        setPendingUpdates(prev => {
          const newMap = new Map(prev);
          newMap.set(updateId, { 
            ...update, 
            retryCount: newRetryCount,
            status: 'pending'
          });
          return newMap;
        });

        if (showNotifications) {
          toast({
            title: `Retrying... (${newRetryCount}/${update.maxRetries})`,
            description: "Attempting to save your changes again.",
            duration: 2000,
          });
        }

        // Schedule retry
        setTimeout(() => {
          // Emit retry event or call retry function
          // This would typically trigger the original mutation again
        }, retryDelay * newRetryCount);
      } else {
        // Max retries reached, rollback
        rollbackUpdate(updateId, `Failed to save after ${update.maxRetries} attempts: ${error.message}`);
      }
    },
    [pendingUpdates, retryDelay, showNotifications, toast, rollbackUpdate]
  );

  /**
   * Handle update timeout
   */
  const handleUpdateTimeout = useCallback(
    (updateId: string) => {
      const update = pendingUpdates.get(updateId);
      if (!update) return;

      rollbackUpdate(updateId, "Update timed out");
    },
    [pendingUpdates, rollbackUpdate]
  );

  /**
   * Resolve conflicts between server and client data
   */
  const resolveConflict = useCallback(
    <TData = T>(
      updateId: string,
      serverData: TData,
      resolution: ConflictResolution<TData>
    ): TData => {
      const update = pendingUpdates.get(updateId);
      if (!update) return serverData;

      const clientData = update.optimisticData as TData;

      switch (resolution.strategy) {
        case 'server_wins':
          return serverData;
        
        case 'client_wins':
          return clientData;
        
        case 'merge':
          if (resolution.resolver) {
            return resolution.resolver(serverData, clientData);
          }
          // Default merge strategy for objects
          if (typeof serverData === 'object' && typeof clientData === 'object') {
            return { ...serverData, ...clientData };
          }
          return serverData;
        
        case 'manual':
          // Manual resolution would typically show a UI for user to choose
          if (showNotifications) {
            toast({
              title: "Conflict Detected",
              description: "Your changes conflict with server data. Please resolve manually.",
              variant: "destructive",
              duration: 10000,
            });
          }
          return serverData;
        
        default:
          return serverData;
      }
    },
    [pendingUpdates, showNotifications, toast]
  );

  /**
   * Get pending updates for a specific query
   */
  const getPendingUpdates = useCallback(
    (queryKey: string[]): OptimisticUpdate<T>[] => {
      return Array.from(pendingUpdates.values()).filter(update =>
        JSON.stringify(update.queryKey) === JSON.stringify(queryKey)
      );
    },
    [pendingUpdates]
  );

  /**
   * Check if there are pending updates for a query
   */
  const hasPendingUpdates = useCallback(
    (queryKey: string[]): boolean => {
      return getPendingUpdates(queryKey).length > 0;
    },
    [getPendingUpdates]
  );

  /**
   * Clear all pending updates
   */
  const clearAllUpdates = useCallback(() => {
    // Clear all timeouts
    timeoutRefs.current.forEach(timeoutId => clearTimeout(timeoutId));
    timeoutRefs.current.clear();
    
    // Clear pending updates
    setPendingUpdates(new Map());
  }, []);

  /**
   * Get update statistics
   */
  const getUpdateStats = useCallback(() => {
    const updates = Array.from(pendingUpdates.values());
    return {
      total: updates.length,
      pending: updates.filter(u => u.status === 'pending').length,
      confirmed: updates.filter(u => u.status === 'confirmed').length,
      failed: updates.filter(u => u.status === 'failed').length,
      rolledBack: updates.filter(u => u.status === 'rolled_back').length,
    };
  }, [pendingUpdates]);

  return {
    applyOptimisticUpdate,
    confirmUpdate,
    rollbackUpdate,
    handleUpdateFailure,
    resolveConflict,
    getPendingUpdates,
    hasPendingUpdates,
    clearAllUpdates,
    getUpdateStats,
    pendingUpdates: Array.from(pendingUpdates.values())
  };
};

/**
 * Generate unique update ID
 */
function generateUpdateId(): string {
  return `update_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Hook for property-specific optimistic updates
 */
export const useOptimisticPropertyUpdates = () => {
  const optimistic = useOptimisticUpdates({
    maxRetries: 3,
    timeout: 15000,
    showNotifications: true
  });

  const updateProperty = useCallback(
    async (propertyId: string, updates: Partial<any>) => {
      const queryKey = ['property', propertyId];
      
      return optimistic.applyOptimisticUpdate(
        queryKey,
        (oldData: any) => oldData ? { ...oldData, ...updates } : updates,
        'update'
      );
    },
    [optimistic]
  );

  const createProperty = useCallback(
    async (propertyData: any) => {
      const queryKey = ['properties'];
      
      return optimistic.applyOptimisticUpdate(
        queryKey,
        (oldData: any[]) => oldData ? [...oldData, propertyData] : [propertyData],
        'create'
      );
    },
    [optimistic]
  );

  return {
    ...optimistic,
    updateProperty,
    createProperty
  };
};

/**
 * Hook for agent-specific optimistic updates
 */
export const useOptimisticAgentUpdates = () => {
  const optimistic = useOptimisticUpdates({
    maxRetries: 2,
    timeout: 10000,
    showNotifications: true
  });

  const updateAgentMetrics = useCallback(
    async (agentId: string, metrics: Partial<any>) => {
      const queryKey = ['agent-metrics', agentId];
      
      return optimistic.applyOptimisticUpdate(
        queryKey,
        (oldData: any) => oldData ? { ...oldData, ...metrics } : metrics,
        'update'
      );
    },
    [optimistic]
  );

  return {
    ...optimistic,
    updateAgentMetrics
  };
};
