# Nigerian Payment Providers Integration

This document outlines the comprehensive payment integration implemented for PHCityRent, supporting multiple Nigerian payment providers.

## 🚀 Overview

The payment system supports three major Nigerian payment providers:
- **Paystack** (Primary/Recommended)
- **Flutterwave** (Alternative)
- **Monnify** (Alternative)

## 📋 Features

### ✅ Implemented Features
- **Multi-provider support** with seamless switching
- **Unified payment interface** across all providers
- **Real-time payment verification**
- **Transaction history tracking**
- **Payment status monitoring**
- **Comprehensive error handling**
- **Receipt generation and download**
- **Mobile-responsive payment flows**
- **Secure payment processing**
- **Webhook support for real-time updates**

### 🔧 Payment Methods Supported
- **Card Payments** (Visa, Mastercard, Verve)
- **Bank Transfer** (All Nigerian banks)
- **USSD** (All major networks)
- **Mobile Money** (Where supported)
- **QR Code Payments**

## 🏗️ Architecture

### Core Components

#### 1. Payment Service (`src/services/payment/PaymentService.ts`)
- Central payment orchestrator
- Provider management and switching
- Transaction recording and tracking
- Error handling and retry logic

#### 2. Provider Services
- **PaystackService** (`src/services/payment/providers/PaystackService.ts`)
- **FlutterwaveService** (`src/services/payment/providers/FlutterwaveService.ts`)
- **MonnifyService** (`src/services/payment/providers/MonnifyService.ts`)

#### 3. Payment Hooks
- **usePayment** - Main payment hook with multi-provider support
- **usePaystack** - Enhanced Paystack-specific hook
- **useRentPayment** - Specialized rent payment hook
- **useTransactionHistory** - Transaction tracking hook

#### 4. UI Components
- **PaymentProviderSelector** - Provider selection interface
- **EnhancedPaymentDashboard** - Complete payment dashboard
- **PaymentCallback** - Payment result handling page

### Database Schema

#### Payment Transactions Table
```sql
CREATE TABLE public.payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  property_id UUID REFERENCES public.properties(id),
  agent_id TEXT REFERENCES public.agent_applications(agent_id),
  reference TEXT UNIQUE NOT NULL,
  provider TEXT NOT NULL, -- 'paystack', 'flutterwave', 'monnify'
  transaction_type TEXT NOT NULL, -- 'rent_payment', 'security_deposit', etc.
  amount INTEGER NOT NULL, -- Amount in kobo
  currency TEXT DEFAULT 'NGN',
  status TEXT DEFAULT 'pending',
  provider_response JSONB,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  paid_at TIMESTAMPTZ,
  failed_at TIMESTAMPTZ,
  fees INTEGER,
  net_amount INTEGER
);
```

## 🔧 Setup Instructions

### 1. Environment Configuration

Copy `.env.example` to `.env` and configure:

```bash
# Paystack Configuration
VITE_PAYSTACK_PUBLIC_KEY=pk_test_your_paystack_public_key
VITE_PAYSTACK_SECRET_KEY=sk_test_your_paystack_secret_key

# Flutterwave Configuration  
VITE_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-your-flutterwave-public-key
VITE_FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-your-flutterwave-secret-key

# Monnify Configuration
VITE_MONNIFY_API_KEY=MK_TEST_your_monnify_api_key
VITE_MONNIFY_SECRET_KEY=your_monnify_secret_key
VITE_MONNIFY_CONTRACT_CODE=your_contract_code
```

### 2. Database Migration

Run the payment tables migration:

```bash
# Apply the payment migration
supabase db push
```

### 3. Provider Setup

#### Paystack Setup
1. Create account at [paystack.com](https://paystack.com)
2. Get API keys from dashboard
3. Configure webhook URL: `https://yourdomain.com/api/webhooks/paystack`

#### Flutterwave Setup
1. Create account at [flutterwave.com](https://flutterwave.com)
2. Get API keys from dashboard
3. Configure webhook URL: `https://yourdomain.com/api/webhooks/flutterwave`

#### Monnify Setup
1. Create account at [monnify.com](https://monnify.com)
2. Get API key and contract code
3. Configure webhook URL: `https://yourdomain.com/api/webhooks/monnify`

## 💻 Usage Examples

### Basic Payment Implementation

```typescript
import { usePayment } from '@/hooks/usePayment';

const PaymentComponent = () => {
  const { initializePayment, isLoading } = usePayment();

  const handlePayment = async () => {
    try {
      await initializePayment({
        email: 'user@example.com',
        amount: 50000, // Amount in kobo (₦500)
        reference: 'PHC_RENT_123456',
        metadata: {
          transaction_type: 'rent_payment',
          property_id: 'prop-123',
          tenant_name: 'John Doe'
        }
      }, 'paystack'); // Provider selection
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };

  return (
    <button onClick={handlePayment} disabled={isLoading}>
      {isLoading ? 'Processing...' : 'Pay Now'}
    </button>
  );
};
```

### Rent Payment Hook

```typescript
import { useRentPayment } from '@/hooks/usePayment';

const RentPaymentComponent = () => {
  const { payRent, isLoading } = useRentPayment();

  const handleRentPayment = async () => {
    try {
      await payRent({
        propertyId: 'prop-123',
        amount: 500, // Amount in naira
        tenantEmail: 'tenant@example.com',
        tenantName: 'John Doe',
        tenantPhone: '+2348012345678',
        provider: 'paystack'
      });
    } catch (error) {
      console.error('Rent payment failed:', error);
    }
  };

  return (
    <button onClick={handleRentPayment} disabled={isLoading}>
      Pay Rent
    </button>
  );
};
```

### Transaction History

```typescript
import { useTransactionHistory } from '@/hooks/usePayment';

const TransactionHistory = () => {
  const { data: transactions, isLoading } = useTransactionHistory();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {transactions.map(transaction => (
        <div key={transaction.id}>
          <p>{transaction.reference}</p>
          <p>{formatAmount(transaction.amount)}</p>
          <p>{transaction.status}</p>
        </div>
      ))}
    </div>
  );
};
```

## 🔒 Security Features

### 1. Data Protection
- All sensitive data encrypted in transit and at rest
- API keys stored securely in environment variables
- Payment data never stored in plain text

### 2. Transaction Security
- Unique reference generation for each transaction
- Payment verification before confirmation
- Webhook signature verification
- Rate limiting on payment endpoints

### 3. User Security
- Row Level Security (RLS) on all payment tables
- User can only access their own transactions
- Admin-only access to sensitive operations

## 🧪 Testing

### Test Cards (Paystack)
```
Card Number: 4084084084084081
Expiry: Any future date
CVV: Any 3 digits
```

### Test Cards (Flutterwave)
```
Card Number: 5531886652142950
Expiry: Any future date
CVV: Any 3 digits
```

### Test Environment
All providers are configured for test mode by default. Switch to live mode by:
1. Updating environment variables with live keys
2. Setting `VITE_ENVIRONMENT=production`

## 📊 Monitoring & Analytics

### Transaction Tracking
- Real-time payment status updates
- Success/failure rate monitoring
- Provider performance comparison
- Revenue tracking and reporting

### Error Handling
- Comprehensive error logging
- Automatic retry mechanisms
- User-friendly error messages
- Support ticket integration

## 🚀 Deployment

### Production Checklist
- [ ] Update environment variables with live API keys
- [ ] Configure production webhook URLs
- [ ] Set up SSL certificates
- [ ] Configure rate limiting
- [ ] Set up monitoring and alerting
- [ ] Test all payment flows
- [ ] Configure backup payment providers

### Webhook Configuration
Set up webhook endpoints for real-time payment updates:
- `/api/webhooks/paystack`
- `/api/webhooks/flutterwave`
- `/api/webhooks/monnify`

## 🆘 Support & Troubleshooting

### Common Issues

#### Payment Initialization Fails
- Check API keys are correct
- Verify network connectivity
- Check provider service status

#### Payment Verification Fails
- Ensure webhook URLs are configured
- Check transaction reference format
- Verify provider response handling

#### Transaction Not Found
- Check reference format
- Verify database connection
- Check RLS policies

### Support Contacts
- **Paystack Support**: support@paystack.com
- **Flutterwave Support**: support@flutterwave.com
- **Monnify Support**: support@monnify.com

## 📈 Future Enhancements

### Planned Features
- [ ] Recurring payment subscriptions
- [ ] Split payments for agent commissions
- [ ] Refund processing automation
- [ ] Advanced analytics dashboard
- [ ] Mobile app integration
- [ ] International payment support
- [ ] Cryptocurrency payments
- [ ] Payment plan management

### Performance Optimizations
- [ ] Payment provider load balancing
- [ ] Caching for transaction history
- [ ] Async payment processing
- [ ] Batch payment operations

This comprehensive payment integration provides a robust, secure, and user-friendly payment experience for all PHCityRent users while supporting the most popular Nigerian payment providers.
