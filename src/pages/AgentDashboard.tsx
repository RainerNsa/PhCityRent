
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AgentDashboard from "@/components/AgentDashboard";

const AgentDashboardPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-20">
        <AgentDashboard />
      </div>
      <Footer />
    </div>
  );
};

export default AgentDashboardPage;
