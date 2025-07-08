// Monnify payment provider implementation

import { 
  PaymentData, 
  PaymentResponse, 
  PaymentConfig,
  PaymentVerificationResponse,
  PaymentError
} from '@/types/payment';

export class MonnifyService {
  private config: PaymentConfig;
  private baseUrl: string;

  constructor(config: PaymentConfig) {
    this.config = config;
    this.baseUrl = config.environment === 'live' 
      ? 'https://api.monnify.com' 
      : 'https://sandbox.monnify.com';
  }

  /**
   * Initialize Monnify payment
   */
  async initializePayment(paymentData: PaymentData): Promise<PaymentResponse> {
    try {
      // Load Monnify script if not already loaded
      await this.loadMonnifyScript();

      return new Promise((resolve, reject) => {
        const MonnifySDK = (window as any).MonnifySDK;
        
        MonnifySDK.initialize({
          amount: paymentData.amount / 100, // Monnify expects amount in naira
          currency: paymentData.currency || 'NGN',
          reference: paymentData.reference,
          customerName: paymentData.metadata?.customer_name || paymentData.email.split('@')[0],
          customerEmail: paymentData.email,
          apiKey: this.config.publicKey,
          contractCode: this.config.secretKey, // In Monnify, this is the contract code
          paymentDescription: paymentData.customization?.description || 'Property rental payment',
          metadata: {
            property_id: paymentData.metadata?.property_id || '',
            transaction_type: paymentData.metadata?.transaction_type || 'rent_payment',
            ...paymentData.metadata
          },
          paymentMethods: paymentData.channels || ['CARD', 'ACCOUNT_TRANSFER', 'USSD'],
          onLoadStart: () => {
            console.log('Monnify payment loading...');
          },
          onLoadComplete: () => {
            console.log('Monnify payment loaded');
          },
          onComplete: (response: any) => {
            console.log('Monnify payment completed:', response);
            
            if (response.status === 'SUCCESS') {
              resolve({
                success: true,
                reference: response.transactionReference,
                transaction_id: response.transactionReference,
                status: 'success',
                amount: response.amountPaid * 100, // Convert back to kobo
                currency: response.currencyCode,
                paid_at: new Date().toISOString(),
                channel: response.paymentMethod,
                customer: {
                  email: paymentData.email,
                  first_name: paymentData.metadata?.customer_name?.split(' ')[0] || '',
                  last_name: paymentData.metadata?.customer_name?.split(' ').slice(1).join(' ') || ''
                }
              });
            } else {
              reject({
                code: 'PAYMENT_FAILED',
                message: response.message || 'Payment was not successful',
                details: response
              });
            }
          },
          onClose: (data: any) => {
            console.log('Monnify payment window closed:', data);
            reject({
              code: 'PAYMENT_CANCELLED',
              message: 'Payment was cancelled by user'
            });
          }
        });
      });
    } catch (error) {
      console.error('Monnify initialization failed:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Verify Monnify payment
   */
  async verifyPayment(reference: string): Promise<PaymentVerificationResponse> {
    try {
      // Get access token first
      const accessToken = await this.getAccessToken();

      const response = await fetch(`${this.baseUrl}/api/v2/transactions/${reference}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.requestSuccessful) {
        throw new Error(data.responseMessage || 'Payment verification failed');
      }

      const transactionData = data.responseBody;

      return {
        success: data.requestSuccessful,
        data: {
          id: transactionData.transactionReference,
          domain: 'monnify',
          status: this.mapMonnifyStatus(transactionData.paymentStatus),
          reference: transactionData.paymentReference,
          amount: transactionData.amountPaid * 100, // Convert to kobo
          message: transactionData.paymentDescription || transactionData.paymentStatus,
          gateway_response: transactionData.paymentStatus,
          paid_at: transactionData.paidOn,
          created_at: transactionData.createdOn,
          channel: transactionData.paymentMethod,
          currency: transactionData.currencyCode,
          ip_address: '',
          metadata: transactionData.metaData || {},
          fees: (transactionData.fee || 0) * 100, // Convert to kobo
          fees_split: null,
          authorization: transactionData.cardDetails || null,
          customer: {
            email: transactionData.customerEmail,
            first_name: transactionData.customerName?.split(' ')[0] || '',
            last_name: transactionData.customerName?.split(' ').slice(1).join(' ') || ''
          },
          plan: null,
          split: null,
          order_id: null,
          paidAt: transactionData.paidOn,
          createdAt: transactionData.createdOn,
          requested_amount: transactionData.amount * 100, // Convert to kobo
          pos_transaction_data: null,
          source: null,
          fees_breakdown: null
        }
      };
    } catch (error) {
      console.error('Monnify verification failed:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get access token for API calls
   */
  private async getAccessToken(): Promise<string> {
    try {
      const credentials = btoa(`${this.config.publicKey}:${this.config.secretKey}`);
      
      const response = await fetch(`${this.baseUrl}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.requestSuccessful) {
        throw new Error(data.responseMessage || 'Failed to get access token');
      }

      return data.responseBody.accessToken;
    } catch (error) {
      console.error('Failed to get Monnify access token:', error);
      throw error;
    }
  }

  /**
   * Get list of Nigerian banks for bank transfer
   */
  async getBanks(): Promise<any[]> {
    try {
      const accessToken = await this.getAccessToken();

      const response = await fetch(`${this.baseUrl}/api/v1/banks`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.responseBody || [];
    } catch (error) {
      console.error('Failed to fetch banks:', error);
      return [];
    }
  }

  /**
   * Load Monnify inline script
   */
  private loadMonnifyScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if ((window as any).MonnifySDK) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = this.config.environment === 'live' 
        ? 'https://sdk.monnify.com/plugin/monnify.js'
        : 'https://sandbox.sdk.monnify.com/plugin/monnify.js';
      script.async = true;
      
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Monnify script'));

      document.head.appendChild(script);
    });
  }

  /**
   * Map Monnify status to our standard status
   */
  private mapMonnifyStatus(status: string): any {
    const statusMap: Record<string, any> = {
      'PAID': 'success',
      'FAILED': 'failed',
      'CANCELLED': 'cancelled',
      'PENDING': 'pending',
      'ABANDONED': 'abandoned'
    };

    return statusMap[status] || 'pending';
  }

  /**
   * Handle Monnify errors
   */
  private handleError(error: any): PaymentError {
    if (error instanceof Error) {
      return {
        code: 'MONNIFY_ERROR',
        message: error.message,
        details: error
      };
    }

    if (typeof error === 'object' && error.code) {
      return {
        code: error.code,
        message: error.message || 'Monnify error occurred',
        details: error
      };
    }

    return {
      code: 'UNKNOWN_MONNIFY_ERROR',
      message: 'An unknown Monnify error occurred',
      details: error
    };
  }

  /**
   * Format amount to naira (Monnify expects amounts in naira)
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
