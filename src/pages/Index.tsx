
import React from 'react';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import Footer from '@/components/Footer';
import Navbar from '@/components/navigation/Navbar';
import DashboardQuickAccess from '@/components/navigation/DashboardQuickAccess';
import PremiumFeatures from '@/components/PremiumFeatures';
import TrustIndicators from '@/components/TrustIndicators';
import TestimonialsShowcase from '@/components/TestimonialsShowcase';
import PropertyShowcase from '@/components/PropertyShowcase';
import CallToActionPremium from '@/components/CallToActionPremium';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <Navbar />
      <main>
        <Hero />
        
        {/* Dashboard Quick Access - Only show for authenticated users */}
        {user && (
          <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
              <DashboardQuickAccess />
            </div>
          </section>
        )}

        <TrustIndicators />
        <PremiumFeatures />
        <PropertyShowcase />
        <HowItWorks />
        <TestimonialsShowcase />
        <CallToActionPremium />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
