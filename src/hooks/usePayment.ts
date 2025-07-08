// Comprehensive payment hook for all Nigerian payment providers
import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { PaymentService } from '@/services/payment/PaymentService';
import { paymentService as enhancedPaymentService } from '@/services/paymentService';
import { 
  PaymentProvider, 
  PaymentData, 
  PaymentResponse, 
  TransactionRecord,
  TransactionType 
} from '@/types/payment';
import { supabase } from '@/integrations/supabase/client';

interface UsePaymentOptions {
  defaultProvider?: PaymentProvider;
  onSuccess?: (response: PaymentResponse) => void;
  onError?: (error: any) => void;
}

export const usePayment = (options: UsePaymentOptions = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const paymentService = new PaymentService();

  // Set default provider if specified
  if (options.defaultProvider) {
    paymentService.setDefaultProvider(options.defaultProvider);
  }

  /**
   * Initialize payment with any provider
   */
  const initializePayment = useCallback(async (
    paymentData: PaymentData,
    provider?: PaymentProvider
  ): Promise<PaymentResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await paymentService.initializePayment(paymentData, provider);
      
      toast({
        title: "Payment Initialized",
        description: `Redirecting to ${provider || 'payment'} gateway...`,
      });

      options.onSuccess?.(response);
      
      // Invalidate transaction queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['payment-transactions'] });
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment initialization failed';
      setError(errorMessage);
      
      toast({
        title: "Payment Error",
        description: errorMessage,
        variant: "destructive",
      });

      options.onError?.(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [paymentService, toast, options, queryClient]);

  /**
   * Verify payment with any provider
   */
  const verifyPayment = useCallback(async (
    reference: string,
    provider?: PaymentProvider
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const verification = await paymentService.verifyPayment(reference, provider);

      if (verification.success && verification.data.status === 'success') {
        toast({
          title: "Payment Verified",
          description: `Payment of ₦${(verification.data.amount / 100).toLocaleString()} was successful`,
        });
      } else {
        toast({
          title: "Payment Verification Failed",
          description: verification.data.message || "Payment could not be verified",
          variant: "destructive",
        });
      }

      // Invalidate transaction queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['payment-transactions'] });
      
      return verification;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment verification failed';
      setError(errorMessage);
      
      toast({
        title: "Verification Error",
        description: errorMessage,
        variant: "destructive",
      });

      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [paymentService, toast, queryClient]);

  /**
   * Get available payment providers
   */
  const getAvailableProviders = useCallback(() => {
    return paymentService.getAvailableProviders();
  }, [paymentService]);

  /**
   * Generate payment reference
   */
  const generateReference = useCallback((
    transactionType: TransactionType = 'rent_payment',
    provider?: PaymentProvider
  ) => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const providerPrefix = provider ? provider.toUpperCase() : 'PAY';
    const typePrefix = transactionType.toUpperCase().replace('_', '');
    
    return `PHC_${providerPrefix}_${typePrefix}_${timestamp}_${random}`;
  }, []);

  return {
    initializePayment,
    verifyPayment,
    getAvailableProviders,
    generateReference,
    isLoading,
    error,
  };
};

/**
 * Hook for fetching transaction history
 */
export const useTransactionHistory = (userId?: string) => {
  return useQuery({
    queryKey: ['payment-transactions', userId],
    queryFn: async (): Promise<TransactionRecord[]> => {
      let query = supabase
        .from('payment_transactions')
        .select(`
          *,
          properties (
            title,
            location,
            price_per_month
          )
        `)
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Failed to fetch transaction history:', error);
        throw error;
      }

      return data || [];
    },
  });
};

/**
 * Hook for fetching a specific transaction
 */
export const useTransaction = (reference: string) => {
  return useQuery({
    queryKey: ['payment-transaction', reference],
    queryFn: async (): Promise<TransactionRecord | null> => {
      const { data, error } = await supabase
        .from('payment_transactions')
        .select(`
          *,
          properties (
            title,
            location,
            price_per_month
          )
        `)
        .eq('reference', reference)
        .single();

      if (error) {
        console.error('Failed to fetch transaction:', error);
        return null;
      }

      return data;
    },
    enabled: !!reference,
  });
};

/**
 * Hook for creating rent payments
 */
export const useRentPayment = () => {
  const { initializePayment, isLoading, error } = usePayment();

  const payRent = useCallback(async (data: {
    propertyId: string;
    amount: number;
    tenantEmail: string;
    tenantName: string;
    tenantPhone?: string;
    provider?: PaymentProvider;
  }) => {
    const paymentData: PaymentData = {
      email: data.tenantEmail,
      amount: data.amount * 100, // Convert to kobo
      reference: `PHC_RENT_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      currency: 'NGN',
      metadata: {
        transaction_type: 'rent_payment',
        property_id: data.propertyId,
        tenant_name: data.tenantName,
        tenant_phone: data.tenantPhone,
        customer_name: data.tenantName
      },
      customization: {
        title: 'PHCityRent - Rent Payment',
        description: 'Monthly rent payment',
      }
    };

    return initializePayment(paymentData, data.provider);
  }, [initializePayment]);

  return {
    payRent,
    isLoading,
    error,
  };
};

/**
 * Hook for agent commission payments
 */
export const useCommissionPayment = () => {
  const { initializePayment, isLoading, error } = usePayment();

  const payCommission = useCallback(async (data: {
    agentId: string;
    propertyId: string;
    amount: number;
    agentEmail: string;
    agentName: string;
    provider?: PaymentProvider;
  }) => {
    const paymentData: PaymentData = {
      email: data.agentEmail,
      amount: data.amount * 100, // Convert to kobo
      reference: `PHC_COMM_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      currency: 'NGN',
      metadata: {
        transaction_type: 'agent_commission',
        agent_id: data.agentId,
        property_id: data.propertyId,
        agent_name: data.agentName,
        customer_name: data.agentName
      },
      customization: {
        title: 'PHCityRent - Commission Payment',
        description: 'Agent commission payment',
      }
    };

    return initializePayment(paymentData, data.provider);
  }, [initializePayment]);

  return {
    payCommission,
    isLoading,
    error,
  };
};

/**
 * Format amount for display
 */
export const formatAmount = (amount: number, currency: string = 'NGN'): string => {
  const value = currency === 'NGN' ? amount / 100 : amount; // Convert from kobo if NGN
  const symbol = currency === 'NGN' ? '₦' : '$';
  
  return `${symbol}${value.toLocaleString()}`;
};

/**
 * Convert amount to kobo/cents
 */
export const toKobo = (amount: number): number => {
  return Math.round(amount * 100);
};

/**
 * Convert amount from kobo/cents
 */
export const fromKobo = (amount: number): number => {
  return amount / 100;
};
