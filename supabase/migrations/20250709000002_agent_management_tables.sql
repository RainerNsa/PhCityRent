-- =====================================================
-- AGENT MANAGEMENT SYSTEM TABLES
-- Comprehensive tables for agent management functionality
-- =====================================================

-- Agent Goals Table
CREATE TABLE IF NOT EXISTS public.agent_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id TEXT NOT NULL REFERENCES public.agent_applications(agent_id) ON DELETE CASCADE,
  goal_type TEXT NOT NULL CHECK (goal_type IN ('properties', 'earnings', 'clients', 'conversion_rate', 'response_time')),
  target_value DECIMAL NOT NULL,
  current_value DECIMAL DEFAULT 0,
  target_date DATE NOT NULL,
  description TEXT NOT NULL,
  is_achieved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agent Clients Table
CREATE TABLE IF NOT EXISTS public.agent_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id TEXT NOT NULL REFERENCES public.agent_applications(agent_id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  budget_min INTEGER NOT NULL,
  budget_max INTEGER NOT NULL,
  preferred_locations TEXT[] NOT NULL DEFAULT '{}',
  property_preferences JSONB DEFAULT '{}',
  lead_score INTEGER DEFAULT 50 CHECK (lead_score >= 0 AND lead_score <= 100),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'viewing', 'negotiating', 'closed', 'lost')),
  source TEXT NOT NULL,
  notes TEXT,
  last_contact TIMESTAMPTZ,
  next_follow_up TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Client Communications Table
CREATE TABLE IF NOT EXISTS public.client_communications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.agent_clients(id) ON DELETE CASCADE,
  agent_id TEXT NOT NULL REFERENCES public.agent_applications(agent_id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('call', 'whatsapp', 'email', 'meeting', 'property_viewing')),
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read', 'responded')),
  scheduled_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Commission Structures Table
CREATE TABLE IF NOT EXISTS public.commission_structures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id TEXT NOT NULL REFERENCES public.agent_applications(agent_id) ON DELETE CASCADE,
  commission_type TEXT NOT NULL CHECK (commission_type IN ('percentage', 'fixed', 'tiered')),
  base_rate DECIMAL NOT NULL,
  tiers JSONB, -- For tiered commission structures
  property_types TEXT[], -- Specific property types this applies to
  effective_from DATE NOT NULL DEFAULT CURRENT_DATE,
  effective_until DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Commission Payments Table
CREATE TABLE IF NOT EXISTS public.commission_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  commission_id UUID NOT NULL REFERENCES public.agent_commissions(id) ON DELETE CASCADE,
  agent_id TEXT NOT NULL REFERENCES public.agent_applications(agent_id) ON DELETE CASCADE,
  amount DECIMAL NOT NULL,
  payment_method TEXT NOT NULL,
  payment_reference TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'paid', 'failed', 'disputed')),
  scheduled_date DATE NOT NULL,
  paid_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Commission Disputes Table
CREATE TABLE IF NOT EXISTS public.commission_disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  commission_id UUID NOT NULL REFERENCES public.agent_commissions(id) ON DELETE CASCADE,
  agent_id TEXT NOT NULL REFERENCES public.agent_applications(agent_id) ON DELETE CASCADE,
  dispute_reason TEXT NOT NULL,
  dispute_details TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'rejected')),
  resolution_notes TEXT,
  resolved_by UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agent Verification Steps Table
CREATE TABLE IF NOT EXISTS public.agent_verification_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id TEXT NOT NULL REFERENCES public.agent_applications(agent_id) ON DELETE CASCADE,
  step_name TEXT NOT NULL,
  step_order INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed', 'skipped')),
  required BOOLEAN DEFAULT TRUE,
  description TEXT NOT NULL,
  completion_data JSONB,
  completed_by UUID REFERENCES auth.users(id),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agent Activities Table
CREATE TABLE IF NOT EXISTS public.agent_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id TEXT NOT NULL REFERENCES public.agent_applications(agent_id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  description TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.agent_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commission_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commission_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commission_disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_verification_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_activities ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Agent Goals Policies
CREATE POLICY "Agents can manage their own goals" ON public.agent_goals
  FOR ALL TO authenticated
  USING (agent_id = (SELECT agent_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Admins can manage all agent goals" ON public.agent_goals
  FOR ALL TO authenticated
  USING (public.is_admin());

-- Agent Clients Policies
CREATE POLICY "Agents can manage their own clients" ON public.agent_clients
  FOR ALL TO authenticated
  USING (agent_id = (SELECT agent_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Admins can view all agent clients" ON public.agent_clients
  FOR SELECT TO authenticated
  USING (public.is_admin());

-- Client Communications Policies
CREATE POLICY "Agents can manage their own client communications" ON public.client_communications
  FOR ALL TO authenticated
  USING (agent_id = (SELECT agent_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Admins can view all communications" ON public.client_communications
  FOR SELECT TO authenticated
  USING (public.is_admin());

-- Commission Structures Policies
CREATE POLICY "Agents can view their own commission structures" ON public.commission_structures
  FOR SELECT TO authenticated
  USING (agent_id = (SELECT agent_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Admins can manage all commission structures" ON public.commission_structures
  FOR ALL TO authenticated
  USING (public.is_admin());

-- Commission Payments Policies
CREATE POLICY "Agents can view their own commission payments" ON public.commission_payments
  FOR SELECT TO authenticated
  USING (agent_id = (SELECT agent_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Admins can manage all commission payments" ON public.commission_payments
  FOR ALL TO authenticated
  USING (public.is_admin());

-- Commission Disputes Policies
CREATE POLICY "Agents can manage their own commission disputes" ON public.commission_disputes
  FOR ALL TO authenticated
  USING (agent_id = (SELECT agent_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Admins can manage all commission disputes" ON public.commission_disputes
  FOR ALL TO authenticated
  USING (public.is_admin());

-- Agent Verification Steps Policies
CREATE POLICY "Agents can view their own verification steps" ON public.agent_verification_steps
  FOR SELECT TO authenticated
  USING (agent_id = (SELECT agent_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Admins can manage all verification steps" ON public.agent_verification_steps
  FOR ALL TO authenticated
  USING (public.is_admin());

-- Agent Activities Policies
CREATE POLICY "Agents can view their own activities" ON public.agent_activities
  FOR SELECT TO authenticated
  USING (agent_id = (SELECT agent_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "System can insert agent activities" ON public.agent_activities
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view all agent activities" ON public.agent_activities
  FOR SELECT TO authenticated
  USING (public.is_admin());

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Agent Goals Indexes
CREATE INDEX idx_agent_goals_agent_id ON public.agent_goals(agent_id);
CREATE INDEX idx_agent_goals_type_date ON public.agent_goals(goal_type, target_date);
CREATE INDEX idx_agent_goals_achieved ON public.agent_goals(is_achieved, target_date);

-- Agent Clients Indexes
CREATE INDEX idx_agent_clients_agent_id ON public.agent_clients(agent_id);
CREATE INDEX idx_agent_clients_status ON public.agent_clients(status, created_at DESC);
CREATE INDEX idx_agent_clients_lead_score ON public.agent_clients(lead_score DESC);
CREATE INDEX idx_agent_clients_follow_up ON public.agent_clients(next_follow_up) WHERE next_follow_up IS NOT NULL;
CREATE INDEX idx_agent_clients_email ON public.agent_clients(email);

-- Client Communications Indexes
CREATE INDEX idx_client_communications_client_id ON public.client_communications(client_id, created_at DESC);
CREATE INDEX idx_client_communications_agent_id ON public.client_communications(agent_id, created_at DESC);
CREATE INDEX idx_client_communications_type ON public.client_communications(type, created_at DESC);
CREATE INDEX idx_client_communications_scheduled ON public.client_communications(scheduled_at) WHERE scheduled_at IS NOT NULL;

-- Commission Structures Indexes
CREATE INDEX idx_commission_structures_agent_id ON public.commission_structures(agent_id);
CREATE INDEX idx_commission_structures_active ON public.commission_structures(is_active, effective_from, effective_until);

-- Commission Payments Indexes
CREATE INDEX idx_commission_payments_commission_id ON public.commission_payments(commission_id);
CREATE INDEX idx_commission_payments_agent_id ON public.commission_payments(agent_id, created_at DESC);
CREATE INDEX idx_commission_payments_status ON public.commission_payments(status, scheduled_date);

-- Commission Disputes Indexes
CREATE INDEX idx_commission_disputes_commission_id ON public.commission_disputes(commission_id);
CREATE INDEX idx_commission_disputes_agent_id ON public.commission_disputes(agent_id);
CREATE INDEX idx_commission_disputes_status ON public.commission_disputes(status, created_at DESC);

-- Agent Verification Steps Indexes
CREATE INDEX idx_agent_verification_steps_agent_id ON public.agent_verification_steps(agent_id, step_order);
CREATE INDEX idx_agent_verification_steps_status ON public.agent_verification_steps(status);

-- Agent Activities Indexes
CREATE INDEX idx_agent_activities_agent_id ON public.agent_activities(agent_id, created_at DESC);
CREATE INDEX idx_agent_activities_type ON public.agent_activities(activity_type, created_at DESC);
CREATE INDEX idx_agent_activities_entity ON public.agent_activities(entity_type, entity_id);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================

-- Add updated_at triggers
CREATE TRIGGER set_updated_at_agent_goals
  BEFORE UPDATE ON public.agent_goals
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_agent_clients
  BEFORE UPDATE ON public.agent_clients
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_commission_structures
  BEFORE UPDATE ON public.commission_structures
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_commission_payments
  BEFORE UPDATE ON public.commission_payments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- INITIAL DATA SETUP
-- =====================================================

-- Insert default verification steps for new agents
CREATE OR REPLACE FUNCTION setup_default_verification_steps(agent_id_param TEXT)
RETURNS void AS $$
BEGIN
  INSERT INTO public.agent_verification_steps (agent_id, step_name, step_order, description, required) VALUES
    (agent_id_param, 'Document Verification', 1, 'Verify ID documents and selfie', true),
    (agent_id_param, 'Background Check', 2, 'Conduct background verification', true),
    (agent_id_param, 'Referee Verification', 3, 'Contact and verify referees', true),
    (agent_id_param, 'Training Completion', 4, 'Complete agent training program', true),
    (agent_id_param, 'Final Approval', 5, 'Final review and approval', true);
END;
$$ LANGUAGE plpgsql;

-- Insert default commission structure for new agents
CREATE OR REPLACE FUNCTION setup_default_commission_structure(agent_id_param TEXT)
RETURNS void AS $$
BEGIN
  INSERT INTO public.commission_structures (agent_id, commission_type, base_rate, is_active) VALUES
    (agent_id_param, 'percentage', 5.0, true);
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- AGENT MANAGEMENT FUNCTIONS
-- =====================================================

-- Function to get commission summary
CREATE OR REPLACE FUNCTION get_commission_summary(
  agent_id TEXT,
  period_type TEXT DEFAULT 'month'
)
RETURNS TABLE (
  total_earned DECIMAL,
  total_pending DECIMAL,
  total_paid DECIMAL,
  commission_count INTEGER,
  avg_commission DECIMAL
) AS $$
DECLARE
  date_filter TIMESTAMPTZ;
BEGIN
  -- Calculate date filter based on period
  CASE period_type
    WHEN 'month' THEN date_filter := DATE_TRUNC('month', NOW());
    WHEN 'quarter' THEN date_filter := DATE_TRUNC('quarter', NOW());
    WHEN 'year' THEN date_filter := DATE_TRUNC('year', NOW());
    ELSE date_filter := DATE_TRUNC('month', NOW());
  END CASE;

  RETURN QUERY
  SELECT
    COALESCE(SUM(ac.commission_amount), 0) as total_earned,
    COALESCE(SUM(CASE WHEN ac.status = 'pending' THEN ac.commission_amount ELSE 0 END), 0) as total_pending,
    COALESCE(SUM(CASE WHEN ac.status = 'paid' THEN ac.commission_amount ELSE 0 END), 0) as total_paid,
    COUNT(ac.id)::INTEGER as commission_count,
    COALESCE(AVG(ac.commission_amount), 0) as avg_commission
  FROM public.agent_commissions ac
  WHERE ac.agent_id = get_commission_summary.agent_id
    AND ac.created_at >= date_filter;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get agent analytics
CREATE OR REPLACE FUNCTION get_agent_analytics(agent_id TEXT)
RETURNS JSON AS $$
DECLARE
  result JSON;
  performance_trends JSON;
  comparison_data JSON;
  goal_progress JSON;
BEGIN
  -- Get performance trends (last 30 days)
  SELECT json_agg(
    json_build_object(
      'date', performance_date,
      'earnings', monthly_earnings,
      'properties', total_properties,
      'clients', active_clients,
      'conversion_rate', conversion_rate
    ) ORDER BY performance_date
  ) INTO performance_trends
  FROM public.agent_performance_history
  WHERE agent_id = get_agent_analytics.agent_id
    AND performance_date >= CURRENT_DATE - INTERVAL '30 days';

  -- Get comparison data (rank among agents in same area)
  WITH agent_rankings AS (
    SELECT
      apa.agent_id,
      apa.monthly_earnings,
      ROW_NUMBER() OVER (ORDER BY apa.monthly_earnings DESC) as rank,
      COUNT(*) OVER () as total_agents
    FROM public.agent_performance_analytics apa
    WHERE apa.agent_id IN (
      SELECT aa.agent_id
      FROM public.agent_applications aa
      WHERE aa.operating_areas && (
        SELECT operating_areas
        FROM public.agent_applications
        WHERE agent_id = get_agent_analytics.agent_id
      )
    )
  )
  SELECT json_build_object(
    'rank_in_area', ar.rank,
    'total_agents_in_area', ar.total_agents,
    'percentile', ROUND((ar.total_agents - ar.rank + 1)::DECIMAL / ar.total_agents * 100, 1),
    'top_performers', (
      SELECT json_agg(
        json_build_object(
          'agent_id', apa.agent_id,
          'name', apa.full_name,
          'metric_value', apa.monthly_earnings
        )
      )
      FROM public.agent_performance_analytics apa
      ORDER BY apa.monthly_earnings DESC
      LIMIT 5
    )
  ) INTO comparison_data
  FROM agent_rankings ar
  WHERE ar.agent_id = get_agent_analytics.agent_id;

  -- Get goal progress
  SELECT json_agg(
    json_build_object(
      'goal_id', ag.id,
      'goal_type', ag.goal_type,
      'progress_percentage', CASE
        WHEN ag.target_value > 0 THEN ROUND((ag.current_value / ag.target_value) * 100, 1)
        ELSE 0
      END,
      'days_remaining', EXTRACT(DAY FROM ag.target_date - CURRENT_DATE)
    )
  ) INTO goal_progress
  FROM public.agent_goals ag
  WHERE ag.agent_id = get_agent_analytics.agent_id
    AND ag.target_date >= CURRENT_DATE
    AND NOT ag.is_achieved;

  -- Build final result
  SELECT json_build_object(
    'performance_trends', COALESCE(performance_trends, '[]'::json),
    'comparison_data', COALESCE(comparison_data, '{}'::json),
    'goal_progress', COALESCE(goal_progress, '[]'::json)
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate lead score
CREATE OR REPLACE FUNCTION calculate_lead_score(
  budget_min INTEGER,
  budget_max INTEGER,
  source TEXT,
  preferred_locations TEXT[],
  property_preferences JSONB
)
RETURNS INTEGER AS $$
DECLARE
  score INTEGER := 50; -- Base score
  budget_range INTEGER;
BEGIN
  -- Budget range scoring
  budget_range := budget_max - budget_min;
  IF budget_range < 500000 THEN
    score := score + 20; -- Specific budget = higher intent
  ELSIF budget_range < 1000000 THEN
    score := score + 15;
  ELSE
    score := score + 10;
  END IF;

  -- Source scoring
  CASE source
    WHEN 'referral' THEN score := score + 25;
    WHEN 'website' THEN score := score + 15;
    WHEN 'social_media' THEN score := score + 10;
    ELSE score := score + 5;
  END CASE;

  -- Preferences specificity
  IF property_preferences ? 'bedrooms' THEN score := score + 5; END IF;
  IF property_preferences ? 'bathrooms' THEN score := score + 5; END IF;
  IF property_preferences ? 'property_type' THEN score := score + 5; END IF;
  IF property_preferences ? 'amenities' AND jsonb_array_length(property_preferences->'amenities') > 0 THEN
    score := score + 10;
  END IF;

  -- Location specificity
  IF array_length(preferred_locations, 1) = 1 THEN
    score := score + 15;
  ELSIF array_length(preferred_locations, 1) <= 3 THEN
    score := score + 10;
  END IF;

  -- Ensure score is within bounds
  RETURN GREATEST(0, LEAST(100, score));
END;
$$ LANGUAGE plpgsql;

-- Function to update client lead score
CREATE OR REPLACE FUNCTION update_client_lead_score()
RETURNS TRIGGER AS $$
BEGIN
  NEW.lead_score := calculate_lead_score(
    NEW.budget_min,
    NEW.budget_max,
    NEW.source,
    NEW.preferred_locations,
    NEW.property_preferences
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update lead score
CREATE TRIGGER trigger_update_client_lead_score
  BEFORE INSERT OR UPDATE ON public.agent_clients
  FOR EACH ROW EXECUTE FUNCTION update_client_lead_score();

-- Function to setup new agent
CREATE OR REPLACE FUNCTION setup_new_agent(agent_id_param TEXT)
RETURNS void AS $$
BEGIN
  -- Setup default verification steps
  PERFORM setup_default_verification_steps(agent_id_param);

  -- Setup default commission structure
  PERFORM setup_default_commission_structure(agent_id_param);

  -- Log activity
  INSERT INTO public.agent_activities (agent_id, activity_type, description) VALUES
    (agent_id_param, 'agent_setup', 'Agent account setup completed');
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

-- Grant permissions on functions
GRANT EXECUTE ON FUNCTION get_commission_summary(TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_agent_analytics(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_lead_score(INTEGER, INTEGER, TEXT, TEXT[], JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION setup_new_agent(TEXT) TO authenticated;

-- Grant permissions on tables
GRANT SELECT, INSERT, UPDATE, DELETE ON public.agent_goals TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.agent_clients TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.client_communications TO authenticated;
GRANT SELECT ON public.commission_structures TO authenticated;
GRANT SELECT ON public.commission_payments TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.commission_disputes TO authenticated;
GRANT SELECT ON public.agent_verification_steps TO authenticated;
GRANT SELECT, INSERT ON public.agent_activities TO authenticated;

-- =====================================================
-- REALTIME SUBSCRIPTIONS
-- =====================================================

-- Enable realtime for agent management tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.agent_goals;
ALTER PUBLICATION supabase_realtime ADD TABLE public.agent_clients;
ALTER PUBLICATION supabase_realtime ADD TABLE public.client_communications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.commission_payments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.agent_activities;
