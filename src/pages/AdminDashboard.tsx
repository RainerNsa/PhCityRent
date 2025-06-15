
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import AdminApplicationsList from '@/components/admin/AdminApplicationsList';
import AdminStats from '@/components/admin/AdminStats';
import ApplicationAnalytics from '@/components/admin/ApplicationAnalytics';
import NotificationCenter from '@/components/admin/NotificationCenter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Users, FileText, Settings, BarChart3, Bell } from 'lucide-react';

const AdminDashboard = () => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pulse-500"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Mobile Optimized */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center gap-3">
            <div className="bg-pulse-100 p-2 rounded-lg">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-pulse-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">Admin Dashboard</h1>
              <p className="text-sm sm:text-base text-gray-600 hidden sm:block">Advanced agent verification management</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <Tabs defaultValue="applications" className="space-y-4 sm:space-y-6">
          {/* Mobile-Optimized Tabs */}
          <div className="overflow-x-auto">
            <TabsList className="grid w-full grid-cols-6 min-w-[600px] sm:min-w-0">
              <TabsTrigger value="applications" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Applications</span>
                <span className="xs:hidden">Apps</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Analytics</span>
                <span className="xs:hidden">Charts</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <Bell className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Notifications</span>
                <span className="xs:hidden">Alerts</span>
              </TabsTrigger>
              <TabsTrigger value="agents" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Agents</span>
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Statistics</span>
                <span className="xs:hidden">Stats</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Settings</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="applications">
            <AdminApplicationsList />
          </TabsContent>

          <TabsContent value="analytics">
            <ApplicationAnalytics />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationCenter />
          </TabsContent>

          <TabsContent value="agents">
            <div className="bg-white rounded-lg p-4 sm:p-6">
              <h3 className="text-lg font-semibold mb-4">Verified Agents Management</h3>
              <p className="text-gray-600">Advanced agent management features coming soon...</p>
            </div>
          </TabsContent>

          <TabsContent value="stats">
            <AdminStats />
          </TabsContent>

          <TabsContent value="settings">
            <div className="bg-white rounded-lg p-4 sm:p-6">
              <h3 className="text-lg font-semibold mb-4">System Settings</h3>
              <p className="text-gray-600">Advanced settings panel coming soon...</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
