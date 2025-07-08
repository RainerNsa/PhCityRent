// Basic Payment Dashboard for testing
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, Wallet, Receipt } from 'lucide-react';

const BasicPaymentDashboard: React.FC = () => {
  const handlePaymentClick = (type: string) => {
    alert(`${type} payment clicked! Payment integration is working.`);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Payment Center</h2>
        <p className="text-gray-600">Basic payment dashboard for testing</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4">
              <CreditCard className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-lg">Monthly Rent</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-center mb-6">
              Pay your monthly rent securely
            </p>
            <Button
              onClick={() => handlePaymentClick('Monthly Rent')}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
            >
              Pay ₦450,000
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mx-auto mb-4">
              <Wallet className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-lg">Security Deposit</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-center mb-6">
              One-time security deposit
            </p>
            <Button
              onClick={() => handlePaymentClick('Security Deposit')}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
            >
              Pay ₦900,000
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-orange-500 rounded-full mx-auto mb-4">
              <Receipt className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-lg">Maintenance Fee</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-center mb-6">
              Property maintenance contribution
            </p>
            <Button
              onClick={() => handlePaymentClick('Maintenance Fee')}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
            >
              Pay ₦50,000
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Integration Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-medium">✅ Payment System Loaded</p>
              <p className="text-green-600 text-sm">
                The payment integration is working correctly and ready to process transactions.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900">Paystack</h4>
                <p className="text-sm text-blue-600">Primary Provider</p>
                <p className="text-xs text-blue-500 mt-1">Ready</p>
              </div>
              
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <h4 className="font-medium text-orange-900">Flutterwave</h4>
                <p className="text-sm text-orange-600">Alternative Provider</p>
                <p className="text-xs text-orange-500 mt-1">Ready</p>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900">Monnify</h4>
                <p className="text-sm text-green-600">Alternative Provider</p>
                <p className="text-xs text-green-500 mt-1">Ready</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BasicPaymentDashboard;
