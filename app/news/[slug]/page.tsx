'use client'

import { useState, useEffect } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { pagesApi } from '@/lib/api/cms'
import type { Page } from '@/lib/types/cms'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, Share2, Printer } from 'lucide-react'
import { useParams } from 'next/navigation'

export default function NewsDetailPage() {
  const params = useParams()
  const slug = params?.slug as string
  
  const [newsItem, setNewsItem] = useState<Page | null>(null)
  const [relatedNews, setRelatedNews] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const categories = [
    { id: 'all', label: '전체', color: 'bg-slate-100 text-slate-800' },
    { id: 'notice', label: '공지사항', color: 'bg-blue-100 text-blue-800' },
    { id: 'news', label: '뉴스', color: 'bg-green-100 text-green-800' },
    { id: 'event', label: '이벤트', color: 'bg-purple-100 text-purple-800' }
  ]

  useEffect(() => {
    const fetchNewsDetail = async () => {
      if (!slug) return

      setLoading(true)
      setError(null)

      try {
        // Fetch main news item
        const response = await pagesApi.getBySlug(slug)
        
        if (response.success && response.data) {
          setNewsItem(response.data)
          
          // Fetch related news items
          const relatedResponse = await pagesApi.getNewsList({
            category: 'all',
            limit: 3
          })
          
          if (relatedResponse.success) {
            // Filter out current item and limit to 3
            const filteredRelated = relatedResponse.data.data
              .filter(item => item.id !== response.data.id)
              .slice(0, 3)
            setRelatedNews(filteredRelated)
          }
        } else {
          setError(response.error || '뉴스를 찾을 수 없습니다.')
        }
      } catch (err) {
        setError('뉴스를 불러오는데 실패했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchNewsDetail()
  }, [slug])

  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getCategoryInfo = (page: Page) => {
    const category = page.meta?.category || 
                    (page.slug.includes('notice') ? 'notice' : 
                     page.slug.includes('event') ? 'event' : 'news')
    return categories.find(cat => cat.id === category) || categories[2]
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: newsItem?.meta?.title?.ko || '뉴스',
        text: newsItem?.meta?.description?.ko || '',
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('링크가 클립보드에 복사되었습니다.')
    }
  }

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-12 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (error || !newsItem) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
              <div className="text-red-600 mb-4">
                <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-red-900 mb-2">뉴스를 찾을 수 없습니다</h3>
              <p className="text-red-700">{error}</p>
              <Link href="/news">
                <Button className="mt-4">뉴스 목록으로 돌아가기</Button>
              </Link>
            </div>
          </div>
        </div>
      </MainLayout>
    )
  }

  const categoryInfo = getCategoryInfo(newsItem)
  const title = newsItem.meta?.title?.ko || newsItem.meta?.title?.en || '제목 없음'
  const description = newsItem.meta?.description?.ko || newsItem.meta?.description?.en || ''
  
  // For demo purposes, we'll show placeholder content since we don't have the actual content field structure
  const content = newsItem.published_content || newsItem.draft_content || {
    blocks: [
      {
        type: 'paragraph',
        data: { text: description || '이 뉴스의 상세 내용이 여기에 표시됩니다. 실제 CMS에서 관리되는 콘텐츠가 여기에 렌더링됩니다.' }
      }
    ]
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href="/news">
          <Button variant="ghost" className="mb-6 -ml-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            뉴스 목록으로 돌아가기
          </Button>
        </Link>

        {/* Main Content */}
        <article className="mb-12">
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-6">
              {/* Category and Date */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Badge className={`text-sm font-medium ${categoryInfo.color}`}>
                    {categoryInfo.label}
                  </Badge>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(newsItem.published_at || newsItem.created_at)}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handlePrint}>
                    <Printer className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
                {title}
              </h1>

              {/* Description */}
              {description && (
                <p className="text-xl text-gray-600 leading-relaxed">
                  {description}
                </p>
              )}
            </CardHeader>

            <CardContent className="prose prose-lg max-w-none">
              {/* Content Rendering - This would be replaced with actual content renderer */}
              <div className="space-y-6">
                {content?.blocks?.map((block: any, index: number) => {
                  switch (block.type) {
                    case 'paragraph':
                      return (
                        <p key={index} className="text-gray-800 leading-relaxed">
                          {block.data.text}
                        </p>
                      )
                    case 'header':
                      return (
                        <h2 key={index} className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                          {block.data.text}
                        </h2>
                      )
                    default:
                      return (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-gray-600 italic">
                            {typeof block.data === 'string' ? block.data : JSON.stringify(block.data)}
                          </p>
                        </div>
                      )
                  }
                })}
                
                {/* Default content if no blocks */}
                {(!content?.blocks || content.blocks.length === 0) && (
                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">콘텐츠 정보</h3>
                    <p className="text-blue-800">
                      이 뉴스의 상세 내용은 CMS를 통해 관리됩니다. 
                      실제 환경에서는 여기에 풍부한 콘텐츠가 표시됩니다.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </article>

        {/* Related News */}
        {relatedNews.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">관련 뉴스</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedNews.map((item) => {
                const relatedCategoryInfo = getCategoryInfo(item)
                const relatedTitle = item.meta?.title?.ko || item.meta?.title?.en || '제목 없음'
                const relatedDescription = item.meta?.description?.ko || item.meta?.description?.en || ''
                
                return (
                  <Card key={item.id} className="group hover:shadow-lg transition-all duration-300">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={`text-xs font-medium ${relatedCategoryInfo.color}`}>
                          {relatedCategoryInfo.label}
                        </Badge>
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(item.published_at || item.created_at)}
                        </div>
                      </div>
                      <h3 className="font-semibold group-hover:text-blue-600 transition-colors line-clamp-2">
                        {relatedTitle}
                      </h3>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {relatedDescription}
                      </p>
                      <Link href={`/news/${item.slug}`}>
                        <Button variant="outline" size="sm" className="w-full text-xs">
                          자세히 보기
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </section>
        )}
      </div>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        @media print {
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </MainLayout>
  )
}