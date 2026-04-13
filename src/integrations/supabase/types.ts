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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      announcements: {
        Row: {
          capacity: number | null
          created_at: string
          date: string
          description: string
          event_time: string | null
          id: string
          image: string | null
          is_upcoming: boolean | null
          location: string | null
          registered: number | null
          tag: string | null
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          capacity?: number | null
          created_at?: string
          date: string
          description: string
          event_time?: string | null
          id?: string
          image?: string | null
          is_upcoming?: boolean | null
          location?: string | null
          registered?: number | null
          tag?: string | null
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          capacity?: number | null
          created_at?: string
          date?: string
          description?: string
          event_time?: string | null
          id?: string
          image?: string | null
          is_upcoming?: boolean | null
          location?: string | null
          registered?: number | null
          tag?: string | null
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      book_usage: {
        Row: {
          book_id: string
          created_at: string
          downloads: number
          id: string
          rating: number | null
          rating_count: number
          user_id: string | null
          views: number
        }
        Insert: {
          book_id: string
          created_at?: string
          downloads?: number
          id?: string
          rating?: number | null
          rating_count?: number
          user_id?: string | null
          views?: number
        }
        Update: {
          book_id?: string
          created_at?: string
          downloads?: number
          id?: string
          rating?: number | null
          rating_count?: number
          user_id?: string | null
          views?: number
        }
        Relationships: [
          {
            foreignKeyName: "book_usage_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: true
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      books: {
        Row: {
          author: string
          category: string
          cover_url: string | null
          created_at: string
          description: string | null
          id: string
          keywords: string[] | null
          language: string
          pdf_url: string | null
          title: string
          year: number
        }
        Insert: {
          author: string
          category: string
          cover_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          keywords?: string[] | null
          language?: string
          pdf_url?: string | null
          title: string
          year: number
        }
        Update: {
          author?: string
          category?: string
          cover_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          keywords?: string[] | null
          language?: string
          pdf_url?: string | null
          title?: string
          year?: number
        }
        Relationships: []
      }
      event_bookings: {
        Row: {
          announcement_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          announcement_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          announcement_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_bookings_announcement_id_fkey"
            columns: ["announcement_id"]
            isOneToOne: false
            referencedRelation: "announcements"
            referencedColumns: ["id"]
          },
        ]
      }
      facebook_posts: {
        Row: {
          created_at: string
          facebook_url: string
          id: string
          image_url: string | null
          post_date: string
          text: string
        }
        Insert: {
          created_at?: string
          facebook_url?: string
          id?: string
          image_url?: string | null
          post_date: string
          text: string
        }
        Update: {
          created_at?: string
          facebook_url?: string
          id?: string
          image_url?: string | null
          post_date?: string
          text?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          admin_reply: string | null
          created_at: string
          email: string
          id: string
          is_read: boolean | null
          message: string
          name: string
          replied_at: string | null
          subject: string
        }
        Insert: {
          admin_reply?: string | null
          created_at?: string
          email: string
          id?: string
          is_read?: boolean | null
          message: string
          name: string
          replied_at?: string | null
          subject: string
        }
        Update: {
          admin_reply?: string | null
          created_at?: string
          email?: string
          id?: string
          is_read?: boolean | null
          message?: string
          name?: string
          replied_at?: string | null
          subject?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      staff: {
        Row: {
          created_at: string
          email: string | null
          id: string
          image_url: string | null
          name: string
          order_priority: number | null
          role: string
          specialization: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          image_url?: string | null
          name: string
          order_priority?: number | null
          role: string
          specialization?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          image_url?: string | null
          name?: string
          order_priority?: number | null
          role?: string
          specialization?: string | null
        }
        Relationships: []
      }
      user_activities: {
        Row: {
          activity_type: Database["public"]["Enums"]["activity_type"]
          book_id: string
          created_at: string
          id: string
          rating: number | null
          user_id: string | null
        }
        Insert: {
          activity_type: Database["public"]["Enums"]["activity_type"]
          book_id: string
          created_at?: string
          id?: string
          rating?: number | null
          user_id?: string | null
        }
        Update: {
          activity_type?: Database["public"]["Enums"]["activity_type"]
          book_id?: string
          created_at?: string
          id?: string
          rating?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_activities_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
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
          role?: Database["public"]["Enums"]["app_role"]
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      decrement_registered: { Args: { ann_id: string }; Returns: undefined }
      get_activity_daily_stats: {
        Args: { _days?: number }
        Returns: {
          day: string
          downloads: number
          ratings: number
          views: number
        }[]
      }
      get_activity_type_totals: {
        Args: never
        Returns: {
          activity_type: string
          total: number
        }[]
      }
      get_book_activity_stats: {
        Args: { _book_id?: string }
        Returns: {
          book_id: string
          downloads: number
          rating: number
          rating_count: number
          views: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_registered: { Args: { ann_id: string }; Returns: undefined }
      record_book_activity: {
        Args: {
          _activity_type: Database["public"]["Enums"]["activity_type"]
          _book_id: string
        }
        Returns: {
          book_id: string
          downloads: number
          rating: number
          rating_count: number
          views: number
        }[]
      }
      upsert_book_rating: {
        Args: { _book_id: string; _rating: number }
        Returns: {
          book_id: string
          downloads: number
          my_rating: number
          rating: number
          rating_count: number
          views: number
        }[]
      }
    }
    Enums: {
      activity_type: "view" | "download" | "rating"
      app_role: "admin" | "user"
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
      activity_type: ["view", "download", "rating"],
      app_role: ["admin", "user"],
    },
  },
} as const
