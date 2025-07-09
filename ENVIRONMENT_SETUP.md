# Environment Setup Guide

This guide will help you set up the environment variables needed to run PHCityRent locally.

## Quick Setup

1. **Copy the example environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Update the values in `.env` with your actual credentials**

## Required Environment Variables

### 🔧 Supabase Configuration (Required)

Get these from your [Supabase Dashboard](https://supabase.com/dashboard):

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

**How to get these:**
1. Go to your Supabase project dashboard
2. Navigate to Settings → API
3. Copy the Project URL and anon/public key

### 💳 Payment Provider Configuration (Required)

#### Paystack (Primary Payment Provider)
Get these from your [Paystack Dashboard](https://dashboard.paystack.com):

```env
VITE_PAYSTACK_PUBLIC_KEY=pk_test_your-paystack-public-key
VITE_PAYSTACK_SECRET_KEY=sk_test_your-paystack-secret-key
```

**How to get these:**
1. Sign up/login to Paystack
2. Go to Settings → API Keys & Webhooks
3. Copy your Test Public Key and Test Secret Key

## Optional Environment Variables

### 🌍 Additional Payment Providers

#### Flutterwave
```env
VITE_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-your-flutterwave-public-key
VITE_FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-your-flutterwave-secret-key
```

#### Monnify
```env
VITE_MONNIFY_API_KEY=MK_TEST_your_monnify_api_key
VITE_MONNIFY_SECRET_KEY=your_monnify_secret_key
VITE_MONNIFY_CONTRACT_CODE=your_contract_code
```

### 🗺️ Maps Integration
```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token
```

### 📧 Communication Services
```env
VITE_WHATSAPP_NUMBER=+2348012345678
VITE_SUPPORT_EMAIL=support@phcityrent.com
VITE_SUPPORT_PHONE=+2348012345678
```

### 📊 Analytics (Optional)
```env
VITE_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
VITE_FACEBOOK_PIXEL_ID=your_facebook_pixel_id
```

## Environment-Specific Settings

### Development
```env
VITE_ENVIRONMENT=development
VITE_APP_URL=http://localhost:8081
VITE_ENABLE_DEVTOOLS=true
VITE_ENABLE_MOCK_DATA=false
```

### Production
```env
VITE_ENVIRONMENT=production
VITE_APP_URL=https://your-domain.com
VITE_ENABLE_DEVTOOLS=false
VITE_ENABLE_MOCK_DATA=false
```

## Security Best Practices

### ⚠️ Important Security Notes

1. **Never commit `.env` files to version control**
2. **Use test keys for development**
3. **Rotate keys regularly in production**
4. **Use environment-specific keys**

### 🔒 Key Management

- **Development**: Use test/sandbox keys
- **Staging**: Use separate staging keys
- **Production**: Use production keys with restricted permissions

## Feature Flags

Control which features are enabled:

```env
VITE_ENABLE_ESCROW=true
VITE_ENABLE_AGENT_VERIFICATION=true
VITE_ENABLE_PROPERTY_VERIFICATION=true
VITE_ENABLE_MAINTENANCE_REQUESTS=true
VITE_ENABLE_MESSAGING=true
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_ANALYTICS=true
```

## Troubleshooting

### Common Issues

1. **Supabase Connection Error**
   - Verify your Supabase URL and anon key
   - Check if your Supabase project is active

2. **Payment Integration Error**
   - Ensure you're using the correct test/live keys
   - Verify your Paystack account is active

3. **Environment Variables Not Loading**
   - Restart your development server after changing `.env`
   - Ensure variables start with `VITE_`

### Getting Help

If you encounter issues:

1. Check the [Supabase Documentation](https://supabase.com/docs)
2. Review [Paystack API Documentation](https://paystack.com/docs)
3. Create an issue in the repository

## Development Workflow

1. **Initial Setup:**
   ```bash
   cp .env.example .env
   # Update .env with your credentials
   npm install
   npm run dev
   ```

2. **Adding New Environment Variables:**
   - Add to `.env.example` with placeholder values
   - Add to your local `.env` with actual values
   - Update this documentation

3. **Before Deployment:**
   - Verify all required environment variables are set
   - Test with production-like environment variables
   - Ensure sensitive data is not exposed

## Support

For environment setup support, contact:
- Email: support@phcityrent.com
- WhatsApp: +2348012345678
