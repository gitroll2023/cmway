'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function TestDBPage() {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()
      
      try {
        // Test products table
        console.log('Fetching products...')
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
        
        if (productsError) {
          console.error('Products error:', productsError)
          setError(`Products error: ${productsError.message}`)
        } else {
          console.log('Products data:', productsData)
          setProducts(productsData || [])
        }

        // Test categories table
        console.log('Fetching categories...')
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
        
        if (categoriesError) {
          console.error('Categories error:', categoriesError)
          setError(prev => prev + `\nCategories error: ${categoriesError.message}`)
        } else {
          console.log('Categories data:', categoriesData)
          setCategories(categoriesData || [])
        }
      } catch (err) {
        console.error('Unexpected error:', err)
        setError(`Unexpected error: ${err}`)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <div className="p-8">Loading...</div>

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Database Test</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <pre>{error}</pre>
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Categories ({categories.length})</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {JSON.stringify(categories, null, 2)}
        </pre>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Products ({products.length})</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {JSON.stringify(products, null, 2)}
        </pre>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Table Structure Info</h2>
        <div className="bg-blue-50 p-4 rounded">
          <p>Products table columns: {products.length > 0 ? Object.keys(products[0]).join(', ') : 'No data'}</p>
          <p>Categories table columns: {categories.length > 0 ? Object.keys(categories[0]).join(', ') : 'No data'}</p>
        </div>
      </div>
    </div>
  )
}