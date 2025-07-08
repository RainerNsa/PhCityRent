
// Enhanced Paystack hook using the new PaymentService
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { PaymentService } from '@/services/payment/PaymentService';
import { PaymentData, PaymentResponse } from '@/types/payment';

interface UsePaystackReturn {
  initializePayment: (paymentData: PaymentData) => Promise<PaymentResponse>;
  verifyPayment: (reference: string) => Promise<any>;
  isLoading: boolean;
  error: string | null;
}

export const usePaystack = (): UsePaystackReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const paymentService = new PaymentService();

  const initializePayment = async (paymentData: PaymentData): Promise<PaymentResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      // Ensure amount is in kobo for Paystack
      const paystackData = {
        ...paymentData,
        amount: paymentData.amount * 100, // Convert to kobo
        currency: 'NGN'
      };

      const response = await paymentService.initializePayment(paystackData, 'paystack');

      toast({
        title: "Payment Initialized",
        description: "Redirecting to payment gateway...",
      });

      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment initialization failed';
      setError(errorMessage);

      toast({
        title: "Payment Error",
        description: errorMessage,
        variant: "destructive",
      });

      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyPayment = async (reference: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const verification = await paymentService.verifyPayment(reference, 'paystack');

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
  };

  return {
    initializePayment,
    verifyPayment,
    isLoading,
    error,
  };
};

// Legacy support - keep the old interface for backward compatibility
export const usePaystackLegacy = () => {
  const { initializePayment, isLoading, error } = usePaystack();

  const legacyInitializePayment = async (paymentData: {
    email: string;
    amount: number;
    reference: string;
    metadata?: any;
    callback_url?: string;
  }) => {
    const modernPaymentData: PaymentData = {
      email: paymentData.email,
      amount: paymentData.amount, // Amount should already be in naira
      reference: paymentData.reference,
      metadata: paymentData.metadata,
      callback_url: paymentData.callback_url
    };

    return initializePayment(modernPaymentData);
  };

  return {
    initializePayment: legacyInitializePayment,
    isLoading,
    error,
  };
};
