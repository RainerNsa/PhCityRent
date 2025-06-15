
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Trophy, Target, Clock, Star } from 'lucide-react';

interface AgentPerformance {
  agentId: string;
  agentName: string;
  totalApplications: number;
  approvedApplications: number;
  approvalRate: number;
  avgProcessingTime: number;
  monthlyTrend: Array<{ month: string; applications: number }>;
}

const AgentPerformanceAnalytics = () => {
  const [performanceData, setPerformanceData] = useState<AgentPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const { toast } = useToast();

  useEffect(() => {
    fetchAgentPerformance();
  }, [selectedPeriod]);

  const fetchAgentPerformance = async () => {
    try {
      setLoading(true);
      
      // Calculate date range based on selected period
      const endDate = new Date();
      const startDate = new Date();
      
      switch (selectedPeriod) {
        case '1month':
          startDate.setMonth(startDate.getMonth() - 1);
          break;
        case '3months':
          startDate.setMonth(startDate.getMonth() - 3);
          break;
        case '6months':
          startDate.setMonth(startDate.getMonth() - 6);
          break;
        case '1year':
          startDate.setFullYear(startDate.getFullYear() - 1);
          break;
      }

      const { data: applications, error } = await supabase
        .from('agent_applications')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      if (error) throw error;

      // Process agent performance data
      const agentStats: { [key: string]: any } = {};

      applications?.forEach(app => {
        const agentId = app.agent_id || 'Unknown';
        if (!agentStats[agentId]) {
          agentStats[agentId] = {
            agentId,
            agentName: app.full_name || 'Unknown Agent',
            totalApplications: 0,
            approvedApplications: 0,
            processingTimes: [],
            monthlyData: {}
          };
        }

        agentStats[agentId].totalApplications++;
        if (app.status === 'approved') {
          agentStats[agentId].approvedApplications++;
        }

        // Calculate processing time if approved
        if (app.status === 'approved' && app.updated_at) {
          const created = new Date(app.created_at);
          const updated = new Date(app.updated_at);
          const daysDiff = Math.ceil((updated.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
          agentStats[agentId].processingTimes.push(daysDiff);
        }

        // Group by month for trends
        const month = new Date(app.created_at).toLocaleString('default', { month: 'short', year: '2-digit' });
        if (!agentStats[agentId].monthlyData[month]) {
          agentStats[agentId].monthlyData[month] = 0;
        }
        agentStats[agentId].monthlyData[month]++;
      });

      // Convert to final format
      const performanceArray = Object.values(agentStats).map((agent: any) => ({
        agentId: agent.agentId,
        agentName: agent.agentName,
        totalApplications: agent.totalApplications,
        approvedApplications: agent.approvedApplications,
        approvalRate: agent.totalApplications > 0 ? Math.round((agent.approvedApplications / agent.totalApplications) * 100) : 0,
        avgProcessingTime: agent.processingTimes.length > 0 
          ? Math.round(agent.processingTimes.reduce((a: number, b: number) => a + b, 0) / agent.processingTimes.length)
          : 0,
        monthlyTrend: Object.entries(agent.monthlyData).map(([month, applications]) => ({
          month,
          applications: applications as number
        }))
      })).sort((a, b) => b.totalApplications - a.totalApplications);

      setPerformanceData(performanceArray);
    } catch (error) {
      console.error('Error fetching agent performance:', error);
      toast({
        title: "Error",
        description: "Failed to load agent performance data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const topPerformers = performanceData.slice(0, 5);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-4 animate-pulse">
              <div className="h-16 bg-gray-200 rounded"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Agent Performance Analytics</h2>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1month">Last Month</SelectItem>
            <SelectItem value="3months">Last 3 Months</SelectItem>
            <SelectItem value="6months">Last 6 Months</SelectItem>
            <SelectItem value="1year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Performance Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Agents</p>
              <p className="text-2xl font-bold">{performanceData.length}</p>
            </div>
            <Trophy className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Approval Rate</p>
              <p className="text-2xl font-bold">
                {performanceData.length > 0 
                  ? Math.round(performanceData.reduce((sum, agent) => sum + agent.approvalRate, 0) / performanceData.length)
                  : 0}%
              </p>
            </div>
            <Target className="w-8 h-8 text-green-500" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Processing Time</p>
              <p className="text-2xl font-bold">
                {performanceData.length > 0 
                  ? Math.round(performanceData.reduce((sum, agent) => sum + agent.avgProcessingTime, 0) / performanceData.length)
                  : 0} days
              </p>
            </div>
            <Clock className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Top Performer</p>
              <p className="text-lg font-bold truncate">
                {topPerformers[0]?.agentName || 'N/A'}
              </p>
            </div>
            <Star className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Applications by Agent</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topPerformers}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="agentName" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="totalApplications" fill="#3b82f6" name="Total Applications" />
              <Bar dataKey="approvedApplications" fill="#10b981" name="Approved" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Approval Rates by Agent</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topPerformers}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="agentName" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}%`, 'Approval Rate']} />
              <Bar dataKey="approvalRate" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Agent Performance Table */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Detailed Agent Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Agent Name</th>
                <th className="text-left p-2">Total Applications</th>
                <th className="text-left p-2">Approved</th>
                <th className="text-left p-2">Approval Rate</th>
                <th className="text-left p-2">Avg Processing Time</th>
              </tr>
            </thead>
            <tbody>
              {performanceData.map((agent, index) => (
                <tr key={agent.agentId} className="border-b hover:bg-gray-50">
                  <td className="p-2 font-medium">{agent.agentName}</td>
                  <td className="p-2">{agent.totalApplications}</td>
                  <td className="p-2">{agent.approvedApplications}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      agent.approvalRate >= 80 ? 'bg-green-100 text-green-800' :
                      agent.approvalRate >= 60 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {agent.approvalRate}%
                    </span>
                  </td>
                  <td className="p-2">{agent.avgProcessingTime} days</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AgentPerformanceAnalytics;
