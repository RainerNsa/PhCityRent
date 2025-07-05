
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/Footer';
import AdminApplicationsList from '@/components/admin/AdminApplicationsList';
import AdminStats from '@/components/admin/AdminStats';
import ApplicationAnalytics from '@/components/admin/ApplicationAnalytics';
import NotificationCenter from '@/components/admin/NotificationCenter';
import AdminPromotion from '@/components/admin/AdminPromotion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Users, FileText, Settings, BarChart3, Bell, Crown } from 'lucide-react';

const AdminDashboard = () => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <main className="pt-20 pb-12">
        {/* Enhanced Header */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Admin Dashboard</h1>
                <p className="text-orange-100 text-lg">
                  Advanced agent verification management
                </p>
              </div>
              <div className="hidden md:flex items-center justify-center w-20 h-20 bg-white/20 rounded-full">
                <Shield className="w-10 h-10" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="applications" className="space-y-4 sm:space-y-6">
            {/* Mobile-Optimized Tabs */}
            <div className="overflow-x-auto">
              <TabsList className="grid w-full grid-cols-7 min-w-[700px] sm:min-w-0 bg-white shadow-lg rounded-xl">
                <TabsTrigger value="applications" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white">
                  <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Applications</span>
                  <span className="xs:hidden">Apps</span>
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white">
                  <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Analytics</span>
                  <span className="xs:hidden">Charts</span>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white">
                  <Bell className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Notifications</span>
                  <span className="xs:hidden">Alerts</span>
                </TabsTrigger>
                <TabsTrigger value="agents" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white">
                  <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Agents</span>
                </TabsTrigger>
                <TabsTrigger value="stats" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white">
                  <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Statistics</span>
                  <span className="xs:hidden">Stats</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white">
                  <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Settings</span>
                </TabsTrigger>
                <TabsTrigger value="promote" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white">
                  <Crown className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Promote</span>
                  <span className="xs:hidden">Promo</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border-0 overflow-hidden">
              <TabsContent value="applications" className="p-0 m-0">
                <AdminApplicationsList />
              </TabsContent>

              <TabsContent value="analytics" className="p-0 m-0">
                <ApplicationAnalytics />
              </TabsContent>

              <TabsContent value="notifications" className="p-0 m-0">
                <NotificationCenter />
              </TabsContent>

              <TabsContent value="agents" className="p-6">
                <h3 className="text-lg font-semibold mb-4">Verified Agents Management</h3>
                <p className="text-gray-600">Advanced agent management features coming soon...</p>
              </TabsContent>

              <TabsContent value="stats" className="p-0 m-0">
                <AdminStats />
              </TabsContent>

              <TabsContent value="settings" className="p-6">
                <h3 className="text-lg font-semibold mb-4">System Settings</h3>
                <p className="text-gray-600">Advanced settings panel coming soon...</p>
              </TabsContent>

              <TabsContent value="promote" className="p-6">
                <h3 className="text-lg font-semibold mb-4">User Promotion</h3>
                <div className="flex justify-center">
                  <AdminPromotion />
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
