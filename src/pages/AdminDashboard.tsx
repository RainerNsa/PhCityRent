
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import AdminApplicationsList from '@/components/admin/AdminApplicationsList';
import AdminStats from '@/components/admin/AdminStats';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Users, FileText, Settings } from 'lucide-react';

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
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-pulse-100 p-2 rounded-lg">
              <Shield className="w-6 h-6 text-pulse-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage agent verification applications</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="applications" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Applications
            </TabsTrigger>
            <TabsTrigger value="agents" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Agents
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Statistics
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="applications">
            <AdminApplicationsList />
          </TabsContent>

          <TabsContent value="agents">
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Verified Agents</h3>
              <p className="text-gray-600">Agent management coming soon...</p>
            </div>
          </TabsContent>

          <TabsContent value="stats">
            <AdminStats />
          </TabsContent>

          <TabsContent value="settings">
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Admin Settings</h3>
              <p className="text-gray-600">Settings panel coming soon...</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
