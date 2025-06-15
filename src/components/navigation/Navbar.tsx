
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Menu, X, Home, Users, Building, Phone, FileCheck, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import UserMenu from "@/components/auth/UserMenu";
import AuthModal from "@/components/auth/AuthModal";
import NotificationCenter from "@/components/notifications/NotificationCenter";
import MessageCenter from "@/components/messaging/MessageCenter";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const location = useLocation();
  const { user, loading } = useAuth();

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
          : "bg-gray-900/90 backdrop-blur-md"
      )}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className={cn(
                  "text-xl font-bold transition-colors",
                  isScrolled ? "text-gray-900" : "text-white"
                )}>
                  PHCityRent
                </h1>
                <p className={cn(
                  "text-xs transition-colors",
                  isScrolled ? "text-gray-600" : "text-gray-300"
                )}>
                  Trusted Properties
                </p>
              </div>
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
                      "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105",
                      isActivePath(item.path)
                        ? isScrolled
                          ? "bg-orange-100 text-orange-700 shadow-sm"
                          : "bg-orange-600 text-white shadow-lg"
                        : isScrolled
                          ? "text-gray-800 hover:text-orange-600 hover:bg-orange-50 hover:shadow-md"
                          : "text-gray-100 hover:text-white hover:bg-white/20 hover:shadow-lg"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Auth Section with Notifications & Messages */}
            <div className="hidden lg:flex items-center space-x-2">
              {!loading && user && (
                <>
                  <NotificationCenter />
                  <MessageCenter />
                </>
              )}
              
              {loading ? (
                <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
              ) : user ? (
                <UserMenu />
              ) : (
                <Button 
                  onClick={() => setShowAuthModal(true)}
                  variant="outline"
                  className={cn(
                    "border-2 transition-all duration-200 hover:scale-105",
                    isScrolled
                      ? "border-orange-200 text-orange-700 hover:bg-orange-50 hover:border-orange-300"
                      : "border-white/50 text-white hover:bg-white/10 hover:border-white bg-white/5"
                  )}
                >
                  Sign In
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center space-x-2">
              {!loading && user && (
                <>
                  <NotificationCenter />
                  <MessageCenter />
                </>
              )}
              {!loading && user && <UserMenu />}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={cn(
                  "p-2 rounded-lg transition-all duration-200 hover:scale-105",
                  isScrolled 
                    ? "text-gray-800 hover:bg-gray-100" 
                    : "text-white hover:bg-white/20"
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
                        "flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 hover:scale-105",
                        isActivePath(item.path)
                          ? "bg-orange-100 text-orange-700 shadow-sm"
                          : "text-gray-800 hover:text-orange-600 hover:bg-orange-50"
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
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white hover:scale-105 transition-all duration-200"
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
