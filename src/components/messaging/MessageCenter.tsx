
import React, { useState } from "react";
import { MessageSquare, Send, Phone, User, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderType: "tenant" | "agent" | "landlord";
  content: string;
  timestamp: Date;
  propertyId?: string;
  propertyTitle?: string;
}

interface Conversation {
  id: string;
  participantName: string;
  participantType: "tenant" | "agent" | "landlord";
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  propertyTitle?: string;
}

const MessageCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const { toast } = useToast();

  const [conversations] = useState<Conversation[]>([
    {
      id: "1",
      participantName: "John Doe",
      participantType: "tenant",
      lastMessage: "Is the apartment still available?",
      lastMessageTime: new Date(Date.now() - 15 * 60 * 1000),
      unreadCount: 2,
      propertyTitle: "3BR Apartment in GRA",
    },
    {
      id: "2",
      participantName: "Sarah Agent",
      participantType: "agent", 
      lastMessage: "I can arrange a viewing for tomorrow",
      lastMessageTime: new Date(Date.now() - 60 * 60 * 1000),
      unreadCount: 0,
      propertyTitle: "2BR Flat in Trans Amadi",
    },
  ]);

  const [messages] = useState<Message[]>([
    {
      id: "1",
      senderId: "tenant-1",
      senderName: "John Doe",
      senderType: "tenant",
      content: "Hi, I'm interested in the 3BR apartment. Is it still available?",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      propertyId: "prop-1",
      propertyTitle: "3BR Apartment in GRA",
    },
    {
      id: "2",
      senderId: "agent-1",
      senderName: "You",
      senderType: "agent",
      content: "Yes, it's still available! Would you like to schedule a viewing?",
      timestamp: new Date(Date.now() - 20 * 60 * 1000),
    },
    {
      id: "3",
      senderId: "tenant-1",
      senderName: "John Doe",
      senderType: "tenant",
      content: "That would be great! When can we meet?",
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
    },
  ]);

  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    toast({
      title: "Message sent",
      description: "Your message has been delivered.",
    });
    setNewMessage("");
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return timestamp.toLocaleDateString();
  };

  const getParticipantIcon = (type: string) => {
    switch (type) {
      case "agent":
        return "🏢";
      case "landlord":
        return "🏠";
      default:
        return "👤";
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2"
      >
        <MessageSquare className="w-5 h-5" />
        {totalUnread > 0 && (
          <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {totalUnread}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Messages</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              ×
            </Button>
          </div>

          {!selectedConversation ? (
            // Conversations List
            <div className="max-h-96 overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  No messages yet
                </div>
              ) : (
                conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedConversation(conversation.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg">
                        {getParticipantIcon(conversation.participantType)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {conversation.participantName}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400">
                              {formatTimestamp(conversation.lastMessageTime)}
                            </span>
                            {conversation.unreadCount > 0 && (
                              <span className="bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {conversation.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                        {conversation.propertyTitle && (
                          <p className="text-xs text-gray-500 truncate">
                            Re: {conversation.propertyTitle}
                          </p>
                        )}
                        <p className="text-sm text-gray-600 truncate mt-1">
                          {conversation.lastMessage}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            // Individual Conversation
            <div className="h-96 flex flex-col">
              <div className="p-4 border-b border-gray-200 flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedConversation(null)}
                >
                  ←
                </Button>
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  👤
                </div>
                <div>
                  <p className="font-medium text-sm">John Doe</p>
                  <p className="text-xs text-gray-500">3BR Apartment in GRA</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.senderName === "You" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                        message.senderName === "You"
                          ? "bg-orange-500 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p>{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.senderName === "You"
                            ? "text-orange-100"
                            : "text-gray-500"
                        }`}
                      >
                        {formatTimestamp(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  />
                  <Button type="submit" size="sm" className="bg-orange-500 hover:bg-orange-600">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MessageCenter;
