
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Award, 
  Clock, 
  CheckCircle, 
  TrendingUp, 
  Calendar as CalendarIcon,
  Download 
} from 'lucide-react';
import { format } from 'date-fns';

interface AdminMetrics {
  applications_reviewed: number;
  average_review_time_hours: number;
  approval_rate: number;
}

interface AdminPerformanceData {
  admin_id: string;
  admin_name: string;
  metrics: AdminMetrics;
  total_actions: number;
  efficiency_score: number;
}

const AdminPerformanceTracker = () => {
  const [performanceData, setPerformanceData] = useState<AdminPerformanceData[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPerformanceData = async (date: Date) => {
    setLoading(true);
    try {
      // Get all admins
      const { data: adminUsers, error: adminError } = await supabase
        .from('user_roles')
        .select('user_id, profiles(full_name)')
        .in('role', ['admin', 'super_admin']);

      if (adminError) throw adminError;

      const performancePromises = adminUsers.map(async (admin) => {
        // Calculate metrics for each admin
        const { data: metrics, error: metricsError } = await supabase
          .rpc('calculate_admin_metrics', {
            admin_user_id: admin.user_id,
            metric_date: format(date, 'yyyy-MM-dd')
          });

        if (metricsError) {
          console.error('Error fetching metrics for admin:', admin.user_id, metricsError);
          return null;
        }

        const adminMetrics = metrics[0] || {
          applications_reviewed: 0,
          average_review_time_hours: 0,
          approval_rate: 0
        };

        // Calculate efficiency score (custom metric)
        const efficiency_score = Math.min(100, 
          (adminMetrics.applications_reviewed * 10) + 
          Math.max(0, 100 - (adminMetrics.average_review_time_hours * 5)) +
          (adminMetrics.approval_rate * 0.5)
        );

        return {
          admin_id: admin.user_id,
          admin_name: admin.profiles?.full_name || 'Unknown Admin',
          metrics: adminMetrics,
          total_actions: adminMetrics.applications_reviewed,
          efficiency_score: Math.round(efficiency_score)
        };
      });

      const results = await Promise.all(performancePromises);
      setPerformanceData(results.filter(Boolean) as AdminPerformanceData[]);
    } catch (error) {
      console.error('Error fetching performance data:', error);
      toast({
        title: "Error",
        description: "Failed to load performance data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerformanceData(selectedDate);
  }, [selectedDate]);

  const getPerformanceBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
    if (score >= 60) return <Badge className="bg-blue-100 text-blue-800">Good</Badge>;
    if (score >= 40) return <Badge className="bg-yellow-100 text-yellow-800">Average</Badge>;
    return <Badge className="bg-red-100 text-red-800">Needs Improvement</Badge>;
  };

  const exportPerformanceReport = async () => {
    const csvContent = [
      'Admin Name,Applications Reviewed,Avg Review Time (hrs),Approval Rate (%),Efficiency Score',
      ...performanceData.map(admin => 
        `${admin.admin_name},${admin.metrics.applications_reviewed},${admin.metrics.average_review_time_hours},${admin.metrics.approval_rate},${admin.efficiency_score}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `admin-performance-${format(selectedDate, 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6 text-yellow-500" />
            <h3 className="text-lg font-semibold">Admin Performance Tracker</h3>
          </div>
          
          <div className="flex items-center gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  {format(selectedDate, 'MMM dd, yyyy')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            
            <Button onClick={exportPerformanceReport} size="sm" variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {performanceData.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              No performance data available for selected date
            </div>
          ) : (
            performanceData.map((admin) => (
              <div key={admin.admin_id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-pulse-100 p-2 rounded-lg">
                      <Award className="w-5 h-5 text-pulse-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{admin.admin_name}</h4>
                      <p className="text-sm text-gray-600">Efficiency Score: {admin.efficiency_score}/100</p>
                    </div>
                  </div>
                  {getPerformanceBadge(admin.efficiency_score)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <div>
                      <p className="text-sm font-medium">{admin.metrics.applications_reviewed}</p>
                      <p className="text-xs text-gray-600">Applications Reviewed</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">{admin.metrics.average_review_time_hours}h</p>
                      <p className="text-xs text-gray-600">Avg Review Time</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-purple-500" />
                    <div>
                      <p className="text-sm font-medium">{admin.metrics.approval_rate}%</p>
                      <p className="text-xs text-gray-600">Approval Rate</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-orange-500" />
                    <div>
                      <p className="text-sm font-medium">{admin.total_actions}</p>
                      <p className="text-xs text-gray-600">Total Actions</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default AdminPerformanceTracker;
