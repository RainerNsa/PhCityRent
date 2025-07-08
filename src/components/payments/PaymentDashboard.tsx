
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePayment, useTransactionHistory, useRentPayment, formatAmount } from '@/hooks/usePayment';
import { PaymentProvider } from '@/types/payment';
import PaymentProviderSelector from '@/components/payment/PaymentProviderSelector';
import { CreditCard, Wallet, Receipt, History, DollarSign, Calendar, Clock, CheckCircle, TrendingUp } from 'lucide-react';

interface PaymentDashboardProps {
  tenantId?: string;
  propertyId?: string;
}

const PaymentDashboard = ({ tenantId, propertyId }: PaymentDashboardProps) => {
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
      color: 'bg-blue-500'
    },
    {
      id: 'security_deposit',
      title: 'Security Deposit',
      description: 'One-time security deposit',
      amount: 900000, // Amount in kobo
      icon: Wallet,
      color: 'bg-green-500'
    },
    {
      id: 'maintenance_fee',
      title: 'Maintenance Fee',
      description: 'Property maintenance contribution',
      amount: 50000, // Amount in kobo
      icon: Receipt,
      color: 'bg-orange-500'
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

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Payment Center</h2>
        <p className="text-gray-600">Secure and convenient rent payments</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {paymentTypes.map((payment) => (
          <Card key={payment.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="text-center">
              <div className={`flex items-center justify-center w-16 h-16 ${payment.color} rounded-full mx-auto mb-4`}>
                <payment.icon className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-lg">{payment.title}</CardTitle>
              <Badge variant="outline" className="mx-auto">
                ₦{payment.amount.toLocaleString()}
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center mb-6">
                {payment.description}
              </p>
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <History className="h-5 w-5" />
            <span>Recent Payments</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Monthly Rent - December 2024</p>
                <p className="text-sm text-gray-600">Paid on Dec 1, 2024</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">₦450,000</p>
                <Badge className="bg-green-100 text-green-800">Completed</Badge>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Security Deposit</p>
                <p className="text-sm text-gray-600">Paid on Nov 15, 2024</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">₦900,000</p>
                <Badge className="bg-green-100 text-green-800">Completed</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentDashboard;
