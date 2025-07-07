
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

import {
  Heart,
  FileText,
  MessageSquare,
  Search,
  Plus
} from 'lucide-react';

import { useProperties } from '@/hooks/useProperties';
import { useDashboardStats } from '@/hooks/useDashboardStats';

const DashboardContent = () => {

  const { data: properties } = useProperties();
  const { data: dashboardStats } = useDashboardStats();

  // Get a random property for quick apply feature
  const randomProperty = properties && properties.length > 0
    ? properties[Math.floor(Math.random() * properties.length)]
    : null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saved Properties</CardTitle>
            <Heart className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats?.saved_properties_count || 0}</div>
            <p className="text-xs text-muted-foreground">Properties you've liked</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Applications</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats?.pending_applications_count || 0}</div>
            <p className="text-xs text-muted-foreground">Applications in progress</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats?.unread_messages_count || 0}</div>
            <p className="text-xs text-muted-foreground">New messages</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm">Application submitted for 3-bedroom apartment</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm">Property saved: Modern house in GRA</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm">Message from Agent John Doe</p>
                  <p className="text-xs text-gray-500">2 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Link to="/properties">
                <Button className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                  <Search className="w-6 h-6" />
                  <span className="text-sm">Browse Properties</span>
                </Button>
              </Link>
              <Link to="/create-alert">
                <Button
                  className="w-full h-20 flex flex-col items-center justify-center space-y-2"
                  variant="outline"
                >
                  <Plus className="w-6 h-6" />
                  <span className="text-sm">Create Alert</span>
                </Button>
              </Link>
              <Link to="/contact-agent">
                <Button
                  className="w-full h-20 flex flex-col items-center justify-center space-y-2"
                  variant="outline"
                >
                  <MessageSquare className="w-6 h-6" />
                  <span className="text-sm">Contact Agent</span>
                </Button>
              </Link>
              <Link to={randomProperty ? `/properties/${randomProperty.id}` : '/properties'}>
                <Button className="w-full h-20 flex flex-col items-center justify-center space-y-2" variant="outline">
                  <FileText className="w-6 h-6" />
                  <span className="text-sm">Apply Now</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>


    </div>
  );
};

export default DashboardContent;
