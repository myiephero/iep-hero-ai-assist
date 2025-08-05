import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Send, MessageCircle, Users, AlertTriangle, Paperclip, Reply, Archive } from 'lucide-react';
import { format } from 'date-fns';
import Navbar from '@/components/layout/navbar';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  messageType?: string;
  priority?: string;
  threadId?: string;
  replyToId?: string;
  attachmentUrl?: string;
  read: boolean;
  archived?: boolean;
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
  const [messagePriority, setMessagePriority] = useState('normal');
  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);
  const [showArchived, setShowArchived] = useState(false);
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
    mutationFn: async (messageData: { 
      receiverId: string; 
      content: string; 
      priority?: string;
      replyToId?: string;
    }) => {
      return apiRequest('POST', '/api/messages', {
        senderId: user?.id,
        receiverId: messageData.receiverId,
        content: messageData.content,
        priority: messageData.priority || 'normal',
        replyToId: messageData.replyToId,
        messageType: 'text'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/messages'] });
      setNewMessage('');
      setReplyToMessage(null);
      setMessagePriority('normal');
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

  // Filter users based on role for better agent-advocate messaging
  const filteredUsers = users
    .filter((u: any) => u.id !== user?.id)
    .filter((u: any) => {
      // Parents can message advocates and professionals
      if (user?.role === 'parent') {
        return u.role === 'advocate' || u.role === 'professional';
      }
      // Advocates can message parents and other advocates
      if (user?.role === 'advocate') {
        return u.role === 'parent' || u.role === 'advocate' || u.role === 'professional';
      }
      // Professionals can message everyone
      if (user?.role === 'professional') {
        return true;
      }
      return true;
    });

  // Process messages into conversations
  const conversations: Conversation[] = filteredUsers
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
            ((msg.senderId === selectedConversation && msg.receiverId === user?.id) ||
            (msg.senderId === user?.id && msg.receiverId === selectedConversation)) &&
            (!msg.archived || showArchived)
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
      priority: messagePriority,
      replyToId: replyToMessage?.id,
    });
  };

  const handleReply = (message: Message) => {
    setReplyToMessage(message);
    setNewMessage('');
  };

  const cancelReply = () => {
    setReplyToMessage(null);
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
            {user?.role === 'parent' 
              ? 'Connect with advocates and professionals for IEP support'
              : user?.role === 'advocate' 
              ? 'Communicate with parents and collaborate with other team members'
              : 'Connect with all IEP team members and provide professional guidance'
            }
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
                    <p>No team members available</p>
                    <p className="text-sm">
                      {user?.role === 'parent' 
                        ? 'No advocates or professionals are available for messaging'
                        : 'No team members are available for messaging right now'
                      }
                    </p>
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
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                conversation.userRole === 'advocate' ? 'border-blue-500 text-blue-700' :
                                conversation.userRole === 'parent' ? 'border-green-500 text-green-700' :
                                conversation.userRole === 'professional' ? 'border-purple-500 text-purple-700' :
                                'border-gray-500 text-gray-700'
                              }`}
                            >
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
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            selectedUser?.role === 'advocate' ? 'border-blue-500 text-blue-700' :
                            selectedUser?.role === 'parent' ? 'border-green-500 text-green-700' :
                            selectedUser?.role === 'professional' ? 'border-purple-500 text-purple-700' :
                            'border-gray-500 text-gray-700'
                          }`}
                        >
                          {selectedUser?.role}
                        </Badge>
                        {selectedUser?.planStatus === 'heroOffer' && (
                          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs">
                            HERO
                          </Badge>
                        )}
                      </div>
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
                          } group`}
                        >
                          <div className={`max-w-xs lg:max-w-md ${message.senderId === user?.id ? 'order-2' : 'order-1'}`}>
                            {message.replyToId && (
                              <div className="text-xs text-gray-500 mb-1 italic">
                                Replying to: {conversationMessages.find(m => m.id === message.replyToId)?.content.substring(0, 50)}...
                              </div>
                            )}
                            <div
                              className={`px-4 py-2 rounded-lg relative ${
                                message.senderId === user?.id
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-gray-200 text-gray-900'
                              } ${
                                message.priority === 'urgent' ? 'border-2 border-red-500' :
                                message.priority === 'high' ? 'border-l-4 border-orange-400' : ''
                              }`}
                            >
                              {message.priority === 'urgent' && (
                                <div className="flex items-center gap-1 text-xs mb-1">
                                  <AlertTriangle className="h-3 w-3" />
                                  <span>Urgent</span>
                                </div>
                              )}
                              <p className="text-sm">{message.content}</p>
                              <div className="flex items-center justify-between mt-1">
                                <p
                                  className={`text-xs ${
                                    message.senderId === user?.id ? 'text-blue-100' : 'text-gray-500'
                                  }`}
                                >
                                  {format(new Date(message.sentAt), 'MMM d, h:mm a')}
                                </p>
                                {message.senderId !== user?.id && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto ${
                                      message.senderId === user?.id ? 'text-blue-100 hover:text-white' : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                    onClick={() => handleReply(message)}
                                  >
                                    <Reply className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                            </div>
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