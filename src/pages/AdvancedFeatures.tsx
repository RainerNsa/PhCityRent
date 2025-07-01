
import React, { useState } from 'react';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PaymentDashboard from '@/components/payments/PaymentDashboard';
import PropertyRecommendations from '@/components/ai/PropertyRecommendations';
import MarketAnalytics from '@/components/analytics/MarketAnalytics';
import WhatsAppIntegration from '@/components/whatsapp/WhatsAppIntegration';
import { CreditCard, Brain, BarChart3, MessageCircle } from 'lucide-react';

const AdvancedFeatures = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Advanced Features
            </h1>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">
              Explore our cutting-edge features designed to enhance your rental experience with AI-powered recommendations, 
              market analytics, secure payments, and seamless communication.
            </p>
          </div>

          <Tabs defaultValue="payments" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="payments" className="flex items-center space-x-2">
                <CreditCard className="w-4 h-4" />
                <span>Payments</span>
              </TabsTrigger>
              <TabsTrigger value="ai" className="flex items-center space-x-2">
                <Brain className="w-4 h-4" />
                <span>AI Features</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4" />
                <span>Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="whatsapp" className="flex items-center space-x-2">
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="payments">
              <PaymentDashboard />
            </TabsContent>

            <TabsContent value="ai">
              <PropertyRecommendations />
            </TabsContent>

            <TabsContent value="analytics">
              <MarketAnalytics />
            </TabsContent>

            <TabsContent value="whatsapp">
              <WhatsAppIntegration />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdvancedFeatures;
