
-- Create escrow_transactions table to track secure payments
CREATE TABLE public.escrow_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  landlord_id UUID,
  tenant_email TEXT NOT NULL,
  tenant_name TEXT NOT NULL,
  tenant_phone TEXT,
  amount INTEGER NOT NULL, -- Amount in cents
  currency TEXT DEFAULT 'usd',
  transaction_type TEXT DEFAULT 'rent_deposit', -- rent_deposit, security_deposit, etc.
  status TEXT DEFAULT 'pending', -- pending, funds_held, released, refunded, disputed
  stripe_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  escrow_fee INTEGER, -- Fee in cents (2.5% of transaction)
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  funds_released_at TIMESTAMPTZ,
  dispute_reason TEXT,
  admin_notes TEXT
);

-- Create escrow_milestones table to track transaction progress
CREATE TABLE public.escrow_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID REFERENCES public.escrow_transactions(id) ON DELETE CASCADE,
  milestone_type TEXT NOT NULL, -- funds_deposited, agreement_verified, keys_transferred, funds_released
  status TEXT DEFAULT 'pending', -- pending, completed, failed
  completed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.escrow_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escrow_milestones ENABLE ROW LEVEL SECURITY;

-- RLS policies for escrow_transactions
CREATE POLICY "Users can view their own transactions" 
  ON public.escrow_transactions 
  FOR SELECT 
  USING (user_id = auth.uid() OR tenant_email = auth.email());

CREATE POLICY "Users can create their own transactions" 
  ON public.escrow_transactions 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage all transactions" 
  ON public.escrow_transactions 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS policies for escrow_milestones
CREATE POLICY "Users can view milestones for their transactions" 
  ON public.escrow_milestones 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.escrow_transactions 
      WHERE id = transaction_id 
      AND (user_id = auth.uid() OR tenant_email = auth.email())
    )
  );

CREATE POLICY "System can manage milestones" 
  ON public.escrow_milestones 
  FOR ALL 
  USING (true);

-- Create saved_searches table for tenant experience
CREATE TABLE public.saved_searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  search_name TEXT NOT NULL,
  search_criteria JSONB NOT NULL,
  alert_frequency TEXT DEFAULT 'daily', -- instant, daily, weekly
  is_active BOOLEAN DEFAULT true,
  last_alert_sent TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create property_alerts table
CREATE TABLE public.property_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  alert_type TEXT NOT NULL, -- price_drop, new_match, back_available
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS for new tables
ALTER TABLE public.saved_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_alerts ENABLE ROW LEVEL SECURITY;

-- RLS policies for saved_searches
CREATE POLICY "Users can manage their own saved searches" 
  ON public.saved_searches 
  FOR ALL 
  USING (user_id = auth.uid());

-- RLS policies for property_alerts
CREATE POLICY "Users can manage their own alerts" 
  ON public.property_alerts 
  FOR ALL 
  USING (user_id = auth.uid());

-- Create analytics tables for admin features
CREATE TABLE public.system_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  metric_date DATE NOT NULL DEFAULT CURRENT_DATE,
  additional_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS for analytics
ALTER TABLE public.system_analytics ENABLE ROW LEVEL SECURITY;

-- Only admins can view system analytics
CREATE POLICY "Admins can manage system analytics" 
  ON public.system_analytics 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'));

-- Add triggers for updated_at
CREATE TRIGGER update_escrow_transactions_updated_at
  BEFORE UPDATE ON public.escrow_transactions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_saved_searches_updated_at
  BEFORE UPDATE ON public.saved_searches
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
