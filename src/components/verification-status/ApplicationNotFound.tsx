
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';

const ApplicationNotFound = () => {
  return (
    <Card className="p-8 text-center">
      <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">Application Not Found</h3>
      <p className="text-gray-600 mb-4">
        We couldn't find an application with that Agent ID. Please check your ID and try again.
      </p>
      <Button variant="outline">Contact Support</Button>
    </Card>
  );
};

export default ApplicationNotFound;
