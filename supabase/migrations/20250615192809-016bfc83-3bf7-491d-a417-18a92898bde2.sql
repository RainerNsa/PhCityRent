
-- Create rental_applications table to store tenant application data
CREATE TABLE public.rental_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  property_id UUID REFERENCES public.properties,
  application_data JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'submitted',
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security
ALTER TABLE public.rental_applications ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own applications
CREATE POLICY "Users can view their own rental applications" 
  ON public.rental_applications 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy for users to create their own applications
CREATE POLICY "Users can create their own rental applications" 
  ON public.rental_applications 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own applications
CREATE POLICY "Users can update their own rental applications" 
  ON public.rental_applications 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create messages table for the messaging system
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES auth.users NOT NULL,
  recipient_id UUID REFERENCES auth.users NOT NULL,
  property_id UUID REFERENCES public.properties,
  subject TEXT,
  content TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security for messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Policy for users to view messages they sent or received
CREATE POLICY "Users can view their own messages" 
  ON public.messages 
  FOR SELECT 
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

-- Policy for users to send messages
CREATE POLICY "Users can send messages" 
  ON public.messages 
  FOR INSERT 
  WITH CHECK (auth.uid() = sender_id);

-- Policy for users to update messages they received (mark as read)
CREATE POLICY "Users can update received messages" 
  ON public.messages 
  FOR UPDATE 
  USING (auth.uid() = recipient_id);

-- Add trigger to update updated_at timestamp for rental_applications
CREATE TRIGGER handle_rental_applications_updated_at
    BEFORE UPDATE ON public.rental_applications
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();

-- Add trigger to update updated_at timestamp for messages
CREATE TRIGGER handle_messages_updated_at
    BEFORE UPDATE ON public.messages
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();
