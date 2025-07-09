// Sophisticated Payment Dashboard - Masterclass UI/UX
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  DollarSign,
  Calendar,
  Download,
  Eye,
  ArrowUpRight,
  Zap,
  Shield,
  Sparkles,
  Bell,
  Settings,
  Plus
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { paymentHistoryService } from '@/services/paymentHistoryService';
import PaymentAnalytics from '@/components/payment/PaymentAnalytics';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/Footer';

interface PaymentCard {
  id: string;
  title: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: string;
  type: 'rent' | 'utilities' | 'maintenance' | 'deposit';
  property: string;
  lastPaid?: string;
}

interface QuickStat {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ElementType;
  color: string;
  bgGradient: string;
}

const PaymentDashboard = () => {
  const { user } = useAuth();
  const [paymentCards, setPaymentCards] = useState<PaymentCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [showQuickPay, setShowQuickPay] = useState(false);

  // Mock user data for development
  const currentUser = user || {
    id: 'demo-user-123',
    email: 'demo@phcityrent.com',
    user_metadata: {
      full_name: 'Alex Johnson',
      phone: '+234-801-234-5678'
    }
  };

  // Quick stats data
  const quickStats: QuickStat[] = [
    {
      label: 'Total Paid',
      value: '₦2,450,000',
      change: '+12.5%',
      trend: 'up',
      icon: CheckCircle,
      color: 'text-emerald-600',
      bgGradient: 'from-emerald-500 to-teal-600'
    },
    {
      label: 'Pending',
      value: '₦450,000',
      change: '-8.2%',
      trend: 'down',
      icon: Clock,
      color: 'text-amber-600',
      bgGradient: 'from-amber-500 to-orange-600'
    },
    {
      label: 'This Month',
      value: '₦450,000',
      change: '+5.1%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-blue-600',
      bgGradient: 'from-blue-500 to-indigo-600'
    },
    {
      label: 'Saved',
      value: '₦125,000',
      change: '+18.7%',
      trend: 'up',
      icon: Sparkles,
      color: 'text-purple-600',
      bgGradient: 'from-purple-500 to-pink-600'
    }
  ];

  // Mock payment cards
  const mockPaymentCards: PaymentCard[] = [
    {
      id: '1',
      title: 'Monthly Rent',
      amount: 450000,
      status: 'pending',
      dueDate: '2024-01-15',
      type: 'rent',
      property: 'Luxury 3BR Apartment - GRA Phase 2',
      lastPaid: '2023-12-15'
    },
    {
      id: '2',
      title: 'Electricity Bill',
      amount: 25000,
      status: 'overdue',
      dueDate: '2024-01-10',
      type: 'utilities',
      property: 'Luxury 3BR Apartment - GRA Phase 2'
    },
    {
      id: '3',
      title: 'Water Bill',
      amount: 15000,
      status: 'paid',
      dueDate: '2024-01-08',
      type: 'utilities',
      property: 'Luxury 3BR Apartment - GRA Phase 2',
      lastPaid: '2024-01-08'
    },
    {
      id: '4',
      title: 'Maintenance Fee',
      amount: 35000,
      status: 'pending',
      dueDate: '2024-01-20',
      type: 'maintenance',
      property: 'Luxury 3BR Apartment - GRA Phase 2'
    }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setPaymentCards(mockPaymentCards);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'rent': return CreditCard;
      case 'utilities': return Zap;
      case 'maintenance': return Settings;
      case 'deposit': return Shield;
      default: return DollarSign;
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleQuickPay = (cardId: string) => {
    const card = paymentCards.find(c => c.id === cardId);
    if (card) {
      // Navigate to payment with pre-filled data
      const paymentUrl = `/tenant-portal?tab=payments&amount=${card.amount}&description=${encodeURIComponent(card.title)}`;
      window.location.href = paymentUrl;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-7xl">
          
          {/* Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-2">
                  Payment Dashboard
                </h1>
                <p className="text-lg text-gray-600">
                  Welcome back, {currentUser.user_metadata?.full_name || 'User'}! 
                  <span className="ml-2 text-blue-600 font-medium">Manage your payments with ease</span>
                </p>
              </div>
              
              <div className="flex items-center gap-3 mt-4 lg:mt-0">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                </Button>
                <Button 
                  onClick={() => setShowQuickPay(true)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Quick Pay
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {quickStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="group cursor-pointer"
                >
                  <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.bgGradient} shadow-lg`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className={`flex items-center gap-1 text-sm font-medium ${
                          stat.trend === 'up' ? 'text-emerald-600' : 
                          stat.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          <ArrowUpRight className={`w-4 h-4 ${stat.trend === 'down' ? 'rotate-90' : ''}`} />
                          {stat.change}
                        </div>
                      </div>
                      <div>
                        <p className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
                          {stat.value}
                        </p>
                        <p className="text-sm text-gray-600 font-medium">
                          {stat.label}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Payment Cards Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Payment Cards
              </h2>
              <Button 
                variant="outline"
                className="border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                <Eye className="w-4 h-4 mr-2" />
                View All
              </Button>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-gray-200 rounded mb-4"></div>
                      <div className="h-8 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AnimatePresence>
                  {paymentCards.map((card, index) => {
                    const TypeIcon = getTypeIcon(card.type);
                    const isSelected = selectedCard === card.id;
                    
                    return (
                      <motion.div
                        key={card.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02, y: -4 }}
                        onClick={() => setSelectedCard(isSelected ? null : card.id)}
                        className="group cursor-pointer"
                      >
                        <Card className={`relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 ${
                          isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                        } ${
                          card.status === 'overdue' ? 'bg-gradient-to-br from-red-50 to-pink-50' :
                          card.status === 'paid' ? 'bg-gradient-to-br from-emerald-50 to-teal-50' :
                          'bg-gradient-to-br from-white to-blue-50'
                        }`}>
                          
                          {/* Status Indicator */}
                          <div className={`absolute top-0 left-0 w-full h-1 ${
                            card.status === 'paid' ? 'bg-gradient-to-r from-emerald-500 to-teal-500' :
                            card.status === 'overdue' ? 'bg-gradient-to-r from-red-500 to-pink-500' :
                            'bg-gradient-to-r from-amber-500 to-orange-500'
                          }`} />
                          
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className={`p-3 rounded-xl shadow-lg ${
                                  card.status === 'paid' ? 'bg-gradient-to-br from-emerald-500 to-teal-600' :
                                  card.status === 'overdue' ? 'bg-gradient-to-br from-red-500 to-pink-600' :
                                  'bg-gradient-to-br from-blue-500 to-indigo-600'
                                }`}>
                                  <TypeIcon className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                  <h3 className="font-bold text-lg text-gray-900">
                                    {card.title}
                                  </h3>
                                  <p className="text-sm text-gray-600">
                                    {card.property}
                                  </p>
                                </div>
                              </div>
                              
                              <Badge className={`${getStatusColor(card.status)} border font-medium`}>
                                {card.status.toUpperCase()}
                              </Badge>
                            </div>

                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-3xl font-bold text-gray-900">
                                  {formatAmount(card.amount)}
                                </span>
                                <div className="text-right">
                                  <p className="text-sm text-gray-600">Due Date</p>
                                  <p className="font-semibold text-gray-900">
                                    {new Date(card.dueDate).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>

                              {card.lastPaid && (
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Calendar className="w-4 h-4" />
                                  Last paid: {new Date(card.lastPaid).toLocaleDateString()}
                                </div>
                              )}

                              <div className="flex gap-2 pt-2">
                                {card.status !== 'paid' && (
                                  <Button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleQuickPay(card.id);
                                    }}
                                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                                  >
                                    <Zap className="w-4 h-4 mr-2" />
                                    Pay Now
                                  </Button>
                                )}
                                
                                <Button 
                                  variant="outline"
                                  onClick={(e) => e.stopPropagation()}
                                  className="border-gray-200 text-gray-700 hover:bg-gray-50"
                                >
                                  <Download className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </motion.div>

          {/* Payment Analytics Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12"
          >
            <div className="mb-6">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Payment Analytics
              </h2>
              <p className="text-gray-600 mt-1">
                Insights and trends for your payment history
              </p>
            </div>
            <PaymentAnalytics />
          </motion.div>

        </div>
      </main>

      {/* Quick Pay Modal */}
      <Dialog open={showQuickPay} onOpenChange={setShowQuickPay}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-600" />
              Quick Pay
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₦)</Label>
              <Input
                id="amount"
                placeholder="Enter amount"
                type="number"
                className="text-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="What is this payment for?"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                onClick={() => setShowQuickPay(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setShowQuickPay(false);
                  window.location.href = '/tenant-portal?tab=payments';
                }}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <Zap className="w-4 h-4 mr-2" />
                Pay Now
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default PaymentDashboard;
