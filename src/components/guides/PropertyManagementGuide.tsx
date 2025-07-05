
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Upload, Image, Building, Users, Shield, ArrowRight } from 'lucide-react';

const PropertyManagementGuide = () => {
  const [activeGuide, setActiveGuide] = useState('agent');

  const guides = {
    agent: {
      title: "Agent Portal - Property & Image Management",
      steps: [
        {
          title: "Access Agent Dashboard",
          description: "Navigate to /agent-dashboard after logging in with agent credentials",
          action: "Login → Profile Menu → Agent Dashboard"
        },
        {
          title: "Add New Property",
          description: "Click 'Add New Property' button in the Property Management section",
          action: "Agent Dashboard → Properties Tab → Add New Property"
        },
        {
          title: "Upload Property Images",
          description: "Use the image upload component to add property photos",
          action: "Property Form → Images Section → Upload Images"
        },
        {
          title: "Fill Property Details",
          description: "Complete all required fields including location, price, amenities",
          action: "Complete Form → Preview → Submit"
        }
      ],
      currentIssues: [
        "Image upload not connected to Supabase Storage",
        "Property creation form needs validation",
        "No image compression/optimization",
        "Missing property status management"
      ]
    },
    landlord: {
      title: "Landlord Portal - Property Management",
      steps: [
        {
          title: "Access Landlord Portal",
          description: "Navigate to /landlord-portal with landlord account",
          action: "Login → Profile Menu → Landlord Portal"
        },
        {
          title: "Manage Properties",
          description: "View, edit, and manage your property listings",
          action: "Landlord Dashboard → My Properties → Manage"
        },
        {
          title: "Update Property Status",
          description: "Mark properties as available/occupied, update pricing",
          action: "Property List → Edit → Update Status"
        },
        {
          title: "View Analytics",
          description: "Monitor property performance and inquiries",
          action: "Dashboard → Analytics → Property Performance"
        }
      ],
      currentIssues: [
        "Limited property editing capabilities",
        "No tenant management system",
        "Missing maintenance request handling",
        "No rental agreement generation"
      ]
    },
    admin: {
      title: "Admin Management - System Overview",
      steps: [
        {
          title: "Access Admin Dashboard",
          description: "Navigate to /admin with admin credentials",
          action: "Login → Profile Menu → Admin Dashboard"
        },
        {
          title: "Manage Users",
          description: "View and manage all users, agents, and landlords",
          action: "Admin Dashboard → Users → Manage Accounts"
        },
        {
          title: "Content Moderation",
          description: "Approve/reject property listings and user content",
          action: "Admin Dashboard → Content → Review Listings"
        },
        {
          title: "System Analytics",
          description: "Monitor platform usage and performance metrics",
          action: "Admin Dashboard → Analytics → System Overview"
        }
      ],
      currentIssues: [
        "No user management interface",
        "Missing content approval workflow",
        "No system analytics implementation",
        "Limited admin controls"
      ]
    }
  };

  return (
    <div className="space-y-8 p-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Property & Image Management Guide</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Step-by-step instructions for managing properties and images across different portals
        </p>
      </div>

      <Tabs value={activeGuide} onValueChange={setActiveGuide}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="agent" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Agent Portal
          </TabsTrigger>
          <TabsTrigger value="landlord" className="flex items-center gap-2">
            <Building className="w-4 h-4" />
            Landlord Portal
          </TabsTrigger>
          <TabsTrigger value="admin" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Admin Management
          </TabsTrigger>
        </TabsList>

        {Object.entries(guides).map(([key, guide]) => (
          <TabsContent key={key} value={key}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-orange-500" />
                  {guide.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Steps */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">How to Add Properties & Images</h3>
                  <div className="grid gap-4">
                    {guide.steps.map((step, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium mb-1">{step.title}</h4>
                          <p className="text-gray-600 text-sm mb-2">{step.description}</p>
                          <Badge variant="outline" className="text-xs">
                            {step.action}
                          </Badge>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 mt-2" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Current Issues */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-red-600">Current Issues to Fix</h3>
                  <div className="grid gap-2">
                    {guide.currentIssues.map((issue, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-red-50 rounded">
                        <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                        <span className="text-sm text-red-700">{issue}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-4 pt-4 border-t">
                  <Button 
                    onClick={() => window.location.href = `/${key === 'admin' ? 'admin' : key + '-dashboard'}`}
                    className="flex items-center gap-2"
                  >
                    <ArrowRight className="w-4 h-4" />
                    Go to {guide.title.split(' - ')[0]}
                  </Button>
                  <Button variant="outline">
                    View Documentation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default PropertyManagementGuide;
