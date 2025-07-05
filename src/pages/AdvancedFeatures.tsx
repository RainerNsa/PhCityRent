
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
import { CreditCard, Brain, BarChart3, MessageCircle, Star, FileText, Shield, Zap, Sparkles } from 'lucide-react';

const AdvancedFeatures = () => {
  const [activeTab, setActiveTab] = useState("payments");

  const features = [
    {
      id: "payments",
      title: "Secure Payments",
      description: "Process rent payments with multiple payment options",
      icon: CreditCard,
      color: "from-blue-500 to-blue-700",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      id: "ai",
      title: "AI Features",
      description: "Personalized property recommendations powered by AI",
      icon: Brain,
      color: "from-purple-500 to-purple-700",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600"
    },
    {
      id: "analytics",
      title: "Market Analytics",
      description: "Comprehensive market data and insights",
      icon: BarChart3,
      color: "from-green-500 to-green-700",
      bgColor: "bg-green-50",
      iconColor: "text-green-600"
    },
    {
      id: "whatsapp",
      title: "WhatsApp",
      description: "Seamless communication via WhatsApp",
      icon: MessageCircle,
      color: "from-emerald-500 to-emerald-700",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600"
    },
    {
      id: "marketplace",
      title: "Marketplace",
      description: "Featured listings and marketplace management",
      icon: Star,
      color: "from-yellow-500 to-yellow-700",
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600"
    },
    {
      id: "legal",
      title: "Legal Tools",
      description: "Contract templates and legal document management",
      icon: FileText,
      color: "from-red-500 to-red-700",
      bgColor: "bg-red-50",
      iconColor: "text-red-600"
    },
    {
      id: "verification",
      title: "Verification",
      description: "Identity and property verification services",
      icon: Shield,
      color: "from-indigo-500 to-indigo-700",
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-600"
    }
  ];

  const activeFeature = features.find(f => f.id === activeTab) || features[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <EnhancedBreadcrumb 
            items={[{ label: 'Advanced Features' }]} 
          />

          {/* Hero Section */}
          <div className="relative overflow-hidden rounded-3xl mb-12">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600"></div>
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10 px-8 lg:px-16 py-16 lg:py-24">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                      <Zap className="w-8 h-8 text-white" />
                    </div>
                    <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                    Advanced
                    <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                      Features
                    </span>
                  </h1>
                  <p className="text-xl text-white/90 leading-relaxed max-w-2xl">
                    Transform your rental experience with cutting-edge technology. From AI-powered recommendations 
                    to secure payments and comprehensive analytics.
                  </p>
                </div>
                <div className="hidden lg:block">
                  <div className="relative">
                    <div className="absolute inset-0 bg-white/10 rounded-3xl backdrop-blur-sm transform rotate-6"></div>
                    <div className="relative bg-white/20 rounded-3xl backdrop-blur-sm p-8">
                      <div className="grid grid-cols-2 gap-4">
                        {features.slice(0, 4).map((feature) => {
                          const Icon = feature.icon;
                          return (
                            <div key={feature.id} className="bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
                              <Icon className="w-8 h-8 text-white mb-2" />
                              <p className="text-white/90 text-sm font-medium">{feature.title}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Choose Your Feature</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Select any feature below to explore its capabilities and see how it can enhance your rental experience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {features.map((feature) => {
                const Icon = feature.icon;
                const isActive = activeTab === feature.id;
                
                return (
                  <button
                    key={feature.id}
                    onClick={() => setActiveTab(feature.id)}
                    className={`group relative p-6 rounded-3xl transition-all duration-300 transform hover:scale-105 ${
                      isActive 
                        ? 'bg-white shadow-2xl ring-4 ring-orange-200 ring-opacity-50' 
                        : 'bg-white hover:bg-gray-50 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    <div className={`w-16 h-16 rounded-2xl ${
                      isActive ? `bg-gradient-to-r ${feature.color}` : feature.bgColor
                    } flex items-center justify-center mb-4 mx-auto transition-all duration-300`}>
                      <Icon className={`w-8 h-8 ${
                        isActive ? 'text-white' : feature.iconColor
                      } transition-all duration-300`} />
                    </div>
                    <h3 className={`font-bold text-lg mb-2 transition-colors ${
                      isActive ? 'text-gray-900' : 'text-gray-800'
                    }`}>
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                    {isActive && (
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-orange-500/10 to-red-500/10 pointer-events-none"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feature Content */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Feature Header */}
            <div className={`bg-gradient-to-r ${activeFeature.color} px-8 py-6`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <activeFeature.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-white">
                      {activeFeature.title}
                    </h2>
                    <p className="text-white/90 text-lg">
                      {activeFeature.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Content */}
            <div className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
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
              </Tabs>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-blue-900 mb-2">₦2.5B+</h3>
              <p className="text-blue-700">Payments Processed Securely</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-purple-900 mb-2">95%</h3>
              <p className="text-purple-700">AI Recommendation Accuracy</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-green-900 mb-2">50K+</h3>
              <p className="text-green-700">Properties Analyzed Daily</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdvancedFeatures;
