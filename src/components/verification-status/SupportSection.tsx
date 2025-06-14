
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Calendar } from 'lucide-react';

const SupportSection = () => {
  return (
    <Card className="p-6 text-center">
      <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
      <p className="text-gray-600 mb-4">
        Have questions about your verification? Contact our support team.
      </p>
      <div className="flex justify-center gap-3">
        <Button variant="outline">
          <Phone className="w-4 h-4 mr-2" />
          WhatsApp Support
        </Button>
        <Button variant="outline">
          <Calendar className="w-4 h-4 mr-2" />
          Schedule Call
        </Button>
      </div>
    </Card>
  );
};

export default SupportSection;
