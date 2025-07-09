
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import AuthModal from "@/components/auth/AuthModal";

const Auth = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Use the auth redirect hook when user is authenticated
  useAuthRedirect();

  const handleClose = () => {
    // Navigate back to home page when modal is closed
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (user) {
    // The useAuthRedirect hook will handle the redirect
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <AuthModal isOpen={true} onClose={handleClose} />
    </div>
  );
};

export default Auth;
