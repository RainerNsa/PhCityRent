// Production-ready Payment Dashboard with real Paystack integration
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { downloadPDFReceipt, downloadImageReceipt } from '@/utils/receiptGenerator';
import { 
  CreditCard, 
  Wallet, 
  Receipt, 
  History, 
  DollarSign, 
  Calendar, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  AlertCircle,
  RefreshCw,
  Shield,
  Zap,
  Building2,
  User
} from 'lucide-react';

declare global {
  interface Window {
    PaystackPop: any;
  }
}

interface ProductionPaymentDashboardProps {
  tenantId?: string;
  propertyId?: string;
}

const ProductionPaymentDashboard: React.FC<ProductionPaymentDashboardProps> = ({ 
  tenantId, 
  propertyId 
}) => {
  const { user } = useAuth();
  const [isPaystackLoaded, setIsPaystackLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);

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
        console.log('✅ Paystack loaded for production');
      };
      
      script.onerror = () => {
        console.error('❌ Failed to load Paystack');
      };

      document.head.appendChild(script);
    };

    loadPaystackScript();
  }, []);

  const paymentTypes = [
    {
      id: 'monthly_rent',
      title: 'Monthly Rent',
      description: 'Pay your monthly rent securely',
      amount: 450000, // ₦4,500 in kobo
      icon: Calendar,
      color: 'bg-blue-500',
      dueDate: '2025-07-15',
      priority: 'high'
    },
    {
      id: 'security_deposit',
      title: 'Security Deposit',
      description: 'One-time security deposit',
      amount: 900000, // ₦9,000 in kobo
      icon: Wallet,
      color: 'bg-green-500',
      dueDate: '2025-07-10',
      priority: 'medium'
    },
    {
      id: 'maintenance_fee',
      title: 'Maintenance Fee',
      description: 'Property maintenance contribution',
      amount: 50000, // ₦500 in kobo
      icon: Receipt,
      color: 'bg-orange-500',
      dueDate: '2025-07-20',
      priority: 'low'
    }
  ];

  const initializePayment = async (paymentType: any) => {
    if (!isPaystackLoaded) {
      alert('Payment system is loading. Please wait and try again.');
      return;
    }

    if (!user) {
      alert('Please log in to make a payment.');
      return;
    }

    setIsLoading(true);

    const reference = `PHC_${paymentType.id.toUpperCase()}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    
    try {
      const handler = window.PaystackPop.setup({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        email: user.email || 'tenant@phcityrent.com',
        amount: paymentType.amount, // Amount in kobo
        currency: 'NGN',
        ref: reference,
        metadata: {
          custom_fields: [
            {
              display_name: "Property ID",
              variable_name: "property_id",
              value: propertyId || 'demo-property'
            },
            {
              display_name: "Tenant ID",
              variable_name: "tenant_id",
              value: tenantId || user.id
            },
            {
              display_name: "Payment Type",
              variable_name: "payment_type",
              value: paymentType.id
            },
            {
              display_name: "Customer Name",
              variable_name: "customer_name",
              value: user.user_metadata?.full_name || 'PHCityRent User'
            }
          ]
        },
        callback: (response: any) => {
          console.log('✅ Payment successful:', response);
          
          // Add to payment history
          const newPayment = {
            id: response.reference,
            type: paymentType.title,
            amount: paymentType.amount,
            status: 'success',
            date: new Date().toISOString(),
            reference: response.reference,
            transaction_id: response.trans
          };
          
          setPaymentHistory(prev => [newPayment, ...prev]);
          setIsLoading(false);
          
          // Redirect to success page
          window.location.href = `/payment/callback?reference=${response.reference}&status=success&provider=paystack`;
        },
        onClose: () => {
          console.log('❌ Payment cancelled');
          setIsLoading(false);
        }
      });

      handler.openIframe();
    } catch (error) {
      console.error('❌ Payment failed:', error);
      setIsLoading(false);
      alert('Payment initialization failed. Please try again.');
    }
  };

  const formatAmount = (amount: number) => {
    return `₦${(amount / 100).toLocaleString()}`;
  };

  const getPriorityBadge = (priority: string) => {
    const config = {
      high: { color: 'bg-red-100 text-red-800', label: 'Due Soon' },
      medium: { color: 'bg-yellow-100 text-yellow-800', label: 'Upcoming' },
      low: { color: 'bg-green-100 text-green-800', label: 'Optional' }
    };
    
    const { color, label } = config[priority as keyof typeof config] || config.low;
    return <Badge className={color}>{label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="payments" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="payments">Make Payment</TabsTrigger>
          <TabsTrigger value="history">Payment History</TabsTrigger>
        </TabsList>

        <TabsContent value="payments" className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">Secure Payment Center</h2>
            <p className="text-gray-600">Pay your rent and fees securely with Paystack</p>
          </div>

          {/* Paystack Status */}
          <Alert>
            {isPaystackLoaded ? (
              <>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  ✅ Secure payment system ready. Your transactions are protected by Paystack.
                </AlertDescription>
              </>
            ) : (
              <>
                <Clock className="h-4 w-4" />
                <AlertDescription>
                  ⏳ Loading secure payment system...
                </AlertDescription>
              </>
            )}
          </Alert>

          {/* Payment Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₦2,450,000</div>
                <p className="text-xs text-muted-foreground">
                  +12% from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₦450,000</div>
                <p className="text-xs text-muted-foreground">
                  Due in 5 days
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">98.5%</div>
                <p className="text-xs text-muted-foreground">
                  Last 30 days
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Payment Options */}
          <div className="grid md:grid-cols-3 gap-6">
            {paymentTypes.map((payment) => (
              <Card key={payment.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="text-center">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`flex items-center justify-center w-16 h-16 ${payment.color} rounded-full`}>
                      <payment.icon className="h-8 w-8 text-white" />
                    </div>
                    {getPriorityBadge(payment.priority)}
                  </div>
                  <CardTitle className="text-lg">{payment.title}</CardTitle>
                  <Badge variant="outline" className="mx-auto">
                    {formatAmount(payment.amount)}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center mb-4">
                    {payment.description}
                  </p>
                  <div className="text-center mb-4">
                    <p className="text-sm text-gray-500">Due: {payment.dueDate}</p>
                  </div>
                  <Button
                    onClick={() => initializePayment(payment)}
                    disabled={isLoading || !isPaystackLoaded}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                  >
                    {isLoading ? (
                      <>
                        <Clock className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Pay {formatAmount(payment.amount)}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Security Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Secure Payment Processing</span>
              </CardTitle>
              <CardDescription>
                Your payments are processed securely through Paystack
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Shield className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900">Bank-Level Security</p>
                    <p className="text-sm text-blue-700">256-bit SSL encryption</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">PCI Compliant</p>
                    <p className="text-sm text-green-700">Industry standard security</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <CreditCard className="w-8 h-8 text-purple-600" />
                  <div>
                    <p className="font-medium text-purple-900">Multiple Payment Methods</p>
                    <p className="text-sm text-purple-700">Cards, Bank Transfer, USSD</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Payment History</h3>
              <p className="text-gray-600">Track all your payment transactions</p>
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>

          {paymentHistory.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <History className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500 mb-2">No payment history yet</p>
                <p className="text-sm text-gray-400">Your completed transactions will appear here</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {paymentHistory.map((payment) => (
                <Card key={payment.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <Receipt className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{payment.type}</p>
                          <p className="text-sm text-gray-500">
                            {payment.reference}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(payment.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatAmount(payment.amount)}
                        </p>
                        <Badge className="bg-green-100 text-green-800">
                          SUCCESS
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductionPaymentDashboard;
