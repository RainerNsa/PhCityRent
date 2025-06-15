
import React from 'react';
import { Card } from '@/components/ui/card';
import { Users, CheckCircle, Clock, Calendar, TrendingUp, AlertTriangle } from 'lucide-react';

interface MetricsData {
  totalApplications: number;
  approved: number;
  pending: number;
  thisMonth: number;
  approvalRate: number;
  avgProcessingDays: number;
}

interface AnalyticsMetricsProps {
  data: MetricsData;
  isLoading: boolean;
}

const AnalyticsMetrics = ({ data, isLoading }: AnalyticsMetricsProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="h-16 bg-gray-200 rounded"></div>
          </Card>
        ))}
      </div>
    );
  }

  const metrics = [
    {
      title: 'Total Applications',
      value: data.totalApplications,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Approved',
      value: data.approved,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Pending Review',
      value: data.pending,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'This Month',
      value: data.thisMonth,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Approval Rate',
      value: `${data.approvalRate}%`,
      icon: TrendingUp,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
    },
    {
      title: 'Avg Processing',
      value: `${data.avgProcessingDays} days`,
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {metrics.map((metric, index) => {
        const IconComponent = metric.icon;
        return (
          <Card key={index} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{metric.title}</p>
                <p className="text-2xl font-bold">{metric.value}</p>
              </div>
              <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                <IconComponent className={`w-6 h-6 ${metric.color}`} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default AnalyticsMetrics;
