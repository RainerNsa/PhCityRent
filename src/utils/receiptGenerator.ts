// Receipt Generator Utility with PDF and Image support
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export interface ReceiptData {
  reference: string;
  amount: number;
  status: string;
  provider: string;
  date: string;
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  property?: {
    title?: string;
    location?: string;
  };
  paymentType?: string;
  fees?: number;
  channel?: string;
  transactionId?: string;
}

export const generateReceiptHTML = (data: ReceiptData): string => {
  const formatAmount = (amount: number) => `₦${(amount / 100).toLocaleString()}`;
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-NG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Africa/Lagos'
    });
  };

  const getProviderLogo = (provider: string) => {
    const logos = {
      paystack: '💳',
      flutterwave: '🦋',
      monnify: '🏦',
      remita: '💰'
    };
    return logos[provider as keyof typeof logos] || '💳';
  };

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PHCityRent Payment Receipt - ${data.reference}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8f9fa;
            padding: 20px;
        }
        
        .receipt-container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #f97316 0%, #dc2626 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        .header p {
            opacity: 0.9;
            font-size: 16px;
        }
        
        .status-badge {
            display: inline-block;
            background: #10b981;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            margin-top: 15px;
        }
        
        .content {
            padding: 30px;
        }
        
        .amount-section {
            text-align: center;
            margin-bottom: 30px;
            padding: 20px;
            background: #f0fdf4;
            border-radius: 8px;
            border: 2px solid #10b981;
        }
        
        .amount {
            font-size: 36px;
            font-weight: bold;
            color: #10b981;
            margin-bottom: 5px;
        }
        
        .amount-label {
            color: #6b7280;
            font-size: 16px;
        }
        
        .date {
            color: #6b7280;
            font-size: 14px;
            margin-top: 5px;
        }
        
        .section {
            margin-bottom: 25px;
        }
        
        .section-title {
            font-size: 18px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 2px solid #e5e7eb;
        }
        
        .details-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }
        
        .detail-item {
            margin-bottom: 12px;
        }
        
        .detail-label {
            font-size: 12px;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 3px;
        }
        
        .detail-value {
            font-weight: 600;
            color: #1f2937;
        }
        
        .reference {
            font-family: 'Courier New', monospace;
            background: #f3f4f6;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 13px;
        }
        
        .provider {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .provider-logo {
            font-size: 18px;
        }
        
        .channel-badge {
            background: #e5e7eb;
            color: #374151;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: bold;
        }
        
        .footer {
            background: #f9fafb;
            padding: 20px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
        
        .footer-title {
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 5px;
        }
        
        .footer-subtitle {
            color: #6b7280;
            font-size: 12px;
            margin-bottom: 15px;
        }
        
        .contact-info {
            display: flex;
            justify-content: center;
            gap: 20px;
            font-size: 11px;
            color: #6b7280;
            flex-wrap: wrap;
        }
        
        .security-notice {
            background: #eff6ff;
            border: 1px solid #bfdbfe;
            border-radius: 6px;
            padding: 12px;
            margin-top: 20px;
            text-align: center;
            font-size: 11px;
            color: #1e40af;
        }
        
        @media (max-width: 600px) {
            .details-grid {
                grid-template-columns: 1fr;
            }
            
            .contact-info {
                flex-direction: column;
                gap: 8px;
            }
            
            .amount {
                font-size: 28px;
            }
        }
        
        @media print {
            body {
                background: white;
                padding: 0;
            }
            
            .receipt-container {
                box-shadow: none;
                border: 1px solid #ddd;
            }
        }
    </style>
</head>
<body>
    <div class="receipt-container">
        <div class="header">
            <h1>PHCityRent</h1>
            <p>Payment Receipt</p>
            <div class="status-badge">✓ ${data.status.toUpperCase()}</div>
        </div>
        
        <div class="content">
            <div class="amount-section">
                <div class="amount">${formatAmount(data.amount)}</div>
                <div class="amount-label">Payment Successful</div>
                <div class="date">${formatDate(data.date)}</div>
            </div>
            
            <div class="section">
                <div class="section-title">Transaction Details</div>
                <div class="details-grid">
                    <div>
                        <div class="detail-item">
                            <div class="detail-label">Reference Number</div>
                            <div class="detail-value reference">${data.reference}</div>
                        </div>
                        
                        <div class="detail-item">
                            <div class="detail-label">Payment Method</div>
                            <div class="detail-value provider">
                                <span class="provider-logo">${getProviderLogo(data.provider)}</span>
                                <span>${data.provider.charAt(0).toUpperCase() + data.provider.slice(1)}</span>
                                ${data.channel ? `<span class="channel-badge">${data.channel.toUpperCase()}</span>` : ''}
                            </div>
                        </div>
                        
                        <div class="detail-item">
                            <div class="detail-label">Payment Type</div>
                            <div class="detail-value">${data.paymentType || 'Rent Payment'}</div>
                        </div>
                    </div>
                    
                    <div>
                        <div class="detail-item">
                            <div class="detail-label">Amount</div>
                            <div class="detail-value">${formatAmount(data.amount)}</div>
                        </div>
                        
                        ${data.fees ? `
                        <div class="detail-item">
                            <div class="detail-label">Transaction Fee</div>
                            <div class="detail-value">${formatAmount(data.fees)}</div>
                        </div>
                        ` : ''}
                        
                        ${data.transactionId ? `
                        <div class="detail-item">
                            <div class="detail-label">Transaction ID</div>
                            <div class="detail-value reference">${data.transactionId}</div>
                        </div>
                        ` : ''}
                    </div>
                </div>
            </div>
            
            ${data.customer ? `
            <div class="section">
                <div class="section-title">Customer Information</div>
                <div class="details-grid">
                    <div>
                        ${data.customer.name ? `
                        <div class="detail-item">
                            <div class="detail-label">Full Name</div>
                            <div class="detail-value">${data.customer.name}</div>
                        </div>
                        ` : ''}
                        
                        ${data.customer.email ? `
                        <div class="detail-item">
                            <div class="detail-label">Email Address</div>
                            <div class="detail-value">${data.customer.email}</div>
                        </div>
                        ` : ''}
                    </div>
                    
                    <div>
                        ${data.customer.phone ? `
                        <div class="detail-item">
                            <div class="detail-label">Phone Number</div>
                            <div class="detail-value">${data.customer.phone}</div>
                        </div>
                        ` : ''}
                    </div>
                </div>
            </div>
            ` : ''}
            
            ${data.property ? `
            <div class="section">
                <div class="section-title">Property Information</div>
                <div class="details-grid">
                    <div>
                        ${data.property.title ? `
                        <div class="detail-item">
                            <div class="detail-label">Property</div>
                            <div class="detail-value">${data.property.title}</div>
                        </div>
                        ` : ''}
                    </div>
                    
                    <div>
                        ${data.property.location ? `
                        <div class="detail-item">
                            <div class="detail-label">Location</div>
                            <div class="detail-value">${data.property.location}</div>
                        </div>
                        ` : ''}
                    </div>
                </div>
            </div>
            ` : ''}
        </div>
        
        <div class="footer">
            <div class="footer-title">Thank you for your payment!</div>
            <div class="footer-subtitle">This receipt serves as proof of payment for your transaction.</div>
            
            <div class="contact-info">
                <div>📞 +234-801-234-5678</div>
                <div>✉️ support@phcityrent.com</div>
                <div>📍 Port Harcourt, Nigeria</div>
            </div>
            
            <div class="security-notice">
                🔒 This transaction was processed securely through ${data.provider}. 
                Your payment information is protected with bank-level security.
            </div>
        </div>
    </div>
</body>
</html>`;
};

export const downloadHTMLReceipt = (data: ReceiptData) => {
  const htmlContent = generateReceiptHTML(data);
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `PHCityRent_Receipt_${data.reference}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

export const printReceipt = (data: ReceiptData) => {
  const htmlContent = generateReceiptHTML(data);
  const printWindow = window.open('', '_blank');
  
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    
    // Wait for content to load then print
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }
};

export const shareReceipt = async (data: ReceiptData) => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: `PHCityRent Payment Receipt - ${data.reference}`,
        text: `Payment of ${(data.amount / 100).toLocaleString()} NGN was successful. Reference: ${data.reference}`,
        url: window.location.href
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  } else {
    // Fallback: copy to clipboard
    const shareText = `PHCityRent Payment Receipt\nAmount: ₦${(data.amount / 100).toLocaleString()}\nReference: ${data.reference}\nStatus: ${data.status.toUpperCase()}`;

    try {
      await navigator.clipboard.writeText(shareText);
      alert('Receipt details copied to clipboard!');
    } catch (error) {
      console.log('Error copying to clipboard:', error);
    }
  }
};

// Create a temporary DOM element with the receipt HTML for rendering
const createReceiptElement = (data: ReceiptData): HTMLElement => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = generateReceiptHTML(data);
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  tempDiv.style.top = '-9999px';
  tempDiv.style.width = '800px'; // Fixed width for consistent rendering
  tempDiv.style.backgroundColor = 'white';
  document.body.appendChild(tempDiv);
  return tempDiv;
};

// Generate PDF receipt
export const downloadPDFReceipt = async (data: ReceiptData) => {
  try {
    // Create temporary element
    const element = createReceiptElement(data);

    // Wait for fonts and images to load
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate canvas from HTML
    const canvas = await html2canvas(element, {
      scale: 2, // Higher resolution
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 800,
      height: element.scrollHeight
    });

    // Remove temporary element
    document.body.removeChild(element);

    // Create PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Calculate dimensions to fit A4
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pdfWidth - 20; // 10mm margin on each side
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Add image to PDF
    if (imgHeight <= pdfHeight - 20) {
      // Fits on one page
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
    } else {
      // Multiple pages needed
      let remainingHeight = imgHeight;
      let yPosition = 0;

      while (remainingHeight > 0) {
        const pageHeight = Math.min(remainingHeight, pdfHeight - 20);

        pdf.addImage(
          imgData,
          'PNG',
          10,
          10,
          imgWidth,
          imgHeight,
          undefined,
          'FAST',
          0,
          -yPosition
        );

        remainingHeight -= pageHeight;
        yPosition += pageHeight;

        if (remainingHeight > 0) {
          pdf.addPage();
        }
      }
    }

    // Download PDF
    pdf.save(`PHCityRent_Receipt_${data.reference}.pdf`);

  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Error generating PDF. Please try again.');
  }
};

// Generate PNG image receipt
export const downloadImageReceipt = async (data: ReceiptData) => {
  try {
    // Create temporary element
    const element = createReceiptElement(data);

    // Wait for fonts and images to load
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate canvas from HTML
    const canvas = await html2canvas(element, {
      scale: 3, // Higher resolution for image
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 800,
      height: element.scrollHeight
    });

    // Remove temporary element
    document.body.removeChild(element);

    // Convert to blob and download
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `PHCityRent_Receipt_${data.reference}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    }, 'image/png', 1.0);

  } catch (error) {
    console.error('Error generating image:', error);
    alert('Error generating image. Please try again.');
  }
};

// Generate JPEG image receipt (smaller file size)
export const downloadJPEGReceipt = async (data: ReceiptData) => {
  try {
    // Create temporary element
    const element = createReceiptElement(data);

    // Wait for fonts and images to load
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate canvas from HTML
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 800,
      height: element.scrollHeight
    });

    // Remove temporary element
    document.body.removeChild(element);

    // Convert to blob and download
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `PHCityRent_Receipt_${data.reference}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    }, 'image/jpeg', 0.95);

  } catch (error) {
    console.error('Error generating JPEG:', error);
    alert('Error generating JPEG. Please try again.');
  }
};
