
import React from 'react';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/Footer';
import PropertyManagementDashboard from '@/components/properties/PropertyManagementDashboard';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const PropertyManagement = () => {
  return (
    <ProtectedRoute requireAuth={true}>
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-20 pb-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <PropertyManagementDashboard />
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default PropertyManagement;
