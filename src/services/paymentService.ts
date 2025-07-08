// Enhanced Payment Service for Real-World Integration
import { PaymentProvider } from '@/types/payment';

export interface PaymentVerificationResult {
  success: boolean;
  data: {
    id: string;
    reference: string;
    amount: number;
    status: 'success' | 'failed' | 'pending' | 'abandoned';
    gateway_response: string;
    paid_at: string;
    created_at: string;
    channel: string;
    currency: string;
    ip_address?: string;
    metadata: any;
    log: any;
    fees: number;
    fees_split: any;
    authorization: {
      authorization_code: string;
      bin: string;
      last4: string;
      exp_month: string;
      exp_year: string;
      channel: string;
      card_type: string;
      bank: string;
      country_code: string;
      brand: string;
      reusable: boolean;
      signature: string;
    };
    customer: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      customer_code: string;
      phone: string;
      metadata: any;
      risk_action: string;
    };
    plan: any;
    split: any;
    order_id: any;
    paidAt: string;
    createdAt: string;
    requested_amount: number;
    pos_transaction_data: any;
    source: any;
    fees_breakdown: any;
  };
  message: string;
}

export interface PaymentInitializationData {
  email: string;
  amount: number;
  reference: string;
  callback_url: string;
  metadata: {
    tenant_id: string;
    property_id: string;
    payment_items: string[];
    custom_fields: Array<{
      display_name: string;
      variable_name: string;
      value: string;
    }>;
  };
  channels?: string[];
  currency?: string;
  plan?: string;
  invoice_limit?: number;
  split_code?: string;
  subaccount?: string;
  transaction_charge?: number;
  bearer?: 'account' | 'subaccount';
}

class PaymentService {
  private baseUrl = 'https://api.paystack.co';
  private secretKey = import.meta.env.VITE_PAYSTACK_SECRET_KEY;

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.secretKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Payment API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  async verifyPayment(reference: string, provider: PaymentProvider = 'paystack'): Promise<PaymentVerificationResult> {
    try {
      switch (provider) {
        case 'paystack':
          return await this.verifyPaystackPayment(reference);
        case 'flutterwave':
          return await this.verifyFlutterwavePayment(reference);
        case 'monnify':
          return await this.verifyMonnifyPayment(reference);
        default:
          throw new Error(`Unsupported payment provider: ${provider}`);
      }
    } catch (error) {
      console.error('Payment verification failed:', error);
      return {
        success: false,
        data: {} as any,
        message: error instanceof Error ? error.message : 'Verification failed'
      };
    }
  }

  private async verifyPaystackPayment(reference: string): Promise<PaymentVerificationResult> {
    const response = await this.makeRequest(`/transaction/verify/${reference}`);
    
    return {
      success: response.status === true,
      data: response.data,
      message: response.message
    };
  }

  private async verifyFlutterwavePayment(reference: string): Promise<PaymentVerificationResult> {
    // Flutterwave verification implementation
    // This would use Flutterwave's API
    throw new Error('Flutterwave verification not implemented yet');
  }

  private async verifyMonnifyPayment(reference: string): Promise<PaymentVerificationResult> {
    // Monnify verification implementation
    // This would use Monnify's API
    throw new Error('Monnify verification not implemented yet');
  }

  async initializePayment(data: PaymentInitializationData): Promise<any> {
    try {
      const response = await this.makeRequest('/transaction/initialize', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      return {
        success: response.status === true,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Payment initialization failed:', error);
      return {
        success: false,
        data: null,
        message: error instanceof Error ? error.message : 'Initialization failed'
      };
    }
  }

  async getPaymentHistory(customerId: string, page: number = 1, perPage: number = 50): Promise<any> {
    try {
      const response = await this.makeRequest(
        `/transaction?customer=${customerId}&page=${page}&perPage=${perPage}`
      );

      return {
        success: response.status === true,
        data: response.data,
        meta: response.meta,
        message: response.message
      };
    } catch (error) {
      console.error('Failed to fetch payment history:', error);
      return {
        success: false,
        data: [],
        message: error instanceof Error ? error.message : 'Failed to fetch history'
      };
    }
  }

  async createCustomer(customerData: {
    email: string;
    first_name: string;
    last_name: string;
    phone?: string;
    metadata?: any;
  }): Promise<any> {
    try {
      const response = await this.makeRequest('/customer', {
        method: 'POST',
        body: JSON.stringify(customerData),
      });

      return {
        success: response.status === true,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Customer creation failed:', error);
      return {
        success: false,
        data: null,
        message: error instanceof Error ? error.message : 'Customer creation failed'
      };
    }
  }

  async getTransactionTimeline(reference: string): Promise<any> {
    try {
      const response = await this.makeRequest(`/transaction/timeline/${reference}`);

      return {
        success: response.status === true,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Failed to fetch transaction timeline:', error);
      return {
        success: false,
        data: [],
        message: error instanceof Error ? error.message : 'Failed to fetch timeline'
      };
    }
  }

  async refundTransaction(reference: string, amount?: number, reason?: string): Promise<any> {
    try {
      const refundData: any = { transaction: reference };
      if (amount) refundData.amount = amount;
      if (reason) refundData.merchant_note = reason;

      const response = await this.makeRequest('/refund', {
        method: 'POST',
        body: JSON.stringify(refundData),
      });

      return {
        success: response.status === true,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Refund failed:', error);
      return {
        success: false,
        data: null,
        message: error instanceof Error ? error.message : 'Refund failed'
      };
    }
  }

  async validateBankAccount(accountNumber: string, bankCode: string): Promise<any> {
    try {
      const response = await this.makeRequest(
        `/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`
      );

      return {
        success: response.status === true,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Bank account validation failed:', error);
      return {
        success: false,
        data: null,
        message: error instanceof Error ? error.message : 'Validation failed'
      };
    }
  }

  async getBanks(): Promise<any> {
    try {
      const response = await this.makeRequest('/bank');

      return {
        success: response.status === true,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Failed to fetch banks:', error);
      return {
        success: false,
        data: [],
        message: error instanceof Error ? error.message : 'Failed to fetch banks'
      };
    }
  }

  // Webhook verification
  verifyWebhookSignature(payload: string, signature: string): boolean {
    const crypto = require('crypto');
    const hash = crypto
      .createHmac('sha512', this.secretKey)
      .update(payload, 'utf-8')
      .digest('hex');
    
    return hash === signature;
  }

  // Format amount for display
  formatAmount(amount: number, currency: string = 'NGN'): string {
    const symbols = {
      NGN: '₦',
      USD: '$',
      EUR: '€',
      GBP: '£'
    };

    const symbol = symbols[currency as keyof typeof symbols] || currency;
    return `${symbol}${(amount / 100).toLocaleString()}`;
  }

  // Calculate fees
  calculatePaystackFees(amount: number): number {
    // Paystack charges 1.5% + ₦100 for local cards
    // and 3.9% for international cards
    // This is a simplified calculation for local cards
    const percentageFee = Math.round(amount * 0.015);
    const fixedFee = 10000; // ₦100 in kobo
    return percentageFee + fixedFee;
  }

  // Generate payment reference
  generateReference(prefix: string = 'PHC'): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}_${timestamp}_${random}`;
  }
}

export const paymentService = new PaymentService();
export default PaymentService;
