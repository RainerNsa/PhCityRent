
import React from 'react';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface ChartData {
  statusDistribution: Array<{ name: string; value: number; color: string }>;
  monthlyTrends: Array<{ month: string; applications: number; approved: number; rejected: number }>;
  topAreas: Array<{ area: string; count: number }>;
  processingTimes: Array<{ status: string; avgDays: number }>;
}

interface AnalyticsChartsProps {
  data: ChartData;
  isLoading: boolean;
}

const AnalyticsCharts = ({ data, isLoading }: AnalyticsChartsProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-64 bg-gray-100 rounded"></div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Row Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Application Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.statusDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.statusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Processing Times */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Average Processing Times</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.processingTimes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} days`, 'Processing Time']} />
              <Bar dataKey="avgDays" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Monthly Trends */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Monthly Application Trends</h3>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={data.monthlyTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="applications" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Total Applications" />
            <Area type="monotone" dataKey="approved" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Approved" />
            <Area type="monotone" dataKey="rejected" stackId="3" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} name="Rejected" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Top Operating Areas */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Top Operating Areas</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.topAreas} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="area" type="category" width={100} />
            <Tooltip />
            <Bar dataKey="count" fill="#6366f1" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default AnalyticsCharts;
