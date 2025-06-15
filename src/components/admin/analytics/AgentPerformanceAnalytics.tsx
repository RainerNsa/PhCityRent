
import React from 'react';
import { Card } from '@/components/ui/card';
import { Users, TrendingUp, Clock, Award } from 'lucide-react';

interface AgentPerformanceAnalyticsProps {
  isLoading: boolean;
}

const AgentPerformanceAnalytics = ({ isLoading }: AgentPerformanceAnalyticsProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-48 bg-gray-200 rounded"></div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Users className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold">Agent Performance Overview</h3>
        </div>
        <p className="text-gray-600">
          Detailed agent performance metrics will be available once more data is collected.
        </p>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Top Performer</p>
              <p className="text-xl font-bold">Coming Soon</p>
            </div>
            <Award className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Response Time</p>
              <p className="text-xl font-bold">--</p>
            </div>
            <Clock className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Growth Rate</p>
              <p className="text-xl font-bold">--</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AgentPerformanceAnalytics;
