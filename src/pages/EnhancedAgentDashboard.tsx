
import React from 'react';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/Footer';
import EnhancedAgentDashboard from '@/components/agent/EnhancedAgentDashboard';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const EnhancedAgentDashboardPage = () => {
  return (
    <ProtectedRoute requireAuth={true}>
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-20 pb-12">
          <EnhancedAgentDashboard />
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default EnhancedAgentDashboardPage;
