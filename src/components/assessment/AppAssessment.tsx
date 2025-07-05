
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, Settings } from 'lucide-react';

const AppAssessment = () => {
  const features = [
    {
      category: "Authentication & User Management",
      items: [
        { name: "User Registration/Login", status: "working", description: "Supabase auth implemented" },
        { name: "Profile Management", status: "partial", description: "Basic profile exists, needs enhancement" },
        { name: "Role-based Access", status: "partial", description: "Roles defined but not fully implemented" }
      ]
    },
    {
      category: "Property Management",
      items: [
        { name: "Property Listings", status: "working", description: "Can view properties from database" },
        { name: "Property Search/Filter", status: "working", description: "Recently implemented search functionality" },
        { name: "Property Creation", status: "partial", description: "Form exists but needs better integration" },
        { name: "Image Upload", status: "missing", description: "No image upload functionality" },
        { name: "Property Inquiry", status: "partial", description: "Form exists but no backend processing" }
      ]
    },
    {
      category: "Agent Portal",
      items: [
        { name: "Agent Dashboard", status: "partial", description: "UI exists but limited functionality" },
        { name: "Property Management", status: "partial", description: "Can view but not fully manage properties" },
        { name: "Commission Tracking", status: "missing", description: "No commission calculation/tracking" },
        { name: "Client Management", status: "missing", description: "No client relationship management" }
      ]
    },
    {
      category: "Landlord Portal",
      items: [
        { name: "Landlord Dashboard", status: "partial", description: "Basic dashboard exists" },
        { name: "Property Management", status: "partial", description: "Limited property management features" },
        { name: "Tenant Management", status: "missing", description: "No tenant relationship management" },
        { name: "Maintenance Requests", status: "missing", description: "No maintenance request system" }
      ]
    },
    {
      category: "Admin Management",
      items: [
        { name: "Admin Dashboard", status: "partial", description: "Basic admin interface exists" },
        { name: "User Management", status: "missing", description: "No user management system" },
        { name: "Content Moderation", status: "missing", description: "No content approval workflow" },
        { name: "Analytics", status: "missing", description: "No analytics implementation" }
      ]
    },
    {
      category: "Communication",
      items: [
        { name: "Messaging System", status: "working", description: "Basic messaging implemented" },
        { name: "Contact Forms", status: "working", description: "Contact form with email integration" },
        { name: "Notifications", status: "missing", description: "No notification system" },
        { name: "WhatsApp Integration", status: "missing", description: "No WhatsApp integration" }
      ]
    },
    {
      category: "Payments & Escrow",
      items: [
        { name: "Payment Processing", status: "partial", description: "Escrow structure exists but not functional" },
        { name: "Rent Collection", status: "missing", description: "No automated rent collection" },
        { name: "Security Deposits", status: "missing", description: "No deposit management" }
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'working':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'partial':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'missing':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Settings className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      working: "bg-green-100 text-green-800",
      partial: "bg-yellow-100 text-yellow-800",
      missing: "bg-red-100 text-red-800"
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800"}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-8 p-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">PHCityRent App Assessment</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Comprehensive analysis of current features and their implementation status
        </p>
      </div>

      <div className="grid gap-6">
        {features.map((category, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-xl">{category.category}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {category.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(item.status)}
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    </div>
                    {getStatusBadge(item.status)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AppAssessment;
