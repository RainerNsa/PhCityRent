
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, MessageCircle, User, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const WorkingMessageCenter = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender_name: 'John Landlord',
      subject: 'Property Inquiry - Luxury Apartment',
      content: 'Hi! I saw your interest in my 3-bedroom apartment. When would you like to schedule a viewing?',
      created_at: '2024-01-15T10:30:00Z',
      is_read: false
    },
    {
      id: '2',
      sender_name: 'Agent Sarah',
      subject: 'Welcome to PhCityRent',
      content: 'Welcome! I\'m here to help you find the perfect property. Feel free to reach out with any questions.',
      created_at: '2024-01-14T15:20:00Z',
      is_read: true
    }
  ]);
  
  const [newMessage, setNewMessage] = useState({
    recipient: '',
    subject: '',
    content: ''
  });
  const [showCompose, setShowCompose] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!newMessage.recipient || !newMessage.subject || !newMessage.content) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields before sending.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // In a real app, this would save to the database
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Message Sent!",
        description: "Your message has been delivered successfully.",
      });
      
      setNewMessage({ recipient: '', subject: '', content: '' });
      setShowCompose(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = (messageId: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, is_read: true } : msg
      )
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="text-center py-16">
          <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Sign In Required</h3>
          <p className="text-gray-600 mb-6">
            You need to be signed in to access your messages.
          </p>
          <Button onClick={() => window.location.href = '/auth'}>
            Sign In
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600">Stay connected with landlords and agents</p>
        </div>
        <Button onClick={() => setShowCompose(!showCompose)}>
          <Send className="w-4 h-4 mr-2" />
          Compose Message
        </Button>
      </div>

      {/* Compose Message */}
      {showCompose && (
        <Card>
          <CardHeader>
            <CardTitle>New Message</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Recipient email or name"
              value={newMessage.recipient}
              onChange={(e) => setNewMessage(prev => ({ ...prev, recipient: e.target.value }))}
            />
            <Input
              placeholder="Subject"
              value={newMessage.subject}
              onChange={(e) => setNewMessage(prev => ({ ...prev, subject: e.target.value }))}
            />
            <Textarea
              placeholder="Your message..."
              rows={4}
              value={newMessage.content}
              onChange={(e) => setNewMessage(prev => ({ ...prev, content: e.target.value }))}
            />
            <div className="flex gap-2">
              <Button onClick={handleSendMessage} disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send Message'}
              </Button>
              <Button variant="outline" onClick={() => setShowCompose(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Messages List */}
      <div className="space-y-4">
        {messages.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16">
              <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Messages Yet</h3>
              <p className="text-gray-600">
                Your conversations with landlords and agents will appear here.
              </p>
            </CardContent>
          </Card>
        ) : (
          messages.map((message) => (
            <Card 
              key={message.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                !message.is_read ? 'ring-2 ring-orange-200 bg-orange-50/30' : ''
              }`}
              onClick={() => markAsRead(message.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-orange-500 text-white">
                        {message.sender_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {message.sender_name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {formatDate(message.created_at)}
                      </div>
                    </div>
                  </div>
                  {!message.is_read && (
                    <Badge className="bg-orange-500">New</Badge>
                  )}
                </div>
                
                <h4 className="font-medium text-gray-900 mb-2">
                  {message.subject}
                </h4>
                
                <p className="text-gray-700 leading-relaxed">
                  {message.content}
                </p>
                
                <div className="mt-4 pt-4 border-t flex gap-2">
                  <Button size="sm" variant="outline">
                    Reply
                  </Button>
                  <Button size="sm" variant="ghost">
                    Forward
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default WorkingMessageCenter;
