
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowRight, Shield, Home, Users, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

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
            <strong>Scam Alert:</strong> Over 200 rental scams reported in Port Harcourt last month. Don't be the next victim.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 items-center">
          <div className="w-full lg:w-1/2">
            <div 
              className="pulse-chip mb-3 sm:mb-6 opacity-0 animate-fade-in" 
              style={{ animationDelay: "0.1s" }}
            >
              <Shield className="w-4 h-4 mr-2" />
              <span>ID Verified Agents Only</span>
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
              No more WhatsApp chaos, fake agents, or losing your rent money. Find verified properties with ID-checked agents and secure your rent through bank-protected escrow. Your keys guaranteed or money back.
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
                  No more property lies
                </div>
                <div className="flex items-center text-gray-600">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                  No more paper receipts
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
              
              <Link 
                to="/agents" 
                className="button-secondary"
              >
                <Users className="mr-2 w-5 h-5" />
                Report Fake Agent
              </Link>
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
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80" 
                alt="Verified apartments in Port Harcourt" 
                className="w-full h-auto object-cover transition-transform duration-500 ease-out" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-pulse-500/20 to-transparent"></div>
              
              {/* Trust Badge Overlay */}
              <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-2 rounded-lg text-sm font-medium">
                <Shield className="w-4 h-4 inline mr-1" />
                Verified Property
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
