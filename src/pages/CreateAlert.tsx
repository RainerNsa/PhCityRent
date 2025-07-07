import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/Footer';
import EnhancedBreadcrumb from '@/components/ui/enhanced-breadcrumb';
import SavedSearchForm from '@/components/tenant/SavedSearchForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, ArrowLeft, CheckCircle } from 'lucide-react';

const CreateAlert = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect to auth if not logged in
  React.useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const handleSuccess = () => {
    // Show success message and redirect
    setTimeout(() => {
      navigate('/tenant-portal?tab=alerts');
    }, 2000);
  };

  const handleCancel = () => {
    navigate(-1); // Go back to previous page
  };

  if (!user) {
    return null; // Will redirect to auth
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <EnhancedBreadcrumb 
            items={[
              { label: 'Tenant Portal', href: '/tenant-portal' },
              { label: 'Create Alert' }
            ]} 
          />

          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-8 mb-8 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
                  <Bell className="w-8 h-8" />
                  Create Property Alert
                </h1>
                <p className="text-blue-100 text-lg">
                  Set up custom alerts to get notified when properties matching your criteria become available
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="bg-white/20 border-white/30 text-white hover:bg-white/30"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-blue-500" />
                    Alert Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SavedSearchForm 
                    onSuccess={handleSuccess}
                    onCancel={handleCancel}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* How it Works */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">How Property Alerts Work</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-blue-600">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Set Your Criteria</h4>
                      <p className="text-sm text-gray-600">Define your ideal property requirements including location, price range, and property type.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-blue-600">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Get Notified</h4>
                      <p className="text-sm text-gray-600">Receive instant notifications via email when new properties match your criteria.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-blue-600">3</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Take Action</h4>
                      <p className="text-sm text-gray-600">View properties immediately and apply before others to secure your ideal rental.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Benefits */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Benefits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>Never miss new properties in Port Harcourt</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>Get notified before properties are widely advertised</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>Save time by focusing on relevant properties</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>Manage multiple alerts for different needs</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Popular Searches */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Popular Searches in Port Harcourt</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start text-left">
                      2-bedroom apartments in GRA
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start text-left">
                      3-bedroom houses in Ada George
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start text-left">
                      1-bedroom flats in D-Line
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start text-left">
                      4-bedroom duplex in Woji
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreateAlert;
