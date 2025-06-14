
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VerificationStatus from "@/components/VerificationStatus";

const VerificationStatusPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-20">
        <VerificationStatus />
      </div>
      <Footer />
    </div>
  );
};

export default VerificationStatusPage;
