
import React from 'react';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/Footer';
import SeedDataManager from '@/components/admin/SeedDataManager';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const AdminSeedData = () => {
  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar />
        <main className="pt-20 pb-12">
          <div className="container mx-auto px-4 py-8">
            <SeedDataManager />
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default AdminSeedData;
