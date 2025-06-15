
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ErrorStateProps {
  title?: string;
  message?: string;
  showRetry?: boolean;
  showHome?: boolean;
  onRetry?: () => void;
  variant?: 'default' | 'destructive';
  className?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Something went wrong",
  message = "We encountered an unexpected error. Please try again.",
  showRetry = true,
  showHome = false,
  onRetry,
  variant = 'destructive',
  className = '',
}) => {
  const navigate = useNavigate();

  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <Alert variant={variant} className="max-w-md">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription className="space-y-4">
          <p>{message}</p>
          {(showRetry || showHome) && (
            <div className="flex gap-2 flex-wrap">
              {showRetry && onRetry && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRetry}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-3 w-3" />
                  Try Again
                </Button>
              )}
              {showHome && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/')}
                  className="flex items-center gap-2"
                >
                  <Home className="h-3 w-3" />
                  Go Home
                </Button>
              )}
            </div>
          )}
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default ErrorState;
