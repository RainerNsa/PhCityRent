
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Users, Clock, CheckCircle, XCircle } from 'lucide-react';

const ApplicationAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
    averageProcessingTime: 0,
    statusDistribution: [],
    monthlyTrends: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Fetch basic statistics
      const { data: applications, error } = await supabase
        .from('agent_applications')
        .select('*');

      if (error) throw error;

      const total = applications?.length || 0;
      const pending = applications?.filter(app => app.status === 'pending_review').length || 0;
      const approved = applications?.filter(app => app.status === 'approved').length || 0;
      const rejected = applications?.filter(app => app.status === 'rejected').length || 0;

      // Calculate status distribution
      const statusDistribution = [
        { name: 'Pending', value: pending, color: '#fbbf24' },
        { name: 'Approved', value: approved, color: '#10b981' },
        { name: 'Rejected', value: rejected, color: '#ef4444' },
        { name: 'Under Review', value: total - pending - approved - rejected, color: '#6366f1' }
      ];

      // Calculate average processing time (mock data for now)
      const avgProcessingTime = 3.5; // days

      // Generate monthly trends (mock data)
      const monthlyTrends = [
        { month: 'Jan', applications: 45, approved: 38, rejected: 5 },
        { month: 'Feb', applications: 52, approved: 44, rejected: 6 },
        { month: 'Mar', applications: 48, approved: 41, rejected: 4 },
        { month: 'Apr', applications: 61, approved: 52, rejected: 7 },
        { month: 'May', applications: 58, approved: 49, rejected: 6 },
        { month: 'Jun', applications: total, approved: approved, rejected: rejected }
      ];

      setAnalytics({
        totalApplications: total,
        pendingApplications: pending,
        approvedApplications: approved,
        rejectedApplications: rejected,
        averageProcessingTime: avgProcessingTime,
        statusDistribution,
        monthlyTrends
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const approvalRate = analytics.totalApplications > 0 
    ? Math.round((analytics.approvedApplications / analytics.totalApplications) * 100) 
    : 0;

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalApplications}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvalRate}%</div>
            <p className="text-xs text-muted-foreground">
              +2% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Processing Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.averageProcessingTime} days</div>
            <p className="text-xs text-muted-foreground">
              -0.5 days from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.pendingApplications}</div>
            <p className="text-xs text-muted-foreground">
              Requires attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Application Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Application Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="applications" fill="#8884d8" name="Total Applications" />
                <Bar dataKey="approved" fill="#82ca9d" name="Approved" />
                <Bar dataKey="rejected" fill="#ff7c7c" name="Rejected" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApplicationAnalytics;
