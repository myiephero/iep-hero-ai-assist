import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle } from "lucide-react";
import type { Message } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

interface RecentMessagesProps {
  messages: Message[];
}

export default function RecentMessages({ messages }: RecentMessagesProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Recent Messages</CardTitle>
          <Button variant="ghost" size="sm" className="text-primary">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {messages.length === 0 ? (
            <p className="text-gray-500 text-sm">No recent messages</p>
          ) : (
            messages.slice(0, 3).map((message) => (
              <div key={message.id} className="flex items-start space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" />
                  <AvatarFallback>
                    {message.senderId.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      Message from team
                    </p>
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
            ))
          )}
        </div>
        <div className="mt-4">
          <Button variant="secondary" className="w-full" size="sm">
            <MessageCircle className="h-4 w-4 mr-2" />
            Send Message
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
