
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, Clock, AlertTriangle, Database, Upload, Settings } from 'lucide-react';

const ImplementationPlan = () => {
  const [activePhase, setActivePhase] = useState('phase1');

  const phases = {
    phase1: {
      title: "Phase 1: Core Infrastructure (Week 1-2)",
      priority: "high",
      items: [
        {
          task: "Set up Supabase Storage for images",
          status: "pending",
          description: "Configure storage buckets and policies for property images",
          technical: "Create storage buckets, RLS policies, upload functions"
        },
        {
          task: "Implement image upload functionality",
          status: "pending", 
          description: "Add image upload components with compression and validation",
          technical: "React dropzone, image compression, file validation"
        },
        {
          task: "Fix property creation workflow",
          status: "pending",
          description: "Complete property creation with image association",
          technical: "Form validation, database relations, error handling"
        },
        {
          task: "Enhance user role management",
          status: "pending",
          description: "Implement proper role-based access control",
          technical: "RLS policies, role checking hooks, route protection"
        }
      ]
    },
    phase2: {
      title: "Phase 2: Portal Enhancements (Week 3-4)", 
      priority: "high",
      items: [
        {
          task: "Complete Agent Portal functionality",
          status: "pending",
          description: "Property management, commission tracking, client management",
          technical: "CRUD operations, analytics, dashboard widgets"
        },
        {
          task: "Enhance Landlord Portal",
          status: "pending",
          description: "Tenant management, maintenance requests, rental agreements",
          technical: "Relationship management, document generation, workflow"
        },
        {
          task: "Build Admin Management system",
          status: "pending", 
          description: "User management, content moderation, system analytics",
          technical: "Admin dashboard, approval workflows, reporting"
        },
        {
          task: "Implement notification system",
          status: "pending",
          description: "Real-time notifications for all user types",
          technical: "WebSocket connections, push notifications, email alerts"
        }
      ]
    },
    phase3: {
      title: "Phase 3: Advanced Features (Week 5-6)",
      priority: "medium",
      items: [
        {
          task: "Payment & Escrow system",
          status: "pending",
          description: "Secure payment processing and escrow management",
          technical: "Payment gateway integration, escrow workflow, transaction tracking"
        },
        {
          task: "WhatsApp integration",
          status: "pending",
          description: "WhatsApp messaging for property inquiries",
          technical: "WhatsApp Business API, message templates, automation"
        },
        {
          task: "Advanced analytics",
          status: "pending",
          description: "Comprehensive analytics and reporting for all users",
          technical: "Data aggregation, chart libraries, export functionality"
        },
        {
          task: "Mobile optimization",
          status: "pending",
          description: "PWA features and mobile-first optimizations",
          technical: "Service workers, offline functionality, responsive design"
        }
      ]
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'pending':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Settings className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8 p-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Frontend-Backend Integration Plan</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Comprehensive roadmap to sync all frontend features with backend functionality
        </p>
      </div>

      <Tabs value={activePhase} onValueChange={setActivePhase}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="phase1" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Phase 1
          </TabsTrigger>
          <TabsTrigger value="phase2" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Phase 2
          </TabsTrigger>
          <TabsTrigger value="phase3" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Phase 3
          </TabsTrigger>
        </TabsList>

        {Object.entries(phases).map(([key, phase]) => (
          <TabsContent key={key} value={key}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{phase.title}</CardTitle>
                  <Badge className={getPriorityColor(phase.priority)}>
                    {phase.priority} priority
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {phase.items.map((item, index) => (
                    <Card key={index} className="border-l-4 border-l-orange-500">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(item.status)}
                            <h3 className="font-semibold">{item.task}</h3>
                          </div>
                          <Badge variant="outline">{item.status}</Badge>
                        </div>
                        
                        <p className="text-gray-600 mb-3">{item.description}</p>
                        
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm font-medium text-gray-700 mb-1">Technical Requirements:</p>
                          <p className="text-sm text-gray-600">{item.technical}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Phase Completion Criteria:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• All tasks completed and tested</li>
                    <li>• Integration tests passing</li>
                    <li>• User acceptance testing completed</li>
                    <li>• Documentation updated</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-orange-800">Quick Start Actions</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Button 
              onClick={() => window.location.href = '/admin/seed-data'}
              className="justify-start"
            >
              <Database className="w-4 h-4 mr-2" />
              Set up test data
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.location.href = '/property-management'}
              className="justify-start"
            >
              <Upload className="w-4 h-4 mr-2" />
              Test property creation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImplementationPlan;
