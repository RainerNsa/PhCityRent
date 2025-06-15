
import React from 'react';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts';
import { CalendarDays, TrendingUp, Clock, Users } from 'lucide-react';

interface EnhancedAnalyticsChartsProps {
  data: {
    statusDistribution: Array<{ name: string; value: number; color: string }>;
    monthlyTrends: Array<{ month: string; applications: number; approved: number; rejected: number }>;
    processingTimes: Array<{ stage: string; averageDays: number }>;
    geographicDistribution: Array<{ area: string; count: number }>;
  };
  isLoading: boolean;
}

const EnhancedAnalyticsCharts = ({ data, isLoading }: EnhancedAnalyticsChartsProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-64 bg-gray-200 rounded"></div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Distribution and Monthly Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold">Application Status Distribution</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
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

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold">Monthly Application Trends</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data.monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="applications" stroke="#8884d8" name="Total Applications" />
              <Line type="monotone" dataKey="approved" stroke="#82ca9d" name="Approved" />
              <Line type="monotone" dataKey="rejected" stroke="#ff7c7c" name="Rejected" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Processing Times and Geographic Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-orange-600" />
            <h3 className="font-semibold">Average Processing Times</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.processingTimes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="stage" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} days`, 'Average Days']} />
              <Bar dataKey="averageDays" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibent">Geographic Distribution</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.geographicDistribution} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="area" type="category" width={80} />
              <Tooltip />
              <Bar dataKey="count" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedAnalyticsCharts;
