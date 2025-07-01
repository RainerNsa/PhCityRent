
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Download, FileText, TrendingUp, DollarSign, Home, Users } from 'lucide-react';

const AdvancedReporting = () => {
  const [selectedReport, setSelectedReport] = useState('financial');
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const financialData = [
    { month: 'Jan', revenue: 850000, expenses: 320000, profit: 530000 },
    { month: 'Feb', revenue: 950000, expenses: 380000, profit: 570000 },
    { month: 'Mar', revenue: 1200000, expenses: 420000, profit: 780000 },
    { month: 'Apr', revenue: 1100000, expenses: 390000, profit: 710000 },
    { month: 'May', revenue: 1350000, expenses: 450000, profit: 900000 },
    { month: 'Jun', revenue: 1250000, expenses: 430000, profit: 820000 }
  ];

  const occupancyData = [
    { month: 'Jan', occupied: 85, vacant: 15 },
    { month: 'Feb', occupied: 88, vacant: 12 },
    { month: 'Mar', occupied: 92, vacant: 8 },
    { month: 'Apr', occupied: 89, vacant: 11 },
    { month: 'May', occupied: 94, vacant: 6 },
    { month: 'Jun', occupied: 91, vacant: 9 }
  ];

  const propertyTypeData = [
    { name: 'Apartments', value: 45, color: '#ff6b35' },
    { name: 'Houses', value: 30, color: '#f7931e' },
    { name: 'Duplexes', value: 15, color: '#ffb627' },
    { name: 'Commercial', value: 10, color: '#ffd700' }
  ];

  const reportTypes = [
    { id: 'financial', name: 'Financial Reports', icon: DollarSign, description: 'Revenue, expenses, and profit analysis' },
    { id: 'occupancy', name: 'Occupancy Analytics', icon: Home, description: 'Property occupancy rates and trends' },
    { id: 'agent', name: 'Agent Performance', icon: Users, description: 'Agent metrics and commission tracking' },
    { id: 'market', name: 'Market Analysis', icon: TrendingUp, description: 'Market trends and pricing insights' }
  ];

  const kpiMetrics = [
    { label: 'Total Revenue', value: '₦7.7M', change: '+12.5%', trend: 'up' },
    { label: 'Active Properties', value: '247', change: '+8.2%', trend: 'up' },
    { label: 'Occupancy Rate', value: '91%', change: '+2.1%', trend: 'up' },
    { label: 'Avg. Commission', value: '₦85K', change: '-1.8%', trend: 'down' }
  ];

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Report Generated!",
        description: `${reportTypes.find(r => r.id === selectedReport)?.name} report has been generated and is ready for download.`,
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const renderChart = () => {
    switch (selectedReport) {
      case 'financial':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={financialData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `₦${(value as number).toLocaleString()}`} />
              <Bar dataKey="revenue" fill="#ff6b35" name="Revenue" />
              <Bar dataKey="expenses" fill="#f7931e" name="Expenses" />
              <Bar dataKey="profit" fill="#4ade80" name="Profit" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'occupancy':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={occupancyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `${value}%`} />
              <Line type="monotone" dataKey="occupied" stroke="#ff6b35" strokeWidth={3} name="Occupied %" />
              <Line type="monotone" dataKey="vacant" stroke="#f7931e" strokeWidth={3} name="Vacant %" />
            </LineChart>
          </ResponsiveContainer>
        );
      default:
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={propertyTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {propertyTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Advanced Reporting</h2>
        <p className="text-gray-600">Comprehensive analytics and financial reporting</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpiMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="space-y-1">
                <p className="text-sm text-gray-600">{metric.label}</p>
                <p className="text-2xl font-bold">{metric.value}</p>
                <p className={`text-sm ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {metric.change}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Report Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Report Configuration</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Type</label>
              <Select value={selectedReport} onValueChange={setSelectedReport}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      <div className="flex items-center space-x-2">
                        <type.icon className="w-4 h-4" />
                        <span>{type.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Time Period</label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-2">
              <p className="text-sm text-gray-600 mb-3">
                {reportTypes.find(r => r.id === selectedReport)?.description}
              </p>
              
              <Button
                onClick={handleGenerateReport}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
              >
                {isGenerating ? 'Generating...' : 'Generate Report'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Chart Display */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{reportTypes.find(r => r.id === selectedReport)?.name}</CardTitle>
              <div className="flex space-x-2">
                <Badge variant="outline">{selectedPeriod}</Badge>
                <Button size="sm" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {renderChart()}
          </CardContent>
        </Card>
      </div>

      {/* Report Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Report Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Key Insights</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Revenue increased by 12.5% this quarter</li>
                <li>• Occupancy rate remains above 90%</li>
                <li>• Agent performance improved across all metrics</li>
                <li>• Market demand strong in premium segments</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Recommendations</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Focus on high-demand property types</li>
                <li>• Optimize pricing for better margins</li>
                <li>• Expand agent training programs</li>
                <li>• Invest in marketing for emerging areas</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Next Actions</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Schedule quarterly business review</li>
                <li>• Update market analysis reports</li>
                <li>• Review agent commission structure</li>
                <li>• Plan expansion strategies</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedReporting;
