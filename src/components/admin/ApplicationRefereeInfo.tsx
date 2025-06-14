
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare } from 'lucide-react';

interface RefereeVerification {
  status: string;
  referee_full_name: string;
  referee_whatsapp_number: string;
  referee_role: string;
}

interface ApplicationRefereeInfoProps {
  refereeVerifications: RefereeVerification[];
}

const ApplicationRefereeInfo = ({ refereeVerifications }: ApplicationRefereeInfoProps) => {
  if (!refereeVerifications || refereeVerifications.length === 0) {
    return null;
  }

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-3 flex items-center gap-2">
        <MessageSquare className="w-4 h-4" />
        Referee Information
      </h3>
      {refereeVerifications.map((referee, index) => (
        <div key={index} className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div>
              <span className="text-gray-500">Name:</span>
              <p className="font-medium">{referee.referee_full_name}</p>
            </div>
            <div>
              <span className="text-gray-500">Phone:</span>
              <p>{referee.referee_whatsapp_number}</p>
            </div>
            <div>
              <span className="text-gray-500">Role:</span>
              <p>{referee.referee_role}</p>
            </div>
          </div>
          <Badge className={
            referee.status === 'confirmed' 
              ? 'bg-green-100 text-green-800'
              : referee.status === 'failed'
              ? 'bg-red-100 text-red-800'
              : 'bg-yellow-100 text-yellow-800'
          }>
            {referee.status.toUpperCase()}
          </Badge>
        </div>
      ))}
    </Card>
  );
};

export default ApplicationRefereeInfo;
