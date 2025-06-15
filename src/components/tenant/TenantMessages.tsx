
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Search, Send, User, Building } from 'lucide-react';

const TenantMessages = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);

  // Mock data for conversations
  const conversations = [
    {
      id: '1',
      name: 'Agent John Doe',
      type: 'agent',
      lastMessage: 'The property viewing is scheduled for tomorrow at 2 PM',
      timestamp: '2024-01-15 14:30',
      unread: 2,
      property: '3-Bedroom Apartment in GRA'
    },
    {
      id: '2',
      name: 'Landlord Mary Smith',
      type: 'landlord',
      lastMessage: 'Your application has been approved!',
      timestamp: '2024-01-15 10:15',
      unread: 0,
      property: '2-Bedroom House in Ada George'
    },
    {
      id: '3',
      name: 'PHCityRent Support',
      type: 'support',
      lastMessage: 'How can we help you today?',
      timestamp: '2024-01-14 16:45',
      unread: 0,
      property: null
    },
  ];

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (conv.property && conv.property.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-500" />
            Messages
          </CardTitle>
          <CardDescription>Communicate with agents, landlords, and support</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:gri

d-cols-3 gap-6 h-96">
            {/* Conversations List */}
            <div className="lg:col-span-1 border-r pr-4">
              <div className="mb-4">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2 overflow-y-auto max-h-80">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedConversation === conversation.id
                        ? 'bg-blue-50 border-blue-200'
                        : 'hover:bg-gray-50 border'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center gap-2">
                        {conversation.type === 'agent' ? (
                          <User className="w-4 h-4 text-blue-500" />
                        ) : conversation.type === 'landlord' ? (
                          <Building className="w-4 h-4 text-green-500" />
                        ) : (
                          <MessageSquare className="w-4 h-4 text-orange-500" />
                        )}
                        <span className="font-medium text-sm">{conversation.name}</span>
                      </div>
                      {conversation.unread > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {conversation.unread}
                        </Badge>
                      )}
                    </div>
                    {conversation.property && (
                      <p className="text-xs text-gray-500 mb-1">{conversation.property}</p>
                    )}
                    <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(conversation.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-2">
              {selectedConversation ? (
                <div className="flex flex-col h-full">
                  <div className="border-b pb-3 mb-4">
                    <h3 className="font-semibold">
                      {conversations.find(c => c.id === selectedConversation)?.name}
                    </h3>
                    {conversations.find(c => c.id === selectedConversation)?.property && (
                      <p className="text-sm text-gray-600">
                        {conversations.find(c => c.id === selectedConversation)?.property}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex-1 overflow-y-auto mb-4 space-y-3">
                    {/* Mock messages */}
                    <div className="flex justify-end">
                      <div className="bg-blue-500 text-white p-3 rounded-lg max-w-xs">
                        <p className="text-sm">Hi, I'm interested in viewing this property.</p>
                        <p className="text-xs opacity-75 mt-1">14:25</p>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-gray-100 p-3 rounded-lg max-w-xs">
                        <p className="text-sm">The property viewing is scheduled for tomorrow at 2 PM</p>
                        <p className="text-xs text-gray-500 mt-1">14:30</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Input placeholder="Type your message..." className="flex-1" />
                    <Button>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Select a conversation to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TenantMessages;
