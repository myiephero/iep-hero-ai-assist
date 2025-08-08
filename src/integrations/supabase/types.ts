export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      admin_settings: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          setting_key: string
          setting_type: string
          setting_value: Json
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          setting_key: string
          setting_type: string
          setting_value: Json
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          setting_key?: string
          setting_type?: string
          setting_value?: Json
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_settings_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      advocate_assignments: {
        Row: {
          advocate_id: string
          assigned_at: string | null
          assigned_by: string | null
          created_at: string | null
          id: string
          notes: string | null
          parent_id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          advocate_id: string
          assigned_at?: string | null
          assigned_by?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          parent_id: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          advocate_id?: string
          assigned_at?: string | null
          assigned_by?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          parent_id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "advocate_assignments_advocate_id_fkey"
            columns: ["advocate_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advocate_assignments_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advocate_assignments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      advocate_matches: {
        Row: {
          default_value: string | null
          is_nullable: boolean | null
          is_primary_key: boolean | null
          name: string | null
          type: string | null
        }
        Insert: {
          default_value?: string | null
          is_nullable?: boolean | null
          is_primary_key?: boolean | null
          name?: string | null
          type?: string | null
        }
        Update: {
          default_value?: string | null
          is_nullable?: boolean | null
          is_primary_key?: boolean | null
          name?: string | null
          type?: string | null
        }
        Relationships: []
      }
      advocate_notes: {
        Row: {
          advocate_id: string
          content: string
          created_at: string | null
          id: string
          is_private: boolean | null
          note_type: string | null
          parent_id: string
          updated_at: string | null
        }
        Insert: {
          advocate_id: string
          content: string
          created_at?: string | null
          id?: string
          is_private?: boolean | null
          note_type?: string | null
          parent_id: string
          updated_at?: string | null
        }
        Update: {
          advocate_id?: string
          content?: string
          created_at?: string | null
          id?: string
          is_private?: boolean | null
          note_type?: string | null
          parent_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "advocate_notes_advocate_id_fkey"
            columns: ["advocate_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advocate_notes_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_reviews: {
        Row: {
          concerns: string | null
          created_at: string | null
          goals: string | null
          id: string
          key_dates: string | null
          services: string | null
          summary: string | null
          upload_id: string
          user_id: string
        }
        Insert: {
          concerns?: string | null
          created_at?: string | null
          goals?: string | null
          id: string
          key_dates?: string | null
          services?: string | null
          summary?: string | null
          upload_id: string
          user_id: string
        }
        Update: {
          concerns?: string | null
          created_at?: string | null
          goals?: string | null
          id?: string
          key_dates?: string | null
          services?: string | null
          summary?: string | null
          upload_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_reviews_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "smart_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
      assignments: {
        Row: {
          advocate_id: string | null
          assigned_at: string | null
          id: string
          parent_id: string | null
        }
        Insert: {
          advocate_id?: string | null
          assigned_at?: string | null
          id?: string
          parent_id?: string | null
        }
        Update: {
          advocate_id?: string | null
          assigned_at?: string | null
          id?: string
          parent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assignments_advocate_id_fkey"
            columns: ["advocate_id"]
            isOneToOne: false
            referencedRelation: "user_roles_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "user_roles_view"
            referencedColumns: ["id"]
          },
        ]
      }
      availabilities: {
        Row: {
          advocate_id: string
          created_at: string | null
          date: string
          end_time: string
          id: string
          is_available: boolean | null
          is_recurring: boolean | null
          max_bookings: number | null
          recurring_pattern: string | null
          recurring_until: string | null
          start_time: string
          timezone: string
          updated_at: string | null
        }
        Insert: {
          advocate_id: string
          created_at?: string | null
          date: string
          end_time: string
          id?: string
          is_available?: boolean | null
          is_recurring?: boolean | null
          max_bookings?: number | null
          recurring_pattern?: string | null
          recurring_until?: string | null
          start_time: string
          timezone?: string
          updated_at?: string | null
        }
        Update: {
          advocate_id?: string
          created_at?: string | null
          date?: string
          end_time?: string
          id?: string
          is_available?: boolean | null
          is_recurring?: boolean | null
          max_bookings?: number | null
          recurring_pattern?: string | null
          recurring_until?: string | null
          start_time?: string
          timezone?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "availabilities_advocate_id_fkey"
            columns: ["advocate_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      children: {
        Row: {
          created_at: string
          diagnosis: string | null
          first_name: string
          grade_level: string | null
          id: string
          parent_id: string
          school_district: string | null
        }
        Insert: {
          created_at?: string
          diagnosis?: string | null
          first_name: string
          grade_level?: string | null
          id?: string
          parent_id: string
          school_district?: string | null
        }
        Update: {
          created_at?: string
          diagnosis?: string | null
          first_name?: string
          grade_level?: string | null
          id?: string
          parent_id?: string
          school_district?: string | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          file_url: string
          id: string
          name: string | null
          type: string | null
          uploaded_at: string | null
          user_id: string | null
        }
        Insert: {
          file_url: string
          id?: string
          name?: string | null
          type?: string | null
          uploaded_at?: string | null
          user_id?: string | null
        }
        Update: {
          file_url?: string
          id?: string
          name?: string | null
          type?: string | null
          uploaded_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_roles_view"
            referencedColumns: ["id"]
          },
        ]
      }
      email_events: {
        Row: {
          email_type: string | null
          event_type: string | null
          id: string
          parent_id: string | null
          timestamp: string | null
        }
        Insert: {
          email_type?: string | null
          event_type?: string | null
          id?: string
          parent_id?: string | null
          timestamp?: string | null
        }
        Update: {
          email_type?: string | null
          event_type?: string | null
          id?: string
          parent_id?: string | null
          timestamp?: string | null
        }
        Relationships: []
      }
      goals: {
        Row: {
          createdAt: string | null
          id: string
          notes: string | null
          status: string
          targetDate: string | null
          title: string
          updatedAt: string | null
          userId: string
        }
        Insert: {
          createdAt?: string | null
          id?: string
          notes?: string | null
          status?: string
          targetDate?: string | null
          title: string
          updatedAt?: string | null
          userId: string
        }
        Update: {
          createdAt?: string | null
          id?: string
          notes?: string | null
          status?: string
          targetDate?: string | null
          title?: string
          updatedAt?: string | null
          userId?: string
        }
        Relationships: []
      }
      iep_analyses: {
        Row: {
          advocate_comments: string | null
          advocate_id: string | null
          compliance_analysis: Json | null
          created_at: string | null
          error_message: string | null
          extracted_text: string | null
          file_size: number | null
          file_type: string | null
          filename: string
          goals_analysis: Json | null
          id: string
          services_analysis: Json | null
          status: string | null
          updated_at: string | null
          upload_date: string | null
          user_id: string | null
        }
        Insert: {
          advocate_comments?: string | null
          advocate_id?: string | null
          compliance_analysis?: Json | null
          created_at?: string | null
          error_message?: string | null
          extracted_text?: string | null
          file_size?: number | null
          file_type?: string | null
          filename: string
          goals_analysis?: Json | null
          id?: string
          services_analysis?: Json | null
          status?: string | null
          updated_at?: string | null
          upload_date?: string | null
          user_id?: string | null
        }
        Update: {
          advocate_comments?: string | null
          advocate_id?: string | null
          compliance_analysis?: Json | null
          created_at?: string | null
          error_message?: string | null
          extracted_text?: string | null
          file_size?: number | null
          file_type?: string | null
          filename?: string
          goals_analysis?: Json | null
          id?: string
          services_analysis?: Json | null
          status?: string | null
          updated_at?: string | null
          upload_date?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      meetings: {
        Row: {
          advocate_id: string
          advocate_notes: string | null
          availability_id: string | null
          cancellation_reason: string | null
          cancelled_at: string | null
          cancelled_by: string | null
          created_at: string | null
          duration_minutes: number | null
          follow_up_sent: boolean | null
          id: string
          meeting_datetime: string
          meeting_link: string | null
          meeting_location: string | null
          meeting_phone: string | null
          meeting_topic: string | null
          parent_id: string
          parent_notes: string | null
          reminder_sent: boolean | null
          status: string | null
          timezone: string
          updated_at: string | null
        }
        Insert: {
          advocate_id: string
          advocate_notes?: string | null
          availability_id?: string | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          follow_up_sent?: boolean | null
          id?: string
          meeting_datetime: string
          meeting_link?: string | null
          meeting_location?: string | null
          meeting_phone?: string | null
          meeting_topic?: string | null
          parent_id: string
          parent_notes?: string | null
          reminder_sent?: boolean | null
          status?: string | null
          timezone: string
          updated_at?: string | null
        }
        Update: {
          advocate_id?: string
          advocate_notes?: string | null
          availability_id?: string | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          follow_up_sent?: boolean | null
          id?: string
          meeting_datetime?: string
          meeting_link?: string | null
          meeting_location?: string | null
          meeting_phone?: string | null
          meeting_topic?: string | null
          parent_id?: string
          parent_notes?: string | null
          reminder_sent?: boolean | null
          status?: string | null
          timezone?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meetings_advocate_id_fkey"
            columns: ["advocate_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meetings_availability_id_fkey"
            columns: ["availability_id"]
            isOneToOne: false
            referencedRelation: "availabilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meetings_cancelled_by_fkey"
            columns: ["cancelled_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meetings_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      memory: {
        Row: {
          content: string | null
          created_at: string | null
          embedding: string | null
          id: string
          metadata: Json | null
          namespace: string | null
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          embedding?: string | null
          id?: string
          metadata?: Json | null
          namespace?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          embedding?: string | null
          id?: string
          metadata?: Json | null
          namespace?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      reminder_emails: {
        Row: {
          emailStatus: string | null
          emailType: string
          id: string
          reminderId: string
          sentAt: string | null
          userId: string
        }
        Insert: {
          emailStatus?: string | null
          emailType: string
          id?: string
          reminderId: string
          sentAt?: string | null
          userId: string
        }
        Update: {
          emailStatus?: string | null
          emailType?: string
          id?: string
          reminderId?: string
          sentAt?: string | null
          userId?: string
        }
        Relationships: []
      }
      reminders: {
        Row: {
          created_at: string | null
          description: string | null
          due_date: string
          id: string
          is_completed: boolean | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          due_date: string
          id?: string
          is_completed?: boolean | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          due_date?: string
          id?: string
          is_completed?: boolean | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reminders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      shared_answers: {
        Row: {
          default_value: string | null
          is_required: boolean | null
          name: string | null
          type: string | null
        }
        Insert: {
          default_value?: string | null
          is_required?: boolean | null
          name?: string | null
          type?: string | null
        }
        Update: {
          default_value?: string | null
          is_required?: boolean | null
          name?: string | null
          type?: string | null
        }
        Relationships: []
      }
      smart_uploads: {
        Row: {
          file_name: string
          id: string
          status: string | null
          storage_path: string
          upload_time: string | null
          user_id: string
        }
        Insert: {
          file_name: string
          id: string
          status?: string | null
          storage_path: string
          upload_time?: string | null
          user_id: string
        }
        Update: {
          file_name?: string
          id?: string
          status?: string | null
          storage_path?: string
          upload_time?: string | null
          user_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string | null
          end_date: string | null
          id: string
          is_active: boolean | null
          plan_type: string
          start_date: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          plan_type: string
          start_date?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          plan_type?: string
          start_date?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tool_logs: {
        Row: {
          created_at: string | null
          id: string
          input: string | null
          output: string | null
          tool: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          input?: string | null
          output?: string | null
          tool: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          input?: string | null
          output?: string | null
          tool?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tool_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_roles_view"
            referencedColumns: ["id"]
          },
        ]
      }
      usage_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: unknown | null
          metadata: Json | null
          resource_id: string | null
          resource_type: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "usage_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_feedback: {
        Row: {
          content: string
          created_at: string | null
          id: string
          rating: number | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          rating?: number | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          rating?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          auth_id: string | null
          bio: string | null
          created_at: string | null
          email: string
          full_name: string
          id: string
          organization: string | null
          role: string
          timezone: string | null
          updated_at: string | null
        }
        Insert: {
          auth_id?: string | null
          bio?: string | null
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          organization?: string | null
          role: string
          timezone?: string | null
          updated_at?: string | null
        }
        Update: {
          auth_id?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          organization?: string | null
          role?: string
          timezone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_auth_id_fkey"
            columns: ["auth_id"]
            isOneToOne: true
            referencedRelation: "user_roles_view"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      iep_analysis_stats: {
        Row: {
          avg_processing_time_seconds: number | null
          completed_analyses: number | null
          error_analyses: number | null
          total_analyses: number | null
        }
        Relationships: []
      }
      user_roles_view: {
        Row: {
          created_at: string | null
          email: string | null
          id: string | null
          role: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string | null
          role?: never
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string | null
          role?: never
        }
        Relationships: []
      }
    }
    Functions: {
      auto_assign_advocate_to_review: {
        Args: { review_id: string }
        Returns: boolean
      }
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      get_ai_review_with_advocate: {
        Args: { review_id: string }
        Returns: {
          review_data: Json
          advocate_info: Json
          assignment_info: Json
        }[]
      }
      get_assigned_parents: {
        Args: { advocate_uuid: string }
        Returns: {
          parent_id: string
          full_name: string
          email: string
          assigned_at: string
          assignment_status: string
          total_documents: number
          total_preps: number
          total_letters: number
          upcoming_meetings: number
          last_activity: string
        }[]
      }
      get_parent_case_data: {
        Args: { advocate_uuid: string; parent_uuid: string }
        Returns: {
          parent_info: Json
          documents: Json
          meeting_preps: Json
          letters: Json
          meetings: Json
          advocate_notes: Json
        }[]
      }
      get_pending_reminders: {
        Args: Record<PropertyKey, never>
        Returns: {
          reminder_id: string
          user_id: string
          title: string
          meeting_date: string
          days_until: number
          reminder_type: string
        }[]
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      is_admin: {
        Args: { user_email: string }
        Returns: boolean
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: unknown
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      user_role: "parent" | "advocate" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["parent", "advocate", "admin"],
    },
  },
} as const
