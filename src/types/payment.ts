// Payment types and interfaces for Nigerian payment providers

export type PaymentProvider = 'paystack' | 'flutterwave' | 'monnify' | 'remita';

export type PaymentStatus = 
  | 'pending' 
  | 'processing' 
  | 'success' 
  | 'failed' 
  | 'cancelled' 
  | 'abandoned';

export type TransactionType = 
  | 'rent_payment' 
  | 'security_deposit' 
  | 'agent_commission' 
  | 'maintenance_fee' 
  | 'escrow_deposit' 
  | 'service_charge';

export interface PaymentConfig {
  provider: PaymentProvider;
  publicKey: string;
  secretKey?: string;
  environment: 'test' | 'live';
  currency: 'NGN' | 'USD';
  callbackUrl?: string;
  webhookUrl?: string;
}

export interface PaymentData {
  email: string;
  amount: number; // Amount in kobo for NGN
  reference: string;
  currency?: 'NGN' | 'USD';
  metadata?: Record<string, any>;
  callback_url?: string;
  channels?: string[];
  customization?: {
    title?: string;
    description?: string;
    logo?: string;
  };
}

export interface PaymentResponse {
  success: boolean;
  reference: string;
  transaction_id?: string;
  status: PaymentStatus;
  amount: number;
  currency: string;
  paid_at?: string;
  channel?: string;
  fees?: number;
  authorization?: {
    authorization_code?: string;
    bin?: string;
    last4?: string;
    exp_month?: string;
    exp_year?: string;
    channel?: string;
    card_type?: string;
    bank?: string;
    country_code?: string;
    brand?: string;
    reusable?: boolean;
    signature?: string;
  };
  customer?: {
    id?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
  };
  log?: {
    start_time?: number;
    time_spent?: number;
    attempts?: number;
    errors?: number;
    success?: boolean;
    mobile?: boolean;
    input?: any[];
    history?: any[];
  };
}

export interface PaymentVerificationResponse {
  success: boolean;
  data: {
    id: string;
    domain: string;
    status: PaymentStatus;
    reference: string;
    amount: number;
    message: string;
    gateway_response: string;
    paid_at: string;
    created_at: string;
    channel: string;
    currency: string;
    ip_address: string;
    metadata: Record<string, any>;
    fees: number;
    fees_split: any;
    authorization: any;
    customer: any;
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
}

export interface TransactionRecord {
  id: string;
  user_id: string;
  property_id?: string;
  agent_id?: string;
  reference: string;
  provider: PaymentProvider;
  transaction_type: TransactionType;
  amount: number;
  currency: string;
  status: PaymentStatus;
  provider_response?: any;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  paid_at?: string;
  failed_at?: string;
  fees?: number;
  net_amount?: number;
}

export interface PaymentWebhookData {
  event: string;
  data: {
    id: string;
    domain: string;
    status: string;
    reference: string;
    amount: number;
    message: string;
    gateway_response: string;
    paid_at: string;
    created_at: string;
    channel: string;
    currency: string;
    ip_address: string;
    metadata: Record<string, any>;
    fees: number;
    customer: {
      id: string;
      first_name: string;
      last_name: string;
      email: string;
      customer_code: string;
      phone: string;
      metadata: Record<string, any>;
      risk_action: string;
      international_format_phone: string;
    };
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
      account_name: string;
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
}

export interface PaymentError {
  code: string;
  message: string;
  details?: any;
}

// Bank codes for Nigerian banks (for bank transfer payments)
export const NIGERIAN_BANKS = {
  ACCESS_BANK: '044',
  CITIBANK: '023',
  DIAMOND_BANK: '063',
  ECOBANK: '050',
  FIDELITY_BANK: '070',
  FIRST_BANK: '011',
  FIRST_CITY_MONUMENT_BANK: '214',
  GUARANTY_TRUST_BANK: '058',
  HERITAGE_BANK: '030',
  KEYSTONE_BANK: '082',
  POLARIS_BANK: '076',
  PROVIDUS_BANK: '101',
  STANBIC_IBTC: '221',
  STANDARD_CHARTERED: '068',
  STERLING_BANK: '232',
  UNION_BANK: '032',
  UNITED_BANK_FOR_AFRICA: '033',
  UNITY_BANK: '215',
  WEMA_BANK: '035',
  ZENITH_BANK: '057',
} as const;

export type BankCode = typeof NIGERIAN_BANKS[keyof typeof NIGERIAN_BANKS];
