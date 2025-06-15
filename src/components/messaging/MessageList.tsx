
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { MessageCircle, Clock, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  property_id: string;
  subject: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

interface MessageListProps {
  onSelectMessage?: (message: Message) => void;
}

const MessageList: React.FC<MessageListProps> = ({ onSelectMessage }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchMessages();
    }
  }, [user]);

  const fetchMessages = async () => {
    if (!user) return;

    try {
      setLoading(true);
      // Using any type to work around TypeScript issue until types are regenerated
      const { data, error } = await (supabase as any)
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    if (!user) return;

    try {
      // Using any type to work around TypeScript issue
      const { error } = await (supabase as any)
        .from('messages')
        .update({ is_read: true })
        .eq('id', messageId)
        .eq('recipient_id', user.id);

      if (error) throw error;
      
      // Update local state
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId ? { ...msg, is_read: true } : msg
        )
      );
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Messages
        </CardTitle>
      </CardHeader>
      <CardContent>
        {messages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No messages yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                  !message.is_read && message.recipient_id === user?.id
                    ? 'border-blue-200 bg-blue-50'
                    : 'border-gray-200'
                }`}
                onClick={() => {
                  if (!message.is_read && message.recipient_id === user?.id) {
                    markAsRead(message.id);
                  }
                  onSelectMessage?.(message);
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {message.sender_id === user?.id ? 'You' : 'Agent'}
                      </span>
                      {!message.is_read && message.recipient_id === user?.id && (
                        <Badge variant="secondary" className="text-xs">
                          New
                        </Badge>
                      )}
                    </div>
                    <h4 className="font-medium text-sm mb-1">
                      {message.subject || 'No Subject'}
                    </h4>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {message.content}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 ml-4">
                    <Clock className="w-3 h-3" />
                    {new Date(message.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MessageList;
