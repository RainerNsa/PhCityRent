
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePaystack } from '@/hooks/usePaystack';
import { CreditCard, Wallet, Receipt, History, DollarSign, Calendar } from 'lucide-react';

interface PaymentDashboardProps {
  tenantId?: string;
  propertyId?: string;
}

const PaymentDashboard = ({ tenantId, propertyId }: PaymentDashboardProps) => {
  const [selectedPaymentType, setSelectedPaymentType] = useState<string>('');
  const { initializePayment, isLoading } = usePaystack();

  const paymentTypes = [
    {
      id: 'monthly_rent',
      title: 'Monthly Rent',
      description: 'Pay your monthly rent securely',
      amount: 450000,
      icon: Calendar,
      color: 'bg-blue-500'
    },
    {
      id: 'security_deposit',
      title: 'Security Deposit',
      description: 'One-time security deposit',
      amount: 900000,
      icon: Wallet,
      color: 'bg-green-500'
    },
    {
      id: 'maintenance_fee',
      title: 'Maintenance Fee',
      description: 'Property maintenance contribution',
      amount: 50000,
      icon: Receipt,
      color: 'bg-orange-500'
    }
  ];

  const handlePayment = async (paymentType: any) => {
    const reference = `PHC_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      await initializePayment({
        email: 'tenant@phcityrent.com',
        amount: paymentType.amount,
        reference,
        metadata: {
          tenantId,
          propertyId,
          paymentType: paymentType.id,
          description: paymentType.title
        }
      });
    } catch (error) {
      console.error('Payment failed:', error);
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
