
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import UserMenu from "@/components/auth/UserMenu";
import AuthModal from "@/components/auth/AuthModal";
import VerificationForm from "@/components/VerificationForm";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [verificationType, setVerificationType] = useState<"agent" | "landlord">("agent");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleVerificationClick = (type: "agent" | "landlord") => {
    setVerificationType(type);
    setIsVerificationOpen(true);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <img src="/logo.svg" alt="PHCityRent" className="h-8 w-auto" />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/properties" className="text-gray-700 hover:text-pulse-600 transition-colors">
                Properties
              </Link>
              <Link to="/agents" className="text-gray-700 hover:text-pulse-600 transition-colors">
                Agents
              </Link>
              <Link to="/landlords" className="text-gray-700 hover:text-pulse-600 transition-colors">
                Landlords
              </Link>
              <Link to="/verification-status" className="text-gray-700 hover:text-pulse-600 transition-colors">
                Check Status
              </Link>
              
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => handleVerificationClick("agent")}
                  className="text-sm"
                >
                  Become an Agent
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleVerificationClick("landlord")}
                  className="text-sm"
                >
                  Verify as Landlord
                </Button>
                
                {user ? (
                  <UserMenu />
                ) : (
                  <Button onClick={() => setIsAuthModalOpen(true)}>
                    Sign In
                  </Button>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-pulse-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-100">
              <div className="space-y-2">
                <Link to="/properties" className="block px-3 py-2 text-gray-700 hover:text-pulse-600">
                  Properties
                </Link>
                <Link to="/agents" className="block px-3 py-2 text-gray-700 hover:text-pulse-600">
                  Agents
                </Link>
                <Link to="/landlords" className="block px-3 py-2 text-gray-700 hover:text-pulse-600">
                  Landlords
                </Link>
                <Link to="/verification-status" className="block px-3 py-2 text-gray-700 hover:text-pulse-600">
                  Check Status
                </Link>
                <div className="pt-2 space-y-2">
                  <Button
                    variant="outline"
                    onClick={() => handleVerificationClick("agent")}
                    className="w-full text-sm"
                  >
                    Become an Agent
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleVerificationClick("landlord")}
                    className="w-full text-sm"
                  >
                    Verify as Landlord
                  </Button>
                  {!user && (
                    <Button onClick={() => setIsAuthModalOpen(true)} className="w-full">
                      Sign In
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <VerificationForm
        isOpen={isVerificationOpen}
        onClose={() => setIsVerificationOpen(false)}
        type={verificationType}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};

export default Navbar;
