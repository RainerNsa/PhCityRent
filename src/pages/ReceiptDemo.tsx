// Receipt Demo Page
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PaymentReceipt from '@/components/payment/PaymentReceipt';
import { 
  downloadPDFReceipt, 
  downloadImageReceipt, 
  downloadJPEGReceipt,
  downloadHTMLReceipt,
  printReceipt,
  ReceiptData 
} from '@/utils/receiptGenerator';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/Footer';
import { 
  FileText, 
  Image, 
  Download, 
  Printer, 
  Eye,
  CheckCircle
} from 'lucide-react';

const ReceiptDemo: React.FC = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showReceipt, setShowReceipt] = useState(true);

  const sampleReceiptData: ReceiptData = {
    reference: 'PHC_DEMO_' + Date.now(),
    amount: 45000000, // ₦450,000 in kobo
    status: 'success',
    provider: 'paystack',
    date: new Date().toISOString(),
    customer: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+234-801-234-5678'
    },
    property: {
      title: 'Luxury 3-Bedroom Apartment',
      location: 'GRA Phase 2, Port Harcourt'
    },
    paymentType: 'MONTHLY RENT',
    fees: 2250000, // ₦22,500 in kobo (5% fee)
    channel: 'card',
    transactionId: 'TXN_' + Math.random().toString(36).substring(2, 10).toUpperCase()
  };

  const handleDownload = async (type: 'pdf' | 'png' | 'jpeg' | 'html') => {
    setIsDownloading(true);
    try {
      switch (type) {
        case 'pdf':
          await downloadPDFReceipt(sampleReceiptData);
          break;
        case 'png':
          await downloadImageReceipt(sampleReceiptData);
          break;
        case 'jpeg':
          await downloadJPEGReceipt(sampleReceiptData);
          break;
        case 'html':
          downloadHTMLReceipt(sampleReceiptData);
          break;
      }
    } catch (error) {
      console.error(`${type.toUpperCase()} download failed:`, error);
      alert(`Error downloading ${type.toUpperCase()}. Please try again.`);
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    printReceipt(sampleReceiptData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Receipt Demo</h1>
            <p className="text-gray-600">Test the enhanced receipt system with PDF and image downloads</p>
          </div>

          {/* Demo Controls */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Receipt Download Options</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div>
                    <p className="font-medium text-green-900">Payment Successful!</p>
                    <p className="text-sm text-green-700">
                      Your receipt is ready for download in multiple formats
                    </p>
                  </div>
                  <Badge className="bg-green-500 text-white">SUCCESS</Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button
                    onClick={() => handleDownload('pdf')}
                    disabled={isDownloading}
                    className="flex flex-col items-center space-y-2 h-auto py-4 bg-red-500 hover:bg-red-600"
                  >
                    <FileText className="w-6 h-6" />
                    <span className="text-sm">Download PDF</span>
                  </Button>

                  <Button
                    onClick={() => handleDownload('png')}
                    disabled={isDownloading}
                    className="flex flex-col items-center space-y-2 h-auto py-4 bg-blue-500 hover:bg-blue-600"
                  >
                    <Image className="w-6 h-6" />
                    <span className="text-sm">Download PNG</span>
                  </Button>

                  <Button
                    onClick={() => handleDownload('jpeg')}
                    disabled={isDownloading}
                    className="flex flex-col items-center space-y-2 h-auto py-4 bg-green-500 hover:bg-green-600"
                  >
                    <Image className="w-6 h-6" />
                    <span className="text-sm">Download JPEG</span>
                  </Button>

                  <Button
                    onClick={handlePrint}
                    disabled={isDownloading}
                    className="flex flex-col items-center space-y-2 h-auto py-4 bg-purple-500 hover:bg-purple-600"
                  >
                    <Printer className="w-6 h-6" />
                    <span className="text-sm">Print Receipt</span>
                  </Button>
                </div>

                <div className="flex items-center justify-center">
                  <Button
                    onClick={() => setShowReceipt(!showReceipt)}
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>{showReceipt ? 'Hide Receipt Preview' : 'Show Receipt Preview'}</span>
                  </Button>
                </div>

                {isDownloading && (
                  <div className="text-center">
                    <div className="inline-flex items-center space-x-2 text-blue-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span>Generating receipt...</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Receipt Preview */}
          {showReceipt && (
            <Card>
              <CardHeader>
                <CardTitle>Receipt Preview</CardTitle>
                <p className="text-sm text-gray-600">
                  This is how your receipt will look when downloaded
                </p>
              </CardHeader>
              <CardContent>
                <PaymentReceipt transactionData={sampleReceiptData} />
              </CardContent>
            </Card>
          )}

          {/* Format Information */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Download Format Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <FileText className="w-5 h-5 text-red-500 mt-1" />
                    <div>
                      <h4 className="font-medium">PDF Format</h4>
                      <p className="text-sm text-gray-600">
                        Professional document format, perfect for official records and printing. 
                        Maintains exact layout and typography.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Image className="w-5 h-5 text-blue-500 mt-1" />
                    <div>
                      <h4 className="font-medium">PNG Format</h4>
                      <p className="text-sm text-gray-600">
                        High-quality image format with transparent background support. 
                        Best for sharing on social media or embedding in documents.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Image className="w-5 h-5 text-green-500 mt-1" />
                    <div>
                      <h4 className="font-medium">JPEG Format</h4>
                      <p className="text-sm text-gray-600">
                        Compressed image format with smaller file size. 
                        Good for email attachments and quick sharing.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Printer className="w-5 h-5 text-purple-500 mt-1" />
                    <div>
                      <h4 className="font-medium">Print Option</h4>
                      <p className="text-sm text-gray-600">
                        Direct printing with optimized layout for paper. 
                        Opens browser print dialog for immediate printing.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ReceiptDemo;
