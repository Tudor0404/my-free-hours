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
      booking: {
        Row: {
          created_at: string
          duration_id: number
          guest_email: string | null
          id: number
          meeting_method: Database["public"]["Enums"]["meeting_method"]
          page_id: number
          type_id: number
        }
        Insert: {
          created_at?: string
          duration_id: number
          guest_email?: string | null
          id?: number
          meeting_method: Database["public"]["Enums"]["meeting_method"]
          page_id: number
          type_id: number
        }
        Update: {
          created_at?: string
          duration_id?: number
          guest_email?: string | null
          id?: number
          meeting_method?: Database["public"]["Enums"]["meeting_method"]
          page_id?: number
          type_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "booking_duration_id_fkey"
            columns: ["duration_id"]
            isOneToOne: false
            referencedRelation: "duration"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "booking_page"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_type_id_fkey"
            columns: ["type_id"]
            isOneToOne: false
            referencedRelation: "booking_type"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_page: {
        Row: {
          active: boolean
          created_at: string
          id: number
          "inperson-schedule": number | null
          maximum_lead: number
          minimum_lead: number
          "online-schedule": number | null
          owner: string
          post_notification: string | null
          post_notification_time: number
          pre_notification: string | null
          pre_notification_time: number
          required_email_domains: string[] | null
          requires_email: boolean
          time_increment: number
          timezone: number | null
          url_id: string | null
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: number
          "inperson-schedule"?: number | null
          maximum_lead?: number
          minimum_lead?: number
          "online-schedule"?: number | null
          owner: string
          post_notification?: string | null
          post_notification_time?: number
          pre_notification?: string | null
          pre_notification_time?: number
          required_email_domains?: string[] | null
          requires_email?: boolean
          time_increment?: number
          timezone?: number | null
          url_id?: string | null
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: number
          "inperson-schedule"?: number | null
          maximum_lead?: number
          minimum_lead?: number
          "online-schedule"?: number | null
          owner?: string
          post_notification?: string | null
          post_notification_time?: number
          pre_notification?: string | null
          pre_notification_time?: number
          required_email_domains?: string[] | null
          requires_email?: boolean
          time_increment?: number
          timezone?: number | null
          url_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_page_inperson-schedule_fkey"
            columns: ["inperson-schedule"]
            isOneToOne: false
            referencedRelation: "schedule"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_page_online-schedule_fkey"
            columns: ["online-schedule"]
            isOneToOne: false
            referencedRelation: "schedule"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_type: {
        Row: {
          created_at: string
          description: string
          id: number
          in_person: boolean
          name: string
          online: boolean
          post_notification: string | null
          pre_notification: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string
          id?: number
          in_person?: boolean
          name: string
          online?: boolean
          post_notification?: string | null
          pre_notification?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          id?: number
          in_person?: boolean
          name?: string
          online?: boolean
          post_notification?: string | null
          pre_notification?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      duration: {
        Row: {
          duration: number
          id: number
          type_id: number
        }
        Insert: {
          duration: number
          id?: number
          type_id: number
        }
        Update: {
          duration?: number
          id?: number
          type_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "duration_type_id_fkey"
            columns: ["type_id"]
            isOneToOne: false
            referencedRelation: "booking_type"
            referencedColumns: ["id"]
          },
        ]
      }
      online_booking: {
        Row: {
          booking_id: number | null
          id: number
          service: string | null
          url: string
        }
        Insert: {
          booking_id?: number | null
          id?: number
          service?: string | null
          url: string
        }
        Update: {
          booking_id?: number | null
          id?: number
          service?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "online_booking_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "booking"
            referencedColumns: ["id"]
          },
        ]
      }
      schedule: {
        Row: {
          created_at: string
          description: string
          id: number
          name: string
          schedule: Json
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string
          id?: number
          name: string
          schedule: Json
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          id?: number
          name?: string
          schedule?: Json
          user_id?: string | null
        }
        Relationships: []
      }
      user: {
        Row: {
          first_name: string
          id: number
          last_name: string
          title: string
          user_id: string
        }
        Insert: {
          first_name: string
          id?: number
          last_name: string
          title: string
          user_id: string
        }
        Update: {
          first_name?: string
          id?: number
          last_name?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      meeting_method: "online" | "in_person"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
