import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
// Types for messaging
interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read_at?: string;
  is_read: boolean;
}

interface Conversation {
  id: string;
  parent_id: string;
  advocate_id: string;
  last_message_at: string;
  created_at: string;
}

interface MessageWithUser extends Message {
  senderName: string;
  senderRole: 'parent' | 'advocate';
}

interface ConversationWithDetails extends Conversation {
  otherUserName: string;
  otherUserRole: 'parent' | 'advocate';
  lastMessage?: string;
  unreadCount: number;
}

export function useMessaging() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<ConversationWithDetails[]>([])
  const [activeConversation, setActiveConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<MessageWithUser[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [typingUsers, setTypingUsers] = useState<string[]>([])

  // Load conversations for current user
  const loadConversations = useCallback(async () => {
    if (!user) return

    try {
      // Use API endpoint instead of direct Supabase call for better compatibility
      const response = await fetch('/api/conversations', {
        credentials: 'include'
      })
      
      if (!response.ok) {
        throw new Error('Failed to load conversations')
      }
      
      const conversationsWithDetails = await response.json()
      setConversations(conversationsWithDetails)
    } catch (error) {
      console.error('Error loading conversations:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  // Load messages for active conversation
  const loadMessages = useCallback(async (conversationId: string) => {
    if (!user) return

    try {
      const response = await fetch(`/api/conversations/${conversationId}/messages`, {
        credentials: 'include'
      })
      
      if (!response.ok) {
        throw new Error('Failed to load messages')
      }
      
      const messagesWithUser = await response.json()
      setMessages(messagesWithUser)

      // Mark messages as read
      if (messagesWithUser.length > 0) {
        await markMessagesAsRead(conversationId)
      }
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  }, [user])

  // Send a new message
  const sendMessage = useCallback(async (receiverId: string, content: string) => {
    if (!user || !content.trim()) return

    setSending(true)
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          receiver_id: receiverId,
          content: content.trim()
        })
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      // Reload conversations and messages
      loadConversations()
      if (activeConversation) {
        loadMessages(activeConversation)
      }

    } catch (error) {
      console.error('Error sending message:', error)
      throw error
    } finally {
      setSending(false)
    }
  }, [user, activeConversation, loadConversations, loadMessages])

  // Mark messages as read
  const markMessagesAsRead = useCallback(async (conversationId: string) => {
    if (!user) return

    try {
      await fetch(`/api/messages/${conversationId}/read`, {
        method: 'PUT',
        credentials: 'include'
      })
    } catch (error) {
      console.error('Error marking messages as read:', error)
    }
  }, [user])

  // Update typing status (simplified for demo)
  const updateTypingStatus = useCallback(async (conversationId: string, isTyping: boolean) => {
    if (!user) return

    try {
      // For demo purposes, we'll use a simple timeout approach
      // In production, this would integrate with Supabase Realtime
      console.log(`User ${user.id} ${isTyping ? 'started' : 'stopped'} typing in conversation ${conversationId}`)
    } catch (error) {
      console.error('Error updating typing status:', error)
    }
  }, [user])

  // Set up polling for real-time updates (simplified approach)
  useEffect(() => {
    if (!user) return

    const pollInterval = setInterval(() => {
      loadConversations()
      if (activeConversation) {
        loadMessages(activeConversation)
      }
    }, 5000) // Poll every 5 seconds

    return () => {
      clearInterval(pollInterval)
    }
  }, [user, activeConversation, loadConversations, loadMessages])

  // Load conversations on mount
  useEffect(() => {
    loadConversations()
  }, [loadConversations])

  // Load messages when active conversation changes
  useEffect(() => {
    if (activeConversation) {
      loadMessages(activeConversation)
    }
  }, [activeConversation, loadMessages])

  return {
    conversations,
    messages,
    loading,
    sending,
    typingUsers,
    activeConversation,
    setActiveConversation,
    sendMessage,
    updateTypingStatus,
    loadConversations,
    loadMessages
  }
}