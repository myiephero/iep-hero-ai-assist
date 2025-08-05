import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useAuth } from '@/hooks/useAuth'
import { useMessaging } from '@/hooks/useMessaging'
import { Send, MessageCircle, User, Clock } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { formatDistanceToNow } from 'date-fns'

export function MessagingInterface() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [messageInput, setMessageInput] = useState('')
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const {
    conversations,
    messages,
    loading,
    sending,
    typingUsers,
    activeConversation,
    setActiveConversation,
    sendMessage,
    updateTypingStatus
  } = useMessaging()

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageInput.trim() || !activeConversation) return

    const activeConv = conversations.find(c => c.id === activeConversation)
    if (!activeConv) return

    const receiverId = activeConv.parent_id === user?.id ? activeConv.advocate_id : activeConv.parent_id

    try {
      await sendMessage(receiverId, messageInput)
      setMessageInput('')
      
      // Stop typing indicator
      updateTypingStatus(activeConversation, false)
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: "Please try again",
        variant: "destructive"
      })
    }
  }

  const handleTyping = (value: string) => {
    setMessageInput(value)
    
    if (!activeConversation) return

    // Clear existing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout)
    }

    // Start typing indicator
    updateTypingStatus(activeConversation, true)

    // Set timeout to stop typing indicator
    const timeout = setTimeout(() => {
      updateTypingStatus(activeConversation, false)
    }, 3000)
    
    setTypingTimeout(timeout)
  }

  const getOtherUserId = (conversation: typeof conversations[0]) => {
    return conversation.parent_id === user?.id ? conversation.advocate_id : conversation.parent_id
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Messages</h1>
              <p className="text-gray-600">Communicate with your IEP team</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Conversations Sidebar */}
          <Card className="bg-white border-0 shadow-sm rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-blue-500" />
                Conversations
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                {conversations.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No conversations yet</p>
                    <p className="text-sm">Start chatting with your advocates</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {conversations.map((conversation) => (
                      <button
                        key={conversation.id}
                        onClick={() => setActiveConversation(conversation.id)}
                        className={`w-full p-4 text-left hover:bg-gray-50 border-b border-gray-100 transition-colors ${
                          activeConversation === conversation.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <User className="w-4 h-4 text-gray-400" />
                              <p className="font-medium text-gray-900 truncate">
                                {conversation.otherUserName}
                              </p>
                              <Badge variant="outline" className="text-xs">
                                {conversation.otherUserRole}
                              </Badge>
                            </div>
                            {conversation.lastMessage && (
                              <p className="text-sm text-gray-600 truncate">
                                {conversation.lastMessage}
                              </p>
                            )}
                            <div className="flex items-center gap-1 mt-1">
                              <Clock className="w-3 h-3 text-gray-400" />
                              <p className="text-xs text-gray-500">
                                {formatDistanceToNow(new Date(conversation.last_message_at), { addSuffix: true })}
                              </p>
                            </div>
                          </div>
                          {conversation.unreadCount > 0 && (
                            <Badge className="bg-red-500 text-white">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Window */}
          <div className="lg:col-span-2">
            <Card className="bg-white border-0 shadow-sm rounded-xl h-full flex flex-col">
              {activeConversation ? (
                <>
                  {/* Chat Header */}
                  <CardHeader className="border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {conversations.find(c => c.id === activeConversation)?.otherUserName}
                        </CardTitle>
                        <Badge variant="outline" className="text-xs">
                          {conversations.find(c => c.id === activeConversation)?.otherUserRole}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Messages */}
                  <CardContent className="flex-1 p-4">
                    <ScrollArea className="h-[400px] pr-4">
                      <div className="space-y-4">
                        {messages.length === 0 ? (
                          <div className="text-center text-gray-500 py-8">
                            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p>No messages yet</p>
                            <p className="text-sm">Start the conversation!</p>
                          </div>
                        ) : (
                          <>
                            {messages.map((message) => (
                              <div
                                key={message.id}
                                className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                              >
                                <div
                                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                    message.sender_id === user?.id
                                      ? 'bg-blue-500 text-white'
                                      : 'bg-gray-100 text-gray-900'
                                  }`}
                                >
                                  <p className="text-sm">{message.content}</p>
                                  <div className="flex items-center justify-between mt-1">
                                    <p className={`text-xs ${
                                      message.sender_id === user?.id ? 'text-blue-100' : 'text-gray-500'
                                    }`}>
                                      {message.senderName}
                                    </p>
                                    <p className={`text-xs ${
                                      message.sender_id === user?.id ? 'text-blue-100' : 'text-gray-400'
                                    }`}>
                                      {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                            
                            {/* Typing indicator */}
                            {typingUsers.length > 0 && (
                              <div className="flex justify-start">
                                <div className="bg-gray-100 px-4 py-2 rounded-lg">
                                  <p className="text-sm text-gray-600 italic">
                                    Typing...
                                  </p>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>
                  </CardContent>

                  {/* Message Input */}
                  <div className="border-t border-gray-100 p-4">
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                      <Input
                        value={messageInput}
                        onChange={(e) => handleTyping(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1"
                        disabled={sending}
                      />
                      <Button type="submit" disabled={sending || !messageInput.trim()}>
                        {sending ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                      </Button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                    <p>Choose a conversation from the sidebar to start messaging</p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}