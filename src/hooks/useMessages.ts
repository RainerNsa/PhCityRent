import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Database } from '@/integrations/supabase/types';

type Message = Database['public']['Tables']['messages']['Row'];
type MessageInsert = Database['public']['Tables']['messages']['Insert'];

export const useMessages = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['messages', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:sender_id(id, email, user_metadata),
          recipient:recipient_id(id, email, user_metadata),
          properties(id, title, location)
        `)
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
};

export const useUnreadMessages = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['unread-messages', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('recipient_id', user.id)
        .eq('is_read', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: {
      recipientId: string;
      subject: string;
      content: string;
      propertyId?: string;
    }) => {
      if (!user) throw new Error('User not authenticated');

      const messageData: MessageInsert = {
        sender_id: user.id,
        recipient_id: data.recipientId,
        subject: data.subject,
        content: data.content,
        property_id: data.propertyId,
        is_read: false,
      };

      const { data: result, error } = await supabase
        .from('messages')
        .insert(messageData)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['unread-messages'] });
      toast({
        title: "Message Sent",
        description: "Your message has been sent successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to Send",
        description: "There was an error sending your message. Please try again.",
        variant: "destructive"
      });
    },
  });
};

export const useMarkMessageAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageId: string) => {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', messageId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['unread-messages'] });
    },
  });
};

export const useMessageStats = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['message-stats', user?.id],
    queryFn: async () => {
      if (!user) return { total: 0, unread: 0, sent: 0, received: 0 };
      
      const [messagesResult, unreadResult] = await Promise.all([
        supabase
          .from('messages')
          .select('sender_id, recipient_id')
          .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`),
        supabase
          .from('messages')
          .select('id')
          .eq('recipient_id', user.id)
          .eq('is_read', false)
      ]);

      if (messagesResult.error) throw messagesResult.error;
      if (unreadResult.error) throw unreadResult.error;
      
      const messages = messagesResult.data || [];
      const unreadMessages = unreadResult.data || [];
      
      const stats = {
        total: messages.length,
        unread: unreadMessages.length,
        sent: messages.filter(msg => msg.sender_id === user.id).length,
        received: messages.filter(msg => msg.recipient_id === user.id).length,
      };
      
      return stats;
    },
    enabled: !!user,
  });
};
