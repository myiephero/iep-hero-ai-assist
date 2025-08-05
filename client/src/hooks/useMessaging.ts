import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import type { RealtimeChannel } from '@supabase/supabase-js'

// Types for messaging
interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  created_at: string;
}

interface MessageWithUser extends Message {
  senderName: string;
  senderEmail: string;
  isCurrentUser: boolean;
}

interface ConversationUser {
  id: string;
  email: string;
  username?: string;
}

export function useMessaging() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<ConversationUser[]>([])
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [messages, setMessages] = useState<MessageWithUser[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [realtimeChannel, setRealtimeChannel] = useState<RealtimeChannel | null>(null)

  // Load unique conversation partners
  const loadConversations = useCallback(async () => {
    if (!user) return

    try {
      const { data: messagesData, error } = await supabase
        .from('messages')
        .select(`
          sender_id,
          receiver_id,
          created_at,
          sender:users!messages_sender_id_fkey(id, email, username),
          receiver:users!messages_receiver_id_fkey(id, email, username)
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Extract unique conversation partners
      const partnersMap = new Map<string, ConversationUser>()
      
      messagesData?.forEach((msg: any) => {
        let partner: ConversationUser | null = null
        
        if (msg.sender_id === user.id && msg.receiver) {
          partner = {
            id: msg.receiver.id,
            email: msg.receiver.email,
            username: msg.receiver.username || msg.receiver.email
          }
        } else if (msg.receiver_id === user.id && msg.sender) {
          partner = {
            id: msg.sender.id,
            email: msg.sender.email,
            username: msg.sender.username || msg.sender.email
          }
        }
        
        if (partner && !partnersMap.has(partner.id)) {
          partnersMap.set(partner.id, partner)
        }
      })

      setConversations(Array.from(partnersMap.values()))
    } catch (error) {
      console.error('Error loading conversations:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  // Load messages for active conversation
  const loadMessages = useCallback(async () => {
    if (!user || !activeConversationId) return

    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:users!messages_sender_id_fkey(id, email, username)
        `)
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${activeConversationId}),and(sender_id.eq.${activeConversationId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true })

      if (error) throw error

      const messagesWithUser: MessageWithUser[] = data.map((msg: any) => ({
        ...msg,
        senderName: msg.sender?.username || msg.sender?.email || 'Unknown User',
        senderEmail: msg.sender?.email || '',
        isCurrentUser: msg.sender_id === user.id
      }))

      setMessages(messagesWithUser)
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  }, [user, activeConversationId])

  // Send a new message
  const sendMessage = useCallback(async (content: string) => {
    if (!user || !activeConversationId || !content.trim()) return

    setSending(true)
    try {
      const { error } = await supabase
        .from('messages')
        .insert([{
          sender_id: user.id,
          receiver_id: activeConversationId,
          message: content.trim()
        }])

      if (error) throw error

      // Messages will be updated via realtime subscription
    } catch (error) {
      console.error('Error sending message:', error)
      throw error
    } finally {
      setSending(false)
    }
  }, [user, activeConversationId])

  // Set up Supabase Realtime subscription
  useEffect(() => {
    if (!user) return

    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `or(sender_id.eq.${user.id},receiver_id.eq.${user.id})`
        },
        (payload) => {
          console.log('New message received:', payload)
          // Reload messages if it's for the active conversation
          if (activeConversationId) {
            const newMessage = payload.new as Message
            if ((newMessage.sender_id === user.id && newMessage.receiver_id === activeConversationId) ||
                (newMessage.sender_id === activeConversationId && newMessage.receiver_id === user.id)) {
              loadMessages()
            }
          }
          // Also reload conversations to update the list
          loadConversations()
        }
      )
      .subscribe()

    setRealtimeChannel(channel)

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [user, activeConversationId, loadMessages, loadConversations])

  // Load conversations on mount
  useEffect(() => {
    loadConversations()
  }, [loadConversations])

  // Load messages when active conversation changes
  useEffect(() => {
    if (activeConversationId) {
      loadMessages()
    } else {
      setMessages([])
    }
  }, [activeConversationId, loadMessages])

  return {
    conversations,
    messages,
    loading,
    sending,
    activeConversationId,
    setActiveConversationId,
    sendMessage,
    loadConversations
  }
}