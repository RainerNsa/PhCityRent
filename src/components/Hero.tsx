
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowRight, Shield, Home, Users } from "lucide-react";

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
      className="overflow-hidden relative bg-gradient-to-br from-blue-50 to-green-50" 
      id="hero" 
      style={{
        padding: isMobile ? '100px 12px 40px' : '120px 20px 60px'
      }}
    >
      <div className="absolute -top-[10%] -right-[5%] w-1/2 h-[70%] bg-blue-400/20 opacity-20 blur-3xl rounded-full"></div>
      
      <div className="container px-4 sm:px-6 lg:px-8" ref={containerRef}>
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 items-center">
          <div className="w-full lg:w-1/2">
            <div 
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600 border border-blue-200 mb-3 sm:mb-6 opacity-0 animate-fade-in" 
              style={{ animationDelay: "0.1s" }}
            >
              <Shield className="w-4 h-4 mr-2" />
              <span>Verified Listings Only</span>
            </div>
            
            <h1 
              className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight opacity-0 animate-fade-in text-gray-900" 
              style={{ animationDelay: "0.3s" }}
            >
              No More Rent Scams<br className="hidden sm:inline" />
              <span className="text-blue-600">in Port Harcourt</span>
            </h1>
            
            <p 
              style={{ animationDelay: "0.5s" }} 
              className="mt-3 sm:mt-6 mb-4 sm:mb-8 leading-relaxed opacity-0 animate-fade-in text-gray-700 font-normal text-base sm:text-lg"
            >
              Find verified rental properties, connect with trusted agents, and secure your rent through our escrow service. Your dream home awaits - scam-free guaranteed.
            </p>
            
            <div 
              className="flex flex-col sm:flex-row gap-4 opacity-0 animate-fade-in" 
              style={{ animationDelay: "0.7s" }}
            >
              <a 
                href="#listings" 
                className="flex items-center justify-center group w-full sm:w-auto text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <Home className="mr-2 w-5 h-5" />
                Find a House
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
              
              <a 
                href="#verify-agent" 
                className="flex items-center justify-center w-full sm:w-auto text-center bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-medium py-4 px-6 rounded-lg transition-all duration-300"
              >
                <Users className="mr-2 w-5 h-5" />
                Verify Me As Agent
              </a>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 relative mt-6 lg:mt-0">
            <div className="relative transition-all duration-500 ease-out overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl bg-white">
              <img 
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80" 
                alt="Modern apartments in Port Harcourt" 
                className="w-full h-auto object-cover transition-transform duration-500 ease-out" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="hidden lg:block absolute bottom-0 left-1/4 w-64 h-64 bg-green-100/30 rounded-full blur-3xl -z-10"></div>
    </section>
  );
};

export default Hero;
