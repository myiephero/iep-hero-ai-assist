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
          advocate_additional_flags: Json | null
          advocate_additional_questions: Json | null
          advocate_id: string | null
          advocate_refined_summary: string | null
          advocate_review_requested_at: string | null
          advocate_reviewed_at: string | null
          ai_confidence_score: number | null
          ai_model_used: string | null
          compliance_flags: Json | null
          created_at: string | null
          ferpa_disclaimer_shown: boolean | null
          file_id: string
          file_name: string
          file_size: number | null
          id: string
          parent_consent_to_advocate_review: boolean | null
          parent_id: string
          parent_requested_advocate_review: boolean | null
          pdf_export_count: number | null
          pdf_exported: boolean | null
          plain_english_summary: string
          raw_analysis: Json | null
          shared_at: string | null
          shared_with_parent: boolean | null
          status: string | null
          suggested_questions: Json | null
          updated_at: string | null
          uploaded_at: string | null
        }
        Insert: {
          advocate_additional_flags?: Json | null
          advocate_additional_questions?: Json | null
          advocate_id?: string | null
          advocate_refined_summary?: string | null
          advocate_review_requested_at?: string | null
          advocate_reviewed_at?: string | null
          ai_confidence_score?: number | null
          ai_model_used?: string | null
          compliance_flags?: Json | null
          created_at?: string | null
          ferpa_disclaimer_shown?: boolean | null
          file_id: string
          file_name: string
          file_size?: number | null
          id?: string
          parent_consent_to_advocate_review?: boolean | null
          parent_id: string
          parent_requested_advocate_review?: boolean | null
          pdf_export_count?: number | null
          pdf_exported?: boolean | null
          plain_english_summary: string
          raw_analysis?: Json | null
          shared_at?: string | null
          shared_with_parent?: boolean | null
          status?: string | null
          suggested_questions?: Json | null
          updated_at?: string | null
          uploaded_at?: string | null
        }
        Update: {
          advocate_additional_flags?: Json | null
          advocate_additional_questions?: Json | null
          advocate_id?: string | null
          advocate_refined_summary?: string | null
          advocate_review_requested_at?: string | null
          advocate_reviewed_at?: string | null
          ai_confidence_score?: number | null
          ai_model_used?: string | null
          compliance_flags?: Json | null
          created_at?: string | null
          ferpa_disclaimer_shown?: boolean | null
          file_id?: string
          file_name?: string
          file_size?: number | null
          id?: string
          parent_consent_to_advocate_review?: boolean | null
          parent_id?: string
          parent_requested_advocate_review?: boolean | null
          pdf_export_count?: number | null
          pdf_exported?: boolean | null
          plain_english_summary?: string
          raw_analysis?: Json | null
          shared_at?: string | null
          shared_with_parent?: boolean | null
          status?: string | null
          suggested_questions?: Json | null
          updated_at?: string | null
          uploaded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_reviews_advocate_id_fkey"
            columns: ["advocate_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_reviews_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
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
        Relationships: []
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
        Relationships: [
          {
            foreignKeyName: "children_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
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
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          certification: string | null
          created_at: string
          first_name: string
          hourly_rate: number | null
          id: string
          is_verified: boolean | null
          last_name: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          specializations: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          certification?: string | null
          created_at?: string
          first_name: string
          hourly_rate?: number | null
          id?: string
          is_verified?: boolean | null
          last_name: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          specializations?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          certification?: string | null
          created_at?: string
          first_name?: string
          hourly_rate?: number | null
          id?: string
          is_verified?: boolean | null
          last_name?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          specializations?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
        Relationships: []
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
    }
    Functions: {
      auto_assign_advocate_to_review: {
        Args: { review_id: string }
        Returns: boolean
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
