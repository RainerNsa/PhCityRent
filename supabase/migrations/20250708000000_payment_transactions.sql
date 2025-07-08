-- Create payment_transactions table for comprehensive payment tracking
CREATE TABLE public.payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  agent_id TEXT REFERENCES public.agent_applications(agent_id) ON DELETE SET NULL,
  reference TEXT UNIQUE NOT NULL,
  provider TEXT NOT NULL, -- 'paystack', 'flutterwave', 'monnify', 'remita'
  transaction_type TEXT NOT NULL DEFAULT 'rent_payment', -- 'rent_payment', 'security_deposit', 'agent_commission', 'maintenance_fee', 'escrow_deposit', 'service_charge'
  amount INTEGER NOT NULL, -- Amount in kobo (NGN) or cents (USD)
  currency TEXT DEFAULT 'NGN',
  status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'success', 'failed', 'cancelled', 'abandoned'
  provider_response JSONB,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  paid_at TIMESTAMPTZ,
  failed_at TIMESTAMPTZ,
  fees INTEGER, -- Provider fees in kobo/cents
  net_amount INTEGER, -- Amount after fees
  gateway_response TEXT,
  channel TEXT, -- 'card', 'bank_transfer', 'ussd', 'mobile_money', etc.
  ip_address INET,
  customer_email TEXT,
  customer_name TEXT,
  customer_phone TEXT
);

-- Create indexes for better query performance
CREATE INDEX idx_payment_transactions_user_id ON public.payment_transactions(user_id);
CREATE INDEX idx_payment_transactions_property_id ON public.payment_transactions(property_id);
CREATE INDEX idx_payment_transactions_agent_id ON public.payment_transactions(agent_id);
CREATE INDEX idx_payment_transactions_reference ON public.payment_transactions(reference);
CREATE INDEX idx_payment_transactions_provider ON public.payment_transactions(provider);
CREATE INDEX idx_payment_transactions_status ON public.payment_transactions(status);
CREATE INDEX idx_payment_transactions_created_at ON public.payment_transactions(created_at);
CREATE INDEX idx_payment_transactions_transaction_type ON public.payment_transactions(transaction_type);

-- Create payment_webhooks table for webhook event tracking
CREATE TABLE public.payment_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL,
  event_type TEXT NOT NULL,
  reference TEXT,
  transaction_id TEXT,
  payload JSONB NOT NULL,
  processed BOOLEAN DEFAULT false,
  processed_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes for webhook table
CREATE INDEX idx_payment_webhooks_provider ON public.payment_webhooks(provider);
CREATE INDEX idx_payment_webhooks_reference ON public.payment_webhooks(reference);
CREATE INDEX idx_payment_webhooks_processed ON public.payment_webhooks(processed);
CREATE INDEX idx_payment_webhooks_created_at ON public.payment_webhooks(created_at);

-- Create payment_plans table for recurring payments
CREATE TABLE public.payment_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  plan_code TEXT NOT NULL,
  name TEXT NOT NULL,
  amount INTEGER NOT NULL, -- Amount in kobo/cents
  currency TEXT DEFAULT 'NGN',
  interval_type TEXT NOT NULL, -- 'daily', 'weekly', 'monthly', 'quarterly', 'yearly'
  interval_value INTEGER DEFAULT 1,
  status TEXT DEFAULT 'active', -- 'active', 'paused', 'cancelled', 'completed'
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  next_payment_date TIMESTAMPTZ,
  total_payments INTEGER DEFAULT 0,
  successful_payments INTEGER DEFAULT 0,
  failed_payments INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes for payment plans
CREATE INDEX idx_payment_plans_user_id ON public.payment_plans(user_id);
CREATE INDEX idx_payment_plans_property_id ON public.payment_plans(property_id);
CREATE INDEX idx_payment_plans_provider ON public.payment_plans(provider);
CREATE INDEX idx_payment_plans_status ON public.payment_plans(status);
CREATE INDEX idx_payment_plans_next_payment_date ON public.payment_plans(next_payment_date);

-- Create payment_refunds table for refund tracking
CREATE TABLE public.payment_refunds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID REFERENCES public.payment_transactions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  refund_reference TEXT UNIQUE NOT NULL,
  amount INTEGER NOT NULL, -- Refund amount in kobo/cents
  reason TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'success', 'failed'
  provider_response JSONB,
  processed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  processed_at TIMESTAMPTZ
);

-- Create indexes for refunds
CREATE INDEX idx_payment_refunds_transaction_id ON public.payment_refunds(transaction_id);
CREATE INDEX idx_payment_refunds_user_id ON public.payment_refunds(user_id);
CREATE INDEX idx_payment_refunds_status ON public.payment_refunds(status);

-- Enable RLS for all payment tables
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_refunds ENABLE ROW LEVEL SECURITY;

-- RLS policies for payment_transactions
CREATE POLICY "Users can view their own payment transactions" 
  ON public.payment_transactions 
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own payment transactions" 
  ON public.payment_transactions 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own payment transactions" 
  ON public.payment_transactions 
  FOR UPDATE 
  USING (user_id = auth.uid());

-- Admin policies for payment_transactions
CREATE POLICY "Admins can view all payment transactions" 
  ON public.payment_transactions 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can update all payment transactions" 
  ON public.payment_transactions 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

-- RLS policies for payment_webhooks (admin only)
CREATE POLICY "Only admins can access payment webhooks" 
  ON public.payment_webhooks 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

-- RLS policies for payment_plans
CREATE POLICY "Users can manage their own payment plans" 
  ON public.payment_plans 
  FOR ALL 
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all payment plans" 
  ON public.payment_plans 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

-- RLS policies for payment_refunds
CREATE POLICY "Users can view their own refunds" 
  ON public.payment_refunds 
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can create refund requests" 
  ON public.payment_refunds 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage all refunds" 
  ON public.payment_refunds 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

-- Create function to update payment transaction status
CREATE OR REPLACE FUNCTION update_payment_transaction_status()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  
  -- Set paid_at when status changes to success
  IF NEW.status = 'success' AND OLD.status != 'success' THEN
    NEW.paid_at = now();
  END IF;
  
  -- Set failed_at when status changes to failed
  IF NEW.status = 'failed' AND OLD.status != 'failed' THEN
    NEW.failed_at = now();
  END IF;
  
  -- Calculate net amount if fees are provided
  IF NEW.fees IS NOT NULL THEN
    NEW.net_amount = NEW.amount - NEW.fees;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for payment transaction updates
CREATE TRIGGER payment_transaction_update_trigger
  BEFORE UPDATE ON public.payment_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_payment_transaction_status();

-- Create function to generate payment reference
CREATE OR REPLACE FUNCTION generate_payment_reference(provider_name TEXT)
RETURNS TEXT AS $$
DECLARE
  timestamp_part TEXT;
  random_part TEXT;
BEGIN
  timestamp_part := EXTRACT(EPOCH FROM now())::TEXT;
  random_part := substr(md5(random()::text), 1, 8);
  
  RETURN 'PHC_' || upper(provider_name) || '_' || timestamp_part || '_' || random_part;
END;
$$ LANGUAGE plpgsql;

-- Add comments for documentation
COMMENT ON TABLE public.payment_transactions IS 'Comprehensive payment transaction tracking for all Nigerian payment providers';
COMMENT ON TABLE public.payment_webhooks IS 'Webhook event tracking for payment providers';
COMMENT ON TABLE public.payment_plans IS 'Recurring payment plans and subscriptions';
COMMENT ON TABLE public.payment_refunds IS 'Payment refund requests and processing';

COMMENT ON COLUMN public.payment_transactions.amount IS 'Amount in kobo for NGN or cents for USD';
COMMENT ON COLUMN public.payment_transactions.fees IS 'Provider fees in kobo/cents';
COMMENT ON COLUMN public.payment_transactions.net_amount IS 'Amount after deducting fees';
COMMENT ON COLUMN public.payment_transactions.provider_response IS 'Full response from payment provider';
COMMENT ON COLUMN public.payment_transactions.metadata IS 'Additional transaction metadata';
