
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { FileText, Download, Edit, Signature, Shield } from 'lucide-react';

const ContractTemplateManager = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const contractTemplates = [
    {
      id: 'standard_rental',
      title: 'Standard Rental Agreement',
      description: 'Basic residential rental contract for Port Harcourt',
      type: 'Residential',
      icon: FileText,
      features: ['Basic terms', 'Standard clauses', 'Port Harcourt compliant']
    },
    {
      id: 'commercial_lease',
      title: 'Commercial Lease Agreement',
      description: 'Business property lease with commercial terms',
      type: 'Commercial',
      icon: Shield,
      features: ['Business terms', 'Commercial clauses', 'Tax provisions']
    },
    {
      id: 'short_term',
      title: 'Short-term Rental Agreement',
      description: 'Flexible terms for short-term accommodations',
      type: 'Short-term',
      icon: Edit,
      features: ['Flexible duration', 'Weekly/monthly options', 'Furnished terms']
    }
  ];

  const handleGenerateContract = async (templateId: string) => {
    setIsGenerating(true);
    try {
      // Simulate contract generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Contract Generated!",
        description: "Your contract template has been generated and is ready for e-signature.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate contract. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Legal Integration</h2>
        <p className="text-gray-600">Generate and manage rental contracts with e-signature workflows</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {contractTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mx-auto mb-4">
                <template.icon className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-lg">{template.title}</CardTitle>
              <Badge variant="secondary" className="mx-auto">
                {template.type}
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center mb-4">
                {template.description}
              </p>
              <ul className="space-y-2 mb-6">
                {template.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-600">
                    <Shield className="w-4 h-4 mr-2 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="space-y-2">
                <Button
                  onClick={() => handleGenerateContract(template.id)}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                >
                  {isGenerating ? (
                    <>
                      <FileText className="mr-2 h-4 w-4 animate-pulse" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      Generate Contract
                    </>
                  )}
                </Button>
                <Button variant="outline" className="w-full">
                  <Signature className="mr-2 h-4 w-4" />
                  E-Signature Workflow
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Signature className="h-6 w-6 text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-900">E-Signature Integration</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <strong>✅ Digital Signatures:</strong> Legally binding electronic signatures for all parties
            </div>
            <div>
              <strong>✅ Document Tracking:</strong> Real-time status updates and completion notifications
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContractTemplateManager;
