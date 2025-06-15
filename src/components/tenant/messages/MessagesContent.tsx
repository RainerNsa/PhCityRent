
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, User } from 'lucide-react';

const MessagesContent = () => {
  return (
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
};

export default MessagesContent;
