
import React from "react";
import { Button } from "@/components/ui/button";

interface VerificationFormFooterProps {
  isSubmitting: boolean;
  onClose: () => void;
}

const VerificationFormFooter = ({ isSubmitting, onClose }: VerificationFormFooterProps) => {
  return (
    <>
      <div className="flex gap-3 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-pulse-500 hover:bg-pulse-600"
        >
          {isSubmitting ? "Submitting Application..." : "Submit for Verification"}
        </Button>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">What happens next?</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>1. Our team reviews your documents (24-48 hours)</li>
          <li>2. We contact your referee via WhatsApp</li>
          <li>3. You receive approval/rejection notification</li>
          <li>4. Approved agents get a unique Agent ID and dashboard access</li>
        </ul>
      </div>
    </>
  );
};

export default VerificationFormFooter;
