import React from 'react';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import HowItWorks from '@/components/home/HowItWorks';
import Testimonials from '@/components/home/Testimonials';
import CallToAction from '@/components/home/CallToAction';
import Footer from '@/components/Footer';
import Navbar from '@/components/navigation/Navbar';
import DashboardQuickAccess from '@/components/navigation/DashboardQuickAccess';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
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

        <Features />
        <HowItWorks />
        <Testimonials />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
