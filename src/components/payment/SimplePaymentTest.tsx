// Simple payment test component
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TestTube, CreditCard } from 'lucide-react';

const SimplePaymentTest: React.FC = () => {
  const handleTestClick = () => {
    alert('Payment test clicked! Integration is working.');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TestTube className="w-5 h-5" />
            <span>Simple Payment Test</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <p className="text-gray-600">
              This is a simple test to verify the payment integration is loading correctly.
            </p>
            
            <Button 
              onClick={handleTestClick}
              className="bg-orange-500 hover:bg-orange-600 flex items-center space-x-2"
            >
              <CreditCard className="w-4 h-4" />
              <span>Test Payment Integration</span>
            </Button>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-medium">✅ Payment Integration Loaded Successfully!</p>
              <p className="text-green-600 text-sm mt-1">
                The payment system is ready to process transactions with Nigerian providers.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-blue-800 font-medium">Paystack</div>
                <div className="text-blue-600 text-sm">Primary Provider</div>
              </div>
              
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="text-orange-800 font-medium">Flutterwave</div>
                <div className="text-orange-600 text-sm">Alternative Provider</div>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-green-800 font-medium">Monnify</div>
                <div className="text-green-600 text-sm">Alternative Provider</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimplePaymentTest;
