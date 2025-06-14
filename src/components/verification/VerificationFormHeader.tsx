
import React from "react";
import { Button } from "@/components/ui/button";
import { UserCheck, X, Shield } from "lucide-react";

interface VerificationFormHeaderProps {
  type: "agent" | "landlord";
  onClose: () => void;
}

const VerificationFormHeader = ({ type, onClose }: VerificationFormHeaderProps) => {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-pulse-100 p-2 rounded-lg">
            <UserCheck className="w-6 h-6 text-pulse-600" />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold">
              {type === "agent" ? "Agent" : "Landlord"} Verification - PHCityRent
            </h2>
            <p className="text-sm text-gray-600">Get verified to build trust in Port Harcourt</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start gap-2">
          <Shield className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-yellow-800">Why We Verify</h3>
            <p className="text-sm text-yellow-700 mt-1">
              PHCityRent only works with verified agents to protect Port Harcourt renters from scams. 
              Your referee will be contacted to confirm your trustworthiness.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerificationFormHeader;
