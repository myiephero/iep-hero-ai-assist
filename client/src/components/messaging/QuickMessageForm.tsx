import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import { Send, Plus } from 'lucide-react'

interface QuickMessageFormProps {
  onMessageSent: () => void
}

export function QuickMessageForm({ onMessageSent }: QuickMessageFormProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [recipientEmail, setRecipientEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !recipientEmail.trim() || !message.trim()) return

    setLoading(true)
    try {
      // First, find the recipient user
      const { data: recipientData, error: recipientError } = await supabase
        .from('users')
        .select('id, email')
        .eq('email', recipientEmail.trim())
        .single()

      if (recipientError || !recipientData) {
        toast({
          title: "User not found",
          description: "No user found with that email address",
          variant: "destructive"
        })
        return
      }

      // Send the message
      const { error } = await supabase
        .from('messages')
        .insert([{
          sender_id: user.id,
          receiver_id: recipientData.id,
          message: message.trim()
        }])

      if (error) throw error

      toast({
        title: "Message sent!",
        description: `Your message was sent to ${recipientEmail}`,
      })

      // Clear form
      setRecipientEmail('')
      setMessage('')
      
      // Notify parent component
      onMessageSent()

    } catch (error: any) {
      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5 text-green-500" />
          Start New Conversation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSendMessage} className="space-y-4">
          <Input
            type="email"
            placeholder="Recipient email address"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            disabled={loading}
          />
          <Input
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={loading}
          />
          <Button 
            type="submit" 
            disabled={loading || !recipientEmail.trim() || !message.trim()}
            className="w-full"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}