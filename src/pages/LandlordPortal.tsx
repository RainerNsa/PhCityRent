
import React from 'react';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/Footer';
import LandlordDashboard from '@/components/landlord/LandlordDashboard';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const LandlordPortal = () => {
  return (
    <ProtectedRoute requireAuth={true}>
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-20 pb-12">
          <LandlordDashboard />
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default LandlordPortal;
