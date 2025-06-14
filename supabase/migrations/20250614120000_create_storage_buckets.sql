
-- Create storage buckets for document uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES 
    ('agent-id-photos', 'agent-id-photos', false),
    ('agent-selfies', 'agent-selfies', false),
    ('agent-cac-docs', 'agent-cac-docs', false)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for document uploads
CREATE POLICY "Anyone can upload agent documents" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id IN ('agent-id-photos', 'agent-selfies', 'agent-cac-docs'));

CREATE POLICY "Users can view agent documents" ON storage.objects
    FOR SELECT USING (bucket_id IN ('agent-id-photos', 'agent-selfies', 'agent-cac-docs'));

CREATE POLICY "Admins can delete agent documents" ON storage.objects
    FOR DELETE USING (bucket_id IN ('agent-id-photos', 'agent-selfies', 'agent-cac-docs'));
