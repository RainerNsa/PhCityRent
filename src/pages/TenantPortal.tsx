
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/Footer';
import EnhancedBreadcrumb from '@/components/ui/enhanced-breadcrumb';
import DashboardContent from '@/components/tenant/dashboard/DashboardContent';
import ProfileContent from '@/components/tenant/profile/ProfileContent';
import PropertiesContent from '@/components/tenant/properties/PropertiesContent';
import AlertsContent from '@/components/tenant/alerts/AlertsContent';
import ApplicationsContent from '@/components/tenant/applications/ApplicationsContent';
import MessagesContent from '@/components/tenant/messages/MessagesContent';
import SettingsContent from '@/components/tenant/settings/SettingsContent';
import EnhancedSecurePaymentDashboard from '@/components/payment/EnhancedSecurePaymentDashboard';
import {
  User,
  Home,
  Bell,
  FileText,
  MessageSquare,
  Settings,
  Heart,
  Shield,
  CreditCard
} from 'lucide-react';

const TenantPortal = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Handle URL parameters for tab navigation
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['dashboard', 'profile', 'properties', 'payments', 'alerts', 'applications', 'messages', 'settings'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <EnhancedBreadcrumb 
            items={[{ label: 'Tenant Portal' }]} 
          />

          {/* Enhanced Header */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 mb-8 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  Welcome back, {user?.user_metadata?.full_name || 'Tenant'}!
                </h1>
                <p className="text-orange-100 text-lg">
                  Manage your rental journey from one convenient dashboard
                </p>
              </div>
              <div className="hidden md:flex items-center justify-center w-20 h-20 bg-white/20 rounded-full">
                <Shield className="w-10 h-10" />
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 bg-white shadow-lg rounded-xl p-2">
              <TabsTrigger value="dashboard" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white rounded-lg transition-all duration-200">
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white rounded-lg transition-all duration-200">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="properties" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white rounded-lg transition-all duration-200">
                <Heart className="w-4 h-4" />
                <span className="hidden sm:inline">Properties</span>
              </TabsTrigger>
              <TabsTrigger value="payments" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white rounded-lg transition-all duration-200">
                <CreditCard className="w-4 h-4" />
                <span className="hidden sm:inline">Payments</span>
              </TabsTrigger>
              <TabsTrigger value="alerts" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white rounded-lg transition-all duration-200">
                <Bell className="w-4 h-4" />
                <span className="hidden sm:inline">Alerts</span>
              </TabsTrigger>
              <TabsTrigger value="applications" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white rounded-lg transition-all duration-200">
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Applications</span>
              </TabsTrigger>
              <TabsTrigger value="messages" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white rounded-lg transition-all duration-200">
                <MessageSquare className="w-4 h-4" />
                <span className="hidden sm:inline">Messages</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white rounded-lg transition-all duration-200">
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

            <TabsContent value="payments" className="space-y-6">
              <EnhancedSecurePaymentDashboard tenantId={user?.id} />
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
      </main>
      <Footer />
    </div>
  );
};

export default TenantPortal;
