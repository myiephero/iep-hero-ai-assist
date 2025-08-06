import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'wouter';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  read: boolean;
  sentAt: string;
}

export function ChatWidget() {
  const { user } = useAuth();

  // Fetch recent messages for the user
  const { data: messages = [], isLoading } = useQuery<Message[]>({
    queryKey: ['/api/messages'],
    refetchInterval: 10000, // Poll every 10 seconds
  });

  // Fetch all users to get sender names
  const { data: users = [] } = useQuery<any[]>({
    queryKey: ['/api/users'],
  });

  // Get recent unread messages
  const unreadMessages = messages
    .filter((msg) => msg.receiverId === user?.id && !msg.read)
    .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime())
    .slice(0, 3);

  // Get recent messages (read and unread)
  const recentMessages = messages
    .filter((msg) => msg.senderId === user?.id || msg.receiverId === user?.id)
    .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime())
    .slice(0, 3);

  const getSenderName = (senderId: string) => {
    const sender = users.find((u: any) => u.id === senderId);
    return sender?.username || 'Unknown User';
  };

  const getSenderRole = (senderId: string) => {
    const sender = users.find((u: any) => u.id === senderId);
    return sender?.role || 'user';
  };

  const totalUnreadCount = unreadMessages.length;

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Messages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-24">
            <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Messages
            {totalUnreadCount > 0 && (
              <Badge className="bg-red-500 text-white text-xs">
                {totalUnreadCount}
              </Badge>
            )}
          </CardTitle>
          <Link href="/chat">
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary-dark">
              View All
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentMessages.length === 0 ? (
            <div className="text-center py-6">
              <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500 text-sm mb-3">No messages yet</p>
              <Link href="/chat">
                <Button size="sm" className="w-full">
                  Start Conversation
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {recentMessages.map((message) => {
                const isReceived = message.receiverId === user?.id;
                const senderName = getSenderName(message.senderId);
                const senderRole = getSenderRole(message.senderId);
                
                return (
                  <div key={message.id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" />
                      <AvatarFallback>
                        {senderName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {isReceived ? senderName : 'You'}
                          </p>
                          {isReceived && (
                            <Badge variant="outline" className="text-xs">
                              {senderRole}
                            </Badge>
                          )}
                          {!message.read && isReceived && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(message.sentAt), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 truncate">
                        {message.content}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div className="mt-4">
                <Link href="/chat">
                  <Button variant="secondary" className="w-full" size="sm">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Open Chat
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}