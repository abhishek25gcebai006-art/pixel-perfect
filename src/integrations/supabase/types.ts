export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      applications: {
        Row: {
          id: string
          notes: string | null
          platform_name: string
          status: string
          submitted_at: string
          user_id: string
        }
        Insert: {
          id?: string
          notes?: string | null
          platform_name: string
          status?: string
          submitted_at?: string
          user_id: string
        }
        Update: {
          id?: string
          notes?: string | null
          platform_name?: string
          status?: string
          submitted_at?: string
          user_id?: string
        }
        Relationships: []
      }
      benefits: {
        Row: {
          category: string
          created_at: string
          description: string
          documents_required: string[]
          eligibility: string
          how_to_apply: string
          id: string
          is_demo: boolean
          name: string
          provider: string | null
          sort_order: number
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          documents_required?: string[]
          eligibility: string
          how_to_apply: string
          id?: string
          is_demo?: boolean
          name: string
          provider?: string | null
          sort_order?: number
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          documents_required?: string[]
          eligibility?: string
          how_to_apply?: string
          id?: string
          is_demo?: boolean
          name?: string
          provider?: string | null
          sort_order?: number
        }
        Relationships: []
      }
      documents: {
        Row: {
          created_at: string
          doc_type: string
          expiry_date: string | null
          file_path: string | null
          id: string
          name: string
          notes: string | null
          status: string
          updated_at: string
          uploaded_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          doc_type: string
          expiry_date?: string | null
          file_path?: string | null
          id?: string
          name: string
          notes?: string | null
          status?: string
          updated_at?: string
          uploaded_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          doc_type?: string
          expiry_date?: string | null
          file_path?: string | null
          id?: string
          name?: string
          notes?: string | null
          status?: string
          updated_at?: string
          uploaded_at?: string
          user_id?: string
        }
        Relationships: []
      }
      earnings: {
        Row: {
          created_at: string
          entry_date: string
          expenses: number
          gross: number
          id: string
          incentives: number
          net: number | null
          platform: string
          tips: number
          trips: number
          user_id: string
        }
        Insert: {
          created_at?: string
          entry_date?: string
          expenses?: number
          gross?: number
          id?: string
          incentives?: number
          net?: number | null
          platform: string
          tips?: number
          trips?: number
          user_id: string
        }
        Update: {
          created_at?: string
          entry_date?: string
          expenses?: number
          gross?: number
          id?: string
          incentives?: number
          net?: number | null
          platform?: string
          tips?: number
          trips?: number
          user_id?: string
        }
        Relationships: []
      }
      gig_platforms: {
        Row: {
          application_process: string | null
          category: string
          cities: string[]
          created_at: string
          documents_required: string[]
          id: string
          name: string
          requirements: string[]
          sort_order: number
          vehicle_types: string[]
          website: string | null
          work_type: string
        }
        Insert: {
          application_process?: string | null
          category: string
          cities?: string[]
          created_at?: string
          documents_required?: string[]
          id?: string
          name: string
          requirements?: string[]
          sort_order?: number
          vehicle_types?: string[]
          website?: string | null
          work_type: string
        }
        Update: {
          application_process?: string | null
          category?: string
          cities?: string[]
          created_at?: string
          documents_required?: string[]
          id?: string
          name?: string
          requirements?: string[]
          sort_order?: number
          vehicle_types?: string[]
          website?: string | null
          work_type?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          is_read: boolean
          kind: string
          title: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          kind?: string
          title: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          kind?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avg_rating: number | null
          city: string | null
          created_at: string
          email: string | null
          experience_months: number | null
          full_name: string
          id: string
          is_demo: boolean
          notify_benefits: boolean
          notify_documents: boolean
          notify_earnings: boolean
          phone: string | null
          preferred_language: string | null
          primary_category: string | null
          state: string | null
          total_trips: number | null
          updated_at: string
          vehicle_type: string | null
        }
        Insert: {
          avg_rating?: number | null
          city?: string | null
          created_at?: string
          email?: string | null
          experience_months?: number | null
          full_name?: string
          id: string
          is_demo?: boolean
          notify_benefits?: boolean
          notify_documents?: boolean
          notify_earnings?: boolean
          phone?: string | null
          preferred_language?: string | null
          primary_category?: string | null
          state?: string | null
          total_trips?: number | null
          updated_at?: string
          vehicle_type?: string | null
        }
        Update: {
          avg_rating?: number | null
          city?: string | null
          created_at?: string
          email?: string | null
          experience_months?: number | null
          full_name?: string
          id?: string
          is_demo?: boolean
          notify_benefits?: boolean
          notify_documents?: boolean
          notify_earnings?: boolean
          phone?: string | null
          preferred_language?: string | null
          primary_category?: string | null
          state?: string | null
          total_trips?: number | null
          updated_at?: string
          vehicle_type?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          id: string
          plan: string
          renews_at: string | null
          started_at: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          plan?: string
          renews_at?: string | null
          started_at?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          plan?: string
          renews_at?: string | null
          started_at?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      worker_benefits: {
        Row: {
          applied_at: string | null
          benefit_id: string
          created_at: string
          id: string
          status: string
          user_id: string
        }
        Insert: {
          applied_at?: string | null
          benefit_id: string
          created_at?: string
          id?: string
          status?: string
          user_id: string
        }
        Update: {
          applied_at?: string | null
          benefit_id?: string
          created_at?: string
          id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "worker_benefits_benefit_id_fkey"
            columns: ["benefit_id"]
            isOneToOne: false
            referencedRelation: "benefits"
            referencedColumns: ["id"]
          },
        ]
      }
      worker_platforms: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          joined_on: string | null
          platform_name: string
          rating: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          joined_on?: string | null
          platform_name: string
          rating?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          joined_on?: string | null
          platform_name?: string
          rating?: number | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "worker"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin", "worker"],
    },
  },
} as const
