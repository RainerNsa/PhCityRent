
import { useEffect, useState } from 'react';

interface PaystackScriptLoaderProps {
  children: React.ReactNode;
}

const PaystackScriptLoader = ({ children }: PaystackScriptLoaderProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if Paystack is already loaded
    if (window.PaystackPop) {
      setIsLoaded(true);
      setIsLoading(false);
      return;
    }

    // Load Paystack script
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    
    script.onload = () => {
      setIsLoaded(true);
      setIsLoading(false);
    };
    
    script.onerror = () => {
      console.error('Failed to load Paystack script');
      setIsLoading(false);
    };

    document.head.appendChild(script);

    return () => {
      // Clean up script if component unmounts
      const existingScript = document.querySelector('script[src="https://js.paystack.co/v1/inline.js"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2">Loading payment system...</span>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">Failed to load payment system. Please check your internet connection and try again.</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default PaystackScriptLoader;
