-- Enhance Quick Actions functionality with proper user profiles and messaging

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  role TEXT DEFAULT 'tenant' CHECK (role IN ('tenant', 'landlord', 'agent', 'admin')),
  avatar_url TEXT,
  bio TEXT,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enhance messages table if needed
DO $$ 
BEGIN
  -- Add indexes for better performance
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_messages_sender_id') THEN
    CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_messages_recipient_id') THEN
    CREATE INDEX idx_messages_recipient_id ON public.messages(recipient_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_messages_property_id') THEN
    CREATE INDEX idx_messages_property_id ON public.messages(property_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_messages_created_at') THEN
    CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);
  END IF;
END $$;

-- Enhance rental_applications table with indexes
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_rental_applications_user_id') THEN
    CREATE INDEX idx_rental_applications_user_id ON public.rental_applications(user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_rental_applications_property_id') THEN
    CREATE INDEX idx_rental_applications_property_id ON public.rental_applications(property_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_rental_applications_status') THEN
    CREATE INDEX idx_rental_applications_status ON public.rental_applications(status);
  END IF;
END $$;

-- Enhance saved_searches table with indexes
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_saved_searches_user_id') THEN
    CREATE INDEX idx_saved_searches_user_id ON public.saved_searches(user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_saved_searches_is_active') THEN
    CREATE INDEX idx_saved_searches_is_active ON public.saved_searches(is_active);
  END IF;
END $$;

-- Enhance saved_properties table with indexes
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_saved_properties_user_id') THEN
    CREATE INDEX idx_saved_properties_user_id ON public.saved_properties(user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_saved_properties_property_id') THEN
    CREATE INDEX idx_saved_properties_property_id ON public.saved_properties(property_id);
  END IF;
END $$;

-- Create a view for user statistics (for dashboard)
CREATE OR REPLACE VIEW public.user_dashboard_stats AS
SELECT 
  u.id as user_id,
  COALESCE(sp.saved_count, 0) as saved_properties_count,
  COALESCE(ra.pending_applications, 0) as pending_applications_count,
  COALESCE(ra.total_applications, 0) as total_applications_count,
  COALESCE(m.unread_messages, 0) as unread_messages_count,
  COALESCE(m.total_messages, 0) as total_messages_count,
  COALESCE(ss.active_searches, 0) as active_searches_count
FROM auth.users u
LEFT JOIN (
  SELECT user_id, COUNT(*) as saved_count
  FROM public.saved_properties
  GROUP BY user_id
) sp ON u.id = sp.user_id
LEFT JOIN (
  SELECT 
    user_id, 
    COUNT(*) as total_applications,
    COUNT(*) FILTER (WHERE status IN ('submitted', 'under_review')) as pending_applications
  FROM public.rental_applications
  GROUP BY user_id
) ra ON u.id = ra.user_id
LEFT JOIN (
  SELECT 
    recipient_id as user_id,
    COUNT(*) as total_messages,
    COUNT(*) FILTER (WHERE is_read = false) as unread_messages
  FROM public.messages
  GROUP BY recipient_id
) m ON u.id = m.user_id
LEFT JOIN (
  SELECT user_id, COUNT(*) as active_searches
  FROM public.saved_searches
  WHERE is_active = true
  GROUP BY user_id
) ss ON u.id = ss.user_id;

-- Grant access to the view
GRANT SELECT ON public.user_dashboard_stats TO authenticated;

-- Create RLS policy for the view
CREATE POLICY "Users can view their own dashboard stats" 
  ON public.user_dashboard_stats 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Enable RLS on the view
ALTER VIEW public.user_dashboard_stats ENABLE ROW LEVEL SECURITY;
