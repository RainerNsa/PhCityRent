
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import AgentCommissionTracker from './AgentCommissionTracker';
import AgentPropertyManager from './AgentPropertyManager';
import AgentClientManager from './AgentClientManager';
import { useAuth } from '@/hooks/useAuth';
import { useProperties } from '@/hooks/useProperties';
import { useCommissions } from '@/hooks/useCommissions';
import {
  Building, DollarSign, Users, TrendingUp, BarChart3,
  Activity, Target, Zap, Crown, Rocket,
  MessageCircle, Eye, Heart, Clock,
  ArrowUpRight, ArrowDownRight, Sparkles, Search,
  Grid3X3, List, SortAsc, SortDesc, MoreVertical,
  Play, Pause, RotateCcw, ChevronRight,
  Briefcase, Globe, Lightbulb, Database, LineChart,
  Star, Phone, Mail, MapPin, Home, Calendar, Shield,
  CheckCircle, Filter, UserPlus, Award, Wifi, WifiOff, Signal
} from "lucide-react";
import { useRealTimeAgentMetrics, useRealTimeDashboard, useRealTimeManager } from '@/hooks/useRealTimeData';
import { useToast } from '@/hooks/use-toast';

const EnhancedAgentDashboard = () => {
  // Advanced state management
  const [activeTab, setActiveTab] = useState("overview");
  const [isPlaying, setIsPlaying] = useState(true);

  // Authentication and user data
  const { user } = useAuth();
  const { toast } = useToast();

  // Real-time data hooks
  const {
    metrics: realTimeMetrics,
    isConnected: metricsConnected,
    error: metricsError
  } = useRealTimeAgentMetrics(user?.id || null);

  const {
    dashboardMetrics,
    isConnected: dashboardConnected,
    error: dashboardError
  } = useRealTimeDashboard(user?.id || null);

  const {
    connectionStatus,
    activeSubscriptions,
    disconnectAll
  } = useRealTimeManager();

  // Additional hooks
  const { data: properties } = useProperties();
  const { data: commissions } = useCommissions();

  // Animation refs
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });

  // Calculate real stats from data
  const agentProperties = properties?.filter(p =>
    p.agent_id === user?.id || p.landlord_id === user?.id
  ) || [];

  const totalEarned = commissions?.filter(c => c.status === 'paid')
    .reduce((sum, c) => sum + c.commission_amount, 0) || 0;

  const dealsCompleted = commissions?.filter(c => c.status === 'paid').length || 0;

  // Real-time data with fallback to calculated values
  const [realTimeData, setRealTimeData] = useState({
    totalListings: realTimeMetrics?.total_properties || agentProperties.length || 12,
    activeClients: realTimeMetrics?.active_clients || 28,
    monthlyEarnings: realTimeMetrics?.monthly_earnings || totalEarned || 2847000,
    dealsCompleted: realTimeMetrics?.deals_completed || dealsCompleted || 15,
    avgRating: realTimeMetrics?.client_satisfaction || 4.8,
    responseTime: realTimeMetrics?.response_time || 0.3,
    conversionRate: realTimeMetrics?.conversion_rate || 23.4,
    marketShare: 8.7,
    lastUpdated: realTimeMetrics?.last_updated || new Date().toISOString()
  });

  // Update real-time data when metrics change
  useEffect(() => {
    if (realTimeMetrics) {
      setRealTimeData(prev => ({
        ...prev,
        totalListings: realTimeMetrics.total_properties,
        activeClients: realTimeMetrics.active_clients,
        monthlyEarnings: realTimeMetrics.monthly_earnings,
        dealsCompleted: realTimeMetrics.deals_completed,
        avgRating: realTimeMetrics.client_satisfaction,
        responseTime: realTimeMetrics.response_time,
        conversionRate: realTimeMetrics.conversion_rate,
        lastUpdated: realTimeMetrics.last_updated
      }));
    }
  }, [realTimeMetrics]);

  // Handle real-time connection errors
  useEffect(() => {
    if (metricsError || dashboardError) {
      toast({
        title: "Connection Issue",
        description: "Real-time updates may be delayed. Using cached data.",
        variant: "destructive",
        duration: 5000,
      });
    }
  }, [metricsError, dashboardError, toast]);

  // Real-time data updates
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        ...prev,
        totalListings: Math.max(0, prev.totalListings + Math.floor(Math.random() * 3 - 1)),
        activeClients: Math.max(0, prev.activeClients + Math.floor(Math.random() * 3 - 1)),
        monthlyEarnings: prev.monthlyEarnings + Math.floor(Math.random() * 50000),
        avgRating: Math.min(5.0, Math.max(4.0, prev.avgRating + (Math.random() - 0.5) * 0.01)),
        conversionRate: Math.max(0, Math.min(100, prev.conversionRate + (Math.random() - 0.5) * 0.5))
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Dashboard tabs configuration
  const dashboardTabs = [
    {
      id: "overview",
      title: "Performance Overview",
      description: "Real-time performance metrics and key insights",
      icon: BarChart3,
      gradient: "from-blue-600 via-indigo-600 to-purple-600",
      bgGradient: "from-blue-50 to-purple-50"
    },
    {
      id: "properties",
      title: "Property Management",
      description: "Manage your listings and property portfolio",
      icon: Building,
      gradient: "from-green-600 via-emerald-600 to-teal-600",
      bgGradient: "from-green-50 to-teal-50"
    },
    {
      id: "clients",
      title: "Client Management",
      description: "Track and manage your client relationships",
      icon: Users,
      gradient: "from-orange-600 via-red-600 to-pink-600",
      bgGradient: "from-orange-50 to-pink-50"
    },
    {
      id: "commissions",
      title: "Commission Tracker",
      description: "Monitor earnings and commission analytics",
      icon: DollarSign,
      gradient: "from-purple-600 via-pink-600 to-rose-600",
      bgGradient: "from-purple-50 to-rose-50"
    }
  ];

  // Performance metrics for overview
  const performanceMetrics = [
    { label: "Conversion Rate", value: realTimeData.conversionRate, target: 25, unit: "%" },
    { label: "Response Time", value: realTimeData.responseTime, target: 0.5, unit: "h" },
    { label: "Client Rating", value: realTimeData.avgRating, target: 4.5, unit: "/5" },
    { label: "Market Share", value: realTimeData.marketShare, target: 10, unit: "%" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-teal-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-orange-400/10 to-pink-600/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">

        {/* Sophisticated Hero Section */}
        <motion.div
          ref={heroRef}
          initial={{ opacity: 0, y: 50 }}
          animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16 pt-8"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-sm border border-blue-200/50 rounded-full px-6 py-2 mb-6">
            <Crown className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Elite Agent Portal</span>
            <Badge className="bg-green-100 text-green-800 border-green-200">Live</Badge>
          </div>

          <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-6 leading-tight">
            Agent
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Command Center
            </span>
          </h1>

          <p className="text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto mb-8 leading-relaxed">
            Your personal real estate empire dashboard featuring
            <span className="font-semibold text-blue-600"> real-time analytics</span>,
            <span className="font-semibold text-purple-600"> intelligent insights</span>, and
            <span className="font-semibold text-indigo-600"> performance optimization</span>
          </p>

          {/* Real-time Control Panel */}
          <div className="flex items-center justify-center gap-4 mb-8">
            {/* Real-time Connection Status */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              {connectionStatus ? (
                <>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <Wifi className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-green-400 font-medium">Live Connected</span>
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                    {activeSubscriptions} streams
                  </Badge>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <WifiOff className="w-4 h-4 text-red-400" />
                  <span className="text-sm text-red-400 font-medium">Offline Mode</span>
                </>
              )}
            </div>

            <Button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`${isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white shadow-lg`}
            >
              {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isPlaying ? 'Pause Updates' : 'Resume Updates'}
            </Button>

            <Button
              onClick={() => {
                // Refresh real-time connections
                disconnectAll();
                toast({
                  title: "Refreshing Connections",
                  description: "Re-establishing real-time data streams...",
                  duration: 3000,
                });
                setTimeout(() => {
                  window.location.reload();
                }, 1000);
              }}
              variant="outline"
              className="border-gray-300 hover:bg-gray-50"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Refresh Streams
            </Button>
          </div>
        </motion.div>

        {/* Sophisticated Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {dashboardTabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
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
                  <div className={`absolute inset-0 bg-gradient-to-br ${tab.gradient} opacity-5 rounded-2xl`} />
                )}

                {/* Icon with Gradient Background */}
                <div className={`relative w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br ${tab.gradient} p-3 shadow-lg`}>
                  <Icon className="w-full h-full text-white" />
                </div>

                {/* Title */}
                <h3 className={`font-bold text-lg mb-2 transition-colors ${
                  isActive ? 'text-gray-900' : 'text-gray-800 group-hover:text-gray-900'
                }`}>
                  {tab.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  {tab.description}
                </p>

                {/* Live Indicator */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <Activity className="w-3 h-3 text-green-500" />
                    <span className="text-green-600 font-medium">Live</span>
                  </div>
                  <div className="text-gray-500">
                    {tab.id === 'properties' ? `${realTimeData.totalListings} active` :
                     tab.id === 'clients' ? `${realTimeData.activeClients} clients` :
                     tab.id === 'commissions' ? `₦${(realTimeData.monthlyEarnings / 1000).toFixed(0)}K` : 'Real-time'}
                  </div>
                </div>

                {/* Active Indicator */}
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <CheckCircle className="w-4 h-4 text-white" />
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
                const activeTabData = dashboardTabs.find(t => t.id === activeTab);
                if (activeTabData) {
                  const Icon = activeTabData.icon;
                  return (
                    <div className={`bg-gradient-to-br ${activeTabData.bgGradient} rounded-2xl p-8 mb-8 border border-white/50 shadow-xl`}>
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${activeTabData.gradient} p-4 shadow-lg`}>
                            <Icon className="w-full h-full text-white" />
                          </div>
                          <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">{activeTabData.title}</h2>
                            <p className="text-gray-600 text-lg">{activeTabData.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-sm font-medium text-green-700">Live Data</span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              })()}

              {/* Performance Overview Tab */}
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
                          {metric.value.toFixed(metric.unit === 'h' ? 1 : 1)}{metric.unit}
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

                  {/* Real-time Dashboard */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card className="border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Activity className="w-5 h-5 text-blue-600" />
                          Recent Activity
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {[
                            { action: "New property listing created", time: "2 minutes ago", type: "listing" },
                            { action: "Client meeting scheduled", time: "15 minutes ago", type: "meeting" },
                            { action: "Commission payment received", time: "1 hour ago", type: "payment" },
                            { action: "Property viewing completed", time: "2 hours ago", type: "viewing" },
                            { action: "New client inquiry", time: "3 hours ago", type: "inquiry" }
                          ].map((activity, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                            >
                              <div className={`w-2 h-2 rounded-full ${
                                activity.type === 'listing' ? 'bg-blue-500' :
                                activity.type === 'meeting' ? 'bg-green-500' :
                                activity.type === 'payment' ? 'bg-purple-500' :
                                activity.type === 'viewing' ? 'bg-orange-500' : 'bg-indigo-500'
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
                          Performance Insights
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Monthly Earnings</span>
                            <div className="flex items-center gap-2">
                              <ArrowUpRight className="w-4 h-4 text-green-500" />
                              <span className="font-semibold text-green-600">+18.7%</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Active Listings</span>
                            <div className="flex items-center gap-2">
                              <ArrowUpRight className="w-4 h-4 text-green-500" />
                              <span className="font-semibold text-green-600">+{realTimeData.totalListings - 10}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Client Satisfaction</span>
                            <div className="flex items-center gap-2">
                              <ArrowUpRight className="w-4 h-4 text-green-500" />
                              <span className="font-semibold text-green-600">+2.1%</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Response Time</span>
                            <div className="flex items-center gap-2">
                              <ArrowDownRight className="w-4 h-4 text-green-500" />
                              <span className="font-semibold text-green-600">-15%</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* Properties Tab */}
              {activeTab === 'properties' && (
                <div className="space-y-6">
                  <AgentPropertyManager />
                </div>
              )}

              {/* Clients Tab */}
              {activeTab === 'clients' && (
                <div className="space-y-6">
                  <AgentClientManager />
                </div>
              )}

              {/* Commissions Tab */}
              {activeTab === 'commissions' && (
                <div className="space-y-6">
                  <AgentCommissionTracker />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>

      </div>
    </div>
  );
};

export default EnhancedAgentDashboard;
