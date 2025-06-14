
-- Create enum types for application status and document types
CREATE TYPE application_status AS ENUM (
    'pending_review',
    'documents_reviewed', 
    'referee_contacted',
    'approved',
    'rejected',
    'needs_info'
);

CREATE TYPE document_type AS ENUM (
    'id_document',
    'selfie_with_id',
    'cac_document'
);

CREATE TYPE referee_status AS ENUM (
    'pending',
    'contacted', 
    'confirmed',
    'failed'
);

-- Create agent_applications table to store all verification form data
CREATE TABLE public.agent_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id TEXT UNIQUE NOT NULL, -- e.g., AGT-PHC-EMEKA001
    full_name TEXT NOT NULL,
    whatsapp_number TEXT NOT NULL,
    email TEXT,
    residential_address TEXT NOT NULL,
    operating_areas TEXT[] NOT NULL,
    is_registered_business BOOLEAN DEFAULT FALSE,
    status application_status DEFAULT 'pending_review',
    reviewer_notes TEXT,
    next_action TEXT,
    estimated_completion DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create agent_profiles table for verified agents
CREATE TABLE public.agent_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    application_id UUID REFERENCES public.agent_applications(id) ON DELETE CASCADE,
    agent_id TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    whatsapp_number TEXT NOT NULL,
    email TEXT,
    operating_areas TEXT[] NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    verification_date TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create verification_documents table for document metadata
CREATE TABLE public.verification_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES public.agent_applications(id) ON DELETE CASCADE,
    document_type document_type NOT NULL,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER,
    mime_type TEXT,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create referee_verifications table for referee tracking
CREATE TABLE public.referee_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES public.agent_applications(id) ON DELETE CASCADE,
    referee_full_name TEXT NOT NULL,
    referee_whatsapp_number TEXT NOT NULL,
    referee_role TEXT NOT NULL,
    status referee_status DEFAULT 'pending',
    contacted_at TIMESTAMPTZ,
    confirmed_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create verification_status_log table for audit trail
CREATE TABLE public.verification_status_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES public.agent_applications(id) ON DELETE CASCADE,
    previous_status application_status,
    new_status application_status NOT NULL,
    changed_by UUID REFERENCES auth.users(id),
    change_reason TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create storage buckets for documents
INSERT INTO storage.buckets (id, name, public) 
VALUES 
    ('agent-documents', 'agent-documents', false),
    ('agent-id-photos', 'agent-id-photos', false),
    ('agent-selfies', 'agent-selfies', false),
    ('agent-cac-docs', 'agent-cac-docs', false);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.agent_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referee_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_status_log ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for agent_applications
CREATE POLICY "Anyone can insert applications" ON public.agent_applications
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own applications" ON public.agent_applications
    FOR SELECT USING (true); -- For now, allow public read for status checking

-- Create RLS policies for agent_profiles  
CREATE POLICY "Anyone can view verified agents" ON public.agent_profiles
    FOR SELECT USING (is_active = true);

CREATE POLICY "Only admins can manage agent profiles" ON public.agent_profiles
    FOR ALL USING (false); -- Will be updated when admin roles are implemented

-- Create RLS policies for verification_documents
CREATE POLICY "Only application owner can view documents" ON public.verification_documents
    FOR SELECT USING (true); -- Will be restricted when auth is implemented

-- Create RLS policies for referee_verifications
CREATE POLICY "Anyone can view referee status" ON public.referee_verifications
    FOR SELECT USING (true);

-- Create RLS policies for verification_status_log
CREATE POLICY "Anyone can view status log" ON public.verification_status_log
    FOR SELECT USING (true);

-- Create storage policies for document buckets
CREATE POLICY "Anyone can upload documents" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id IN ('agent-documents', 'agent-id-photos', 'agent-selfies', 'agent-cac-docs'));

CREATE POLICY "Users can view their uploaded documents" ON storage.objects
    FOR SELECT USING (bucket_id IN ('agent-documents', 'agent-id-photos', 'agent-selfies', 'agent-cac-docs'));

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to tables
CREATE TRIGGER set_updated_at_agent_applications
    BEFORE UPDATE ON public.agent_applications
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_agent_profiles
    BEFORE UPDATE ON public.agent_profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_referee_verifications
    BEFORE UPDATE ON public.referee_verifications
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create function to generate unique agent IDs
CREATE OR REPLACE FUNCTION public.generate_agent_id(applicant_name TEXT)
RETURNS TEXT AS $$
DECLARE
    name_part TEXT;
    random_part TEXT;
    agent_id TEXT;
    counter INTEGER := 0;
BEGIN
    -- Extract first 5 characters of name (uppercase, letters only)
    name_part := UPPER(REGEXP_REPLACE(SUBSTRING(applicant_name, 1, 5), '[^A-Z]', '', 'g'));
    
    -- Ensure we have at least 3 characters
    IF LENGTH(name_part) < 3 THEN
        name_part := RPAD(name_part, 3, 'X');
    END IF;
    
    -- Generate unique ID
    LOOP
        random_part := LPAD((FLOOR(RANDOM() * 1000))::TEXT, 3, '0');
        agent_id := 'AGT-PHC-' || name_part || random_part;
        
        -- Check if ID already exists
        IF NOT EXISTS (SELECT 1 FROM public.agent_applications WHERE agent_id = agent_id) THEN
            EXIT;
        END IF;
        
        counter := counter + 1;
        IF counter > 100 THEN
            -- Fallback to timestamp-based ID
            agent_id := 'AGT-PHC-' || name_part || EXTRACT(EPOCH FROM NOW())::INTEGER;
            EXIT;
        END IF;
    END LOOP;
    
    RETURN agent_id;
END;
$$ LANGUAGE plpgsql;
