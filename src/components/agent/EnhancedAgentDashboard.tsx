
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AgentCommissionTracker from './AgentCommissionTracker';
import AgentPropertyManager from './AgentPropertyManager';
import { useAuth } from '@/hooks/useAuth';
import { Building, DollarSign, Users, TrendingUp } from 'lucide-react';

const EnhancedAgentDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-8">Agent Dashboard</h1>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Building className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-gray-600">Active Listings</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-gray-600">Clients</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">₦0</p>
                <p className="text-sm text-gray-600">Total Earned</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-gray-600">Deals Closed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="properties" className="space-y-4">
        <TabsList>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="commissions">Commissions</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="properties">
          <AgentPropertyManager />
        </TabsContent>

        <TabsContent value="commissions">
          <AgentCommissionTracker />
        </TabsContent>

        <TabsContent value="clients">
          <Card>
            <CardHeader>
              <CardTitle>Client Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-500 py-8">Client management features coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-500 py-8">Analytics features coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedAgentDashboard;
