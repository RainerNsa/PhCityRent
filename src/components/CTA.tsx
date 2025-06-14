
import React from "react";
import { ArrowRight, Shield, Users, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-orange-500 via-red-500 to-purple-600 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Urgency Header */}
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-6">
            <Shield className="w-5 h-5" />
            <span className="font-medium">Join 5,000+ Protected Port Harcourt Residents</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Stop Feeding the Scammers.<br />
            Start Living Safely.
          </h2>
          
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Every day you wait, another Port Harcourt resident loses money to rental scams. 
            Don't be next. Join the protected community today.
          </p>

          {/* Value Props */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
              <CheckCircle className="w-8 h-8 mx-auto mb-3" />
              <h3 className="font-bold mb-2">ID-Verified Agents Only</h3>
              <p className="text-sm opacity-80">No more fake WhatsApp numbers</p>
            </div>
            <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
              <Shield className="w-8 h-8 mx-auto mb-3" />
              <h3 className="font-bold mb-2">Bank-Protected Payments</h3>
              <p className="text-sm opacity-80">Money back guarantee</p>
            </div>
            <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
              <Users className="w-8 h-8 mx-auto mb-3" />
              <h3 className="font-bold mb-2">Real Property Verification</h3>
              <p className="text-sm opacity-80">Physically inspected by our team</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/properties" 
              className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 flex items-center gap-2 group"
            >
              Find Safe Housing Now
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            
            <Link 
              to="/agents" 
              className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300"
            >
              Report Fake Agent
            </Link>
          </div>

          {/* Social Proof */}
          <div className="mt-12 pt-8 border-t border-white/20">
            <p className="text-sm opacity-80 mb-4">Trusted by Port Harcourt's largest communities:</p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <span className="bg-white/10 px-3 py-1 rounded-full">NYSC Corps Members</span>
              <span className="bg-white/10 px-3 py-1 rounded-full">UNIPORT Students</span>
              <span className="bg-white/10 px-3 py-1 rounded-full">Oil & Gas Workers</span>
              <span className="bg-white/10 px-3 py-1 rounded-full">Banking Professionals</span>
            </div>
          </div>

          {/* Urgency Footer */}
          <div className="mt-8 text-center">
            <p className="text-lg font-medium">
              🚨 Don't wait until you become the next scam victim
            </p>
            <p className="text-sm opacity-80 mt-2">
              Join now and get your first property verification free
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
