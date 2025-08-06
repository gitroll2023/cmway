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
      activity_logs: {
        Row: {
          action: string
          changes: Json | null
          created_at: string | null
          entity_id: string | null
          entity_name: string | null
          entity_type: string
          id: string
          ip_address: unknown | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          changes?: Json | null
          created_at?: string | null
          entity_id?: string | null
          entity_name?: string | null
          entity_type: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          changes?: Json | null
          created_at?: string | null
          entity_id?: string | null
          entity_name?: string | null
          entity_type?: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      banners: {
        Row: {
          animations: Json | null
          clicks: number | null
          content: Json
          created_at: string | null
          display_rules: Json | null
          id: string
          impressions: number | null
          is_active: boolean | null
          link_target: string | null
          link_url: string | null
          media: Json | null
          name: string
          priority: number | null
          styles: Json | null
          targeting: Json | null
          type: string
          updated_at: string | null
        }
        Insert: {
          animations?: Json | null
          clicks?: number | null
          content: Json
          created_at?: string | null
          display_rules?: Json | null
          id?: string
          impressions?: number | null
          is_active?: boolean | null
          link_target?: string | null
          link_url?: string | null
          media?: Json | null
          name: string
          priority?: number | null
          styles?: Json | null
          targeting?: Json | null
          type: string
          updated_at?: string | null
        }
        Update: {
          animations?: Json | null
          clicks?: number | null
          content?: Json
          created_at?: string | null
          display_rules?: Json | null
          id?: string
          impressions?: number | null
          is_active?: boolean | null
          link_target?: string | null
          link_url?: string | null
          media?: Json | null
          name?: string
          priority?: number | null
          styles?: Json | null
          targeting?: Json | null
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      brands: {
        Row: {
          created_at: string | null
          description: Json | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          logo: string | null
          name: Json
          position: number | null
          slug: string
          story: Json | null
          updated_at: string | null
          values: Json | null
          website: string | null
        }
        Insert: {
          created_at?: string | null
          description?: Json | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          logo?: string | null
          name: Json
          position?: number | null
          slug: string
          story?: Json | null
          updated_at?: string | null
          values?: Json | null
          website?: string | null
        }
        Update: {
          created_at?: string | null
          description?: Json | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          logo?: string | null
          name?: Json
          position?: number | null
          slug?: string
          story?: Json | null
          updated_at?: string | null
          values?: Json | null
          website?: string | null
        }
        Relationships: []
      }
      catalog_downloads: {
        Row: {
          catalog_type: string | null
          company: string | null
          created_at: string | null
          download_url: string | null
          email: string | null
          id: string
          ip_address: unknown | null
          marketing_agreed: boolean | null
          name: string | null
          phone: string | null
          user_agent: string | null
        }
        Insert: {
          catalog_type?: string | null
          company?: string | null
          created_at?: string | null
          download_url?: string | null
          email?: string | null
          id?: string
          ip_address?: unknown | null
          marketing_agreed?: boolean | null
          name?: string | null
          phone?: string | null
          user_agent?: string | null
        }
        Update: {
          catalog_type?: string | null
          company?: string | null
          created_at?: string | null
          download_url?: string | null
          email?: string | null
          id?: string
          ip_address?: unknown | null
          marketing_agreed?: boolean | null
          name?: string | null
          phone?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          banner_image: string | null
          created_at: string | null
          custom_fields: Json | null
          description: Json | null
          display_settings: Json | null
          icon: string | null
          id: string
          is_active: boolean | null
          layout_settings: Json | null
          level: number | null
          meta: Json | null
          name: Json
          parent_id: string | null
          path: string | null
          position: number | null
          slug: string
          thumbnail: string | null
          updated_at: string | null
        }
        Insert: {
          banner_image?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          description?: Json | null
          display_settings?: Json | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          layout_settings?: Json | null
          level?: number | null
          meta?: Json | null
          name: Json
          parent_id?: string | null
          path?: string | null
          position?: number | null
          slug: string
          thumbnail?: string | null
          updated_at?: string | null
        }
        Update: {
          banner_image?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          description?: Json | null
          display_settings?: Json | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          layout_settings?: Json | null
          level?: number | null
          meta?: Json | null
          name?: Json
          parent_id?: string | null
          path?: string | null
          position?: number | null
          slug?: string
          thumbnail?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      consultation_requests: {
        Row: {
          admin_notes: string | null
          assigned_to: string | null
          company: string | null
          consultation_result: string | null
          consultation_type: string | null
          created_at: string | null
          email: string | null
          id: string
          marketing_agreed: boolean | null
          message: string | null
          name: string
          phone: string
          preferred_date: string | null
          preferred_time: string | null
          privacy_agreed: boolean | null
          product_interests: string[] | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          admin_notes?: string | null
          assigned_to?: string | null
          company?: string | null
          consultation_result?: string | null
          consultation_type?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          marketing_agreed?: boolean | null
          message?: string | null
          name: string
          phone: string
          preferred_date?: string | null
          preferred_time?: string | null
          privacy_agreed?: boolean | null
          product_interests?: string[] | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          admin_notes?: string | null
          assigned_to?: string | null
          company?: string | null
          consultation_result?: string | null
          consultation_type?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          marketing_agreed?: boolean | null
          message?: string | null
          name?: string
          phone?: string
          preferred_date?: string | null
          preferred_time?: string | null
          privacy_agreed?: boolean | null
          product_interests?: string[] | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      contact_requests: {
        Row: {
          admin_notes: string | null
          created_at: string | null
          email: string | null
          id: string
          ip_address: unknown | null
          message: string
          name: string
          phone: string
          status: string | null
          subject: string
          updated_at: string | null
          user_agent: string | null
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          ip_address?: unknown | null
          message: string
          name: string
          phone: string
          status?: string | null
          subject: string
          updated_at?: string | null
          user_agent?: string | null
        }
        Update: {
          admin_notes?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          ip_address?: unknown | null
          message?: string
          name?: string
          phone?: string
          status?: string | null
          subject?: string
          updated_at?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      content_blocks: {
        Row: {
          animations: Json | null
          category: string | null
          content: Json
          created_at: string | null
          id: string
          is_global: boolean | null
          is_template: boolean | null
          name: string
          responsive: Json | null
          type: string
          updated_at: string | null
        }
        Insert: {
          animations?: Json | null
          category?: string | null
          content: Json
          created_at?: string | null
          id?: string
          is_global?: boolean | null
          is_template?: boolean | null
          name: string
          responsive?: Json | null
          type: string
          updated_at?: string | null
        }
        Update: {
          animations?: Json | null
          category?: string | null
          content?: Json
          created_at?: string | null
          id?: string
          is_global?: boolean | null
          is_template?: boolean | null
          name?: string
          responsive?: Json | null
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      menus: {
        Row: {
          badge_color: string | null
          badge_text: string | null
          created_at: string | null
          css_class: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          is_mega_menu: boolean | null
          mega_menu_columns: number | null
          mega_menu_content: Json | null
          menu_location: string
          parent_id: string | null
          position: number | null
          target: string | null
          title: Json
          updated_at: string | null
          url: string | null
          url_type: string | null
          visibility_rules: Json | null
        }
        Insert: {
          badge_color?: string | null
          badge_text?: string | null
          created_at?: string | null
          css_class?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          is_mega_menu?: boolean | null
          mega_menu_columns?: number | null
          mega_menu_content?: Json | null
          menu_location: string
          parent_id?: string | null
          position?: number | null
          target?: string | null
          title: Json
          updated_at?: string | null
          url?: string | null
          url_type?: string | null
          visibility_rules?: Json | null
        }
        Update: {
          badge_color?: string | null
          badge_text?: string | null
          created_at?: string | null
          css_class?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          is_mega_menu?: boolean | null
          mega_menu_columns?: number | null
          mega_menu_content?: Json | null
          menu_location?: string
          parent_id?: string | null
          position?: number | null
          target?: string | null
          title?: Json
          updated_at?: string | null
          url?: string | null
          url_type?: string | null
          visibility_rules?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "menus_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "menus"
            referencedColumns: ["id"]
          },
        ]
      }
      pages: {
        Row: {
          access_rules: Json | null
          animations: Json | null
          created_at: string | null
          created_by: string | null
          draft_content: Json | null
          id: string
          meta: Json
          page_type: string | null
          published_at: string | null
          published_content: Json | null
          scheduled_at: string | null
          settings: Json | null
          slug: string
          status: string | null
          template: string | null
          updated_at: string | null
          updated_by: string | null
          version: number | null
        }
        Insert: {
          access_rules?: Json | null
          animations?: Json | null
          created_at?: string | null
          created_by?: string | null
          draft_content?: Json | null
          id?: string
          meta?: Json
          page_type?: string | null
          published_at?: string | null
          published_content?: Json | null
          scheduled_at?: string | null
          settings?: Json | null
          slug: string
          status?: string | null
          template?: string | null
          updated_at?: string | null
          updated_by?: string | null
          version?: number | null
        }
        Update: {
          access_rules?: Json | null
          animations?: Json | null
          created_at?: string | null
          created_by?: string | null
          draft_content?: Json | null
          id?: string
          meta?: Json
          page_type?: string | null
          published_at?: string | null
          published_content?: Json | null
          scheduled_at?: string | null
          settings?: Json | null
          slug?: string
          status?: string | null
          template?: string | null
          updated_at?: string | null
          updated_by?: string | null
          version?: number | null
        }
        Relationships: []
      }
      products: {
        Row: {
          barcode: string | null
          benefits: Json | null
          brand_id: string | null
          category_ids: string[] | null
          certifications: Json | null
          created_at: string | null
          custom_fields: Json | null
          description: Json | null
          featured: boolean | null
          features: Json | null
          id: string
          ingredients: Json | null
          inquiry_settings: Json | null
          is_best: boolean | null
          is_new: boolean | null
          media: Json | null
          name: Json
          nutrition_facts: Json | null
          pricing: Json | null
          primary_category_id: string | null
          published_at: string | null
          quality: Json | null
          related_products: Json | null
          seo: Json | null
          short_description: Json | null
          sku: string
          slug: string
          specifications: Json | null
          stats: Json | null
          status: string | null
          updated_at: string | null
          usage: Json | null
        }
        Insert: {
          barcode?: string | null
          benefits?: Json | null
          brand_id?: string | null
          category_ids?: string[] | null
          certifications?: Json | null
          created_at?: string | null
          custom_fields?: Json | null
          description?: Json | null
          featured?: boolean | null
          features?: Json | null
          id?: string
          ingredients?: Json | null
          inquiry_settings?: Json | null
          is_best?: boolean | null
          is_new?: boolean | null
          media?: Json | null
          name: Json
          nutrition_facts?: Json | null
          pricing?: Json | null
          primary_category_id?: string | null
          published_at?: string | null
          quality?: Json | null
          related_products?: Json | null
          seo?: Json | null
          short_description?: Json | null
          sku: string
          slug: string
          specifications?: Json | null
          stats?: Json | null
          status?: string | null
          updated_at?: string | null
          usage?: Json | null
        }
        Update: {
          barcode?: string | null
          benefits?: Json | null
          brand_id?: string | null
          category_ids?: string[] | null
          certifications?: Json | null
          created_at?: string | null
          custom_fields?: Json | null
          description?: Json | null
          featured?: boolean | null
          features?: Json | null
          id?: string
          ingredients?: Json | null
          inquiry_settings?: Json | null
          is_best?: boolean | null
          is_new?: boolean | null
          media?: Json | null
          name?: Json
          nutrition_facts?: Json | null
          pricing?: Json | null
          primary_category_id?: string | null
          published_at?: string | null
          quality?: Json | null
          related_products?: Json | null
          seo?: Json | null
          short_description?: Json | null
          sku?: string
          slug?: string
          specifications?: Json | null
          stats?: Json | null
          status?: string | null
          updated_at?: string | null
          usage?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "products_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_primary_category_id_fkey"
            columns: ["primary_category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          company_info: Json | null
          created_at: string | null
          description: Json | null
          design_tokens: Json | null
          favicon: string | null
          footer_config: Json | null
          id: string
          integrations: Json | null
          logo_dark: string | null
          logo_light: string | null
          logo_mobile: string | null
          maintenance: Json | null
          og_config: Json | null
          og_image: string | null
          seo_config: Json | null
          site_name: Json | null
          social_links: Json | null
          tagline: Json | null
          updated_at: string | null
        }
        Insert: {
          company_info?: Json | null
          created_at?: string | null
          description?: Json | null
          design_tokens?: Json | null
          favicon?: string | null
          footer_config?: Json | null
          id?: string
          integrations?: Json | null
          logo_dark?: string | null
          logo_light?: string | null
          logo_mobile?: string | null
          maintenance?: Json | null
          og_config?: Json | null
          og_image?: string | null
          seo_config?: Json | null
          site_name?: Json | null
          social_links?: Json | null
          tagline?: Json | null
          updated_at?: string | null
        }
        Update: {
          company_info?: Json | null
          created_at?: string | null
          description?: Json | null
          design_tokens?: Json | null
          favicon?: string | null
          footer_config?: Json | null
          id?: string
          integrations?: Json | null
          logo_dark?: string | null
          logo_light?: string | null
          logo_mobile?: string | null
          maintenance?: Json | null
          og_config?: Json | null
          og_image?: string | null
          seo_config?: Json | null
          site_name?: Json | null
          social_links?: Json | null
          tagline?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      store_locations: {
        Row: {
          address: Json
          business_hours: Json | null
          created_at: string | null
          display_order: number | null
          email: string | null
          facilities: Json | null
          fax: string | null
          holiday_info: string | null
          id: string
          images: Json | null
          is_active: boolean | null
          latitude: number | null
          longitude: number | null
          name: Json
          phone: string | null
          transportation: Json | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          address: Json
          business_hours?: Json | null
          created_at?: string | null
          display_order?: number | null
          email?: string | null
          facilities?: Json | null
          fax?: string | null
          holiday_info?: string | null
          id?: string
          images?: Json | null
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name: Json
          phone?: string | null
          transportation?: Json | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: Json
          business_hours?: Json | null
          created_at?: string | null
          display_order?: number | null
          email?: string | null
          facilities?: Json | null
          fax?: string | null
          holiday_info?: string | null
          id?: string
          images?: Json | null
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name?: Json
          phone?: string | null
          transportation?: Json | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      translations: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_rich_text: boolean | null
          key: string
          namespace: string | null
          translations: Json
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_rich_text?: boolean | null
          key: string
          namespace?: string | null
          translations: Json
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_rich_text?: boolean | null
          key?: string
          namespace?: string | null
          translations?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never