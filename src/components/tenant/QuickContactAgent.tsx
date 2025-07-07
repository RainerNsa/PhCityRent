import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSendMessage } from '@/hooks/useMessages';
import { useProperties } from '@/hooks/useProperties';
import { useAuth } from '@/hooks/useAuth';
import { MessageSquare, Send, X, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface QuickContactAgentProps {
  onCancel?: () => void;
  onSuccess?: () => void;
}

// Hook to get agents/landlords
const useAgents = () => {
  return useQuery({
    queryKey: ['agents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, role')
        .in('role', ['agent', 'landlord'])
        .limit(20);

      if (error) throw error;
      return data || [];
    },
  });
};

const QuickContactAgent: React.FC<QuickContactAgentProps> = ({ onCancel, onSuccess }) => {
  const [selectedAgentId, setSelectedAgentId] = useState('');
  const [selectedPropertyId, setSelectedPropertyId] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const { user } = useAuth();
  const { data: properties } = useProperties();
  const { data: agents } = useAgents();
  const sendMessage = useSendMessage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAgentId || !subject.trim() || !message.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await sendMessage.mutateAsync({
        recipientId: selectedAgentId,
        subject: subject.trim(),
        content: message.trim(),
        propertyId: selectedPropertyId || undefined
      });
      
      onSuccess?.();
    } catch (error) {
      console.error('Send message error:', error);
    }
  };

  const selectedAgent = agents?.find(a => a.id === selectedAgentId);
  const selectedProperty = properties?.find(p => p.id === selectedPropertyId);

  // Pre-populate subject based on selections
  React.useEffect(() => {
    if (selectedProperty && selectedAgent) {
      setSubject(`Inquiry about ${selectedProperty.title}`);
    } else if (selectedAgent) {
      setSubject('Property Inquiry');
    }
  }, [selectedProperty, selectedAgent]);

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-500" />
            Contact Agent
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
          {/* Agent Selection */}
          <div className="space-y-2">
            <Label htmlFor="agent">Select Agent/Landlord *</Label>
            <Select value={selectedAgentId} onValueChange={setSelectedAgentId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an agent or landlord to contact" />
              </SelectTrigger>
              <SelectContent>
                {agents?.map((agent) => (
                  <SelectItem key={agent.id} value={agent.id}>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {agent.full_name || agent.email} ({agent.role})
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedAgent && (
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">{selectedAgent.full_name || selectedAgent.email}</p>
                  <p className="text-sm text-green-700 capitalize">{selectedAgent.role}</p>
                </div>
              </div>
            </div>
          )}

          {/* Property Selection (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="property">Related Property (Optional)</Label>
            <Select value={selectedPropertyId} onValueChange={setSelectedPropertyId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a property if this inquiry is about a specific property" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No specific property</SelectItem>
                {properties?.map((property) => (
                  <SelectItem key={property.id} value={property.id}>
                    {property.title} - {property.location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedProperty && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900">{selectedProperty.title}</h4>
              <p className="text-sm text-blue-700">{selectedProperty.location}</p>
              <p className="text-sm text-blue-700">₦{selectedProperty.price?.toLocaleString()}/year</p>
            </div>
          )}

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject">Subject *</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter message subject"
              required
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              rows={6}
              required
            />
          </div>

          {/* Quick Message Templates */}
          <div className="space-y-2">
            <Label>Quick Templates</Label>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setMessage("Hi, I'm interested in viewing this property. When would be a good time to schedule a viewing?")}
              >
                Request Viewing
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setMessage("Hello, I'd like to know more details about this property. Could you please provide more information about the amenities and lease terms?")}
              >
                Request Details
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setMessage("Hi, I'm interested in applying for this property. Could you please guide me through the application process?")}
              >
                Application Inquiry
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button 
              type="submit" 
              disabled={sendMessage.isPending || !selectedAgentId || !subject.trim() || !message.trim()}
              className="flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              {sendMessage.isPending ? 'Sending...' : 'Send Message'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default QuickContactAgent;
