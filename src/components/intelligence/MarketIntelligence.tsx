
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, Search, MapPin, Home, DollarSign } from 'lucide-react';

const MarketIntelligence = () => {
  const [selectedProperty, setSelectedProperty] = useState('');
  const [selectedArea, setSelectedArea] = useState('');

  const priceData = [
    { month: 'Jan', average: 650000, comparable: 680000 },
    { month: 'Feb', average: 670000, comparable: 695000 },
    { month: 'Mar', average: 685000, comparable: 710000 },
    { month: 'Apr', average: 695000, comparable: 720000 },
    { month: 'May', average: 710000, comparable: 735000 },
    { month: 'Jun', average: 725000, comparable: 750000 }
  ];

  const comparableProperties = [
    {
      id: 1,
      title: 'Luxury Apartment - GRA',
      location: 'GRA Phase 1',
      price: 750000,
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1200,
      similarity: 95,
      status: 'Recently Sold'
    },
    {
      id: 2,
      title: 'Modern Flat - Trans Amadi',
      location: 'Trans Amadi',
      price: 680000,
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1100,
      similarity: 88,
      status: 'Active'
    },
    {
      id: 3,
      title: 'Executive Suite - Old GRA',
      location: 'Old GRA',
      price: 800000,
      bedrooms: 3,
      bathrooms: 3,
      sqft: 1300,
      similarity: 82,
      status: 'Recently Sold'
    }
  ];

  const marketMetrics = [
    { metric: 'Average Price/Sqft', value: '₦625', change: '+5.2%', trend: 'up' },
    { metric: 'Days on Market', value: '45', change: '-12%', trend: 'down' },
    { metric: 'Price Appreciation', value: '8.5%', change: '+2.1%', trend: 'up' },
    { metric: 'Inventory Level', value: '127', change: '-8%', trend: 'down' }
  ];

  const areaData = [
    { area: 'GRA Phase 1', properties: 45, avgPrice: 850000, priceChange: 12.5 },
    { area: 'Trans Amadi', properties: 62, avgPrice: 650000, priceChange: 8.2 },
    { area: 'Old GRA', properties: 38, avgPrice: 920000, priceChange: 15.3 },
    { area: 'Woji', properties: 29, avgPrice: 580000, priceChange: 6.8 },
    { area: 'Rumuola', properties: 33, avgPrice: 720000, priceChange: 9.7 }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Market Intelligence</h2>
        <p className="text-gray-600">Advanced property analysis and market insights</p>
      </div>

      <Tabs defaultValue="comparable" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="comparable">Comparable Analysis</TabsTrigger>
          <TabsTrigger value="trends">Market Trends</TabsTrigger>
          <TabsTrigger value="areas">Area Analysis</TabsTrigger>
          <TabsTrigger value="forecasting">Price Forecasting</TabsTrigger>
        </TabsList>

        <TabsContent value="comparable" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="w-5 h-5" />
                <span>Property Comparison Tool</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Property</label>
                  <Select value={selectedProperty} onValueChange={setSelectedProperty}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a property to analyze" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="prop1">Sunset Gardens Apt 3B</SelectItem>
                      <SelectItem value="prop2">Palm View Estate Unit 12</SelectItem>
                      <SelectItem value="prop3">GRA Complex Floor 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Target Area</label>
                  <Select value={selectedArea} onValueChange={setSelectedArea}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select comparison area" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gra1">GRA Phase 1</SelectItem>
                      <SelectItem value="trans">Trans Amadi</SelectItem>
                      <SelectItem value="oldgra">Old GRA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button className="w-full">
                <Search className="w-4 h-4 mr-2" />
                Generate Comparable Analysis
              </Button>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            {comparableProperties.map((property) => (
              <Card key={property.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                      <h3 className="font-semibold">{property.title}</h3>
                      <p className="text-sm text-gray-600 flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {property.location}
                      </p>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="flex items-center">
                          <Home className="w-4 h-4 mr-1" />
                          {property.bedrooms}BR/{property.bathrooms}BA
                        </span>
                        <span>{property.sqft} sqft</span>
                      </div>
                    </div>
                    
                    <div className="text-right space-y-2">
                      <div className="text-xl font-bold text-green-600">
                        ₦{property.price.toLocaleString()}
                      </div>
                      <Badge variant={property.similarity > 90 ? 'default' : 'secondary'}>
                        {property.similarity}% Match
                      </Badge>
                      <div className="text-xs text-gray-500">{property.status}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {marketMetrics.map((metric, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-600">{metric.metric}</p>
                      <p className="text-2xl font-bold">{metric.value}</p>
                    </div>
                    <div className={`flex items-center space-x-1 ${
                      metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {metric.trend === 'up' ? 
                        <TrendingUp className="w-4 h-4" /> : 
                        <TrendingDown className="w-4 h-4" />
                      }
                      <span className="text-sm">{metric.change}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Price Trend Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={priceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₦${value.toLocaleString()}`, 'Price']} />
                  <Line 
                    type="monotone" 
                    dataKey="average" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Market Average"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="comparable" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="Comparable Properties"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="areas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Area Performance Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={areaData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="area" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [
                    name === 'avgPrice' ? `₦${value.toLocaleString()}` : value,
                    name === 'avgPrice' ? 'Average Price' : 'Properties'
                  ]} />
                  <Bar dataKey="avgPrice" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            {areaData.map((area, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{area.area}</h3>
                      <p className="text-sm text-gray-600">{area.properties} active properties</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">₦{area.avgPrice.toLocaleString()}</div>
                      <div className={`text-sm flex items-center ${
                        area.priceChange > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {area.priceChange > 0 ? 
                          <TrendingUp className="w-4 h-4 mr-1" /> : 
                          <TrendingDown className="w-4 h-4 mr-1" />
                        }
                        {area.priceChange}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="forecasting" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Price Forecasting Model</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">+12.5%</div>
                  <div className="text-sm text-gray-600">6-Month Projection</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">+18.7%</div>  
                  <div className="text-sm text-gray-600">12-Month Projection</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">92%</div>
                  <div className="text-sm text-gray-600">Confidence Level</div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Key Factors Influencing Forecast:</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• Economic growth in Rivers State (+8.2%)</li>
                  <li>• Infrastructure development projects</li>
                  <li>• Population growth and urbanization trends</li>
                  <li>• Oil industry employment patterns</li>
                  <li>• Government housing policies</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarketIntelligence;
