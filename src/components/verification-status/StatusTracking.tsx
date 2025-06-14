
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Clock, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

interface StatusUpdate {
  id: string;
  previous_status: string;
  new_status: string;
  created_at: string;
  notes?: string;
  change_reason?: string;
}

interface StatusTrackingProps {
  applicationId: string;
}

const StatusTracking = ({ applicationId }: StatusTrackingProps) => {
  const [statusHistory, setStatusHistory] = useState<StatusUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatusHistory();
  }, [applicationId]);

  const fetchStatusHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('verification_status_log')
        .select('*')
        .eq('application_id', applicationId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStatusHistory(data || []);
    } catch (error) {
      console.error('Error fetching status history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'needs_info':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  if (loading) {
    return (
      <Card className="p-4">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Status History</h3>
      
      {statusHistory.length === 0 ? (
        <p className="text-gray-500">No status changes recorded yet.</p>
      ) : (
        <div className="space-y-4">
          {statusHistory.map((update, index) => (
            <div key={update.id} className="flex items-start gap-4 pb-4 border-b last:border-b-0">
              <div className="flex items-center gap-2 mt-1">
                {getStatusIcon(update.new_status)}
                <ArrowRight className="w-3 h-3 text-gray-400" />
              </div>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(update.new_status)}>
                    {update.new_status.replace('_', ' ').toUpperCase()}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {new Date(update.created_at).toLocaleString()}
                  </span>
                </div>
                
                {update.change_reason && (
                  <p className="text-sm text-gray-700">{update.change_reason}</p>
                )}
                
                {update.notes && (
                  <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                    {update.notes}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default StatusTracking;
