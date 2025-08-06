import { createClientComponentClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/lib/types/supabase'

// Client-side Supabase client
export const createClient = () => createClientComponentClient<Database>()

// Server-side Supabase client for server components
export const createServerClient = async () => {
  // Dynamic import to avoid SSR issues
  const { cookies } = await import('next/headers')
  const cookieStore = cookies()
  return createServerComponentClient<Database>({ cookies: () => cookieStore })
}

// Singleton client instance for client-side operations
let clientInstance: ReturnType<typeof createClient> | null = null

export const getClient = () => {
  if (typeof window === 'undefined') {
    // Server-side: return client component client for now
    // This will be handled properly in server components
    return createClient()
  }
  
  // Client-side: use singleton
  if (!clientInstance) {
    clientInstance = createClient()
  }
  
  return clientInstance
}

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: any): string => {
  if (!error) return 'Unknown error occurred'
  
  // Handle Supabase-specific errors
  if (error.code) {
    switch (error.code) {
      case 'PGRST116':
        return 'No data found'
      case 'PGRST301':
        return 'Invalid request parameters'
      case '23505':
        return 'Data already exists'
      case '23503':
        return 'Referenced data does not exist'
      case '42703':
        return 'Invalid column name'
      case '42P01':
        return 'Table does not exist'
      default:
        return error.message || `Database error (${error.code})`
    }
  }
  
  return error.message || 'Unknown error'
}

// Response wrapper type for consistent API responses
export interface SupabaseResponse<T> {
  data: T | null
  error: string | null
  success: boolean
  count?: number
}

// Helper function to create consistent response format
export const createResponse = <T>(
  data: T | null, 
  error: any = null, 
  count?: number
): SupabaseResponse<T> => {
  if (error) {
    return {
      data: null,
      error: handleSupabaseError(error),
      success: false,
      count
    }
  }
  
  return {
    data,
    error: null,
    success: true,
    count
  }
}

// Query builder helpers
export const queryBuilders = {
  // Build pagination query
  paginate: (query: any, page: number = 1, limit: number = 10) => {
    const offset = (page - 1) * limit
    return query.range(offset, offset + limit - 1)
  },
  
  // Build search query for text fields
  search: (query: any, column: string, term: string) => {
    return query.ilike(column, `%${term}%`)
  },
  
  // Build filter for active/published content
  filterActive: (query: any, column: string = 'is_active') => {
    return query.eq(column, true)
  },
  
  // Build filter for published content
  filterPublished: (query: any, column: string = 'status') => {
    return query.eq(column, 'published')
  },
  
  // Build date range filter
  dateRange: (query: any, column: string, start?: string, end?: string) => {
    if (start && end) {
      return query.gte(column, start).lte(column, end)
    } else if (start) {
      return query.gte(column, start)
    } else if (end) {
      return query.lte(column, end)
    }
    return query
  }
}

// Cache utilities for client-side caching
export const cache = {
  // Simple in-memory cache for client-side
  store: new Map<string, { data: any; timestamp: number }>(),
  
  // Cache duration in milliseconds (default: 5 minutes)
  defaultTTL: 5 * 60 * 1000,
  
  // Get cached data
  get: <T>(key: string, ttl?: number): T | null => {
    const cached = cache.store.get(key)
    if (!cached) return null
    
    const isExpired = Date.now() - cached.timestamp > (ttl || cache.defaultTTL)
    if (isExpired) {
      cache.store.delete(key)
      return null
    }
    
    return cached.data as T
  },
  
  // Set cached data
  set: (key: string, data: any): void => {
    cache.store.set(key, {
      data,
      timestamp: Date.now()
    })
  },
  
  // Clear cached data
  clear: (key?: string): void => {
    if (key) {
      cache.store.delete(key)
    } else {
      cache.store.clear()
    }
  },
  
  // Generate cache key
  key: (table: string, id?: string, params?: Record<string, any>): string => {
    const parts = [table]
    if (id) parts.push(id)
    if (params) {
      const paramStr = Object.entries(params)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => `${k}:${v}`)
        .join(',')
      parts.push(paramStr)
    }
    return parts.join('_')
  }
}

// Real-time subscription helpers
export const realtime = {
  // Subscribe to table changes
  subscribe: (
    table: string,
    callback: (payload: any) => void,
    filter?: string
  ) => {
    const client = getClient()
    const subscription = client
      .channel(`public:${table}`)
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table,
          ...(filter ? { filter } : {})
        },
        callback
      )
      .subscribe()
    
    return subscription
  },
  
  // Unsubscribe from changes
  unsubscribe: (subscription: any) => {
    if (subscription) {
      subscription.unsubscribe()
    }
  }
}

export default getClient