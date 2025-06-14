
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Phone } from 'lucide-react';

interface RefereeStatusProps {
  refereeStatus: string;
}

const RefereeStatus = ({ refereeStatus }: RefereeStatusProps) => {
  if (!refereeStatus) return null;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-3">Referee Verification</h3>
      <div className="flex items-center gap-3">
        <Phone className="w-5 h-5 text-blue-500" />
        <div>
          <p className="font-medium">Referee Status</p>
          <Badge className={
            refereeStatus === "confirmed" 
              ? "bg-green-100 text-green-800"
              : refereeStatus === "failed"
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800"
          }>
            {refereeStatus.toUpperCase()}
          </Badge>
        </div>
      </div>
    </Card>
  );
};

export default RefereeStatus;
