export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      activities: {
        Row: {
          id: string;
          slug: string;
          title: string;
          subtitle: string | null;
          category: string;
          duration_min: number;
          price_usd: number;
          max_guests: number;
          min_guests: number;
          is_private: boolean | null;
          skill_level: string | null;
          media: Json | null;
          tags: string[] | null;
          highlights: string[] | null;
          what_youll_do: string[] | null;
          included: string[] | null;
          safety: string[] | null;
          meeting_point: string | null;
          is_featured: boolean | null;
          is_trending: boolean | null;
          is_sunset: boolean | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          subtitle?: string | null;
          category: string;
          duration_min: number;
          price_usd: number;
          max_guests?: number;
          min_guests?: number;
          is_private?: boolean | null;
          skill_level?: string | null;
          media?: Json | null;
          tags?: string[] | null;
          highlights?: string[] | null;
          what_youll_do?: string[] | null;
          included?: string[] | null;
          safety?: string[] | null;
          meeting_point?: string | null;
          is_featured?: boolean | null;
          is_trending?: boolean | null;
          is_sunset?: boolean | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          subtitle?: string | null;
          category?: string;
          duration_min?: number;
          price_usd?: number;
          max_guests?: number;
          min_guests?: number;
          is_private?: boolean | null;
          skill_level?: string | null;
          media?: Json | null;
          tags?: string[] | null;
          highlights?: string[] | null;
          what_youll_do?: string[] | null;
          included?: string[] | null;
          safety?: string[] | null;
          meeting_point?: string | null;
          is_featured?: boolean | null;
          is_trending?: boolean | null;
          is_sunset?: boolean | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      bookings: {
        Row: {
          id: string;
          trip_id: string;
          user_id: string | null;
          confirmation_code: string;
          guest_count: number;
          total_price: number;
          status: string;
          user_name: string;
          user_email: string | null;
          user_whatsapp: string | null;
          airline_code: string | null;
          promo_code: string | null;
          discount_amount: number | null;
          notes: string | null;
          price_at_booking: number | null;
          final_price: number | null;
          booking_type: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          trip_id: string;
          user_id?: string | null;
          confirmation_code?: string;
          guest_count?: number;
          total_price: number;
          status?: string;
          user_name: string;
          user_email?: string | null;
          user_whatsapp?: string | null;
          airline_code?: string | null;
          promo_code?: string | null;
          discount_amount?: number | null;
          notes?: string | null;
          price_at_booking?: number | null;
          final_price?: number | null;
          booking_type?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          trip_id?: string;
          user_id?: string | null;
          confirmation_code?: string;
          guest_count?: number;
          total_price?: number;
          status?: string;
          user_name?: string;
          user_email?: string | null;
          user_whatsapp?: string | null;
          airline_code?: string | null;
          promo_code?: string | null;
          discount_amount?: number | null;
          notes?: string | null;
          price_at_booking?: number | null;
          final_price?: number | null;
          booking_type?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'bookings_trip_id_fkey';
            columns: ['trip_id'];
            isOneToOne: false;
            referencedRelation: 'trips';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'bookings_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      categories: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'categories_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      notes: {
        Row: {
          category_id: string | null;
          color: string | null;
          created_at: string;
          deleted_at: string | null;
          description: string;
          id: string;
          image_url: string | null;
          pinned: boolean | null;
          title: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          category_id?: string | null;
          color?: string | null;
          created_at?: string;
          deleted_at?: string | null;
          description: string;
          id?: string;
          image_url?: string | null;
          pinned?: boolean | null;
          title?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          category_id?: string | null;
          color?: string | null;
          created_at?: string;
          deleted_at?: string | null;
          description?: string;
          id?: string;
          image_url?: string | null;
          pinned?: boolean | null;
          title?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'notes_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'notes_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      notification_preferences: {
        Row: {
          app_updates: boolean | null;
          daily_summary: boolean | null;
          id: string;
          note_reminders: boolean | null;
          pinned_notes_notifications: boolean | null;
          smart_suggestions: boolean | null;
          sync_notifications: boolean | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          app_updates?: boolean | null;
          daily_summary?: boolean | null;
          id?: string;
          note_reminders?: boolean | null;
          pinned_notes_notifications?: boolean | null;
          smart_suggestions?: boolean | null;
          sync_notifications?: boolean | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          app_updates?: boolean | null;
          daily_summary?: boolean | null;
          id?: string;
          note_reminders?: boolean | null;
          pinned_notes_notifications?: boolean | null;
          smart_suggestions?: boolean | null;
          sync_notifications?: boolean | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'notification_preferences_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: true;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      notifications: {
        Row: {
          created_at: string;
          icon_type: string | null;
          id: string;
          message: string | null;
          notification_type: string | null;
          read: boolean | null;
          title: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          icon_type?: string | null;
          id?: string;
          message?: string | null;
          notification_type?: string | null;
          read?: boolean | null;
          title: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          icon_type?: string | null;
          id?: string;
          message?: string | null;
          notification_type?: string | null;
          read?: boolean | null;
          title?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'notifications_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          email: string | null;
          first_name: string | null;
          id: string;
          last_name: string | null;
          location: string | null;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          email?: string | null;
          first_name?: string | null;
          id: string;
          last_name?: string | null;
          location?: string | null;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          email?: string | null;
          first_name?: string | null;
          id?: string;
          last_name?: string | null;
          location?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_preferences: {
        Row: {
          id: string;
          language: string | null;
          theme: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          id?: string;
          language?: string | null;
          theme?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          id?: string;
          language?: string | null;
          theme?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_preferences_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: true;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      trips: {
        Row: {
          id: string;
          activity_id: string;
          trip_date: string;
          start_time: string;
          end_time: string;
          max_capacity: number;
          booked_count: number;
          status: string;
          notes: string | null;
          min_guests_for_base_price: number;
          base_price_per_person: number;
          booking_status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          activity_id: string;
          trip_date: string;
          start_time: string;
          end_time: string;
          max_capacity?: number;
          booked_count?: number;
          status?: string;
          notes?: string | null;
          min_guests_for_base_price?: number;
          base_price_per_person?: number;
          booking_status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          activity_id?: string;
          trip_date?: string;
          start_time?: string;
          end_time?: string;
          max_capacity?: number;
          booked_count?: number;
          status?: string;
          notes?: string | null;
          min_guests_for_base_price?: number;
          base_price_per_person?: number;
          booking_status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'trips_activity_id_fkey';
            columns: ['activity_id'];
            isOneToOne: false;
            referencedRelation: 'activities';
            referencedColumns: ['id'];
          },
        ];
      };
      user_subscriptions: {
        Row: {
          auto_renew: boolean | null;
          created_at: string;
          currency: string | null;
          expires_at: string | null;
          id: string;
          plan_type: string | null;
          price: number | null;
          revenuecat_customer_id: string | null;
          revenuecat_entitlement_id: string | null;
          starts_at: string | null;
          status: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          auto_renew?: boolean | null;
          created_at?: string;
          currency?: string | null;
          expires_at?: string | null;
          id?: string;
          plan_type?: string | null;
          price?: number | null;
          revenuecat_customer_id?: string | null;
          revenuecat_entitlement_id?: string | null;
          starts_at?: string | null;
          status?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          auto_renew?: boolean | null;
          created_at?: string;
          currency?: string | null;
          expires_at?: string | null;
          id?: string;
          plan_type?: string | null;
          price?: number | null;
          revenuecat_customer_id?: string | null;
          revenuecat_entitlement_id?: string | null;
          starts_at?: string | null;
          status?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_subscriptions_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof Database;
}
  ? (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof Database;
}
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof Database;
}
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;
