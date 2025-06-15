
-- Create properties table for rental listings
CREATE TABLE public.properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    location TEXT NOT NULL,
    price_per_year INTEGER NOT NULL,
    price_per_month INTEGER GENERATED ALWAYS AS (price_per_year / 12) STORED,
    bedrooms INTEGER NOT NULL DEFAULT 1,
    bathrooms INTEGER NOT NULL DEFAULT 1,
    area_sqft INTEGER,
    property_type TEXT DEFAULT 'apartment',
    amenities TEXT[] DEFAULT '{}',
    images TEXT[] DEFAULT '{}',
    is_available BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    agent_id TEXT REFERENCES public.agent_applications(agent_id),
    landlord_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    featured BOOLEAN DEFAULT false,
    contact_whatsapp TEXT,
    contact_email TEXT
);

-- Add RLS policies for properties
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view available properties
CREATE POLICY "Anyone can view available properties" ON public.properties
    FOR SELECT USING (is_available = true);

-- Allow authenticated users to create properties
CREATE POLICY "Authenticated users can create properties" ON public.properties
    FOR INSERT TO authenticated WITH CHECK (true);

-- Allow owners to update their properties
CREATE POLICY "Owners can update their properties" ON public.properties
    FOR UPDATE TO authenticated USING (
        landlord_id = auth.uid() OR 
        agent_id IN (SELECT agent_id FROM public.profiles WHERE id = auth.uid())
    );

-- Allow admins to manage all properties
CREATE POLICY "Admins can manage all properties" ON public.properties
    FOR ALL TO authenticated USING (
        public.has_role(auth.uid(), 'admin'::app_role) OR 
        public.has_role(auth.uid(), 'super_admin'::app_role)
    );

-- Create property inquiries table
CREATE TABLE public.property_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    inquirer_name TEXT NOT NULL,
    inquirer_email TEXT NOT NULL,
    inquirer_phone TEXT,
    message TEXT,
    inquiry_type TEXT DEFAULT 'viewing_request',
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    responded_at TIMESTAMPTZ
);

-- Add RLS for inquiries
ALTER TABLE public.property_inquiries ENABLE ROW LEVEL SECURITY;

-- Property owners and agents can view inquiries for their properties
CREATE POLICY "Property stakeholders can view inquiries" ON public.property_inquiries
    FOR SELECT TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.properties p 
            WHERE p.id = property_id 
            AND (
                p.landlord_id = auth.uid() OR 
                p.agent_id IN (SELECT agent_id FROM public.profiles WHERE id = auth.uid())
            )
        )
    );

-- Anyone can create inquiries
CREATE POLICY "Anyone can create inquiries" ON public.property_inquiries
    FOR INSERT WITH CHECK (true);

-- Add updated_at trigger for properties
CREATE TRIGGER set_updated_at_properties
    BEFORE UPDATE ON public.properties
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Insert sample properties data
INSERT INTO public.properties (
    title, description, location, price_per_year, bedrooms, bathrooms, 
    area_sqft, property_type, amenities, images, contact_whatsapp, contact_email
) VALUES 
(
    'Modern 3BR Apartment in GRA',
    'Spacious apartment with modern amenities in the prestigious GRA area.',
    'Government Residential Area, Port Harcourt',
    800000,
    3,
    2,
    1200,
    'apartment',
    ARRAY['Parking', 'Generator', 'Security', 'Water'],
    ARRAY['/lovable-uploads/22d31f51-c174-40a7-bd95-00e4ad00eaf3.png'],
    '+234-801-234-5678',
    'agent@phcityrent.com'
),
(
    'Luxury 2BR Flat in Trans Amadi',
    'Fully furnished luxury apartment perfect for young professionals.',
    'Trans Amadi Industrial Layout, Port Harcourt',
    600000,
    2,
    2,
    900,
    'apartment',
    ARRAY['Furnished', 'AC', 'Kitchen', 'Balcony'],
    ARRAY['/lovable-uploads/5663820f-6c97-4492-9210-9eaa1a8dc415.png'],
    '+234-802-345-6789',
    'blessing@phcityrent.com'
),
(
    'Spacious 4BR House in Eliozu',
    'Perfect family home with large garden and modern security features.',
    'Eliozu, Port Harcourt',
    1200000,
    4,
    3,
    1800,
    'house',
    ARRAY['Garden', 'Garage', 'Study Room', 'CCTV'],
    ARRAY['/lovable-uploads/af412c03-21e4-4856-82ff-d1a975dc84a9.png'],
    '+234-803-456-7890',
    'chinedu@phcityrent.com'
);
