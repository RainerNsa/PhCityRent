
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import {
  Home,
  Building2,
  UserCheck,
  Shield,
  ArrowRight,
  Crown,
  Briefcase,
  Wrench
} from 'lucide-react';

const DashboardQuickAccess = () => {
  const { user, isAdmin } = useAuth();

  if (!user) return null;

  const dashboards = [
    {
      title: 'Tenant Portal',
      description: 'Find properties, track applications, manage rentals',
      icon: Home,
      href: '/tenant-portal',
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700'
    },
    {
      title: 'Landlord Portal',
      description: 'Manage properties, screen tenants, track income',
      icon: Building2,
      href: '/landlord-portal',
      color: 'from-green-500 to-green-600',
      hoverColor: 'hover:from-green-600 hover:to-green-700'
    },
    {
      title: 'Agent Dashboard',
      description: 'Manage listings, track commissions, client relations',
      icon: UserCheck,
      href: '/enhanced-agent-dashboard',
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'hover:from-purple-600 hover:to-purple-700'
    },
    {
      title: 'House Maintenance Dashboard',
      description: 'Track repairs, schedule maintenance, manage service requests',
      icon: Wrench,
      href: '/maintenance-dashboard',
      color: 'from-orange-500 to-orange-600',
      hoverColor: 'hover:from-orange-600 hover:to-orange-700'
    }
  ];

  if (isAdmin) {
    dashboards.push({
      title: 'Admin Dashboard',
      description: 'System management, user oversight, analytics',
      icon: Shield,
      href: '/admin',
      color: 'from-yellow-500 to-yellow-600',
      hoverColor: 'hover:from-yellow-600 hover:to-yellow-700'
    });
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 mb-12 border border-gray-200/50">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Quick Dashboard Access</h2>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Access all your dashboards in one place. Switch between different roles and manage your rental business efficiently.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {dashboards.map((dashboard) => {
          const Icon = dashboard.icon;
          
          return (
            <Link key={dashboard.href} to={dashboard.href}>
              <Card className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border-0 bg-white shadow-lg">
                <CardContent className="p-6">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${dashboard.color} ${dashboard.hoverColor} flex items-center justify-center mb-4 transition-all duration-300 group-hover:shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  
                  <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-gray-800">
                    {dashboard.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {dashboard.description}
                  </p>
                  
                  <div className="flex items-center text-sm font-medium text-orange-600 group-hover:text-orange-700 transition-colors">
                    <span>Access Dashboard</span>
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {isAdmin && (
        <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200/50">
          <div className="flex items-center gap-2 text-sm text-yellow-800">
            <Crown className="w-4 h-4" />
            <span className="font-medium">Admin Access:</span>
            <span>You have administrative privileges and can access all system features.</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardQuickAccess;
