
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Menu, X, Home } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.style.overflow = !isMenuOpen ? 'hidden' : '';
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    if (isMenuOpen) {
      setIsMenuOpen(false);
      document.body.style.overflow = '';
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 py-2 sm:py-3 md:py-4 transition-all duration-300",
        isScrolled 
          ? "bg-white/95 backdrop-blur-md shadow-elegant" 
          : "bg-white/80 backdrop-blur-sm"
      )}
    >
      <div className="container flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link 
          to="/" 
          className="flex items-center space-x-2"
          onClick={scrollToTop}
          aria-label="RentPH Safe"
        >
          <div className="bg-pulse-500 p-2 rounded-lg">
            <Home className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-display font-bold text-gray-900">RentPH Safe</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/properties" className="nav-link">Properties</Link>
          <Link to="/agents" className="nav-link">Agents</Link>
          <Link to="/escrow" className="nav-link">Escrow</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
        </nav>

        {/* Mobile menu button */}
        <button 
          className="md:hidden text-gray-700 p-3 focus:outline-none" 
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className={cn(
        "fixed inset-0 z-40 bg-white flex flex-col pt-16 px-6 md:hidden transition-all duration-300 ease-in-out",
        isMenuOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full pointer-events-none"
      )}>
        <nav className="flex flex-col space-y-8 items-center mt-8">
          <Link 
            to="/" 
            className="text-xl font-medium py-3 px-6 w-full text-center rounded-lg hover:bg-gray-100 transition-colors" 
            onClick={() => {
              setIsMenuOpen(false);
              document.body.style.overflow = '';
            }}
          >
            Home
          </Link>
          <Link 
            to="/properties" 
            className="text-xl font-medium py-3 px-6 w-full text-center rounded-lg hover:bg-gray-100 transition-colors" 
            onClick={() => {
              setIsMenuOpen(false);
              document.body.style.overflow = '';
            }}
          >
            Properties
          </Link>
          <Link 
            to="/agents" 
            className="text-xl font-medium py-3 px-6 w-full text-center rounded-lg hover:bg-gray-100 transition-colors" 
            onClick={() => {
              setIsMenuOpen(false);
              document.body.style.overflow = '';
            }}
          >
            Agents
          </Link>
          <Link 
            to="/escrow" 
            className="text-xl font-medium py-3 px-6 w-full text-center rounded-lg hover:bg-gray-100 transition-colors" 
            onClick={() => {
              setIsMenuOpen(false);
              document.body.style.overflow = '';
            }}
          >
            Escrow
          </Link>
          <Link 
            to="/contact" 
            className="text-xl font-medium py-3 px-6 w-full text-center rounded-lg hover:bg-gray-100 transition-colors" 
            onClick={() => {
              setIsMenuOpen(false);
              document.body.style.overflow = '';
            }}
          >
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
