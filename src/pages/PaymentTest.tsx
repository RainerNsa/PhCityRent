// Simple Payment Test Page
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/Footer';
import { CreditCard, TestTube, ArrowRight } from 'lucide-react';

const PaymentTest: React.FC = () => {
  const navigate = useNavigate();
  const [testData, setTestData] = useState({
    amount: 450000, // ₦4,500
    reference: '',
    provider: 'paystack'
  });

  const generateTestReference = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `PHC_TEST_${timestamp}_${random}`;
  };

  const simulatePaymentSuccess = () => {
    const reference = testData.reference || generateTestReference();
    
    // Simulate payment processing delay
    setTimeout(() => {
      // Redirect to callback page with success status
      navigate(`/payment/callback?reference=${reference}&status=success&provider=${testData.provider}`);
    }, 2000);
  };

  const simulatePaymentFailure = () => {
    const reference = testData.reference || generateTestReference();
    
    // Simulate payment processing delay
    setTimeout(() => {
      // Redirect to callback page with failed status
      navigate(`/payment/callback?reference=${reference}&status=failed&provider=${testData.provider}`);
    }, 2000);
  };

  const testDirectCallback = () => {
    const reference = testData.reference || generateTestReference();
    // Direct navigation to test callback page
    navigate(`/payment/callback?reference=${reference}&status=success&provider=${testData.provider}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Flow Test</h1>
            <p className="text-gray-600">Test the payment callback and receipt system</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TestTube className="w-5 h-5" />
                <span>Payment Simulation</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Test Configuration */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="amount">Amount (₦)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={testData.amount}
                    onChange={(e) => setTestData({...testData, amount: parseInt(e.target.value) || 0})}
                    placeholder="450000"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Amount in Naira (will be converted to kobo for processing)
                  </p>
                </div>

                <div>
                  <Label htmlFor="reference">Custom Reference (Optional)</Label>
                  <Input
                    id="reference"
                    value={testData.reference}
                    onChange={(e) => setTestData({...testData, reference: e.target.value})}
                    placeholder="Leave empty to auto-generate"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Custom payment reference or leave empty for auto-generation
                  </p>
                </div>

                <div>
                  <Label htmlFor="provider">Payment Provider</Label>
                  <select
                    id="provider"
                    value={testData.provider}
                    onChange={(e) => setTestData({...testData, provider: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="paystack">Paystack</option>
                    <option value="flutterwave">Flutterwave</option>
                    <option value="monnify">Monnify</option>
                  </select>
                </div>
              </div>

              {/* Test Buttons */}
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Simulate Payment Flow</h4>
                  <p className="text-sm text-blue-700 mb-4">
                    These buttons simulate the complete payment process with a 2-second delay
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Button
                      onClick={simulatePaymentSuccess}
                      className="bg-green-500 hover:bg-green-600 flex items-center justify-center space-x-2"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Simulate Success</span>
                    </Button>
                    <Button
                      onClick={simulatePaymentFailure}
                      variant="destructive"
                      className="flex items-center justify-center space-x-2"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Simulate Failure</span>
                    </Button>
                  </div>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h4 className="font-medium text-orange-900 mb-2">Direct Callback Test</h4>
                  <p className="text-sm text-orange-700 mb-4">
                    Skip simulation and go directly to the callback page
                  </p>
                  <Button
                    onClick={testDirectCallback}
                    className="w-full bg-orange-500 hover:bg-orange-600 flex items-center justify-center space-x-2"
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span>Test Callback Page</span>
                  </Button>
                </div>
              </div>

              {/* Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">What This Tests</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Payment callback page loading</li>
                  <li>• Payment verification process</li>
                  <li>• Receipt generation and display</li>
                  <li>• PDF and image download functionality</li>
                  <li>• Error handling and user feedback</li>
                </ul>
              </div>

              {/* Current Test Data */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Current Test Configuration</h4>
                <div className="text-sm text-gray-700 space-y-1">
                  <p><strong>Amount:</strong> ₦{testData.amount.toLocaleString()}</p>
                  <p><strong>Reference:</strong> {testData.reference || 'Auto-generated'}</p>
                  <p><strong>Provider:</strong> {testData.provider}</p>
                  <p><strong>Test URL:</strong> /payment/callback?reference=PHC_TEST_...&status=success&provider={testData.provider}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={() => navigate('/payment/debug')}
              variant="outline"
              className="flex items-center justify-center space-x-2"
            >
              <TestTube className="w-4 h-4" />
              <span>Payment Debug</span>
            </Button>
            <Button
              onClick={() => navigate('/receipt/demo')}
              variant="outline"
              className="flex items-center justify-center space-x-2"
            >
              <CreditCard className="w-4 h-4" />
              <span>Receipt Demo</span>
            </Button>
            <Button
              onClick={() => navigate('/tenant-portal?tab=payments')}
              variant="outline"
              className="flex items-center justify-center space-x-2"
            >
              <ArrowRight className="w-4 h-4" />
              <span>Real Payments</span>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentTest;
