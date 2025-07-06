
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Zap, Shield, Star } from 'lucide-react';

const CallToActionPremium = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-1/2 right-20 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Floating Icons */}
        <div className="absolute top-20 right-1/4 animate-float">
          <Sparkles className="w-8 h-8 text-white/30" />
        </div>
        <div className="absolute bottom-32 left-1/4 animate-float" style={{ animationDelay: '1s' }}>
          <Zap className="w-10 h-10 text-white/30" />
        </div>
        <div className="absolute top-1/3 right-1/3 animate-float" style={{ animationDelay: '2s' }}>
          <Shield className="w-6 h-6 text-white/30" />
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative text-center">
        <div className="mb-8">
          <div className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-full text-sm font-semibold mb-6">
            <Star className="w-4 h-4 mr-2 fill-current" />
            Join 10,000+ Happy Users
          </div>
          
          <h2 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Your Dream Home
            <br />
            <span className="bg-gradient-to-r from-yellow-200 to-white bg-clip-text text-transparent">
              Awaits You
            </span>
          </h2>
          
          <p className="text-xl lg:text-2xl text-white/90 max-w-4xl mx-auto mb-12 leading-relaxed">
            Don't let another perfect property slip away. Join Nigeria's most trusted rental platform and discover your ideal home in minutes, not months.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
          <Button 
            size="lg"
            className="bg-white text-orange-600 hover:bg-gray-50 px-12 py-6 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 group"
          >
            Start Your Search
            <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
          
          <Button 
            size="lg"
            variant="outline"
            className="border-2 border-white text-white hover:bg-white hover:text-orange-600 px-12 py-6 text-xl font-bold rounded-2xl backdrop-blur-sm hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            List Your Property
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">500+</div>
            <div className="text-white/80 text-sm">Verified Properties</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">24/7</div>
            <div className="text-white/80 text-sm">Customer Support</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">100%</div>
            <div className="text-white/80 text-sm">Secure Payments</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">98%</div>
            <div className="text-white/80 text-sm">Success Rate</div>
          </div>
        </div>

        {/* Urgency Message */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 max-w-3xl mx-auto">
          <div className="flex items-center justify-center mb-4">
            <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            <span className="text-white font-semibold">Limited Time Offer</span>
          </div>
          <p className="text-white/90 text-lg">
            Sign up today and get <span className="font-bold text-yellow-300">3 months free premium access</span> to our AI-powered property matching service. 
            <br />
            <span className="text-sm text-white/70 mt-2 block">Join before this offer expires!</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default CallToActionPremium;
