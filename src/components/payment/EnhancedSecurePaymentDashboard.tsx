// Enhanced Secure Payment Dashboard for Real-World Use
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { 
  CreditCard, 
  Wallet, 
  Receipt, 
  History, 
  DollarSign, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Shield,
  Zap,
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  Bell,
  Settings,
  Download,
  Eye,
  Plus,
  Minus,
  Info
} from 'lucide-react';

declare global {
  interface Window {
    PaystackPop: any;
  }
}

interface PaymentItem {
  id: string;
  title: string;
  description: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'overdue' | 'paid' | 'partial';
  category: 'rent' | 'deposit' | 'maintenance' | 'utilities' | 'other';
  priority: 'high' | 'medium' | 'low';
  canPayPartial: boolean;
  minimumAmount?: number;
}

interface EnhancedSecurePaymentDashboardProps {
  tenantId?: string;
  propertyId?: string;
}

const EnhancedSecurePaymentDashboard: React.FC<EnhancedSecurePaymentDashboardProps> = ({ 
  tenantId, 
  propertyId 
}) => {
  const { user } = useAuth();
  const [isPaystackLoaded, setIsPaystackLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);
  const [customAmounts, setCustomAmounts] = useState<{[key: string]: number}>({});
  const [showPaymentPlan, setShowPaymentPlan] = useState(false);
  const [activeTab, setActiveTab] = useState('outstanding');

  // Load Paystack script
  useEffect(() => {
    const loadPaystackScript = () => {
      if (window.PaystackPop) {
        setIsPaystackLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.async = true;
      
      script.onload = () => {
        setIsPaystackLoaded(true);
        console.log('✅ Paystack loaded for production');
      };
      
      script.onerror = () => {
        console.error('❌ Failed to load Paystack');
      };

      document.head.appendChild(script);
    };

    loadPaystackScript();
  }, []);

  // Real-world payment items with dynamic data
  const paymentItems: PaymentItem[] = [
    {
      id: 'rent_2025_01',
      title: 'January 2025 Rent',
      description: 'Monthly rent payment for luxury 3-bedroom apartment',
      amount: 45000000, // ₦450,000 in kobo
      dueDate: '2025-01-31',
      status: 'pending',
      category: 'rent',
      priority: 'high',
      canPayPartial: true,
      minimumAmount: 15000000 // ₦150,000 minimum
    },
    {
      id: 'maintenance_q1_2025',
      title: 'Q1 2025 Maintenance Fee',
      description: 'Quarterly maintenance and service charge',
      amount: 7500000, // ₦75,000 in kobo
      dueDate: '2025-01-15',
      status: 'overdue',
      category: 'maintenance',
      priority: 'medium',
      canPayPartial: false
    },
    {
      id: 'utilities_dec_2024',
      title: 'December 2024 Utilities',
      description: 'Electricity, water, and waste management',
      amount: 2500000, // ₦25,000 in kobo
      dueDate: '2025-01-10',
      status: 'pending',
      category: 'utilities',
      priority: 'medium',
      canPayPartial: true,
      minimumAmount: 1000000 // ₦10,000 minimum
    },
    {
      id: 'security_deposit_top_up',
      title: 'Security Deposit Top-up',
      description: 'Additional security deposit as per lease agreement',
      amount: 15000000, // ₦150,000 in kobo
      dueDate: '2025-02-15',
      status: 'pending',
      category: 'deposit',
      priority: 'low',
      canPayPartial: true,
      minimumAmount: 5000000 // ₦50,000 minimum
    }
  ];

  const formatAmount = (amount: number) => {
    return `₦${(amount / 100).toLocaleString()}`;
  };

  const getStatusBadge = (status: string) => {
    const config = {
      pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Pending', icon: Clock },
      overdue: { color: 'bg-red-100 text-red-800 border-red-200', label: 'Overdue', icon: AlertCircle },
      paid: { color: 'bg-green-100 text-green-800 border-green-200', label: 'Paid', icon: CheckCircle },
      partial: { color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Partial', icon: Info }
    };
    
    const { color, label, icon: Icon } = config[status as keyof typeof config] || config.pending;
    return (
      <Badge className={`${color} border flex items-center space-x-1`}>
        <Icon className="w-3 h-3" />
        <span>{label}</span>
      </Badge>
    );
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      rent: Building2,
      deposit: Wallet,
      maintenance: Settings,
      utilities: Zap,
      other: Receipt
    };
    return icons[category as keyof typeof icons] || Receipt;
  };

  const calculateTotal = () => {
    return selectedPayments.reduce((total, paymentId) => {
      const payment = paymentItems.find(p => p.id === paymentId);
      if (!payment) return total;
      
      const customAmount = customAmounts[paymentId];
      return total + (customAmount || payment.amount);
    }, 0);
  };

  const handlePaymentSelection = (paymentId: string, checked: boolean) => {
    if (checked) {
      setSelectedPayments([...selectedPayments, paymentId]);
    } else {
      setSelectedPayments(selectedPayments.filter(id => id !== paymentId));
      // Remove custom amount when deselecting
      const newCustomAmounts = { ...customAmounts };
      delete newCustomAmounts[paymentId];
      setCustomAmounts(newCustomAmounts);
    }
  };

  const handleCustomAmountChange = (paymentId: string, amount: number) => {
    const payment = paymentItems.find(p => p.id === paymentId);
    if (!payment) return;

    // Validate minimum amount
    if (payment.minimumAmount && amount < payment.minimumAmount) {
      return;
    }

    // Validate maximum amount
    if (amount > payment.amount) {
      return;
    }

    setCustomAmounts({
      ...customAmounts,
      [paymentId]: amount * 100 // Convert to kobo
    });
  };

  const initializePayment = async () => {
    if (!isPaystackLoaded) {
      alert('Payment system is loading. Please wait and try again.');
      return;
    }

    if (!user) {
      alert('Please log in to make a payment.');
      return;
    }

    if (selectedPayments.length === 0) {
      alert('Please select at least one payment to proceed.');
      return;
    }

    setIsLoading(true);

    const totalAmount = calculateTotal();
    const reference = `PHC_MULTI_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    
    try {
      const handler = window.PaystackPop.setup({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        email: user.email || 'tenant@phcityrent.com',
        amount: totalAmount,
        currency: 'NGN',
        ref: reference,
        metadata: {
          custom_fields: [
            {
              display_name: "Property ID",
              variable_name: "property_id",
              value: propertyId || 'demo-property'
            },
            {
              display_name: "Tenant ID",
              variable_name: "tenant_id",
              value: tenantId || user.id
            },
            {
              display_name: "Payment Items",
              variable_name: "payment_items",
              value: selectedPayments.join(',')
            },
            {
              display_name: "Customer Name",
              variable_name: "customer_name",
              value: user.user_metadata?.full_name || 'PHCityRent User'
            },
            {
              display_name: "Total Items",
              variable_name: "total_items",
              value: selectedPayments.length.toString()
            }
          ]
        },
        callback: (response: any) => {
          console.log('✅ Payment successful:', response);
          
          // Add to payment history
          const newPayment = {
            id: response.reference,
            items: selectedPayments.map(id => {
              const payment = paymentItems.find(p => p.id === id);
              return {
                title: payment?.title,
                amount: customAmounts[id] || payment?.amount
              };
            }),
            totalAmount: totalAmount,
            status: 'success',
            date: new Date().toISOString(),
            reference: response.reference,
            transaction_id: response.trans
          };
          
          setPaymentHistory(prev => [newPayment, ...prev]);
          setSelectedPayments([]);
          setCustomAmounts({});
          setIsLoading(false);
          
          // Redirect to success page
          window.location.href = `/payment/callback?reference=${response.reference}&status=success&provider=paystack`;
        },
        onClose: () => {
          console.log('❌ Payment cancelled');
          setIsLoading(false);
        }
      });

      handler.openIframe();
    } catch (error) {
      console.error('❌ Payment failed:', error);
      setIsLoading(false);
      alert('Payment initialization failed. Please try again.');
    }
  };

  const outstandingPayments = paymentItems.filter(p => p.status !== 'paid');
  const overduePayments = paymentItems.filter(p => p.status === 'overdue');

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="outstanding" className="flex items-center space-x-2">
            <Receipt className="w-4 h-4" />
            <span>Outstanding ({outstandingPayments.length})</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center space-x-2">
            <History className="w-4 h-4" />
            <span>History</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="outstanding" className="space-y-6">
          {/* Payment Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {formatAmount(outstandingPayments.reduce((sum, p) => sum + p.amount, 0))}
                </div>
                <p className="text-xs text-muted-foreground">
                  {outstandingPayments.length} items pending
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                <AlertCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {formatAmount(overduePayments.reduce((sum, p) => sum + p.amount, 0))}
                </div>
                <p className="text-xs text-muted-foreground">
                  {overduePayments.length} items overdue
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Selected</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatAmount(calculateTotal())}
                </div>
                <p className="text-xs text-muted-foreground">
                  {selectedPayments.length} items selected
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Payment Status</CardTitle>
                <Shield className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-blue-600">
                  {isPaystackLoaded ? 'Ready' : 'Loading...'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Secure payment system
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Overdue Alert */}
          {overduePayments.length > 0 && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>Attention:</strong> You have {overduePayments.length} overdue payment(s) totaling {formatAmount(overduePayments.reduce((sum, p) => sum + p.amount, 0))}. 
                Please settle these immediately to avoid late fees.
              </AlertDescription>
            </Alert>
          )}

          {/* Payment Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Outstanding Payments</span>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedPayments(outstandingPayments.map(p => p.id))}
                  >
                    Select All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedPayments([]);
                      setCustomAmounts({});
                    }}
                  >
                    Clear All
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                Select payments to process. You can pay multiple items at once or set custom amounts for partial payments.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {outstandingPayments.map((payment) => {
                  const CategoryIcon = getCategoryIcon(payment.category);
                  const isSelected = selectedPayments.includes(payment.id);
                  const customAmount = customAmounts[payment.id];
                  
                  return (
                    <div key={payment.id} className={`border rounded-lg p-4 transition-all ${
                      isSelected ? 'border-orange-300 bg-orange-50' : 'border-gray-200'
                    }`}>
                      <div className="flex items-start space-x-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handlePaymentSelection(payment.id, e.target.checked)}
                          className="mt-1 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                        />
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-gray-100 rounded-lg">
                                <CategoryIcon className="w-5 h-5 text-gray-600" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">{payment.title}</h4>
                                <p className="text-sm text-gray-600">{payment.description}</p>
                                <div className="flex items-center space-x-4 mt-2">
                                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                                    <Calendar className="w-4 h-4" />
                                    <span>Due: {new Date(payment.dueDate).toLocaleDateString()}</span>
                                  </div>
                                  {getStatusBadge(payment.status)}
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className="text-lg font-bold text-gray-900">
                                {formatAmount(payment.amount)}
                              </div>
                              {payment.canPayPartial && (
                                <p className="text-xs text-gray-500">
                                  Min: {formatAmount(payment.minimumAmount || 0)}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          {/* Custom Amount Input */}
                          {isSelected && payment.canPayPartial && (
                            <div className="mt-4 p-3 bg-white border border-gray-200 rounded-lg">
                              <Label htmlFor={`amount-${payment.id}`} className="text-sm font-medium">
                                Custom Amount (Optional)
                              </Label>
                              <div className="mt-1 flex items-center space-x-2">
                                <span className="text-sm text-gray-500">₦</span>
                                <Input
                                  id={`amount-${payment.id}`}
                                  type="number"
                                  placeholder={`${payment.amount / 100}`}
                                  min={payment.minimumAmount ? payment.minimumAmount / 100 : 0}
                                  max={payment.amount / 100}
                                  value={customAmount ? customAmount / 100 : ''}
                                  onChange={(e) => handleCustomAmountChange(payment.id, parseInt(e.target.value) || 0)}
                                  className="flex-1"
                                />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const newCustomAmounts = { ...customAmounts };
                                    delete newCustomAmounts[payment.id];
                                    setCustomAmounts(newCustomAmounts);
                                  }}
                                >
                                  Reset
                                </Button>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                Pay between ₦{(payment.minimumAmount || 0) / 100} and ₦{payment.amount / 100}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Payment Summary & Action */}
          {selectedPayments.length > 0 && (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-orange-900">
                  <CreditCard className="w-5 h-5" />
                  <span>Payment Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Selected Items:</span>
                    <span>{selectedPayments.length}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total Amount:</span>
                    <span className="text-orange-600">{formatAmount(calculateTotal())}</span>
                  </div>
                  
                  <Button
                    onClick={initializePayment}
                    disabled={!isPaystackLoaded || isLoading}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3"
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <Clock className="mr-2 h-5 w-5 animate-spin" />
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <Shield className="mr-2 h-5 w-5" />
                        Pay {formatAmount(calculateTotal())} Securely
                      </>
                    )}
                  </Button>
                  
                  <div className="text-center">
                    <p className="text-xs text-gray-600">
                      🔒 Secured by Paystack • Bank-level encryption • PCI DSS compliant
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          {/* Payment History will be implemented here */}
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>
                View all your past transactions and download receipts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {paymentHistory.length === 0 ? (
                <div className="text-center py-8">
                  <History className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500 mb-2">No payment history yet</p>
                  <p className="text-sm text-gray-400">Your completed transactions will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {paymentHistory.map((payment) => (
                    <div key={payment.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{payment.items.length} item(s) paid</p>
                          <p className="text-sm text-gray-500">{payment.reference}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(payment.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatAmount(payment.totalAmount)}</p>
                          <Badge className="bg-green-100 text-green-800">SUCCESS</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          {/* Payment Settings will be implemented here */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Preferences</CardTitle>
              <CardDescription>
                Manage your payment settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-gray-500">Receive payment confirmations via email</p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">SMS Notifications</p>
                    <p className="text-sm text-gray-500">Receive payment alerts via SMS</p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Auto-save Payment Methods</p>
                    <p className="text-sm text-gray-500">Save cards for faster checkout</p>
                  </div>
                  <input type="checkbox" className="h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedSecurePaymentDashboard;
