
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "@/components/auth/AuthModal";
import UserMenu from "@/components/auth/UserMenu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Properties", path: "/properties" },
    { name: "Agents", path: "/agents" },
    { name: "Landlords", path: "/landlords" },
    { name: "Escrow", path: "/escrow" },
    { name: "Contact", path: "/contact" },
  ];

  const handleAuthClick = (mode: "signin" | "signup") => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/logo.svg" alt="PHCityRent" className="h-8 w-8" />
              <span className="font-display font-bold text-xl text-gray-900">
                PHCityRent
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? "text-pulse-600"
                      : "text-gray-700 hover:text-pulse-600"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                to="/verification-status"
                className="text-sm font-medium text-gray-700 hover:text-pulse-600"
              >
                Check Status
              </Link>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <UserMenu />
              ) : (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => handleAuthClick("signin")}
                  >
                    Sign In
                  </Button>
                  <Button
                    className="bg-pulse-500 hover:bg-pulse-600"
                    onClick={() => handleAuthClick("signup")}
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="md:hidden border-t border-gray-200 bg-white">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                      location.pathname === item.path
                        ? "text-pulse-600 bg-pulse-50"
                        : "text-gray-700 hover:text-pulse-600 hover:bg-gray-50"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <Link
                  to="/verification-status"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-pulse-600 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  Check Status
                </Link>
                
                {/* Mobile Auth Buttons */}
                <div className="pt-4 space-y-2">
                  {user ? (
                    <div className="px-3 py-2">
                      <UserMenu />
                    </div>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => {
                          handleAuthClick("signin");
                          setIsOpen(false);
                        }}
                      >
                        Sign In
                      </Button>
                      <Button
                        className="w-full bg-pulse-500 hover:bg-pulse-600"
                        onClick={() => {
                          handleAuthClick("signup");
                          setIsOpen(false);
                        }}
                      >
                        Get Started
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />
    </>
  );
};

export default Navbar;
