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
    PostgrestVersion: "13.0.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      artikel: {
        Row: {
          created_at: string | null
          gambar_artikel: string | null
          id_artikel: number
          id_kategori: number | null
          isi_artikel: string
          judul_artikel: string
          penulis: string | null
          status: string
          updated_at: string | null
          views: number | null
        }
        Insert: {
          created_at?: string | null
          gambar_artikel?: string | null
          id_artikel?: number
          id_kategori?: number | null
          isi_artikel: string
          judul_artikel: string
          penulis?: string | null
          status: string
          updated_at?: string | null
          views?: number | null
        }
        Update: {
          created_at?: string | null
          gambar_artikel?: string | null
          id_artikel?: number
          id_kategori?: number | null
          isi_artikel?: string
          judul_artikel?: string
          penulis?: string | null
          status?: string
          updated_at?: string | null
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "artikel_id_kategori_fkey"
            columns: ["id_kategori"]
            isOneToOne: false
            referencedRelation: "kategori"
            referencedColumns: ["id_kategori"]
          },
          {
            foreignKeyName: "artikel_penulis_fkey"
            columns: ["penulis"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id_user"]
          },
        ]
      }
      banner: {
        Row: {
          created_at: string | null
          deskripsi: string | null
          gambar_banner: string
          id_banner: number
          posisi: number | null
          url_tujuan: string | null
        }
        Insert: {
          created_at?: string | null
          deskripsi?: string | null
          gambar_banner: string
          id_banner?: number
          posisi?: number | null
          url_tujuan?: string | null
        }
        Update: {
          created_at?: string | null
          deskripsi?: string | null
          gambar_banner?: string
          id_banner?: number
          posisi?: number | null
          url_tujuan?: string | null
        }
        Relationships: []
      }
      iklan: {
        Row: {
          created_at: string | null
          deskripsi: string | null
          gambar_iklan: string
          id_iklan: number
          posisi: number | null
          url_tujuan: string | null
        }
        Insert: {
          created_at?: string | null
          deskripsi?: string | null
          gambar_iklan: string
          id_iklan?: number
          posisi?: number | null
          url_tujuan?: string | null
        }
        Update: {
          created_at?: string | null
          deskripsi?: string | null
          gambar_iklan?: string
          id_iklan?: number
          posisi?: number | null
          url_tujuan?: string | null
        }
        Relationships: []
      }
      kategori: {
        Row: {
          id_kategori: number
          nama_kategori: string
        }
        Insert: {
          id_kategori?: number
          nama_kategori: string
        }
        Update: {
          id_kategori?: number
          nama_kategori?: string
        }
        Relationships: []
      }
      sponsor: {
        Row: {
          created_at: string | null
          deskripsi: string | null
          id_sponsor: number
          logo_sponsor: string | null
          posisi: number | null
          url_sponsor: string | null
        }
        Insert: {
          created_at?: string | null
          deskripsi?: string | null
          id_sponsor?: number
          logo_sponsor?: string | null
          posisi?: number | null
          url_sponsor?: string | null
        }
        Update: {
          created_at?: string | null
          deskripsi?: string | null
          id_sponsor?: number
          logo_sponsor?: string | null
          posisi?: number | null
          url_sponsor?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id_user: string
          instagram: string | null
          nama_user: string
          role: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id_user: string
          instagram?: string | null
          nama_user: string
          role?: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id_user?: string
          instagram?: string | null
          nama_user?: string
          role?: string
        }
        Relationships: []
      }
      video: {
        Row: {
          created_at: string | null
          id_video: number
          judul_video: string
          url_video: string
        }
        Insert: {
          created_at?: string | null
          id_video?: number
          judul_video: string
          url_video: string
        }
        Update: {
          created_at?: string | null
          id_video?: number
          judul_video?: string
          url_video?: string
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
      [_ in never]: never
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
