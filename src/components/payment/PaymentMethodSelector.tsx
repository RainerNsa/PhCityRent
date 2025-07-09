// Sophisticated Payment Method Selector
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  Zap, 
  Shield, 
  Clock,
  CheckCircle,
  Star
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  processingTime: string;
  fees: string;
  popularity: number;
  features: string[];
  gradient: string;
  iconColor: string;
  recommended?: boolean;
}

interface PaymentMethodSelectorProps {
  onSelect: (method: PaymentMethod) => void;
  selectedMethod?: string;
  className?: string;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  onSelect,
  selectedMethod,
  className = ''
}) => {
  const [hoveredMethod, setHoveredMethod] = useState<string | null>(null);

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'card',
      name: 'Debit/Credit Card',
      description: 'Pay instantly with your bank card',
      icon: CreditCard,
      processingTime: 'Instant',
      fees: '1.5% + ₦100',
      popularity: 95,
      features: ['Instant confirmation', 'Secure encryption', 'International cards'],
      gradient: 'from-blue-500 to-indigo-600',
      iconColor: 'text-blue-600',
      recommended: true
    },
    {
      id: 'transfer',
      name: 'Bank Transfer',
      description: 'Direct transfer from your bank account',
      icon: Building2,
      processingTime: '2-5 minutes',
      fees: '₦50',
      popularity: 88,
      features: ['Low fees', 'High security', 'All Nigerian banks'],
      gradient: 'from-green-500 to-emerald-600',
      iconColor: 'text-green-600'
    },
    {
      id: 'ussd',
      name: 'USSD (*901#)',
      description: 'Pay using your phone without internet',
      icon: Smartphone,
      processingTime: '1-2 minutes',
      fees: '₦20',
      popularity: 75,
      features: ['No internet needed', 'Works on any phone', 'Very secure'],
      gradient: 'from-purple-500 to-pink-600',
      iconColor: 'text-purple-600'
    },
    {
      id: 'wallet',
      name: 'Mobile Wallet',
      description: 'Pay with Opay, PalmPay, Kuda, etc.',
      icon: Zap,
      processingTime: 'Instant',
      fees: '₦25',
      popularity: 82,
      features: ['Super fast', 'Cashback rewards', 'Easy refunds'],
      gradient: 'from-orange-500 to-red-600',
      iconColor: 'text-orange-600'
    }
  ];

  const handleMethodSelect = (method: PaymentMethod) => {
    onSelect(method);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Choose Payment Method
        </h3>
        <p className="text-gray-600">
          Select your preferred way to pay securely
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {paymentMethods.map((method, index) => {
            const Icon = method.icon;
            const isSelected = selectedMethod === method.id;
            const isHovered = hoveredMethod === method.id;
            
            return (
              <motion.div
                key={method.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
                onHoverStart={() => setHoveredMethod(method.id)}
                onHoverEnd={() => setHoveredMethod(null)}
                onClick={() => handleMethodSelect(method)}
                className="cursor-pointer group"
              >
                <Card className={`relative overflow-hidden border-2 transition-all duration-300 ${
                  isSelected 
                    ? 'border-blue-500 shadow-lg ring-2 ring-blue-200' 
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-lg'
                } ${isHovered ? 'shadow-xl' : 'shadow-md'}`}>
                  
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${method.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  
                  {/* Recommended Badge */}
                  {method.recommended && (
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-lg">
                        <Star className="w-3 h-3 mr-1" />
                        Recommended
                      </Badge>
                    </div>
                  )}

                  {/* Selection Indicator */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-3 left-3"
                    >
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    </motion.div>
                  )}

                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`p-3 rounded-xl shadow-lg bg-gradient-to-br ${method.gradient} group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg text-gray-900 mb-1">
                          {method.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {method.description}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {/* Processing Time & Fees */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600">Processing:</span>
                          <span className="font-medium text-gray-900">{method.processingTime}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-gray-600">Fee:</span>
                          <span className="font-medium text-gray-900 ml-1">{method.fees}</span>
                        </div>
                      </div>

                      {/* Popularity Bar */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Popularity</span>
                          <span className="font-medium text-gray-900">{method.popularity}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${method.popularity}%` }}
                            transition={{ delay: index * 0.2, duration: 0.8 }}
                            className={`h-2 rounded-full bg-gradient-to-r ${method.gradient}`}
                          />
                        </div>
                      </div>

                      {/* Features */}
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">Features:</p>
                        <div className="flex flex-wrap gap-1">
                          {method.features.map((feature, idx) => (
                            <Badge 
                              key={idx}
                              variant="secondary"
                              className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200"
                            >
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Security Indicator */}
                      <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                        <Shield className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-600 font-medium">
                          Bank-level security
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {selectedMethod && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center pt-6"
        >
          <Button 
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8"
          >
            <Zap className="w-5 h-5 mr-2" />
            Continue with {paymentMethods.find(m => m.id === selectedMethod)?.name}
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default PaymentMethodSelector;
