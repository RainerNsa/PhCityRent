
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AnalyticsMetrics from './analytics/AnalyticsMetrics';
import AnalyticsCharts from './analytics/AnalyticsCharts';
import AgentPerformanceAnalytics from './analytics/AgentPerformanceAnalytics';
import AnalyticsExport from './analytics/AnalyticsExport';
import { supabase } from '@/integrations/supabase/client';

const ApplicationAnalytics = () => {
  const [metricsData, setMetricsData] = useState({
    totalApplications: 0,
    approved: 0,
    pending: 0,
    thisMonth: 0,
    approvalRate: 0,
    avgProcessingDays: 0,
  });

  const [chartData, setChartData] = useState({
    statusDistribution: [],
    monthlyTrends: [],
    topAreas: [],
    processingTimes: [],
  });

  const [agentData, setAgentData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      // Fetch basic metrics
      const { data: applications } = await supabase
        .from('agent_applications')
        .select('*');

      if (applications) {
        const approved = applications.filter(app => app.status === 'approved').length;
        const pending = applications.filter(app => app.status === 'pending_review').length;
        const thisMonth = applications.filter(app => 
          new Date(app.created_at).getMonth() === new Date().getMonth()
        ).length;

        setMetricsData({
          totalApplications: applications.length,
          approved,
          pending,
          thisMonth,
          approvalRate: applications.length > 0 ? Math.round((approved / applications.length) * 100) : 0,
          avgProcessingDays: 5, // Mock data for now
        });

        // Process chart data
        const statusDistribution = [
          { name: 'Approved', value: approved, color: '#10b981' },
          { name: 'Pending', value: pending, color: '#f59e0b' },
          { name: 'Rejected', value: applications.filter(app => app.status === 'rejected').length, color: '#ef4444' },
        ];

        setChartData({
          statusDistribution,
          monthlyTrends: [], // Mock data
          topAreas: [], // Mock data
          processingTimes: [], // Mock data
        });
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();

    // Set up real-time updates
    const channel = supabase
      .channel('analytics-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'agent_applications'
        },
        () => {
          fetchAnalytics();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <AnalyticsExport />
      </div>

      <AnalyticsMetrics data={metricsData} isLoading={isLoading} />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="agents">Agent Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <AnalyticsCharts data={chartData} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="agents" className="space-y-4">
          <AgentPerformanceAnalytics isLoading={isLoading} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApplicationAnalytics;
