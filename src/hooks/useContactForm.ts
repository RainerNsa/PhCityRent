
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  inquiryType: 'general' | 'property' | 'agent' | 'support';
}

export const useContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const submitContactForm = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call - in real app, this would go to your backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For now, we'll just show success message
      toast({
        title: "Message Sent Successfully!",
        description: "We'll get back to you within 24 hours.",
      });

      // Log the form data (in real app, send to API)
      console.log('Contact form submitted:', data);
      
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitContactForm,
    isSubmitting
  };
};
