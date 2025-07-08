// Comprehensive Paystack test demonstration
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  CreditCard, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  DollarSign,
  User,
  Mail,
  Phone,
  Building,
  Clock
} from 'lucide-react';

declare global {
  interface Window {
    PaystackPop: any;
  }
}

const PaystackTestDemo: React.FC = () => {
  const [isPaystackLoaded, setIsPaystackLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentResult, setPaymentResult] = useState<any>(null);
  const [testData, setTestData] = useState({
    email: 'test@phcityrent.com',
    amount: 1000, // ₦10 in naira
    customerName: 'Test User',
    phone: '+2348012345678'
  });

  // Load Paystack script
  useEffect(() => {
    const loadPaystackScript = () => {
      if (window.PaystackPop) {
        setIsPaystackLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.async = true;
      
      script.onload = () => {
        setIsPaystackLoaded(true);
        console.log('✅ Paystack script loaded successfully');
      };
      
      script.onerror = () => {
        console.error('❌ Failed to load Paystack script');
      };

      document.head.appendChild(script);
    };

    loadPaystackScript();
  }, []);

  const initializePaystackPayment = () => {
    if (!isPaystackLoaded) {
      alert('Paystack is not loaded yet. Please wait and try again.');
      return;
    }

    setIsLoading(true);
    setPaymentResult(null);

    const reference = `PHC_TEST_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    
    console.log('🚀 Initializing Paystack payment with:', {
      email: testData.email,
      amount: testData.amount * 100, // Convert to kobo
      reference,
      publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY
    });

    try {
      const handler = window.PaystackPop.setup({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        email: testData.email,
        amount: testData.amount * 100, // Convert to kobo
        currency: 'NGN',
        ref: reference,
        metadata: {
          custom_fields: [
            {
              display_name: "Customer Name",
              variable_name: "customer_name",
              value: testData.customerName
            },
            {
              display_name: "Phone Number",
              variable_name: "phone",
              value: testData.phone
            },
            {
              display_name: "Transaction Type",
              variable_name: "transaction_type",
              value: "test_payment"
            }
          ]
        },
        callback: (response: any) => {
          console.log('✅ Payment successful:', response);
          setPaymentResult({
            status: 'success',
            reference: response.reference,
            transaction: response.trans,
            message: 'Payment completed successfully!',
            response: response
          });
          setIsLoading(false);
        },
        onClose: () => {
          console.log('❌ Payment window closed');
          setPaymentResult({
            status: 'cancelled',
            message: 'Payment was cancelled by user'
          });
          setIsLoading(false);
        }
      });

      handler.openIframe();
    } catch (error) {
      console.error('❌ Payment initialization failed:', error);
      setPaymentResult({
        status: 'error',
        message: error instanceof Error ? error.message : 'Payment initialization failed'
      });
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'cancelled':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5" />
            <span>Paystack Integration Test</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Paystack Status */}
          <Alert>
            {isPaystackLoaded ? (
              <>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  ✅ Paystack script loaded successfully. Ready to process payments.
                </AlertDescription>
              </>
            ) : (
              <>
                <Clock className="h-4 w-4" />
                <AlertDescription>
                  ⏳ Loading Paystack script...
                </AlertDescription>
              </>
            )}
          </Alert>

          {/* Configuration Display */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium mb-3">Current Configuration:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Environment:</strong> {import.meta.env.VITE_ENVIRONMENT || 'development'}</p>
                <p><strong>Public Key:</strong> {import.meta.env.VITE_PAYSTACK_PUBLIC_KEY ? '✅ Set' : '❌ Missing'}</p>
              </div>
              <div>
                <p><strong>Currency:</strong> NGN (Nigerian Naira)</p>
                <p><strong>Test Mode:</strong> ✅ Enabled</p>
              </div>
            </div>
          </div>

          {/* Test Data Form */}
          <div className="space-y-4">
            <h4 className="font-medium">Test Payment Details:</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email" className="flex items-center space-x-1">
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={testData.email}
                  onChange={(e) => setTestData({...testData, email: e.target.value})}
                  placeholder="test@phcityrent.com"
                />
              </div>
              
              <div>
                <Label htmlFor="amount" className="flex items-center space-x-1">
                  <DollarSign className="w-4 h-4" />
                  <span>Amount (₦)</span>
                </Label>
                <Input
                  id="amount"
                  type="number"
                  value={testData.amount}
                  onChange={(e) => setTestData({...testData, amount: parseInt(e.target.value) || 0})}
                  placeholder="1000"
                />
              </div>
              
              <div>
                <Label htmlFor="customerName" className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>Customer Name</span>
                </Label>
                <Input
                  id="customerName"
                  value={testData.customerName}
                  onChange={(e) => setTestData({...testData, customerName: e.target.value})}
                  placeholder="Test User"
                />
              </div>
              
              <div>
                <Label htmlFor="phone" className="flex items-center space-x-1">
                  <Phone className="w-4 h-4" />
                  <span>Phone</span>
                </Label>
                <Input
                  id="phone"
                  value={testData.phone}
                  onChange={(e) => setTestData({...testData, phone: e.target.value})}
                  placeholder="+2348012345678"
                />
              </div>
            </div>
          </div>

          {/* Payment Button */}
          <div className="text-center">
            <Button
              onClick={initializePaystackPayment}
              disabled={!isPaystackLoaded || isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pay ₦{testData.amount.toLocaleString()} with Paystack
                </>
              )}
            </Button>
          </div>

          {/* Payment Result */}
          {paymentResult && (
            <div className={`rounded-lg border p-4 ${getStatusColor(paymentResult.status)}`}>
              <div className="flex items-start space-x-3">
                {getStatusIcon(paymentResult.status)}
                <div className="flex-1">
                  <p className="font-medium">{paymentResult.message}</p>
                  {paymentResult.reference && (
                    <p className="text-sm mt-1">
                      <strong>Reference:</strong> {paymentResult.reference}
                    </p>
                  )}
                  {paymentResult.transaction && (
                    <p className="text-sm">
                      <strong>Transaction ID:</strong> {paymentResult.transaction}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test Cards Information */}
      <Card>
        <CardHeader>
          <CardTitle>Paystack Test Cards</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Use these test cards to simulate different payment scenarios. No real money will be charged.
              </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h5 className="font-medium text-green-800 mb-2">✅ Successful Payment</h5>
                <div className="text-sm text-green-700 space-y-1">
                  <p><strong>Card Number:</strong> 4084084084084081</p>
                  <p><strong>Expiry:</strong> Any future date (e.g., 12/25)</p>
                  <p><strong>CVV:</strong> Any 3 digits (e.g., 123)</p>
                </div>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h5 className="font-medium text-red-800 mb-2">❌ Insufficient Funds</h5>
                <div className="text-sm text-red-700 space-y-1">
                  <p><strong>Card Number:</strong> 4084084084084099</p>
                  <p><strong>Expiry:</strong> Any future date</p>
                  <p><strong>CVV:</strong> Any 3 digits</p>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h5 className="font-medium text-yellow-800 mb-2">⚠️ Declined Transaction</h5>
                <div className="text-sm text-yellow-700 space-y-1">
                  <p><strong>Card Number:</strong> 4084084084084107</p>
                  <p><strong>Expiry:</strong> Any future date</p>
                  <p><strong>CVV:</strong> Any 3 digits</p>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h5 className="font-medium text-blue-800 mb-2">🔐 PIN Required</h5>
                <div className="text-sm text-blue-700 space-y-1">
                  <p><strong>Card Number:</strong> 5060666666666666666</p>
                  <p><strong>Expiry:</strong> Any future date</p>
                  <p><strong>CVV:</strong> Any 3 digits</p>
                  <p><strong>PIN:</strong> 1234</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaystackTestDemo;
