
-- Create storage buckets for property images if they don't already exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for property images
CREATE POLICY "Anyone can view property images" ON storage.objects
    FOR SELECT USING (bucket_id = 'property-images');

CREATE POLICY "Authenticated users can upload property images" ON storage.objects
    FOR INSERT TO authenticated 
    WITH CHECK (bucket_id = 'property-images');

CREATE POLICY "Users can update their own property images" ON storage.objects
    FOR UPDATE TO authenticated
    USING (bucket_id = 'property-images' AND owner = auth.uid());

CREATE POLICY "Users can delete their own property images" ON storage.objects
    FOR DELETE TO authenticated
    USING (bucket_id = 'property-images' AND owner = auth.uid());

-- Enhance user role management with better RLS policies
-- Update properties table policies for better role-based access
DROP POLICY IF EXISTS "Owners can update their properties" ON properties;
CREATE POLICY "Property owners and agents can update properties" ON properties
    FOR UPDATE 
    USING (
        landlord_id = auth.uid() 
        OR agent_id IN (
            SELECT agent_id FROM profiles WHERE id = auth.uid()
        )
        OR has_role(auth.uid(), 'admin'::app_role)
        OR has_role(auth.uid(), 'super_admin'::app_role)
    );

-- Create policy for property deletion
CREATE POLICY "Property owners and admins can delete properties" ON properties
    FOR DELETE 
    USING (
        landlord_id = auth.uid() 
        OR has_role(auth.uid(), 'admin'::app_role)
        OR has_role(auth.uid(), 'super_admin'::app_role)
    );
