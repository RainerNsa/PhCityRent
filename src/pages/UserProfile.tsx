
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/Footer';
import EnhancedBreadcrumb from '@/components/ui/enhanced-breadcrumb';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SavedPropertiesList from '@/components/properties/SavedPropertiesList';
import SavedSearches from '@/components/tenant/SavedSearches';
import { useAuth } from '@/hooks/useAuth';
import { User, Heart, Bell, Settings, Edit2, Shield, Mail, Phone, MapPin } from 'lucide-react';

const UserProfile = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'profile';
  const [isEditing, setIsEditing] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar />
        <main className="pt-20 pb-12">
          <div className="container mx-auto px-4 text-center">
            <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md mx-auto">
              <Shield className="w-16 h-16 text-orange-500 mx-auto mb-6" />
              <h1 className="text-2xl font-bold mb-4 text-gray-900">Authentication Required</h1>
              <p className="text-gray-600 mb-6">Please sign in to view your profile</p>
              <EnhancedButton onClick={() => window.location.href = '/auth'}>
                Sign In
              </EnhancedButton>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <EnhancedBreadcrumb 
              items={[{ label: 'My Profile' }]} 
            />

            {/* Enhanced Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 mb-8 text-white shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">My Profile</h1>
                  <p className="text-orange-100 text-lg">
                    Manage your account, saved properties, and preferences
                  </p>
                </div>
                <div className="hidden md:flex items-center justify-center w-20 h-20 bg-white/20 rounded-full">
                  <User className="w-10 h-10" />
                </div>
              </div>
            </div>

            <Tabs defaultValue={defaultTab} className="space-y-8">
              <TabsList className="grid w-full grid-cols-4 bg-white shadow-lg rounded-xl p-2">
                <TabsTrigger value="profile" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white rounded-lg">
                  <User className="w-4 h-4" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="saved" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white rounded-lg">
                  <Heart className="w-4 h-4" />
                  Saved
                </TabsTrigger>
                <TabsTrigger value="alerts" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white rounded-lg">
                  <Bell className="w-4 h-4" />
                  Alerts
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white rounded-lg">
                  <Settings className="w-4 h-4" />
                  Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-xl">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-2xl text-gray-900">Personal Information</CardTitle>
                        <CardDescription className="text-gray-600">Manage your account details and preferences</CardDescription>
                      </div>
                      <EnhancedButton
                        variant={isEditing ? "outline" : "secondary"}
                        onClick={() => setIsEditing(!isEditing)}
                        className="flex items-center gap-2"
                      >
                        <Edit2 className="w-4 h-4" />
                        {isEditing ? 'Cancel' : 'Edit'}
                      </EnhancedButton>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2 text-gray-700 font-medium">
                          <Mail className="w-4 h-4" />
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          value={user.email || ''}
                          disabled
                          className="h-12 bg-gray-50 border-gray-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="name" className="flex items-center gap-2 text-gray-700 font-medium">
                          <User className="w-4 h-4" />
                          Full Name
                        </Label>
                        <Input
                          id="name"
                          value={user.user_metadata?.full_name || ''}
                          disabled={!isEditing}
                          className="h-12 border-gray-200 focus:border-orange-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="flex items-center gap-2 text-gray-700 font-medium">
                          <Phone className="w-4 h-4" />
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          value={user.user_metadata?.phone || ''}
                          disabled={!isEditing}
                          className="h-12 border-gray-200 focus:border-orange-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location" className="flex items-center gap-2 text-gray-700 font-medium">
                          <MapPin className="w-4 h-4" />
                          Preferred Location
                        </Label>
                        <Input
                          id="location"
                          value={user.user_metadata?.location || ''}
                          disabled={!isEditing}
                          className="h-12 border-gray-200 focus:border-orange-500"
                        />
                      </div>
                    </div>
                    
                    {isEditing && (
                      <div className="flex gap-4 pt-6 border-t">
                        <EnhancedButton variant="primary">
                          Save Changes
                        </EnhancedButton>
                        <EnhancedButton variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </EnhancedButton>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="saved">
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-xl">
                    <CardTitle className="text-2xl text-gray-900 flex items-center gap-2">
                      <Heart className="w-6 h-6 text-red-500" />
                      Saved Properties
                    </CardTitle>
                    <CardDescription>Properties you've saved for later viewing</CardDescription>
                  </CardHeader>
                  <CardContent className="p-8">
                    <SavedPropertiesList />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="alerts">
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-xl">
                    <CardTitle className="text-2xl text-gray-900 flex items-center gap-2">
                      <Bell className="w-6 h-6 text-orange-500" />
                      Property Alerts
                    </CardTitle>
                    <CardDescription>Manage your saved searches and alert preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="p-8">
                    <SavedSearches />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings">
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-xl">
                    <CardTitle className="text-2xl text-gray-900 flex items-center gap-2">
                      <Settings className="w-6 h-6 text-gray-600" />
                      Account Settings
                    </CardTitle>
                    <CardDescription>Manage your account preferences and security</CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 space-y-8">
                    <div className="space-y-6">
                      <h4 className="font-semibold text-lg text-gray-900">Email Preferences</h4>
                      <div className="space-y-4">
                        {[
                          { id: 'alerts', label: 'New property alerts', defaultChecked: true },
                          { id: 'price', label: 'Price drop notifications', defaultChecked: true },
                          { id: 'newsletter', label: 'Weekly newsletter', defaultChecked: false }
                        ].map((pref) => (
                          <label key={pref.id} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                            <input 
                              type="checkbox" 
                              defaultChecked={pref.defaultChecked} 
                              className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500" 
                            />
                            <span className="text-gray-700 font-medium">{pref.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div className="pt-8 border-t border-gray-200">
                      <EnhancedButton variant="destructive" className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Delete Account
                      </EnhancedButton>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserProfile;
