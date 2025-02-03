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
      blacklisted_days: {
        Row: {
          date: string
          user_id: string
        }
        Insert: {
          date: string
          user_id?: string
        }
        Update: {
          date?: string
          user_id?: string
        }
        Relationships: []
      }
      booking: {
        Row: {
          calendar_id: string
          created_at: string
          duration_id: number
          guest_email: string | null
          guest_name: string
          id: number
          meeting_method: Database["public"]["Enums"]["meeting_method"]
          page_id: number
          start_time: string
          type_id: number
          url_id: string
        }
        Insert: {
          calendar_id?: string
          created_at?: string
          duration_id: number
          guest_email?: string | null
          guest_name: string
          id?: number
          meeting_method: Database["public"]["Enums"]["meeting_method"]
          page_id: number
          start_time: string
          type_id: number
          url_id?: string
        }
        Update: {
          calendar_id?: string
          created_at?: string
          duration_id?: number
          guest_email?: string | null
          guest_name?: string
          id?: number
          meeting_method?: Database["public"]["Enums"]["meeting_method"]
          page_id?: number
          start_time?: string
          type_id?: number
          url_id?: string
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
            referencedRelation: "active_page_schedules"
            referencedColumns: ["page_id"]
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
          {
            foreignKeyName: "booking_type_id_fkey"
            columns: ["type_id"]
            isOneToOne: false
            referencedRelation: "booking_types_with_durations"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_message_queue: {
        Row: {
          booking_id: number | null
          created_at: string
          id: number
          msg_id: number
        }
        Insert: {
          booking_id?: number | null
          created_at?: string
          id?: number
          msg_id: number
        }
        Update: {
          booking_id?: number | null
          created_at?: string
          id?: number
          msg_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "booking_message_queue_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "booking"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_message_queue_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings_with_duration"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_page: {
        Row: {
          active: boolean
          calendar_id: string
          created_at: string
          id: number
          inperson_schedule: number | null
          maximum_lead: number
          minimum_lead: number
          online_schedule: number | null
          post_notification: string | null
          post_notification_time: number
          pre_notification: string | null
          pre_notification_time: number
          required_email_domains: string | null
          requires_email: boolean
          time_increment: number
          url_id: string
          user_id: string
        }
        Insert: {
          active?: boolean
          calendar_id?: string
          created_at?: string
          id?: number
          inperson_schedule?: number | null
          maximum_lead?: number
          minimum_lead?: number
          online_schedule?: number | null
          post_notification?: string | null
          post_notification_time?: number
          pre_notification?: string | null
          pre_notification_time?: number
          required_email_domains?: string | null
          requires_email?: boolean
          time_increment?: number
          url_id?: string
          user_id?: string
        }
        Update: {
          active?: boolean
          calendar_id?: string
          created_at?: string
          id?: number
          inperson_schedule?: number | null
          maximum_lead?: number
          minimum_lead?: number
          online_schedule?: number | null
          post_notification?: string | null
          post_notification_time?: number
          pre_notification?: string | null
          pre_notification_time?: number
          required_email_domains?: string | null
          requires_email?: boolean
          time_increment?: number
          url_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_page_inperson_schedule_fkey"
            columns: ["inperson_schedule"]
            isOneToOne: false
            referencedRelation: "schedule"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_page_online_schedule_fkey"
            columns: ["online_schedule"]
            isOneToOne: false
            referencedRelation: "schedule"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_type: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          id: number
          in_person: boolean
          name: string
          online: boolean
          post_notification: string | null
          pre_notification: string | null
          user_id: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: number
          in_person?: boolean
          name: string
          online?: boolean
          post_notification?: string | null
          pre_notification?: string | null
          user_id?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: number
          in_person?: boolean
          name?: string
          online?: boolean
          post_notification?: string | null
          pre_notification?: string | null
          user_id?: string
        }
        Relationships: []
      }
      deleted_booking: {
        Row: {
          calendar_id: string
          deletion_date: string | null
          duration: number
          id: number
          page_id: number
          start_time: string
          type_name: string
        }
        Insert: {
          calendar_id: string
          deletion_date?: string | null
          duration: number
          id?: number
          page_id: number
          start_time: string
          type_name: string
        }
        Update: {
          calendar_id?: string
          deletion_date?: string | null
          duration?: number
          id?: number
          page_id?: number
          start_time?: string
          type_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "deleted_booking_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "active_page_schedules"
            referencedColumns: ["page_id"]
          },
          {
            foreignKeyName: "deleted_booking_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "booking_page"
            referencedColumns: ["id"]
          },
        ]
      }
      duration: {
        Row: {
          active: boolean
          duration: number
          id: number
          type_id: number
        }
        Insert: {
          active?: boolean
          duration: number
          id?: number
          type_id: number
        }
        Update: {
          active?: boolean
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
          {
            foreignKeyName: "duration_type_id_fkey"
            columns: ["type_id"]
            isOneToOne: false
            referencedRelation: "booking_types_with_durations"
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
          {
            foreignKeyName: "online_booking_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings_with_duration"
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
      schedule_references: {
        Row: {
          referenced_id: number
          source_id: number
        }
        Insert: {
          referenced_id: number
          source_id: number
        }
        Update: {
          referenced_id?: number
          source_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "schedule_references_referenced_id_fkey"
            columns: ["referenced_id"]
            isOneToOne: false
            referencedRelation: "schedule"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_references_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "schedule"
            referencedColumns: ["id"]
          },
        ]
      }
      user: {
        Row: {
          display_name: string | null
          id: number
          ms_provider_refresh_token: string | null
          ms_provider_token: string | null
          ms_sync_calendar: boolean
          ms_teams_meetings: boolean
          user_id: string
        }
        Insert: {
          display_name?: string | null
          id?: number
          ms_provider_refresh_token?: string | null
          ms_provider_token?: string | null
          ms_sync_calendar?: boolean
          ms_teams_meetings?: boolean
          user_id: string
        }
        Update: {
          display_name?: string | null
          id?: number
          ms_provider_refresh_token?: string | null
          ms_provider_token?: string | null
          ms_sync_calendar?: boolean
          ms_teams_meetings?: boolean
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      active_page_schedules: {
        Row: {
          inperson_schedule: Json | null
          online_schedule: Json | null
          page_id: number | null
        }
        Relationships: []
      }
      booking_types_with_durations: {
        Row: {
          active: boolean | null
          description: string | null
          durations: number[] | null
          id: number | null
          in_person: boolean | null
          name: string | null
          online: boolean | null
          post_notification: string | null
          pre_notification: string | null
          user_id: string | null
        }
        Relationships: []
      }
      bookings_with_duration: {
        Row: {
          created_at: string | null
          duration: number | null
          guest_email: string | null
          guest_name: string | null
          id: number | null
          meeting_method: Database["public"]["Enums"]["meeting_method"] | null
          start_time: string | null
          type_id: number | null
          url_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_type_id_fkey"
            columns: ["type_id"]
            isOneToOne: false
            referencedRelation: "booking_type"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_type_id_fkey"
            columns: ["type_id"]
            isOneToOne: false
            referencedRelation: "booking_types_with_durations"
            referencedColumns: ["id"]
          },
        ]
      }
      combined_bookings: {
        Row: {
          booking_calendar_id: string | null
          duration: number | null
          guest_email: string | null
          guest_name: string | null
          host_email: string | null
          host_name: string | null
          id: number | null
          is_deleted: boolean | null
          meeting_method: Database["public"]["Enums"]["meeting_method"] | null
          page_calendar_id: string | null
          page_post_notification: string | null
          page_pre_notification: string | null
          start_time: string | null
          type_description: string | null
          type_name: string | null
          type_post_notification: string | null
          type_pre_notification: string | null
          url_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      create_booking: {
        Args: {
          p_duration_id: number
          p_guest_name: string
          p_meeting_method: string
          p_type_id: number
          p_page_id: number
          p_start_time: string
          p_guest_email?: string
        }
        Returns: string
      }
      create_booking_type_with_durations: {
        Args: {
          type_data: Json
          user_id: string
        }
        Returns: Json
      }
      decode_schedule_json: {
        Args: {
          schedule_json: Json
        }
        Returns: Json
      }
      delete_booking: {
        Args: {
          url_id_input: string
        }
        Returns: {
          url_id: string
        }[]
      }
      find_schedule_references:
        | {
            Args: {
              schedule_json: Json
            }
            Returns: {
              referenced_id: number
            }[]
          }
        | {
            Args: {
              schedule_json: Json
              current_schedule_id: number
            }
            Returns: {
              referenced_id: number
            }[]
          }
      get_booking: {
        Args: {
          url_id_input: string
        }
        Returns: {
          meeting_method: Database["public"]["Enums"]["meeting_method"]
          start_time: string
          duration: number
          meeting_name: string
          meeting_description: string
          host_name: string
        }[]
      }
      get_booking_page_details: {
        Args: {
          url_id_input: string
        }
        Returns: {
          id: number
          requires_email: boolean
          required_email_domains: string
          time_increment: number
          minimum_lead: number
          maximum_lead: number
          online_schedule: Json
          inperson_schedule: Json
          booking_types: Json
          display_name: string
          booked_slots: Json
          blacklisted_dates: string[]
        }[]
      }
      get_booking_types_with_durations: {
        Args: {
          p_user_id: string
        }
        Returns: {
          id: number
          name: string
          description: string
          active: boolean
          in_person: boolean
          online: boolean
          pre_notification: string
          post_notification: string
          durations: Json
        }[]
      }
      get_bookings_by_calendar_id: {
        Args: {
          p_calendar_id: string
        }
        Returns: {
          booking_calendar_id: string
          duration: number
          guest_email: string
          guest_name: string
          host_email: string
          host_name: string
          is_deleted: boolean
          meeting_method: string
          page_calendar_id: string
          page_post_notification: string
          page_pre_notification: string
          start_time: string
          type_description: string
          type_name: string
          type_post_notification: string
          type_pre_notification: string
          url_id: string
        }[]
      }
      get_bookings_count_by_dates: {
        Args: {
          dates: string[]
        }
        Returns: number
      }
      has_circular_reference:
        | {
            Args: {
              schedule_id: number
              new_schedule: Json
            }
            Returns: boolean
          }
        | {
            Args: {
              schedule_id: number
              schedule_json: Json
            }
            Returns: boolean
          }
      has_self_reference: {
        Args: {
          p_schedule_id: number
          schedule_json: Json
        }
        Returns: boolean
      }
      process_schedule_rules: {
        Args: {
          rules: Json
        }
        Returns: {
          referenced_id: number
        }[]
      }
      refresh_all_schedule_references: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      show_schedule_references: {
        Args: {
          p_schedule_id?: number
        }
        Returns: {
          source_id: number
          referenced_id: number
          reference_chain: string
        }[]
      }
      update_blacklisted_dates: {
        Args: {
          p_dates_to_delete: string[]
          p_dates_to_insert: string[]
          p_delete_meetings: boolean
        }
        Returns: undefined
      }
      update_booking_type_with_durations:
        | {
            Args: {
              p_id: number
              p_name: string
              p_description: string
              p_online: boolean
              p_in_person: boolean
              p_pre_notification: string
              p_post_notification: string
              p_durations: number[]
              p_user_id: string
            }
            Returns: number
          }
        | {
            Args: {
              type_data: Json
            }
            Returns: Json
          }
    }
    Enums: {
      email_type: "new_booking"
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
