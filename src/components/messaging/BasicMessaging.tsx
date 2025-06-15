
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MessageList from './MessageList';
import ComposeMessage from './ComposeMessage';
import { MessageCircle, Send } from 'lucide-react';

interface BasicMessagingProps {
  propertyId?: string;
}

const BasicMessaging: React.FC<BasicMessagingProps> = ({ propertyId }) => {
  const [activeTab, setActiveTab] = useState('messages');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleMessageSent = () => {
    setActiveTab('messages');
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
        <p className="text-gray-600">
          Communicate with agents and landlords about properties
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="messages" className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Messages
          </TabsTrigger>
          <TabsTrigger value="compose" className="flex items-center gap-2">
            <Send className="w-4 h-4" />
            Compose
          </TabsTrigger>
        </TabsList>

        <TabsContent value="messages" className="mt-6">
          <MessageList key={refreshKey} />
        </TabsContent>

        <TabsContent value="compose" className="mt-6">
          <ComposeMessage 
            propertyId={propertyId}
            onSent={handleMessageSent}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BasicMessaging;
