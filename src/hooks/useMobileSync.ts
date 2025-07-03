import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useMobileSync = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  const syncData = async () => {
    setIsSyncing(true);
    try {
      // Sync properties
      const { data: properties } = await supabase
        .from('properties')
        .select('*')
        .eq('is_available', true)
        .order('updated_at', { ascending: false });

      if (properties) {
        localStorage.setItem('cached_properties', JSON.stringify(properties));
        localStorage.setItem('last_sync', new Date().toISOString());
        setLastSync(new Date());
      }
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  return { isSyncing, lastSync, syncData };
};