
import React from "react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/Footer";
import EnhancedBreadcrumb from "@/components/ui/enhanced-breadcrumb";
import WorkingPropertiesSearch from "@/components/properties/WorkingPropertiesSearch";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const Properties = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <EnhancedBreadcrumb 
            items={[{ label: 'Properties' }]} 
          />
          <WorkingPropertiesSearch />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Properties;
