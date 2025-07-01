
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Calculator, MapPin, Home, DollarSign } from 'lucide-react';

const MarketAnalytics = () => {
  const priceData = [
    { month: 'Jan', avgPrice: 420000, demand: 85 },
    { month: 'Feb', avgPrice: 435000, demand: 78 },
    { month: 'Mar', avgPrice: 445000, demand: 92 },
    { month: 'Apr', avgPrice: 460000, demand: 88 },
    { month: 'May', avgPrice: 475000, demand: 95 },
    { month: 'Jun', avgPrice: 485000, demand: 90 },
  ];

  const areaData = [
    { area: 'Old GRA', avgPrice: 650000, properties: 45, growth: 12.5 },
    { area: 'New GRA', avgPrice: 580000, properties: 32, growth: 8.3 },
    { area: 'D-Line', avgPrice: 420000, properties: 78, growth: 15.2 },
    { area: 'Eliozu', avgPrice: 720000, properties: 23, growth: 18.7 },
    { area: 'Mile 3', avgPrice: 180000, properties: 156, growth: 5.4 },
  ];

  const propertyTypes = [
    { name: 'Apartments', value: 45, fill: '#f97316' },
    { name: 'Houses', value: 30, fill: '#ef4444' },
    { name: 'Studios', value: 15, fill: '#3b82f6' },
    { name: 'Duplexes', value: 10, fill: '#10b981' },
  ];

  const roiData = [
    { type: '1 Bedroom', investment: 2500000, monthlyRent: 180000, roi: 8.6 },
    { type: '2 Bedroom', investment: 4200000, monthlyRent: 320000, roi: 9.1 },
    { type: '3 Bedroom', investment: 6500000, monthlyRent: 480000, roi: 8.8 },
    { type: '4 Bedroom', investment: 9200000, monthlyRent: 680000, roi: 8.9 },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
          Market Analytics & ROI Calculator
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Comprehensive market analysis and investment insights for Port Harcourt real estate
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Rent Price</p>
                <p className="text-2xl font-bold">₦485k</p>
                <div className="flex items-center text-green-600 text-sm">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +12.5%
                </div>
              </div>
              <DollarSign className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Market Demand</p>
                <p className="text-2xl font-bold">90%</p>
                <div className="flex items-center text-green-600 text-sm">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +5.2%
                </div>
              </div>
              <Home className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. ROI</p>
                <p className="text-2xl font-bold">8.9%</p>
                <div className="flex items-center text-green-600 text-sm">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +0.3%
                </div>
              </div>
              <Calculator className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Listings</p>
                <p className="text-2xl font-bold">334</p>
                <div className="flex items-center text-red-600 text-sm">
                  <TrendingDown className="w-4 h-4 mr-1" />
                  -2.1%
                </div>
              </div>
              <MapPin className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Price Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Price Trends (Last 6 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={priceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`₦${Number(value).toLocaleString()}`, 'Average Price']} />
                <Area type="monotone" dataKey="avgPrice" stroke="#f97316" fill="#fed7aa" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Property Types Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Property Types Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={propertyTypes}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {propertyTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Area Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Area Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Area</th>
                  <th className="text-left p-3">Avg Price</th>
                  <th className="text-left p-3">Properties</th>
                  <th className="text-left p-3">Growth</th>
                </tr>
              </thead>
              <tbody>
                {areaData.map((area, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{area.area}</td>
                    <td className="p-3">₦{area.avgPrice.toLocaleString()}</td>
                    <td className="p-3">{area.properties}</td>
                    <td className="p-3">
                      <div className={`flex items-center ${area.growth > 10 ? 'text-green-600' : 'text-blue-600'}`}>
                        <TrendingUp className="w-4 h-4 mr-1" />
                        +{area.growth}%
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ROI Calculator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calculator className="w-5 h-5" />
            <span>ROI Calculator by Property Type</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={roiData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'roi') return [`${value}%`, 'Annual ROI'];
                  return [`₦${Number(value).toLocaleString()}`, name === 'investment' ? 'Investment' : 'Monthly Rent'];
                }}
              />
              <Bar dataKey="roi" fill="#f97316" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketAnalytics;
