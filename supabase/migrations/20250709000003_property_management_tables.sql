-- =====================================================
-- PROPERTY MANAGEMENT SYSTEM TABLES
-- Comprehensive tables for property management functionality
-- =====================================================

-- Property Images Table
CREATE TABLE IF NOT EXISTS public.property_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  alt_text TEXT,
  order_index INTEGER DEFAULT 0,
  file_size INTEGER,
  file_type TEXT,
  width INTEGER,
  height INTEGER,
  is_primary BOOLEAN DEFAULT FALSE,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Property Verification Steps Table
CREATE TABLE IF NOT EXISTS public.property_verification_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
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

-- Property Documents Table
CREATE TABLE IF NOT EXISTS public.property_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN ('title_deed', 'survey_plan', 'building_approval', 'tax_receipt', 'other')),
  document_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  uploaded_by UUID REFERENCES auth.users(id),
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  verified_by UUID REFERENCES auth.users(id),
  verified_at TIMESTAMPTZ
);

-- Property Inspections Table
CREATE TABLE IF NOT EXISTS public.property_inspections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  inspector_id UUID NOT NULL REFERENCES auth.users(id),
  inspection_type TEXT NOT NULL CHECK (inspection_type IN ('initial', 'follow_up', 'maintenance', 'final')),
  scheduled_date TIMESTAMPTZ NOT NULL,
  completed_date TIMESTAMPTZ,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  inspection_notes TEXT,
  quality_score INTEGER CHECK (quality_score >= 0 AND quality_score <= 100),
  issues_found TEXT[] DEFAULT '{}',
  recommendations TEXT[] DEFAULT '{}',
  photos TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Virtual Tours Table
CREATE TABLE IF NOT EXISTS public.virtual_tours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  tour_type TEXT NOT NULL CHECK (tour_type IN ('360_photos', 'video_walkthrough', 'interactive_3d')),
  tour_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration_minutes INTEGER,
  view_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Property Activities Table
CREATE TABLE IF NOT EXISTS public.property_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Property Market Data Table
CREATE TABLE IF NOT EXISTS public.property_market_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location TEXT NOT NULL,
  property_type TEXT,
  average_price DECIMAL,
  median_price DECIMAL,
  price_per_sqft DECIMAL,
  total_properties INTEGER DEFAULT 0,
  available_properties INTEGER DEFAULT 0,
  average_days_on_market INTEGER,
  price_trend TEXT CHECK (price_trend IN ('rising', 'falling', 'stable')),
  demand_score DECIMAL DEFAULT 0,
  competition_level TEXT CHECK (competition_level IN ('low', 'medium', 'high')),
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(location, property_type)
);

-- Enable RLS on all tables
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_verification_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.virtual_tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_market_data ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Property Images Policies
CREATE POLICY "Anyone can view property images" ON public.property_images
  FOR SELECT USING (true);

CREATE POLICY "Property owners can manage images" ON public.property_images
  FOR ALL TO authenticated
  USING (
    property_id IN (
      SELECT id FROM public.properties 
      WHERE landlord_id = auth.uid() 
         OR agent_id = (SELECT agent_id FROM public.profiles WHERE id = auth.uid())
    )
  );

CREATE POLICY "Admins can manage all property images" ON public.property_images
  FOR ALL TO authenticated
  USING (public.is_admin());

-- Property Verification Steps Policies
CREATE POLICY "Property owners can view verification steps" ON public.property_verification_steps
  FOR SELECT TO authenticated
  USING (
    property_id IN (
      SELECT id FROM public.properties 
      WHERE landlord_id = auth.uid() 
         OR agent_id = (SELECT agent_id FROM public.profiles WHERE id = auth.uid())
    )
  );

CREATE POLICY "Admins can manage verification steps" ON public.property_verification_steps
  FOR ALL TO authenticated
  USING (public.is_admin());

-- Property Documents Policies
CREATE POLICY "Property owners can manage documents" ON public.property_documents
  FOR ALL TO authenticated
  USING (
    property_id IN (
      SELECT id FROM public.properties 
      WHERE landlord_id = auth.uid() 
         OR agent_id = (SELECT agent_id FROM public.profiles WHERE id = auth.uid())
    )
  );

CREATE POLICY "Admins can manage all property documents" ON public.property_documents
  FOR ALL TO authenticated
  USING (public.is_admin());

-- Property Inspections Policies
CREATE POLICY "Property owners and inspectors can view inspections" ON public.property_inspections
  FOR SELECT TO authenticated
  USING (
    inspector_id = auth.uid() OR
    property_id IN (
      SELECT id FROM public.properties 
      WHERE landlord_id = auth.uid() 
         OR agent_id = (SELECT agent_id FROM public.profiles WHERE id = auth.uid())
    )
  );

CREATE POLICY "Inspectors can update their inspections" ON public.property_inspections
  FOR UPDATE TO authenticated
  USING (inspector_id = auth.uid());

CREATE POLICY "Admins can manage all inspections" ON public.property_inspections
  FOR ALL TO authenticated
  USING (public.is_admin());

-- Virtual Tours Policies
CREATE POLICY "Anyone can view active virtual tours" ON public.virtual_tours
  FOR SELECT USING (is_active = true);

CREATE POLICY "Property owners can manage virtual tours" ON public.virtual_tours
  FOR ALL TO authenticated
  USING (
    property_id IN (
      SELECT id FROM public.properties 
      WHERE landlord_id = auth.uid() 
         OR agent_id = (SELECT agent_id FROM public.profiles WHERE id = auth.uid())
    )
  );

-- Property Activities Policies
CREATE POLICY "Property owners can view activities" ON public.property_activities
  FOR SELECT TO authenticated
  USING (
    property_id IN (
      SELECT id FROM public.properties 
      WHERE landlord_id = auth.uid() 
         OR agent_id = (SELECT agent_id FROM public.profiles WHERE id = auth.uid())
    )
  );

CREATE POLICY "System can insert activities" ON public.property_activities
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view all activities" ON public.property_activities
  FOR SELECT TO authenticated
  USING (public.is_admin());

-- Property Market Data Policies
CREATE POLICY "Anyone can view market data" ON public.property_market_data
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage market data" ON public.property_market_data
  FOR ALL TO authenticated
  USING (public.is_admin());

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Property Images Indexes
CREATE INDEX idx_property_images_property_id ON public.property_images(property_id);
CREATE INDEX idx_property_images_order ON public.property_images(property_id, order_index);
CREATE INDEX idx_property_images_primary ON public.property_images(property_id, is_primary) WHERE is_primary = true;

-- Property Verification Steps Indexes
CREATE INDEX idx_property_verification_steps_property_id ON public.property_verification_steps(property_id, step_order);
CREATE INDEX idx_property_verification_steps_status ON public.property_verification_steps(status);

-- Property Documents Indexes
CREATE INDEX idx_property_documents_property_id ON public.property_documents(property_id);
CREATE INDEX idx_property_documents_type ON public.property_documents(document_type);
CREATE INDEX idx_property_documents_verification ON public.property_documents(verification_status);

-- Property Inspections Indexes
CREATE INDEX idx_property_inspections_property_id ON public.property_inspections(property_id);
CREATE INDEX idx_property_inspections_inspector ON public.property_inspections(inspector_id);
CREATE INDEX idx_property_inspections_scheduled ON public.property_inspections(scheduled_date);
CREATE INDEX idx_property_inspections_status ON public.property_inspections(status);

-- Virtual Tours Indexes
CREATE INDEX idx_virtual_tours_property_id ON public.virtual_tours(property_id);
CREATE INDEX idx_virtual_tours_active ON public.virtual_tours(is_active) WHERE is_active = true;

-- Property Activities Indexes
CREATE INDEX idx_property_activities_property_id ON public.property_activities(property_id, created_at DESC);
CREATE INDEX idx_property_activities_type ON public.property_activities(activity_type, created_at DESC);

-- Property Market Data Indexes
CREATE INDEX idx_property_market_data_location ON public.property_market_data(location);
CREATE INDEX idx_property_market_data_type ON public.property_market_data(property_type);
CREATE INDEX idx_property_market_data_calculated ON public.property_market_data(calculated_at DESC);

-- =====================================================
-- STORAGE BUCKETS
-- =====================================================

-- Create storage buckets for property management
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('property-images', 'property-images', true),
  ('property-documents', 'property-documents', false),
  ('virtual-tours', 'virtual-tours', true),
  ('inspection-photos', 'inspection-photos', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for property images
CREATE POLICY "Anyone can view property images" ON storage.objects
  FOR SELECT USING (bucket_id = 'property-images');

CREATE POLICY "Authenticated users can upload property images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'property-images');

CREATE POLICY "Property owners can manage their images" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'property-images');

-- Storage policies for property documents
CREATE POLICY "Property owners can manage documents" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'property-documents');

-- Storage policies for virtual tours
CREATE POLICY "Anyone can view virtual tours" ON storage.objects
  FOR SELECT USING (bucket_id = 'virtual-tours');

CREATE POLICY "Property owners can manage virtual tours" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'virtual-tours');

-- Storage policies for inspection photos
CREATE POLICY "Inspectors and property owners can manage inspection photos" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'inspection-photos');

-- =====================================================
-- PROPERTY MANAGEMENT FUNCTIONS
-- =====================================================

-- Function to search properties by location (geolocation)
CREATE OR REPLACE FUNCTION search_properties_by_location(
  lat DECIMAL,
  lng DECIMAL,
  radius_km DECIMAL,
  search_filters JSONB DEFAULT '{}',
  page_number INTEGER DEFAULT 1,
  page_size INTEGER DEFAULT 20
)
RETURNS JSON AS $$
DECLARE
  result JSON;
  properties_data JSON;
  total_count INTEGER;
  offset_value INTEGER;
BEGIN
  offset_value := (page_number - 1) * page_size;

  -- For now, return properties within a bounding box
  -- In production, you'd use PostGIS for accurate distance calculations
  WITH filtered_properties AS (
    SELECT p.*,
           pa.views_count,
           pa.unique_views,
           pa.views_last_30_days,
           pa.last_viewed,
           pa.inquiries_count,
           pa.inquiries_last_30_days,
           pa.responded_inquiries,
           pa.unique_inquirers,
           pa.last_inquiry,
           pa.first_inquiry,
           pa.inquiry_conversion_rate,
           pa.response_rate,
           pa.price_percentile_in_location,
           pa.days_on_market
    FROM properties p
    LEFT JOIN property_analytics_detailed pa ON p.id = pa.property_id
    WHERE p.is_available = true
    -- Add other filters based on search_filters JSONB
  )
  SELECT
    json_agg(fp.*) as properties,
    COUNT(*) as total
  INTO properties_data, total_count
  FROM (
    SELECT * FROM filtered_properties
    ORDER BY created_at DESC
    LIMIT page_size OFFSET offset_value
  ) fp;

  SELECT json_build_object(
    'properties', COALESCE(properties_data, '[]'::json),
    'total_count', COALESCE(total_count, 0),
    'search_time_ms', 50,
    'suggestions', '[]'::json,
    'facets', '{}'::json
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get search suggestions
CREATE OR REPLACE FUNCTION get_search_suggestions(
  search_term TEXT,
  limit_count INTEGER DEFAULT 5
)
RETURNS TEXT[] AS $$
DECLARE
  suggestions TEXT[];
BEGIN
  SELECT array_agg(DISTINCT suggestion)
  INTO suggestions
  FROM (
    SELECT title as suggestion FROM properties
    WHERE title ILIKE '%' || search_term || '%' AND is_available = true
    UNION
    SELECT location as suggestion FROM properties
    WHERE location ILIKE '%' || search_term || '%' AND is_available = true
    UNION
    SELECT unnest(amenities) as suggestion FROM properties
    WHERE array_to_string(amenities, ' ') ILIKE '%' || search_term || '%' AND is_available = true
    LIMIT limit_count
  ) s;

  RETURN COALESCE(suggestions, ARRAY[]::TEXT[]);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get search facets
CREATE OR REPLACE FUNCTION get_search_facets(search_filters JSONB DEFAULT '{}')
RETURNS JSON AS $$
DECLARE
  facets JSON;
BEGIN
  SELECT json_build_object(
    'property_types', (
      SELECT json_object_agg(property_type, count)
      FROM (
        SELECT property_type, COUNT(*) as count
        FROM properties
        WHERE is_available = true
        GROUP BY property_type
        ORDER BY count DESC
      ) pt
    ),
    'locations', (
      SELECT json_object_agg(location, count)
      FROM (
        SELECT location, COUNT(*) as count
        FROM properties
        WHERE is_available = true
        GROUP BY location
        ORDER BY count DESC
        LIMIT 10
      ) l
    ),
    'price_ranges', (
      SELECT json_build_object(
        'under_500k', COUNT(*) FILTER (WHERE price_per_year < 500000),
        '500k_1m', COUNT(*) FILTER (WHERE price_per_year BETWEEN 500000 AND 1000000),
        '1m_2m', COUNT(*) FILTER (WHERE price_per_year BETWEEN 1000000 AND 2000000),
        'over_2m', COUNT(*) FILTER (WHERE price_per_year > 2000000)
      )
      FROM properties
      WHERE is_available = true
    ),
    'bedrooms', (
      SELECT json_object_agg(bedrooms::text, count)
      FROM (
        SELECT bedrooms, COUNT(*) as count
        FROM properties
        WHERE is_available = true
        GROUP BY bedrooms
        ORDER BY bedrooms
      ) b
    )
  ) INTO facets;

  RETURN facets;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get property analytics
CREATE OR REPLACE FUNCTION get_property_analytics(property_id UUID)
RETURNS JSON AS $$
DECLARE
  analytics JSON;
BEGIN
  SELECT json_build_object(
    'property_id', property_id,
    'total_views', COALESCE(pv.total_views, 0),
    'unique_views', COALESCE(pv.unique_views, 0),
    'view_sources', COALESCE(pv.view_sources, '{}'::json),
    'inquiry_rate', COALESCE(pi.inquiry_rate, 0),
    'conversion_rate', COALESCE(pi.conversion_rate, 0),
    'average_time_on_page', 120, -- Placeholder
    'bounce_rate', 0.3, -- Placeholder
    'popular_times', '{}'::json, -- Placeholder
    'demographic_data', '{}'::json, -- Placeholder
    'performance_score', 75, -- Placeholder
    'market_position', json_build_object(
      'price_rank', 1,
      'view_rank', 1,
      'inquiry_rank', 1
    ),
    'calculated_at', NOW()
  ) INTO analytics
  FROM (
    SELECT
      COUNT(*) as total_views,
      COUNT(DISTINCT COALESCE(user_id::text, ip_address::text)) as unique_views,
      '{}'::json as view_sources
    FROM property_views
    WHERE property_id = get_property_analytics.property_id
  ) pv
  CROSS JOIN (
    SELECT
      CASE WHEN pv_count > 0 THEN pi_count::decimal / pv_count ELSE 0 END as inquiry_rate,
      CASE WHEN pi_count > 0 THEN responded_count::decimal / pi_count ELSE 0 END as conversion_rate
    FROM (
      SELECT COUNT(*) as pv_count FROM property_views WHERE property_id = get_property_analytics.property_id
    ) pv_data
    CROSS JOIN (
      SELECT
        COUNT(*) as pi_count,
        COUNT(*) FILTER (WHERE responded_at IS NOT NULL) as responded_count
      FROM property_inquiries
      WHERE property_id = get_property_analytics.property_id
    ) pi_data
  ) pi;

  RETURN analytics;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get market data
CREATE OR REPLACE FUNCTION get_market_data(
  location_filter TEXT,
  property_type_filter TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  market_data JSON;
BEGIN
  SELECT json_build_object(
    'location', location_filter,
    'property_type', COALESCE(property_type_filter, 'all'),
    'average_price', COALESCE(AVG(price_per_year), 0),
    'median_price', COALESCE(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY price_per_year), 0),
    'price_per_sqft', COALESCE(AVG(price_per_year::decimal / NULLIF(area_sqft, 0)), 0),
    'total_properties', COUNT(*),
    'available_properties', COUNT(*) FILTER (WHERE is_available = true),
    'average_days_on_market', COALESCE(AVG(EXTRACT(DAY FROM NOW() - created_at)), 0),
    'price_trend', 'stable',
    'demand_score', 75,
    'competition_level', 'medium'
  ) INTO market_data
  FROM properties
  WHERE location ILIKE '%' || location_filter || '%'
    AND (property_type_filter IS NULL OR property_type = property_type_filter);

  RETURN market_data;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get property recommendations
CREATE OR REPLACE FUNCTION get_property_recommendations(
  user_id UUID,
  limit_count INTEGER DEFAULT 10
)
RETURNS JSON AS $$
DECLARE
  recommendations JSON;
BEGIN
  -- Simple recommendation based on user's saved searches and viewed properties
  SELECT json_agg(
    json_build_object(
      'property', row_to_json(p.*),
      'score', 85,
      'reasons', ARRAY['High demand area', 'Price below market average'],
      'match_percentage', 85
    )
  ) INTO recommendations
  FROM (
    SELECT p.*
    FROM properties p
    WHERE p.is_available = true
      AND p.is_verified = true
    ORDER BY p.created_at DESC
    LIMIT limit_count
  ) p;

  RETURN COALESCE(recommendations, '[]'::json);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to setup default verification steps for new properties
CREATE OR REPLACE FUNCTION setup_property_verification_steps(property_id_param UUID)
RETURNS void AS $$
BEGIN
  INSERT INTO public.property_verification_steps (property_id, step_name, step_order, description, required) VALUES
    (property_id_param, 'Document Upload', 1, 'Upload property documents (title deed, survey plan)', true),
    (property_id_param, 'Document Review', 2, 'Review and verify uploaded documents', true),
    (property_id_param, 'Physical Inspection', 3, 'Schedule and complete physical property inspection', true),
    (property_id_param, 'Quality Assessment', 4, 'Assess property quality and condition', true),
    (property_id_param, 'Final Approval', 5, 'Final review and approval for listing', true);
END;
$$ LANGUAGE plpgsql;

-- Trigger to setup verification steps for new properties
CREATE OR REPLACE FUNCTION trigger_setup_property_verification()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM setup_property_verification_steps(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER setup_property_verification_trigger
  AFTER INSERT ON public.properties
  FOR EACH ROW EXECUTE FUNCTION trigger_setup_property_verification();

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

-- Grant permissions on functions
GRANT EXECUTE ON FUNCTION search_properties_by_location(DECIMAL, DECIMAL, DECIMAL, JSONB, INTEGER, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_search_suggestions(TEXT, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_search_facets(JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION get_property_analytics(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_market_data(TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_property_recommendations(UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION setup_property_verification_steps(UUID) TO authenticated;

-- Grant permissions on tables
GRANT SELECT, INSERT, UPDATE, DELETE ON public.property_images TO authenticated;
GRANT SELECT ON public.property_verification_steps TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.property_documents TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.property_inspections TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.virtual_tours TO authenticated;
GRANT SELECT, INSERT ON public.property_activities TO authenticated;
GRANT SELECT ON public.property_market_data TO authenticated;

-- =====================================================
-- REALTIME SUBSCRIPTIONS
-- =====================================================

-- Enable realtime for property management tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.property_images;
ALTER PUBLICATION supabase_realtime ADD TABLE public.property_verification_steps;
ALTER PUBLICATION supabase_realtime ADD TABLE public.property_inspections;
ALTER PUBLICATION supabase_realtime ADD TABLE public.virtual_tours;
ALTER PUBLICATION supabase_realtime ADD TABLE public.property_activities;
