
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useRealTimeUpdates } from '@/hooks/useRealTimeUpdates';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { RefreshCw, BarChart3, Users, FileDown } from 'lucide-react';
import AnalyticsMetrics from './analytics/AnalyticsMetrics';
import AnalyticsCharts from './analytics/AnalyticsCharts';
import AgentPerformanceAnalytics from './analytics/AgentPerformanceAnalytics';
import AnalyticsExport from './analytics/AnalyticsExport';

interface AnalyticsData {
  metrics: {
    totalApplications: number;
    approved: number;
    pending: number;
    thisMonth: number;
    approvalRate: number;
    avgProcessingDays: number;
  };
  charts: {
    statusDistribution: Array<{ name: string; value: number; color: string }>;
    monthlyTrends: Array<{ month: string; applications: number; approved: number; rejected: number }>;
    topAreas: Array<{ area: string; count: number }>;
    processingTimes: Array<{ status: string; avgDays: number }>;
  };
}

const ApplicationAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    metrics: {
      totalApplications: 0,
      approved: 0,
      pending: 0,
      thisMonth: 0,
      approvalRate: 0,
      avgProcessingDays: 0,
    },
    charts: {
      statusDistribution: [],
      monthlyTrends: [],
      topAreas: [],
      processingTimes: [],
    }
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  // Set up real-time updates
  const { isConnected } = useRealTimeUpdates('agent_applications', fetchAnalytics);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      if (!loading) setRefreshing(true);
      
      const { data: applications, error } = await supabase
        .from('agent_applications')
        .select('*');

      if (error) throw error;

      // Calculate metrics
      const totalApplications = applications?.length || 0;
      const approved = applications?.filter(app => app.status === 'approved').length || 0;
      const pending = applications?.filter(app => app.status === 'pending_review').length || 0;
      
      // This month's applications
      const thisMonthStart = new Date();
      thisMonthStart.setDate(1);
      thisMonthStart.setHours(0, 0, 0, 0);
      
      const thisMonth = applications?.filter(app => 
        new Date(app.created_at) >= thisMonthStart
      ).length || 0;

      const approvalRate = totalApplications > 0 ? Math.round((approved / totalApplications) * 100) : 0;

      // Calculate average processing days for approved applications
      const approvedApps = applications?.filter(app => app.status === 'approved') || [];
      const avgProcessingDays = approvedApps.length > 0 
        ? Math.round(approvedApps.reduce((sum, app) => {
            const created = new Date(app.created_at);
            const updated = new Date(app.updated_at);
            return sum + Math.ceil((updated.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
          }, 0) / approvedApps.length)
        : 0;

      // Process status distribution
      const statusCounts = applications?.reduce((acc: any, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
      }, {}) || {};

      const statusDistribution = Object.entries(statusCounts).map(([status, count]) => ({
        name: status.replace('_', ' ').toUpperCase(),
        value: count as number,
        color: getStatusColor(status)
      }));

      // Process monthly trends
      const monthlyData = applications?.reduce((acc: any, app) => {
        const month = new Date(app.created_at).toLocaleString('default', { month: 'short' });
        if (!acc[month]) {
          acc[month] = { applications: 0, approved: 0, rejected: 0 };
        }
        acc[month].applications++;
        if (app.status === 'approved') acc[month].approved++;
        if (app.status === 'rejected') acc[month].rejected++;
        return acc;
      }, {}) || {};

      const monthlyTrends = Object.entries(monthlyData).map(([month, data]: [string, any]) => ({
        month,
        applications: data.applications,
        approved: data.approved,
        rejected: data.rejected
      }));

      // Process top operating areas
      const areaCount: any = {};
      applications?.forEach(app => {
        app.operating_areas?.forEach((area: string) => {
          areaCount[area] = (areaCount[area] || 0) + 1;
        });
      });

      const topAreas = Object.entries(areaCount)
        .sort(([,a], [,b]) => (b as number) - (a as number))
        .slice(0, 8)
        .map(([area, count]) => ({ area, count: count as number }));

      // Calculate processing times by status
      const statusProcessingTimes = {
        'approved': 0,
        'pending_review': 0,
        'documents_reviewed': 0,
        'referee_contacted': 0
      };

      Object.keys(statusProcessingTimes).forEach(status => {
        const statusApps = applications?.filter(app => app.status === status) || [];
        if (statusApps.length > 0) {
          const avgDays = statusApps.reduce((sum, app) => {
            const created = new Date(app.created_at);
            const updated = new Date(app.updated_at);
            return sum + Math.ceil((updated.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
          }, 0) / statusApps.length;
          
          statusProcessingTimes[status as keyof typeof statusProcessingTimes] = Math.round(avgDays);
        }
      });

      const processingTimes = Object.entries(statusProcessingTimes).map(([status, days]) => ({
        status: status.replace('_', ' ').toUpperCase(),
        avgDays: days
      }));

      setAnalytics({
        metrics: {
          totalApplications,
          approved,
          pending,
          thisMonth,
          approvalRate,
          avgProcessingDays,
        },
        charts: {
          statusDistribution,
          monthlyTrends,
          topAreas,
          processingTimes,
        }
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      'pending_review': '#f59e0b',
      'documents_reviewed': '#3b82f6',
      'referee_contacted': '#6366f1',
      'approved': '#10b981',
      'rejected': '#ef4444',
      'needs_info': '#f97316'
    };
    return colors[status] || '#6b7280';
  };

  return (
    <div className="space-y-6">
      {/* Header with Real-time Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <div className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs ${
            isConnected ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
          }`}>
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            {isConnected ? 'Real-time Active' : 'Offline'}
          </div>
        </div>
        
        <Button 
          onClick={fetchAnalytics} 
          variant="outline" 
          size="sm"
          disabled={refreshing}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Main Analytics */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="agents" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Agent Performance
          </TabsTrigger>
          <TabsTrigger value="export" className="flex items-center gap-2">
            <FileDown className="w-4 h-4" />
            Export
          </TabsTrigger>
          <TabsTrigger value="realtime" className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Real-time
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <AnalyticsMetrics data={analytics.metrics} isLoading={loading} />
          <AnalyticsCharts data={analytics.charts} isLoading={loading} />
        </TabsContent>

        <TabsContent value="agents">
          <AgentPerformanceAnalytics />
        </TabsContent>

        <TabsContent value="export">
          <AnalyticsExport />
        </TabsContent>

        <TabsContent value="realtime" className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Real-time Updates</h3>
            <p className="text-blue-800 text-sm mb-3">
              This dashboard automatically updates when new applications are submitted or existing ones are modified.
            </p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span>Connection: {isConnected ? 'Active' : 'Disconnected'}</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                <span>Last updated: {new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
          
          <AnalyticsMetrics data={analytics.metrics} isLoading={loading} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApplicationAnalytics;
