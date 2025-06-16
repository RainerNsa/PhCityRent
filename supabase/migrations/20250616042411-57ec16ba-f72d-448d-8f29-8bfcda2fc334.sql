
-- Create table for agent commissions tracking
CREATE TABLE public.agent_commissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id TEXT NOT NULL,
  property_id UUID REFERENCES public.properties(id),
  commission_type TEXT NOT NULL DEFAULT 'rental', -- 'rental', 'sale', 'management'
  commission_rate DECIMAL(5,2) NOT NULL, -- percentage
  commission_amount INTEGER NOT NULL, -- amount in cents
  transaction_amount INTEGER NOT NULL, -- total transaction amount in cents
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'paid', 'cancelled'
  earned_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  paid_date TIMESTAMP WITH TIME ZONE,
  payment_reference TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for rental agreements
CREATE TABLE public.rental_agreements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES public.properties(id) NOT NULL,
  tenant_id UUID REFERENCES auth.users(id),
  landlord_id UUID REFERENCES auth.users(id) NOT NULL,
  agent_id TEXT,
  agreement_type TEXT NOT NULL DEFAULT 'standard', -- 'standard', 'furnished', 'commercial'
  rent_amount INTEGER NOT NULL, -- monthly rent in cents
  security_deposit INTEGER NOT NULL, -- deposit amount in cents
  lease_start_date DATE NOT NULL,
  lease_end_date DATE NOT NULL,
  lease_duration_months INTEGER NOT NULL,
  agreement_terms JSONB NOT NULL DEFAULT '{}', -- flexible terms storage
  status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'pending_signature', 'signed', 'active', 'expired', 'terminated'
  generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  signed_at TIMESTAMP WITH TIME ZONE,
  tenant_signature TEXT,
  landlord_signature TEXT,
  witness_signature TEXT,
  document_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for maintenance requests (enhanced version)
CREATE TABLE public.maintenance_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES public.properties(id) NOT NULL,
  tenant_id UUID REFERENCES auth.users(id),
  landlord_id UUID REFERENCES auth.users(id),
  agent_id TEXT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL, -- 'plumbing', 'electrical', 'hvac', etc.
  priority TEXT NOT NULL DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
  status TEXT NOT NULL DEFAULT 'submitted', -- 'submitted', 'acknowledged', 'in_progress', 'completed', 'cancelled'
  urgency_level INTEGER DEFAULT 3, -- 1-5 scale
  estimated_cost INTEGER, -- estimated cost in cents
  actual_cost INTEGER, -- actual cost in cents
  contractor_name TEXT,
  contractor_contact TEXT,
  scheduled_date TIMESTAMP WITH TIME ZONE,
  completed_date TIMESTAMP WITH TIME ZONE,
  tenant_satisfaction_rating INTEGER, -- 1-5 rating
  tenant_feedback TEXT,
  images TEXT[], -- array of image URLs
  receipt_images TEXT[], -- array of receipt image URLs
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_agent_commissions_agent_id ON public.agent_commissions(agent_id);
CREATE INDEX idx_agent_commissions_property_id ON public.agent_commissions(property_id);
CREATE INDEX idx_agent_commissions_status ON public.agent_commissions(status);
CREATE INDEX idx_rental_agreements_property_id ON public.rental_agreements(property_id);
CREATE INDEX idx_rental_agreements_tenant_id ON public.rental_agreements(tenant_id);
CREATE INDEX idx_rental_agreements_landlord_id ON public.rental_agreements(landlord_id);
CREATE INDEX idx_rental_agreements_status ON public.rental_agreements(status);
CREATE INDEX idx_maintenance_requests_property_id ON public.maintenance_requests(property_id);
CREATE INDEX idx_maintenance_requests_tenant_id ON public.maintenance_requests(tenant_id);
CREATE INDEX idx_maintenance_requests_status ON public.maintenance_requests(status);
CREATE INDEX idx_maintenance_requests_priority ON public.maintenance_requests(priority);

-- Enable Row Level Security
ALTER TABLE public.agent_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rental_agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for agent_commissions
CREATE POLICY "Agents can view their own commissions" 
  ON public.agent_commissions 
  FOR SELECT 
  USING (
    agent_id = (SELECT agent_id FROM public.profiles WHERE id = auth.uid())
    OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can manage all commissions" 
  ON public.agent_commissions 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for rental_agreements
CREATE POLICY "Users can view their rental agreements" 
  ON public.rental_agreements 
  FOR SELECT 
  USING (
    tenant_id = auth.uid() 
    OR landlord_id = auth.uid() 
    OR agent_id = (SELECT agent_id FROM public.profiles WHERE id = auth.uid())
    OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Landlords and agents can create rental agreements" 
  ON public.rental_agreements 
  FOR INSERT 
  WITH CHECK (
    landlord_id = auth.uid() 
    OR agent_id = (SELECT agent_id FROM public.profiles WHERE id = auth.uid())
    OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Landlords and agents can update rental agreements" 
  ON public.rental_agreements 
  FOR UPDATE 
  USING (
    landlord_id = auth.uid() 
    OR agent_id = (SELECT agent_id FROM public.profiles WHERE id = auth.uid())
    OR public.has_role(auth.uid(), 'admin')
  );

-- RLS Policies for maintenance_requests
CREATE POLICY "Users can view related maintenance requests" 
  ON public.maintenance_requests 
  FOR SELECT 
  USING (
    tenant_id = auth.uid() 
    OR landlord_id = auth.uid() 
    OR agent_id = (SELECT agent_id FROM public.profiles WHERE id = auth.uid())
    OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Tenants can create maintenance requests" 
  ON public.maintenance_requests 
  FOR INSERT 
  WITH CHECK (
    tenant_id = auth.uid()
  );

CREATE POLICY "Landlords and agents can update maintenance requests" 
  ON public.maintenance_requests 
  FOR UPDATE 
  USING (
    landlord_id = auth.uid() 
    OR agent_id = (SELECT agent_id FROM public.profiles WHERE id = auth.uid())
    OR public.has_role(auth.uid(), 'admin')
  );

-- Add triggers for updated_at timestamps
CREATE TRIGGER update_agent_commissions_updated_at 
  BEFORE UPDATE ON public.agent_commissions 
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_rental_agreements_updated_at 
  BEFORE UPDATE ON public.rental_agreements 
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_maintenance_requests_updated_at 
  BEFORE UPDATE ON public.maintenance_requests 
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
