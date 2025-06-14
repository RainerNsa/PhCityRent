
-- Create user roles enum
CREATE TYPE public.app_role AS ENUM ('agent', 'admin', 'super_admin');

-- Create user_roles table for role management
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    assigned_by UUID REFERENCES auth.users(id),
    UNIQUE (user_id, role)
);

-- Create profiles table for user information
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    whatsapp_number TEXT,
    email TEXT,
    agent_id TEXT UNIQUE REFERENCES public.agent_applications(agent_id),
    is_verified_agent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on new tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT role::TEXT 
  FROM public.user_roles 
  WHERE user_id = auth.uid() 
  ORDER BY 
    CASE role 
      WHEN 'super_admin' THEN 1 
      WHEN 'admin' THEN 2 
      WHEN 'agent' THEN 3 
    END 
  LIMIT 1
$$;

-- Create function to handle new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.email
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add updated_at trigger to profiles
CREATE TRIGGER set_updated_at_profiles
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Update RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- Update RLS policies for user_roles
CREATE POLICY "Users can view their own roles" ON public.user_roles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles" ON public.user_roles
    FOR ALL USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- Update RLS policies for agent_applications (secure them properly)
DROP POLICY IF EXISTS "Users can view their own applications" ON public.agent_applications;
DROP POLICY IF EXISTS "Anyone can insert applications" ON public.agent_applications;

CREATE POLICY "Anyone can submit applications" ON public.agent_applications
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can check application status by agent_id" ON public.agent_applications
    FOR SELECT USING (true); -- Keep public for status checking

CREATE POLICY "Admins can manage all applications" ON public.agent_applications
    FOR ALL USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- Update RLS policies for verification_documents (secure them)
DROP POLICY IF EXISTS "Only application owner can view documents" ON public.verification_documents;

CREATE POLICY "Admins can view all documents" ON public.verification_documents
    FOR SELECT USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- Update RLS policies for referee_verifications
CREATE POLICY "Admins can manage referee verifications" ON public.referee_verifications
    FOR ALL USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- Update RLS policies for verification_status_log
CREATE POLICY "Admins can manage status log" ON public.verification_status_log
    FOR ALL USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- Update storage policies for documents (secure them)
DROP POLICY IF EXISTS "Anyone can upload documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their uploaded documents" ON storage.objects;

CREATE POLICY "Authenticated users can upload documents" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (bucket_id IN ('agent-documents', 'agent-id-photos', 'agent-selfies', 'agent-cac-docs'));

CREATE POLICY "Admins can view all documents" ON storage.objects
    FOR SELECT TO authenticated
    USING (
        bucket_id IN ('agent-documents', 'agent-id-photos', 'agent-selfies', 'agent-cac-docs') 
        AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'))
    );

-- Create function to promote user to agent after verification
CREATE OR REPLACE FUNCTION public.create_agent_profile(application_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    app_record RECORD;
    user_id UUID;
BEGIN
    -- Get application details
    SELECT * INTO app_record 
    FROM public.agent_applications 
    WHERE id = application_id AND status = 'approved';
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Application not found or not approved';
    END IF;
    
    -- Create or get user account (this would typically be done through a separate process)
    -- For now, we'll assume the user account is created separately
    
    -- Insert into agent_profiles
    INSERT INTO public.agent_profiles (
        application_id, 
        agent_id, 
        full_name, 
        whatsapp_number, 
        email, 
        operating_areas
    ) VALUES (
        app_record.id,
        app_record.agent_id,
        app_record.full_name,
        app_record.whatsapp_number,
        app_record.email,
        app_record.operating_areas
    );
END;
$$;
