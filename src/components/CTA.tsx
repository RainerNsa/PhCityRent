
import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, Home, UserCheck, Shield, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import VerificationForm from "./VerificationForm";

const CTA = () => {
  const ctaRef = useRef<HTMLDivElement>(null);
  const [showAgentForm, setShowAgentForm] = useState(false);
  const [showLandlordForm, setShowLandlordForm] = useState(false);
  
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
    <>
      <section className="py-16 relative bg-white" id="get-started" ref={ctaRef}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ready to Find Your Perfect Home?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied tenants who found their dream homes through our secure platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Find a House */}
            <div className="bg-orange-500 rounded-2xl p-6 text-center transition-all duration-300 hover:bg-orange-600 hover:scale-105 shadow-lg">
              <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Find a House</h3>
              <p className="text-white/90 mb-6">
                Browse verified listings and find your perfect rental property in Port Harcourt
              </p>
              <Link 
                to="/properties"
                className="bg-white text-orange-600 py-3 px-6 rounded-full font-medium transition-colors w-full group inline-flex items-center justify-center hover:bg-orange-50"
              >
                Start Searching
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            
            {/* Verify Me As Agent */}
            <div className="bg-green-500 rounded-2xl p-6 text-center transition-all duration-300 hover:bg-green-600 hover:scale-105 shadow-lg border-2 border-green-400">
              <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCheck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Verify Me As Agent</h3>
              <p className="text-white/90 mb-4">
                Join our network of trusted agents and list verified properties on our platform
              </p>
              <div className="flex items-center justify-center gap-2 mb-4">
                <CheckCircle className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-medium">Quick 2-min form</span>
              </div>
              <button 
                onClick={() => setShowAgentForm(true)}
                className="bg-white text-green-600 py-3 px-6 rounded-full font-medium hover:bg-green-50 transition-colors w-full group inline-flex items-center justify-center"
              >
                Get Verified Now
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
            
            {/* Escrow Your Rent */}
            <div className="bg-purple-500 rounded-2xl p-6 text-center transition-all duration-300 hover:bg-purple-600 hover:scale-105 shadow-lg">
              <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Escrow Your Rent</h3>
              <p className="text-white/90 mb-6">
                Secure your rent payment with our escrow service for complete peace of mind
              </p>
              <Link 
                to="/escrow"
                className="bg-white text-purple-600 py-3 px-6 rounded-full font-medium hover:bg-purple-50 transition-colors w-full group inline-flex items-center justify-center"
              >
                Secure Payment
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
          
          {/* Additional verification option for landlords with better visibility */}
          <div className="text-center mt-12 p-6 bg-slate-600 rounded-2xl max-w-md mx-auto shadow-lg">
            <UserCheck className="w-12 h-12 text-white mx-auto mb-3" />
            <p className="text-white mb-4 font-medium text-lg">Are you a landlord?</p>
            <p className="text-white/90 mb-4 text-sm">Get verified to list your properties directly</p>
            <button 
              onClick={() => setShowLandlordForm(true)}
              className="bg-white text-slate-600 px-8 py-3 rounded-full font-medium hover:bg-slate-50 transition-colors w-full group inline-flex items-center justify-center"
            >
              Verify as Landlord
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
          
          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">Questions? We're here to help!</p>
            <Link 
              to="/contact" 
              className="text-orange-500 underline hover:no-underline transition-all hover:text-orange-600"
            >
              Contact our support team
            </Link>
          </div>
        </div>
        
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-100 rounded-full blur-3xl -z-10"></div>
      </section>

      {/* Verification Forms */}
      <VerificationForm 
        isOpen={showAgentForm} 
        onClose={() => setShowAgentForm(false)} 
        type="agent" 
      />
      <VerificationForm 
        isOpen={showLandlordForm} 
        onClose={() => setShowLandlordForm(false)} 
        type="landlord" 
      />
    </>
  );
};

export default CTA;
