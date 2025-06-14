
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useRealTimeUpdates = (tableName: string, callback?: () => void) => {
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const channel = supabase
      .channel(`${tableName}-changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: tableName
        },
        (payload) => {
          console.log(`Real-time update on ${tableName}:`, payload);
          
          // Show toast notification for updates
          if (payload.eventType === 'UPDATE') {
            toast({
              title: "Update Received",
              description: `${tableName} has been updated in real-time`,
            });
          }
          
          // Call the callback function if provided
          if (callback) {
            callback();
          }
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
        if (status === 'SUBSCRIBED') {
          console.log(`Real-time connection established for ${tableName}`);
        }
      });

    return () => {
      supabase.removeChannel(channel);
      setIsConnected(false);
    };
  }, [tableName, callback, toast]);

  return { isConnected };
};
