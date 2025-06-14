
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface NotificationData {
  type: 'status_update' | 'referee_contact' | 'welcome';
  applicationId: string;
  recipientEmail?: string;
  recipientPhone?: string;
  data?: Record<string, any>;
}

export const useNotifications = () => {
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const sendNotification = async (notificationData: NotificationData) => {
    setSending(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('send-notification', {
        body: notificationData
      });

      if (error) throw error;

      toast({
        title: "Notification Sent",
        description: "Notification has been sent successfully",
      });

      return { success: true, data };
    } catch (error) {
      console.error('Notification error:', error);
      toast({
        title: "Notification Failed",
        description: "Failed to send notification",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    } finally {
      setSending(false);
    }
  };

  const sendStatusUpdateNotification = async (applicationId: string, newStatus: string, oldStatus: string) => {
    return sendNotification({
      type: 'status_update',
      applicationId,
      data: { newStatus, oldStatus }
    });
  };

  const sendRefereeContactNotification = async (applicationId: string, refereePhone: string) => {
    return sendNotification({
      type: 'referee_contact',
      applicationId,
      recipientPhone: refereePhone,
      data: { refereePhone }
    });
  };

  const sendWelcomeNotification = async (applicationId: string, recipientEmail?: string) => {
    return sendNotification({
      type: 'welcome',
      applicationId,
      recipientEmail,
    });
  };

  return {
    sendNotification,
    sendStatusUpdateNotification,
    sendRefereeContactNotification,
    sendWelcomeNotification,
    sending
  };
};
