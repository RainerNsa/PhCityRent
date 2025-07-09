import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { agentService } from '@/services/agentService';
import { useToast } from '@/hooks/use-toast';
import { useRealTimeAgentMetrics } from '@/hooks/useRealTimeData';
import {
  AgentProfile,
  AgentPerformanceMetrics,
  AgentGoal,
  ClientProfile,
  CommunicationHistory,
  AgentDashboardData,
  AgentAnalytics,
  CreateClientRequest,
  UpdateClientRequest,
  CreateCommunicationRequest,
  UpdateAgentProfileRequest
} from '@/types/agent';

/**
 * Hook for managing agent profile
 */
export const useAgentProfile = (agentId: string | null) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: profile,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['agent-profile', agentId],
    queryFn: () => agentId ? agentService.getAgentProfile(agentId) : null,
    enabled: !!agentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  });

  const updateProfileMutation = useMutation({
    mutationFn: ({ agentId, updates }: { agentId: string; updates: UpdateAgentProfileRequest }) =>
      agentService.updateAgentProfile(agentId, updates),
    onSuccess: (data) => {
      queryClient.setQueryData(['agent-profile', agentId], data);
      queryClient.invalidateQueries(['agent-performance', agentId]);
      toast({
        title: "Profile Updated",
        description: "Agent profile has been successfully updated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update agent profile.",
        variant: "destructive",
      });
    }
  });

  const updateProfile = useCallback(
    (updates: UpdateAgentProfileRequest) => {
      if (!agentId) return;
      updateProfileMutation.mutate({ agentId, updates });
    },
    [agentId, updateProfileMutation]
  );

  return {
    profile,
    isLoading,
    error,
    refetch,
    updateProfile,
    isUpdating: updateProfileMutation.isPending
  };
};

/**
 * Hook for agent performance tracking
 */
export const useAgentPerformance = (agentId: string | null) => {
  const { toast } = useToast();
  
  // Get real-time metrics
  const { 
    metrics: realTimeMetrics, 
    isConnected: realTimeConnected 
  } = useRealTimeAgentMetrics(agentId);

  const {
    data: performance,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['agent-performance', agentId],
    queryFn: () => agentId ? agentService.getAgentPerformance(agentId) : null,
    enabled: !!agentId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2
  });

  const {
    data: performanceHistory,
    isLoading: historyLoading
  } = useQuery({
    queryKey: ['agent-performance-history', agentId],
    queryFn: () => agentId ? agentService.getPerformanceHistory(agentId, 30) : null,
    enabled: !!agentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Use real-time data if available, otherwise use cached data
  const currentMetrics = realTimeMetrics || performance;

  const calculateRealTimeMetrics = useCallback(async () => {
    if (!agentId) return;
    
    try {
      const metrics = await agentService.calculateRealTimeMetrics(agentId);
      return metrics;
    } catch (error: any) {
      toast({
        title: "Calculation Failed",
        description: error.message || "Failed to calculate real-time metrics.",
        variant: "destructive",
      });
    }
  }, [agentId, toast]);

  return {
    performance: currentMetrics,
    performanceHistory,
    isLoading,
    historyLoading,
    error,
    refetch,
    calculateRealTimeMetrics,
    realTimeConnected
  };
};

/**
 * Hook for agent commission management
 */
export const useAgentCommissions = (agentId: string | null) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<{
    status?: string;
    from_date?: string;
    to_date?: string;
    limit?: number;
  }>({});

  const {
    data: commissions,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['agent-commissions', agentId, filters],
    queryFn: () => agentId ? agentService.getAgentCommissions(agentId, filters) : null,
    enabled: !!agentId,
    staleTime: 3 * 60 * 1000, // 3 minutes
  });

  const {
    data: commissionSummary,
    isLoading: summaryLoading
  } = useQuery({
    queryKey: ['agent-commission-summary', agentId],
    queryFn: () => agentId ? agentService.getCommissionSummary(agentId) : null,
    enabled: !!agentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const updateCommissionStatusMutation = useMutation({
    mutationFn: ({ commissionId, status, notes }: { 
      commissionId: string; 
      status: string; 
      notes?: string 
    }) => agentService.updateCommissionStatus(commissionId, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries(['agent-commissions', agentId]);
      queryClient.invalidateQueries(['agent-commission-summary', agentId]);
      toast({
        title: "Commission Updated",
        description: "Commission status has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update commission status.",
        variant: "destructive",
      });
    }
  });

  const updateCommissionStatus = useCallback(
    (commissionId: string, status: string, notes?: string) => {
      updateCommissionStatusMutation.mutate({ commissionId, status, notes });
    },
    [updateCommissionStatusMutation]
  );

  const updateFilters = useCallback((newFilters: typeof filters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  return {
    commissions,
    commissionSummary,
    isLoading,
    summaryLoading,
    error,
    refetch,
    updateCommissionStatus,
    isUpdatingStatus: updateCommissionStatusMutation.isPending,
    filters,
    updateFilters
  };
};

/**
 * Hook for agent client management
 */
export const useAgentClients = (agentId: string | null) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<{
    status?: string;
    lead_score_min?: number;
    search?: string;
    limit?: number;
    offset?: number;
  }>({ limit: 20, offset: 0 });

  const {
    data: clientsData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['agent-clients', agentId, filters],
    queryFn: () => agentId ? agentService.getAgentClients(agentId, filters) : null,
    enabled: !!agentId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const createClientMutation = useMutation({
    mutationFn: ({ agentId, clientData }: { 
      agentId: string; 
      clientData: CreateClientRequest 
    }) => agentService.createClient(agentId, clientData),
    onSuccess: (newClient) => {
      queryClient.invalidateQueries(['agent-clients', agentId]);
      queryClient.invalidateQueries(['agent-performance', agentId]);
      toast({
        title: "Client Added",
        description: `${newClient.name} has been added to your client list.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Add Client",
        description: error.message || "Failed to add new client.",
        variant: "destructive",
      });
    }
  });

  const updateClientMutation = useMutation({
    mutationFn: ({ clientId, updates }: { 
      clientId: string; 
      updates: UpdateClientRequest 
    }) => agentService.updateClient(clientId, updates),
    onSuccess: (updatedClient) => {
      queryClient.invalidateQueries(['agent-clients', agentId]);
      queryClient.setQueryData(['client', updatedClient.id], updatedClient);
      toast({
        title: "Client Updated",
        description: `${updatedClient.name}'s information has been updated.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update client information.",
        variant: "destructive",
      });
    }
  });

  const createCommunicationMutation = useMutation({
    mutationFn: ({ agentId, communication }: { 
      agentId: string; 
      communication: CreateCommunicationRequest 
    }) => agentService.createCommunication(agentId, communication),
    onSuccess: () => {
      queryClient.invalidateQueries(['agent-clients', agentId]);
      queryClient.invalidateQueries(['client-communications']);
      toast({
        title: "Communication Logged",
        description: "Communication has been recorded successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Log Communication",
        description: error.message || "Failed to record communication.",
        variant: "destructive",
      });
    }
  });

  const createClient = useCallback(
    (clientData: CreateClientRequest) => {
      if (!agentId) return;
      createClientMutation.mutate({ agentId, clientData });
    },
    [agentId, createClientMutation]
  );

  const updateClient = useCallback(
    (clientId: string, updates: UpdateClientRequest) => {
      updateClientMutation.mutate({ clientId, updates });
    },
    [updateClientMutation]
  );

  const createCommunication = useCallback(
    (communication: CreateCommunicationRequest) => {
      if (!agentId) return;
      createCommunicationMutation.mutate({ agentId, communication });
    },
    [agentId, createCommunicationMutation]
  );

  const updateFilters = useCallback((newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  return {
    clients: clientsData?.clients || [],
    totalClients: clientsData?.total || 0,
    isLoading,
    error,
    refetch,
    createClient,
    updateClient,
    createCommunication,
    isCreatingClient: createClientMutation.isPending,
    isUpdatingClient: updateClientMutation.isPending,
    isCreatingCommunication: createCommunicationMutation.isPending,
    filters,
    updateFilters
  };
};

/**
 * Hook for agent goals management
 */
export const useAgentGoals = (agentId: string | null) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: goals,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['agent-goals', agentId],
    queryFn: () => agentId ? agentService.getAgentGoals(agentId) : null,
    enabled: !!agentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const createGoalMutation = useMutation({
    mutationFn: ({ agentId, goal }: {
      agentId: string;
      goal: Omit<AgentGoal, 'id' | 'agent_id' | 'created_at' | 'updated_at'>
    }) => agentService.createAgentGoal(agentId, goal),
    onSuccess: () => {
      queryClient.invalidateQueries(['agent-goals', agentId]);
      toast({
        title: "Goal Created",
        description: "New goal has been set successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Create Goal",
        description: error.message || "Failed to create new goal.",
        variant: "destructive",
      });
    }
  });

  const updateGoalProgressMutation = useMutation({
    mutationFn: ({ goalId, currentValue }: { goalId: string; currentValue: number }) =>
      agentService.updateGoalProgress(goalId, currentValue),
    onSuccess: () => {
      queryClient.invalidateQueries(['agent-goals', agentId]);
      toast({
        title: "Goal Updated",
        description: "Goal progress has been updated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update goal progress.",
        variant: "destructive",
      });
    }
  });

  const createGoal = useCallback(
    (goal: Omit<AgentGoal, 'id' | 'agent_id' | 'created_at' | 'updated_at'>) => {
      if (!agentId) return;
      createGoalMutation.mutate({ agentId, goal });
    },
    [agentId, createGoalMutation]
  );

  const updateGoalProgress = useCallback(
    (goalId: string, currentValue: number) => {
      updateGoalProgressMutation.mutate({ goalId, currentValue });
    },
    [updateGoalProgressMutation]
  );

  return {
    goals: goals || [],
    isLoading,
    error,
    refetch,
    createGoal,
    updateGoalProgress,
    isCreatingGoal: createGoalMutation.isPending,
    isUpdatingProgress: updateGoalProgressMutation.isPending
  };
};

/**
 * Hook for comprehensive agent dashboard
 */
export const useAgentDashboard = (agentId: string | null) => {
  const { toast } = useToast();

  const {
    data: dashboardData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['agent-dashboard', agentId],
    queryFn: () => agentId ? agentService.getAgentDashboard(agentId) : null,
    enabled: !!agentId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2
  });

  const {
    data: analytics,
    isLoading: analyticsLoading
  } = useQuery({
    queryKey: ['agent-analytics', agentId],
    queryFn: () => agentId ? agentService.getAgentAnalytics(agentId) : null,
    enabled: !!agentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const refreshDashboard = useCallback(async () => {
    try {
      await refetch();
      toast({
        title: "Dashboard Refreshed",
        description: "Dashboard data has been updated.",
      });
    } catch (error: any) {
      toast({
        title: "Refresh Failed",
        description: error.message || "Failed to refresh dashboard data.",
        variant: "destructive",
      });
    }
  }, [refetch, toast]);

  return {
    dashboardData,
    analytics,
    isLoading,
    analyticsLoading,
    error,
    refetch,
    refreshDashboard
  };
};
