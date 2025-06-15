
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { User, Home, Bell, FileText, MessageSquare, Settings } from 'lucide-react';
import TenantProfile from '@/components/tenant/TenantProfile';
import TenantProperties from '@/components/tenant/TenantProperties';
import TenantAlerts from '@/components/tenant/TenantAlerts';
import TenantApplications from '@/components/tenant/TenantApplications';
import TenantMessages from '@/components/tenant/TenantMessages';
import TenantSettings from '@/components/tenant/TenantSettings';

const TenantPortal = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'dashboard';

  if (!user) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-20 pb-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold mb-4">Please sign in to access your tenant portal</h1>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Tenant Portal</h1>
              <p className="text-gray-600">Welcome back, {user.user_metadata?.full_name || user.email}</p>
            </div>

            <Tabs defaultValue={defaultTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="dashboard" className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </TabsTrigger>
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Profile</span>
                </TabsTrigger>
                <TabsTrigger value="properties" className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  <span className="hidden sm:inline">Properties</span>
                </TabsTrigger>
                <TabsTrigger value="alerts" className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  <span className="hidden sm:inline">Alerts</span>
                </TabsTrigger>
                <TabsTrigger value="applications" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span className="hidden sm:inline">Applications</span>
                </TabsTrigger>
                <TabsTrigger value="messages" className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  <span className="hidden sm:inline">Messages</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Home className="w-5 h-5 text-blue-500" />
                        Saved Properties
                      </CardTitle>
                      <CardDescription>Properties you've bookmarked</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600 mb-2">0</div>
                      <p className="text-sm text-gray-600">No saved properties yet</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Bell className="w-5 h-5 text-orange-500" />
                        Active Alerts
                      </CardTitle>
                      <CardDescription>Property search alerts</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-orange-600 mb-2">0</div>
                      <p className="text-sm text-gray-600">No active alerts</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-green-500" />
                        Applications
                      </CardTitle>
                      <CardDescription>Rental applications submitted</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600 mb-2">0</div>
                      <p className="text-sm text-gray-600">No applications submitted</p>
                    </CardContent>
                  </Card>
                </div>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your latest interactions and updates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-gray-500">
                      <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No recent activity to display</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="profile">
                <TenantProfile />
              </TabsContent>

              <TabsContent value="properties">
                <TenantProperties />
              </TabsContent>

              <TabsContent value="alerts">
                <TenantAlerts />
              </TabsContent>

              <TabsContent value="applications">
                <TenantApplications />
              </TabsContent>

              <TabsContent value="messages">
                <TenantMessages />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TenantPortal;
