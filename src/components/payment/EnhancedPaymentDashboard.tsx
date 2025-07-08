// Enhanced Payment Dashboard with multiple Nigerian payment providers
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePayment, useTransactionHistory, useRentPayment, formatAmount } from '@/hooks/usePayment';
import { PaymentProvider } from '@/types/payment';
import PaymentProviderSelector from './PaymentProviderSelector';
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
  Zap,
  Building2,
  Shield
} from 'lucide-react';

interface EnhancedPaymentDashboardProps {
  tenantId?: string;
  propertyId?: string;
}

const EnhancedPaymentDashboard: React.FC<EnhancedPaymentDashboardProps> = ({ 
  tenantId, 
  propertyId 
}) => {
  const [selectedPaymentType, setSelectedPaymentType] = useState<string>('');
  const [selectedProvider, setSelectedProvider] = useState<PaymentProvider>('paystack');
  const [showProviderSelector, setShowProviderSelector] = useState(false);
  const { payRent, isLoading } = useRentPayment();
  const { data: transactions = [], isLoading: loadingHistory } = useTransactionHistory();

  const paymentTypes = [
    {
      id: 'monthly_rent',
      title: 'Monthly Rent',
      description: 'Pay your monthly rent securely',
      amount: 450000, // Amount in kobo
      icon: Calendar,
      color: 'bg-blue-500',
      dueDate: '2025-07-15'
    },
    {
      id: 'security_deposit',
      title: 'Security Deposit',
      description: 'One-time security deposit',
      amount: 900000, // Amount in kobo
      icon: Wallet,
      color: 'bg-green-500',
      dueDate: '2025-07-10'
    },
    {
      id: 'maintenance_fee',
      title: 'Maintenance Fee',
      description: 'Property maintenance contribution',
      amount: 50000, // Amount in kobo
      icon: Receipt,
      color: 'bg-orange-500',
      dueDate: '2025-07-20'
    }
  ];

  const handlePayment = async (paymentType: any) => {
    if (!showProviderSelector) {
      setSelectedPaymentType(paymentType.id);
      setShowProviderSelector(true);
      return;
    }

    try {
      await payRent({
        propertyId: propertyId || 'demo-property',
        amount: paymentType.amount / 100, // Convert from kobo to naira
        tenantEmail: 'tenant@phcityrent.com',
        tenantName: 'Demo Tenant',
        tenantPhone: '+2348012345678',
        provider: selectedProvider
      });
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };

  const handleProviderSelection = () => {
    const paymentType = paymentTypes.find(p => p.id === selectedPaymentType);
    if (paymentType) {
      handlePayment(paymentType);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      success: { variant: 'default' as const, color: 'bg-green-100 text-green-800', label: 'Success' },
      pending: { variant: 'secondary' as const, color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      failed: { variant: 'destructive' as const, color: 'bg-red-100 text-red-800', label: 'Failed' },
      cancelled: { variant: 'outline' as const, color: 'bg-gray-100 text-gray-800', label: 'Cancelled' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return (
      <Badge variant={config.variant} className={config.color}>
        {config.label}
      </Badge>
    );
  };

  if (showProviderSelector) {
    const paymentType = paymentTypes.find(p => p.id === selectedPaymentType);
    if (!paymentType) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Complete Payment</h2>
            <p className="text-gray-600">
              {paymentType.title} - {formatAmount(paymentType.amount)}
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setShowProviderSelector(false)}
          >
            Back
          </Button>
        </div>

        <PaymentProviderSelector
          selectedProvider={selectedProvider}
          onProviderChange={setSelectedProvider}
          amount={paymentType.amount}
          disabled={isLoading}
        />

        <div className="flex justify-end space-x-4">
          <Button 
            variant="outline" 
            onClick={() => setShowProviderSelector(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleProviderSelection}
            disabled={isLoading}
            className="bg-orange-500 hover:bg-orange-600"
          >
            {isLoading ? 'Processing...' : `Pay ${formatAmount(paymentType.amount)}`}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="payments" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="payments">Make Payment</TabsTrigger>
          <TabsTrigger value="history">Payment History</TabsTrigger>
        </TabsList>

        <TabsContent value="payments" className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">Payment Center</h2>
            <p className="text-gray-600">Secure payments with multiple Nigerian providers</p>
          </div>

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
                  <div className={`flex items-center justify-center w-16 h-16 ${payment.color} rounded-full mx-auto mb-4`}>
                    <payment.icon className="h-8 w-8 text-white" />
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
                    onClick={() => handlePayment(payment)}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                  >
                    {isLoading ? (
                      <>
                        <CreditCard className="mr-2 h-4 w-4 animate-pulse" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Pay Now
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Payment Providers Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Supported Payment Providers</span>
              </CardTitle>
              <CardDescription>
                Choose from multiple trusted Nigerian payment gateways
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <CreditCard className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900">Paystack</p>
                    <p className="text-sm text-blue-700">Most popular in Nigeria</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                  <Zap className="w-8 h-8 text-orange-600" />
                  <div>
                    <p className="font-medium text-orange-900">Flutterwave</p>
                    <p className="text-sm text-orange-700">Global payment solutions</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <Building2 className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">Monnify</p>
                    <p className="text-sm text-green-700">Reliable processing</p>
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

          {loadingHistory ? (
            <div className="text-center py-8">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">Loading transaction history...</p>
            </div>
          ) : transactions.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <History className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500 mb-2">No payment history yet</p>
                <p className="text-sm text-gray-400">Your completed transactions will appear here</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {transactions.slice(0, 10).map((transaction: any) => (
                <Card key={transaction.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <Receipt className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {transaction.transaction_type.replace('_', ' ').toUpperCase()}
                          </p>
                          <p className="text-sm text-gray-500">
                            {transaction.reference} • {transaction.provider}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(transaction.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatAmount(transaction.amount)}
                        </p>
                        {getStatusBadge(transaction.status)}
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

export default EnhancedPaymentDashboard;
