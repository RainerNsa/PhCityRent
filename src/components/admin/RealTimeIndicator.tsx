
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff } from 'lucide-react';

interface RealTimeIndicatorProps {
  isConnected: boolean;
}

const RealTimeIndicator = ({ isConnected }: RealTimeIndicatorProps) => {
  return (
    <Badge 
      variant={isConnected ? "default" : "secondary"}
      className={`flex items-center gap-1 ${
        isConnected ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
      }`}
    >
      {isConnected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
      {isConnected ? 'Live' : 'Offline'}
    </Badge>
  );
};

export default RealTimeIndicator;
