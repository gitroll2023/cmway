'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search, Star, Heart, ArrowRight, Eye, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useProducts, useCategories } from '@/lib/hooks/use-cms'
import type { Product } from '@/lib/types/cms'

interface ProductsGridProps {
  category?: string
  search?: string
  sort?: string
  page?: number
  itemsPerPage?: number
  showFilters?: boolean
  locale?: 'ko' | 'en'
}

export function ProductsGrid({
  category,
  search,
  sort = 'newest',
  page = 1,
  itemsPerPage = 12,
  showFilters = true,
  locale = 'ko'
}: ProductsGridProps) {
  const { products, loading, error } = useProducts({
    categoryId: category,
    featured: undefined
  })
  
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [currentPage, setCurrentPage] = useState(page)

  useEffect(() => {
    if (!products) return

    let filtered = [...products]

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(product => 
        product.name[locale]?.toLowerCase().includes(searchLower) ||
        product.short_description?.[locale]?.toLowerCase().includes(searchLower) ||
        product.description?.[locale]?.toLowerCase().includes(searchLower)
      )
    }

    // Sort products
    switch (sort) {
      case 'newest':
        filtered.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        break
      case 'popular':
        filtered.sort((a, b) => (b.stats?.view_count || 0) - (a.stats?.view_count || 0))
        break
      case 'featured':
        filtered.sort((a, b) => {
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          return 0
        })
        break
      case 'name':
        filtered.sort((a, b) => {
          const aName = a.name[locale] || ''
          const bName = b.name[locale] || ''
          return aName.localeCompare(bName)
        })
        break
    }

    setFilteredProducts(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }, [products, category, search, sort, locale])

  // Pagination
  const totalProducts = filteredProducts.length
  const totalPages = Math.ceil(totalProducts / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage)

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    // Scroll to top of grid
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading) {
    return <ProductGridSkeleton />
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-red-800 font-semibold mb-2">제품을 불러올 수 없습니다</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  if (paginatedProducts.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            제품을 찾을 수 없습니다
          </h3>
          <p className="text-gray-600 mb-6">
            검색 조건을 변경하거나 필터를 초기화해보세요.
          </p>
          <Button asChild variant="outline">
            <Link href="/products">
              전체 제품 보기
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Results Info */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          총 <span className="font-semibold text-gray-900">{totalProducts}개</span>의 제품
          {search && (
            <>
              {' '}중 &apos;<span className="font-semibold text-green-600">{search}</span>&apos; 검색 결과
            </>
          )}
        </p>
        
        <div className="text-sm text-gray-500">
          {startIndex + 1}-{Math.min(startIndex + itemsPerPage, totalProducts)} / {totalProducts}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {paginatedProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            <ProductCard product={product} locale={locale} />
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 pt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            이전
          </Button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <Button
              key={pageNum}
              variant={currentPage === pageNum ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(pageNum)}
              className="min-w-[40px]"
            >
              {pageNum}
            </Button>
          ))}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            다음
          </Button>
        </div>
      )}
    </div>
  )
}

interface ProductCardProps {
  product: Product
  locale: 'ko' | 'en'
}

function ProductCard({ product, locale }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false)

  return (
    <>
      {/* Product Image */}
      <div className="relative h-64 bg-gradient-to-br from-green-50 to-blue-50 overflow-hidden">
        {product.media?.featured_image ? (
          <Image
            src={product.media.featured_image}
            alt={product.name[locale] || ''}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <Star className="h-10 w-10 text-green-600" />
            </div>
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-4 left-4 space-y-2">
          {product.is_new && (
            <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              NEW
            </span>
          )}
          {product.featured && (
            <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              인기
            </span>
          )}
          {product.is_best && (
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              BEST
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors',
              isLiked ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
            )}
          >
            <Heart className={cn('h-5 w-5', isLiked && 'fill-current')} />
          </button>
        </div>

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
          <Button
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            asChild
          >
            <Link href={`/products/${product.slug}`}>
              <Eye className="h-4 w-4 mr-2" />
              자세히 보기
            </Link>
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
          <Link href={`/products/${product.slug}`}>
            {product.name[locale]}
          </Link>
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.short_description?.[locale]}
        </p>

        {/* Features */}
        {product.features?.[locale] && product.features[locale].length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {product.features[locale].slice(0, 3).map((feature, idx) => (
                <span 
                  key={idx}
                  className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Price and Actions */}
        <div className="flex items-center justify-between">
          {product.pricing?.is_price_visible ? (
            <div className="text-lg font-bold text-green-600">
              {product.pricing.price_text}
            </div>
          ) : (
            <div className="text-gray-500 text-sm">
              상담 후 안내
            </div>
          )}
          
          <Button size="sm" variant="ghost" asChild>
            <Link href={`/products/${product.slug}`}>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Inquiry Button */}
        {product.inquiry_settings?.enable_inquiry && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <Button size="sm" variant="outline" className="w-full" asChild>
              <Link href={`/consultation?product=${product.slug}`}>
                {product.inquiry_settings.inquiry_button_text || '상담 신청'}
              </Link>
            </Button>
          </div>
        )}
      </div>
    </>
  )
}

function ProductGridSkeleton() {
  return (
    <div className="space-y-8">
      {/* Results Info Skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse">
            <div className="h-64 bg-gray-200"></div>
            <div className="p-6 space-y-4">
              <div className="h-6 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="flex gap-1">
                <div className="h-6 w-16 bg-gray-200 rounded"></div>
                <div className="h-6 w-12 bg-gray-200 rounded"></div>
              </div>
              <div className="flex items-center justify-between">
                <div className="h-6 w-20 bg-gray-200 rounded"></div>
                <div className="h-8 w-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}