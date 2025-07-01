
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Bell, RefreshCw, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

const AutomatedWorkflows = () => {
  const [workflows, setWorkflows] = useState({
    leaseRenewals: true,
    paymentReminders: true,
    maintenanceFollowups: false,
    documentExpiration: true
  });
  const { toast } = useToast();

  const workflowData = {
    leaseRenewals: {
      active: 12,
      upcoming: 8,
      completed: 45
    },
    paymentReminders: {
      active: 23,
      upcoming: 15,
      completed: 156
    },
    maintenance: {
      active: 5,
      upcoming: 3,
      completed: 28
    }
  };

  const handleWorkflowToggle = (workflow: string, enabled: boolean) => {
    setWorkflows(prev => ({ ...prev, [workflow]: enabled }));
    toast({
      title: `Workflow ${enabled ? 'Enabled' : 'Disabled'}`,
      description: `${workflow} automation has been ${enabled ? 'activated' : 'deactivated'}.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Automated Workflows</h2>
        <p className="text-gray-600">Streamline your rental management with intelligent automation</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="lease-renewals">Lease Renewals</TabsTrigger>
          <TabsTrigger value="payments">Payment Reminders</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Workflows</CardTitle>
                <RefreshCw className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">40</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">Automated actions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Actions</CardTitle>
                <Clock className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">26</div>
                <p className="text-xs text-muted-foreground">Scheduled for today</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <AlertTriangle className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">96%</div>
                <p className="text-xs text-muted-foreground">Last 30 days</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Workflow Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Lease Renewal Automation</label>
                  <p className="text-xs text-gray-500">Send renewal notices 60 days before expiration</p>
                </div>
                <Switch
                  checked={workflows.leaseRenewals}
                  onCheckedChange={(checked) => handleWorkflowToggle('leaseRenewals', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Payment Reminders</label>
                  <p className="text-xs text-gray-500">Automatic payment reminders and follow-ups</p>
                </div>
                <Switch
                  checked={workflows.paymentReminders}
                  onCheckedChange={(checked) => handleWorkflowToggle('paymentReminders', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Maintenance Follow-ups</label>
                  <p className="text-xs text-gray-500">Track and follow up on maintenance requests</p>
                </div>
                <Switch
                  checked={workflows.maintenanceFollowups}
                  onCheckedChange={(checked) => handleWorkflowToggle('maintenanceFollowups', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Document Expiration Alerts</label>
                  <p className="text-xs text-gray-500">Alert when contracts or documents expire</p>
                </div>
                <Switch
                  checked={workflows.documentExpiration}
                  onCheckedChange={(checked) => handleWorkflowToggle('documentExpiration', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lease-renewals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Lease Renewal Pipeline</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Sunset Gardens Apt 3B</h4>
                    <p className="text-sm text-gray-600">Expires: March 15, 2025</p>
                  </div>
                  <Badge variant="outline">Notice Sent</Badge>
                </div>

                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Palm View Estate Unit 12</h4>
                    <p className="text-sm text-gray-600">Expires: April 2, 2025</p>
                  </div>
                  <Badge variant="secondary">Pending Response</Badge>
                </div>

                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">GRA Complex Floor 2</h4>
                    <p className="text-sm text-gray-600">Expires: May 10, 2025</p>
                  </div>
                  <Badge variant="default">Renewed</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Payment Reminder Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">John Doe - Sunset Gardens</h4>
                    <p className="text-sm text-gray-600">₦500,000 due • 3 days overdue</p>
                  </div>
                  <Badge variant="destructive">Final Notice</Badge>
                </div>

                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Sarah Johnson - Palm View</h4>
                    <p className="text-sm text-gray-600">₦750,000 due • Due tomorrow</p>
                  </div>
                  <Badge variant="secondary">Reminder Sent</Badge>
                </div>

                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Mike Peters - GRA Complex</h4>
                    <p className="text-sm text-gray-600">₦400,000 due • Due in 5 days</p>
                  </div>
                  <Badge variant="outline">Scheduled</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Workflow Automation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Plumbing Issue - Unit 5A</h4>
                    <p className="text-sm text-gray-600">Follow-up scheduled for tomorrow</p>
                  </div>
                  <Badge variant="secondary">In Progress</Badge>
                </div>

                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">AC Repair - Unit 8B</h4>
                    <p className="text-sm text-gray-600">Completed • Feedback requested</p>
                  </div>
                  <Badge variant="default">Completed</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AutomatedWorkflows;
