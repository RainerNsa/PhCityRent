
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import ApplicationStatusTracker from '@/components/rental/ApplicationStatusTracker';
import { FileText, Plus, CheckCircle, AlertCircle } from 'lucide-react';

const ApplicationsContent = () => {
  return (
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
            {/* Sample application status */}
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
            
            {/* Legacy application cards */}
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
};

export default ApplicationsContent;
