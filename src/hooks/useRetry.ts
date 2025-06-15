
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UseRetryOptions {
  maxAttempts?: number;
  delay?: number;
  onError?: (error: Error, attempt: number) => void;
}

export const useRetry = (options: UseRetryOptions = {}) => {
  const { maxAttempts = 3, delay = 1000, onError } = options;
  const [isRetrying, setIsRetrying] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const { toast } = useToast();

  const executeWithRetry = useCallback(async <T>(
    operation: () => Promise<T>,
    customMaxAttempts?: number
  ): Promise<T> => {
    const attempts = customMaxAttempts || maxAttempts;
    let lastError: Error;

    setIsRetrying(true);
    setAttemptCount(0);

    for (let attempt = 1; attempt <= attempts; attempt++) {
      try {
        setAttemptCount(attempt);
        const result = await operation();
        setIsRetrying(false);
        setAttemptCount(0);
        return result;
      } catch (error) {
        lastError = error as Error;
        console.error(`Attempt ${attempt} failed:`, error);
        
        onError?.(lastError, attempt);

        if (attempt === attempts) {
          setIsRetrying(false);
          setAttemptCount(0);
          
          toast({
            title: "Operation Failed",
            description: `Failed after ${attempts} attempts. Please try again later.`,
            variant: "destructive",
          });
          
          throw lastError;
        }

        if (attempt < attempts) {
          await new Promise(resolve => setTimeout(resolve, delay * attempt));
        }
      }
    }

    throw lastError!;
  }, [maxAttempts, delay, onError, toast]);

  return {
    executeWithRetry,
    isRetrying,
    attemptCount,
  };
};
