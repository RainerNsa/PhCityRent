export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_performance: {
        Row: {
          additional_data: Json | null
          admin_id: string | null
          created_at: string | null
          id: string
          metric_date: string | null
          metric_name: string
          metric_value: number
        }
        Insert: {
          additional_data?: Json | null
          admin_id?: string | null
          created_at?: string | null
          id?: string
          metric_date?: string | null
          metric_name: string
          metric_value: number
        }
        Update: {
          additional_data?: Json | null
          admin_id?: string | null
          created_at?: string | null
          id?: string
          metric_date?: string | null
          metric_name?: string
          metric_value?: number
        }
        Relationships: []
      }
      agent_applications: {
        Row: {
          agent_id: string
          created_at: string | null
          email: string | null
          estimated_completion: string | null
          full_name: string
          id: string
          is_registered_business: boolean | null
          next_action: string | null
          operating_areas: string[]
          residential_address: string
          reviewer_notes: string | null
          status: Database["public"]["Enums"]["application_status"] | null
          updated_at: string | null
          whatsapp_number: string
        }
        Insert: {
          agent_id: string
          created_at?: string | null
          email?: string | null
          estimated_completion?: string | null
          full_name: string
          id?: string
          is_registered_business?: boolean | null
          next_action?: string | null
          operating_areas: string[]
          residential_address: string
          reviewer_notes?: string | null
          status?: Database["public"]["Enums"]["application_status"] | null
          updated_at?: string | null
          whatsapp_number: string
        }
        Update: {
          agent_id?: string
          created_at?: string | null
          email?: string | null
          estimated_completion?: string | null
          full_name?: string
          id?: string
          is_registered_business?: boolean | null
          next_action?: string | null
          operating_areas?: string[]
          residential_address?: string
          reviewer_notes?: string | null
          status?: Database["public"]["Enums"]["application_status"] | null
          updated_at?: string | null
          whatsapp_number?: string
        }
        Relationships: []
      }
      agent_profiles: {
        Row: {
          agent_id: string
          application_id: string | null
          created_at: string | null
          email: string | null
          full_name: string
          id: string
          is_active: boolean | null
          operating_areas: string[]
          updated_at: string | null
          user_id: string | null
          verification_date: string | null
          whatsapp_number: string
        }
        Insert: {
          agent_id: string
          application_id?: string | null
          created_at?: string | null
          email?: string | null
          full_name: string
          id?: string
          is_active?: boolean | null
          operating_areas: string[]
          updated_at?: string | null
          user_id?: string | null
          verification_date?: string | null
          whatsapp_number: string
        }
        Update: {
          agent_id?: string
          application_id?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string
          id?: string
          is_active?: boolean | null
          operating_areas?: string[]
          updated_at?: string | null
          user_id?: string | null
          verification_date?: string | null
          whatsapp_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_profiles_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "agent_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      bulk_operations_log: {
        Row: {
          admin_id: string | null
          application_ids: string[]
          completed_at: string | null
          completed_count: number | null
          created_at: string | null
          error_details: Json | null
          failed_count: number | null
          id: string
          operation_data: Json | null
          operation_type: string
          status: string | null
        }
        Insert: {
          admin_id?: string | null
          application_ids: string[]
          completed_at?: string | null
          completed_count?: number | null
          created_at?: string | null
          error_details?: Json | null
          failed_count?: number | null
          id?: string
          operation_data?: Json | null
          operation_type: string
          status?: string | null
        }
        Update: {
          admin_id?: string | null
          application_ids?: string[]
          completed_at?: string | null
          completed_count?: number | null
          created_at?: string | null
          error_details?: Json | null
          failed_count?: number | null
          id?: string
          operation_data?: Json | null
          operation_type?: string
          status?: string | null
        }
        Relationships: []
      }
      document_validation: {
        Row: {
          confidence_score: number | null
          document_id: string | null
          id: string
          validated_at: string | null
          validated_by: string | null
          validation_details: Json | null
          validation_status: string
          validation_type: string
        }
        Insert: {
          confidence_score?: number | null
          document_id?: string | null
          id?: string
          validated_at?: string | null
          validated_by?: string | null
          validation_details?: Json | null
          validation_status: string
          validation_type: string
        }
        Update: {
          confidence_score?: number | null
          document_id?: string | null
          id?: string
          validated_at?: string | null
          validated_by?: string | null
          validation_details?: Json | null
          validation_status?: string
          validation_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_validation_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "verification_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      escrow_milestones: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          milestone_type: string
          notes: string | null
          status: string | null
          transaction_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          milestone_type: string
          notes?: string | null
          status?: string | null
          transaction_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          milestone_type?: string
          notes?: string | null
          status?: string | null
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "escrow_milestones_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "escrow_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      escrow_transactions: {
        Row: {
          admin_notes: string | null
          amount: number
          created_at: string
          currency: string | null
          dispute_reason: string | null
          escrow_fee: number | null
          funds_released_at: string | null
          id: string
          landlord_id: string | null
          property_id: string | null
          status: string | null
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          tenant_email: string
          tenant_name: string
          tenant_phone: string | null
          transaction_type: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          amount: number
          created_at?: string
          currency?: string | null
          dispute_reason?: string | null
          escrow_fee?: number | null
          funds_released_at?: string | null
          id?: string
          landlord_id?: string | null
          property_id?: string | null
          status?: string | null
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          tenant_email: string
          tenant_name: string
          tenant_phone?: string | null
          transaction_type?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          amount?: number
          created_at?: string
          currency?: string | null
          dispute_reason?: string | null
          escrow_fee?: number | null
          funds_released_at?: string | null
          id?: string
          landlord_id?: string | null
          property_id?: string | null
          status?: string | null
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          tenant_email?: string
          tenant_name?: string
          tenant_phone?: string | null
          transaction_type?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "escrow_transactions_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_log: {
        Row: {
          application_id: string | null
          created_at: string | null
          delivered_at: string | null
          error_message: string | null
          id: string
          message: string
          notification_type: string
          recipient_number: string
          recipient_type: string
          sent_at: string | null
          status: string | null
        }
        Insert: {
          application_id?: string | null
          created_at?: string | null
          delivered_at?: string | null
          error_message?: string | null
          id?: string
          message: string
          notification_type: string
          recipient_number: string
          recipient_type: string
          sent_at?: string | null
          status?: string | null
        }
        Update: {
          application_id?: string | null
          created_at?: string | null
          delivered_at?: string | null
          error_message?: string | null
          id?: string
          message?: string
          notification_type?: string
          recipient_number?: string
          recipient_type?: string
          sent_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_log_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "agent_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          agent_id: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          is_verified_agent: boolean | null
          updated_at: string | null
          whatsapp_number: string | null
        }
        Insert: {
          agent_id?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          is_verified_agent?: boolean | null
          updated_at?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          agent_id?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_verified_agent?: boolean | null
          updated_at?: string | null
          whatsapp_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: true
            referencedRelation: "agent_applications"
            referencedColumns: ["agent_id"]
          },
        ]
      }
      properties: {
        Row: {
          agent_id: string | null
          amenities: string[] | null
          area_sqft: number | null
          bathrooms: number
          bedrooms: number
          contact_email: string | null
          contact_whatsapp: string | null
          created_at: string | null
          description: string | null
          featured: boolean | null
          id: string
          images: string[] | null
          is_available: boolean | null
          is_verified: boolean | null
          landlord_id: string | null
          location: string
          price_per_month: number | null
          price_per_year: number
          property_type: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          agent_id?: string | null
          amenities?: string[] | null
          area_sqft?: number | null
          bathrooms?: number
          bedrooms?: number
          contact_email?: string | null
          contact_whatsapp?: string | null
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          id?: string
          images?: string[] | null
          is_available?: boolean | null
          is_verified?: boolean | null
          landlord_id?: string | null
          location: string
          price_per_month?: number | null
          price_per_year: number
          property_type?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          agent_id?: string | null
          amenities?: string[] | null
          area_sqft?: number | null
          bathrooms?: number
          bedrooms?: number
          contact_email?: string | null
          contact_whatsapp?: string | null
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          id?: string
          images?: string[] | null
          is_available?: boolean | null
          is_verified?: boolean | null
          landlord_id?: string | null
          location?: string
          price_per_month?: number | null
          price_per_year?: number
          property_type?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "properties_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agent_applications"
            referencedColumns: ["agent_id"]
          },
        ]
      }
      property_alerts: {
        Row: {
          alert_type: string
          created_at: string
          id: string
          is_read: boolean | null
          property_id: string
          user_id: string
        }
        Insert: {
          alert_type: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          property_id: string
          user_id: string
        }
        Update: {
          alert_type?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          property_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_alerts_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_inquiries: {
        Row: {
          created_at: string | null
          id: string
          inquirer_email: string
          inquirer_name: string
          inquirer_phone: string | null
          inquiry_type: string | null
          message: string | null
          property_id: string | null
          responded_at: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          inquirer_email: string
          inquirer_name: string
          inquirer_phone?: string | null
          inquiry_type?: string | null
          message?: string | null
          property_id?: string | null
          responded_at?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          inquirer_email?: string
          inquirer_name?: string
          inquirer_phone?: string | null
          inquiry_type?: string | null
          message?: string | null
          property_id?: string | null
          responded_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_inquiries_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      referee_verifications: {
        Row: {
          application_id: string | null
          confirmed_at: string | null
          contacted_at: string | null
          created_at: string | null
          id: string
          notes: string | null
          referee_full_name: string
          referee_role: string
          referee_whatsapp_number: string
          status: Database["public"]["Enums"]["referee_status"] | null
          updated_at: string | null
        }
        Insert: {
          application_id?: string | null
          confirmed_at?: string | null
          contacted_at?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          referee_full_name: string
          referee_role: string
          referee_whatsapp_number: string
          status?: Database["public"]["Enums"]["referee_status"] | null
          updated_at?: string | null
        }
        Update: {
          application_id?: string | null
          confirmed_at?: string | null
          contacted_at?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          referee_full_name?: string
          referee_role?: string
          referee_whatsapp_number?: string
          status?: Database["public"]["Enums"]["referee_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referee_verifications_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "agent_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_properties: {
        Row: {
          created_at: string
          id: string
          property_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          property_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          property_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_properties_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_searches: {
        Row: {
          alert_frequency: string | null
          created_at: string
          id: string
          is_active: boolean | null
          last_alert_sent: string | null
          search_criteria: Json
          search_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          alert_frequency?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_alert_sent?: string | null
          search_criteria: Json
          search_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          alert_frequency?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_alert_sent?: string | null
          search_criteria?: Json
          search_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      system_analytics: {
        Row: {
          additional_data: Json | null
          created_at: string
          id: string
          metric_date: string
          metric_name: string
          metric_value: number
        }
        Insert: {
          additional_data?: Json | null
          created_at?: string
          id?: string
          metric_date?: string
          metric_name: string
          metric_value: number
        }
        Update: {
          additional_data?: Json | null
          created_at?: string
          id?: string
          metric_date?: string
          metric_name?: string
          metric_value?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      verification_documents: {
        Row: {
          application_id: string | null
          document_type: Database["public"]["Enums"]["document_type"]
          file_name: string
          file_path: string
          file_size: number | null
          id: string
          mime_type: string | null
          uploaded_at: string | null
        }
        Insert: {
          application_id?: string | null
          document_type: Database["public"]["Enums"]["document_type"]
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          uploaded_at?: string | null
        }
        Update: {
          application_id?: string | null
          document_type?: Database["public"]["Enums"]["document_type"]
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          uploaded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "verification_documents_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "agent_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      verification_status_log: {
        Row: {
          application_id: string | null
          change_reason: string | null
          changed_by: string | null
          created_at: string | null
          id: string
          new_status: Database["public"]["Enums"]["application_status"]
          notes: string | null
          previous_status:
            | Database["public"]["Enums"]["application_status"]
            | null
        }
        Insert: {
          application_id?: string | null
          change_reason?: string | null
          changed_by?: string | null
          created_at?: string | null
          id?: string
          new_status: Database["public"]["Enums"]["application_status"]
          notes?: string | null
          previous_status?:
            | Database["public"]["Enums"]["application_status"]
            | null
        }
        Update: {
          application_id?: string | null
          change_reason?: string | null
          changed_by?: string | null
          created_at?: string | null
          id?: string
          new_status?: Database["public"]["Enums"]["application_status"]
          notes?: string | null
          previous_status?:
            | Database["public"]["Enums"]["application_status"]
            | null
        }
        Relationships: [
          {
            foreignKeyName: "verification_status_log_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "agent_applications"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_admin_metrics: {
        Args: { admin_user_id: string; metric_date?: string }
        Returns: {
          applications_reviewed: number
          average_review_time_hours: number
          approval_rate: number
        }[]
      }
      create_agent_profile: {
        Args: { application_id: string }
        Returns: undefined
      }
      generate_agent_id: {
        Args: { applicant_name: string }
        Returns: string
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "agent" | "admin" | "super_admin"
      application_status:
        | "pending_review"
        | "documents_reviewed"
        | "referee_contacted"
        | "approved"
        | "rejected"
        | "needs_info"
      document_type: "id_document" | "selfie_with_id" | "cac_document"
      referee_status: "pending" | "contacted" | "confirmed" | "failed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["agent", "admin", "super_admin"],
      application_status: [
        "pending_review",
        "documents_reviewed",
        "referee_contacted",
        "approved",
        "rejected",
        "needs_info",
      ],
      document_type: ["id_document", "selfie_with_id", "cac_document"],
      referee_status: ["pending", "contacted", "confirmed", "failed"],
    },
  },
} as const
