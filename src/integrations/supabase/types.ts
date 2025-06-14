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
      generate_agent_id: {
        Args: { applicant_name: string }
        Returns: string
      }
    }
    Enums: {
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
