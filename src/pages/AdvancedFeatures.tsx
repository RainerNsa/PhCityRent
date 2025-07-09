import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Brain, BarChart3, MessageCircle, Star, FileText, Shield, Zap, Sparkles, TestTube } from 'lucide-react';

const AdvancedFeatures = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("payments");

  // Handle URL parameters for tab navigation
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['payments', 'ai', 'analytics', 'whatsapp', 'marketplace', 'legal', 'verification', 'test'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const features = [
    {
      id: "payments",
      title: "Secure Payments",
      description: "Process rent payments with multiple payment options",
      icon: CreditCard,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      id: "ai",
      title: "AI Features", 
      description: "Personalized property recommendations powered by AI",
      icon: Brain,
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600"
    },
    {
      id: "analytics",
      title: "Market Analytics",
      description: "Comprehensive market data and insights",
      icon: BarChart3,
      color: "bg-green-500",
      bgColor: "bg-green-50",
      iconColor: "text-green-600"
    },
    {
      id: "whatsapp",
      title: "WhatsApp",
      description: "Seamless communication via WhatsApp",
      icon: MessageCircle,
      color: "bg-emerald-500",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600"
    },
    {
      id: "marketplace",
      title: "Marketplace",
      description: "Featured listings and marketplace management",
      icon: Star,
      color: "bg-yellow-500",
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600"
    },
    {
      id: "legal",
      title: "Legal Tools",
      description: "Contract templates and legal document management",
      icon: FileText,
      color: "bg-red-500",
      bgColor: "bg-red-50",
      iconColor: "text-red-600"
    },
    {
      id: "verification",
      title: "Verification",
      description: "Identity and property verification services",
      icon: Shield,
      color: "bg-indigo-500",
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-600"
    },
    {
      id: "test",
      title: "Payment Test",
      description: "Test payment integration with Nigerian providers",
      icon: TestTube,
      color: "bg-gray-500",
      bgColor: "bg-gray-50",
      iconColor: "text-gray-600"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
          
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Advanced Features
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Transform your rental experience with cutting-edge technology
            </p>
          </div>

          {/* Feature Navigation */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              const isActive = activeTab === feature.id;
              
              return (
                <button
                  key={feature.id}
                  onClick={() => setActiveTab(feature.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isActive 
                      ? 'border-orange-500 bg-orange-50' 
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <Icon className={`w-8 h-8 mx-auto mb-2 ${
                    isActive ? 'text-orange-600' : 'text-gray-600'
                  }`} />
                  <h3 className={`font-semibold text-sm ${
                    isActive ? 'text-orange-900' : 'text-gray-900'
                  }`}>
                    {feature.title}
                  </h3>
                </button>
              );
            })}
          </div>

          {/* Content Area */}
          <Card className="min-h-[500px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                {(() => {
                  const activeFeature = features.find(f => f.id === activeTab);
                  if (activeFeature) {
                    const Icon = activeFeature.icon;
                    return (
                      <>
                        <Icon className="w-6 h-6 text-orange-600" />
                        {activeFeature.title}
                      </>
                    );
                  }
                  return 'Advanced Features';
                })()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Tab Content */}
              {activeTab === 'payments' && (
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-blue-900 mb-3">💳 Secure Payments</h3>
                    <p className="text-blue-700 mb-4">
                      Process rent payments with multiple payment options including cards, bank transfers, and mobile money.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white p-4 rounded border">
                        <h4 className="font-semibold text-blue-800">Multiple Payment Methods</h4>
                        <p className="text-sm text-blue-600">Cards, Bank Transfer, USSD, Mobile Money</p>
                      </div>
                      <div className="bg-white p-4 rounded border">
                        <h4 className="font-semibold text-blue-800">Real-time Processing</h4>
                        <p className="text-sm text-blue-600">Instant payment confirmation and receipts</p>
                      </div>
                      <div className="bg-white p-4 rounded border">
                        <h4 className="font-semibold text-blue-800">Payment History</h4>
                        <p className="text-sm text-blue-600">Complete transaction tracking and management</p>
                      </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                      <Button
                        onClick={() => window.location.href = '/payment-dashboard'}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Payment Dashboard
                      </Button>
                      <Button
                        onClick={() => window.location.href = '/tenant-portal?tab=payments'}
                        variant="outline"
                        className="border-blue-200 text-blue-700 hover:bg-blue-50"
                      >
                        Tenant Portal
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'ai' && (
                <div className="space-y-6">
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-purple-900 mb-3">🤖 AI Features</h3>
                    <p className="text-purple-700 mb-4">
                      Personalized property recommendations powered by machine learning and market analysis.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded border">
                        <h4 className="font-semibold text-purple-800">Smart Recommendations</h4>
                        <p className="text-sm text-purple-600">AI analyzes your preferences and suggests perfect matches</p>
                      </div>
                      <div className="bg-white p-4 rounded border">
                        <h4 className="font-semibold text-purple-800">Market Predictions</h4>
                        <p className="text-sm text-purple-600">Price forecasting and investment insights</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-green-900 mb-3">📊 Market Analytics</h3>
                    <p className="text-green-700 mb-4">
                      Comprehensive market data and insights for Port Harcourt real estate.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white p-4 rounded border">
                        <h4 className="font-semibold text-green-800">Price Trends</h4>
                        <p className="text-sm text-green-600">Real-time market price analysis</p>
                      </div>
                      <div className="bg-white p-4 rounded border">
                        <h4 className="font-semibold text-green-800">Area Insights</h4>
                        <p className="text-sm text-green-600">Location-specific market data</p>
                      </div>
                      <div className="bg-white p-4 rounded border">
                        <h4 className="font-semibold text-green-800">Investment ROI</h4>
                        <p className="text-sm text-green-600">Return on investment calculations</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'whatsapp' && (
                <div className="space-y-6">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-emerald-900 mb-3">📱 WhatsApp Integration</h3>
                    <p className="text-emerald-700 mb-4">
                      Seamless communication via WhatsApp for property inquiries and updates.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded border">
                        <h4 className="font-semibold text-emerald-800">Instant Messaging</h4>
                        <p className="text-sm text-emerald-600">Direct communication with landlords and agents</p>
                      </div>
                      <div className="bg-white p-4 rounded border">
                        <h4 className="font-semibold text-emerald-800">Property Alerts</h4>
                        <p className="text-sm text-emerald-600">Get notified about new properties via WhatsApp</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'marketplace' && (
                <div className="space-y-6">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-yellow-900 mb-3">🏪 Marketplace</h3>
                    <p className="text-yellow-700 mb-4">
                      Featured listings and marketplace management for premium property exposure.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded border">
                        <h4 className="font-semibold text-yellow-800">Featured Listings</h4>
                        <p className="text-sm text-yellow-600">Promote your properties for maximum visibility</p>
                      </div>
                      <div className="bg-white p-4 rounded border">
                        <h4 className="font-semibold text-yellow-800">Performance Analytics</h4>
                        <p className="text-sm text-yellow-600">Track views, inquiries, and engagement</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'legal' && (
                <div className="space-y-6">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-red-900 mb-3">⚖️ Legal Tools</h3>
                    <p className="text-red-700 mb-4">
                      Contract templates and legal document management for secure transactions.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded border">
                        <h4 className="font-semibold text-red-800">Contract Templates</h4>
                        <p className="text-sm text-red-600">Nigerian law-compliant rental agreements</p>
                      </div>
                      <div className="bg-white p-4 rounded border">
                        <h4 className="font-semibold text-red-800">Document Management</h4>
                        <p className="text-sm text-red-600">Secure storage and digital signatures</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'verification' && (
                <div className="space-y-6">
                  <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-indigo-900 mb-3">✅ Verification Services</h3>
                    <p className="text-indigo-700 mb-4">
                      Identity and property verification services for trusted transactions.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white p-4 rounded border">
                        <h4 className="font-semibold text-indigo-800">Identity Verification</h4>
                        <p className="text-sm text-indigo-600">NIN, BVN, and document verification</p>
                      </div>
                      <div className="bg-white p-4 rounded border">
                        <h4 className="font-semibold text-indigo-800">Property Verification</h4>
                        <p className="text-sm text-indigo-600">Title verification and property inspection</p>
                      </div>
                      <div className="bg-white p-4 rounded border">
                        <h4 className="font-semibold text-indigo-800">Background Checks</h4>
                        <p className="text-sm text-indigo-600">Comprehensive tenant and landlord screening</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'test' && (
                <div className="space-y-6">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">🧪 Payment Test</h3>
                    <p className="text-gray-700 mb-4">
                      Test payment integration with Nigerian payment providers.
                    </p>
                    <Button 
                      onClick={() => window.location.href = '/payment-test'}
                      className="bg-gray-600 hover:bg-gray-700"
                    >
                      Go to Payment Test
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdvancedFeatures;
