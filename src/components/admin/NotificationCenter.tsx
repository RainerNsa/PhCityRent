
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Bell, Send, Users, MessageSquare, AlertCircle } from 'lucide-react';

interface NotificationCenterProps {
  selectedApplications?: string[];
}

const NotificationCenter = ({ selectedApplications = [] }: NotificationCenterProps) => {
  const [message, setMessage] = useState('');
  const [notificationType, setNotificationType] = useState('update');
  const [sending, setSending] = useState(false);
  const [recentNotifications, setRecentNotifications] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchRecentNotifications();
  }, []);

  const fetchRecentNotifications = async () => {
    // This would fetch from a notifications log table if implemented
    // For now, we'll show a placeholder
    setRecentNotifications([
      { id: 1, type: 'status_update', message: 'Application approved', sent_at: new Date().toISOString(), count: 5 },
      { id: 2, type: 'reminder', message: 'Document review required', sent_at: new Date().toISOString(), count: 3 }
    ]);
  };

  const sendNotifications = async () => {
    if (!message.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message",
        variant: "destructive",
      });
      return;
    }

    setSending(true);
    try {
      let recipients: string[] = [];
      
      if (selectedApplications.length > 0) {
        const { data: applications } = await supabase
          .from('agent_applications')
          .select('whatsapp_number')
          .in('id', selectedApplications);
        
        recipients = applications?.map(app => app.whatsapp_number) || [];
      } else {
        // Send to all applications with pending status
        const { data: applications } = await supabase
          .from('agent_applications')
          .select('whatsapp_number')
          .eq('status', 'pending_review');
        
        recipients = applications?.map(app => app.whatsapp_number) || [];
      }

      // Here you would integrate with your notification service
      // For now, we'll simulate the API call
      console.log('Sending notifications to:', recipients);
      console.log('Message:', message);
      console.log('Type:', notificationType);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "Notifications Sent",
        description: `Sent ${recipients.length} notifications successfully`,
      });

      setMessage('');
      fetchRecentNotifications();
    } catch (error) {
      console.error('Notification error:', error);
      toast({
        title: "Error",
        description: "Failed to send notifications",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const notificationTemplates = {
    update: "Your agent verification application has been updated. Please check your status.",
    reminder: "We need additional information to complete your verification. Please respond promptly.",
    approval: "Congratulations! Your agent verification has been approved.",
    rejection: "We regret to inform you that your application has been rejected. Please contact support for details."
  };

  const useTemplate = (template: string) => {
    setMessage(notificationTemplates[template as keyof typeof notificationTemplates]);
  };

  return (
    <div className="space-y-6">
      {/* Send Notifications */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold">Send Notifications</h3>
          {selectedApplications.length > 0 && (
            <Badge variant="secondary">{selectedApplications.length} selected</Badge>
          )}
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select value={notificationType} onValueChange={setNotificationType}>
              <SelectTrigger>
                <SelectValue placeholder="Notification type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="update">Status Update</SelectItem>
                <SelectItem value="reminder">Reminder</SelectItem>
                <SelectItem value="approval">Approval</SelectItem>
                <SelectItem value="rejection">Rejection</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => useTemplate(notificationType)}
              >
                Use Template
              </Button>
            </div>
          </div>

          <Textarea
            placeholder="Enter your notification message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
          />

          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {selectedApplications.length > 0 
                ? `Will send to ${selectedApplications.length} selected applications`
                : "Will send to all pending applications"
              }
            </p>
            
            <Button 
              onClick={sendNotifications}
              disabled={sending || !message.trim()}
            >
              <Send className="w-4 h-4 mr-2" />
              {sending ? 'Sending...' : 'Send Notifications'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Recent Notifications */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Recent Notifications
        </h3>
        
        <div className="space-y-3">
          {recentNotifications.map((notification) => (
            <div key={notification.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <p className="font-medium">{notification.message}</p>
                <p className="text-sm text-gray-600">
                  {new Date(notification.sent_at).toLocaleString()}
                </p>
              </div>
              <Badge variant="secondary">{notification.count} recipients</Badge>
            </div>
          ))}
          
          {recentNotifications.length === 0 && (
            <p className="text-gray-500 text-center py-4">No recent notifications</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default NotificationCenter;
