
import React from 'react';
import { Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface NotificationStatusIndicatorProps {
  isConnected: boolean;
  unreadCount: number;
}

const NotificationStatusIndicator = ({ isConnected, unreadCount }: NotificationStatusIndicatorProps) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {isConnected ? (
          <Wifi className="w-3 h-3 text-green-500" />
        ) : (
          <WifiOff className="w-3 h-3 text-red-500" />
        )}
        <span className="text-xs text-gray-500">
          {isConnected ? 'Live' : 'Offline'}
        </span>
      </div>
      
      {unreadCount > 0 && (
        <Badge variant="destructive" className="text-xs">
          {unreadCount} new
        </Badge>
      )}
    </div>
  );
};

export default NotificationStatusIndicator;
