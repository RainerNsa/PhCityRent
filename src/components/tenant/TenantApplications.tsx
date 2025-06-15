
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';

const TenantApplications = () => {
  // Mock data for now - this would come from a hook/API
  const applications = [
    {
      id: '1',
      propertyTitle: '3-Bedroom Apartment in GRA',
      propertyLocation: 'Port Harcourt GRA Phase 2',
      status: 'pending',
      submittedAt: '2024-01-15',
      rent: 800000,
    },
    {
      id: '2',
      propertyTitle: '2-Bedroom House in Ada George',
      propertyLocation: 'Ada George Road',
      status: 'approved',
      submittedAt: '2024-01-10',
      rent: 600000,
    },
    {
      id: '3',
      propertyTitle: 'Studio Apartment in Town',
      propertyLocation: 'Port Harcourt Township',
      status: 'rejected',
      submittedAt: '2024-01-05',
      rent: 400000,
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-500" />
            Rental Applications
          </CardTitle>
          <CardDescription>Track the status of your rental applications</CardDescription>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Yet</h3>
              <p className="text-gray-600 mb-4">You haven't submitted any rental applications yet.</p>
              <Button>Browse Properties</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((application) => (
                <div key={application.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{application.propertyTitle}</h3>
                        <Badge className={`flex items-center gap-1 ${getStatusColor(application.status)}`}>
                          {getStatusIcon(application.status)}
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm mb-1">{application.propertyLocation}</p>
                      <p className="text-gray-500 text-sm">
                        Submitted on {new Date(application.submittedAt).toLocaleDateString()}
                      </p>
                      <p className="text-orange-600 font-medium mt-1">
                        ₦{application.rent.toLocaleString()}/year
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Application Guidelines</CardTitle>
          <CardDescription>Tips for successful rental applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium">Complete Your Profile</h4>
                <p className="text-sm text-gray-600">Ensure all your personal information is accurate and up-to-date</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium">Provide References</h4>
                <p className="text-sm text-gray-600">Include previous landlord references and employment verification</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium">Be Responsive</h4>
                <p className="text-sm text-gray-600">Respond quickly to landlord inquiries and requests for additional information</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TenantApplications;
