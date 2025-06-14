
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Users, FileText, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';

interface Stats {
  totalApplications: number;
  pendingReview: number;
  approved: number;
  rejected: number;
  needsInfo: number;
  documentsReviewed: number;
  refereeContacted: number;
}

const AdminStats = () => {
  const [stats, setStats] = useState<Stats>({
    totalApplications: 0,
    pendingReview: 0,
    approved: 0,
    rejected: 0,
    needsInfo: 0,
    documentsReviewed: 0,
    refereeContacted: 0,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('agent_applications')
        .select('status');

      if (error) throw error;

      const statusCounts = data.reduce((acc: any, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
      }, {});

      setStats({
        totalApplications: data.length,
        pendingReview: statusCounts.pending_review || 0,
        approved: statusCounts.approved || 0,
        rejected: statusCounts.rejected || 0,
        needsInfo: statusCounts.needs_info || 0,
        documentsReviewed: statusCounts.documents_reviewed || 0,
        refereeContacted: statusCounts.referee_contacted || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast({
        title: "Error",
        description: "Failed to load statistics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Applications',
      value: stats.totalApplications,
      icon: FileText,
      color: 'bg-blue-100 text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Pending Review',
      value: stats.pendingReview,
      icon: Clock,
      color: 'bg-yellow-100 text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Approved',
      value: stats.approved,
      icon: CheckCircle,
      color: 'bg-green-100 text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Rejected',
      value: stats.rejected,
      icon: XCircle,
      color: 'bg-red-100 text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Needs Info',
      value: stats.needsInfo,
      icon: AlertCircle,
      color: 'bg-orange-100 text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Documents Reviewed',
      value: stats.documentsReviewed,
      icon: FileText,
      color: 'bg-purple-100 text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pulse-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title} className={`p-6 ${stat.bgColor}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">Applications Requiring Attention</h4>
            <p className="text-sm text-gray-600 mb-3">
              {stats.pendingReview + stats.needsInfo} applications need review
            </p>
            <div className="text-sm space-y-1">
              <p>• {stats.pendingReview} pending initial review</p>
              <p>• {stats.needsInfo} need additional information</p>
            </div>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">Processing Pipeline</h4>
            <p className="text-sm text-gray-600 mb-3">
              {stats.documentsReviewed + stats.refereeContacted} in progress
            </p>
            <div className="text-sm space-y-1">
              <p>• {stats.documentsReviewed} documents reviewed</p>
              <p>• {stats.refereeContacted} referee contacted</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminStats;
