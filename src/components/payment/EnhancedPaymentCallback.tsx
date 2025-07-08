// Enhanced Payment Callback with Real-World UX
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  ChevronDown,
  ArrowRight,
  Shield,
  Bell,
  Copy,
  ExternalLink
} from 'lucide-react';
import { paymentService } from '@/services/paymentService';
import { 
  downloadPDFReceipt, 
  downloadImageReceipt, 
  downloadJPEGReceipt,
  downloadHTMLReceipt,
  printReceipt, 
  shareReceipt, 
  ReceiptData 
} from '@/utils/receiptGenerator';
import PaymentReceipt from '@/components/payment/PaymentReceipt';

interface EnhancedPaymentCallbackProps {
  reference: string;
  provider: string;
  status: string;
}

const EnhancedPaymentCallback: React.FC<EnhancedPaymentCallbackProps> = ({
  reference,
  provider,
  status
}) => {
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'failed' | 'error'>('loading');
  const [verificationData, setVerificationData] = useState<any>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [hasVerified, setHasVerified] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (!reference || hasVerified) {
      if (!reference) setVerificationStatus('error');
      return;
    }

    const verifyTransaction = async () => {
      try {
        setVerificationStatus('loading');
        
        // Check if this is a test reference
        if (reference.startsWith('PHC_TEST_') || reference.startsWith('PHC_DEMO_') || reference.startsWith('PHC_MULTI_')) {
          // Mock successful verification for test references
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
            currency: 'NGN',
            authorization: {
              last4: '1234',
              bank: 'Test Bank',
              card_type: 'visa'
            }
          };
          
          setVerificationStatus('success');
          setVerificationData(mockData);
          setHasVerified(true);
          return;
        }

        // For real payments, use the actual verification
        const result = await paymentService.verifyPayment(reference, provider as any);
        
        if (result.success && result.data.status === 'success') {
          setVerificationStatus('success');
          setVerificationData(result.data);
        } else {
          setVerificationStatus('failed');
          setVerificationData(result.data);
        }
        setHasVerified(true);
      } catch (error) {
        console.error('Payment verification failed:', error);
        setVerificationStatus('error');
        setHasVerified(true);
      }
    };

    const timer = setTimeout(verifyTransaction, 1500);
    return () => clearTimeout(timer);
  }, [reference, provider]);

  const getReceiptData = (): ReceiptData => {
    const amount = verificationData?.amount || 45000000;
    const customerName = verificationData?.customer?.first_name && verificationData?.customer?.last_name 
      ? `${verificationData.customer.first_name} ${verificationData.customer.last_name}`
      : 'PHCityRent User';
    
    return {
      reference: reference || 'PHC_UNKNOWN',
      amount: amount,
      status: verificationStatus,
      provider: provider,
      date: verificationData?.paid_at || new Date().toISOString(),
      customer: {
        name: customerName,
        email: verificationData?.customer?.email || 'user@phcityrent.com',
        phone: '+234-801-234-5678'
      },
      property: {
        title: 'Luxury 3-Bedroom Apartment',
        location: 'GRA Phase 2, Port Harcourt, Nigeria'
      },
      paymentType: 'MONTHLY RENT',
      fees: verificationData?.fees || Math.floor(amount * 0.05),
      channel: verificationData?.channel || 'card',
      transactionId: verificationData?.id || reference || ''
    };
  };

  const handleDownloadPDF = async () => {
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
  };

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

  const handleCopyReference = async () => {
    try {
      await navigator.clipboard.writeText(reference);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy reference:', error);
    }
  };

  const getStatusIcon = () => {
    switch (verificationStatus) {
      case 'loading':
        return <RefreshCw className="w-20 h-20 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-20 h-20 text-green-500" />;
      case 'failed':
        return <XCircle className="w-20 h-20 text-red-500" />;
      case 'error':
        return <XCircle className="w-20 h-20 text-red-500" />;
      default:
        return <Clock className="w-20 h-20 text-gray-500" />;
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

  const statusMessage = getStatusMessage();

  if (verificationStatus === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <RefreshCw className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-spin" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifying Payment...</h1>
            <p className="text-gray-600 mb-4">
              Please wait while we confirm your payment with {provider}.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
              <p className="text-sm text-blue-800">
                <strong>Reference:</strong> {reference}
              </p>
              <p className="text-sm text-blue-800">
                <strong>Provider:</strong> {provider}
              </p>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${
      verificationStatus === 'success' 
        ? 'bg-gradient-to-br from-green-50 to-emerald-100' 
        : 'bg-gradient-to-br from-red-50 to-rose-100'
    }`}>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Main Status Card */}
          <Card className={`text-center ${
            verificationStatus === 'success' ? 'border-green-200' : 'border-red-200'
          }`}>
            <CardContent className="pt-8 pb-8">
              <div className="flex justify-center mb-6">
                {getStatusIcon()}
              </div>
              
              <h1 className={`text-3xl font-bold mb-2 ${statusMessage.color}`}>
                {statusMessage.title}
              </h1>
              
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {statusMessage.description}
              </p>

              {/* Transaction Reference */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6 max-w-md mx-auto">
                <p className="text-sm text-gray-500 mb-2">Transaction Reference</p>
                <div className="flex items-center justify-center space-x-2">
                  <p className="font-mono text-lg font-semibold text-gray-900">{reference}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyReference}
                    className="h-8 w-8 p-0"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                {copySuccess && (
                  <p className="text-xs text-green-600 mt-1">Copied to clipboard!</p>
                )}
              </div>

              {/* Action Buttons */}
              {verificationStatus === 'success' && (
                <div className="flex flex-wrap justify-center gap-3 mb-6">
                  <Button 
                    onClick={() => setShowReceipt(!showReceipt)}
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>{showReceipt ? 'Hide Receipt' : 'View Receipt'}</span>
                  </Button>
                  
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
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    onClick={() => navigate('/tenant-portal?tab=payments')}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white flex items-center space-x-2"
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span>Continue to Dashboard</span>
                  </Button>
                </div>
              )}

              {/* Failed Payment Actions */}
              {verificationStatus === 'failed' && (
                <div className="flex flex-wrap justify-center gap-3">
                  <Button 
                    onClick={() => navigate('/tenant-portal?tab=payments')}
                    className="bg-orange-500 hover:bg-orange-600 text-white flex items-center space-x-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Try Again</span>
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => window.open('mailto:support@phcityrent.com', '_blank')}
                    className="flex items-center space-x-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Contact Support</span>
                  </Button>
                </div>
              )}
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

          {/* Payment Details */}
          {verificationStatus === 'success' && verificationData && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5" />
                  <span>Transaction Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Building className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Amount Paid</p>
                        <p className="font-semibold text-lg text-green-600">
                          ₦{(verificationData.amount / 100).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Shield className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Payment Method</p>
                        <p className="font-semibold">
                          {verificationData.authorization?.card_type?.toUpperCase()} 
                          {verificationData.authorization?.last4 && ` •••• ${verificationData.authorization.last4}`}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Transaction Date</p>
                        <p className="font-semibold">
                          {new Date(verificationData.paid_at || Date.now()).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Customer</p>
                        <p className="font-semibold">
                          {verificationData.customer?.first_name} {verificationData.customer?.last_name}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Receipt className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Transaction Fee</p>
                        <p className="font-semibold">
                          ₦{((verificationData.fees || 0) / 100).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <Badge className="bg-green-100 text-green-800">
                          SUCCESSFUL
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security Notice */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Shield className="w-6 h-6 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900 mb-1">Secure Transaction</p>
                  <p className="text-blue-700 text-sm">
                    This transaction was processed securely through {provider}. Your payment information 
                    is protected with bank-level encryption and industry-standard security measures.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EnhancedPaymentCallback;
