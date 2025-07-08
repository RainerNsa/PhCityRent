// Payment integration test component
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { usePayment, formatAmount, toKobo } from '@/hooks/usePayment';
import { PaymentProvider } from '@/types/payment';
import PaymentProviderSelector from './PaymentProviderSelector';
import { CheckCircle, AlertCircle, CreditCard, TestTube } from 'lucide-react';

const PaymentTest: React.FC = () => {
  const [selectedProvider, setSelectedProvider] = useState<PaymentProvider>('paystack');
  const [testAmount, setTestAmount] = useState(1000); // ₦10 in naira
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunningTest, setIsRunningTest] = useState(false);

  const { initializePayment, verifyPayment, isLoading } = usePayment();

  const testScenarios = [
    {
      id: 'small_payment',
      name: 'Small Payment Test',
      amount: 1000, // ₦10
      description: 'Test small amount payment processing'
    },
    {
      id: 'medium_payment',
      name: 'Medium Payment Test',
      amount: 50000, // ₦500
      description: 'Test medium amount payment processing'
    },
    {
      id: 'large_payment',
      name: 'Large Payment Test',
      amount: 100000, // ₦1,000
      description: 'Test large amount payment processing'
    }
  ];

  const runPaymentTest = async (scenario: any) => {
    setIsRunningTest(true);
    const startTime = Date.now();
    
    try {
      const reference = `TEST_${selectedProvider.toUpperCase()}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      
      console.log(`Starting ${scenario.name} with ${selectedProvider}...`);
      
      // Test payment initialization
      const paymentResponse = await initializePayment({
        email: 'test@phcityrent.com',
        amount: toKobo(scenario.amount),
        reference,
        currency: 'NGN',
        metadata: {
          transaction_type: 'test_payment',
          test_scenario: scenario.id,
          test_amount: scenario.amount,
          customer_name: 'Test User'
        },
        customization: {
          title: 'PHCityRent - Payment Test',
          description: scenario.description
        }
      }, selectedProvider);

      const endTime = Date.now();
      const duration = endTime - startTime;

      const result = {
        scenario: scenario.name,
        provider: selectedProvider,
        reference,
        amount: scenario.amount,
        status: paymentResponse.success ? 'success' : 'failed',
        duration,
        timestamp: new Date().toISOString(),
        response: paymentResponse
      };

      setTestResults(prev => [result, ...prev]);
      
      console.log(`${scenario.name} completed:`, result);
      
    } catch (error) {
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      const result = {
        scenario: scenario.name,
        provider: selectedProvider,
        reference: 'N/A',
        amount: scenario.amount,
        status: 'error',
        duration,
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      };

      setTestResults(prev => [result, ...prev]);
      console.error(`${scenario.name} failed:`, error);
    } finally {
      setIsRunningTest(false);
    }
  };

  const runAllTests = async () => {
    setTestResults([]);
    for (const scenario of testScenarios) {
      await runPaymentTest(scenario);
      // Wait 2 seconds between tests
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      success: { variant: 'default' as const, color: 'bg-green-100 text-green-800', icon: CheckCircle },
      failed: { variant: 'destructive' as const, color: 'bg-red-100 text-red-800', icon: AlertCircle },
      error: { variant: 'destructive' as const, color: 'bg-red-100 text-red-800', icon: AlertCircle }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.error;
    const IconComponent = config.icon;

    return (
      <Badge variant={config.variant} className={`${config.color} flex items-center space-x-1`}>
        <IconComponent className="w-3 h-3" />
        <span>{status.toUpperCase()}</span>
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TestTube className="w-5 h-5" />
            <span>Payment Integration Test Suite</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              This is a test environment. No real money will be charged. Use test cards provided by payment providers.
            </AlertDescription>
          </Alert>

          <div>
            <h4 className="font-medium mb-3">Select Payment Provider</h4>
            <PaymentProviderSelector
              selectedProvider={selectedProvider}
              onProviderChange={setSelectedProvider}
              amount={toKobo(testAmount)}
              disabled={isLoading || isRunningTest}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testScenarios.map((scenario) => (
              <Card key={scenario.id} className="border-dashed">
                <CardContent className="p-4">
                  <h5 className="font-medium mb-2">{scenario.name}</h5>
                  <p className="text-sm text-gray-600 mb-3">{scenario.description}</p>
                  <p className="text-lg font-semibold mb-3">{formatAmount(toKobo(scenario.amount))}</p>
                  <Button
                    onClick={() => runPaymentTest(scenario)}
                    disabled={isLoading || isRunningTest}
                    className="w-full"
                    size="sm"
                  >
                    {isRunningTest ? 'Testing...' : 'Run Test'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center">
            <Button
              onClick={runAllTests}
              disabled={isLoading || isRunningTest}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {isRunningTest ? 'Running Tests...' : 'Run All Tests'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {testResults.map((result, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{result.scenario}</p>
                        <p className="text-sm text-gray-500">
                          {result.provider} • {formatAmount(toKobo(result.amount))}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(result.status)}
                      <p className="text-xs text-gray-500 mt-1">
                        {result.duration}ms
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <p><strong>Reference:</strong> {result.reference}</p>
                    <p><strong>Timestamp:</strong> {new Date(result.timestamp).toLocaleString()}</p>
                    {result.error && (
                      <p className="text-red-600"><strong>Error:</strong> {result.error}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Test Card Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h5 className="font-medium mb-2">Paystack Test Cards</h5>
              <div className="text-sm space-y-1">
                <p><strong>Success:</strong> 4084084084084081</p>
                <p><strong>Insufficient Funds:</strong> 4084084084084099</p>
                <p><strong>Declined:</strong> 4084084084084107</p>
                <p><strong>CVV:</strong> Any 3 digits</p>
                <p><strong>Expiry:</strong> Any future date</p>
              </div>
            </div>
            
            <div>
              <h5 className="font-medium mb-2">Flutterwave Test Cards</h5>
              <div className="text-sm space-y-1">
                <p><strong>Success:</strong> 5531886652142950</p>
                <p><strong>Insufficient Funds:</strong> 5531886652142968</p>
                <p><strong>CVV:</strong> Any 3 digits</p>
                <p><strong>Expiry:</strong> Any future date</p>
              </div>
            </div>
            
            <div>
              <h5 className="font-medium mb-2">Monnify Test Cards</h5>
              <div className="text-sm space-y-1">
                <p><strong>Success:</strong> 5060666666666666666</p>
                <p><strong>CVV:</strong> Any 3 digits</p>
                <p><strong>Expiry:</strong> Any future date</p>
                <p><strong>PIN:</strong> 1234</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentTest;
