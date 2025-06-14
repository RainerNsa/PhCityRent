import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Menu, X, Shield, Home, Users, Building, Phone, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import UserMenu from "@/components/auth/UserMenu";
import AuthModal from "@/components/auth/AuthModal";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const location = useLocation();
  const { user, loading } = useAuth(); // Changed from isLoading to loading

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Properties", path: "/properties", icon: Home },
    { name: "Agents", path: "/agents", icon: Users },
    { name: "Landlords", path: "/landlords", icon: Building },
    { name: "Escrow", path: "/escrow", icon: Shield },
    { name: "Contact", path: "/contact", icon: Phone },
    { name: "Status", path: "/verification-status", icon: FileCheck },
  ];

  const isActivePath = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled 
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100" 
          : "bg-transparent"
      )}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link to="/" className="flex items-center space-x-3 group">
              <img 
                src="/phcityrent-logo.svg" 
                alt="PHCityRent Logo" 
                className="h-8 w-auto transition-transform group-hover:scale-105" 
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={cn(
                      "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      isActivePath(item.path)
                        ? "bg-pulse-100 text-pulse-700 shadow-sm"
                        : isScrolled
                          ? "text-gray-700 hover:text-pulse-600 hover:bg-pulse-50"
                          : "text-white hover:text-pulse-200 hover:bg-white/10"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Auth Section */}
            <div className="hidden lg:flex items-center space-x-4">
              {loading ? (
                <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
              ) : user ? (
                <UserMenu />
              ) : (
                <Button 
                  onClick={() => setShowAuthModal(true)}
                  variant="outline"
                  className={cn(
                    "border-2 transition-all duration-200",
                    isScrolled
                      ? "border-pulse-200 text-pulse-700 hover:bg-pulse-50"
                      : "border-white/30 text-white hover:bg-white/10 hover:border-white/50"
                  )}
                >
                  Sign In
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center space-x-2">
              {!loading && user && <UserMenu />}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={cn(
                  "p-2 rounded-lg transition-colors duration-200",
                  isScrolled 
                    ? "text-gray-700 hover:bg-gray-100" 
                    : "text-white hover:bg-white/10"
                )}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-xl border-t border-gray-100 animate-in slide-in-from-top-5 duration-200">
              <div className="px-4 py-6 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={cn(
                        "flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200",
                        isActivePath(item.path)
                          ? "bg-pulse-100 text-pulse-700"
                          : "text-gray-700 hover:text-pulse-600 hover:bg-pulse-50"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
                
                {!user && (
                  <div className="pt-4 border-t border-gray-100">
                    <Button 
                      onClick={() => {
                        setShowAuthModal(true);
                        setIsMenuOpen(false);
                      }}
                      className="w-full bg-pulse-600 hover:bg-pulse-700 text-white"
                    >
                      Sign In
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
};

export default Navbar;
