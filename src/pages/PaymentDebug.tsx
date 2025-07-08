// Debug page for payment integration
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BasicPaymentDashboard from '@/components/payment/BasicPaymentDashboard';
import SimplePaymentTest from '@/components/payment/SimplePaymentTest';
import PaystackTestDemo from '@/components/payment/PaystackTestDemo';
import { TestTube, CreditCard, AlertCircle } from 'lucide-react';

const PaymentDebug: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("payments");
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    console.log('URL tab parameter:', tabParam);

    if (tabParam && ['payments', 'test', 'paystack'].includes(tabParam)) {
      setActiveTab(tabParam);
      console.log('Setting active tab to:', tabParam);
    }

    setDebugInfo({
      urlTab: tabParam,
      activeTab: activeTab,
      searchParams: Object.fromEntries(searchParams.entries()),
      timestamp: new Date().toISOString()
    });
  }, [searchParams, activeTab]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Integration Debug</h1>
            <p className="text-gray-600">Testing payment system components</p>
          </div>

          {/* Debug Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5" />
                <span>Debug Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
              <div className="mt-4 space-y-2">
                <p><strong>Current Active Tab:</strong> {activeTab}</p>
                <p><strong>URL Tab Parameter:</strong> {searchParams.get('tab') || 'none'}</p>
                <p><strong>Available Tabs:</strong> payments, test, paystack</p>
              </div>
            </CardContent>
          </Card>

          {/* Tab Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="payments" className="flex items-center space-x-2">
                <CreditCard className="w-4 h-4" />
                <span>Payments</span>
              </TabsTrigger>
              <TabsTrigger value="test" className="flex items-center space-x-2">
                <TestTube className="w-4 h-4" />
                <span>Test</span>
              </TabsTrigger>
              <TabsTrigger value="paystack" className="flex items-center space-x-2">
                <CreditCard className="w-4 h-4" />
                <span>Paystack Demo</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="payments">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-gray-600">
                    This tab contains the basic payment dashboard component.
                  </p>
                  <BasicPaymentDashboard />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="test">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Test</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-gray-600">
                    This tab contains the simple payment test component.
                  </p>
                  <SimplePaymentTest />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="paystack">
              <Card>
                <CardHeader>
                  <CardTitle>Paystack Live Demo</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-gray-600">
                    This is a comprehensive Paystack integration test with real payment flow.
                  </p>
                  <PaystackTestDemo />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Manual Tab Switching */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Manual Tab Control</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-x-4">
                <Button 
                  onClick={() => setActiveTab('payments')}
                  variant={activeTab === 'payments' ? 'default' : 'outline'}
                >
                  Switch to Payments
                </Button>
                <Button 
                  onClick={() => setActiveTab('test')}
                  variant={activeTab === 'test' ? 'default' : 'outline'}
                >
                  Switch to Test
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Use these buttons to manually switch tabs and test functionality.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentDebug;
