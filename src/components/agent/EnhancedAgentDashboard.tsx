
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AgentCommissionTracker from './AgentCommissionTracker';
import AgentPropertyManager from './AgentPropertyManager';
import AgentClientManager from './AgentClientManager';
import { useAuth } from '@/hooks/useAuth';
import { useProperties } from '@/hooks/useProperties';
import { useCommissions } from '@/hooks/useCommissions';
import { Building, DollarSign, Users, TrendingUp, BarChart3 } from 'lucide-react';

const EnhancedAgentDashboard = () => {
  const { user } = useAuth();
  const { data: properties } = useProperties();
  const { data: commissions } = useCommissions();

  // Calculate real stats from data
  const agentProperties = properties?.filter(p => 
    p.agent_id === user?.id || p.landlord_id === user?.id
  ) || [];

  const totalEarned = commissions?.filter(c => c.status === 'paid')
    .reduce((sum, c) => sum + c.commission_amount, 0) || 0;

  const dealsCompleted = commissions?.filter(c => c.status === 'paid').length || 0;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Agent Dashboard</h1>
        <p className="text-gray-600">Manage your properties, track commissions, and grow your client base</p>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Building className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{agentProperties.length}</p>
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
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-gray-600">Active Clients</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">₦{(totalEarned / 100).toLocaleString()}</p>
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
                <p className="text-2xl font-bold">{dealsCompleted}</p>
                <p className="text-sm text-gray-600">Deals Closed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="properties" className="space-y-4">
        <TabsList>
          <TabsTrigger value="properties" className="flex items-center gap-2">
            <Building className="w-4 h-4" />
            Properties
          </TabsTrigger>
          <TabsTrigger value="commissions" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Commissions
          </TabsTrigger>
          <TabsTrigger value="clients" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Clients
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="properties">
          <AgentPropertyManager />
        </TabsContent>

        <TabsContent value="commissions">
          <AgentCommissionTracker />
        </TabsContent>

        <TabsContent value="clients">
          <AgentClientManager />
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {agentProperties.filter(p => p.is_available).length}
                      </div>
                      <div className="text-sm text-gray-600">Available Properties</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {agentProperties.length > 0 
                          ? `${Math.round((agentProperties.filter(p => p.is_available).length / agentProperties.length) * 100)}% of total`
                          : '0% of total'
                        }
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        ₦{agentProperties.length > 0 
                          ? Math.round(agentProperties.reduce((sum, p) => sum + p.price_per_year, 0) / agentProperties.length / 1000000 * 10) / 10 
                          : 0}M
                      </div>
                      <div className="text-sm text-gray-600">Avg Property Value</div>
                      <div className="text-xs text-gray-500 mt-1">Per year rental</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {commissions?.length || 0}
                      </div>
                      <div className="text-sm text-gray-600">Total Transactions</div>
                      <div className="text-xs text-gray-500 mt-1">All time</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Quick Insights</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="text-sm">Most Popular Property Type</span>
                    <span className="font-medium">
                      {agentProperties.length > 0 ? 'Apartment' : 'No data'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="text-sm">Average Commission Rate</span>
                    <span className="font-medium">
                      {commissions && commissions.length > 0 
                        ? `${Math.round(commissions.reduce((sum, c) => sum + c.commission_rate, 0) / commissions.length)}%`
                        : 'No data'
                      }
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="text-sm">Response Time</span>
                    <span className="font-medium">Within 2 hours</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedAgentDashboard;
