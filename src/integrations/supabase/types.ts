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
      [_ in never]: never
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
