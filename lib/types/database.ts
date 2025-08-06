export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      site_settings: {
        Row: {
          id: string
          site_name: Json
          tagline: Json
          description: Json | null
          logo_light: string | null
          logo_dark: string | null
          logo_mobile: string | null
          favicon: string | null
          og_image: string | null
          company_info: Json
          seo_config: Json
          og_config: Json
          social_links: Json
          integrations: Json
          footer_config: Json
          design_tokens: Json
          maintenance: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          site_name?: Json
          tagline?: Json
          description?: Json | null
          logo_light?: string | null
          logo_dark?: string | null
          logo_mobile?: string | null
          favicon?: string | null
          og_image?: string | null
          company_info?: Json
          seo_config?: Json
          og_config?: Json
          social_links?: Json
          integrations?: Json
          footer_config?: Json
          design_tokens?: Json
          maintenance?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          site_name?: Json
          tagline?: Json
          description?: Json | null
          logo_light?: string | null
          logo_dark?: string | null
          logo_mobile?: string | null
          favicon?: string | null
          og_image?: string | null
          company_info?: Json
          seo_config?: Json
          og_config?: Json
          social_links?: Json
          integrations?: Json
          footer_config?: Json
          design_tokens?: Json
          maintenance?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      translations: {
        Row: {
          id: string
          key: string
          namespace: string
          translations: Json
          description: string | null
          is_rich_text: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          namespace?: string
          translations: Json
          description?: string | null
          is_rich_text?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          namespace?: string
          translations?: Json
          description?: string | null
          is_rich_text?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      menus: {
        Row: {
          id: string
          menu_location: string
          parent_id: string | null
          title: Json
          url: string | null
          url_type: string
          target: string
          icon: string | null
          badge_text: string | null
          badge_color: string | null
          css_class: string | null
          is_mega_menu: boolean
          mega_menu_columns: number
          mega_menu_content: Json | null
          visibility_rules: Json
          position: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          menu_location: string
          parent_id?: string | null
          title: Json
          url?: string | null
          url_type?: string
          target?: string
          icon?: string | null
          badge_text?: string | null
          badge_color?: string | null
          css_class?: string | null
          is_mega_menu?: boolean
          mega_menu_columns?: number
          mega_menu_content?: Json | null
          visibility_rules?: Json
          position?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          menu_location?: string
          parent_id?: string | null
          title?: Json
          url?: string | null
          url_type?: string
          target?: string
          icon?: string | null
          badge_text?: string | null
          badge_color?: string | null
          css_class?: string | null
          is_mega_menu?: boolean
          mega_menu_columns?: number
          mega_menu_content?: Json | null
          visibility_rules?: Json
          position?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "menus_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "menus"
            referencedColumns: ["id"]
          }
        ]
      }
      pages: {
        Row: {
          id: string
          slug: string
          template: string
          page_type: string
          meta: Json
          settings: Json
          status: string
          published_at: string | null
          scheduled_at: string | null
          access_rules: Json
          animations: Json
          version: number
          draft_content: Json | null
          published_content: Json | null
          created_at: string
          updated_at: string
          created_by: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          slug: string
          template?: string
          page_type?: string
          meta?: Json
          settings?: Json
          status?: string
          published_at?: string | null
          scheduled_at?: string | null
          access_rules?: Json
          animations?: Json
          version?: number
          draft_content?: Json | null
          published_content?: Json | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
        Update: {
          id?: string
          slug?: string
          template?: string
          page_type?: string
          meta?: Json
          settings?: Json
          status?: string
          published_at?: string | null
          scheduled_at?: string | null
          access_rules?: Json
          animations?: Json
          version?: number
          draft_content?: Json | null
          published_content?: Json | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      content_blocks: {
        Row: {
          id: string
          name: string
          type: string
          category: string | null
          content: Json
          animations: Json
          responsive: Json
          is_global: boolean
          is_template: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: string
          category?: string | null
          content: Json
          animations?: Json
          responsive?: Json
          is_global?: boolean
          is_template?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: string
          category?: string | null
          content?: Json
          animations?: Json
          responsive?: Json
          is_global?: boolean
          is_template?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      page_blocks: {
        Row: {
          id: string
          page_id: string
          block_id: string
          section: string
          position: number
          override_content: Json | null
          override_animations: Json | null
          override_responsive: Json | null
          visibility_rules: Json
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          page_id: string
          block_id: string
          section?: string
          position?: number
          override_content?: Json | null
          override_animations?: Json | null
          override_responsive?: Json | null
          visibility_rules?: Json
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          page_id?: string
          block_id?: string
          section?: string
          position?: number
          override_content?: Json | null
          override_animations?: Json | null
          override_responsive?: Json | null
          visibility_rules?: Json
          is_active?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "page_blocks_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "page_blocks_block_id_fkey"
            columns: ["block_id"]
            isOneToOne: false
            referencedRelation: "content_blocks"
            referencedColumns: ["id"]
          }
        ]
      }
      categories: {
        Row: {
          id: string
          parent_id: string | null
          name: Json
          slug: string
          description: Json | null
          thumbnail: string | null
          banner_image: string | null
          icon: string | null
          meta: Json
          display_settings: Json
          layout_settings: Json
          custom_fields: Json
          position: number
          path: string | null
          level: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          parent_id?: string | null
          name: Json
          slug: string
          description?: Json | null
          thumbnail?: string | null
          banner_image?: string | null
          icon?: string | null
          meta?: Json
          display_settings?: Json
          layout_settings?: Json
          custom_fields?: Json
          position?: number
          path?: string | null
          level?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          parent_id?: string | null
          name?: Json
          slug?: string
          description?: Json | null
          thumbnail?: string | null
          banner_image?: string | null
          icon?: string | null
          meta?: Json
          display_settings?: Json
          layout_settings?: Json
          custom_fields?: Json
          position?: number
          path?: string | null
          level?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
      }
      products: {
        Row: {
          id: string
          sku: string
          barcode: string | null
          name: Json
          slug: string
          short_description: Json | null
          description: Json | null
          features: Json | null
          benefits: Json | null
          usage: Json | null
          primary_category_id: string | null
          category_ids: string[]
          brand_id: string | null
          pricing: Json
          media: Json
          specifications: Json | null
          ingredients: Json | null
          nutrition_facts: Json | null
          certifications: Json | null
          quality: Json
          seo: Json
          inquiry_settings: Json
          related_products: Json
          status: string
          featured: boolean
          is_new: boolean
          is_best: boolean
          stats: Json
          custom_fields: Json
          created_at: string
          updated_at: string
          published_at: string | null
        }
        Insert: {
          id?: string
          sku: string
          barcode?: string | null
          name: Json
          slug: string
          short_description?: Json | null
          description?: Json | null
          features?: Json | null
          benefits?: Json | null
          usage?: Json | null
          primary_category_id?: string | null
          category_ids?: string[]
          brand_id?: string | null
          pricing?: Json
          media?: Json
          specifications?: Json | null
          ingredients?: Json | null
          nutrition_facts?: Json | null
          certifications?: Json | null
          quality?: Json
          seo?: Json
          inquiry_settings?: Json
          related_products?: Json
          status?: string
          featured?: boolean
          is_new?: boolean
          is_best?: boolean
          stats?: Json
          custom_fields?: Json
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
        Update: {
          id?: string
          sku?: string
          barcode?: string | null
          name?: Json
          slug?: string
          short_description?: Json | null
          description?: Json | null
          features?: Json | null
          benefits?: Json | null
          usage?: Json | null
          primary_category_id?: string | null
          category_ids?: string[]
          brand_id?: string | null
          pricing?: Json
          media?: Json
          specifications?: Json | null
          ingredients?: Json | null
          nutrition_facts?: Json | null
          certifications?: Json | null
          quality?: Json
          seo?: Json
          inquiry_settings?: Json
          related_products?: Json
          status?: string
          featured?: boolean
          is_new?: boolean
          is_best?: boolean
          stats?: Json
          custom_fields?: Json
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_primary_category_id_fkey"
            columns: ["primary_category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
      }
      consultation_requests: {
        Row: {
          id: string
          name: string
          phone: string
          email: string | null
          company: string | null
          consultation_type: string
          product_interests: string[] | null
          preferred_date: string | null
          preferred_time: string | null
          message: string | null
          privacy_agreed: boolean
          marketing_agreed: boolean | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          phone: string
          email?: string | null
          company?: string | null
          consultation_type: string
          product_interests?: string[] | null
          preferred_date?: string | null
          preferred_time?: string | null
          message?: string | null
          privacy_agreed: boolean
          marketing_agreed?: boolean | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          phone?: string
          email?: string | null
          company?: string | null
          consultation_type?: string
          product_interests?: string[] | null
          preferred_date?: string | null
          preferred_time?: string | null
          message?: string | null
          privacy_agreed?: boolean
          marketing_agreed?: boolean | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      activity_logs: {
        Row: {
          id: string
          entity_type: string
          entity_id: string | null
          entity_name: string | null
          action: string
          changes: Json | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          entity_type: string
          entity_id?: string | null
          entity_name?: string | null
          action: string
          changes?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          entity_type?: string
          entity_id?: string | null
          entity_name?: string | null
          action?: string
          changes?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
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