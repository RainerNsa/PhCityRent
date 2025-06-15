
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import DashboardContent from '@/components/tenant/dashboard/DashboardContent';
import ProfileContent from '@/components/tenant/profile/ProfileContent';
import PropertiesContent from '@/components/tenant/properties/PropertiesContent';
import AlertsContent from '@/components/tenant/alerts/AlertsContent';
import ApplicationsContent from '@/components/tenant/applications/ApplicationsContent';
import MessagesContent from '@/components/tenant/messages/MessagesContent';
import SettingsContent from '@/components/tenant/settings/SettingsContent';
import { 
  User, 
  Home, 
  Bell, 
  FileText, 
  MessageSquare, 
  Settings,
  Heart
} from 'lucide-react';

const TenantPortal = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tenant Portal</h1>
          <p className="text-gray-600">Welcome back, {user?.user_metadata?.full_name || 'Tenant'}!</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="properties" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
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
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <DashboardContent />
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <ProfileContent />
          </TabsContent>

          <TabsContent value="properties" className="space-y-6">
            <PropertiesContent />
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <AlertsContent />
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <ApplicationsContent />
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <MessagesContent />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <SettingsContent />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TenantPortal;
