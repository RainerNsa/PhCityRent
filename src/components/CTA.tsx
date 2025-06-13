
import React, { useEffect, useRef } from "react";
import { ArrowRight, Home, UserCheck, Shield } from "lucide-react";

const CTA = () => {
  const ctaRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    if (ctaRef.current) {
      observer.observe(ctaRef.current);
    }
    
    return () => {
      if (ctaRef.current) {
        observer.unobserve(ctaRef.current);
      }
    };
  }, []);
  
  return (
    <section className="py-16 bg-gradient-to-br from-blue-600 to-green-600 relative" id="get-started" ref={ctaRef}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 opacity-0">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Find Your Perfect Home?
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Join thousands of satisfied tenants who found their dream homes through our secure platform
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {/* Find a House */}
          <div className="bg-white rounded-xl p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Home className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Find a House</h3>
            <p className="text-gray-600 mb-6">
              Browse verified listings and find your perfect rental property in Port Harcourt
            </p>
            <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center group">
              Start Searching
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
          
          {/* Verify Me As Agent */}
          <div className="bg-white rounded-xl p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserCheck className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Verify Me As Agent</h3>
            <p className="text-gray-600 mb-6">
              Join our network of trusted agents and list verified properties on our platform
            </p>
            <button className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center group">
              Get Verified
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
          
          {/* Escrow Your Rent */}
          <div className="bg-white rounded-xl p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Escrow Your Rent</h3>
            <p className="text-gray-600 mb-6">
              Secure your rent payment with our escrow service for complete peace of mind
            </p>
            <button className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center group">
              Secure Payment
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <p className="text-blue-100 mb-4">Questions? We're here to help!</p>
          <a 
            href="#contact" 
            className="text-white underline hover:no-underline transition-all"
          >
            Contact our support team
          </a>
        </div>
      </div>
      
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -z-10"></div>
    </section>
  );
};

export default CTA;
