
-- Create saved_properties table to track user favorites
CREATE TABLE public.saved_properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, property_id)
);

-- Enable Row Level Security
ALTER TABLE public.saved_properties ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for saved_properties
CREATE POLICY "Users can view their own saved properties" 
  ON public.saved_properties 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can save properties" 
  ON public.saved_properties 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their saved properties" 
  ON public.saved_properties 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add more property content with richer descriptions
UPDATE public.properties 
SET description = CASE 
  WHEN location = 'Old GRA' AND bedrooms = 4 THEN 
    'Luxurious 4-bedroom duplex in the prestigious Old GRA area of Port Harcourt. This stunning property features spacious rooms with high ceilings, modern fixtures, and a beautiful compound with ample parking space. Located in a serene environment with 24/7 security, close to major banks, shopping centers, and quality restaurants. Perfect for executives and families seeking comfort and prestige in Port Harcourt''s most coveted residential area.'
  WHEN location = 'New GRA' AND bedrooms = 3 THEN 
    'Modern 3-bedroom apartment in New GRA, Port Harcourt''s rapidly developing residential district. This contemporary home offers an open-plan living area, fitted kitchen with modern appliances, and en-suite bathrooms. The property includes a dedicated parking space, generator backup, and water supply. Ideal for young professionals and small families, with easy access to schools, hospitals, and the Port Harcourt Mall.'
  WHEN location = 'Trans Amadi' AND bedrooms = 2 THEN 
    'Affordable 2-bedroom flat in the bustling Trans Amadi area, perfect for young professionals working in the industrial hub of Port Harcourt. This well-maintained property features tiled floors, modern bathroom fixtures, and a compact kitchen. Located near major oil and gas companies, with good road networks and public transportation. Great value for money in one of Port Harcourt''s most accessible areas.'
  WHEN location = 'D-Line' AND bedrooms = 3 THEN 
    'Stylish 3-bedroom apartment in the heart of D-Line, one of Port Harcourt''s most vibrant neighborhoods. This property boasts modern interior design, spacious bedrooms with built-in wardrobes, and a contemporary kitchen. Located close to popular entertainment spots, restaurants, and shopping areas. Perfect for those who want to be at the center of Port Harcourt''s social and business activities.'
  WHEN location = 'Ada George' AND bedrooms = 4 THEN 
    'Spacious 4-bedroom bungalow in the peaceful Ada George area, offering privacy and tranquility away from the city center. This family-friendly home features a large living room, dining area, modern kitchen, and beautiful outdoor space perfect for children to play. The property includes a bore hole for constant water supply and is located in a secure, gated community with easy access to quality schools.'
  WHEN location = 'Rumuola' AND bedrooms = 2 THEN 
    'Cozy 2-bedroom apartment in Rumuola, a well-established residential area popular with families and professionals. This property offers comfortable living spaces, modern amenities, and is situated in a quiet street with good security. Close to the University of Port Harcourt Teaching Hospital and several reputable schools. Excellent value for money with reliable power and water supply.'
  WHEN location = 'Eliozu' AND bedrooms = 3 THEN 
    'Contemporary 3-bedroom terrace house in the growing Eliozu area, perfect for modern families. This property features an open-plan ground floor, three spacious bedrooms upstairs, and a private backyard. Located in a new development with paved roads, streetlights, and proper drainage. Close to emerging shopping centers and with easy access to the East-West Road for commuting.'
  WHEN location = 'Woji' AND bedrooms = 4 THEN 
    'Executive 4-bedroom duplex in the exclusive Woji area, designed for luxury living. This impressive property features a grand staircase, spacious rooms with en-suite bathrooms, a modern kitchen with island, and a beautiful garden. Located in a premium estate with 24/7 security, swimming pool, and recreational facilities. Perfect for executives and affluent families seeking the finest in Port Harcourt living.'
  ELSE description
END
WHERE description IS NULL OR description = '';

-- Update amenities with more realistic Nigerian property features
UPDATE public.properties 
SET amenities = CASE 
  WHEN location IN ('Old GRA', 'New GRA', 'Woji') THEN 
    ARRAY['24/7 Security', 'Generator Backup', 'Bore Hole Water', 'Spacious Compound', 'Parking Space', 'Modern Kitchen', 'En-suite Bathrooms', 'Tiled Floors', 'POP Ceiling', 'Wardrobe']
  WHEN location IN ('D-Line', 'Ada George') THEN 
    ARRAY['Security', 'Generator', 'Water Supply', 'Parking', 'Modern Fittings', 'Tiled', 'Kitchen Cabinets', 'Wardrobe', 'Balcony']
  ELSE 
    ARRAY['Water Supply', 'Tiled Floors', 'Modern Bathroom', 'Kitchen', 'Parking', 'Security']
END
WHERE amenities = '{}' OR amenities IS NULL;
