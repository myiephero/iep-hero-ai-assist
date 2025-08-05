import { supabase } from '@/lib/supabase'

export interface AdvocateMatchRequest {
  parent_id: string
  advocate_id?: string
  diagnosis?: string
  urgency_level?: 'low' | 'medium' | 'high' | 'urgent'
  preferred_contact_method?: 'email' | 'phone' | 'both'
  location?: string
  additional_notes?: string
}

export interface EmailNotificationResponse {
  success: boolean
  message: string
  match_id?: string
}

class AdvocateNotificationService {
  private edgeFunctionUrl = 'https://wktcfhegoxjearpzdxpz.supabase.co/functions/v1/send-advocate-match-email'

  async sendAdvocateMatchRequest(request: AdvocateMatchRequest): Promise<EmailNotificationResponse> {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        throw new Error('User not authenticated')
      }

      const response = await fetch(this.edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          parent_id: request.parent_id,
          advocate_id: request.advocate_id || null,
          diagnosis: request.diagnosis,
          urgency_level: request.urgency_level || 'medium',
          preferred_contact_method: request.preferred_contact_method || 'email',
          location: request.location,
          additional_notes: request.additional_notes,
          timestamp: new Date().toISOString()
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      return {
        success: true,
        message: data.message || 'Advocate match request sent successfully',
        match_id: data.match_id
      }
    } catch (error: any) {
      console.error('Advocate notification error:', error)
      return {
        success: false,
        message: error.message || 'Failed to send advocate match request'
      }
    }
  }

  async sendIEPCompletionNotification(parentId: string, diagnosis: string): Promise<EmailNotificationResponse> {
    return this.sendAdvocateMatchRequest({
      parent_id: parentId,
      diagnosis,
      urgency_level: 'medium',
      additional_notes: 'Parent has completed IEP goals generation and may need advocate support'
    })
  }

  async sendUrgentAdvocateRequest(parentId: string, diagnosis: string, urgentReason: string): Promise<EmailNotificationResponse> {
    return this.sendAdvocateMatchRequest({
      parent_id: parentId,
      diagnosis,
      urgency_level: 'urgent',
      additional_notes: `URGENT REQUEST: ${urgentReason}`
    })
  }

  async checkNotificationStatus(matchId: string): Promise<any> {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        throw new Error('User not authenticated')
      }

      const response = await fetch(`${this.edgeFunctionUrl}/status/${matchId}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (response.ok) {
        return await response.json()
      }
      
      return null
    } catch (error) {
      console.error('Status check error:', error)
      return null
    }
  }
}

export const advocateNotificationService = new AdvocateNotificationService()