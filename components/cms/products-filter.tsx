'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useCategories } from '@/lib/hooks/use-cms'

interface ProductsFilterProps {
  currentCategory?: string
  currentSearch?: string
  currentSort?: string
  locale?: 'ko' | 'en'
}

export function ProductsFilter({
  currentCategory,
  currentSearch = '',
  currentSort = 'newest',
  locale = 'ko'
}: ProductsFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const { categories, loading: categoriesLoading } = useCategories()
  const [searchValue, setSearchValue] = useState(currentSearch)
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)

  // Count active filters
  useEffect(() => {
    let count = 0
    if (currentCategory && currentCategory !== 'all') count++
    if (currentSearch) count++
    if (currentSort !== 'newest') count++
    setActiveFiltersCount(count)
  }, [currentCategory, currentSearch, currentSort])

  // Update URL with new filters
  const updateFilters = (newFilters: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString())
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== 'all' && value !== '') {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })

    // Always reset to page 1 when filters change
    params.delete('page')
    
    router.push(`/products?${params.toString()}`)
  }

  const handleCategoryChange = (categoryValue: string) => {
    updateFilters({
      category: categoryValue === 'all' ? undefined : categoryValue,
      search: currentSearch,
      sort: currentSort
    })
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilters({
      category: currentCategory,
      search: searchValue.trim() || undefined,
      sort: currentSort
    })
  }

  const handleSortChange = (newSort: string) => {
    updateFilters({
      category: currentCategory,
      search: currentSearch,
      sort: newSort === 'newest' ? undefined : newSort
    })
  }

  const clearAllFilters = () => {
    setSearchValue('')
    router.push('/products')
  }

  const sortOptions = [
    { value: 'newest', label: '최신순' },
    { value: 'popular', label: '인기순' },
    { value: 'featured', label: '추천순' },
    { value: 'name', label: '이름순' },
  ]

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative max-w-md">
        <form onSubmit={handleSearchSubmit}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="제품명 또는 키워드 검색..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            {searchValue && (
              <button
                type="button"
                onClick={() => {
                  setSearchValue('')
                  updateFilters({
                    category: currentCategory,
                    search: undefined,
                    sort: currentSort
                  })
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Category Filter */}
        <div className="flex-1">
          {categoriesLoading ? (
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-10 w-20 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleCategoryChange('all')}
                className={cn(
                  'px-4 py-2 rounded-full font-medium transition-all duration-200',
                  (!currentCategory || currentCategory === 'all')
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                전체
              </button>
              
              {categories
                .filter(cat => cat.display_settings?.show_in_menu)
                .map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.slug)}
                    className={cn(
                      'px-4 py-2 rounded-full font-medium transition-all duration-200',
                      currentCategory === category.slug || currentCategory === category.id
                        ? 'bg-green-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    )}
                  >
                    {category.name[locale]}
                  </button>
                ))}
            </div>
          )}
        </div>

        {/* Sort and Clear Filters */}
        <div className="flex items-center space-x-4">
          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={currentSort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Clear Filters */}
          {activeFiltersCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllFilters}
              className="flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>필터 초기화</span>
              {activeFiltersCount > 0 && (
                <span className="bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-200">
          <span className="text-sm text-gray-600">적용된 필터:</span>
          
          {currentCategory && currentCategory !== 'all' && (
            <span className="inline-flex items-center bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
              카테고리: {(categories.find(c => c.slug === currentCategory || c.id === currentCategory)?.name as any)?.[locale] || currentCategory}
              <button
                onClick={() => handleCategoryChange('all')}
                className="ml-2 hover:bg-green-200 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          
          {currentSearch && (
            <span className="inline-flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
              검색: {currentSearch}
              <button
                onClick={() => {
                  setSearchValue('')
                  updateFilters({
                    category: currentCategory,
                    search: undefined,
                    sort: currentSort
                  })
                }}
                className="ml-2 hover:bg-blue-200 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          
          {currentSort !== 'newest' && (
            <span className="inline-flex items-center bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full">
              정렬: {sortOptions.find(s => s.value === currentSort)?.label}
              <button
                onClick={() => handleSortChange('newest')}
                className="ml-2 hover:bg-purple-200 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  )
}