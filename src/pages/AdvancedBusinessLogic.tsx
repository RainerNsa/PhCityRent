
import React from 'react';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AutomatedWorkflows from '@/components/automation/AutomatedWorkflows';
import MarketIntelligence from '@/components/intelligence/MarketIntelligence';
import TenantScreening from '@/components/screening/TenantScreening';
import { Bot, TrendingUp, Shield } from 'lucide-react';

const AdvancedBusinessLogic = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Advanced Business Logic
            </h1>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">
              Sophisticated automation, market intelligence, and tenant screening capabilities 
              to streamline your rental business operations and make data-driven decisions.
            </p>
          </div>

          <Tabs defaultValue="workflows" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="workflows" className="flex items-center space-x-2">
                <Bot className="w-4 h-4" />
                <span>Automated Workflows</span>
              </TabsTrigger>
              <TabsTrigger value="intelligence" className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span>Market Intelligence</span>
              </TabsTrigger>
              <TabsTrigger value="screening" className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Tenant Screening</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="workflows">
              <AutomatedWorkflows />
            </TabsContent>

            <TabsContent value="intelligence">
              <MarketIntelligence />
            </TabsContent>

            <TabsContent value="screening">
              <TenantScreening />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdvancedBusinessLogic;
