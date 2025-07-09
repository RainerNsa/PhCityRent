-- Real-time Infrastructure for PHCityRent
-- This migration creates the necessary views, functions, and triggers for real-time data

-- Create agent performance view for real-time metrics
CREATE OR REPLACE VIEW agent_performance_view AS
SELECT 
  aa.agent_id,
  aa.full_name,
  COUNT(DISTINCT p.id) as total_properties,
  COUNT(DISTINCT pi.id) as active_clients,
  COALESCE(SUM(pt.amount), 0) as monthly_earnings,
  CASE 
    WHEN COUNT(DISTINCT pi.id) > 0 
    THEN (COUNT(DISTINCT CASE WHEN pt.status = 'completed' THEN pt.id END)::float / COUNT(DISTINCT pi.id)::float) * 100
    ELSE 0 
  END as conversion_rate,
  COALESCE(AVG(EXTRACT(EPOCH FROM (pi.responded_at - pi.created_at))/3600), 24) as response_time,
  COALESCE(AVG(CASE WHEN pt.metadata->>'rating' IS NOT NULL THEN (pt.metadata->>'rating')::float ELSE 4.5 END), 4.5) as client_satisfaction,
  COUNT(DISTINCT CASE WHEN pt.status = 'completed' THEN pt.id END) as deals_completed,
  NOW() as last_updated
FROM agent_applications aa
LEFT JOIN properties p ON aa.agent_id = p.agent_id
LEFT JOIN property_inquiries pi ON p.id = pi.property_id
LEFT JOIN payment_transactions pt ON aa.agent_id = pt.agent_id 
  AND pt.created_at >= DATE_TRUNC('month', NOW())
WHERE aa.status = 'approved'
GROUP BY aa.agent_id, aa.full_name;

-- Create dashboard metrics function
CREATE OR REPLACE FUNCTION get_dashboard_metrics(user_id UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_revenue', COALESCE(SUM(CASE WHEN pt.status = 'completed' THEN pt.amount ELSE 0 END), 0),
    'active_properties', COUNT(DISTINCT CASE WHEN p.is_available = true THEN p.id END),
    'pending_payments', COUNT(DISTINCT CASE WHEN pt.status = 'pending' THEN pt.id END),
    'new_inquiries', COUNT(DISTINCT CASE WHEN pi.created_at >= NOW() - INTERVAL '24 hours' THEN pi.id END),
    'conversion_rate', CASE 
      WHEN COUNT(DISTINCT pi.id) > 0 
      THEN (COUNT(DISTINCT CASE WHEN pt.status = 'completed' THEN pt.id END)::float / COUNT(DISTINCT pi.id)::float) * 100
      ELSE 0 
    END,
    'growth_rate', CASE 
      WHEN COUNT(DISTINCT CASE WHEN pt.created_at >= NOW() - INTERVAL '60 days' AND pt.created_at < NOW() - INTERVAL '30 days' THEN pt.id END) > 0
      THEN ((COUNT(DISTINCT CASE WHEN pt.created_at >= NOW() - INTERVAL '30 days' THEN pt.id END)::float / 
             COUNT(DISTINCT CASE WHEN pt.created_at >= NOW() - INTERVAL '60 days' AND pt.created_at < NOW() - INTERVAL '30 days' THEN pt.id END)::float) - 1) * 100
      ELSE 0 
    END
  ) INTO result
  FROM properties p
  LEFT JOIN property_inquiries pi ON p.id = pi.property_id
  LEFT JOIN payment_transactions pt ON p.id = pt.property_id
  WHERE p.landlord_id = user_id OR p.agent_id = (
    SELECT agent_id FROM agent_applications WHERE email = (
      SELECT email FROM auth.users WHERE id = user_id
    )
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create agent performance function
CREATE OR REPLACE FUNCTION get_agent_performance(agent_id TEXT)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'agent_id', apv.agent_id,
    'total_properties', apv.total_properties,
    'active_clients', apv.active_clients,
    'monthly_earnings', apv.monthly_earnings,
    'conversion_rate', apv.conversion_rate,
    'response_time', apv.response_time,
    'client_satisfaction', apv.client_satisfaction,
    'deals_completed', apv.deals_completed,
    'last_updated', apv.last_updated
  ) INTO result
  FROM agent_performance_view apv
  WHERE apv.agent_id = get_agent_performance.agent_id;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create property analytics view
CREATE OR REPLACE VIEW property_analytics_view AS
SELECT 
  p.id as property_id,
  p.title,
  p.location,
  p.price_per_year,
  p.is_available,
  COUNT(DISTINCT pi.id) as inquiries_count,
  COUNT(DISTINCT pv.id) as views_count,
  MAX(pi.created_at) as last_inquiry,
  MAX(pv.created_at) as last_viewed,
  p.updated_at
FROM properties p
LEFT JOIN property_inquiries pi ON p.id = pi.property_id
LEFT JOIN property_views pv ON p.id = pv.property_id
GROUP BY p.id, p.title, p.location, p.price_per_year, p.is_available, p.updated_at;

-- Create property views table if it doesn't exist
CREATE TABLE IF NOT EXISTS property_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on property_views
ALTER TABLE property_views ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for property_views
CREATE POLICY "Anyone can create property views" ON property_views
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view their own property views" ON property_views
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_agent_performance_agent_id ON agent_applications(agent_id) WHERE status = 'approved';
CREATE INDEX IF NOT EXISTS idx_properties_agent_available ON properties(agent_id, is_available);
CREATE INDEX IF NOT EXISTS idx_property_inquiries_property_created ON property_inquiries(property_id, created_at);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_agent_status ON payment_transactions(agent_id, status, created_at);
CREATE INDEX IF NOT EXISTS idx_property_views_property_created ON property_views(property_id, created_at);

-- Create trigger function for real-time updates
CREATE OR REPLACE FUNCTION notify_realtime_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Notify about the change
  PERFORM pg_notify(
    'realtime_update',
    json_build_object(
      'table', TG_TABLE_NAME,
      'operation', TG_OP,
      'record_id', COALESCE(NEW.id, OLD.id),
      'timestamp', NOW()
    )::text
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers for real-time notifications
DROP TRIGGER IF EXISTS properties_realtime_trigger ON properties;
CREATE TRIGGER properties_realtime_trigger
  AFTER INSERT OR UPDATE OR DELETE ON properties
  FOR EACH ROW EXECUTE FUNCTION notify_realtime_update();

DROP TRIGGER IF EXISTS payment_transactions_realtime_trigger ON payment_transactions;
CREATE TRIGGER payment_transactions_realtime_trigger
  AFTER INSERT OR UPDATE OR DELETE ON payment_transactions
  FOR EACH ROW EXECUTE FUNCTION notify_realtime_update();

DROP TRIGGER IF EXISTS property_inquiries_realtime_trigger ON property_inquiries;
CREATE TRIGGER property_inquiries_realtime_trigger
  AFTER INSERT OR UPDATE OR DELETE ON property_inquiries
  FOR EACH ROW EXECUTE FUNCTION notify_realtime_update();

DROP TRIGGER IF EXISTS agent_applications_realtime_trigger ON agent_applications;
CREATE TRIGGER agent_applications_realtime_trigger
  AFTER INSERT OR UPDATE OR DELETE ON agent_applications
  FOR EACH ROW EXECUTE FUNCTION notify_realtime_update();

-- Create function to update agent metrics
CREATE OR REPLACE FUNCTION update_agent_metrics()
RETURNS TRIGGER AS $$
BEGIN
  -- This function can be used to update cached agent metrics
  -- when related data changes
  
  IF TG_TABLE_NAME = 'properties' THEN
    -- Update agent property count
    UPDATE agent_applications 
    SET updated_at = NOW()
    WHERE agent_id = COALESCE(NEW.agent_id, OLD.agent_id);
  END IF;
  
  IF TG_TABLE_NAME = 'payment_transactions' THEN
    -- Update agent earnings
    UPDATE agent_applications 
    SET updated_at = NOW()
    WHERE agent_id = COALESCE(NEW.agent_id, OLD.agent_id);
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers for agent metrics updates
DROP TRIGGER IF EXISTS properties_agent_metrics_trigger ON properties;
CREATE TRIGGER properties_agent_metrics_trigger
  AFTER INSERT OR UPDATE OR DELETE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_agent_metrics();

DROP TRIGGER IF EXISTS payment_transactions_agent_metrics_trigger ON payment_transactions;
CREATE TRIGGER payment_transactions_agent_metrics_trigger
  AFTER INSERT OR UPDATE OR DELETE ON payment_transactions
  FOR EACH ROW EXECUTE FUNCTION update_agent_metrics();

-- Create function to track property views
CREATE OR REPLACE FUNCTION track_property_view(
  property_id UUID,
  user_id UUID DEFAULT NULL,
  ip_address INET DEFAULT NULL,
  user_agent TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  view_id UUID;
BEGIN
  INSERT INTO property_views (property_id, user_id, ip_address, user_agent)
  VALUES (property_id, user_id, ip_address, user_agent)
  RETURNING id INTO view_id;
  
  RETURN view_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get real-time property stats
CREATE OR REPLACE FUNCTION get_property_stats(property_id UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'property_id', p.id,
    'views_count', COALESCE(pav.views_count, 0),
    'inquiries_count', COALESCE(pav.inquiries_count, 0),
    'last_viewed', pav.last_viewed,
    'last_inquiry', pav.last_inquiry,
    'is_available', p.is_available,
    'price_per_year', p.price_per_year,
    'updated_at', p.updated_at
  ) INTO result
  FROM properties p
  LEFT JOIN property_analytics_view pav ON p.id = pav.property_id
  WHERE p.id = property_id;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT SELECT ON agent_performance_view TO authenticated;
GRANT SELECT ON property_analytics_view TO authenticated;
GRANT EXECUTE ON FUNCTION get_dashboard_metrics(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_agent_performance(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION track_property_view(UUID, UUID, INET, TEXT) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_property_stats(UUID) TO authenticated, anon;

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE properties;
ALTER PUBLICATION supabase_realtime ADD TABLE payment_transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE property_inquiries;
ALTER PUBLICATION supabase_realtime ADD TABLE agent_applications;
ALTER PUBLICATION supabase_realtime ADD TABLE property_views;
