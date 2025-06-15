
-- Create storage buckets for document uploads (if they don't exist)
INSERT INTO storage.buckets (id, name, public) 
VALUES 
    ('agent-documents', 'agent-documents', false),
    ('agent-id-photos', 'agent-id-photos', false),
    ('agent-selfies', 'agent-selfies', false),
    ('agent-cac-docs', 'agent-cac-docs', false),
    ('property-images', 'property-images', true),
    ('user-avatars', 'user-avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for agent document uploads
CREATE POLICY "Authenticated users can upload agent documents" ON storage.objects
    FOR INSERT TO authenticated 
    WITH CHECK (bucket_id IN ('agent-documents', 'agent-id-photos', 'agent-selfies', 'agent-cac-docs'));

CREATE POLICY "Admins can view all agent documents" ON storage.objects
    FOR SELECT TO authenticated
    USING (
        bucket_id IN ('agent-documents', 'agent-id-photos', 'agent-selfies', 'agent-cac-docs') 
        AND (
            public.has_role(auth.uid(), 'admin'::app_role) OR 
            public.has_role(auth.uid(), 'super_admin'::app_role)
        )
    );

-- Create storage policies for property images (public)
CREATE POLICY "Anyone can view property images" ON storage.objects
    FOR SELECT USING (bucket_id = 'property-images');

CREATE POLICY "Authenticated users can upload property images" ON storage.objects
    FOR INSERT TO authenticated 
    WITH CHECK (bucket_id = 'property-images');

-- Create storage policies for user avatars (public)
CREATE POLICY "Anyone can view user avatars" ON storage.objects
    FOR SELECT USING (bucket_id = 'user-avatars');

CREATE POLICY "Users can upload their own avatars" ON storage.objects
    FOR INSERT TO authenticated 
    WITH CHECK (bucket_id = 'user-avatars');

-- Allow deletion of files by admins and file owners
CREATE POLICY "Admins can delete agent documents" ON storage.objects
    FOR DELETE TO authenticated
    USING (
        bucket_id IN ('agent-documents', 'agent-id-photos', 'agent-selfies', 'agent-cac-docs')
        AND (
            public.has_role(auth.uid(), 'admin'::app_role) OR 
            public.has_role(auth.uid(), 'super_admin'::app_role)
        )
    );
