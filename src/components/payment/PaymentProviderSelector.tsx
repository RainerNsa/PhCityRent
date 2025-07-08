// Payment provider selection component
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { PaymentProvider } from '@/types/payment';
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  Zap,
  CheckCircle,
  Clock,
  Shield
} from 'lucide-react';

interface PaymentProviderSelectorProps {
  selectedProvider: PaymentProvider;
  onProviderChange: (provider: PaymentProvider) => void;
  amount: number;
  disabled?: boolean;
}

const PaymentProviderSelector: React.FC<PaymentProviderSelectorProps> = ({
  selectedProvider,
  onProviderChange,
  amount,
  disabled = false
}) => {
  const providers = [
    {
      id: 'paystack' as PaymentProvider,
      name: 'Paystack',
      description: 'Most popular payment gateway in Nigeria',
      icon: CreditCard,
      color: 'bg-blue-500',
      features: ['Card Payments', 'Bank Transfer', 'USSD', 'Mobile Money'],
      processingTime: '2-5 minutes',
      fees: '1.5% + ₦100',
      recommended: true,
      channels: ['card', 'bank_transfer', 'ussd', 'mobile_money']
    },
    {
      id: 'flutterwave' as PaymentProvider,
      name: 'Flutterwave',
      description: 'Global payment solutions for Africa',
      icon: Zap,
      color: 'bg-orange-500',
      features: ['Card Payments', 'Bank Transfer', 'Mobile Money', 'USSD'],
      processingTime: '2-5 minutes',
      fees: '1.4% + ₦100',
      recommended: false,
      channels: ['card', 'bank_transfer', 'ussd', 'mobile_money']
    },
    {
      id: 'monnify' as PaymentProvider,
      name: 'Monnify',
      description: 'Reliable payment processing by TeamApt',
      icon: Building2,
      color: 'bg-green-500',
      features: ['Card Payments', 'Bank Transfer', 'USSD'],
      processingTime: '1-3 minutes',
      fees: '1.5% + ₦50',
      recommended: false,
      channels: ['card', 'bank_transfer', 'ussd']
    }
  ];

  const calculateFees = (provider: any, amount: number) => {
    const baseAmount = amount / 100; // Convert from kobo to naira
    
    switch (provider.id) {
      case 'paystack':
        return Math.round((baseAmount * 0.015 + 100) * 100); // Convert back to kobo
      case 'flutterwave':
        return Math.round((baseAmount * 0.014 + 100) * 100);
      case 'monnify':
        return Math.round((baseAmount * 0.015 + 50) * 100);
      default:
        return Math.round((baseAmount * 0.015 + 100) * 100);
    }
  };

  const formatAmount = (amount: number) => {
    return `₦${(amount / 100).toLocaleString()}`;
  };

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">Choose Payment Method</h3>
        <p className="text-sm text-gray-600">
          Select your preferred payment provider for this transaction
        </p>
      </div>

      <RadioGroup
        value={selectedProvider}
        onValueChange={onProviderChange}
        disabled={disabled}
        className="space-y-3"
      >
        {providers.map((provider) => {
          const fees = calculateFees(provider, amount);
          const totalAmount = amount + fees;
          const IconComponent = provider.icon;

          return (
            <div key={provider.id} className="relative">
              <RadioGroupItem
                value={provider.id}
                id={provider.id}
                className="peer sr-only"
              />
              <Label
                htmlFor={provider.id}
                className="flex cursor-pointer"
              >
                <Card className={`w-full transition-all duration-200 hover:shadow-md ${
                  selectedProvider === provider.id 
                    ? 'ring-2 ring-orange-500 border-orange-500' 
                    : 'border-gray-200 hover:border-gray-300'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${provider.color} text-white`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <CardTitle className="text-base">{provider.name}</CardTitle>
                            {provider.recommended && (
                              <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                                Recommended
                              </Badge>
                            )}
                          </div>
                          <CardDescription className="text-sm">
                            {provider.description}
                          </CardDescription>
                        </div>
                      </div>
                      {selectedProvider === provider.id && (
                        <CheckCircle className="w-5 h-5 text-orange-500" />
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="flex items-center space-x-1 text-gray-600 mb-1">
                          <CreditCard className="w-4 h-4" />
                          <span className="font-medium">Payment Methods</span>
                        </div>
                        <div className="space-y-1">
                          {provider.features.map((feature, index) => (
                            <div key={index} className="text-gray-500 text-xs">
                              • {feature}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-1 text-gray-600 mb-1">
                          <Clock className="w-4 h-4" />
                          <span className="font-medium">Processing Time</span>
                        </div>
                        <p className="text-gray-500 text-xs">{provider.processingTime}</p>
                        
                        <div className="flex items-center space-x-1 text-gray-600 mb-1 mt-2">
                          <Shield className="w-4 h-4" />
                          <span className="font-medium">Transaction Fee</span>
                        </div>
                        <p className="text-gray-500 text-xs">{provider.fees}</p>
                      </div>
                      
                      <div className="md:text-right">
                        <div className="space-y-1">
                          <div className="text-gray-600 text-xs">
                            Amount: {formatAmount(amount)}
                          </div>
                          <div className="text-gray-600 text-xs">
                            Fees: {formatAmount(fees)}
                          </div>
                          <div className="font-semibold text-gray-900 text-sm border-t pt-1">
                            Total: {formatAmount(totalAmount)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Label>
            </div>
          );
        })}
      </RadioGroup>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-blue-900 mb-1">Secure Payment Processing</p>
            <p className="text-blue-700">
              All payments are processed securely through certified payment gateways. 
              Your financial information is encrypted and protected.
            </p>
          </div>
        </div>
      </div>

      {selectedProvider && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="text-sm">
            <p className="font-medium text-gray-900 mb-2">
              Selected: {providers.find(p => p.id === selectedProvider)?.name}
            </p>
            <div className="grid grid-cols-2 gap-4 text-gray-600">
              <div>
                <span className="font-medium">Available Channels:</span>
                <div className="mt-1">
                  {providers.find(p => p.id === selectedProvider)?.channels.map((channel, index) => (
                    <Badge key={index} variant="outline" className="mr-1 mb-1 text-xs">
                      {channel.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <span className="font-medium">Total Amount:</span>
                <div className="text-lg font-bold text-gray-900 mt-1">
                  {formatAmount(amount + calculateFees(providers.find(p => p.id === selectedProvider)!, amount))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentProviderSelector;
