import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Send, MessageCircle, Users } from 'lucide-react';
import { format } from 'date-fns';
import Navbar from '@/components/layout/navbar';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  read: boolean;
  sentAt: string;
  senderName?: string;
  senderRole?: string;
}

interface Conversation {
  userId: string;
  userName: string;
  userRole: string;
  lastMessage?: Message;
  unreadCount: number;
}

export default function ChatPage() {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch all messages for the user
  const { data: messages = [], isLoading } = useQuery<Message[]>({
    queryKey: ['/api/messages'],
    refetchInterval: 5000, // Poll every 5 seconds for new messages
  });

  // Fetch all users for potential conversations
  const { data: users = [] } = useQuery<any[]>({
    queryKey: ['/api/users'],
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: { receiverId: string; content: string }) => {
      return apiRequest('POST', '/api/messages', {
        senderId: user?.id,
        receiverId: messageData.receiverId,
        content: messageData.content,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/messages'] });
      setNewMessage('');
    },
  });

  // Mark messages as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (messageId: string) => {
      return apiRequest('PUT', `/api/messages/${messageId}/read`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/messages'] });
    },
  });

  // Process messages into conversations
  const conversations: Conversation[] = users
    .filter((u: any) => u.id !== user?.id)
    .map((u: any) => {
      const userMessages = messages.filter(
        (msg) => msg.senderId === u.id || msg.receiverId === u.id
      );
      const lastMessage = userMessages.sort(
        (a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
      )[0];
      const unreadCount = userMessages.filter(
        (msg) => msg.receiverId === user?.id && !msg.read
      ).length;

      return {
        userId: u.id,
        userName: u.username,
        userRole: u.role,
        lastMessage,
        unreadCount,
      };
    })
    .sort((a, b) => {
      if (!a.lastMessage && !b.lastMessage) return 0;
      if (!a.lastMessage) return 1;
      if (!b.lastMessage) return -1;
      return new Date(b.lastMessage.sentAt).getTime() - new Date(a.lastMessage.sentAt).getTime();
    });

  // Get messages for selected conversation
  const conversationMessages = selectedConversation
    ? messages
        .filter(
          (msg) =>
            (msg.senderId === selectedConversation && msg.receiverId === user?.id) ||
            (msg.senderId === user?.id && msg.receiverId === selectedConversation)
        )
        .sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime())
    : [];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationMessages]);

  // Mark messages as read when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      const unreadMessages = conversationMessages.filter(
        (msg) => msg.receiverId === user?.id && !msg.read
      );
      unreadMessages.forEach((msg) => {
        markAsReadMutation.mutate(msg.id);
      });
    }
  }, [selectedConversation, conversationMessages]);

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    sendMessageMutation.mutate({
      receiverId: selectedConversation,
      content: newMessage.trim(),
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const selectedUser = users.find((u: any) => u.id === selectedConversation);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <MessageCircle className="h-8 w-8 text-blue-600" />
            Messages
          </h1>
          <p className="text-gray-600 mt-2">
            Connect with your IEP team members and get the support you need
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Conversations List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Conversations
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[500px] overflow-y-auto">
                {conversations.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No conversations yet</p>
                    <p className="text-sm">Start by sending a message to a team member</p>
                  </div>
                ) : (
                  conversations.map((conversation) => (
                    <div
                      key={conversation.userId}
                      className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedConversation === conversation.userId ? 'bg-blue-50 border-r-4 border-r-blue-500' : ''
                      }`}
                      onClick={() => setSelectedConversation(conversation.userId)}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="" />
                          <AvatarFallback>
                            {conversation.userName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-gray-900 truncate">
                              {conversation.userName}
                            </h3>
                            {conversation.unreadCount > 0 && (
                              <Badge className="bg-red-500 text-white text-xs">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {conversation.userRole}
                            </Badge>
                            {conversation.lastMessage && (
                              <span className="text-xs text-gray-500">
                                {format(new Date(conversation.lastMessage.sentAt), 'MMM d')}
                              </span>
                            )}
                          </div>
                          {conversation.lastMessage && (
                            <p className="text-sm text-gray-600 truncate mt-1">
                              {conversation.lastMessage.content}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="lg:col-span-2 flex flex-col">
            {selectedConversation ? (
              <>
                <CardHeader className="border-b">
                  <CardTitle className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" />
                      <AvatarFallback>
                        {selectedUser?.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{selectedUser?.username}</h3>
                      <Badge variant="outline" className="text-xs">
                        {selectedUser?.role}
                      </Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col p-0">
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[400px]">
                    {conversationMessages.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No messages yet</p>
                        <p className="text-sm">Start the conversation below</p>
                      </div>
                    ) : (
                      conversationMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.senderId === user?.id ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.senderId === user?.id
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-900'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p
                              className={`text-xs mt-1 ${
                                message.senderId === user?.id ? 'text-blue-100' : 'text-gray-500'
                              }`}
                            >
                              {format(new Date(message.sentAt), 'MMM d, h:mm a')}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="border-t p-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={sendMessageMutation.isPending}
                      />
                      <Button
                        onClick={sendMessage}
                        disabled={!newMessage.trim() || sendMessageMutation.isPending}
                        size="sm"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex-1 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                  <p>Choose someone from your conversations to start messaging</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}