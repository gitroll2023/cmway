'use client'

import { useState, useEffect } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { pagesApi } from '@/lib/api/cms'
import type { Page } from '@/lib/types/cms'
import Link from 'next/link'
import { Search, Calendar, ChevronLeft, ChevronRight } from 'lucide-react'

interface NewsPageProps {
  searchParams?: {
    page?: string
    search?: string
    category?: string
  }
}

export default function NewsPage({ searchParams }: NewsPageProps) {
  const [newsList, setNewsList] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState(searchParams?.search || '')
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams?.page || '1'))
  const [activeCategory, setActiveCategory] = useState(searchParams?.category || 'all')
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  const categories = [
    { id: 'all', label: '전체', color: 'bg-slate-100 text-slate-800' },
    { id: 'notice', label: '공지사항', color: 'bg-blue-100 text-blue-800' },
    { id: 'news', label: '뉴스', color: 'bg-green-100 text-green-800' },
    { id: 'event', label: '이벤트', color: 'bg-purple-100 text-purple-800' }
  ]

  const fetchNews = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await pagesApi.getNewsList({
        category: activeCategory,
        search: search.trim(),
        page: currentPage,
        limit: 12
      })

      if (response.success && response.data) {
        setNewsList(response.data.data)
        setTotal(response.data.total)
        setTotalPages(response.data.totalPages)
      } else {
        setError(response.error || '뉴스를 불러오는데 실패했습니다.')
        setNewsList([])
      }
    } catch (err) {
      setError('뉴스를 불러오는데 실패했습니다.')
      setNewsList([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNews()
  }, [activeCategory, currentPage, search])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchNews()
  }

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getCategoryInfo = (page: Page) => {
    // Try to extract category from slug
    const category = page.slug.includes('notice') ? 'notice' : 
                    page.slug.includes('event') ? 'event' : 'news'
    const categoryInfo = categories.find(cat => cat.id === category) || categories[2]
    return categoryInfo
  }

  const renderPagination = () => {
    if (totalPages <= 1) return null

    const getPageNumbers = () => {
      const pages = []
      const maxVisible = 5
      let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
      const end = Math.min(totalPages, start + maxVisible - 1)
      
      if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1)
      }

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      return pages
    }

    return (
      <div className="flex items-center justify-center space-x-2 mt-12">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
          이전
        </Button>
        
        {getPageNumbers().map(page => (
          <Button
            key={page}
            variant={page === currentPage ? "default" : "outline"}
            size="sm"
            onClick={() => handlePageChange(page)}
          >
            {page}
          </Button>
        ))}
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          다음
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-20 pb-16">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              뉴스 &amp; 공지사항
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              CMWay의 최신 소식과 중요한 공지사항을 확인해보세요
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="뉴스 검색..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-3 text-lg border-2 border-gray-200 focus:border-blue-400 rounded-xl"
                />
                <Button 
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1"
                  size="sm"
                >
                  검색
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Tabs */}
        <Tabs value={activeCategory} onValueChange={handleCategoryChange} className="mb-8">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="text-sm font-medium">
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Results Info */}
        {!loading && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">
              총 <span className="font-semibold text-blue-600">{total}</span>개의 글
              {search && ` · "${search}" 검색 결과`}
            </p>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
              <div className="text-red-600 mb-4">
                <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-red-900 mb-2">오류가 발생했습니다</h3>
              <p className="text-red-700">{error}</p>
              <Button onClick={fetchNews} className="mt-4">다시 시도</Button>
            </div>
          </div>
        ) : newsList.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
              <div className="text-gray-400 mb-4">
                <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">검색 결과가 없습니다</h3>
              <p className="text-gray-600">다른 검색어를 사용해보세요.</p>
            </div>
          </div>
        ) : (
          <>
            {/* News Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {newsList.map((item) => {
                const categoryInfo = getCategoryInfo(item)
                const title = item.meta?.title?.ko || item.meta?.title?.en || '제목 없음'
                const description = item.meta?.description?.ko || item.meta?.description?.en || ''
                
                return (
                  <Card key={item.id} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:-translate-y-1">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={`text-xs font-medium ${categoryInfo.color}`}>
                          {categoryInfo.label}
                        </Badge>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(item.published_at || item.created_at)}
                        </div>
                      </div>
                      <CardTitle className="text-lg font-semibold group-hover:text-blue-600 transition-colors line-clamp-2">
                        {title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <CardDescription className="text-gray-600 line-clamp-3 mb-4">
                        {description || '내용을 확인해보세요.'}
                      </CardDescription>
                      <Link href={`/news/${item.slug}`}>
                        <Button variant="outline" size="sm" className="w-full group-hover:bg-blue-50 group-hover:border-blue-300">
                          자세히 보기
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Pagination */}
            {renderPagination()}
          </>
        )}
      </div>

      <style jsx>{`
        .bg-grid-pattern {
          background-image: radial-gradient(circle at 1px 1px, rgb(0 0 0 / 0.15) 1px, transparent 0);
          background-size: 20px 20px;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </MainLayout>
  )
}