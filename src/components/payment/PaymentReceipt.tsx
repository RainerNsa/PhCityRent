// Professional Payment Receipt Component
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Building, 
  Calendar, 
  CreditCard, 
  User, 
  Hash,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';

interface PaymentReceiptProps {
  transactionData: {
    reference: string;
    amount: number;
    status: string;
    provider: string;
    date: string;
    customer?: {
      name?: string;
      email?: string;
      phone?: string;
    };
    property?: {
      title?: string;
      location?: string;
    };
    paymentType?: string;
    fees?: number;
    channel?: string;
  };
}

const PaymentReceipt: React.FC<PaymentReceiptProps> = ({ transactionData }) => {
  const formatAmount = (amount: number) => {
    return `₦${(amount / 100).toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-NG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Africa/Lagos'
    });
  };

  const getProviderLogo = (provider: string) => {
    const logos = {
      paystack: '💳',
      flutterwave: '🦋',
      monnify: '🏦',
      remita: '💰'
    };
    return logos[provider as keyof typeof logos] || '💳';
  };

  return (
    <div className="max-w-2xl mx-auto bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">PHCityRent</h1>
            <p className="text-orange-100">Payment Receipt</p>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-6 h-6" />
              <Badge className="bg-green-500 text-white">
                {transactionData.status.toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Receipt Content */}
      <CardContent className="p-6 space-y-6">
        {/* Transaction Summary */}
        <div className="text-center space-y-2">
          <div className="text-3xl font-bold text-green-600">
            {formatAmount(transactionData.amount)}
          </div>
          <p className="text-gray-600">Payment Successful</p>
          <p className="text-sm text-gray-500">
            {formatDate(transactionData.date)}
          </p>
        </div>

        <div className="border-t border-gray-200 my-6"></div>

        {/* Transaction Details */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg flex items-center space-x-2">
            <Hash className="w-5 h-5" />
            <span>Transaction Details</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Reference Number</p>
                <p className="font-mono text-sm font-medium">{transactionData.reference}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Payment Method</p>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getProviderLogo(transactionData.provider)}</span>
                  <span className="font-medium capitalize">{transactionData.provider}</span>
                  {transactionData.channel && (
                    <Badge variant="outline" className="text-xs">
                      {transactionData.channel.toUpperCase()}
                    </Badge>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Payment Type</p>
                <p className="font-medium">{transactionData.paymentType || 'Rent Payment'}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Amount</p>
                <p className="font-medium">{formatAmount(transactionData.amount)}</p>
              </div>

              {transactionData.fees && (
                <div>
                  <p className="text-sm text-gray-500">Transaction Fee</p>
                  <p className="font-medium">{formatAmount(transactionData.fees)}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-500">Status</p>
                <Badge className="bg-green-100 text-green-800">
                  SUCCESSFUL
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 my-6"></div>

        {/* Customer Information */}
        {transactionData.customer && (
          <>
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Customer Information</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {transactionData.customer.name && (
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">{transactionData.customer.name}</p>
                  </div>
                )}
                
                {transactionData.customer.email && (
                  <div>
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="font-medium">{transactionData.customer.email}</p>
                  </div>
                )}
                
                {transactionData.customer.phone && (
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="font-medium">{transactionData.customer.phone}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="border-t border-gray-200 my-6"></div>
          </>
        )}

        {/* Property Information */}
        {transactionData.property && (
          <>
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center space-x-2">
                <Building className="w-5 h-5" />
                <span>Property Information</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {transactionData.property.title && (
                  <div>
                    <p className="text-sm text-gray-500">Property</p>
                    <p className="font-medium">{transactionData.property.title}</p>
                  </div>
                )}
                
                {transactionData.property.location && (
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{transactionData.property.location}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="border-t border-gray-200 my-6"></div>
          </>
        )}

        {/* Footer */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-900">Thank you for your payment!</p>
            <p className="text-xs text-gray-600">
              This receipt serves as proof of payment for your transaction.
            </p>
          </div>
          
          <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Phone className="w-3 h-3" />
              <span>+234-801-234-5678</span>
            </div>
            <div className="flex items-center space-x-1">
              <Mail className="w-3 h-3" />
              <span>support@phcityrent.com</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="w-3 h-3" />
              <span>Port Harcourt, Nigeria</span>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-800 text-center">
            🔒 This transaction was processed securely through {transactionData.provider}. 
            Your payment information is protected with bank-level security.
          </p>
        </div>
      </CardContent>
    </div>
  );
};

export default PaymentReceipt;
