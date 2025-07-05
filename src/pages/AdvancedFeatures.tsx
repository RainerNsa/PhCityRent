
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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <EnhancedBreadcrumb 
            items={[{ label: 'Advanced Features' }]} 
          />

          {/* Enhanced Header with Better Proportions */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-8 lg:p-12 mb-8 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10 rounded-3xl"></div>
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                      <Zap className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl lg:text-5xl font-bold">Advanced Features</h1>
                  </div>
                  <p className="text-orange-100 text-lg lg:text-xl max-w-4xl leading-relaxed">
                    Transform your rental experience with cutting-edge AI recommendations, secure payments, 
                    comprehensive analytics, and seamless communication tools designed for the modern property market.
                  </p>
                </div>
                <div className="hidden lg:flex items-center justify-center w-24 h-24 bg-white/10 rounded-full backdrop-blur-sm">
                  <Zap className="w-12 h-12" />
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Feature Tabs with Better Responsive Design */}
          <Tabs defaultValue="payments" className="w-full space-y-8">
            <div className="overflow-x-auto scrollbar-hide">
              <TabsList className="grid w-full grid-cols-7 min-w-[800px] lg:min-w-0 bg-white shadow-xl rounded-2xl p-3 border-0">
                <TabsTrigger 
                  value="payments" 
                  className="flex flex-col items-center gap-2 px-4 py-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white rounded-xl transition-all duration-300 hover:bg-gray-50 data-[state=active]:shadow-lg"
                >
                  <CreditCard className="w-5 h-5" />
                  <span className="text-sm font-medium">Payments</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="ai" 
                  className="flex flex-col items-center gap-2 px-4 py-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white rounded-xl transition-all duration-300 hover:bg-gray-50 data-[state=active]:shadow-lg"
                >
                  <Brain className="w-5 h-5" />
                  <span className="text-sm font-medium">AI Features</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="analytics" 
                  className="flex flex-col items-center gap-2 px-4 py-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white rounded-xl transition-all duration-300 hover:bg-gray-50 data-[state=active]:shadow-lg"
                >
                  <BarChart3 className="w-5 h-5" />
                  <span className="text-sm font-medium">Analytics</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="whatsapp" 
                  className="flex flex-col items-center gap-2 px-4 py-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white rounded-xl transition-all duration-300 hover:bg-gray-50 data-[state=active]:shadow-lg"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">WhatsApp</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="marketplace" 
                  className="flex flex-col items-center gap-2 px-4 py-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white rounded-xl transition-all duration-300 hover:bg-gray-50 data-[state=active]:shadow-lg"
                >
                  <Star className="w-5 h-5" />
                  <span className="text-sm font-medium">Marketplace</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="legal" 
                  className="flex flex-col items-center gap-2 px-4 py-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white rounded-xl transition-all duration-300 hover:bg-gray-50 data-[state=active]:shadow-lg"
                >
                  <FileText className="w-5 h-5" />
                  <span className="text-sm font-medium">Legal</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="verification" 
                  className="flex flex-col items-center gap-2 px-4 py-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white rounded-xl transition-all duration-300 hover:bg-gray-50 data-[state=active]:shadow-lg"
                >
                  <Shield className="w-5 h-5" />
                  <span className="text-sm font-medium">Verification</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Enhanced Content Container */}
            <div className="bg-white rounded-3xl shadow-2xl border-0 overflow-hidden min-h-[600px]">
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

          {/* Feature Overview Cards */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Payments</h3>
              <p className="text-gray-600 text-sm">
                Process rent payments securely with multiple payment options and automatic receipts.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Recommendations</h3>
              <p className="text-gray-600 text-sm">
                Get personalized property recommendations based on your preferences and behavior.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Market Analytics</h3>
              <p className="text-gray-600 text-sm">
                Access comprehensive market data and trends to make informed decisions.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdvancedFeatures;
