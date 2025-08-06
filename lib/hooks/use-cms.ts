'use client'

import { useEffect, useState, useCallback } from 'react'
import { useCMSStore } from '@/store/cms'
import { 
  siteSettingsApi,
  pagesApi,
  productsApi,
  categoriesApi,
  menusApi,
  translationsApi 
} from '@/lib/api/cms'
import type { 
  SiteSettings, 
  Page, 
  Product, 
  Category, 
  Menu, 
  Translation 
} from '@/lib/types/cms'

// Site Settings Hook
export function useSiteSettings() {
  const { siteSettings, setSiteSettings } = useCMSStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSiteSettings = useCallback(async () => {
    if (siteSettings) return // Already loaded
    
    setLoading(true)
    setError(null)
    
    try {
      const response = await siteSettingsApi.get()
      if (response.success && response.data) {
        setSiteSettings(response.data)
      } else {
        setError(response.error || 'Failed to load site settings')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [siteSettings, setSiteSettings])

  useEffect(() => {
    fetchSiteSettings()
  }, [fetchSiteSettings])

  return {
    siteSettings,
    loading,
    error,
    refetch: fetchSiteSettings
  }
}

// Products Hook
export function useProducts(options: {
  featured?: boolean
  categoryId?: string
  limit?: number
} = {}) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      let response
      
      if (options.categoryId) {
        response = await productsApi.getByCategory(options.categoryId)
      } else {
        response = await productsApi.getAll()
      }
      
      if (response.success) {
        let filteredProducts = response.data
        
        // Filter by featured if specified
        if (options.featured !== undefined) {
          filteredProducts = filteredProducts.filter(p => p.featured === options.featured)
        }
        
        // Limit results if specified
        if (options.limit) {
          filteredProducts = filteredProducts.slice(0, options.limit)
        }
        
        setProducts(filteredProducts)
      } else {
        setError(response.error || 'Failed to load products')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [options.featured, options.categoryId, options.limit])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return {
    products,
    loading,
    error,
    refetch: fetchProducts
  }
}

// Single Product Hook
export function useProduct(slug: string) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProduct = useCallback(async () => {
    if (!slug) return
    
    setLoading(true)
    setError(null)
    
    try {
      const response = await productsApi.getBySlug(slug)
      if (response.success && response.data) {
        setProduct(response.data)
      } else {
        setError(response.error || 'Product not found')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [slug])

  useEffect(() => {
    fetchProduct()
  }, [fetchProduct])

  return {
    product,
    loading,
    error,
    refetch: fetchProduct
  }
}

// Categories Hook
export function useCategories(options: {
  featured?: boolean
  parentId?: string | null
} = {}) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await categoriesApi.getAll()
      if (response.success) {
        let filteredCategories = response.data
        
        // Filter by parent if specified
        if (options.parentId !== undefined) {
          filteredCategories = filteredCategories.filter(c => c.parent_id === options.parentId)
        }
        
        // Filter by featured if specified
        if (options.featured !== undefined) {
          filteredCategories = filteredCategories.filter(c => 
            c.display_settings?.featured === options.featured
          )
        }
        
        setCategories(filteredCategories)
      } else {
        setError(response.error || 'Failed to load categories')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [options.featured, options.parentId])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories
  }
}

// Single Category Hook
export function useCategory(slug: string) {
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCategory = useCallback(async () => {
    if (!slug) return
    
    setLoading(true)
    setError(null)
    
    try {
      const response = await categoriesApi.getBySlug(slug)
      if (response.success && response.data) {
        setCategory(response.data)
      } else {
        setError(response.error || 'Category not found')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [slug])

  useEffect(() => {
    fetchCategory()
  }, [fetchCategory])

  return {
    category,
    loading,
    error,
    refetch: fetchCategory
  }
}

// Menus Hook
export function useMenus(location: string) {
  const [menus, setMenus] = useState<Menu[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMenus = useCallback(async () => {
    if (!location) return
    
    setLoading(true)
    setError(null)
    
    try {
      const response = await menusApi.getByLocation(location)
      if (response.success) {
        setMenus(response.data)
      } else {
        setError(response.error || 'Failed to load menus')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [location])

  useEffect(() => {
    fetchMenus()
  }, [fetchMenus])

  return {
    menus,
    loading,
    error,
    refetch: fetchMenus
  }
}

// Translations Hook
export function useTranslations(namespace?: string) {
  const [translations, setTranslations] = useState<Translation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTranslations = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      let response
      if (namespace) {
        response = await translationsApi.getByNamespace(namespace)
      } else {
        response = await translationsApi.getAll()
      }
      
      if (response.success) {
        setTranslations(response.data)
      } else {
        setError(response.error || 'Failed to load translations')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [namespace])

  useEffect(() => {
    fetchTranslations()
  }, [fetchTranslations])

  // Helper function to get translation by key
  const getTranslation = useCallback((key: string, locale: string = 'ko', defaultValue?: string) => {
    const translation = translations.find(t => t.key === key)
    if (!translation) return defaultValue || key
    
    return translation.translations[locale] || translation.translations['ko'] || defaultValue || key
  }, [translations])

  return {
    translations,
    loading,
    error,
    refetch: fetchTranslations,
    getTranslation
  }
}

// Pages Hook
export function usePages() {
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPages = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await pagesApi.getAll()
      if (response.success) {
        setPages(response.data)
      } else {
        setError(response.error || 'Failed to load pages')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPages()
  }, [fetchPages])

  return {
    pages,
    loading,
    error,
    refetch: fetchPages
  }
}

// Single Page Hook
export function usePage(slug: string) {
  const [page, setPage] = useState<Page | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPage = useCallback(async () => {
    if (!slug) return
    
    setLoading(true)
    setError(null)
    
    try {
      const response = await pagesApi.getBySlug(slug)
      if (response.success && response.data) {
        setPage(response.data)
      } else {
        setError(response.error || 'Page not found')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [slug])

  useEffect(() => {
    fetchPage()
  }, [fetchPage])

  return {
    page,
    loading,
    error,
    refetch: fetchPage
  }
}