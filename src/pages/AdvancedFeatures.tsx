import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence, useInView, useMotionValue, useSpring } from 'framer-motion';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  CreditCard, Brain, BarChart3, MessageCircle, Star, FileText, Shield, Zap,
  Sparkles, TestTube, TrendingUp, Users, Globe, Cpu, Database, Lock,
  Rocket, Target, Award, ChevronRight, Play, Pause, RotateCcw,
  Activity, PieChart, LineChart, DollarSign, Home, Clock, CheckCircle2,
  ArrowUpRight, ArrowDownRight, Layers, Workflow, Gauge, Lightbulb
} from 'lucide-react';

// Advanced Dashboard Component with Real-time Data and Sophisticated UI
const AdvancedFeatures = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [isPlaying, setIsPlaying] = useState(true);
  const [realTimeData, setRealTimeData] = useState({
    totalUsers: 12847,
    activeProperties: 3421,
    monthlyRevenue: 2847392,
    systemUptime: 99.97,
    aiAccuracy: 94.3,
    transactionVolume: 847392
  });

  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });

  // Real-time data simulation
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        totalUsers: prev.totalUsers + Math.floor(Math.random() * 3),
        activeProperties: prev.activeProperties + Math.floor(Math.random() * 2),
        monthlyRevenue: prev.monthlyRevenue + Math.floor(Math.random() * 1000),
        systemUptime: Math.min(99.99, prev.systemUptime + Math.random() * 0.01),
        aiAccuracy: Math.min(99.9, prev.aiAccuracy + Math.random() * 0.1),
        transactionVolume: prev.transactionVolume + Math.floor(Math.random() * 500)
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Handle URL parameters for tab navigation
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['overview', 'payments', 'ai', 'analytics', 'whatsapp', 'marketplace', 'legal', 'verification'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const features = [
    {
      id: "overview",
      title: "System Overview",
      description: "Real-time platform metrics and performance indicators",
      icon: Gauge,
      gradient: "from-blue-600 via-purple-600 to-indigo-600",
      bgGradient: "from-blue-50 to-indigo-50",
      metrics: { users: realTimeData.totalUsers, uptime: realTimeData.systemUptime, accuracy: realTimeData.aiAccuracy }
    },
    {
      id: "payments",
      title: "Payment Engine",
      description: "Advanced payment processing with AI fraud detection",
      icon: CreditCard,
      gradient: "from-emerald-600 via-teal-600 to-cyan-600",
      bgGradient: "from-emerald-50 to-cyan-50",
      metrics: { volume: realTimeData.transactionVolume, revenue: realTimeData.monthlyRevenue, success: 99.8 }
    },
    {
      id: "ai",
      title: "AI Intelligence",
      description: "Machine learning algorithms for property matching and market prediction",
      icon: Brain,
      gradient: "from-purple-600 via-pink-600 to-rose-600",
      bgGradient: "from-purple-50 to-rose-50",
      metrics: { accuracy: realTimeData.aiAccuracy, predictions: 15847, models: 12 }
    },
    {
      id: "analytics",
      title: "Market Intelligence",
      description: "Advanced analytics with predictive modeling and trend analysis",
      icon: BarChart3,
      gradient: "from-orange-600 via-red-600 to-pink-600",
      bgGradient: "from-orange-50 to-pink-50",
      metrics: { properties: realTimeData.activeProperties, insights: 847, trends: 23 }
    },
    {
      id: "whatsapp",
      title: "Communication Hub",
      description: "Omnichannel communication with AI-powered chatbots and automation",
      icon: MessageCircle,
      gradient: "from-green-600 via-emerald-600 to-teal-600",
      bgGradient: "from-green-50 to-teal-50",
      metrics: { messages: 45892, response: 0.3, satisfaction: 96.7 }
    },
    {
      id: "marketplace",
      title: "Smart Marketplace",
      description: "AI-driven property marketplace with dynamic pricing and matching",
      icon: Star,
      gradient: "from-yellow-600 via-orange-600 to-red-600",
      bgGradient: "from-yellow-50 to-red-50",
      metrics: { listings: 8472, matches: 2847, conversion: 23.4 }
    },
    {
      id: "legal",
      title: "Legal Automation",
      description: "Smart contract generation with blockchain integration and compliance",
      icon: FileText,
      gradient: "from-indigo-600 via-blue-600 to-cyan-600",
      bgGradient: "from-indigo-50 to-cyan-50",
      metrics: { contracts: 3421, compliance: 99.9, automation: 87.3 }
    },
    {
      id: "verification",
      title: "Security Matrix",
      description: "Multi-layer verification with biometric authentication and fraud detection",
      icon: Shield,
      gradient: "from-red-600 via-rose-600 to-pink-600",
      bgGradient: "from-red-50 to-pink-50",
      metrics: { verifications: 12847, fraud: 0.02, security: 99.98 }
    }
  ];

  // Performance metrics for the overview
  const performanceMetrics = [
    { label: "System Uptime", value: realTimeData.systemUptime, target: 99.9, unit: "%" },
    { label: "AI Accuracy", value: realTimeData.aiAccuracy, target: 95, unit: "%" },
    { label: "Response Time", value: 0.3, target: 0.5, unit: "s" },
    { label: "User Satisfaction", value: 96.7, target: 90, unit: "%" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-orange-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-green-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <Navbar />

      <main className="pt-20 pb-12 relative z-10">
        <div className="container mx-auto px-4 max-w-7xl">

          {/* Sophisticated Hero Section */}
          <motion.div
            ref={heroRef}
            initial={{ opacity: 0, y: 50 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-sm border border-blue-200/50 rounded-full px-6 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Enterprise-Grade Platform</span>
              <Badge className="bg-green-100 text-green-800 border-green-200">Live</Badge>
            </div>

            <h1 className="text-6xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-6 leading-tight">
              Advanced
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Intelligence
              </span>
            </h1>

            <p className="text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto mb-8 leading-relaxed">
              Experience the future of real estate technology with our AI-powered platform featuring
              <span className="font-semibold text-blue-600"> real-time analytics</span>,
              <span className="font-semibold text-purple-600"> intelligent automation</span>, and
              <span className="font-semibold text-indigo-600"> enterprise security</span>
            </p>

            {/* Real-time Control Panel */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <Button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`${isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white shadow-lg`}
              >
                {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                {isPlaying ? 'Pause Live Data' : 'Resume Live Data'}
              </Button>
              <Button
                onClick={() => setRealTimeData({
                  totalUsers: 12847,
                  activeProperties: 3421,
                  monthlyRevenue: 2847392,
                  systemUptime: 99.97,
                  aiAccuracy: 94.3,
                  transactionVolume: 847392
                })}
                variant="outline"
                className="border-gray-300 hover:bg-gray-50"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Data
              </Button>
            </div>
          </motion.div>

          {/* Sophisticated Feature Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isActive = activeTab === feature.id;

              return (
                <motion.button
                  key={feature.id}
                  onClick={() => setActiveTab(feature.id)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 ${
                    isActive
                      ? 'border-blue-500 bg-white shadow-xl shadow-blue-500/20'
                      : 'border-gray-200 bg-white/80 backdrop-blur-sm hover:border-gray-300 hover:shadow-lg'
                  }`}
                >
                  {/* Gradient Background for Active */}
                  {isActive && (
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-5 rounded-2xl`} />
                  )}

                  {/* Icon with Gradient Background */}
                  <div className={`relative w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br ${feature.gradient} p-3 shadow-lg`}>
                    <Icon className="w-full h-full text-white" />
                  </div>

                  {/* Title */}
                  <h3 className={`font-bold text-lg mb-2 transition-colors ${
                    isActive ? 'text-gray-900' : 'text-gray-800 group-hover:text-gray-900'
                  }`}>
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Metrics Preview */}
                  {feature.metrics && (
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1">
                        <Activity className="w-3 h-3 text-green-500" />
                        <span className="text-green-600 font-medium">Live</span>
                      </div>
                      <div className="text-gray-500">
                        {Object.keys(feature.metrics).length} metrics
                      </div>
                    </div>
                  )}

                  {/* Active Indicator */}
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg"
                    >
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </motion.div>

          {/* Sophisticated Content Area */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Dynamic Header */}
                {(() => {
                  const activeFeature = features.find(f => f.id === activeTab);
                  if (activeFeature) {
                    const Icon = activeFeature.icon;
                    return (
                      <div className={`bg-gradient-to-br ${activeFeature.bgGradient} rounded-2xl p-8 mb-8 border border-white/50 shadow-xl`}>
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-4">
                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${activeFeature.gradient} p-4 shadow-lg`}>
                              <Icon className="w-full h-full text-white" />
                            </div>
                            <div>
                              <h2 className="text-3xl font-bold text-gray-900 mb-2">{activeFeature.title}</h2>
                              <p className="text-gray-600 text-lg">{activeFeature.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium text-green-700">Live Data</span>
                          </div>
                        </div>

                        {/* Real-time Metrics Bar */}
                        {activeFeature.metrics && (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {Object.entries(activeFeature.metrics).map(([key, value], index) => (
                              <motion.div
                                key={key}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50"
                              >
                                <div className="text-sm text-gray-600 capitalize mb-1">{key.replace(/([A-Z])/g, ' $1')}</div>
                                <div className="text-2xl font-bold text-gray-900">
                                  {typeof value === 'number' ? (
                                    value > 1000 ? `${(value / 1000).toFixed(1)}K` :
                                    value % 1 !== 0 ? value.toFixed(2) : value
                                  ) : value}
                                  {key.includes('uptime') || key.includes('accuracy') || key.includes('satisfaction') ? '%' : ''}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                })()}

                {/* Content Based on Active Tab */}
                {/* Overview Dashboard */}
                {activeTab === 'overview' && (
                  <div className="space-y-8">
                    {/* Performance Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {performanceMetrics.map((metric, index) => (
                        <motion.div
                          key={metric.label}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-700">{metric.label}</h3>
                            <div className={`w-3 h-3 rounded-full ${
                              metric.value >= metric.target ? 'bg-green-500' : 'bg-yellow-500'
                            } animate-pulse`}></div>
                          </div>
                          <div className="text-3xl font-bold text-gray-900 mb-2">
                            {metric.value.toFixed(metric.unit === 's' ? 1 : 2)}{metric.unit}
                          </div>
                          <Progress
                            value={(metric.value / metric.target) * 100}
                            className="h-2 mb-2"
                          />
                          <div className="text-sm text-gray-500">
                            Target: {metric.target}{metric.unit}
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Real-time Activity Feed */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <Card className="border-0 shadow-lg">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Activity className="w-5 h-5 text-blue-600" />
                            System Activity
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {[
                              { action: "New user registration", time: "2 seconds ago", type: "user" },
                              { action: "Payment processed", time: "15 seconds ago", type: "payment" },
                              { action: "Property verified", time: "1 minute ago", type: "verification" },
                              { action: "AI recommendation generated", time: "2 minutes ago", type: "ai" },
                              { action: "Contract signed", time: "5 minutes ago", type: "legal" }
                            ].map((activity, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                              >
                                <div className={`w-2 h-2 rounded-full ${
                                  activity.type === 'user' ? 'bg-blue-500' :
                                  activity.type === 'payment' ? 'bg-green-500' :
                                  activity.type === 'verification' ? 'bg-purple-500' :
                                  activity.type === 'ai' ? 'bg-pink-500' : 'bg-indigo-500'
                                }`}></div>
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900">{activity.action}</div>
                                  <div className="text-sm text-gray-500">{activity.time}</div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-0 shadow-lg">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-green-600" />
                            Performance Trends
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-6">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">User Growth</span>
                              <div className="flex items-center gap-2">
                                <ArrowUpRight className="w-4 h-4 text-green-500" />
                                <span className="font-semibold text-green-600">+23.4%</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Revenue</span>
                              <div className="flex items-center gap-2">
                                <ArrowUpRight className="w-4 h-4 text-green-500" />
                                <span className="font-semibold text-green-600">+18.7%</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Properties</span>
                              <div className="flex items-center gap-2">
                                <ArrowUpRight className="w-4 h-4 text-green-500" />
                                <span className="font-semibold text-green-600">+15.2%</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">AI Accuracy</span>
                              <div className="flex items-center gap-2">
                                <ArrowUpRight className="w-4 h-4 text-green-500" />
                                <span className="font-semibold text-green-600">+2.1%</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}

                {/* Enhanced Payments Section */}
                {activeTab === 'payments' && (
                  <div className="space-y-8">
                    {/* Payment Engine Overview */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-3">
                              <DollarSign className="w-full h-full text-white" />
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900">Transaction Volume</h3>
                              <p className="text-sm text-gray-600">Last 30 days</p>
                            </div>
                          </div>
                          <div className="text-3xl font-bold text-gray-900 mb-2">
                            ₦{(realTimeData.transactionVolume / 1000).toFixed(0)}K
                          </div>
                          <div className="flex items-center gap-2 text-green-600">
                            <ArrowUpRight className="w-4 h-4" />
                            <span className="text-sm font-medium">+12.5% from last month</span>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-3">
                              <Shield className="w-full h-full text-white" />
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900">Security Score</h3>
                              <p className="text-sm text-gray-600">Fraud detection</p>
                            </div>
                          </div>
                          <div className="text-3xl font-bold text-gray-900 mb-2">99.8%</div>
                          <div className="flex items-center gap-2 text-blue-600">
                            <Shield className="w-4 h-4" />
                            <span className="text-sm font-medium">Bank-level security</span>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-3">
                              <Clock className="w-full h-full text-white" />
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900">Processing Time</h3>
                              <p className="text-sm text-gray-600">Average</p>
                            </div>
                          </div>
                          <div className="text-3xl font-bold text-gray-900 mb-2">0.3s</div>
                          <div className="flex items-center gap-2 text-purple-600">
                            <Zap className="w-4 h-4" />
                            <span className="text-sm font-medium">Lightning fast</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Payment Methods Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {[
                        { name: "Debit/Credit Cards", icon: CreditCard, transactions: "45.2K", color: "from-blue-500 to-indigo-600" },
                        { name: "Bank Transfer", icon: Database, transactions: "32.1K", color: "from-green-500 to-emerald-600" },
                        { name: "Mobile Money", icon: Smartphone, transactions: "28.7K", color: "from-purple-500 to-pink-600" },
                        { name: "USSD Payments", icon: MessageCircle, transactions: "15.3K", color: "from-orange-500 to-red-600" }
                      ].map((method, index) => (
                        <motion.div
                          key={method.name}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all"
                        >
                          <div className={`w-12 h-12 bg-gradient-to-br ${method.color} rounded-xl p-3 mb-4`}>
                            <method.icon className="w-full h-full text-white" />
                          </div>
                          <h3 className="font-bold text-gray-900 mb-2">{method.name}</h3>
                          <div className="text-2xl font-bold text-gray-700 mb-1">{method.transactions}</div>
                          <div className="text-sm text-gray-500">transactions</div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-4 justify-center">
                      <Button
                        onClick={() => window.location.href = '/payment-dashboard'}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all px-8 py-3"
                      >
                        <Rocket className="w-5 h-5 mr-2" />
                        Launch Payment Dashboard
                      </Button>
                      <Button
                        onClick={() => window.location.href = '/tenant-portal?tab=payments'}
                        variant="outline"
                        className="border-2 border-blue-200 text-blue-700 hover:bg-blue-50 px-8 py-3"
                      >
                        <Users className="w-5 h-5 mr-2" />
                        Tenant Portal
                      </Button>
                    </div>
                  </div>
              )}

              {/* AI Intelligence Section */}
              {activeTab === 'ai' && (
                <div className="space-y-8">
                  {/* AI Models Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      {
                        name: "Property Matcher",
                        accuracy: realTimeData.aiAccuracy,
                        predictions: "15.8K",
                        icon: Target,
                        color: "from-purple-500 to-pink-600"
                      },
                      {
                        name: "Price Predictor",
                        accuracy: 92.7,
                        predictions: "8.2K",
                        icon: TrendingUp,
                        color: "from-blue-500 to-indigo-600"
                      },
                      {
                        name: "Fraud Detector",
                        accuracy: 99.1,
                        predictions: "2.1K",
                        icon: Shield,
                        color: "from-red-500 to-rose-600"
                      }
                    ].map((model, index) => (
                      <motion.div
                        key={model.name}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                      >
                        <div className={`w-14 h-14 bg-gradient-to-br ${model.color} rounded-2xl p-4 mb-4`}>
                          <model.icon className="w-full h-full text-white" />
                        </div>
                        <h3 className="font-bold text-xl text-gray-900 mb-2">{model.name}</h3>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-600">Accuracy</span>
                              <span className="font-medium">{model.accuracy.toFixed(1)}%</span>
                            </div>
                            <Progress value={model.accuracy} className="h-2" />
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Predictions</span>
                            <span className="font-bold text-gray-900">{model.predictions}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* AI Insights */}
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-yellow-600" />
                        AI-Generated Insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {[
                          {
                            title: "Market Trend Alert",
                            insight: "Property prices in GRA Phase 2 are trending 15% above market average",
                            confidence: 94,
                            type: "trend"
                          },
                          {
                            title: "Demand Prediction",
                            insight: "3-bedroom apartments will see 23% increase in demand next quarter",
                            confidence: 87,
                            type: "prediction"
                          }
                        ].map((insight, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.2 }}
                            className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100"
                          >
                            <h4 className="font-bold text-gray-900 mb-2">{insight.title}</h4>
                            <p className="text-gray-700 mb-4">{insight.insight}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Confidence</span>
                              <span className="font-bold text-purple-600">{insight.confidence}%</span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Market Analytics Section */}
              {activeTab === 'analytics' && (
                <div className="space-y-8">
                  {/* Analytics Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { label: "Active Properties", value: realTimeData.activeProperties, icon: Home, color: "from-blue-500 to-cyan-600" },
                      { label: "Market Insights", value: "847", icon: BarChart3, color: "from-green-500 to-emerald-600" },
                      { label: "Trend Analysis", value: "23", icon: TrendingUp, color: "from-purple-500 to-pink-600" },
                      { label: "Predictions", value: "156", icon: Target, color: "from-orange-500 to-red-600" }
                    ].map((metric, index) => (
                      <motion.div
                        key={metric.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                      >
                        <div className={`w-12 h-12 bg-gradient-to-br ${metric.color} rounded-xl p-3 mb-4`}>
                          <metric.icon className="w-full h-full text-white" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
                        <div className="text-sm text-gray-600">{metric.label}</div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Market Trends */}
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <LineChart className="w-5 h-5 text-blue-600" />
                        Market Trends & Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                          <BarChart3 className="w-12 h-12 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Advanced Analytics Dashboard</h3>
                        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                          Comprehensive market analysis with real-time data visualization,
                          predictive modeling, and trend forecasting for the Port Harcourt real estate market.
                        </p>
                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3">
                          <ChevronRight className="w-5 h-5 mr-2" />
                          Explore Analytics
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Advanced sections for remaining tabs */}
              {['whatsapp', 'marketplace', 'legal', 'verification'].includes(activeTab) && (
                <div className="text-center py-16">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-2xl mx-auto"
                  >
                    <div className={`w-32 h-32 bg-gradient-to-br ${features.find(f => f.id === activeTab)?.gradient} rounded-full mx-auto mb-8 flex items-center justify-center shadow-2xl`}>
                      {(() => {
                        const feature = features.find(f => f.id === activeTab);
                        if (feature) {
                          const Icon = feature.icon;
                          return <Icon className="w-16 h-16 text-white" />;
                        }
                        return null;
                      })()}
                    </div>
                    <h3 className="text-4xl font-bold text-gray-900 mb-4">
                      {features.find(f => f.id === activeTab)?.title}
                    </h3>
                    <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                      {features.find(f => f.id === activeTab)?.description}
                    </p>
                    <div className="flex items-center justify-center gap-4 mb-8">
                      <Badge className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-6 py-3 text-lg border-0">
                        <Rocket className="w-4 h-4 mr-2" />
                        Enterprise Ready
                      </Badge>
                      <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-6 py-3 text-lg border-0">
                        <Award className="w-4 h-4 mr-2" />
                        Coming Soon
                      </Badge>
                    </div>
                    <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 border border-gray-200">
                      <h4 className="text-xl font-bold text-gray-900 mb-4">Advanced Features Include:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                        {activeTab === 'whatsapp' && [
                          "AI-powered chatbots",
                          "Automated property alerts",
                          "Multi-language support",
                          "Integration with CRM"
                        ].map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        ))}
                        {activeTab === 'marketplace' && [
                          "Dynamic pricing algorithms",
                          "Advanced search filters",
                          "Virtual property tours",
                          "Blockchain verification"
                        ].map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        ))}
                        {activeTab === 'legal' && [
                          "Smart contract generation",
                          "Digital signatures",
                          "Compliance monitoring",
                          "Legal document templates"
                        ].map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        ))}
                        {activeTab === 'verification' && [
                          "Biometric authentication",
                          "Document verification",
                          "Background checks",
                          "Real-time fraud detection"
                        ].map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
              </motion.div>
            </AnimatePresence>
          </motion.div>



        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdvancedFeatures;
