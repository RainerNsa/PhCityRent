// Payment History Service for Real-Time Updates
import { supabase } from '@/integrations/supabase/client';

export interface PaymentHistoryItem {
  id: string;
  tenant_id: string;
  property_id: string;
  reference: string;
  amount: number;
  fees: number;
  status: 'success' | 'failed' | 'pending' | 'refunded';
  payment_method: string;
  provider: string;
  transaction_id: string;
  payment_items: Array<{
    type: string;
    description: string;
    amount: number;
  }>;
  metadata: any;
  created_at: string;
  updated_at: string;
  receipt_url?: string;
  customer_email: string;
  customer_name: string;
  property_title: string;
  property_location: string;
}

export interface PaymentSummary {
  total_paid: number;
  total_pending: number;
  total_failed: number;
  payment_count: number;
  last_payment_date: string;
  average_payment: number;
  preferred_method: string;
}

class PaymentHistoryService {
  async savePaymentRecord(paymentData: {
    tenant_id: string;
    property_id: string;
    reference: string;
    amount: number;
    fees: number;
    status: string;
    payment_method: string;
    provider: string;
    transaction_id: string;
    payment_items: any[];
    metadata: any;
    customer_email: string;
    customer_name: string;
    property_title: string;
    property_location: string;
  }): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('payment_history')
        .insert([{
          ...paymentData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      // Update tenant payment summary
      await this.updatePaymentSummary(paymentData.tenant_id);

      return { success: true, data };
    } catch (error) {
      console.error('Failed to save payment record:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to save payment record' 
      };
    }
  }

  async getPaymentHistory(
    tenantId: string, 
    options: {
      limit?: number;
      offset?: number;
      status?: string;
      dateFrom?: string;
      dateTo?: string;
    } = {}
  ): Promise<{ success: boolean; data?: PaymentHistoryItem[]; error?: string }> {
    try {
      let query = supabase
        .from('payment_history')
        .select(`
          *,
          properties:property_id (
            title,
            location,
            images
          )
        `)
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });

      if (options.status) {
        query = query.eq('status', options.status);
      }

      if (options.dateFrom) {
        query = query.gte('created_at', options.dateFrom);
      }

      if (options.dateTo) {
        query = query.lte('created_at', options.dateTo);
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      if (options.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) throw error;

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Failed to fetch payment history:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch payment history' 
      };
    }
  }

  async getPaymentSummary(tenantId: string): Promise<{ success: boolean; data?: PaymentSummary; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('payment_summary')
        .select('*')
        .eq('tenant_id', tenantId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (!data) {
        // Create initial summary if doesn't exist
        const initialSummary = {
          tenant_id: tenantId,
          total_paid: 0,
          total_pending: 0,
          total_failed: 0,
          payment_count: 0,
          last_payment_date: null,
          average_payment: 0,
          preferred_method: 'card',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { data: newData, error: insertError } = await supabase
          .from('payment_summary')
          .insert([initialSummary])
          .select()
          .single();

        if (insertError) throw insertError;
        return { success: true, data: newData };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Failed to fetch payment summary:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch payment summary' 
      };
    }
  }

  private async updatePaymentSummary(tenantId: string): Promise<void> {
    try {
      // Calculate summary from payment history
      const { data: payments } = await supabase
        .from('payment_history')
        .select('amount, status, payment_method, created_at')
        .eq('tenant_id', tenantId);

      if (!payments) return;

      const summary = payments.reduce((acc, payment) => {
        switch (payment.status) {
          case 'success':
            acc.total_paid += payment.amount;
            acc.payment_count += 1;
            break;
          case 'pending':
            acc.total_pending += payment.amount;
            break;
          case 'failed':
            acc.total_failed += payment.amount;
            break;
        }
        return acc;
      }, {
        total_paid: 0,
        total_pending: 0,
        total_failed: 0,
        payment_count: 0
      });

      const lastPayment = payments
        .filter(p => p.status === 'success')
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

      const methodCounts = payments.reduce((acc: any, payment) => {
        acc[payment.payment_method] = (acc[payment.payment_method] || 0) + 1;
        return acc;
      }, {});

      const preferredMethod = Object.keys(methodCounts).reduce((a, b) => 
        methodCounts[a] > methodCounts[b] ? a : b, 'card'
      );

      const summaryData = {
        ...summary,
        last_payment_date: lastPayment?.created_at || null,
        average_payment: summary.payment_count > 0 ? Math.round(summary.total_paid / summary.payment_count) : 0,
        preferred_method: preferredMethod,
        updated_at: new Date().toISOString()
      };

      await supabase
        .from('payment_summary')
        .upsert([{ tenant_id: tenantId, ...summaryData }]);

    } catch (error) {
      console.error('Failed to update payment summary:', error);
    }
  }

  async updatePaymentStatus(
    reference: string, 
    status: string, 
    transactionId?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const updateData: any = {
        status,
        updated_at: new Date().toISOString()
      };

      if (transactionId) {
        updateData.transaction_id = transactionId;
      }

      const { error } = await supabase
        .from('payment_history')
        .update(updateData)
        .eq('reference', reference);

      if (error) throw error;

      // Update summary if status changed to success
      if (status === 'success') {
        const { data: payment } = await supabase
          .from('payment_history')
          .select('tenant_id')
          .eq('reference', reference)
          .single();

        if (payment) {
          await this.updatePaymentSummary(payment.tenant_id);
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Failed to update payment status:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update payment status' 
      };
    }
  }

  async getPaymentByReference(reference: string): Promise<{ success: boolean; data?: PaymentHistoryItem; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('payment_history')
        .select(`
          *,
          properties:property_id (
            title,
            location,
            images
          )
        `)
        .eq('reference', reference)
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Failed to fetch payment by reference:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch payment' 
      };
    }
  }

  async exportPaymentHistory(
    tenantId: string, 
    format: 'csv' | 'pdf' | 'excel' = 'csv'
  ): Promise<{ success: boolean; data?: Blob; filename?: string; error?: string }> {
    try {
      const { data: payments } = await this.getPaymentHistory(tenantId, { limit: 1000 });
      
      if (!payments) {
        throw new Error('No payment data found');
      }

      switch (format) {
        case 'csv':
          return this.exportToCSV(payments);
        case 'pdf':
          return this.exportToPDF(payments);
        case 'excel':
          return this.exportToExcel(payments);
        default:
          throw new Error('Unsupported export format');
      }
    } catch (error) {
      console.error('Failed to export payment history:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to export payment history' 
      };
    }
  }

  private exportToCSV(payments: PaymentHistoryItem[]): { success: boolean; data: Blob; filename: string } {
    const headers = [
      'Date', 'Reference', 'Amount', 'Status', 'Payment Method', 
      'Property', 'Transaction ID', 'Fees'
    ];

    const csvContent = [
      headers.join(','),
      ...payments.map(payment => [
        new Date(payment.created_at).toLocaleDateString(),
        payment.reference,
        `₦${(payment.amount / 100).toLocaleString()}`,
        payment.status.toUpperCase(),
        payment.payment_method,
        payment.property_title,
        payment.transaction_id,
        `₦${(payment.fees / 100).toLocaleString()}`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const filename = `payment_history_${new Date().toISOString().split('T')[0]}.csv`;

    return { success: true, data: blob, filename };
  }

  private exportToPDF(payments: PaymentHistoryItem[]): { success: boolean; data: Blob; filename: string } {
    // This would use jsPDF to create a PDF
    // For now, return CSV format
    return this.exportToCSV(payments);
  }

  private exportToExcel(payments: PaymentHistoryItem[]): { success: boolean; data: Blob; filename: string } {
    // This would use a library like xlsx to create Excel files
    // For now, return CSV format
    return this.exportToCSV(payments);
  }
}

export const paymentHistoryService = new PaymentHistoryService();
export default PaymentHistoryService;
