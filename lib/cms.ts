import { 
  getClient, 
  createResponse, 
  queryBuilders, 
  cache,
  type SupabaseResponse 
} from './supabase-client'
import type {
  SiteSettings,
  Page,
  Product,
  Category,
  Menu,
  Banner,
  StoreLocation,
  Translation
} from './types/cms'

// Default empty objects for error handling
const DEFAULT_SITE_SETTINGS: SiteSettings = {
  id: '', site_name: { ko: '', en: '' }, tagline: { ko: '', en: '' },
  company_info: { name: '', ceo: '', business_number: '', online_business_number: '', address: { ko: '', en: '' }, phone: '', fax: '', email: '', customer_center: { phone: '', hours: '', lunch: '', holiday: '' } },
  seo_config: { default_title: '', title_template: '', default_description: '', default_keywords: [], robots: '', canonical_domain: '' },
  og_config: { og_type: 'website', og_site_name: '', twitter_card: 'summary', twitter_handle: '' },
  social_links: {}, integrations: {},
  footer_config: { copyright: '', show_family_sites: false, show_certifications: false, show_payment_methods: false },
  design_tokens: { colors: { primary: '', secondary: '', accent: '', success: '', warning: '', error: '' }, fonts: { heading: '', body: '', code: '' }, animations: { enable_scroll: false, enable_hover: false, enable_page_transition: false } },
  maintenance: { enabled: false, message: '' }, created_at: '', updated_at: ''
};

// ============================================================================
// SITE SETTINGS
// ============================================================================

export const siteSettings = {
  // Get site settings (cached)
  async get(useCache: boolean = true): Promise<SupabaseResponse<SiteSettings>> {
    const cacheKey = cache.key('site_settings')
    
    if (useCache) {
      const cached = cache.get<SiteSettings>(cacheKey)
      if (cached) {
        return createResponse(cached)
      }
    }

    try {
      const client = getClient()
      const { data, error } = await client
        .from('site_settings')
        .select('*')
        .single()

      if (error) throw error

      const settings = data as unknown as SiteSettings
      cache.set(cacheKey, settings)
      
      return createResponse(settings)
    } catch (error) {
      return createResponse(DEFAULT_SITE_SETTINGS, error)
    }
  },

  // Update site settings
  async update(updates: Partial<SiteSettings> & { id: string }): Promise<SupabaseResponse<SiteSettings>> {
    try {
      const client = getClient()
      const { data, error } = await client
        .from('site_settings')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', updates.id)
        .select()
        .single()

      if (error) throw error

      const settings = data as unknown as SiteSettings
      
      // Update cache
      const cacheKey = cache.key('site_settings')
      cache.set(cacheKey, settings)
      
      return createResponse(settings)
    } catch (error) {
      return createResponse(DEFAULT_SITE_SETTINGS, error)
    }
  }
}

// ============================================================================
// PAGES
// ============================================================================

export const pages = {
  // Get all pages with optional filtering (admin version with all statuses)
  async getAll(params?: {
    status?: 'draft' | 'published' | 'scheduled' | 'archived'
    template?: string
    pageType?: string
    limit?: number
    page?: number
    includeAdmin?: boolean
  }): Promise<SupabaseResponse<Page[]>> {
    const cacheKey = cache.key('pages', undefined, params)
    const cached = cache.get<Page[]>(cacheKey)
    if (cached) {
      return createResponse(cached)
    }

    try {
      const client = getClient()
      let query = client.from('pages').select('*')

      // Apply filters
      if (params?.status) {
        query = query.eq('status', params.status)
      }
      if (params?.template) {
        query = query.eq('template', params.template)
      }
      if (params?.pageType) {
        query = query.eq('page_type', params.pageType)
      }

      // Apply pagination
      if (params?.limit && params?.page) {
        query = queryBuilders.paginate(query, params.page, params.limit)
      }

      query = query.order('created_at', { ascending: false })

      const { data, error, count } = await query

      if (error) throw error

      const pagesList = data as unknown as Page[]
      cache.set(cacheKey, pagesList)
      
      return createResponse(pagesList, null, count || undefined)
    } catch (error) {
      return createResponse([], error)
    }
  },

  // Get page by slug
  async getBySlug(slug: string, includeBlocks: boolean = false): Promise<SupabaseResponse<Page>> {
    const cacheKey = cache.key('page', slug, { blocks: includeBlocks })
    const cached = cache.get<Page>(cacheKey)
    if (cached) {
      return createResponse(cached)
    }

    try {
      const client = getClient()
      let selectClause = '*'
      
      if (includeBlocks) {
        selectClause += ', page_blocks!inner(*), content_blocks!inner(*)'
      }

      const { data, error } = await client
        .from('pages')
        .select(selectClause)
        .eq('slug', slug)
        .eq('status', 'published')
        .single()

      if (error) throw error

      const page = data as unknown as Page
      cache.set(cacheKey, page)
      
      return createResponse(page)
    } catch (error) {
      return createResponse(null, error)
    }
  },

  // Get published pages for sitemap
  async getForSitemap(): Promise<SupabaseResponse<Pick<Page, 'slug' | 'updated_at'>[]>> {
    try {
      const client = getClient()
      const { data, error } = await client
        .from('pages')
        .select('slug, updated_at')
        .eq('status', 'published')
        .eq('page_type', 'static')
        .order('updated_at', { ascending: false })

      if (error) throw error

      return createResponse(data as Pick<Page, 'slug' | 'updated_at'>[])
    } catch (error) {
      return createResponse([], error)
    }
  },

  // Admin: Get page by ID
  async getById(id: string): Promise<SupabaseResponse<Page>> {
    try {
      const client = getClient()
      const { data, error } = await client
        .from('pages')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      return createResponse(data as unknown as Page)
    } catch (error) {
      return createResponse(null, error)
    }
  },

  // Admin: Create page
  async create(pageData: Omit<Page, 'id' | 'created_at' | 'updated_at' | 'version'>): Promise<SupabaseResponse<Page>> {
    try {
      const client = getClient()
      const { data, error } = await client
        .from('pages')
        .insert({
          ...pageData,
          version: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      // Clear cache
      cache.clear('pages')
      
      return createResponse(data as unknown as Page)
    } catch (error) {
      return createResponse(null, error)
    }
  },

  // Admin: Update page
  async update(id: string, updates: Partial<Page>): Promise<SupabaseResponse<Page>> {
    try {
      const client = getClient()
      const { data, error } = await client
        .from('pages')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      // Clear cache
      cache.clear('pages')
      cache.clear(`page_${id}`)
      
      return createResponse(data as unknown as Page)
    } catch (error) {
      return createResponse(null, error)
    }
  },

  // Admin: Delete page
  async delete(id: string): Promise<SupabaseResponse<boolean>> {
    try {
      const client = getClient()
      const { error } = await client
        .from('pages')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Clear cache
      cache.clear('pages')
      cache.clear(`page_${id}`)
      
      return createResponse(true)
    } catch (error) {
      return createResponse(false, error)
    }
  }
}

// ============================================================================
// PRODUCTS
// ============================================================================

export const products = {
  // Get all products with filtering and search
  async getAll(params?: {
    status?: 'draft' | 'published' | 'out_of_stock'
    categoryId?: string
    featured?: boolean
    isNew?: boolean
    isBest?: boolean
    search?: string
    limit?: number
    page?: number
  }): Promise<SupabaseResponse<Product[]>> {
    const cacheKey = cache.key('products', undefined, params)
    const cached = cache.get<Product[]>(cacheKey)
    if (cached) {
      return createResponse(cached)
    }

    try {
      const client = getClient()
      let query = client.from('products').select('*')

      // Apply filters
      if (params?.status) {
        query = query.eq('status', params.status)
      } else {
        query = query.eq('status', 'published')
      }
      
      if (params?.categoryId) {
        query = query.or(`primary_category_id.eq.${params.categoryId},category_ids.cs.{${params.categoryId}}`)
      }
      
      if (params?.featured !== undefined) {
        query = query.eq('featured', params.featured)
      }
      
      if (params?.isNew !== undefined) {
        query = query.eq('is_new', params.isNew)
      }
      
      if (params?.isBest !== undefined) {
        query = query.eq('is_best', params.isBest)
      }
      
      if (params?.search) {
        query = query.or(`name->>ko.ilike.%${params.search}%,name->>en.ilike.%${params.search}%,sku.ilike.%${params.search}%`)
      }

      // Apply pagination
      if (params?.limit && params?.page) {
        query = queryBuilders.paginate(query, params.page, params.limit)
      }

      query = query.order('created_at', { ascending: false })

      const { data, error, count } = await query

      if (error) throw error

      const productsList = data as unknown as Product[]
      cache.set(cacheKey, productsList)
      
      return createResponse(productsList, null, count)
    } catch (error) {
      return createResponse([], error)
    }
  },

  // Get product by slug
  async getBySlug(slug: string): Promise<SupabaseResponse<Product>> {
    const cacheKey = cache.key('product', slug)
    const cached = cache.get<Product>(cacheKey)
    if (cached) {
      return createResponse(cached)
    }

    try {
      const client = getClient()
      const { data, error } = await client
        .from('products')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single()

      if (error) throw error

      const product = data as unknown as Product
      
      // Update view count
      await client
        .from('products')
        .update({ 
          'stats.view_count': (product.stats?.view_count || 0) + 1 
        })
        .eq('id', product.id)

      cache.set(cacheKey, product)
      
      return createResponse(product)
    } catch (error) {
      return createResponse(null, error)
    }
  },

  // Get featured products
  async getFeatured(limit: number = 8): Promise<SupabaseResponse<Product[]>> {
    return this.getAll({ 
      featured: true, 
      limit, 
      page: 1 
    })
  },

  // Get new products
  async getNew(limit: number = 8): Promise<SupabaseResponse<Product[]>> {
    return this.getAll({ 
      isNew: true, 
      limit, 
      page: 1 
    })
  },

  // Get best products
  async getBest(limit: number = 8): Promise<SupabaseResponse<Product[]>> {
    return this.getAll({ 
      isBest: true, 
      limit, 
      page: 1 
    })
  },

  // Get related products
  async getRelated(productId: string, type: 'cross_sells' | 'up_sells' | 'frequently_bought'): Promise<SupabaseResponse<Product[]>> {
    try {
      const client = getClient()
      
      // First get the product with related IDs
      const { data: product, error: productError } = await client
        .from('products')
        .select('related_products')
        .eq('id', productId)
        .single()

      if (productError) throw productError

      const relatedIds = product?.related_products?.[type] || []
      if (relatedIds.length === 0) {
        return createResponse([])
      }

      // Get related products
      const { data, error } = await client
        .from('products')
        .select('*')
        .in('id', relatedIds)
        .eq('status', 'published')
        .order('created_at', { ascending: false })

      if (error) throw error

      return createResponse(data as unknown as Product[])
    } catch (error) {
      return createResponse([], error)
    }
  },

  // Admin: Get product by ID
  async getById(id: string): Promise<SupabaseResponse<Product>> {
    try {
      const client = getClient()
      const { data, error } = await client
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      return createResponse(data as unknown as Product)
    } catch (error) {
      return createResponse(null, error)
    }
  },

  // Admin: Create product
  async create(productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<SupabaseResponse<Product>> {
    try {
      const client = getClient()
      const { data, error } = await client
        .from('products')
        .insert({
          ...productData,
          stats: { view_count: 0, inquiry_count: 0, brochure_download_count: 0 },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      // Clear cache
      cache.clear('products')
      
      return createResponse(data as unknown as Product)
    } catch (error) {
      return createResponse(null, error)
    }
  },

  // Admin: Update product
  async update(id: string, updates: Partial<Product>): Promise<SupabaseResponse<Product>> {
    try {
      const client = getClient()
      const { data, error } = await client
        .from('products')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      // Clear cache
      cache.clear('products')
      cache.clear(`product_${id}`)
      
      return createResponse(data as unknown as Product)
    } catch (error) {
      return createResponse(null, error)
    }
  },

  // Admin: Delete product
  async delete(id: string): Promise<SupabaseResponse<boolean>> {
    try {
      const client = getClient()
      const { error } = await client
        .from('products')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Clear cache
      cache.clear('products')
      cache.clear(`product_${id}`)
      
      return createResponse(true)
    } catch (error) {
      return createResponse(false, error)
    }
  }
}

// ============================================================================
// CATEGORIES
// ============================================================================

export const categories = {
  // Get all categories with hierarchy
  async getAll(params?: {
    parentId?: string
    showInMenu?: boolean
    featured?: boolean
    withProducts?: boolean
  }): Promise<SupabaseResponse<Category[]>> {
    const cacheKey = cache.key('categories', undefined, params)
    const cached = cache.get<Category[]>(cacheKey)
    if (cached) {
      return createResponse(cached)
    }

    try {
      const client = getClient()
      let query = client.from('categories').select('*')

      query = queryBuilders.filterActive(query)

      if (params?.parentId !== undefined) {
        if (params.parentId === null) {
          query = query.is('parent_id', null)
        } else {
          query = query.eq('parent_id', params.parentId)
        }
      }

      if (params?.showInMenu !== undefined) {
        query = query.eq('display_settings->>show_in_menu', params.showInMenu)
      }

      if (params?.featured !== undefined) {
        query = query.eq('display_settings->>featured', params.featured)
      }

      query = query.order('position', { ascending: true })

      const { data, error } = await query

      if (error) throw error

      let categoriesList = data as unknown as Category[]

      // If withProducts is true, get product counts
      if (params?.withProducts && categoriesList.length > 0) {
        const categoryIds = categoriesList.map(cat => cat.id)
        
        const { data: productCounts } = await client
          .from('products')
          .select('primary_category_id, category_ids')
          .eq('status', 'published')
          .or(`primary_category_id.in.(${categoryIds.join(',')}),category_ids.ov.{${categoryIds.join(',')}}`)

        // Calculate product counts for each category
        categoriesList = categoriesList.map(category => ({
          ...category,
          productCount: productCounts?.filter(p => 
            p.primary_category_id === category.id || 
            (p.category_ids && p.category_ids.includes(category.id))
          ).length || 0
        }))
      }

      cache.set(cacheKey, categoriesList)
      
      return createResponse(categoriesList)
    } catch (error) {
      return createResponse([], error)
    }
  },

  // Get category by slug
  async getBySlug(slug: string): Promise<SupabaseResponse<Category>> {
    const cacheKey = cache.key('category', slug)
    const cached = cache.get<Category>(cacheKey)
    if (cached) {
      return createResponse(cached)
    }

    try {
      const client = getClient()
      const { data, error } = await client
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single()

      if (error) throw error

      const category = data as unknown as Category
      cache.set(cacheKey, category)
      
      return createResponse(category)
    } catch (error) {
      return createResponse(null, error)
    }
  },

  // Get category hierarchy (parent with children)
  async getHierarchy(): Promise<SupabaseResponse<Category[]>> {
    try {
      const { data: allCategories } = await this.getAll()
      if (!allCategories) return createResponse([])

      // Build hierarchy
      const categoryMap = new Map()
      const rootCategories: Category[] = []

      // First pass: create map and identify root categories
      allCategories.forEach(category => {
        categoryMap.set(category.id, { ...category, children: [] })
        if (!category.parent_id) {
          rootCategories.push(categoryMap.get(category.id))
        }
      })

      // Second pass: build hierarchy
      allCategories.forEach(category => {
        if (category.parent_id && categoryMap.has(category.parent_id)) {
          categoryMap.get(category.parent_id).children.push(categoryMap.get(category.id))
        }
      })

      return createResponse(rootCategories)
    } catch (error) {
      return createResponse([], error)
    }
  },

  // Admin: Get category by ID
  async getById(id: string): Promise<SupabaseResponse<Category>> {
    try {
      const client = getClient()
      const { data, error } = await client
        .from('categories')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      return createResponse(data as unknown as Category)
    } catch (error) {
      return createResponse(null, error)
    }
  },

  // Admin: Create category
  async create(categoryData: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<SupabaseResponse<Category>> {
    try {
      const client = getClient()
      const { data, error } = await client
        .from('categories')
        .insert({
          ...categoryData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      // Clear cache
      cache.clear('categories')
      
      return createResponse(data as unknown as Category)
    } catch (error) {
      return createResponse(null, error)
    }
  },

  // Admin: Update category
  async update(id: string, updates: Partial<Category>): Promise<SupabaseResponse<Category>> {
    try {
      const client = getClient()
      const { data, error } = await client
        .from('categories')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      // Clear cache
      cache.clear('categories')
      cache.clear(`category_${id}`)
      
      return createResponse(data as unknown as Category)
    } catch (error) {
      return createResponse(null, error)
    }
  },

  // Admin: Delete category
  async delete(id: string): Promise<SupabaseResponse<boolean>> {
    try {
      const client = getClient()
      
      // Check if category has children
      const { data: children } = await client
        .from('categories')
        .select('id')
        .eq('parent_id', id)
        .limit(1)

      if (children && children.length > 0) {
        throw new Error('Cannot delete category with subcategories')
      }

      // Check if category has products
      const { data: products } = await client
        .from('products')
        .select('id')
        .or(`primary_category_id.eq.${id},category_ids.cs.{${id}}`)
        .limit(1)

      if (products && products.length > 0) {
        throw new Error('Cannot delete category with products')
      }

      const { error } = await client
        .from('categories')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Clear cache
      cache.clear('categories')
      cache.clear(`category_${id}`)
      
      return createResponse(true)
    } catch (error) {
      return createResponse(false, error)
    }
  }
}

// ============================================================================
// MENUS
// ============================================================================

export const menus = {
  // Get menu by location
  async getByLocation(location: 'header' | 'footer' | 'mobile' | 'sidebar'): Promise<SupabaseResponse<Menu[]>> {
    const cacheKey = cache.key('menus', location)
    const cached = cache.get<Menu[]>(cacheKey)
    if (cached) {
      return createResponse(cached)
    }

    try {
      const client = getClient()
      const { data, error } = await client
        .from('menus')
        .select('*')
        .eq('menu_location', location)
        .eq('is_active', true)
        .order('position', { ascending: true })

      if (error) throw error

      const menuItems = data as unknown as Menu[]
      cache.set(cacheKey, menuItems)
      
      return createResponse(menuItems)
    } catch (error) {
      return createResponse([], error)
    }
  },

  // Get hierarchical menu structure
  async getHierarchical(location: 'header' | 'footer' | 'mobile' | 'sidebar'): Promise<SupabaseResponse<Menu[]>> {
    try {
      const { data: allMenuItems } = await this.getByLocation(location)
      if (!allMenuItems) return createResponse([])

      // Build hierarchy
      const menuMap = new Map()
      const rootMenus: Menu[] = []

      // First pass: create map and identify root menus
      allMenuItems.forEach(menu => {
        menuMap.set(menu.id, { ...menu, children: [] })
        if (!menu.parent_id) {
          rootMenus.push(menuMap.get(menu.id))
        }
      })

      // Second pass: build hierarchy
      allMenuItems.forEach(menu => {
        if (menu.parent_id && menuMap.has(menu.parent_id)) {
          menuMap.get(menu.parent_id).children.push(menuMap.get(menu.id))
        }
      })

      return createResponse(rootMenus)
    } catch (error) {
      return createResponse([], error)
    }
  },

  // Admin: Get all menus (including inactive)
  async getAll(location?: 'header' | 'footer' | 'mobile' | 'sidebar'): Promise<SupabaseResponse<Menu[]>> {
    try {
      const client = getClient()
      let query = client.from('menus').select('*')

      if (location) {
        query = query.eq('menu_location', location)
      }

      query = query.order('menu_location').order('position', { ascending: true })

      const { data, error } = await query

      if (error) throw error

      return createResponse(data as unknown as Menu[])
    } catch (error) {
      return createResponse([], error)
    }
  },

  // Admin: Get menu by ID
  async getById(id: string): Promise<SupabaseResponse<Menu>> {
    try {
      const client = getClient()
      const { data, error } = await client
        .from('menus')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      return createResponse(data as unknown as Menu)
    } catch (error) {
      return createResponse(null, error)
    }
  },

  // Admin: Create menu
  async create(menuData: Omit<Menu, 'id' | 'created_at' | 'updated_at'>): Promise<SupabaseResponse<Menu>> {
    try {
      const client = getClient()
      const { data, error } = await client
        .from('menus')
        .insert({
          ...menuData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      // Clear cache
      cache.clear('menus')
      
      return createResponse(data as unknown as Menu)
    } catch (error) {
      return createResponse(null, error)
    }
  },

  // Admin: Update menu
  async update(id: string, updates: Partial<Menu>): Promise<SupabaseResponse<Menu>> {
    try {
      const client = getClient()
      const { data, error } = await client
        .from('menus')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      // Clear cache
      cache.clear('menus')
      cache.clear(`menu_${id}`)
      
      return createResponse(data as unknown as Menu)
    } catch (error) {
      return createResponse(null, error)
    }
  },

  // Admin: Delete menu
  async delete(id: string): Promise<SupabaseResponse<boolean>> {
    try {
      const client = getClient()
      
      // Check if menu has children
      const { data: children } = await client
        .from('menus')
        .select('id')
        .eq('parent_id', id)
        .limit(1)

      if (children && children.length > 0) {
        throw new Error('Cannot delete menu with sub-menus')
      }

      const { error } = await client
        .from('menus')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Clear cache
      cache.clear('menus')
      cache.clear(`menu_${id}`)
      
      return createResponse(true)
    } catch (error) {
      return createResponse(false, error)
    }
  },

  // Admin: Reorder menus
  async reorder(menuIds: string[], location: string): Promise<SupabaseResponse<boolean>> {
    try {
      const client = getClient()
      
      // Update positions
      const updates = menuIds.map((id, index) => 
        client
          .from('menus')
          .update({ position: index + 1 })
          .eq('id', id)
      )

      await Promise.all(updates)

      // Clear cache
      cache.clear('menus')
      
      return createResponse(true)
    } catch (error) {
      return createResponse(false, error)
    }
  }
}

// ============================================================================
// BANNERS
// ============================================================================

export const banners = {
  // Get banners by location and page
  async getByLocation(
    location: 'header' | 'hero' | 'middle' | 'footer' | 'popup',
    currentPage?: string
  ): Promise<SupabaseResponse<Banner[]>> {
    const cacheKey = cache.key('banners', location, { page: currentPage })
    const cached = cache.get<Banner[]>(cacheKey)
    if (cached) {
      return createResponse(cached)
    }

    try {
      const client = getClient()
      const now = new Date().toISOString()
      
      let query = client
        .from('banners')
        .select('*')
        .eq('position->>location', location)
        .eq('is_active', true)

      // Check date range
      query = query.or(`display_rules->>start_date.is.null,display_rules->>start_date.lte.${now}`)
      query = query.or(`display_rules->>end_date.is.null,display_rules->>end_date.gte.${now}`)

      // Filter by page if specified
      if (currentPage) {
        query = query.or(`display_rules->>pages.cs.["${currentPage}"],display_rules->>pages.eq.[]`)
      }

      query = query.order('position->>priority', { ascending: false })

      const { data, error } = await query

      if (error) throw error

      const bannersList = data as unknown as Banner[]
      cache.set(cacheKey, bannersList)
      
      return createResponse(bannersList)
    } catch (error) {
      return createResponse([], error)
    }
  },

  // Get active hero banners
  async getHeroBanners(): Promise<SupabaseResponse<Banner[]>> {
    return this.getByLocation('hero')
  },

  // Update banner analytics
  async incrementImpression(bannerId: string): Promise<void> {
    try {
      const client = getClient()
      await client.rpc('increment_banner_impression', { banner_id: bannerId })
    } catch (error) {
      console.error('Failed to increment banner impression:', error)
    }
  },

  async incrementClick(bannerId: string): Promise<void> {
    try {
      const client = getClient()
      await client.rpc('increment_banner_click', { banner_id: bannerId })
    } catch (error) {
      console.error('Failed to increment banner click:', error)
    }
  },

  // Admin: Get all banners (including inactive)
  async getAll(location?: 'header' | 'hero' | 'middle' | 'footer' | 'popup'): Promise<SupabaseResponse<Banner[]>> {
    try {
      const client = getClient()
      let query = client.from('banners').select('*')

      if (location) {
        query = query.eq('position->>location', location)
      }

      query = query.order('position->>location').order('position->>priority', { ascending: false })

      const { data, error } = await query

      if (error) throw error

      return createResponse(data as unknown as Banner[])
    } catch (error) {
      return createResponse([], error)
    }
  },

  // Admin: Get banner by ID
  async getById(id: string): Promise<SupabaseResponse<Banner>> {
    try {
      const client = getClient()
      const { data, error } = await client
        .from('banners')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      return createResponse(data as unknown as Banner)
    } catch (error) {
      return createResponse(null, error)
    }
  },

  // Admin: Create banner
  async create(bannerData: Omit<Banner, 'id' | 'created_at' | 'updated_at' | 'analytics'>): Promise<SupabaseResponse<Banner>> {
    try {
      const client = getClient()
      const { data, error } = await client
        .from('banners')
        .insert({
          ...bannerData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      // Clear cache
      cache.clear('banners')
      
      return createResponse(data as unknown as Banner)
    } catch (error) {
      return createResponse(null, error)
    }
  },

  // Admin: Update banner
  async update(id: string, updates: Partial<Banner>): Promise<SupabaseResponse<Banner>> {
    try {
      const client = getClient()
      const { data, error } = await client
        .from('banners')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      // Clear cache
      cache.clear('banners')
      cache.clear(`banner_${id}`)
      
      return createResponse(data as unknown as Banner)
    } catch (error) {
      return createResponse(null, error)
    }
  },

  // Admin: Delete banner
  async delete(id: string): Promise<SupabaseResponse<boolean>> {
    try {
      const client = getClient()
      const { error } = await client
        .from('banners')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Clear cache
      cache.clear('banners')
      cache.clear(`banner_${id}`)
      
      return createResponse(true)
    } catch (error) {
      return createResponse(false, error)
    }
  }
}

// ============================================================================
// STORE LOCATIONS
// ============================================================================

export const storeLocations = {
  // Get all store locations
  async getAll(type?: 'headquarters' | 'branch' | 'warehouse' | 'showroom'): Promise<SupabaseResponse<StoreLocation[]>> {
    const cacheKey = cache.key('store_locations', undefined, { type })
    const cached = cache.get<StoreLocation[]>(cacheKey)
    if (cached) {
      return createResponse(cached)
    }

    try {
      const client = getClient()
      let query = client
        .from('store_locations')
        .select('*')
        .eq('is_active', true)

      if (type) {
        query = query.eq('type', type)
      }

      query = query.order('type', { ascending: true })

      const { data, error } = await query

      if (error) throw error

      const locations = data as unknown as StoreLocation[]
      cache.set(cacheKey, locations)
      
      return createResponse(locations)
    } catch (error) {
      return createResponse([], error)
    }
  },

  // Get location by ID
  async getById(id: string): Promise<SupabaseResponse<StoreLocation>> {
    const cacheKey = cache.key('store_location', id)
    const cached = cache.get<StoreLocation>(cacheKey)
    if (cached) {
      return createResponse(cached)
    }

    try {
      const client = getClient()
      const { data, error } = await client
        .from('store_locations')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single()

      if (error) throw error

      const location = data as unknown as StoreLocation
      cache.set(cacheKey, location)
      
      return createResponse(location)
    } catch (error) {
      return createResponse(null, error)
    }
  },

  // Admin: Get all store locations (including inactive)
  async getAllAdmin(type?: 'headquarters' | 'branch' | 'warehouse' | 'showroom'): Promise<SupabaseResponse<StoreLocation[]>> {
    try {
      const client = getClient()
      let query = client.from('store_locations').select('*')

      if (type) {
        query = query.eq('type', type)
      }

      query = query.order('type', { ascending: true }).order('created_at', { ascending: false })

      const { data, error } = await query

      if (error) throw error

      return createResponse(data as unknown as StoreLocation[])
    } catch (error) {
      return createResponse([], error)
    }
  },

  // Admin: Get store location by ID (including inactive)
  async getByIdAdmin(id: string): Promise<SupabaseResponse<StoreLocation>> {
    try {
      const client = getClient()
      const { data, error } = await client
        .from('store_locations')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      return createResponse(data as unknown as StoreLocation)
    } catch (error) {
      return createResponse(null, error)
    }
  },

  // Admin: Create store location
  async create(locationData: Omit<StoreLocation, 'id' | 'created_at' | 'updated_at'>): Promise<SupabaseResponse<StoreLocation>> {
    try {
      const client = getClient()
      const { data, error } = await client
        .from('store_locations')
        .insert({
          ...locationData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      // Clear cache
      cache.clear('store_locations')
      
      return createResponse(data as unknown as StoreLocation)
    } catch (error) {
      return createResponse(null, error)
    }
  },

  // Admin: Update store location
  async update(id: string, updates: Partial<StoreLocation>): Promise<SupabaseResponse<StoreLocation>> {
    try {
      const client = getClient()
      const { data, error } = await client
        .from('store_locations')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      // Clear cache
      cache.clear('store_locations')
      cache.clear(`store_location_${id}`)
      
      return createResponse(data as unknown as StoreLocation)
    } catch (error) {
      return createResponse(null, error)
    }
  },

  // Admin: Delete store location
  async delete(id: string): Promise<SupabaseResponse<boolean>> {
    try {
      const client = getClient()
      const { error } = await client
        .from('store_locations')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Clear cache
      cache.clear('store_locations')
      cache.clear(`store_location_${id}`)
      
      return createResponse(true)
    } catch (error) {
      return createResponse(false, error)
    }
  }
}

// ============================================================================
// TRANSLATIONS
// ============================================================================

export const translations = {
  // Get all translations by namespace
  async getByNamespace(namespace: string): Promise<SupabaseResponse<Record<string, any>>> {
    const cacheKey = cache.key('translations', namespace)
    const cached = cache.get<Record<string, any>>(cacheKey)
    if (cached) {
      return createResponse(cached)
    }

    try {
      const client = getClient()
      const { data, error } = await client
        .from('translations')
        .select('key, translations')
        .eq('namespace', namespace)

      if (error) throw error

      // Transform to key-value pairs
      const translationsMap = (data || []).reduce((acc: Record<string, any>, item: any) => {
        acc[item.key] = item.translations
        return acc
      }, {})

      cache.set(cacheKey, translationsMap)
      
      return createResponse(translationsMap)
    } catch (error) {
      return createResponse({}, error)
    }
  },

  // Get all translations
  async getAll(): Promise<SupabaseResponse<Record<string, Record<string, any>>>> {
    const cacheKey = cache.key('all_translations')
    const cached = cache.get<Record<string, Record<string, any>>>(cacheKey)
    if (cached) {
      return createResponse(cached)
    }

    try {
      const client = getClient()
      const { data, error } = await client
        .from('translations')
        .select('namespace, key, translations')

      if (error) throw error

      // Group by namespace
      const grouped = (data || []).reduce((acc: Record<string, Record<string, any>>, item: any) => {
        if (!acc[item.namespace]) {
          acc[item.namespace] = {}
        }
        acc[item.namespace][item.key] = item.translations
        return acc
      }, {})

      cache.set(cacheKey, grouped)
      
      return createResponse(grouped)
    } catch (error) {
      return createResponse({}, error)
    }
  }
}

// ============================================================================
// CONSULTATION REQUESTS
// ============================================================================

export const consultations = {
  // Get all consultation requests
  async getAll(params?: {
    status?: 'pending' | 'in_progress' | 'completed' | 'cancelled'
    priority?: 'low' | 'medium' | 'high' | 'urgent'
    limit?: number
    page?: number
  }): Promise<SupabaseResponse<any[]>> {
    try {
      const client = getClient()
      let query = client.from('consultation_requests').select('*')

      // Apply filters
      if (params?.status) {
        query = query.eq('status', params.status)
      }
      if (params?.priority) {
        query = query.eq('priority', params.priority)
      }

      // Apply pagination
      if (params?.limit && params?.page) {
        query = queryBuilders.paginate(query, params.page, params.limit)
      }

      query = query.order('created_at', { ascending: false })

      const { data, error, count } = await query

      if (error) throw error

      return createResponse(data || [], null, count || undefined)
    } catch (error) {
      return createResponse([], error)
    }
  },

  // Get consultation by ID
  async getById(id: string): Promise<SupabaseResponse<any>> {
    try {
      const client = getClient()
      const { data, error } = await client
        .from('consultation_requests')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      return createResponse(data)
    } catch (error) {
      return createResponse(null, error)
    }
  },

  // Update consultation status
  async updateStatus(id: string, status: 'pending' | 'in_progress' | 'completed' | 'cancelled', notes?: string): Promise<SupabaseResponse<any>> {
    try {
      const client = getClient()
      const { data, error } = await client
        .from('consultation_requests')
        .update({
          status,
          notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      return createResponse(data)
    } catch (error) {
      return createResponse(null, error)
    }
  },

  // Delete consultation
  async delete(id: string): Promise<SupabaseResponse<boolean>> {
    try {
      const client = getClient()
      const { error } = await client
        .from('consultation_requests')
        .delete()
        .eq('id', id)

      if (error) throw error

      return createResponse(true)
    } catch (error) {
      return createResponse(false, error)
    }
  },

  // Get consultation statistics
  async getStats(): Promise<SupabaseResponse<any>> {
    try {
      const client = getClient()
      
      // Get total count
      const { count: totalCount } = await client
        .from('consultation_requests')
        .select('*', { count: 'exact', head: true })

      // Get today's count
      const today = new Date().toISOString().split('T')[0]
      const { count: todayCount } = await client
        .from('consultation_requests')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', `${today}T00:00:00.000Z`)

      // Get pending count
      const { count: pendingCount } = await client
        .from('consultation_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')

      return createResponse({
        total: totalCount || 0,
        today: todayCount || 0,
        pending: pendingCount || 0
      })
    } catch (error) {
      return createResponse({ total: 0, today: 0, pending: 0 }, error)
    }
  }
}

// ============================================================================
// CONTACT REQUESTS
// ============================================================================

export const contacts = {
  // Get all contact requests
  async getAll(params?: {
    status?: 'new' | 'replied' | 'resolved' | 'archived'
    category?: string
    limit?: number
    page?: number
  }): Promise<SupabaseResponse<any[]>> {
    try {
      const client = getClient()
      let query = client.from('contact_requests').select('*')

      // Apply filters
      if (params?.status) {
        query = query.eq('status', params.status)
      }
      if (params?.category) {
        query = query.eq('category', params.category)
      }

      // Apply pagination
      if (params?.limit && params?.page) {
        query = queryBuilders.paginate(query, params.page, params.limit)
      }

      query = query.order('created_at', { ascending: false })

      const { data, error, count } = await query

      if (error) throw error

      return createResponse(data || [], null, count || undefined)
    } catch (error) {
      return createResponse([], error)
    }
  },

  // Get contact by ID
  async getById(id: string): Promise<SupabaseResponse<any>> {
    try {
      const client = getClient()
      const { data, error } = await client
        .from('contact_requests')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      return createResponse(data)
    } catch (error) {
      return createResponse(null, error)
    }
  },

  // Update contact status
  async updateStatus(id: string, status: 'new' | 'replied' | 'resolved' | 'archived', notes?: string): Promise<SupabaseResponse<any>> {
    try {
      const client = getClient()
      const { data, error } = await client
        .from('contact_requests')
        .update({
          status,
          notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      return createResponse(data)
    } catch (error) {
      return createResponse(null, error)
    }
  },

  // Delete contact
  async delete(id: string): Promise<SupabaseResponse<boolean>> {
    try {
      const client = getClient()
      const { error } = await client
        .from('contact_requests')
        .delete()
        .eq('id', id)

      if (error) throw error

      return createResponse(true)
    } catch (error) {
      return createResponse(false, error)
    }
  },

  // Get contact statistics
  async getStats(): Promise<SupabaseResponse<any>> {
    try {
      const client = getClient()
      
      // Get total count
      const { count: totalCount } = await client
        .from('contact_requests')
        .select('*', { count: 'exact', head: true })

      // Get today's count
      const today = new Date().toISOString().split('T')[0]
      const { count: todayCount } = await client
        .from('contact_requests')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', `${today}T00:00:00.000Z`)

      // Get new count
      const { count: newCount } = await client
        .from('contact_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'new')

      return createResponse({
        total: totalCount || 0,
        today: todayCount || 0,
        new: newCount || 0
      })
    } catch (error) {
      return createResponse({ total: 0, today: 0, new: 0 }, error)
    }
  }
}

// ============================================================================
// DASHBOARD STATISTICS
// ============================================================================

export const dashboard = {
  // Get comprehensive dashboard statistics
  async getStats(): Promise<SupabaseResponse<any>> {
    try {
      const client = getClient()
      
      // Get all counts in parallel
      const [
        { count: totalProducts },
        { count: publishedProducts },
        { count: totalPages },
        { count: publishedPages },
        { count: totalCategories },
        { count: activeCategories },
        consultationStats,
        { count: totalBanners },
        { count: activeBanners },
        { count: totalStores },
        { count: totalMenus }
      ] = await Promise.all([
        client.from('products').select('*', { count: 'exact', head: true }),
        client.from('products').select('*', { count: 'exact', head: true }).eq('status', 'published'),
        client.from('pages').select('*', { count: 'exact', head: true }),
        client.from('pages').select('*', { count: 'exact', head: true }).eq('status', 'published'),
        client.from('categories').select('*', { count: 'exact', head: true }),
        client.from('categories').select('*', { count: 'exact', head: true }).eq('is_active', true),
        consultations.getStats(),
        client.from('banners').select('*', { count: 'exact', head: true }),
        client.from('banners').select('*', { count: 'exact', head: true }).eq('is_active', true),
        client.from('store_locations').select('*', { count: 'exact', head: true }),
        client.from('menus').select('*', { count: 'exact', head: true })
      ])

      return createResponse({
        products: {
          total: totalProducts || 0,
          published: publishedProducts || 0
        },
        pages: {
          total: totalPages || 0,
          published: publishedPages || 0
        },
        categories: {
          total: totalCategories || 0,
          active: activeCategories || 0
        },
        consultations: consultationStats.data || { total: 0, today: 0, pending: 0 },
        banners: {
          total: totalBanners || 0,
          active: activeBanners || 0
        },
        stores: {
          total: totalStores || 0
        },
        menus: {
          total: totalMenus || 0
        }
      })
    } catch (error) {
      return createResponse({
        products: { total: 0, published: 0 },
        pages: { total: 0, published: 0 },
        categories: { total: 0, active: 0 },
        consultations: { total: 0, today: 0, pending: 0 },
        banners: { total: 0, active: 0 },
        stores: { total: 0 },
        menus: { total: 0 }
      }, error)
    }
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

// Clear all cache
export const clearCache = (namespace?: string) => {
  if (namespace) {
    // Clear specific namespace
    Array.from(cache.store.keys())
      .filter(key => key.startsWith(namespace))
      .forEach(key => cache.clear(key))
  } else {
    cache.clear()
  }
}

// Prefetch commonly used data
export const prefetchCommonData = async () => {
  try {
    await Promise.allSettled([
      siteSettings.get(true),
      menus.getByLocation('header'),
      menus.getByLocation('footer'),
      categories.getAll({ showInMenu: true }),
      banners.getHeroBanners()
    ])
  } catch (error) {
    console.error('Failed to prefetch common data:', error)
  }
}

// Export all CMS functions
export const cms = {
  siteSettings,
  pages,
  products,
  categories,
  menus,
  banners,
  storeLocations,
  consultations,
  contacts,
  dashboard,
  translations,
  clearCache,
  prefetchCommonData
}

export default cms