// Paystack payment provider implementation

import { 
  PaymentData, 
  PaymentResponse, 
  PaymentConfig,
  PaymentVerificationResponse,
  PaymentError
} from '@/types/payment';

export class PaystackService {
  private config: PaymentConfig;
  private baseUrl: string;

  constructor(config: PaymentConfig) {
    this.config = config;
    this.baseUrl = config.environment === 'live' 
      ? 'https://api.paystack.co' 
      : 'https://api.paystack.co'; // Paystack uses same URL for test/live
  }

  /**
   * Initialize Paystack payment
   */
  async initializePayment(paymentData: PaymentData): Promise<PaymentResponse> {
    try {
      // Load Paystack script if not already loaded
      await this.loadPaystackScript();

      return new Promise((resolve, reject) => {
        const handler = (window as any).PaystackPop.setup({
          key: this.config.publicKey,
          email: paymentData.email,
          amount: paymentData.amount, // Amount should already be in kobo
          currency: paymentData.currency || 'NGN',
          ref: paymentData.reference,
          metadata: {
            ...paymentData.metadata,
            custom_fields: [
              {
                display_name: "Property ID",
                variable_name: "property_id",
                value: paymentData.metadata?.property_id || ""
              },
              {
                display_name: "Transaction Type",
                variable_name: "transaction_type", 
                value: paymentData.metadata?.transaction_type || "rent_payment"
              }
            ]
          },
          channels: paymentData.channels || ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
          callback: (response: any) => {
            console.log('Paystack payment successful:', response);
            resolve({
              success: true,
              reference: response.reference,
              transaction_id: response.trans,
              status: 'success',
              amount: paymentData.amount,
              currency: paymentData.currency || 'NGN',
              paid_at: new Date().toISOString(),
              channel: response.channel,
              authorization: response.authorization,
              customer: response.customer,
              log: response.log
            });
          },
          onClose: () => {
            console.log('Paystack payment window closed');
            reject({
              code: 'PAYMENT_CANCELLED',
              message: 'Payment was cancelled by user'
            });
          }
        });

        handler.openIframe();
      });
    } catch (error) {
      console.error('Paystack initialization failed:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Verify Paystack payment
   */
  async verifyPayment(reference: string): Promise<PaymentVerificationResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/transaction/verify/${reference}`, {
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

      if (!data.status) {
        throw new Error(data.message || 'Payment verification failed');
      }

      return {
        success: data.status,
        data: {
          id: data.data.id,
          domain: data.data.domain,
          status: this.mapPaystackStatus(data.data.status),
          reference: data.data.reference,
          amount: data.data.amount,
          message: data.data.message,
          gateway_response: data.data.gateway_response,
          paid_at: data.data.paid_at,
          created_at: data.data.created_at,
          channel: data.data.channel,
          currency: data.data.currency,
          ip_address: data.data.ip_address,
          metadata: data.data.metadata,
          fees: data.data.fees,
          fees_split: data.data.fees_split,
          authorization: data.data.authorization,
          customer: data.data.customer,
          plan: data.data.plan,
          split: data.data.split,
          order_id: data.data.order_id,
          paidAt: data.data.paidAt,
          createdAt: data.data.createdAt,
          requested_amount: data.data.requested_amount,
          pos_transaction_data: data.data.pos_transaction_data,
          source: data.data.source,
          fees_breakdown: data.data.fees_breakdown
        }
      };
    } catch (error) {
      console.error('Paystack verification failed:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get list of Nigerian banks for bank transfer
   */
  async getBanks(): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/bank?currency=NGN`, {
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
    interval: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'biannually' | 'annually';
    description?: string;
    currency?: string;
  }): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/plan`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.secretKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: planData.name,
          amount: planData.amount,
          interval: planData.interval,
          description: planData.description,
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
   * Load Paystack inline script
   */
  private loadPaystackScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if ((window as any).PaystackPop) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.async = true;
      
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Paystack script'));

      document.head.appendChild(script);
    });
  }

  /**
   * Map Paystack status to our standard status
   */
  private mapPaystackStatus(status: string): any {
    const statusMap: Record<string, any> = {
      'success': 'success',
      'failed': 'failed',
      'abandoned': 'abandoned',
      'pending': 'pending'
    };

    return statusMap[status] || 'pending';
  }

  /**
   * Handle Paystack errors
   */
  private handleError(error: any): PaymentError {
    if (error instanceof Error) {
      return {
        code: 'PAYSTACK_ERROR',
        message: error.message,
        details: error
      };
    }

    if (typeof error === 'object' && error.code) {
      return {
        code: error.code,
        message: error.message || 'Paystack error occurred',
        details: error
      };
    }

    return {
      code: 'UNKNOWN_PAYSTACK_ERROR',
      message: 'An unknown Paystack error occurred',
      details: error
    };
  }

  /**
   * Format amount to kobo (Paystack expects amounts in kobo)
   */
  static formatAmount(amount: number): number {
    return Math.round(amount * 100);
  }

  /**
   * Format amount from kobo to naira
   */
  static formatAmountFromKobo(amount: number): number {
    return amount / 100;
  }
}
