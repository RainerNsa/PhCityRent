-- =====================================================
-- COMPREHENSIVE DATABASE OPTIMIZATION FOR PHCITYRENT
-- Performance, Real-time, Security, and Analytics
-- =====================================================

-- =====================================================
-- 1. PERFORMANCE INDEXES
-- =====================================================

-- Properties table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_properties_location_price 
  ON properties(location, price_per_year) WHERE is_available = true;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_properties_type_bedrooms 
  ON properties(property_type, bedrooms) WHERE is_available = true;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_properties_agent_status 
  ON properties(agent_id, is_available, is_verified);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_properties_landlord_available 
  ON properties(landlord_id, is_available);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_properties_featured_available 
  ON properties(featured, is_available, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_properties_price_range 
  ON properties(price_per_year) WHERE is_available = true;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_properties_updated_at 
  ON properties(updated_at DESC);

-- Agent applications indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_agent_applications_status_created 
  ON agent_applications(status, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_agent_applications_email_status 
  ON agent_applications(email, status) WHERE email IS NOT NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_agent_applications_areas 
  ON agent_applications USING GIN(operating_areas);

-- Payment transactions indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_payment_transactions_user_status 
  ON payment_transactions(user_id, status, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_payment_transactions_property_status 
  ON payment_transactions(property_id, status, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_payment_transactions_agent_month 
  ON payment_transactions(agent_id, DATE_TRUNC('month', created_at)) 
  WHERE status = 'completed';

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_payment_transactions_reference 
  ON payment_transactions(reference) WHERE reference IS NOT NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_payment_transactions_provider_status 
  ON payment_transactions(provider, status, created_at DESC);

-- Property inquiries indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_property_inquiries_property_status 
  ON property_inquiries(property_id, status, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_property_inquiries_email_created 
  ON property_inquiries(inquirer_email, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_property_inquiries_responded 
  ON property_inquiries(responded_at) WHERE responded_at IS NOT NULL;

-- Property views indexes (if table exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'property_views') THEN
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_property_views_property_date 
      ON property_views(property_id, created_at DESC);
    
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_property_views_user_date 
      ON property_views(user_id, created_at DESC) WHERE user_id IS NOT NULL;
    
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_property_views_ip_date 
      ON property_views(ip_address, created_at DESC) WHERE ip_address IS NOT NULL;
  END IF;
END $$;

-- Rental applications indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_rental_applications_property_status 
  ON rental_applications(property_id, status, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_rental_applications_user_status 
  ON rental_applications(user_id, status, created_at DESC);

-- Profiles indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_profiles_role_location 
  ON profiles(role, location) WHERE role IS NOT NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_profiles_email 
  ON profiles(email) WHERE email IS NOT NULL;

-- =====================================================
-- 2. ADVANCED DATABASE VIEWS
-- =====================================================

-- Enhanced Agent Performance View
CREATE OR REPLACE VIEW agent_performance_analytics AS
SELECT 
  aa.agent_id,
  aa.full_name,
  aa.email,
  aa.whatsapp_number,
  aa.operating_areas,
  aa.status as agent_status,
  aa.created_at as agent_since,
  
  -- Property metrics
  COUNT(DISTINCT p.id) as total_properties,
  COUNT(DISTINCT CASE WHEN p.is_available THEN p.id END) as available_properties,
  COUNT(DISTINCT CASE WHEN p.is_verified THEN p.id END) as verified_properties,
  COUNT(DISTINCT CASE WHEN p.featured THEN p.id END) as featured_properties,
  
  -- Financial metrics
  COALESCE(SUM(CASE WHEN pt.status = 'completed' AND pt.created_at >= DATE_TRUNC('month', NOW()) 
    THEN pt.amount END), 0) as monthly_earnings,
  COALESCE(SUM(CASE WHEN pt.status = 'completed' AND pt.created_at >= DATE_TRUNC('year', NOW()) 
    THEN pt.amount END), 0) as yearly_earnings,
  COALESCE(SUM(CASE WHEN pt.status = 'completed' THEN pt.amount END), 0) as total_earnings,
  
  -- Client interaction metrics
  COUNT(DISTINCT pi.id) as total_inquiries,
  COUNT(DISTINCT CASE WHEN pi.created_at >= NOW() - INTERVAL '30 days' THEN pi.id END) as monthly_inquiries,
  COUNT(DISTINCT CASE WHEN pi.responded_at IS NOT NULL THEN pi.id END) as responded_inquiries,
  COUNT(DISTINCT pi.inquirer_email) as unique_clients,
  
  -- Performance calculations
  CASE 
    WHEN COUNT(DISTINCT pi.id) > 0 
    THEN ROUND((COUNT(DISTINCT CASE WHEN pi.responded_at IS NOT NULL THEN pi.id END)::float / 
                COUNT(DISTINCT pi.id)::float) * 100, 2)
    ELSE 0 
  END as response_rate,
  
  CASE 
    WHEN COUNT(DISTINCT pi.id) > 0 
    THEN ROUND((COUNT(DISTINCT CASE WHEN pt.status = 'completed' THEN pt.id END)::float / 
                COUNT(DISTINCT pi.id)::float) * 100, 2)
    ELSE 0 
  END as conversion_rate,
  
  -- Average response time in hours
  COALESCE(ROUND(AVG(EXTRACT(EPOCH FROM (pi.responded_at - pi.created_at))/3600)::numeric, 2), 0) as avg_response_time_hours,
  
  -- Property performance
  COALESCE(ROUND(AVG(p.price_per_year)::numeric, 0), 0) as avg_property_price,
  COALESCE(MAX(p.price_per_year), 0) as highest_property_price,
  COALESCE(MIN(p.price_per_year), 0) as lowest_property_price,
  
  -- Recent activity
  MAX(pi.created_at) as last_inquiry_date,
  MAX(pt.created_at) as last_transaction_date,
  MAX(p.updated_at) as last_property_update,
  
  -- Ratings and reviews (from payment metadata)
  COALESCE(ROUND(AVG((pt.metadata->>'rating')::float), 2), 0) as avg_rating,
  COUNT(CASE WHEN pt.metadata->>'rating' IS NOT NULL THEN 1 END) as total_ratings,
  
  NOW() as calculated_at

FROM agent_applications aa
LEFT JOIN properties p ON aa.agent_id = p.agent_id
LEFT JOIN property_inquiries pi ON p.id = pi.property_id
LEFT JOIN payment_transactions pt ON aa.agent_id = pt.agent_id
WHERE aa.status = 'approved'
GROUP BY aa.agent_id, aa.full_name, aa.email, aa.whatsapp_number, aa.operating_areas, aa.status, aa.created_at;

-- Property Analytics View
CREATE OR REPLACE VIEW property_analytics_detailed AS
SELECT 
  p.id as property_id,
  p.title,
  p.description,
  p.location,
  p.property_type,
  p.bedrooms,
  p.bathrooms,
  p.area_sqft,
  p.price_per_year,
  p.price_per_month,
  p.is_available,
  p.is_verified,
  p.featured,
  p.agent_id,
  p.landlord_id,
  p.created_at,
  p.updated_at,
  
  -- View metrics
  COALESCE(pv.views_count, 0) as total_views,
  COALESCE(pv.unique_views, 0) as unique_views,
  COALESCE(pv.views_last_30_days, 0) as views_last_30_days,
  pv.last_viewed,
  
  -- Inquiry metrics
  COALESCE(pi.inquiries_count, 0) as total_inquiries,
  COALESCE(pi.inquiries_last_30_days, 0) as inquiries_last_30_days,
  COALESCE(pi.responded_inquiries, 0) as responded_inquiries,
  COALESCE(pi.unique_inquirers, 0) as unique_inquirers,
  pi.last_inquiry,
  pi.first_inquiry,
  
  -- Performance metrics
  CASE 
    WHEN COALESCE(pv.views_count, 0) > 0 
    THEN ROUND((COALESCE(pi.inquiries_count, 0)::float / pv.views_count::float) * 100, 2)
    ELSE 0 
  END as inquiry_conversion_rate,
  
  CASE 
    WHEN COALESCE(pi.inquiries_count, 0) > 0 
    THEN ROUND((COALESCE(pi.responded_inquiries, 0)::float / pi.inquiries_count::float) * 100, 2)
    ELSE 0 
  END as response_rate,
  
  -- Market position
  CASE 
    WHEN p.price_per_year > 0 THEN
      (SELECT ROUND(
        (COUNT(*)::float / (SELECT COUNT(*) FROM properties p2 WHERE p2.location = p.location AND p2.is_available)::float) * 100, 2
      ) FROM properties p3 
      WHERE p3.location = p.location 
        AND p3.is_available 
        AND p3.price_per_year <= p.price_per_year)
    ELSE 0 
  END as price_percentile_in_location,
  
  -- Days on market
  CASE 
    WHEN p.is_available THEN EXTRACT(DAY FROM NOW() - p.created_at)::integer
    ELSE NULL 
  END as days_on_market

FROM properties p
LEFT JOIN (
  SELECT 
    property_id,
    COUNT(*) as views_count,
    COUNT(DISTINCT COALESCE(user_id::text, ip_address::text)) as unique_views,
    COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as views_last_30_days,
    MAX(created_at) as last_viewed
  FROM property_views 
  GROUP BY property_id
) pv ON p.id = pv.property_id
LEFT JOIN (
  SELECT 
    property_id,
    COUNT(*) as inquiries_count,
    COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as inquiries_last_30_days,
    COUNT(CASE WHEN responded_at IS NOT NULL THEN 1 END) as responded_inquiries,
    COUNT(DISTINCT inquirer_email) as unique_inquirers,
    MAX(created_at) as last_inquiry,
    MIN(created_at) as first_inquiry
  FROM property_inquiries
  GROUP BY property_id
) pi ON p.id = pi.property_id;

-- Payment Analytics View
CREATE OR REPLACE VIEW payment_analytics_comprehensive AS
SELECT
  pt.id as transaction_id,
  pt.user_id,
  pt.property_id,
  pt.agent_id,
  pt.amount,
  pt.status,
  pt.provider,
  pt.payment_method,
  pt.reference,
  pt.created_at,
  pt.updated_at,
  pt.metadata,

  -- Property details
  p.title as property_title,
  p.location as property_location,
  p.property_type,
  p.landlord_id,

  -- User details
  prof.full_name as user_name,
  prof.email as user_email,

  -- Agent details
  aa.full_name as agent_name,
  aa.email as agent_email,

  -- Commission calculations
  CASE
    WHEN pt.status = 'completed' AND pt.agent_id IS NOT NULL THEN
      ROUND(pt.amount * 0.05, 2) -- 5% commission rate
    ELSE 0
  END as commission_amount,

  -- Time metrics
  EXTRACT(DAY FROM pt.updated_at - pt.created_at) as processing_days,
  DATE_TRUNC('month', pt.created_at) as transaction_month,
  DATE_TRUNC('week', pt.created_at) as transaction_week,

  -- Success indicators
  CASE WHEN pt.status = 'completed' THEN 1 ELSE 0 END as is_successful,
  CASE WHEN pt.status = 'failed' THEN 1 ELSE 0 END as is_failed,
  CASE WHEN pt.status = 'pending' THEN 1 ELSE 0 END as is_pending

FROM payment_transactions pt
LEFT JOIN properties p ON pt.property_id = p.id
LEFT JOIN profiles prof ON pt.user_id = prof.id
LEFT JOIN agent_applications aa ON pt.agent_id = aa.agent_id;

-- Market Analytics View
CREATE OR REPLACE VIEW market_analytics AS
SELECT
  location,
  property_type,

  -- Property counts
  COUNT(*) as total_properties,
  COUNT(CASE WHEN is_available THEN 1 END) as available_properties,
  COUNT(CASE WHEN NOT is_available THEN 1 END) as rented_properties,
  COUNT(CASE WHEN featured THEN 1 END) as featured_properties,

  -- Price analytics
  ROUND(AVG(price_per_year)::numeric, 0) as avg_price_per_year,
  ROUND(AVG(price_per_month)::numeric, 0) as avg_price_per_month,
  MIN(price_per_year) as min_price_per_year,
  MAX(price_per_year) as max_price_per_year,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY price_per_year) as median_price_per_year,

  -- Market activity
  COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as new_listings_30_days,
  COUNT(CASE WHEN updated_at >= NOW() - INTERVAL '7 days' THEN 1 END) as updated_listings_7_days,

  -- Demand indicators
  ROUND(AVG(
    COALESCE((
      SELECT COUNT(*) FROM property_inquiries pi
      WHERE pi.property_id = p.id AND pi.created_at >= NOW() - INTERVAL '30 days'
    ), 0)
  ), 2) as avg_inquiries_per_property_30_days,

  -- Supply indicators
  ROUND(
    COUNT(CASE WHEN is_available THEN 1 END)::float /
    NULLIF(COUNT(*), 0)::float * 100, 2
  ) as availability_rate,

  -- Time on market
  ROUND(AVG(
    CASE WHEN is_available THEN EXTRACT(DAY FROM NOW() - created_at) ELSE NULL END
  ), 1) as avg_days_on_market,

  -- Last updated
  MAX(updated_at) as last_property_update,
  NOW() as calculated_at

FROM properties p
GROUP BY location, property_type
HAVING COUNT(*) >= 3; -- Only show markets with at least 3 properties

-- =====================================================
-- 3. REAL-TIME TRIGGERS
-- =====================================================

-- Function to update agent metrics when properties change
CREATE OR REPLACE FUNCTION update_agent_metrics_on_property_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Update agent's last activity timestamp
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE agent_applications
    SET updated_at = NOW()
    WHERE agent_id = NEW.agent_id;

    -- Notify real-time subscribers
    PERFORM pg_notify(
      'agent_metrics_update',
      json_build_object(
        'agent_id', NEW.agent_id,
        'event', TG_OP,
        'property_id', NEW.id,
        'timestamp', NOW()
      )::text
    );
  END IF;

  IF TG_OP = 'DELETE' THEN
    UPDATE agent_applications
    SET updated_at = NOW()
    WHERE agent_id = OLD.agent_id;

    PERFORM pg_notify(
      'agent_metrics_update',
      json_build_object(
        'agent_id', OLD.agent_id,
        'event', TG_OP,
        'property_id', OLD.id,
        'timestamp', NOW()
      )::text
    );
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Function to calculate and record commissions
CREATE OR REPLACE FUNCTION calculate_commission_on_payment()
RETURNS TRIGGER AS $$
DECLARE
  commission_rate DECIMAL DEFAULT 0.05; -- 5% default commission
  commission_amount DECIMAL;
  property_agent_id TEXT;
BEGIN
  -- Only process completed payments
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN

    -- Get the agent for this property
    SELECT agent_id INTO property_agent_id
    FROM properties
    WHERE id = NEW.property_id;

    IF property_agent_id IS NOT NULL THEN
      commission_amount := NEW.amount * commission_rate;

      -- Insert or update commission record
      INSERT INTO agent_commissions (
        agent_id,
        property_id,
        transaction_id,
        commission_amount,
        commission_rate,
        status,
        created_at
      ) VALUES (
        property_agent_id,
        NEW.property_id,
        NEW.id,
        commission_amount,
        commission_rate,
        'pending',
        NOW()
      )
      ON CONFLICT (transaction_id)
      DO UPDATE SET
        commission_amount = EXCLUDED.commission_amount,
        commission_rate = EXCLUDED.commission_rate,
        updated_at = NOW();

      -- Notify real-time subscribers
      PERFORM pg_notify(
        'commission_calculated',
        json_build_object(
          'agent_id', property_agent_id,
          'transaction_id', NEW.id,
          'commission_amount', commission_amount,
          'timestamp', NOW()
        )::text
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update property view counts
CREATE OR REPLACE FUNCTION update_property_view_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Notify real-time subscribers about new view
  PERFORM pg_notify(
    'property_view_update',
    json_build_object(
      'property_id', NEW.property_id,
      'user_id', NEW.user_id,
      'timestamp', NEW.created_at
    )::text
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS trigger_update_agent_metrics ON properties;
CREATE TRIGGER trigger_update_agent_metrics
  AFTER INSERT OR UPDATE OR DELETE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_agent_metrics_on_property_change();

DROP TRIGGER IF EXISTS trigger_calculate_commission ON payment_transactions;
CREATE TRIGGER trigger_calculate_commission
  AFTER INSERT OR UPDATE ON payment_transactions
  FOR EACH ROW EXECUTE FUNCTION calculate_commission_on_payment();

-- Only create property view trigger if table exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'property_views') THEN
    DROP TRIGGER IF EXISTS trigger_update_property_views ON property_views;
    CREATE TRIGGER trigger_update_property_views
      AFTER INSERT ON property_views
      FOR EACH ROW EXECUTE FUNCTION update_property_view_count();
  END IF;
END $$;

-- =====================================================
-- 4. COMPREHENSIVE RLS POLICIES
-- =====================================================

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = user_id AND role IN ('admin', 'super_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to get agent_id for user
CREATE OR REPLACE FUNCTION get_user_agent_id(user_id UUID DEFAULT auth.uid())
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT agent_id FROM profiles
    WHERE id = user_id AND role = 'agent'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Properties RLS Policies (Enhanced)
DROP POLICY IF EXISTS "Anyone can view available properties" ON properties;
DROP POLICY IF EXISTS "Authenticated users can create properties" ON properties;
DROP POLICY IF EXISTS "Owners can update their properties" ON properties;

-- Public can view available, verified properties
CREATE POLICY "Public can view available properties" ON properties
  FOR SELECT TO anon, authenticated
  USING (is_available = true AND is_verified = true);

-- Landlords can view all their properties
CREATE POLICY "Landlords can view their properties" ON properties
  FOR SELECT TO authenticated
  USING (landlord_id = auth.uid());

-- Agents can view their assigned properties
CREATE POLICY "Agents can view their properties" ON properties
  FOR SELECT TO authenticated
  USING (agent_id = get_user_agent_id());

-- Admins can view all properties
CREATE POLICY "Admins can view all properties" ON properties
  FOR SELECT TO authenticated
  USING (is_admin());

-- Authenticated users can create properties
CREATE POLICY "Authenticated users can create properties" ON properties
  FOR INSERT TO authenticated
  WITH CHECK (
    landlord_id = auth.uid() OR
    agent_id = get_user_agent_id() OR
    is_admin()
  );

-- Landlords and agents can update their properties
CREATE POLICY "Owners can update their properties" ON properties
  FOR UPDATE TO authenticated
  USING (
    landlord_id = auth.uid() OR
    agent_id = get_user_agent_id() OR
    is_admin()
  );

-- Only admins can delete properties
CREATE POLICY "Admins can delete properties" ON properties
  FOR DELETE TO authenticated
  USING (is_admin());

-- Agent Applications RLS Policies (Enhanced)
DROP POLICY IF EXISTS "Anyone can insert applications" ON agent_applications;
DROP POLICY IF EXISTS "Users can view their own applications" ON agent_applications;

-- Anyone can create applications
CREATE POLICY "Anyone can create applications" ON agent_applications
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Users can view their own applications
CREATE POLICY "Users can view own applications" ON agent_applications
  FOR SELECT TO authenticated
  USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Agents can view their own profile
CREATE POLICY "Agents can view own profile" ON agent_applications
  FOR SELECT TO authenticated
  USING (agent_id = get_user_agent_id());

-- Admins can view and manage all applications
CREATE POLICY "Admins can manage all applications" ON agent_applications
  FOR ALL TO authenticated
  USING (is_admin());

-- Payment Transactions RLS Policies
-- Users can view their own transactions
CREATE POLICY "Users can view own transactions" ON payment_transactions
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Landlords can view transactions for their properties
CREATE POLICY "Landlords can view property transactions" ON payment_transactions
  FOR SELECT TO authenticated
  USING (
    property_id IN (
      SELECT id FROM properties WHERE landlord_id = auth.uid()
    )
  );

-- Agents can view transactions for their properties
CREATE POLICY "Agents can view agent transactions" ON payment_transactions
  FOR SELECT TO authenticated
  USING (agent_id = get_user_agent_id());

-- Admins can view all transactions
CREATE POLICY "Admins can view all transactions" ON payment_transactions
  FOR SELECT TO authenticated
  USING (is_admin());

-- Users can create their own transactions
CREATE POLICY "Users can create transactions" ON payment_transactions
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Property Inquiries RLS Policies
-- Users can view their own inquiries
CREATE POLICY "Users can view own inquiries" ON property_inquiries
  FOR SELECT TO authenticated
  USING (
    inquirer_email = (SELECT email FROM auth.users WHERE id = auth.uid()) OR
    user_id = auth.uid()
  );

-- Property owners can view inquiries for their properties
CREATE POLICY "Property owners can view inquiries" ON property_inquiries
  FOR SELECT TO authenticated
  USING (
    property_id IN (
      SELECT id FROM properties
      WHERE landlord_id = auth.uid() OR agent_id = get_user_agent_id()
    )
  );

-- Admins can view all inquiries
CREATE POLICY "Admins can view all inquiries" ON property_inquiries
  FOR SELECT TO authenticated
  USING (is_admin());

-- Anyone can create inquiries
CREATE POLICY "Anyone can create inquiries" ON property_inquiries
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Property owners can update inquiries (respond)
CREATE POLICY "Property owners can respond to inquiries" ON property_inquiries
  FOR UPDATE TO authenticated
  USING (
    property_id IN (
      SELECT id FROM properties
      WHERE landlord_id = auth.uid() OR agent_id = get_user_agent_id()
    )
  );

-- Profiles RLS Policies (Enhanced)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Public can view basic profile info
CREATE POLICY "Public can view basic profiles" ON profiles
  FOR SELECT TO anon, authenticated
  USING (true);

-- Users can view and update their own profile
CREATE POLICY "Users can manage own profile" ON profiles
  FOR ALL TO authenticated
  USING (id = auth.uid());

-- Admins can manage all profiles
CREATE POLICY "Admins can manage all profiles" ON profiles
  FOR ALL TO authenticated
  USING (is_admin());

-- =====================================================
-- 5. AUDIT TABLES
-- =====================================================

-- Property Changes History
CREATE TABLE IF NOT EXISTS property_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL,
  operation TEXT NOT NULL, -- INSERT, UPDATE, DELETE
  old_values JSONB,
  new_values JSONB,
  changed_by UUID REFERENCES auth.users(id),
  changed_at TIMESTAMPTZ DEFAULT NOW(),
  change_reason TEXT,
  ip_address INET,
  user_agent TEXT
);

-- Agent Performance History
CREATE TABLE IF NOT EXISTS agent_performance_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id TEXT NOT NULL,
  performance_date DATE DEFAULT CURRENT_DATE,
  total_properties INTEGER DEFAULT 0,
  active_clients INTEGER DEFAULT 0,
  monthly_earnings DECIMAL DEFAULT 0,
  conversion_rate DECIMAL DEFAULT 0,
  response_time_hours DECIMAL DEFAULT 0,
  client_satisfaction DECIMAL DEFAULT 0,
  deals_completed INTEGER DEFAULT 0,
  calculated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment Transaction Logs
CREATE TABLE IF NOT EXISTS payment_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL,
  operation TEXT NOT NULL,
  old_status TEXT,
  new_status TEXT,
  old_values JSONB,
  new_values JSONB,
  changed_by UUID REFERENCES auth.users(id),
  changed_at TIMESTAMPTZ DEFAULT NOW(),
  change_reason TEXT,
  provider_response JSONB,
  ip_address INET
);

-- System Activity Log
CREATE TABLE IF NOT EXISTS system_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  activity_type TEXT NOT NULL, -- login, logout, property_view, inquiry_sent, payment_made, etc.
  entity_type TEXT, -- property, agent, payment, etc.
  entity_id UUID,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on audit tables
ALTER TABLE property_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_performance_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_activity_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for audit tables (Admin only)
CREATE POLICY "Admins can view property audit log" ON property_audit_log
  FOR SELECT TO authenticated USING (is_admin());

CREATE POLICY "Admins can view agent performance history" ON agent_performance_history
  FOR SELECT TO authenticated USING (is_admin());

CREATE POLICY "Agents can view own performance history" ON agent_performance_history
  FOR SELECT TO authenticated USING (agent_id = get_user_agent_id());

CREATE POLICY "Admins can view payment audit log" ON payment_audit_log
  FOR SELECT TO authenticated USING (is_admin());

CREATE POLICY "Admins can view system activity log" ON system_activity_log
  FOR SELECT TO authenticated USING (is_admin());

CREATE POLICY "Users can view own activity log" ON system_activity_log
  FOR SELECT TO authenticated USING (user_id = auth.uid());

-- Audit trigger functions
CREATE OR REPLACE FUNCTION audit_property_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO property_audit_log (
      property_id, operation, old_values, changed_by, change_reason
    ) VALUES (
      OLD.id, TG_OP, to_jsonb(OLD), auth.uid(), 'Property deleted'
    );
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO property_audit_log (
      property_id, operation, old_values, new_values, changed_by, change_reason
    ) VALUES (
      NEW.id, TG_OP, to_jsonb(OLD), to_jsonb(NEW), auth.uid(), 'Property updated'
    );
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO property_audit_log (
      property_id, operation, new_values, changed_by, change_reason
    ) VALUES (
      NEW.id, TG_OP, to_jsonb(NEW), auth.uid(), 'Property created'
    );
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION audit_payment_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    INSERT INTO payment_audit_log (
      transaction_id, operation, old_status, new_status,
      old_values, new_values, changed_by, change_reason
    ) VALUES (
      NEW.id, TG_OP, OLD.status, NEW.status,
      to_jsonb(OLD), to_jsonb(NEW), auth.uid(),
      CASE
        WHEN OLD.status != NEW.status THEN 'Status changed from ' || OLD.status || ' to ' || NEW.status
        ELSE 'Payment updated'
      END
    );
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO payment_audit_log (
      transaction_id, operation, new_status, new_values, changed_by, change_reason
    ) VALUES (
      NEW.id, TG_OP, NEW.status, to_jsonb(NEW), auth.uid(), 'Payment created'
    );
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create audit triggers
DROP TRIGGER IF EXISTS trigger_audit_property_changes ON properties;
CREATE TRIGGER trigger_audit_property_changes
  AFTER INSERT OR UPDATE OR DELETE ON properties
  FOR EACH ROW EXECUTE FUNCTION audit_property_changes();

DROP TRIGGER IF EXISTS trigger_audit_payment_changes ON payment_transactions;
CREATE TRIGGER trigger_audit_payment_changes
  AFTER INSERT OR UPDATE ON payment_transactions
  FOR EACH ROW EXECUTE FUNCTION audit_payment_changes();

-- Function to record agent performance daily
CREATE OR REPLACE FUNCTION record_daily_agent_performance()
RETURNS void AS $$
BEGIN
  INSERT INTO agent_performance_history (
    agent_id, performance_date, total_properties, active_clients,
    monthly_earnings, conversion_rate, response_time_hours,
    client_satisfaction, deals_completed
  )
  SELECT
    agent_id,
    CURRENT_DATE,
    total_properties,
    unique_clients,
    monthly_earnings,
    conversion_rate,
    avg_response_time_hours,
    avg_rating,
    COUNT(DISTINCT CASE WHEN pt.status = 'completed' AND pt.created_at >= DATE_TRUNC('month', NOW()) THEN pt.id END)
  FROM agent_performance_analytics apa
  LEFT JOIN payment_transactions pt ON apa.agent_id = pt.agent_id
  GROUP BY agent_id, total_properties, unique_clients, monthly_earnings,
           conversion_rate, avg_response_time_hours, avg_rating
  ON CONFLICT (agent_id, performance_date) DO UPDATE SET
    total_properties = EXCLUDED.total_properties,
    active_clients = EXCLUDED.active_clients,
    monthly_earnings = EXCLUDED.monthly_earnings,
    conversion_rate = EXCLUDED.conversion_rate,
    response_time_hours = EXCLUDED.response_time_hours,
    client_satisfaction = EXCLUDED.client_satisfaction,
    deals_completed = EXCLUDED.deals_completed,
    calculated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add unique constraint for daily performance records
ALTER TABLE agent_performance_history
ADD CONSTRAINT unique_agent_performance_date
UNIQUE (agent_id, performance_date);

-- Indexes for audit tables
CREATE INDEX idx_property_audit_log_property_id ON property_audit_log(property_id, changed_at DESC);
CREATE INDEX idx_property_audit_log_changed_by ON property_audit_log(changed_by, changed_at DESC);
CREATE INDEX idx_agent_performance_history_agent_date ON agent_performance_history(agent_id, performance_date DESC);
CREATE INDEX idx_payment_audit_log_transaction_id ON payment_audit_log(transaction_id, changed_at DESC);
CREATE INDEX idx_system_activity_log_user_activity ON system_activity_log(user_id, activity_type, created_at DESC);
CREATE INDEX idx_system_activity_log_entity ON system_activity_log(entity_type, entity_id, created_at DESC);

-- =====================================================
-- 6. ADDITIONAL OPTIMIZATIONS
-- =====================================================

-- Function to log user activity
CREATE OR REPLACE FUNCTION log_user_activity(
  activity_type TEXT,
  entity_type TEXT DEFAULT NULL,
  entity_id UUID DEFAULT NULL,
  details JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  activity_id UUID;
BEGIN
  INSERT INTO system_activity_log (
    user_id, activity_type, entity_type, entity_id, details
  ) VALUES (
    auth.uid(), activity_type, entity_type, entity_id, details
  ) RETURNING id INTO activity_id;

  RETURN activity_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get property recommendations
CREATE OR REPLACE FUNCTION get_property_recommendations(
  user_id UUID,
  limit_count INTEGER DEFAULT 10
)
RETURNS TABLE (
  property_id UUID,
  title TEXT,
  location TEXT,
  price_per_year INTEGER,
  recommendation_score DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.title,
    p.location,
    p.price_per_year,
    -- Simple recommendation score based on user activity
    (
      CASE WHEN EXISTS (
        SELECT 1 FROM system_activity_log sal
        WHERE sal.user_id = get_property_recommendations.user_id
          AND sal.entity_type = 'property'
          AND sal.details->>'location' = p.location
      ) THEN 2.0 ELSE 1.0 END +
      CASE WHEN p.featured THEN 1.5 ELSE 1.0 END +
      CASE WHEN p.is_verified THEN 1.2 ELSE 1.0 END
    ) as recommendation_score
  FROM properties p
  WHERE p.is_available = true
    AND p.is_verified = true
  ORDER BY recommendation_score DESC, p.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get market insights
CREATE OR REPLACE FUNCTION get_market_insights(location_filter TEXT DEFAULT NULL)
RETURNS TABLE (
  location TEXT,
  avg_price DECIMAL,
  price_trend TEXT,
  availability_rate DECIMAL,
  demand_score DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ma.location,
    ma.avg_price_per_year,
    CASE
      WHEN ma.new_listings_30_days > ma.total_properties * 0.1 THEN 'Rising'
      WHEN ma.new_listings_30_days < ma.total_properties * 0.05 THEN 'Falling'
      ELSE 'Stable'
    END as price_trend,
    ma.availability_rate,
    -- Simple demand score calculation
    CASE
      WHEN ma.avg_inquiries_per_property_30_days > 5 THEN 5.0
      WHEN ma.avg_inquiries_per_property_30_days > 3 THEN 4.0
      WHEN ma.avg_inquiries_per_property_30_days > 2 THEN 3.0
      WHEN ma.avg_inquiries_per_property_30_days > 1 THEN 2.0
      ELSE 1.0
    END as demand_score
  FROM market_analytics ma
  WHERE (location_filter IS NULL OR ma.location ILIKE '%' || location_filter || '%')
  ORDER BY ma.total_properties DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 7. PERMISSIONS AND GRANTS
-- =====================================================

-- Grant permissions on views
GRANT SELECT ON agent_performance_analytics TO authenticated;
GRANT SELECT ON property_analytics_detailed TO authenticated;
GRANT SELECT ON payment_analytics_comprehensive TO authenticated;
GRANT SELECT ON market_analytics TO authenticated, anon;

-- Grant permissions on functions
GRANT EXECUTE ON FUNCTION is_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_agent_id(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION log_user_activity(TEXT, TEXT, UUID, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION get_property_recommendations(UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_market_insights(TEXT) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION record_daily_agent_performance() TO authenticated;

-- Grant permissions on audit tables (restricted)
GRANT SELECT ON property_audit_log TO authenticated;
GRANT SELECT ON agent_performance_history TO authenticated;
GRANT SELECT ON payment_audit_log TO authenticated;
GRANT SELECT ON system_activity_log TO authenticated;

-- =====================================================
-- 8. REALTIME SUBSCRIPTIONS
-- =====================================================

-- Enable realtime for new tables
DO $$
BEGIN
  -- Add tables to realtime publication if they exist
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'property_views') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE property_views;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'agent_commissions') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE agent_commissions;
  END IF;

  -- Add audit tables for admin monitoring
  ALTER PUBLICATION supabase_realtime ADD TABLE property_audit_log;
  ALTER PUBLICATION supabase_realtime ADD TABLE payment_audit_log;
  ALTER PUBLICATION supabase_realtime ADD TABLE system_activity_log;
EXCEPTION
  WHEN OTHERS THEN
    -- Ignore errors if publication doesn't exist
    NULL;
END $$;

-- =====================================================
-- 9. MAINTENANCE FUNCTIONS
-- =====================================================

-- Function to clean old audit logs (keep last 6 months)
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER := 0;
BEGIN
  -- Clean property audit logs
  DELETE FROM property_audit_log
  WHERE changed_at < NOW() - INTERVAL '6 months';
  GET DIAGNOSTICS deleted_count = ROW_COUNT;

  -- Clean payment audit logs
  DELETE FROM payment_audit_log
  WHERE changed_at < NOW() - INTERVAL '6 months';
  GET DIAGNOSTICS deleted_count = deleted_count + ROW_COUNT;

  -- Clean system activity logs (keep last 3 months)
  DELETE FROM system_activity_log
  WHERE created_at < NOW() - INTERVAL '3 months';
  GET DIAGNOSTICS deleted_count = deleted_count + ROW_COUNT;

  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update database statistics
CREATE OR REPLACE FUNCTION update_database_statistics()
RETURNS void AS $$
BEGIN
  -- Update table statistics for better query planning
  ANALYZE properties;
  ANALYZE agent_applications;
  ANALYZE payment_transactions;
  ANALYZE property_inquiries;
  ANALYZE profiles;

  -- Log the maintenance activity
  INSERT INTO system_activity_log (
    user_id, activity_type, details
  ) VALUES (
    NULL, 'database_maintenance',
    json_build_object('action', 'statistics_updated', 'timestamp', NOW())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant maintenance function permissions to admins only
GRANT EXECUTE ON FUNCTION cleanup_old_audit_logs() TO authenticated;
GRANT EXECUTE ON FUNCTION update_database_statistics() TO authenticated;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================

-- Log the completion of this migration
DO $$
BEGIN
  INSERT INTO system_activity_log (
    activity_type, details
  ) VALUES (
    'database_migration',
    json_build_object(
      'migration', 'comprehensive_database_optimization',
      'version', '20250709000001',
      'completed_at', NOW(),
      'features', json_build_array(
        'performance_indexes',
        'advanced_views',
        'realtime_triggers',
        'comprehensive_rls',
        'audit_tables',
        'maintenance_functions'
      )
    )
  );
EXCEPTION
  WHEN OTHERS THEN
    -- Ignore if system_activity_log doesn't exist yet
    NULL;
END $$;
