
import React, { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

const GlobalErrorHandler = () => {
  const { toast } = useToast();

  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      
      toast({
        title: "Unexpected Error",
        description: "Something went wrong. Please try again or contact support if the problem persists.",
        variant: "destructive",
      });
    };

    const handleError = (event: ErrorEvent) => {
      console.error('Global error:', event.error);
      
      toast({
        title: "Application Error",
        description: "An error occurred while running the application.",
        variant: "destructive",
      });
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, [toast]);

  return null;
};

export default GlobalErrorHandler;
