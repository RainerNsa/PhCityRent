import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { propertyService } from '@/services/propertyService';
import { useToast } from '@/hooks/use-toast';
import { useRealTimePropertyData } from '@/hooks/useRealTimeData';
import {
  Property,
  PropertyWithAnalytics,
  PropertyImage,
  PropertyVerificationStep,
  PropertyAnalytics,
  SearchFilters,
  SavedSearch,
  PropertySearchResult,
  PropertyMarketData,
  PropertyRecommendation,
  CreatePropertyRequest,
  UpdatePropertyRequest,
  ImageUploadRequest,
  ImageUploadProgress
} from '@/types/property';

/**
 * Hook for comprehensive property management
 */
export const usePropertyManagement = (agentId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploadProgress, setUploadProgress] = useState<ImageUploadProgress[]>([]);

  const {
    data: properties,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['agent-properties', agentId],
    queryFn: () => agentId ? propertyService.getProperties({ agent_id: agentId }) : null,
    enabled: !!agentId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const createPropertyMutation = useMutation({
    mutationFn: (propertyData: CreatePropertyRequest) =>
      propertyService.createProperty(propertyData),
    onSuccess: (newProperty) => {
      queryClient.invalidateQueries(['agent-properties', agentId]);
      queryClient.invalidateQueries(['properties']);
      toast({
        title: "Property Created",
        description: `${newProperty.title} has been successfully created.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create property.",
        variant: "destructive",
      });
    }
  });

  const updatePropertyMutation = useMutation({
    mutationFn: ({ propertyId, updates }: { 
      propertyId: string; 
      updates: UpdatePropertyRequest 
    }) => propertyService.updateProperty(propertyId, updates),
    onSuccess: (updatedProperty) => {
      queryClient.invalidateQueries(['agent-properties', agentId]);
      queryClient.invalidateQueries(['property', updatedProperty.id]);
      queryClient.invalidateQueries(['properties']);
      toast({
        title: "Property Updated",
        description: `${updatedProperty.title} has been successfully updated.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update property.",
        variant: "destructive",
      });
    }
  });

  const deletePropertyMutation = useMutation({
    mutationFn: (propertyId: string) => propertyService.deleteProperty(propertyId),
    onSuccess: () => {
      queryClient.invalidateQueries(['agent-properties', agentId]);
      queryClient.invalidateQueries(['properties']);
      toast({
        title: "Property Deleted",
        description: "Property has been successfully deleted.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Deletion Failed",
        description: error.message || "Failed to delete property.",
        variant: "destructive",
      });
    }
  });

  const uploadImagesMutation = useMutation({
    mutationFn: (request: ImageUploadRequest) =>
      propertyService.uploadPropertyImages(request, setUploadProgress),
    onSuccess: (images, variables) => {
      queryClient.invalidateQueries(['property-images', variables.property_id]);
      queryClient.invalidateQueries(['property', variables.property_id]);
      setUploadProgress([]);
      toast({
        title: "Images Uploaded",
        description: `${images.length} images have been successfully uploaded.`,
      });
    },
    onError: (error: any) => {
      setUploadProgress([]);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload images.",
        variant: "destructive",
      });
    }
  });

  const createProperty = useCallback(
    (propertyData: CreatePropertyRequest) => {
      const validationErrors = propertyService.validatePropertyData(propertyData);
      if (validationErrors.length > 0) {
        toast({
          title: "Validation Error",
          description: validationErrors.join(', '),
          variant: "destructive",
        });
        return;
      }
      createPropertyMutation.mutate(propertyData);
    },
    [createPropertyMutation, toast]
  );

  const updateProperty = useCallback(
    (propertyId: string, updates: UpdatePropertyRequest) => {
      const validationErrors = propertyService.validatePropertyData(updates);
      if (validationErrors.length > 0) {
        toast({
          title: "Validation Error",
          description: validationErrors.join(', '),
          variant: "destructive",
        });
        return;
      }
      updatePropertyMutation.mutate({ propertyId, updates });
    },
    [updatePropertyMutation, toast]
  );

  const deleteProperty = useCallback(
    (propertyId: string) => {
      deletePropertyMutation.mutate(propertyId);
    },
    [deletePropertyMutation]
  );

  const uploadImages = useCallback(
    (request: ImageUploadRequest) => {
      uploadImagesMutation.mutate(request);
    },
    [uploadImagesMutation]
  );

  return {
    properties: properties?.properties || [],
    totalProperties: properties?.total_count || 0,
    isLoading,
    error,
    refetch,
    createProperty,
    updateProperty,
    deleteProperty,
    uploadImages,
    uploadProgress,
    isCreating: createPropertyMutation.isPending,
    isUpdating: updatePropertyMutation.isPending,
    isDeleting: deletePropertyMutation.isPending,
    isUploading: uploadImagesMutation.isPending
  };
};

/**
 * Hook for property search functionality
 */
export const usePropertySearch = (initialFilters: SearchFilters = {}) => {
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const {
    data: searchResult,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['property-search', filters, page, pageSize],
    queryFn: () => propertyService.searchProperties(filters, page, pageSize),
    staleTime: 1 * 60 * 1000, // 1 minute
    keepPreviousData: true
  });

  const updateFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(1); // Reset to first page when filters change
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setPage(1);
  }, []);

  const nextPage = useCallback(() => {
    if (searchResult && page < Math.ceil(searchResult.total_count / pageSize)) {
      setPage(prev => prev + 1);
    }
  }, [searchResult, page, pageSize]);

  const previousPage = useCallback(() => {
    if (page > 1) {
      setPage(prev => prev - 1);
    }
  }, [page]);

  const goToPage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  return {
    properties: searchResult?.properties || [],
    totalCount: searchResult?.total_count || 0,
    currentPage: page,
    pageSize,
    totalPages: searchResult ? Math.ceil(searchResult.total_count / pageSize) : 0,
    filters,
    searchMetadata: searchResult?.search_metadata,
    isLoading,
    error,
    refetch,
    updateFilters,
    clearFilters,
    nextPage,
    previousPage,
    goToPage,
    setPageSize,
    hasNextPage: searchResult ? page < Math.ceil(searchResult.total_count / pageSize) : false,
    hasPreviousPage: page > 1
  };
};

/**
 * Hook for property analytics
 */
export const usePropertyAnalytics = (propertyId: string | null) => {
  const { toast } = useToast();
  
  // Get real-time analytics if available
  const { 
    analytics: realTimeAnalytics, 
    isConnected: realTimeConnected 
  } = useRealTimePropertyData(propertyId);

  const {
    data: analytics,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['property-analytics', propertyId],
    queryFn: () => propertyId ? propertyService.getPropertyAnalytics(propertyId) : null,
    enabled: !!propertyId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  });

  const {
    data: marketData,
    isLoading: marketLoading
  } = useQuery({
    queryKey: ['market-data', analytics?.property_id],
    queryFn: async () => {
      if (!analytics) return null;
      const property = await propertyService.getProperty(analytics.property_id);
      return propertyService.getMarketData(property.location, property.property_type);
    },
    enabled: !!analytics,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  const recordViewMutation = useMutation({
    mutationFn: ({ propertyId, userId, ipAddress, userAgent }: {
      propertyId: string;
      userId?: string;
      ipAddress?: string;
      userAgent?: string;
    }) => propertyService.recordPropertyView(propertyId, userId, ipAddress, userAgent),
    onError: (error: any) => {
      console.error('Failed to record property view:', error);
    }
  });

  const recordView = useCallback(
    (userId?: string, ipAddress?: string, userAgent?: string) => {
      if (!propertyId) return;
      recordViewMutation.mutate({ propertyId, userId, ipAddress, userAgent });
    },
    [propertyId, recordViewMutation]
  );

  // Use real-time data if available, otherwise use cached data
  const currentAnalytics = realTimeAnalytics || analytics;

  return {
    analytics: currentAnalytics,
    marketData,
    isLoading,
    marketLoading,
    error,
    refetch,
    recordView,
    realTimeConnected,
    propertyScore: currentAnalytics ? propertyService.calculatePropertyScore(currentAnalytics as any) : 0
  };
};

/**
 * Hook for property verification workflow
 */
export const usePropertyVerification = (propertyId: string | null) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: verificationSteps,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['property-verification-steps', propertyId],
    queryFn: () => propertyId ? propertyService.getVerificationSteps(propertyId) : null,
    enabled: !!propertyId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const {
    data: verificationProgress,
    isLoading: progressLoading
  } = useQuery({
    queryKey: ['property-verification-progress', propertyId],
    queryFn: () => propertyId ? propertyService.getVerificationProgress(propertyId) : null,
    enabled: !!propertyId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const updateStepMutation = useMutation({
    mutationFn: ({ stepId, status, completionData }: {
      stepId: string;
      status: string;
      completionData?: any
    }) => propertyService.updateVerificationStep(stepId, status, completionData),
    onSuccess: () => {
      queryClient.invalidateQueries(['property-verification-steps', propertyId]);
      queryClient.invalidateQueries(['property-verification-progress', propertyId]);
      queryClient.invalidateQueries(['property', propertyId]);
      toast({
        title: "Verification Step Updated",
        description: "Verification step status has been updated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update verification step.",
        variant: "destructive",
      });
    }
  });

  const scheduleInspectionMutation = useMutation({
    mutationFn: ({ inspectorId, inspectionType, scheduledDate }: {
      inspectorId: string;
      inspectionType: string;
      scheduledDate: string;
    }) => {
      if (!propertyId) throw new Error('Property ID is required');
      return propertyService.scheduleInspection(propertyId, inspectorId, inspectionType, scheduledDate);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['property-verification-steps', propertyId]);
      toast({
        title: "Inspection Scheduled",
        description: "Property inspection has been scheduled successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Scheduling Failed",
        description: error.message || "Failed to schedule inspection.",
        variant: "destructive",
      });
    }
  });

  const updateVerificationStep = useCallback(
    (stepId: string, status: string, completionData?: any) => {
      updateStepMutation.mutate({ stepId, status, completionData });
    },
    [updateStepMutation]
  );

  const scheduleInspection = useCallback(
    (inspectorId: string, inspectionType: string, scheduledDate: string) => {
      scheduleInspectionMutation.mutate({ inspectorId, inspectionType, scheduledDate });
    },
    [scheduleInspectionMutation]
  );

  return {
    verificationSteps: verificationSteps || [],
    verificationProgress,
    isLoading,
    progressLoading,
    error,
    refetch,
    updateVerificationStep,
    scheduleInspection,
    isUpdatingStep: updateStepMutation.isPending,
    isSchedulingInspection: scheduleInspectionMutation.isPending
  };
};

/**
 * Hook for saved searches management
 */
export const useSavedSearches = (userId: string | null) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: savedSearches,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['saved-searches', userId],
    queryFn: () => userId ? propertyService.getSavedSearches(userId) : null,
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const saveSearchMutation = useMutation({
    mutationFn: ({ name, filters, alertFrequency }: {
      name: string;
      filters: SearchFilters;
      alertFrequency?: string;
    }) => {
      if (!userId) throw new Error('User ID is required');
      return propertyService.saveSearch(userId, name, filters, alertFrequency);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['saved-searches', userId]);
      toast({
        title: "Search Saved",
        description: "Your search has been saved successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Save Failed",
        description: error.message || "Failed to save search.",
        variant: "destructive",
      });
    }
  });

  const deleteSearchMutation = useMutation({
    mutationFn: (searchId: string) => propertyService.deleteSavedSearch(searchId),
    onSuccess: () => {
      queryClient.invalidateQueries(['saved-searches', userId]);
      toast({
        title: "Search Deleted",
        description: "Saved search has been deleted.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete saved search.",
        variant: "destructive",
      });
    }
  });

  const saveSearch = useCallback(
    (name: string, filters: SearchFilters, alertFrequency = 'never') => {
      saveSearchMutation.mutate({ name, filters, alertFrequency });
    },
    [saveSearchMutation]
  );

  const deleteSearch = useCallback(
    (searchId: string) => {
      deleteSearchMutation.mutate(searchId);
    },
    [deleteSearchMutation]
  );

  return {
    savedSearches: savedSearches || [],
    isLoading,
    error,
    refetch,
    saveSearch,
    deleteSearch,
    isSaving: saveSearchMutation.isPending,
    isDeleting: deleteSearchMutation.isPending
  };
};

/**
 * Hook for property recommendations
 */
export const usePropertyRecommendations = (userId: string | null, limit = 10) => {
  const {
    data: recommendations,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['property-recommendations', userId, limit],
    queryFn: () => userId ? propertyService.getPropertyRecommendations(userId, limit) : null,
    enabled: !!userId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    recommendations: recommendations || [],
    isLoading,
    error,
    refetch
  };
};
