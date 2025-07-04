
import React from "react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/Footer";
import EnhancedPropertiesHeader from "@/components/properties/EnhancedPropertiesHeader";
import PropertiesContainer from "@/components/properties/PropertiesContainer";

const Properties = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20">
        <EnhancedPropertiesHeader />
        <PropertiesContainer />
      </main>
      <Footer />
    </div>
  );
};

export default Properties;
