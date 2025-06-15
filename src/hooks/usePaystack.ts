
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface PaystackPaymentData {
  email: string;
  amount: number;
  reference: string;
  metadata?: any;
  callback_url?: string;
}

interface UsePaystackReturn {
  initializePayment: (paymentData: PaystackPaymentData) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const usePaystack = (): UsePaystackReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const initializePayment = async (paymentData: PaystackPaymentData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Check if Paystack is loaded
      if (typeof window.PaystackPop === 'undefined') {
        throw new Error('Paystack not loaded. Please check your internet connection.');
      }

      const handler = window.PaystackPop.setup({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_your_key_here',
        email: paymentData.email,
        amount: paymentData.amount * 100, // Convert to kobo
        currency: 'NGN',
        ref: paymentData.reference,
        metadata: paymentData.metadata,
        callback: (response: any) => {
          console.log('Payment successful:', response);
          toast({
            title: "Payment Successful",
            description: `Transaction reference: ${response.reference}`,
          });
          
          // Handle successful payment
          if (paymentData.callback_url) {
            window.location.href = paymentData.callback_url + `?reference=${response.reference}`;
          }
        },
        onClose: () => {
          console.log('Payment window closed');
          toast({
            title: "Payment Cancelled",
            description: "Payment was cancelled by user",
            variant: "destructive",
          });
        },
      });

      handler.openIframe();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment initialization failed';
      setError(errorMessage);
      toast({
        title: "Payment Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    initializePayment,
    isLoading,
    error,
  };
};

// Add Paystack types to window
declare global {
  interface Window {
    PaystackPop: {
      setup: (config: any) => {
        openIframe: () => void;
      };
    };
  }
}
