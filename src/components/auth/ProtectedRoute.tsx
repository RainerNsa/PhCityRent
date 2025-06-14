
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireAuth?: boolean;
}

const ProtectedRoute = ({ 
  children, 
  requireAdmin = false, 
  requireAuth = true 
}: ProtectedRouteProps) => {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pulse-500"></div>
      </div>
    );
  }

  if (requireAuth && !user) {
    return (
      <Navigate 
        to="/auth" 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  if (requireAdmin && !isAdmin) {
    return (
      <Navigate 
        to="/" 
        replace 
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
