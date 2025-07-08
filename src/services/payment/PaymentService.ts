// Core payment service for handling multiple Nigerian payment providers

import { 
  PaymentProvider, 
  PaymentData, 
  PaymentResponse, 
  PaymentConfig,
  PaymentVerificationResponse,
  TransactionRecord,
  PaymentError
} from '@/types/payment';
import { PaystackService } from './providers/PaystackService';
import { FlutterwaveService } from './providers/FlutterwaveService';
import { MonnifyService } from './providers/MonnifyService';
import { supabase } from '@/integrations/supabase/client';

export class PaymentService {
  private providers: Map<PaymentProvider, any> = new Map();
  private defaultProvider: PaymentProvider = 'paystack';

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders() {
    // Initialize Paystack
    const paystackConfig: PaymentConfig = {
      provider: 'paystack',
      publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '',
      secretKey: import.meta.env.VITE_PAYSTACK_SECRET_KEY || '',
      environment: import.meta.env.VITE_ENVIRONMENT === 'production' ? 'live' : 'test',
      currency: 'NGN',
      callbackUrl: `${window.location.origin}/payment/callback`,
      webhookUrl: `${window.location.origin}/api/webhooks/paystack`
    };
    this.providers.set('paystack', new PaystackService(paystackConfig));

    // Initialize Flutterwave
    const flutterwaveConfig: PaymentConfig = {
      provider: 'flutterwave',
      publicKey: import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY || '',
      secretKey: import.meta.env.VITE_FLUTTERWAVE_SECRET_KEY || '',
      environment: import.meta.env.VITE_ENVIRONMENT === 'production' ? 'live' : 'test',
      currency: 'NGN',
      callbackUrl: `${window.location.origin}/payment/callback`,
      webhookUrl: `${window.location.origin}/api/webhooks/flutterwave`
    };
    this.providers.set('flutterwave', new FlutterwaveService(flutterwaveConfig));

    // Initialize Monnify
    const monnifyConfig: PaymentConfig = {
      provider: 'monnify',
      publicKey: import.meta.env.VITE_MONNIFY_API_KEY || '',
      secretKey: import.meta.env.VITE_MONNIFY_SECRET_KEY || '',
      environment: import.meta.env.VITE_ENVIRONMENT === 'production' ? 'live' : 'test',
      currency: 'NGN',
      callbackUrl: `${window.location.origin}/payment/callback`,
      webhookUrl: `${window.location.origin}/api/webhooks/monnify`
    };
    this.providers.set('monnify', new MonnifyService(monnifyConfig));
  }

  /**
   * Initialize payment with specified or default provider
   */
  async initializePayment(
    paymentData: PaymentData, 
    provider: PaymentProvider = this.defaultProvider
  ): Promise<PaymentResponse> {
    try {
      const paymentProvider = this.providers.get(provider);
      if (!paymentProvider) {
        throw new Error(`Payment provider ${provider} not configured`);
      }

      // Generate unique reference if not provided
      if (!paymentData.reference) {
        paymentData.reference = this.generateReference(provider);
      }

      // Save transaction record before payment
      await this.saveTransactionRecord({
        reference: paymentData.reference,
        provider,
        amount: paymentData.amount,
        currency: paymentData.currency || 'NGN',
        metadata: paymentData.metadata,
        status: 'pending'
      });

      // Initialize payment with provider
      const response = await paymentProvider.initializePayment(paymentData);

      // Update transaction record with provider response
      await this.updateTransactionRecord(paymentData.reference, {
        status: response.status,
        provider_response: response
      });

      return response;
    } catch (error) {
      console.error('Payment initialization failed:', error);
      
      // Update transaction record with error
      if (paymentData.reference) {
        await this.updateTransactionRecord(paymentData.reference, {
          status: 'failed',
          provider_response: { error: error instanceof Error ? error.message : 'Unknown error' }
        });
      }

      throw this.handlePaymentError(error);
    }
  }

  /**
   * Verify payment with specified provider
   */
  async verifyPayment(
    reference: string, 
    provider: PaymentProvider = this.defaultProvider
  ): Promise<PaymentVerificationResponse> {
    try {
      const paymentProvider = this.providers.get(provider);
      if (!paymentProvider) {
        throw new Error(`Payment provider ${provider} not configured`);
      }

      const verification = await paymentProvider.verifyPayment(reference);

      // Update transaction record with verification result
      await this.updateTransactionRecord(reference, {
        status: verification.data.status as any,
        provider_response: verification,
        paid_at: verification.data.paid_at,
        fees: verification.data.fees,
        net_amount: verification.data.amount - (verification.data.fees || 0)
      });

      return verification;
    } catch (error) {
      console.error('Payment verification failed:', error);
      throw this.handlePaymentError(error);
    }
  }

  /**
   * Get available payment providers
   */
  getAvailableProviders(): PaymentProvider[] {
    return Array.from(this.providers.keys());
  }

  /**
   * Set default payment provider
   */
  setDefaultProvider(provider: PaymentProvider) {
    if (this.providers.has(provider)) {
      this.defaultProvider = provider;
    } else {
      throw new Error(`Provider ${provider} is not available`);
    }
  }

  /**
   * Generate unique payment reference
   */
  private generateReference(provider: PaymentProvider): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `PHC_${provider.toUpperCase()}_${timestamp}_${random}`;
  }

  /**
   * Save transaction record to database
   */
  private async saveTransactionRecord(data: Partial<TransactionRecord>) {
    const { user } = await supabase.auth.getUser();
    
    const transactionData = {
      user_id: user.data.user?.id,
      reference: data.reference,
      provider: data.provider,
      transaction_type: data.metadata?.transaction_type || 'rent_payment',
      amount: data.amount,
      currency: data.currency || 'NGN',
      status: data.status || 'pending',
      metadata: data.metadata,
      property_id: data.metadata?.property_id,
      agent_id: data.metadata?.agent_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('payment_transactions')
      .insert(transactionData);

    if (error) {
      console.error('Failed to save transaction record:', error);
    }
  }

  /**
   * Update transaction record in database
   */
  private async updateTransactionRecord(reference: string, updates: Partial<TransactionRecord>) {
    const updateData = {
      ...updates,
      updated_at: new Date().toISOString()
    };

    if (updates.status === 'success' && !updates.paid_at) {
      updateData.paid_at = new Date().toISOString();
    }

    if (updates.status === 'failed' && !updates.failed_at) {
      updateData.failed_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('payment_transactions')
      .update(updateData)
      .eq('reference', reference);

    if (error) {
      console.error('Failed to update transaction record:', error);
    }
  }

  /**
   * Handle payment errors consistently
   */
  private handlePaymentError(error: any): PaymentError {
    if (error instanceof Error) {
      return {
        code: 'PAYMENT_ERROR',
        message: error.message,
        details: error
      };
    }

    return {
      code: 'UNKNOWN_ERROR',
      message: 'An unknown payment error occurred',
      details: error
    };
  }

  /**
   * Get transaction history for user
   */
  async getTransactionHistory(userId?: string): Promise<TransactionRecord[]> {
    let query = supabase
      .from('payment_transactions')
      .select('*')
      .order('created_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Failed to fetch transaction history:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Get transaction by reference
   */
  async getTransaction(reference: string): Promise<TransactionRecord | null> {
    const { data, error } = await supabase
      .from('payment_transactions')
      .select('*')
      .eq('reference', reference)
      .single();

    if (error) {
      console.error('Failed to fetch transaction:', error);
      return null;
    }

    return data;
  }
}
