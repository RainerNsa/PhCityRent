
import React from "react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/Footer";
import AgentDashboard from "@/components/AgentDashboard";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const AgentDashboardPage = () => {
  return (
    <ProtectedRoute requireAuth={true}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar />
        <div className="pt-20">
          <AgentDashboard />
        </div>
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default AgentDashboardPage;
