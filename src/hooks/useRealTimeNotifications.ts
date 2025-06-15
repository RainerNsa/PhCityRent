
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  type: "property_inquiry" | "status_update" | "message" | "system" | "property_alert";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

export const useRealTimeNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;

    // Set up real-time subscription for property inquiries
    const propertyInquiriesChannel = supabase
      .channel('property-inquiries-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'property_inquiries'
        },
        (payload) => {
          const newNotification: Notification = {
            id: payload.new.id,
            type: 'property_inquiry',
            title: 'New Property Inquiry',
            message: `${payload.new.inquirer_name} is interested in your property`,
            timestamp: new Date(payload.new.created_at),
            read: false,
            metadata: payload.new
          };
          
          setNotifications(prev => [newNotification, ...prev]);
          
          toast({
            title: "New Property Inquiry",
            description: `${payload.new.inquirer_name} is interested in your property`,
          });
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
      });

    // Set up real-time subscription for messages
    const messagesChannel = supabase
      .channel('messages-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `recipient_id=eq.${user.id}`
        },
        (payload) => {
          const newNotification: Notification = {
            id: payload.new.id,
            type: 'message',
            title: 'New Message',
            message: payload.new.subject || 'You have a new message',
            timestamp: new Date(payload.new.created_at),
            read: false,
            actionUrl: '/messages',
            metadata: payload.new
          };
          
          setNotifications(prev => [newNotification, ...prev]);
          
          toast({
            title: "New Message",
            description: payload.new.subject || 'You have a new message',
          });
        }
      )
      .subscribe();

    // Set up real-time subscription for property alerts
    const propertyAlertsChannel = supabase
      .channel('property-alerts-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'property_alerts',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const newNotification: Notification = {
            id: payload.new.id,
            type: 'property_alert',
            title: 'Property Alert',
            message: `New property matches your saved search criteria`,
            timestamp: new Date(payload.new.created_at),
            read: false,
            actionUrl: '/tenant-portal?tab=alerts',
            metadata: payload.new
          };
          
          setNotifications(prev => [newNotification, ...prev]);
          
          toast({
            title: "Property Alert",
            description: "New property matches your saved search criteria",
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(propertyInquiriesChannel);
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(propertyAlertsChannel);
      setIsConnected(false);
    };
  }, [user, toast]);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    unreadCount,
    isConnected,
    markAsRead,
    markAllAsRead,
    deleteNotification
  };
};
