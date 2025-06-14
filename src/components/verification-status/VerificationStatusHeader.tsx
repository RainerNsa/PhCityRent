
import React from 'react';
import { Shield } from 'lucide-react';

const VerificationStatusHeader = () => {
  return (
    <div className="text-center mb-8">
      <div className="bg-pulse-100 p-3 rounded-lg w-fit mx-auto mb-4">
        <Shield className="w-8 h-8 text-pulse-600" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Verification Status</h1>
      <p className="text-gray-600">Check the status of your PHCityRent agent verification</p>
    </div>
  );
};

export default VerificationStatusHeader;
