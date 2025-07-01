
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Shield, CreditCard, Search, CheckCircle, AlertCircle, DollarSign } from 'lucide-react';

const ThirdPartyAPIManager = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [tenantId, setTenantId] = useState('');
  const { toast } = useToast();

  const verificationServices = [
    {
      id: 'property_valuation',
      title: 'Property Valuation API',
      description: 'Get accurate property valuations using market data',
      icon: DollarSign,
      color: 'bg-green-500',
      features: ['Market comparison', 'Price trends', 'Investment analysis'],
      status: 'Active'
    },
    {
      id: 'credit_check',
      title: 'Credit Check Service',
      description: 'Comprehensive credit history and financial verification',
      icon: CreditCard,
      color: 'bg-blue-500',
      features: ['Credit score', 'Payment history', 'Debt analysis'],
      status: 'Active'
    },
    {
      id: 'background_verification',
      title: 'Background Verification',
      description: 'Complete background checks for tenant screening',
      icon: Shield,
      color: 'bg-purple-500',
      features: ['Identity verification', 'Criminal background', 'Employment history'],
      status: 'Active'
    }
  ];

  const handleRunVerification = async (serviceId: string) => {
    if (!tenantId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a tenant ID to run verification.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const serviceName = verificationServices.find(s => s.id === serviceId)?.title;
      toast({
        title: "Verification Complete!",
        description: `${serviceName} completed successfully for tenant ${tenantId}.`,
      });
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "There was an error running the verification. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Third-Party API Integration</h2>
        <p className="text-gray-600">Comprehensive verification and valuation services</p>
      </div>

      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg">Tenant Verification</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Input
              placeholder="Enter Tenant ID or Phone Number"
              value={tenantId}
              onChange={(e) => setTenantId(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={() => handleRunVerification('all')}
              disabled={isProcessing}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
            >
              {isProcessing ? (
                <>
                  <Search className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Run All Checks
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        {verificationServices.map((service) => (
          <Card key={service.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="text-center">
              <div className={`flex items-center justify-center w-16 h-16 ${service.color} rounded-full mx-auto mb-4`}>
                <service.icon className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-lg">{service.title}</CardTitle>
              <Badge 
                variant={service.status === 'Active' ? 'default' : 'secondary'}
                className={service.status === 'Active' ? 'bg-green-100 text-green-800' : ''}
              >
                <CheckCircle className="w-3 h-3 mr-1" />
                {service.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center mb-4">
                {service.description}
              </p>
              <ul className="space-y-2 mb-6">
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => handleRunVerification(service.id)}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
              >
                {isProcessing ? 'Processing...' : 'Run Verification'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="h-6 w-6 text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-900">API Integration Status</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div>
              <strong>✅ Property Valuation:</strong> Connected to market data providers
            </div>
            <div>
              <strong>✅ Credit Services:</strong> Integrated with credit bureaus
            </div>
            <div>
              <strong>✅ Background Checks:</strong> Identity and criminal verification active
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThirdPartyAPIManager;
