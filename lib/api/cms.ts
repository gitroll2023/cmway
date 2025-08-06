import { createClient } from '@/lib/supabase/client'
import type { 
  SiteSettings, 
  Page, 
  Product, 
  Category, 
  ContentBlock,
  Menu,
  Translation,
  StoreLocation,
  ContactRequest,
  ApiResponse 
} from '@/lib/types'

const supabase = createClient()

// Site Settings API
export const siteSettingsApi = {
  async get(): Promise<ApiResponse<SiteSettings>> {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single()

      if (error) throw error

      return {
        data: data as unknown as SiteSettings,
        error: null,
        success: true
      }
    } catch (error) {
      return {
        data: null as any,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      }
    }
  },

  async update(settings: Partial<SiteSettings> & { id: string }): Promise<ApiResponse<SiteSettings>> {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .update(settings)
        .eq('id', settings.id)
        .select()
        .single()

      if (error) throw error

      return {
        data: data as unknown as SiteSettings,
        error: null,
        success: true
      }
    } catch (error) {
      return {
        data: null as any,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      }
    }
  }
}

// Pages API
export const pagesApi = {
  async getAll(): Promise<ApiResponse<Page[]>> {
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      return {
        data: data as unknown as Page[],
        error: null,
        success: true
      }
    } catch (error) {
      return {
        data: [],
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      }
    }
  },

  async getBySlug(slug: string): Promise<ApiResponse<Page>> {
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single()

      if (error) throw error

      return {
        data: data as unknown as Page,
        error: null,
        success: true
      }
    } catch (error) {
      return {
        data: null as any,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      }
    }
  },

  async create(page: Omit<Page, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Page>> {
    try {
      const { data, error } = await supabase
        .from('pages')
        .insert(page)
        .select()
        .single()

      if (error) throw error

      return {
        data: data as unknown as Page,
        error: null,
        success: true
      }
    } catch (error) {
      return {
        data: null as any,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      }
    }
  },

  async update(id: string, updates: Partial<Page>): Promise<ApiResponse<Page>> {
    try {
      const { data, error } = await supabase
        .from('pages')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      return {
        data: data as unknown as Page,
        error: null,
        success: true
      }
    } catch (error) {
      return {
        data: null as any,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      }
    }
  },

  async delete(id: string): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await supabase
        .from('pages')
        .delete()
        .eq('id', id)

      if (error) throw error

      return {
        data: true,
        error: null,
        success: true
      }
    } catch (error) {
      return {
        data: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      }
    }
  },

  async getNewsList(options: {
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<ApiResponse<{ data: Page[]; total: number; totalPages: number }>> {
    try {
      const { category = 'all', search = '', page = 1, limit = 10 } = options;
      const offset = (page - 1) * limit;

      let query = supabase
        .from('pages')
        .select('*', { count: 'exact' })
        .eq('status', 'published')
        .or('template.eq.blog,page_type.eq.news') // Assuming news pages use blog template or have news type
        .order('published_at', { ascending: false });

      // Add category filter if not 'all'
      if (category !== 'all') {
        // Assuming we store category in meta or use a custom field
        query = query.or(`meta->>category.ilike.%${category}%,slug.ilike.%${category}%`);
      }

      // Add search filter
      if (search) {
        query = query.or(`meta->>title.ilike.%${search}%,meta->>description.ilike.%${search}%`);
      }

      // Add pagination
      query = query.range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) throw error;

      const totalPages = Math.ceil((count || 0) / limit);

      return {
        data: {
          data: data as unknown as Page[],
          total: count || 0,
          totalPages
        },
        error: null,
        success: true
      }
    } catch (error) {
      return {
        data: { data: [], total: 0, totalPages: 0 },
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      }
    }
  }
}

// Products API
export const productsApi = {
  async getAll(): Promise<ApiResponse<Product[]>> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      return {
        data: data as unknown as Product[],
        error: null,
        success: true
      }
    } catch (error) {
      return {
        data: [],
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      }
    }
  },

  async getBySlug(slug: string): Promise<ApiResponse<Product>> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error) throw error

      return {
        data: data as unknown as Product,
        error: null,
        success: true
      }
    } catch (error) {
      return {
        data: null as any,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      }
    }
  },

  async getByCategory(categorySlugOrId: string): Promise<ApiResponse<Product[]>> {
    try {
      // First, try to find the category by slug
      let categoryId = categorySlugOrId;
      
      // Always try to find by slug first
      const { data: category } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', categorySlugOrId)
        .single();
      
      if (category) {
        categoryId = category.id;
      }

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('primary_category_id', categoryId)
        .order('created_at', { ascending: false })

      if (error) throw error

      return {
        data: data as unknown as Product[],
        error: null,
        success: true
      }
    } catch (error) {
      return {
        data: [],
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      }
    }
  },

  async create(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Product>> {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select()
        .single()

      if (error) throw error

      return {
        data: data as unknown as Product,
        error: null,
        success: true
      }
    } catch (error) {
      return {
        data: null as any,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      }
    }
  },

  async update(id: string, updates: Partial<Product>): Promise<ApiResponse<Product>> {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      return {
        data: data as unknown as Product,
        error: null,
        success: true
      }
    } catch (error) {
      return {
        data: null as any,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      }
    }
  },

  async delete(id: string): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) throw error

      return {
        data: true,
        error: null,
        success: true
      }
    } catch (error) {
      return {
        data: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      }
    }
  }
}

// Categories API
export const categoriesApi = {
  async getAll(): Promise<ApiResponse<Category[]>> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('position', { ascending: true })

      if (error) throw error

      return {
        data: data as unknown as Category[],
        error: null,
        success: true
      }
    } catch (error) {
      return {
        data: [],
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      }
    }
  },

  async getBySlug(slug: string): Promise<ApiResponse<Category>> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error) throw error

      return {
        data: data as unknown as Category,
        error: null,
        success: true
      }
    } catch (error) {
      return {
        data: null as any,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      }
    }
  },

  async create(category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Category>> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert(category)
        .select()
        .single()

      if (error) throw error

      return {
        data: data as unknown as Category,
        error: null,
        success: true
      }
    } catch (error) {
      return {
        data: null as any,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      }
    }
  },

  async update(id: string, updates: Partial<Category>): Promise<ApiResponse<Category>> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      return {
        data: data as unknown as Category,
        error: null,
        success: true
      }
    } catch (error) {
      return {
        data: null as any,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      }
    }
  },

  async delete(id: string): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)

      if (error) throw error

      return {
        data: true,
        error: null,
        success: true
      }
    } catch (error) {
      return {
        data: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      }
    }
  }
}

// Menus API
export const menusApi = {
  async getByLocation(location: string): Promise<ApiResponse<Menu[]>> {
    try {
      const { data, error } = await supabase
        .from('menus')
        .select('*')
        .eq('menu_location', location)
        .eq('status', 'published')
        .order('position', { ascending: true })

      if (error) throw error

      return {
        data: data as unknown as Menu[],
        error: null,
        success: true
      }
    } catch (error) {
      return {
        data: [],
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      }
    }
  }
}

// Translations API
export const translationsApi = {
  async getAll(): Promise<ApiResponse<Translation[]>> {
    try {
      const { data, error } = await supabase
        .from('translations')
        .select('*')
        .order('namespace', { ascending: true })

      if (error) throw error

      return {
        data: data as unknown as Translation[],
        error: null,
        success: true
      }
    } catch (error) {
      return {
        data: [],
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      }
    }
  },

  async getByNamespace(namespace: string): Promise<ApiResponse<Translation[]>> {
    try {
      const { data, error } = await supabase
        .from('translations')
        .select('*')
        .eq('namespace', namespace)

      if (error) throw error

      return {
        data: data as unknown as Translation[],
        error: null,
        success: true
      }
    } catch (error) {
      return {
        data: [],
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      }
    }
  }
}

// Store Locations API
export const storeLocationsApi = {
  async getAll(): Promise<ApiResponse<StoreLocation[]>> {
    try {
      const { data, error } = await supabase
        .from('store_locations')
        .select('*')
        .eq('status', 'published')
        .order('name', { ascending: true })

      if (error) throw error

      return {
        data: data as unknown as StoreLocation[],
        error: null,
        success: true
      }
    } catch (error) {
      return {
        data: [],
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      }
    }
  },

  async getById(id: string): Promise<ApiResponse<StoreLocation>> {
    try {
      const { data, error } = await supabase
        .from('store_locations')
        .select('*')
        .eq('id', id)
        .eq('status', 'published')
        .single()

      if (error) throw error

      return {
        data: data as unknown as StoreLocation,
        error: null,
        success: true
      }
    } catch (error) {
      return {
        data: null as any,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      }
    }
  },

  async getByType(type: string): Promise<ApiResponse<StoreLocation[]>> {
    try {
      const { data, error } = await supabase
        .from('store_locations')
        .select('*')
        .eq('type', type)
        .eq('status', 'published')
        .order('name', { ascending: true })

      if (error) throw error

      return {
        data: data as unknown as StoreLocation[],
        error: null,
        success: true
      }
    } catch (error) {
      return {
        data: [],
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      }
    }
  }
}

// Contact Requests API
export const contactRequestsApi = {
  async getAll(): Promise<ApiResponse<ContactRequest[]>> {
    try {
      const { data, error } = await supabase
        .from('contact_requests')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      return {
        data: data as unknown as ContactRequest[],
        error: null,
        success: true
      }
    } catch (error) {
      return {
        data: [],
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      }
    }
  },

  async getById(id: string): Promise<ApiResponse<ContactRequest>> {
    try {
      const { data, error } = await supabase
        .from('contact_requests')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      return {
        data: data as unknown as ContactRequest,
        error: null,
        success: true
      }
    } catch (error) {
      return {
        data: null as any,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      }
    }
  },

  async create(contactRequest: Omit<ContactRequest, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<ContactRequest>> {
    try {
      const { data, error } = await supabase
        .from('contact_requests')
        .insert(contactRequest)
        .select()
        .single()

      if (error) throw error

      return {
        data: data as unknown as ContactRequest,
        error: null,
        success: true
      }
    } catch (error) {
      return {
        data: null as any,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      }
    }
  },

  async update(id: string, updates: Partial<ContactRequest>): Promise<ApiResponse<ContactRequest>> {
    try {
      const { data, error } = await supabase
        .from('contact_requests')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      return {
        data: data as unknown as ContactRequest,
        error: null,
        success: true
      }
    } catch (error) {
      return {
        data: null as any,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      }
    }
  },

  async delete(id: string): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await supabase
        .from('contact_requests')
        .delete()
        .eq('id', id)

      if (error) throw error

      return {
        data: true,
        error: null,
        success: true
      }
    } catch (error) {
      return {
        data: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      }
    }
  },

  async updateStatus(id: string, status: ContactRequest['status'], adminNotes?: string): Promise<ApiResponse<ContactRequest>> {
    try {
      const { data, error } = await supabase
        .from('contact_requests')
        .update({ 
          status, 
          admin_notes: adminNotes,
          updated_at: new Date().toISOString() 
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      return {
        data: data as unknown as ContactRequest,
        error: null,
        success: true
      }
    } catch (error) {
      return {
        data: null as any,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      }
    }
  },

  async getByStatus(status: ContactRequest['status']): Promise<ApiResponse<ContactRequest[]>> {
    try {
      const { data, error } = await supabase
        .from('contact_requests')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false })

      if (error) throw error

      return {
        data: data as unknown as ContactRequest[],
        error: null,
        success: true
      }
    } catch (error) {
      return {
        data: [],
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      }
    }
  },

  async search(query: string): Promise<ApiResponse<ContactRequest[]>> {
    try {
      const { data, error } = await supabase
        .from('contact_requests')
        .select('*')
        .or(`name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%,message.ilike.%${query}%`)
        .order('created_at', { ascending: false })

      if (error) throw error

      return {
        data: data as unknown as ContactRequest[],
        error: null,
        success: true
      }
    } catch (error) {
      return {
        data: [],
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      }
    }
  }
}