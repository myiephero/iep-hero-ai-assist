import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useAuth } from '@/hooks/useAuth'
import { useMessaging } from '@/hooks/useMessaging'
import { QuickMessageForm } from '@/components/messaging/QuickMessageForm'
import { Send, MessageCircle, User } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { formatDistanceToNow } from 'date-fns'
import Navbar from '@/components/layout/navbar'

export default function Messages() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [messageInput, setMessageInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const {
    conversations,
    messages,
    loading,
    sending,
    activeConversationId,
    setActiveConversationId,
    sendMessage,
    loadConversations
  } = useMessaging()

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageInput.trim()) return

    try {
      await sendMessage(messageInput)
      setMessageInput('')
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: "Please try again",
        variant: "destructive"
      })
    }
  }

  const activeConversation = conversations.find(c => c.id === activeConversationId)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
              <p className="text-gray-600">Chat with advocates and team members</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Quick Message Form */}
        <QuickMessageForm onMessageSent={loadConversations} />
        
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
                    <p className="text-sm">Send a message to start chatting</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {conversations.map((conversation) => (
                      <button
                        key={conversation.id}
                        onClick={() => setActiveConversationId(conversation.id)}
                        className={`w-full p-4 text-left hover:bg-gray-50 border-b border-gray-100 transition-colors ${
                          activeConversationId === conversation.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {conversation.username}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {conversation.email}
                            </p>
                          </div>
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
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {activeConversation.username}
                        </CardTitle>
                        <p className="text-sm text-gray-500">{activeConversation.email}</p>
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
                                className={`flex ${message.isCurrentUser ? 'justify-end' : 'justify-start'}`}
                              >
                                <div className="flex flex-col max-w-xs lg:max-w-md">
                                  <div
                                    className={`px-4 py-3 rounded-2xl ${
                                      message.isCurrentUser
                                        ? 'bg-blue-500 text-white rounded-br-md'
                                        : 'bg-gray-100 text-gray-900 rounded-bl-md'
                                    }`}
                                  >
                                    <p className="text-sm leading-relaxed">{message.message}</p>
                                  </div>
                                  <div className={`flex items-center gap-2 mt-1 px-2 ${
                                    message.isCurrentUser ? 'justify-end' : 'justify-start'
                                  }`}>
                                    <p className="text-xs text-gray-500">
                                      {message.senderName}
                                    </p>
                                    <span className="text-xs text-gray-400">•</span>
                                    <p className="text-xs text-gray-400">
                                      {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </>
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>
                  </CardContent>

                  {/* Message Input */}
                  <div className="border-t border-gray-100 p-4">
                    <form onSubmit={handleSendMessage} className="flex gap-3">
                      <Input
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 rounded-full border-gray-200 focus:border-blue-500"
                        disabled={sending}
                      />
                      <Button 
                        type="submit" 
                        disabled={sending || !messageInput.trim()}
                        className="rounded-full w-10 h-10 p-0"
                        size="sm"
                      >
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