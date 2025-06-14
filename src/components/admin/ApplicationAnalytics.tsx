
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts';
import { TrendingUp, Clock, CheckCircle, Users, Calendar } from 'lucide-react';

interface AnalyticsData {
  statusDistribution: Array<{ name: string; value: number; color: string }>;
  monthlyTrends: Array<{ month: string; applications: number; approved: number }>;
  processingTimes: Array<{ status: string; avgDays: number }>;
  topAreas: Array<{ area: string; count: number }>;
}

const ApplicationAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    statusDistribution: [],
    monthlyTrends: [],
    processingTimes: [],
    topAreas: []
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data: applications, error } = await supabase
        .from('agent_applications')
        .select('*');

      if (error) throw error;

      // Process analytics data
      const statusCounts = applications.reduce((acc: any, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
      }, {});

      const statusDistribution = Object.entries(statusCounts).map(([status, count]) => ({
        name: status.replace('_', ' ').toUpperCase(),
        value: count as number,
        color: getStatusColor(status)
      }));

      // Monthly trends (simplified)
      const monthlyData = applications.reduce((acc: any, app) => {
        const month = new Date(app.created_at).toLocaleString('default', { month: 'short' });
        if (!acc[month]) {
          acc[month] = { applications: 0, approved: 0 };
        }
        acc[month].applications++;
        if (app.status === 'approved') {
          acc[month].approved++;
        }
        return acc;
      }, {});

      const monthlyTrends = Object.entries(monthlyData).map(([month, data]: [string, any]) => ({
        month,
        applications: data.applications,
        approved: data.approved
      }));

      // Top operating areas
      const areaCount: any = {};
      applications.forEach(app => {
        app.operating_areas?.forEach((area: string) => {
          areaCount[area] = (areaCount[area] || 0) + 1;
        });
      });

      const topAreas = Object.entries(areaCount)
        .sort(([,a], [,b]) => (b as number) - (a as number))
        .slice(0, 5)
        .map(([area, count]) => ({ area, count: count as number }));

      setAnalytics({
        statusDistribution,
        monthlyTrends,
        processingTimes: [], // Would need more complex calculation
        topAreas
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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pulse-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Applications</p>
              <p className="text-2xl font-bold">
                {analytics.statusDistribution.reduce((sum, item) => sum + item.value, 0)}
              </p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">
                {analytics.statusDistribution.find(s => s.name === 'APPROVED')?.value || 0}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {analytics.statusDistribution.find(s => s.name === 'PENDING REVIEW')?.value || 0}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-purple-600">
                {analytics.monthlyTrends[analytics.monthlyTrends.length - 1]?.applications || 0}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Application Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.statusDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {analytics.statusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Monthly Trends */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Monthly Application Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="applications" stroke="#3b82f6" name="Total Applications" />
              <Line type="monotone" dataKey="approved" stroke="#10b981" name="Approved" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Top Operating Areas */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Top Operating Areas</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analytics.topAreas}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="area" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default ApplicationAnalytics;
