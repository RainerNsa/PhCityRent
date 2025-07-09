import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/Footer";
import VerificationForm from "@/components/VerificationForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Star, Phone, Mail, MapPin, Home, Calendar, Shield,
  CheckCircle, Filter, UserPlus, Users, Award, TrendingUp,
  Activity, BarChart3, Target, Zap, Crown, Rocket,
  MessageCircle, Eye, Heart, Clock, DollarSign,
  ArrowUpRight, ArrowDownRight, Sparkles, Search,
  Grid3X3, List, SortAsc, SortDesc, MoreVertical,
  Play, Pause, RotateCcw, ChevronRight, Building2,
  Briefcase, Globe, Lightbulb, Database, LineChart
} from "lucide-react";
import { designTokens } from "@/lib/design-tokens";

const EnhancedAgents = () => {
  // Advanced state management
  const [activeTab, setActiveTab] = useState("overview");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [sortBy, setSortBy] = useState("rating");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showVerificationForm, setShowVerificationForm] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  // Real-time data simulation
  const [realTimeData, setRealTimeData] = useState({
    totalAgents: 247,
    activeAgents: 189,
    topPerformers: 23,
    monthlyRevenue: 8472000,
    avgRating: 4.7,
    totalProperties: 1847,
    newAgents: 12,
    conversionRate: 23.4
  });

  // Animation refs
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });

  // Real-time data updates
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        ...prev,
        totalAgents: prev.totalAgents + Math.floor(Math.random() * 3),
        activeAgents: prev.activeAgents + Math.floor(Math.random() * 2),
        monthlyRevenue: prev.monthlyRevenue + Math.floor(Math.random() * 50000),
        avgRating: Math.min(5.0, prev.avgRating + (Math.random() - 0.5) * 0.01),
        totalProperties: prev.totalProperties + Math.floor(Math.random() * 5),
        conversionRate: Math.max(0, Math.min(100, prev.conversionRate + (Math.random() - 0.5) * 0.5))
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Enhanced agent data with enterprise metrics
  const agents = [
    {
      id: 1,
      name: "Emeka Okafor",
      title: "Senior Property Consultant",
      rating: 4.8,
      reviews: 127,
      location: "GRA Phase 2",
      phone: "+234 803 123 4567",
      email: "emeka.okafor@rentph.com",
      specialties: ["Luxury Apartments", "Commercial Properties", "Investment Advisory"],
      properties: 23,
      verified: true,
      tier: "platinum",
      joinedDate: "2022",
      image: "/lovable-uploads/22d31f51-c174-40a7-bd95-00e4ad00eaf3.png",
      description: "Elite property consultant with 8+ years experience in luxury real estate.",
      metrics: {
        totalSales: 2847000,
        avgDealSize: 450000,
        closingRate: 87.3,
        responseTime: 0.5,
        clientSatisfaction: 96.8,
        monthlyDeals: 12,
        yearlyGrowth: 23.4
      },
      badges: ["Top Performer", "Luxury Specialist", "Client Favorite"],
      status: "online",
      lastActive: "2 minutes ago"
    },
    {
      id: 2,
      name: "Blessing Eze",
      title: "Family Housing Specialist",
      rating: 4.9,
      reviews: 89,
      location: "Trans Amadi",
      phone: "+234 806 987 6543",
      email: "blessing.eze@rentph.com",
      specialties: ["Family Homes", "Budget-Friendly", "First-Time Buyers"],
      properties: 31,
      verified: true,
      tier: "gold",
      joinedDate: "2021",
      image: "/lovable-uploads/5663820f-6c97-4492-9210-9eaa1a8dc415.png",
      description: "Passionate about helping families find their perfect home in Port Harcourt.",
      metrics: {
        totalSales: 1923000,
        avgDealSize: 280000,
        closingRate: 92.1,
        responseTime: 0.3,
        clientSatisfaction: 98.2,
        monthlyDeals: 18,
        yearlyGrowth: 31.7
      },
      badges: ["Rising Star", "Family Expert", "Quick Response"],
      status: "online",
      lastActive: "5 minutes ago"
    },
    {
      id: 3,
      name: "Chinedu Okoro",
      title: "Development Specialist",
      rating: 4.7,
      reviews: 156,
      location: "Eliozu",
      phone: "+234 815 456 7890",
      email: "chinedu.okoro@rentph.com",
      specialties: ["New Developments", "Student Housing", "Investment Properties"],
      properties: 18,
      verified: true,
      tier: "silver",
      joinedDate: "2023",
      image: "/lovable-uploads/af412c03-21e4-4856-82ff-d1a975dc84a9.png",
      description: "Specialist in new developments and student accommodations with deep market insights.",
      metrics: {
        totalSales: 1456000,
        avgDealSize: 320000,
        closingRate: 78.9,
        responseTime: 0.8,
        clientSatisfaction: 94.1,
        monthlyDeals: 8,
        yearlyGrowth: 45.2
      },
      badges: ["New Talent", "Development Expert", "Student Housing Pro"],
      status: "busy",
      lastActive: "15 minutes ago"
    }
  ];

  // Dashboard tabs configuration
  const dashboardTabs = [
    {
      id: "overview",
      title: "System Overview",
      description: "Real-time agent performance and platform metrics",
      icon: BarChart3,
      gradient: "from-blue-600 via-indigo-600 to-purple-600",
      bgGradient: "from-blue-50 to-purple-50"
    },
    {
      id: "agents",
      title: "Agent Directory",
      description: "Comprehensive agent profiles and performance analytics",
      icon: Users,
      gradient: "from-green-600 via-emerald-600 to-teal-600",
      bgGradient: "from-green-50 to-teal-50"
    },
    {
      id: "performance",
      title: "Performance Analytics",
      description: "Advanced metrics and KPI tracking for agent success",
      icon: TrendingUp,
      gradient: "from-orange-600 via-red-600 to-pink-600",
      bgGradient: "from-orange-50 to-pink-50"
    },
    {
      id: "recruitment",
      title: "Agent Recruitment",
      description: "Onboarding pipeline and recruitment management",
      icon: UserPlus,
      gradient: "from-purple-600 via-pink-600 to-rose-600",
      bgGradient: "from-purple-50 to-rose-50"
    }
  ];

  // Performance metrics for overview
  const performanceMetrics = [
    { label: "Agent Retention", value: realTimeData.conversionRate, target: 85, unit: "%" },
    { label: "Avg Response Time", value: 0.6, target: 1.0, unit: "h" },
    { label: "Client Satisfaction", value: 96.2, target: 90, unit: "%" },
    { label: "Platform Growth", value: 23.4, target: 20, unit: "%" }
  ];

  // Advanced filtering and sorting
  const filteredAgents = agents.filter(agent => {
    const locationMatch = selectedLocation === "all" || agent.location.includes(selectedLocation);
    const ratingMatch = selectedRating === "all" || agent.rating >= parseFloat(selectedRating);
    const searchMatch = searchQuery === "" ||
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return locationMatch && ratingMatch && searchMatch;
  }).sort((a, b) => {
    const aValue = sortBy === "rating" ? a.rating :
                   sortBy === "reviews" ? a.reviews :
                   sortBy === "properties" ? a.properties :
                   sortBy === "sales" ? a.metrics?.totalSales || 0 : a.name;
    const bValue = sortBy === "rating" ? b.rating :
                   sortBy === "reviews" ? b.reviews :
                   sortBy === "properties" ? b.properties :
                   sortBy === "sales" ? b.metrics?.totalSales || 0 : b.name;

    if (typeof aValue === "string") {
      return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }
    return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-teal-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-orange-400/10 to-pink-600/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
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
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600/10 to-blue-600/10 backdrop-blur-sm border border-green-200/50 rounded-full px-6 py-2 mb-6">
              <Crown className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">Elite Agent Network</span>
              <Badge className="bg-green-100 text-green-800 border-green-200">Live</Badge>
            </div>

            <h1 className="text-6xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 via-green-900 to-blue-900 bg-clip-text text-transparent mb-6 leading-tight">
              Agent
              <span className="block bg-gradient-to-r from-green-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Command Center
              </span>
            </h1>

            <p className="text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto mb-8 leading-relaxed">
              Enterprise-grade agent management platform featuring
              <span className="font-semibold text-green-600"> real-time performance tracking</span>,
              <span className="font-semibold text-blue-600"> intelligent analytics</span>, and
              <span className="font-semibold text-indigo-600"> advanced recruitment tools</span>
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
                  totalAgents: 247,
                  activeAgents: 189,
                  topPerformers: 23,
                  monthlyRevenue: 8472000,
                  avgRating: 4.7,
                  totalProperties: 1847,
                  newAgents: 12,
                  conversionRate: 23.4
                })}
                variant="outline"
                className="border-gray-300 hover:bg-gray-50"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Data
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
                      {tab.id === 'agents' ? `${realTimeData.totalAgents} agents` :
                       tab.id === 'performance' ? `${realTimeData.activeAgents} active` :
                       tab.id === 'recruitment' ? `${realTimeData.newAgents} new` : 'Real-time'}
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

                {/* System Overview Tab */}
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
                            Agent Activity
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {[
                              { action: "New agent registration", time: "2 minutes ago", type: "registration" },
                              { action: "Property listing created", time: "5 minutes ago", type: "listing" },
                              { action: "Client meeting scheduled", time: "8 minutes ago", type: "meeting" },
                              { action: "Deal closed successfully", time: "12 minutes ago", type: "deal" },
                              { action: "Performance review completed", time: "18 minutes ago", type: "review" }
                            ].map((activity, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                              >
                                <div className={`w-2 h-2 rounded-full ${
                                  activity.type === 'registration' ? 'bg-blue-500' :
                                  activity.type === 'listing' ? 'bg-green-500' :
                                  activity.type === 'meeting' ? 'bg-purple-500' :
                                  activity.type === 'deal' ? 'bg-orange-500' : 'bg-indigo-500'
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
                              <span className="text-gray-600">Total Agents</span>
                              <div className="flex items-center gap-2">
                                <ArrowUpRight className="w-4 h-4 text-green-500" />
                                <span className="font-semibold text-green-600">+{realTimeData.newAgents}</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Monthly Revenue</span>
                              <div className="flex items-center gap-2">
                                <ArrowUpRight className="w-4 h-4 text-green-500" />
                                <span className="font-semibold text-green-600">+18.7%</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Active Properties</span>
                              <div className="flex items-center gap-2">
                                <ArrowUpRight className="w-4 h-4 text-green-500" />
                                <span className="font-semibold text-green-600">+15.2%</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Client Satisfaction</span>
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

                {/* Agent Directory Tab */}
                {activeTab === 'agents' && (
                  <div className="space-y-8">
                    {/* Advanced Search and Filters */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                              type="text"
                              placeholder="Search agents..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="rating">Sort by Rating</option>
                            <option value="reviews">Sort by Reviews</option>
                            <option value="sales">Sort by Sales</option>
                            <option value="name">Sort by Name</option>
                          </select>
                          <Button
                            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                            variant="outline"
                            size="sm"
                          >
                            {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                          </Button>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => setViewMode('grid')}
                            variant={viewMode === 'grid' ? 'default' : 'outline'}
                            size="sm"
                          >
                            <Grid3X3 className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => setViewMode('list')}
                            variant={viewMode === 'list' ? 'default' : 'outline'}
                            size="sm"
                          >
                            <List className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Sophisticated Agent Cards */}
                    <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                      {filteredAgents.map((agent, index) => (
                        <motion.div
                          key={agent.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white">
                            <div className="relative">
                              <img
                                src={agent.image}
                                alt={agent.name}
                                className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                              {/* Status Indicator */}
                              <div className="absolute top-4 left-4">
                                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                                  agent.status === 'online' ? 'bg-green-100 text-green-800' :
                                  agent.status === 'busy' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                  <div className={`w-2 h-2 rounded-full ${
                                    agent.status === 'online' ? 'bg-green-500' :
                                    agent.status === 'busy' ? 'bg-yellow-500' : 'bg-gray-500'
                                  }`}></div>
                                  {agent.status}
                                </div>
                              </div>

                              {/* Tier Badge */}
                              <div className="absolute top-4 right-4">
                                <Badge className={`${
                                  agent.tier === 'platinum' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                                  agent.tier === 'gold' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                                  'bg-gradient-to-r from-gray-500 to-gray-600'
                                } text-white border-0 shadow-md`}>
                                  <Crown className="w-3 h-3 mr-1" />
                                  {agent.tier}
                                </Badge>
                              </div>
                            </div>

                            <div className="p-6 space-y-4">
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <h3 className="text-xl font-bold text-gray-900">{agent.name}</h3>
                                  <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <span className="font-semibold text-gray-900">{agent.rating}</span>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-600 font-medium">{agent.title}</p>
                              </div>

                              {/* Performance Metrics */}
                              {agent.metrics && (
                                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                                  <div className="text-center">
                                    <div className="text-lg font-bold text-gray-900">
                                      ₦{(agent.metrics.totalSales / 1000000).toFixed(1)}M
                                    </div>
                                    <div className="text-xs text-gray-600">Total Sales</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-lg font-bold text-gray-900">
                                      {agent.metrics.closingRate}%
                                    </div>
                                    <div className="text-xs text-gray-600">Closing Rate</div>
                                  </div>
                                </div>
                              )}

                              {/* Badges */}
                              <div className="flex flex-wrap gap-2">
                                {agent.badges?.slice(0, 2).map((badge, index) => (
                                  <Badge key={index} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                    {badge}
                                  </Badge>
                                ))}
                              </div>

                              {/* Action Buttons */}
                              <div className="flex gap-3 pt-2">
                                <Button className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white">
                                  <Phone className="w-4 h-4 mr-2" />
                                  Contact
                                </Button>
                                <Button variant="outline" className="flex-1">
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Profile
                                </Button>
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Performance Analytics Tab */}
                {activeTab === 'performance' && (
                  <div className="text-center py-16">
                    <div className="w-32 h-32 bg-gradient-to-br from-orange-500 to-pink-600 rounded-full mx-auto mb-8 flex items-center justify-center">
                      <TrendingUp className="w-16 h-16 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">Advanced Performance Analytics</h3>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                      Comprehensive performance tracking with AI-powered insights, predictive analytics, and real-time KPI monitoring.
                    </p>
                    <Badge className="bg-orange-100 text-orange-800 px-4 py-2">
                      Coming Soon - Enterprise Analytics
                    </Badge>
                  </div>
                )}

                {/* Agent Recruitment Tab */}
                {activeTab === 'recruitment' && (
                  <div className="text-center py-16">
                    <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-rose-600 rounded-full mx-auto mb-8 flex items-center justify-center">
                      <UserPlus className="w-16 h-16 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">Smart Recruitment Pipeline</h3>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                      AI-powered recruitment system with automated screening, onboarding workflows, and performance prediction.
                    </p>
                    <div className="flex items-center justify-center gap-4 mb-8">
                      <Badge className="bg-purple-100 text-purple-800 px-4 py-2">
                        <Rocket className="w-4 h-4 mr-2" />
                        Enterprise Ready
                      </Badge>
                      <Badge className="bg-green-100 text-green-800 px-4 py-2">
                        <Award className="w-4 h-4 mr-2" />
                        Coming Soon
                      </Badge>
                    </div>
                    <Button
                      onClick={() => setShowVerificationForm(true)}
                      className="bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-700 hover:to-rose-700 text-white px-8 py-3"
                    >
                      <ChevronRight className="w-5 h-5 mr-2" />
                      Join Recruitment Program
                    </Button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>

        </div>
      </main>
      <Footer />

      <VerificationForm
        isOpen={showVerificationForm}
        onClose={() => setShowVerificationForm(false)}
        type="agent"
      />
    </div>
  );
};

export default EnhancedAgents;
