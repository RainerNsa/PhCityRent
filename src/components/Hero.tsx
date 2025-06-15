
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowRight, Shield, Home, Users, AlertTriangle, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return (
    <section 
      className="overflow-hidden relative" 
      id="hero" 
      style={{
        background: 'linear-gradient(180deg, rgba(249,115,22,0.03) 0%, rgba(249,115,22,0.08) 50%, rgba(249,115,22,0.03) 100%)',
        padding: isMobile ? '100px 12px 40px' : '120px 20px 60px'
      }}
    >
      <div className="absolute -top-[10%] -right-[5%] w-1/2 h-[70%] bg-pulse-400/20 opacity-20 blur-3xl rounded-full"></div>
      
      <div className="container px-4 sm:px-6 lg:px-8" ref={containerRef}>
        {/* Scam Alert Banner */}
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 opacity-0 animate-fade-in">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700">
            <strong>Scam Alert:</strong> Over 200 rental scams reported in Port Harcourt last month. Report to EFCC: 0809 325 3322
          </p>
        </div>

        {/* Authentication Prompt for Non-Users */}
        {!user && (
          <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg flex items-center justify-between gap-3 opacity-0 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center gap-3">
              <UserPlus className="w-5 h-5 text-orange-600 flex-shrink-0" />
              <p className="text-sm text-orange-700">
                <strong>Join PHCityRent:</strong> Create an account to save searches, get property alerts, and contact verified agents directly.
              </p>
            </div>
            <Link to="/auth">
              <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white whitespace-nowrap">
                Sign Up Free
              </Button>
            </Link>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 items-center">
          <div className="w-full lg:w-1/2">
            <div 
              className="pulse-chip mb-3 sm:mb-6 opacity-0 animate-fade-in" 
              style={{ animationDelay: "0.1s" }}
            >
              <Shield className="w-4 h-4 mr-2" />
              <span>Rivers State Verified Agents Only</span>
            </div>
            
            <h1 
              className="section-title opacity-0 animate-fade-in text-gray-900" 
              style={{ animationDelay: "0.3s" }}
            >
              Stop Paying Double Rent<br className="hidden sm:inline" />
              <span className="text-mask-image bg-hero-gradient">in Port Harcourt</span>
            </h1>
            
            <p 
              style={{ animationDelay: "0.5s" }} 
              className="section-subtitle opacity-0 animate-fade-in"
            >
              No more WhatsApp wahala, fake agents, or losing your hard-earned money. Find verified properties in GRA, Trans Amadi, D-Line and other Port Harcourt areas with ID-checked agents. Your keys guaranteed or full refund.
            </p>

            {/* Problem Points */}
            <div className="mb-6 opacity-0 animate-fade-in" style={{ animationDelay: "0.6s" }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center text-gray-600">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                  No more fake agent numbers
                </div>
                <div className="flex items-center text-gray-600">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                  No more double payments
                </div>
                <div className="flex items-center text-gray-600">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                  No more property lies in GRA
                </div>
                <div className="flex items-center text-gray-600">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                  No more fake receipts
                </div>
              </div>
            </div>
            
            <div 
              className="flex flex-col sm:flex-row gap-4 opacity-0 animate-fade-in" 
              style={{ animationDelay: "0.7s" }}
            >
              <Link 
                to="/properties" 
                className="button-primary group"
              >
                <Home className="mr-2 w-5 h-5" />
                Find Verified Property
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              
              {!user ? (
                <Link 
                  to="/auth" 
                  className="button-secondary"
                >
                  <UserPlus className="mr-2 w-5 h-5" />
                  Join Free - No Scams
                </Link>
              ) : (
                <Link 
                  to="/agents" 
                  className="button-secondary"
                >
                  <Users className="mr-2 w-5 h-5" />
                  Report Fake Agent
                </Link>
              )}
            </div>

            {/* Trust Indicators */}
            <div className="mt-6 opacity-0 animate-fade-in" style={{ animationDelay: "0.8s" }}>
              <p className="text-sm text-gray-500 mb-2">Trusted by Port Harcourt residents:</p>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span>✓ NYSC Corps Members</span>
                <span>✓ UNIPORT Students</span>
                <span>✓ Oil & Gas Workers</span>
              </div>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 relative mt-6 lg:mt-0">
            <div className="robot-image-container bg-white">
              <img 
                src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=800&q=80" 
                alt="Modern duplex house in Port Harcourt GRA" 
                className="w-full h-auto object-cover transition-transform duration-500 ease-out" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-pulse-500/20 to-transparent"></div>
              
              {/* Trust Badge Overlay */}
              <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-2 rounded-lg text-sm font-medium">
                <Shield className="w-4 h-4 inline mr-1" />
                PH Verified Property
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="hidden lg:block absolute bottom-0 left-1/4 w-64 h-64 bg-pulse-100/30 rounded-full blur-3xl -z-10"></div>
    </section>
  );
};

export default Hero;
