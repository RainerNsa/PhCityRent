import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/Footer';
import EnhancedBreadcrumb from '@/components/ui/enhanced-breadcrumb';
import QuickContactAgent from '@/components/tenant/QuickContactAgent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, ArrowLeft, Users, Clock, Shield } from 'lucide-react';

const ContactAgent = () => {
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
      navigate('/tenant-portal?tab=messages');
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
              { label: 'Contact Agent' }
            ]} 
          />

          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-8 mb-8 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
                  <MessageSquare className="w-8 h-8" />
                  Contact Agent
                </h1>
                <p className="text-green-100 text-lg">
                  Connect with verified agents and landlords in Port Harcourt for property inquiries
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
              <QuickContactAgent 
                onSuccess={handleSuccess}
                onCancel={handleCancel}
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Why Contact Agents */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="w-5 h-5 text-green-500" />
                    Why Contact Our Agents?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Verified Professionals</h4>
                      <p className="text-sm text-gray-600">All our agents and landlords are verified and licensed to operate in Port Harcourt.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Quick Response</h4>
                      <p className="text-sm text-gray-600">Get responses within 24 hours for all property inquiries and viewing requests.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <MessageSquare className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Direct Communication</h4>
                      <p className="text-sm text-gray-600">Communicate directly with property owners and agents through our secure messaging system.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Message Tips */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tips for Better Responses</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0 mt-2"></span>
                      <span>Be specific about your requirements and budget</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0 mt-2"></span>
                      <span>Mention your preferred move-in date</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0 mt-2"></span>
                      <span>Ask about viewing availability upfront</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0 mt-2"></span>
                      <span>Include questions about amenities and lease terms</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0 mt-2"></span>
                      <span>Be professional and courteous in your communication</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Popular Areas */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Popular Areas in Port Harcourt</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="p-2 bg-gray-50 rounded text-sm">
                      <strong>GRA Phase 1 & 2</strong> - Premium residential area
                    </div>
                    <div className="p-2 bg-gray-50 rounded text-sm">
                      <strong>Ada George</strong> - Family-friendly neighborhood
                    </div>
                    <div className="p-2 bg-gray-50 rounded text-sm">
                      <strong>D-Line</strong> - Central business district
                    </div>
                    <div className="p-2 bg-gray-50 rounded text-sm">
                      <strong>Woji</strong> - Modern residential development
                    </div>
                    <div className="p-2 bg-gray-50 rounded text-sm">
                      <strong>New Layout</strong> - Affordable housing options
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Platform Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-600">150+</div>
                      <div className="text-xs text-gray-600">Verified Agents</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">24h</div>
                      <div className="text-xs text-gray-600">Avg Response</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">95%</div>
                      <div className="text-xs text-gray-600">Success Rate</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">1000+</div>
                      <div className="text-xs text-gray-600">Happy Tenants</div>
                    </div>
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

export default ContactAgent;
