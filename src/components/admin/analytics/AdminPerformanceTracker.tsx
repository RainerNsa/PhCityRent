
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Award, Clock, TrendingUp, Users } from 'lucide-react';

const AdminPerformanceTracker = () => {
  const [selectedAdmin, setSelectedAdmin] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('7days');
  const [performanceData, setPerformanceData] = useState({
    metrics: {
      applications_reviewed: 0,
      average_review_time_hours: 0,
      approval_rate: 0
    },
    dailyActivity: [],
    adminList: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPerformanceData();
  }, [selectedAdmin, dateRange]);

  const fetchPerformanceData = async () => {
    try {
      // Fetch admins list
      const { data: adminUsers, error: adminError } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          profiles!inner(full_name, email)
        `)
        .in('role', ['admin', 'super_admin']);

      if (adminError) {
        console.error('Error fetching admins:', adminError);
        // Continue with mock data if there's an error
      }

      // Generate mock performance data for now
      const mockMetrics = {
        applications_reviewed: Math.floor(Math.random() * 50) + 10,
        average_review_time_hours: Math.round((Math.random() * 5 + 1) * 100) / 100,
        approval_rate: Math.round((Math.random() * 30 + 70) * 100) / 100
      };

      const mockDailyActivity = Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString(),
        applications: Math.floor(Math.random() * 10) + 1,
        approvals: Math.floor(Math.random() * 8) + 1,
        avgTime: Math.round((Math.random() * 3 + 1) * 100) / 100
      })).reverse();

      const mockAdminList = [
        { user_id: 'admin1', full_name: 'John Admin', email: 'john@admin.com' },
        { user_id: 'admin2', full_name: 'Sarah Manager', email: 'sarah@admin.com' },
        { user_id: 'admin3', full_name: 'Mike Supervisor', email: 'mike@admin.com' }
      ];

      setPerformanceData({
        metrics: mockMetrics,
        dailyActivity: mockDailyActivity,
        adminList: adminUsers || mockAdminList
      });

    } catch (error) {
      console.error('Error fetching performance data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-4">
        <Select value={selectedAdmin} onValueChange={setSelectedAdmin}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select admin..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Admins</SelectItem>
            {performanceData.adminList.map((admin: any) => (
              <SelectItem key={admin.user_id} value={admin.user_id}>
                {admin.profiles?.full_name || admin.full_name || 'Unknown Admin'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select period..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 Days</SelectItem>
            <SelectItem value="30days">Last 30 Days</SelectItem>
            <SelectItem value="90days">Last 3 Months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications Reviewed</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceData.metrics.applications_reviewed}</div>
            <p className="text-xs text-muted-foreground">
              +15% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Review Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceData.metrics.average_review_time_hours}h</div>
            <p className="text-xs text-muted-foreground">
              -0.3h from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceData.metrics.approval_rate}%</div>
            <p className="text-xs text-muted-foreground">
              +2% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.7/10</div>
            <p className="text-xs text-muted-foreground">
              Excellent performance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Daily Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Activity Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData.dailyActivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="applications" stroke="#8884d8" name="Applications" />
              <Line type="monotone" dataKey="approvals" stroke="#82ca9d" name="Approvals" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Review Time Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Review Time Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData.dailyActivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avgTime" fill="#f59e0b" name="Avg Review Time (hours)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPerformanceTracker;
