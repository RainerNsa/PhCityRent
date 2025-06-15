
-- First, update existing properties to mark some as featured and verified
UPDATE public.properties 
SET featured = true, is_verified = true 
WHERE id IN (
  SELECT id FROM public.properties 
  ORDER BY created_at ASC 
  LIMIT 2
);

-- Add more diverse Port Harcourt properties with authentic content
INSERT INTO public.properties (
    title, description, location, price_per_year, bedrooms, bathrooms, 
    area_sqft, property_type, amenities, featured, is_verified, contact_whatsapp, contact_email
) VALUES 
(
    'Executive 4BR Duplex in Old GRA',
    'Beautiful executive duplex with spacious rooms, modern kitchen, and private compound in the heart of Old GRA. Perfect for families seeking comfort and prestige.',
    'Old Government Residential Area, Port Harcourt',
    1500000,
    4,
    3,
    2000,
    'duplex',
    ARRAY['Private Compound', 'Modern Kitchen', 'Family Lounge', 'Study Room', 'Generator', 'Security'],
    true,
    true,
    '+234-804-567-8901',
    'david@phcityrent.com'
),
(
    'Luxury 2BR Flat in New GRA',
    'Newly built luxury apartment with contemporary finishes, fitted kitchen, and excellent security. Located in the prestigious New GRA area.',
    'New Government Residential Area, Port Harcourt',
    900000,
    2,
    2,
    1100,
    'apartment',
    ARRAY['Fitted Kitchen', 'Air Conditioning', 'Elevator', 'Swimming Pool', 'Gym', 'CCTV'],
    false,
    true,
    '+234-805-678-9012',
    'grace@phcityrent.com'
),
(
    'Affordable 3BR Bungalow in Ada George',
    'Comfortable family bungalow with large compound and good road access. Ideal for middle-income families looking for quality accommodation.',
    'Ada George, Port Harcourt',
    650000,
    3,
    2,
    1300,
    'bungalow',
    ARRAY['Large Compound', 'Good Road Access', 'Family Size', 'Parking Space', 'Water Supply'],
    false,
    false,
    '+234-806-789-0123',
    'peter@phcityrent.com'
),
(
    'Modern 1BR Studio in D-Line',
    'Compact and modern studio apartment perfect for young professionals. Located in the busy D-Line area with easy access to banks and offices.',
    'D-Line, Port Harcourt',
    450000,
    1,
    1,
    600,
    'studio',
    ARRAY['Modern Design', 'Central Location', 'Office Area', 'Kitchenette', 'Security'],
    false,
    true,
    '+234-807-890-1234',
    'sandra@phcityrent.com'
),
(
    'Spacious 5BR Family House in Rumuola',
    'Large family house with boys quarters, suitable for extended families. Located in the quiet residential area of Rumuola with good neighborhood.',
    'Rumuola, Port Harcourt',
    1100000,
    5,
    4,
    2500,
    'house',
    ARRAY['Boys Quarters', 'Large Family Size', 'Quiet Area', 'Good Neighborhood', 'Parking', 'Garden'],
    true,
    false,
    '+234-808-901-2345',
    'joseph@phcityrent.com'
);
