
import React, { useState } from 'react';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/Footer';
import EnhancedBreadcrumb from '@/components/ui/enhanced-breadcrumb';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PaymentDashboard from '@/components/payments/PaymentDashboard';
import PropertyRecommendations from '@/components/ai/PropertyRecommendations';
import MarketAnalytics from '@/components/analytics/MarketAnalytics';
import WhatsAppIntegration from '@/components/whatsapp/WhatsAppIntegration';
import FeaturedListingsManager from '@/components/marketplace/FeaturedListingsManager';
import ContractTemplateManager from '@/components/legal/ContractTemplateManager';
import ThirdPartyAPIManager from '@/components/verification/ThirdPartyAPIManager';
import { CreditCard, Brain, BarChart3, MessageCircle, Star, FileText, Shield, Zap } from 'lucide-react';

const AdvancedFeatures = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <EnhancedBreadcrumb 
            items={[{ label: 'Advanced Features' }]} 
          />

          {/* Enhanced Header */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 mb-8 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Advanced Features</h1>
                <p className="text-orange-100 text-lg max-w-3xl">
                  Explore our cutting-edge features designed to enhance your rental experience with AI-powered recommendations, 
                  market analytics, secure payments, and seamless communication.
                </p>
              </div>
              <div className="hidden md:flex items-center justify-center w-20 h-20 bg-white/20 rounded-full">
                <Zap className="w-10 h-10" />
              </div>
            </div>
          </div>

          <Tabs defaultValue="payments" className="w-full space-y-8">
            <TabsList className="grid w-full grid-cols-7 bg-white shadow-lg rounded-xl p-2">
              <TabsTrigger value="payments" className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white rounded-lg">
                <CreditCard className="w-4 h-4" />
                <span className="hidden sm:inline">Payments</span>
              </TabsTrigger>
              <TabsTrigger value="ai" className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white rounded-lg">
                <Brain className="w-4 h-4" />
                <span className="hidden sm:inline">AI Features</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white rounded-lg">
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="whatsapp" className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white rounded-lg">
                <MessageCircle className="w-4 h-4" />
                <span className="hidden sm:inline">WhatsApp</span>
              </TabsTrigger>
              <TabsTrigger value="marketplace" className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white rounded-lg">
                <Star className="w-4 h-4" />
                <span className="hidden sm:inline">Marketplace</span>
              </TabsTrigger>
              <TabsTrigger value="legal" className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white rounded-lg">
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Legal</span>
              </TabsTrigger>
              <TabsTrigger value="verification" className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white rounded-lg">
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">Verification</span>
              </TabsTrigger>
            </TabsList>

            <div className="bg-white rounded-2xl shadow-xl border-0 overflow-hidden">
              <TabsContent value="payments" className="p-0 m-0">
                <PaymentDashboard />
              </TabsContent>

              <TabsContent value="ai" className="p-0 m-0">
                <PropertyRecommendations />
              </TabsContent>

              <TabsContent value="analytics" className="p-0 m-0">
                <MarketAnalytics />
              </TabsContent>

              <TabsContent value="whatsapp" className="p-0 m-0">
                <WhatsAppIntegration />
              </TabsContent>

              <TabsContent value="marketplace" className="p-0 m-0">
                <FeaturedListingsManager />
              </TabsContent>

              <TabsContent value="legal" className="p-0 m-0">
                <ContractTemplateManager />
              </TabsContent>

              <TabsContent value="verification" className="p-0 m-0">
                <ThirdPartyAPIManager />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdvancedFeatures;
