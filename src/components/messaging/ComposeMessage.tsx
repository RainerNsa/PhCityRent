
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Send, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ComposeMessageProps {
  propertyId?: string;
  onCancel?: () => void;
  onSent?: () => void;
}

const ComposeMessage: React.FC<ComposeMessageProps> = ({ 
  propertyId, 
  onCancel, 
  onSent 
}) => {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [recipientType, setRecipientType] = useState('agent');
  const [sending, setSending] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !content.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setSending(true);

    try {
      // For now, we'll send to a placeholder recipient
      // In a real app, you'd select from available agents/landlords
      const messageData = {
        sender_id: user.id,
        recipient_id: user.id, // Placeholder - would be actual recipient
        property_id: propertyId,
        subject: subject.trim() || 'Message from tenant',
        content: content.trim(),
        is_read: false
      };

      // Using any type to work around TypeScript issue
      const { error } = await (supabase as any)
        .from('messages')
        .insert(messageData);

      if (error) throw error;

      toast({
        title: "Message Sent",
        description: "Your message has been sent successfully.",
      });

      setSubject('');
      setContent('');
      onSent?.();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            Compose Message
          </CardTitle>
          {onCancel && (
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Send To
            </label>
            <Select value={recipientType} onValueChange={setRecipientType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="agent">Property Agent</SelectItem>
                <SelectItem value="landlord">Landlord</SelectItem>
                <SelectItem value="support">Support Team</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Subject
            </label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter message subject..."
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Message *
            </label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type your message here..."
              rows={6}
              required
            />
          </div>

          <div className="flex gap-2 justify-end">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={sending || !content.trim()}>
              {sending ? 'Sending...' : 'Send Message'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ComposeMessage;
