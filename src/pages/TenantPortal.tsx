import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import SavedPropertiesList from '@/components/properties/SavedPropertiesList';
import SavedSearches from '@/components/tenant/SavedSearches';
import { 
  User, 
  Home, 
  Bell, 
  FileText, 
  MessageSquare, 
  Settings,
  Heart,
  Search,
  Shield,
  Trash2,
  Edit,
  MapPin,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ApplicationStatusTracker from '@/components/rental/ApplicationStatusTracker';

const TenantPortal = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Dashboard Content
  const DashboardContent = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saved Properties</CardTitle>
            <Heart className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Properties you've liked</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Applications</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Applications in progress</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
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
              <Button className="w-full h-20 flex flex-col items-center justify-center space-y-2" variant="outline">
                <Plus className="w-6 h-6" />
                <span className="text-sm">Create Alert</span>
              </Button>
              <Button className="w-full h-20 flex flex-col items-center justify-center space-y-2" variant="outline">
                <MessageSquare className="w-6 h-6" />
                <span className="text-sm">Contact Agent</span>
              </Button>
              <Button className="w-full h-20 flex flex-col items-center justify-center space-y-2" variant="outline">
                <FileText className="w-6 h-6" />
                <span className="text-sm">Apply Now</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Profile Content
  const ProfileContent = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Full Name</label>
              <Input defaultValue={user?.user_metadata?.full_name || ""} />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input defaultValue={user?.email || ""} disabled />
            </div>
            <div>
              <label className="text-sm font-medium">Phone Number</label>
              <Input placeholder="+234 xxx xxx xxxx" />
            </div>
            <div>
              <label className="text-sm font-medium">Date of Birth</label>
              <Input type="date" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Address</label>
            <Textarea placeholder="Your current address" />
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Employment Information</CardTitle>
          <CardDescription>Provide employment details for rental applications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Employer</label>
              <Input placeholder="Company name" />
            </div>
            <div>
              <label className="text-sm font-medium">Job Title</label>
              <Input placeholder="Your position" />
            </div>
            <div>
              <label className="text-sm font-medium">Monthly Income</label>
              <Input placeholder="₦ 0.00" />
            </div>
            <div>
              <label className="text-sm font-medium">Employment Duration</label>
              <Input placeholder="e.g., 2 years" />
            </div>
          </div>
          <Button>Update Employment Info</Button>
        </CardContent>
      </Card>
    </div>
  );

  // Properties Content
  const PropertiesContent = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                Saved Properties
              </CardTitle>
              <CardDescription>Properties you've bookmarked for later viewing</CardDescription>
            </div>
            <Link to="/properties">
              <Button className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                Browse Properties
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <SavedPropertiesList />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Property Preferences</CardTitle>
          <CardDescription>Set your preferences to get better property recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Budget Range</h4>
              <p className="text-sm text-gray-600">₦200,000 - ₦500,000/year</p>
              <Button variant="outline" size="sm" className="mt-2">Update</Button>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Preferred Areas</h4>
              <p className="text-sm text-gray-600">Port Harcourt, GRA</p>
              <Button variant="outline" size="sm" className="mt-2">Update</Button>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Property Type</h4>
              <p className="text-sm text-gray-600">Apartment, House</p>
              <Button variant="outline" size="sm" className="mt-2">Update</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Alerts Content
  const AlertsContent = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-500" />
            Property Alerts
          </CardTitle>
          <CardDescription>Manage your saved searches and get notified when new properties match your criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <SavedSearches />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>Choose how and when you want to receive notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Email Notifications</h4>
                <p className="text-sm text-gray-600">Receive property alerts via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">SMS Notifications</h4>
                <p className="text-sm text-gray-600">Receive urgent alerts via SMS</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Price Drop Alerts</h4>
                <p className="text-sm text-gray-600">Get notified when saved properties drop in price</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Updated Applications Content
  const ApplicationsContent = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                My Applications
              </CardTitle>
              <CardDescription>Track your rental applications and their status</CardDescription>
            </div>
            <Link to="/apply">
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                New Application
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Sample application status - replace with real data */}
            <ApplicationStatusTracker 
              application={{
                id: '1',
                status: 'under_review',
                submittedAt: '2024-01-15T10:00:00Z',
                updatedAt: '2024-01-16T14:30:00Z',
                propertyTitle: '3-Bedroom Apartment - GRA',
                propertyLocation: 'Port Harcourt, Rivers State',
                adminNotes: 'Application is being reviewed. Background check in progress.'
              }}
            />
            
            <ApplicationStatusTracker 
              application={{
                id: '2',
                status: 'approved',
                submittedAt: '2024-01-10T09:00:00Z',
                updatedAt: '2024-01-12T16:45:00Z',
                propertyTitle: '2-Bedroom House - Old GRA',
                propertyLocation: 'Port Harcourt, Rivers State'
              }}
            />
            
            {/* Legacy application cards for backward compatibility */}
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium">Studio Apartment - D-Line</h4>
                <Badge variant="outline" className="bg-red-50 text-red-700">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Documents Required
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-2">₦250,000/year • Applied 3 days ago</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Application ID: APP-2024-003</span>
                <Button variant="outline" size="sm">View Details</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Application Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Complete all sections</p>
                <p className="text-gray-600">Ensure all required fields are filled out accurately</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Provide accurate information</p>
                <p className="text-gray-600">Any false information may result in application rejection</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Upload required documents</p>
                <p className="text-gray-600">Have your ID, proof of income, and references ready</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Messages Content
  const MessagesContent = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-green-500" />
          Messages
        </CardTitle>
        <CardDescription>Communication with agents and landlords</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="border rounded-lg p-4 hover:bg-gray-50">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium">Agent John Doe</h4>
                  <p className="text-sm text-gray-600">Property viewing confirmation</p>
                </div>
              </div>
              <span className="text-xs text-gray-500">2 hours ago</span>
            </div>
            <p className="text-sm text-gray-700 ml-13">
              Hi there! I've confirmed your viewing appointment for tomorrow at 2 PM. Please bring a valid ID.
            </p>
          </div>

          <div className="border rounded-lg p-4 hover:bg-gray-50">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium">Landlord Mary Smith</h4>
                  <p className="text-sm text-gray-600">Application update</p>
                </div>
              </div>
              <span className="text-xs text-gray-500">1 day ago</span>
            </div>
            <p className="text-sm text-gray-700 ml-13">
              Your application has been approved! Please contact me to discuss the next steps.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Settings Content
  const SettingsContent = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Account Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h4 className="font-medium">Two-Factor Authentication</h4>
            <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
          </div>
          <Button variant="outline">Enable</Button>
        </div>
        
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h4 className="font-medium">Change Password</h4>
            <p className="text-sm text-gray-600">Update your account password</p>
          </div>
          <Button variant="outline">Change</Button>
        </div>
      </CardContent>
    </Card>
  );

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
