// Flutterwave payment provider implementation

import { 
  PaymentData, 
  PaymentResponse, 
  PaymentConfig,
  PaymentVerificationResponse,
  PaymentError
} from '@/types/payment';

export class FlutterwaveService {
  private config: PaymentConfig;
  private baseUrl: string;

  constructor(config: PaymentConfig) {
    this.config = config;
    this.baseUrl = config.environment === 'live' 
      ? 'https://api.flutterwave.com/v3' 
      : 'https://api.flutterwave.com/v3';
  }

  /**
   * Initialize Flutterwave payment
   */
  async initializePayment(paymentData: PaymentData): Promise<PaymentResponse> {
    try {
      // Load Flutterwave script if not already loaded
      await this.loadFlutterwaveScript();

      return new Promise((resolve, reject) => {
        const FlutterwaveCheckout = (window as any).FlutterwaveCheckout;
        
        FlutterwaveCheckout({
          public_key: this.config.publicKey,
          tx_ref: paymentData.reference,
          amount: paymentData.amount / 100, // Flutterwave expects amount in naira, not kobo
          currency: paymentData.currency || 'NGN',
          country: 'NG',
          payment_options: 'card,mobilemoney,ussd,banktransfer',
          customer: {
            email: paymentData.email,
            phone_number: paymentData.metadata?.phone || '',
            name: paymentData.metadata?.customer_name || paymentData.email.split('@')[0]
          },
          customizations: {
            title: paymentData.customization?.title || 'PHCityRent Payment',
            description: paymentData.customization?.description || 'Property rental payment',
            logo: paymentData.customization?.logo || ''
          },
          meta: {
            property_id: paymentData.metadata?.property_id || '',
            transaction_type: paymentData.metadata?.transaction_type || 'rent_payment',
            ...paymentData.metadata
          },
          callback: (response: any) => {
            console.log('Flutterwave payment response:', response);
            
            if (response.status === 'successful') {
              resolve({
                success: true,
                reference: response.tx_ref,
                transaction_id: response.transaction_id,
                status: 'success',
                amount: response.amount * 100, // Convert back to kobo
                currency: response.currency,
                paid_at: new Date().toISOString(),
                channel: response.payment_type,
                customer: response.customer
              });
            } else {
              reject({
                code: 'PAYMENT_FAILED',
                message: 'Payment was not successful',
                details: response
              });
            }
          },
          onclose: () => {
            console.log('Flutterwave payment window closed');
            reject({
              code: 'PAYMENT_CANCELLED',
              message: 'Payment was cancelled by user'
            });
          }
        });
      });
    } catch (error) {
      console.error('Flutterwave initialization failed:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Verify Flutterwave payment
   */
  async verifyPayment(reference: string): Promise<PaymentVerificationResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/transactions/verify_by_reference?tx_ref=${reference}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.secretKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status !== 'success') {
        throw new Error(data.message || 'Payment verification failed');
      }

      const transactionData = data.data;

      return {
        success: data.status === 'success',
        data: {
          id: transactionData.id,
          domain: 'flutterwave',
          status: this.mapFlutterwaveStatus(transactionData.status),
          reference: transactionData.tx_ref,
          amount: transactionData.amount * 100, // Convert to kobo
          message: transactionData.narration || transactionData.status,
          gateway_response: transactionData.processor_response || transactionData.status,
          paid_at: transactionData.created_at,
          created_at: transactionData.created_at,
          channel: transactionData.payment_type,
          currency: transactionData.currency,
          ip_address: transactionData.ip || '',
          metadata: transactionData.meta || {},
          fees: (transactionData.app_fee || 0) * 100, // Convert to kobo
          fees_split: null,
          authorization: transactionData.card || null,
          customer: transactionData.customer,
          plan: null,
          split: null,
          order_id: null,
          paidAt: transactionData.created_at,
          createdAt: transactionData.created_at,
          requested_amount: transactionData.charged_amount * 100, // Convert to kobo
          pos_transaction_data: null,
          source: null,
          fees_breakdown: null
        }
      };
    } catch (error) {
      console.error('Flutterwave verification failed:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get list of Nigerian banks for bank transfer
   */
  async getBanks(): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/banks/NG`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.secretKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Failed to fetch banks:', error);
      return [];
    }
  }

  /**
   * Create a payment plan for recurring payments
   */
  async createPlan(planData: {
    name: string;
    amount: number;
    interval: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
    duration?: number;
    currency?: string;
  }): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/payment-plans`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.secretKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: planData.amount / 100, // Flutterwave expects amount in naira
          name: planData.name,
          interval: planData.interval,
          duration: planData.duration || 0, // 0 means indefinite
          currency: planData.currency || 'NGN'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to create payment plan:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Load Flutterwave inline script
   */
  private loadFlutterwaveScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if ((window as any).FlutterwaveCheckout) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.flutterwave.com/v3.js';
      script.async = true;
      
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Flutterwave script'));

      document.head.appendChild(script);
    });
  }

  /**
   * Map Flutterwave status to our standard status
   */
  private mapFlutterwaveStatus(status: string): any {
    const statusMap: Record<string, any> = {
      'successful': 'success',
      'failed': 'failed',
      'cancelled': 'cancelled',
      'pending': 'pending'
    };

    return statusMap[status] || 'pending';
  }

  /**
   * Handle Flutterwave errors
   */
  private handleError(error: any): PaymentError {
    if (error instanceof Error) {
      return {
        code: 'FLUTTERWAVE_ERROR',
        message: error.message,
        details: error
      };
    }

    if (typeof error === 'object' && error.code) {
      return {
        code: error.code,
        message: error.message || 'Flutterwave error occurred',
        details: error
      };
    }

    return {
      code: 'UNKNOWN_FLUTTERWAVE_ERROR',
      message: 'An unknown Flutterwave error occurred',
      details: error
    };
  }

  /**
   * Format amount to naira (Flutterwave expects amounts in naira)
   */
  static formatAmount(amount: number): number {
    return amount / 100;
  }

  /**
   * Format amount from naira to kobo
   */
  static formatAmountToKobo(amount: number): number {
    return Math.round(amount * 100);
  }
}
