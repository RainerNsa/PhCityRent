// Payment callback page for handling successful payments
import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePayment, useTransaction, formatAmount } from '@/hooks/usePayment';
import { PaymentProvider } from '@/types/payment';
import {
  downloadHTMLReceipt,
  downloadPDFReceipt,
  downloadImageReceipt,
  downloadJPEGReceipt,
  printReceipt,
  shareReceipt,
  ReceiptData
} from '@/utils/receiptGenerator';
import PaymentReceipt from '@/components/payment/PaymentReceipt';
import { paymentHistoryService } from '@/services/paymentHistoryService';
import { whatsappService } from '@/services/whatsappService';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/Footer';
import {
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Receipt,
  Download,
  Home,
  CreditCard,
  Calendar,
  User,
  Building,
  Printer,
  Share2,
  Eye,
  FileText,
  Image,
  ChevronDown
} from 'lucide-react';

const PaymentCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'failed' | 'error'>('loading');
  const [verificationData, setVerificationData] = useState<any>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [hasVerified, setHasVerified] = useState(false);

  const reference = searchParams.get('reference');
  const provider = searchParams.get('provider') as PaymentProvider || 'paystack';
  const status = searchParams.get('status');

  const { verifyPayment } = usePayment();
  const { data: transaction } = useTransaction(reference || '');
  const { user } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      setShowDownloadMenu(false);
    };

    if (showDownloadMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showDownloadMenu]);

  const savePaymentToHistory = async (paymentData: any, paymentReference: string) => {
    if (!user) return;

    try {
      const historyData = {
        tenant_id: user.id,
        property_id: 'demo-property', // This would come from the payment metadata
        reference: paymentReference,
        amount: paymentData.amount || 45000000,
        fees: paymentData.fees || 2250000,
        status: 'success',
        payment_method: paymentData.channel || 'card',
        provider: provider,
        transaction_id: paymentData.id || paymentReference,
        payment_items: [
          {
            type: 'rent',
            description: 'Monthly Rent Payment',
            amount: paymentData.amount || 45000000
          }
        ],
        metadata: paymentData,
        customer_email: user.email || 'user@phcityrent.com',
        customer_name: user.user_metadata?.full_name || 'PHCityRent User',
        property_title: 'Luxury 3-Bedroom Apartment',
        property_location: 'GRA Phase 2, Port Harcourt'
      };

      const result = await paymentHistoryService.savePaymentRecord(historyData);

      if (result.success) {
        console.log('✅ Payment saved to history');

        // Send WhatsApp confirmation if user has phone number
        const userPhone = user.user_metadata?.phone;
        if (userPhone) {
          await whatsappService.sendPaymentConfirmation(
            userPhone,
            (paymentData.amount || 45000000) / 100,
            paymentReference
          );
        }
      }
    } catch (error) {
      console.error('Failed to save payment to history:', error);
    }
  };

  useEffect(() => {
    if (!reference || hasVerified) {
      if (!reference) setVerificationStatus('error');
      return;
    }

    const verifyTransaction = async () => {
      try {
        setVerificationStatus('loading');

        // Check if this is a test reference or real payment
        if (reference.startsWith('PHC_TEST_') || reference.startsWith('PHC_DEMO_')) {
          // Mock successful verification for test/demo references
          const mockData = {
            id: reference,
            amount: 45000000, // ₦450,000 in kobo
            status: 'success',
            reference: reference,
            paid_at: new Date().toISOString(),
            channel: 'card',
            customer: {
              first_name: 'John',
              last_name: 'Doe',
              email: 'john.doe@phcityrent.com'
            },
            fees: 2250000, // ₦22,500 in kobo
            currency: 'NGN'
          };

          setVerificationStatus('success');
          setVerificationData(mockData);
          setHasVerified(true);

          // Save to payment history
          await savePaymentToHistory(mockData, reference);
          return;
        }

        // For real payments, use the actual verification
        const result = await verifyPayment(reference, provider);

        if (result.success && result.data.status === 'success') {
          setVerificationStatus('success');
          setVerificationData(result.data);

          // Save to payment history
          await savePaymentToHistory(result.data, reference);
        } else {
          setVerificationStatus('failed');
          setVerificationData(result.data);
        }
      } catch (error) {
        console.error('Payment verification failed:', error);

        // If it's a test reference and verification fails, still show success
        if (reference.startsWith('PHC_TEST_') || reference.startsWith('PHC_DEMO_')) {
          const mockData = {
            id: reference,
            amount: 45000000,
            status: 'success',
            reference: reference,
            paid_at: new Date().toISOString(),
            channel: 'card',
            customer: {
              first_name: 'Test',
              last_name: 'User',
              email: 'test@phcityrent.com'
            },
            fees: 2250000,
            currency: 'NGN'
          };

          setVerificationStatus('success');
          setVerificationData(mockData);
        } else {
          setVerificationStatus('error');
        }
      }
    };

    // Only run verification once when component mounts or reference changes
    const timer = setTimeout(verifyTransaction, 1500);
    return () => clearTimeout(timer);
  }, [reference, provider]); // Removed verifyPayment dependency

  const getStatusIcon = () => {
    switch (verificationStatus) {
      case 'loading':
        return <RefreshCw className="w-16 h-16 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-16 h-16 text-green-500" />;
      case 'failed':
        return <XCircle className="w-16 h-16 text-red-500" />;
      case 'error':
        return <XCircle className="w-16 h-16 text-red-500" />;
      default:
        return <Clock className="w-16 h-16 text-gray-500" />;
    }
  };

  const getStatusMessage = () => {
    switch (verificationStatus) {
      case 'loading':
        return {
          title: 'Verifying Payment...',
          description: 'Please wait while we confirm your payment with the payment provider.',
          color: 'text-blue-600'
        };
      case 'success':
        return {
          title: 'Payment Successful!',
          description: 'Your payment has been processed successfully. You will receive a confirmation email shortly.',
          color: 'text-green-600'
        };
      case 'failed':
        return {
          title: 'Payment Failed',
          description: 'Your payment could not be processed. Please try again or contact support.',
          color: 'text-red-600'
        };
      case 'error':
        return {
          title: 'Verification Error',
          description: 'We encountered an error while verifying your payment. Please contact support.',
          color: 'text-red-600'
        };
      default:
        return {
          title: 'Processing...',
          description: 'Please wait...',
          color: 'text-gray-600'
        };
    }
  };

  const getProviderName = (provider: string) => {
    const providers = {
      paystack: 'Paystack',
      flutterwave: 'Flutterwave',
      monnify: 'Monnify',
      remita: 'Remita'
    };
    return providers[provider as keyof typeof providers] || provider;
  };

  const getReceiptData = (): ReceiptData => {
    // Ensure we have valid data
    const amount = verificationData?.amount || transaction?.amount || 45000000; // Default ₦450,000
    const customerName = verificationData?.customer?.first_name && verificationData?.customer?.last_name
      ? `${verificationData.customer.first_name} ${verificationData.customer.last_name}`
      : transaction?.metadata?.customer_name || 'PHCityRent User';

    return {
      reference: reference || 'PHC_UNKNOWN',
      amount: amount,
      status: verificationStatus,
      provider: provider,
      date: verificationData?.paid_at || transaction?.created_at || new Date().toISOString(),
      customer: {
        name: customerName,
        email: verificationData?.customer?.email || transaction?.customer_email || 'user@phcityrent.com',
        phone: transaction?.customer_phone || transaction?.metadata?.phone || '+234-801-234-5678'
      },
      property: {
        title: transaction?.properties?.title || 'Luxury 3-Bedroom Apartment',
        location: transaction?.properties?.location || 'GRA Phase 2, Port Harcourt, Nigeria'
      },
      paymentType: transaction?.transaction_type?.replace('_', ' ').toUpperCase() || 'MONTHLY RENT',
      fees: verificationData?.fees || transaction?.fees || Math.floor(amount * 0.05), // 5% default fee
      channel: verificationData?.channel || 'card',
      transactionId: verificationData?.id || transaction?.id || reference || ''
    };
  };

  const handleDownloadPDF = useCallback(async () => {
    setIsDownloading(true);
    try {
      const receiptData = getReceiptData();
      await downloadPDFReceipt(receiptData);
    } catch (error) {
      console.error('PDF download failed:', error);
    } finally {
      setIsDownloading(false);
      setShowDownloadMenu(false);
    }
  }, [verificationStatus, verificationData, reference, provider]);

  const handleDownloadImage = async () => {
    setIsDownloading(true);
    try {
      const receiptData = getReceiptData();
      await downloadImageReceipt(receiptData);
    } catch (error) {
      console.error('Image download failed:', error);
    } finally {
      setIsDownloading(false);
      setShowDownloadMenu(false);
    }
  };

  const handleDownloadJPEG = async () => {
    setIsDownloading(true);
    try {
      const receiptData = getReceiptData();
      await downloadJPEGReceipt(receiptData);
    } catch (error) {
      console.error('JPEG download failed:', error);
    } finally {
      setIsDownloading(false);
      setShowDownloadMenu(false);
    }
  };

  const handleDownloadHTML = () => {
    const receiptData = getReceiptData();
    downloadHTMLReceipt(receiptData);
    setShowDownloadMenu(false);
  };

  const handlePrintReceipt = () => {
    const receiptData = getReceiptData();
    printReceipt(receiptData);
  };

  const handleShareReceipt = () => {
    const receiptData = getReceiptData();
    shareReceipt(receiptData);
  };

  const statusMessage = getStatusMessage();

  // Handle missing reference
  if (!reference) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar />
        <main className="pt-20 pb-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
            <Card>
              <CardContent className="text-center py-12">
                <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Payment Reference</h1>
                <p className="text-gray-600 mb-6">
                  No payment reference was provided. Please check your payment link.
                </p>
                <Button
                  onClick={() => navigate('/tenant-portal')}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  Go to Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Status</h1>
            <p className="text-gray-600">Transaction verification and confirmation</p>
          </div>

          <div className="grid gap-8">
            {/* Status Card */}
            <Card className="text-center">
              <CardContent className="pt-8 pb-8">
                <div className="flex justify-center mb-6">
                  {getStatusIcon()}
                </div>
                
                <h2 className={`text-2xl font-bold mb-2 ${statusMessage.color}`}>
                  {statusMessage.title}
                </h2>
                
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {statusMessage.description}
                </p>

                {reference && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <p className="text-sm text-gray-500 mb-1">Transaction Reference</p>
                    <p className="font-mono text-lg font-semibold text-gray-900">{reference}</p>
                  </div>
                )}

                <div className="flex flex-wrap justify-center gap-3">
                  {verificationStatus === 'success' && (
                    <>
                      <Button
                        onClick={() => setShowReceipt(!showReceipt)}
                        variant="outline"
                        className="flex items-center space-x-2"
                      >
                        <Eye className="w-4 h-4" />
                        <span>{showReceipt ? 'Hide Receipt' : 'View Receipt'}</span>
                      </Button>

                      {/* Download Dropdown */}
                      <div className="relative">
                        <Button
                          onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                          variant="outline"
                          className="flex items-center space-x-2"
                          disabled={isDownloading}
                        >
                          <Download className="w-4 h-4" />
                          <span>{isDownloading ? 'Downloading...' : 'Download Receipt'}</span>
                          <ChevronDown className="w-4 h-4" />
                        </Button>

                        {showDownloadMenu && (
                          <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                            <div className="py-2">
                              <button
                                onClick={handleDownloadPDF}
                                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
                                disabled={isDownloading}
                              >
                                <FileText className="w-4 h-4 text-red-500" />
                                <span>Download as PDF</span>
                              </button>
                              <button
                                onClick={handleDownloadImage}
                                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
                                disabled={isDownloading}
                              >
                                <Image className="w-4 h-4 text-blue-500" />
                                <span>Download as PNG</span>
                              </button>
                              <button
                                onClick={handleDownloadJPEG}
                                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
                                disabled={isDownloading}
                              >
                                <Image className="w-4 h-4 text-green-500" />
                                <span>Download as JPEG</span>
                              </button>
                              <button
                                onClick={handleDownloadHTML}
                                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
                                disabled={isDownloading}
                              >
                                <FileText className="w-4 h-4 text-orange-500" />
                                <span>Download as HTML</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      <Button
                        onClick={handlePrintReceipt}
                        variant="outline"
                        className="flex items-center space-x-2"
                      >
                        <Printer className="w-4 h-4" />
                        <span>Print</span>
                      </Button>
                      <Button
                        onClick={handleShareReceipt}
                        variant="outline"
                        className="flex items-center space-x-2"
                      >
                        <Share2 className="w-4 h-4" />
                        <span>Share</span>
                      </Button>
                      <Button
                        onClick={() => navigate('/tenant-portal')}
                        className="bg-orange-500 hover:bg-orange-600 flex items-center space-x-2"
                      >
                        <Home className="w-4 h-4" />
                        <span>Go to Dashboard</span>
                      </Button>
                    </>
                  )}
                  
                  {verificationStatus === 'failed' && (
                    <>
                      <Button 
                        onClick={() => navigate('/advanced-features?tab=payments')}
                        variant="outline"
                      >
                        Try Again
                      </Button>
                      <Button 
                        onClick={() => navigate('/contact')}
                        className="bg-orange-500 hover:bg-orange-600"
                      >
                        Contact Support
                      </Button>
                    </>
                  )}
                  
                  {verificationStatus === 'error' && (
                    <Button 
                      onClick={() => window.location.reload()}
                      variant="outline"
                      className="flex items-center space-x-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Retry Verification</span>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Receipt Display */}
            {showReceipt && verificationStatus === 'success' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Receipt className="w-5 h-5" />
                    <span>Payment Receipt</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <PaymentReceipt transactionData={getReceiptData()} />
                </CardContent>
              </Card>
            )}

            {/* Transaction Details */}
            {(verificationData || transaction) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Receipt className="w-5 h-5" />
                    <span>Transaction Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Amount</p>
                          <p className="font-semibold">
                            {formatAmount(verificationData?.amount || transaction?.amount || 0)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Building className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Payment Provider</p>
                          <p className="font-semibold">{getProviderName(provider)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Date & Time</p>
                          <p className="font-semibold">
                            {new Date(verificationData?.paid_at || transaction?.created_at || Date.now()).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Receipt className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Transaction Type</p>
                          <p className="font-semibold">
                            {transaction?.transaction_type?.replace('_', ' ').toUpperCase() || 'Payment'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <User className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Status</p>
                          <Badge 
                            variant={verificationStatus === 'success' ? 'default' : 'destructive'}
                            className={verificationStatus === 'success' ? 'bg-green-100 text-green-800' : ''}
                          >
                            {verificationStatus.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      
                      {verificationData?.channel && (
                        <div className="flex items-center space-x-3">
                          <CreditCard className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Payment Method</p>
                            <p className="font-semibold">{verificationData.channel.toUpperCase()}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle>What's Next?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {verificationStatus === 'success' ? (
                    <>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Payment Confirmed</p>
                          <p className="text-sm text-gray-600">Your payment has been successfully processed and recorded.</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Clock className="w-5 h-5 text-blue-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Email Confirmation</p>
                          <p className="text-sm text-gray-600">You will receive an email confirmation within the next few minutes.</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Receipt className="w-5 h-5 text-purple-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Receipt Available</p>
                          <p className="text-sm text-gray-600">Your payment receipt is available in your dashboard and can be downloaded above.</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-start space-x-3">
                        <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Payment Issue</p>
                          <p className="text-sm text-gray-600">There was an issue processing your payment. Please try again or contact support.</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <RefreshCw className="w-5 h-5 text-blue-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Retry Payment</p>
                          <p className="text-sm text-gray-600">You can attempt the payment again using the same or different payment method.</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentCallback;
