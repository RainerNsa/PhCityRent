
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Shield, UserCheck, CreditCard, FileText, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const TenantScreening = () => {
  const [selectedTenant, setSelectedTenant] = useState('');
  const [isScreening, setIsScreening] = useState(false);
  const [screeningProgress, setScreeningProgress] = useState(0);
  const { toast } = useToast();

  const screeningData = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+234 801 234 5678',
      status: 'completed',
      creditScore: 720,
      backgroundCheck: 'passed',
      employmentVerified: true,
      riskLevel: 'low',
      applicationDate: '2025-01-15'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+234 803 456 7890',
      status: 'in_progress',
      creditScore: null,
      backgroundCheck: 'pending',
      employmentVerified: false,
      riskLevel: 'medium',
      applicationDate: '2025-01-18'
    },
    {
      id: 3,
      name: 'Mike Peters',
      email: 'mike.peters@email.com',
      phone: '+234 805 678 9012',
      status: 'failed',
      creditScore: 580,
      backgroundCheck: 'failed',
      employmentVerified: true,
      riskLevel: 'high',
      applicationDate: '2025-01-12'
    }
  ];

  const screeningMetrics = [
    { label: 'Total Screenings', value: '156', change: '+23%' },
    { label: 'Pass Rate', value: '78%', change: '+5%' },
    { label: 'Average Score', value: '685', change: '+12' },
    { label: 'Processing Time', value: '2.5h', change: '-30min' }
  ];

  const handleRunScreening = async () => {
    setIsScreening(true);
    setScreeningProgress(0);

    // Simulate screening process
    const steps = ['Identity Verification', 'Credit Check', 'Background Check', 'Employment Verification', 'Reference Check'];
    
    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setScreeningProgress((i + 1) * 20);
      
      toast({
        title: `${steps[i]} Complete`,
        description: `Step ${i + 1} of ${steps.length} completed successfully.`,
      });
    }

    setIsScreening(false);
    toast({
      title: "Screening Complete!",
      description: "Tenant screening has been completed successfully.",
    });
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'default';
      case 'medium': return 'secondary';
      case 'high': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in_progress': return <Clock className="w-4 h-4 text-orange-600" />;
      case 'failed': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Tenant Screening</h2>
        <p className="text-gray-600">Automated background and credit checks for tenant applications</p>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="screening">Run Screening</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {screeningMetrics.map((metric, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <p className="text-xs text-muted-foreground">{metric.change} from last month</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Screening Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {screeningData.slice(0, 3).map((tenant) => (
                  <div key={tenant.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(tenant.status)}
                      <div>
                        <h4 className="font-medium">{tenant.name}</h4>
                        <p className="text-sm text-gray-600">{tenant.email}</p>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <Badge variant={getRiskBadgeColor(tenant.riskLevel)}>
                        {tenant.riskLevel.toUpperCase()} RISK
                      </Badge>
                      {tenant.creditScore && (
                        <div className="text-sm text-gray-600">
                          Credit: {tenant.creditScore}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="screening" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserCheck className="w-5 h-5" />
                <span>Initiate Tenant Screening</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tenant Full Name</label>
                  <Input placeholder="Enter tenant's full name" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <Input type="email" placeholder="tenant@email.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <Input placeholder="+234 xxx xxx xxxx" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Property Applied For</label>
                  <Input placeholder="Property reference or address" />
                </div>
              </div>

              {isScreening && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Screening in progress...</span>
                    <span>{screeningProgress}%</span>
                  </div>
                  <Progress value={screeningProgress} />
                </div>
              )}

              <Button
                onClick={handleRunScreening}
                disabled={isScreening}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
              >
                <Shield className="w-4 h-4 mr-2" />
                {isScreening ? 'Screening in Progress...' : 'Run Comprehensive Screening'}
              </Button>

              <div className="text-sm text-gray-600 space-y-1">
                <p className="font-medium">Screening includes:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Identity verification and document validation</li>
                  <li>Credit score and payment history analysis</li>
                  <li>Criminal background check</li>
                  <li>Employment and income verification</li>
                  <li>Previous rental history and references</li>
                  <li>Social media and online presence review</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          <div className="space-y-4">
            {screeningData.map((tenant) => (
              <Card key={tenant.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        {getStatusIcon(tenant.status)}
                        <span>{tenant.name}</span>
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        Applied on {new Date(tenant.applicationDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={getRiskBadgeColor(tenant.riskLevel)}>
                      {tenant.riskLevel.toUpperCase()} RISK
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium flex items-center">
                        <CreditCard className="w-4 h-4 mr-1" />
                        Credit Score
                      </p>
                      <p className="text-2xl font-bold text-blue-600">
                        {tenant.creditScore || 'Pending'}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium flex items-center">
                        <FileText className="w-4 h-4 mr-1" />
                        Background Check
                      </p>
                      <Badge variant={tenant.backgroundCheck === 'passed' ? 'default' : 
                                   tenant.backgroundCheck === 'failed' ? 'destructive' : 'secondary'}>
                        {tenant.backgroundCheck.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium flex items-center">
                        <UserCheck className="w-4 h-4 mr-1" />
                        Employment
                      </p>
                      <Badge variant={tenant.employmentVerified ? 'default' : 'secondary'}>
                        {tenant.employmentVerified ? 'VERIFIED' : 'PENDING'}
                      </Badge>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium">Overall Status</p>
                      <Badge variant={tenant.status === 'completed' ? 'default' : 
                                   tenant.status === 'failed' ? 'destructive' : 'secondary'}>
                        {tenant.status.toUpperCase().replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <FileText className="w-4 h-4 mr-1" />
                        View Full Report
                      </Button>
                      <Button variant="outline" size="sm">
                        Download PDF
                      </Button>
                      {tenant.status === 'completed' && (
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          Approve Application
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Screening Analytics & Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Success Metrics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Applications Screened</span>
                      <span className="font-medium">156</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Average Processing Time</span>
                      <span className="font-medium">2.5 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Pass Rate</span>
                      <span className="font-medium text-green-600">78%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">High Risk Identified</span>
                      <span className="font-medium text-red-600">12%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Risk Distribution</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Low Risk</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-gray-200 rounded">
                          <div className="w-16 h-2 bg-green-500 rounded"></div>
                        </div>
                        <span className="text-sm">65%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Medium Risk</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-gray-200 rounded">
                          <div className="w-6 h-2 bg-yellow-500 rounded"></div>
                        </div>
                        <span className="text-sm">23%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">High Risk</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-gray-200 rounded">
                          <div className="w-3 h-2 bg-red-500 rounded"></div>
                        </div>
                        <span className="text-sm">12%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TenantScreening;
