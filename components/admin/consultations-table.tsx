'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { 
  Search, 
  Filter, 
  Eye, 
  Edit3, 
  Phone, 
  Mail,
  User,
  Calendar,
  MessageSquare,
  ChevronDown
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ConsultationRequest {
  id: string
  name: string
  phone: string
  email?: string
  company?: string
  consultation_type: string
  product_interests: string[] | null
  preferred_date?: string
  preferred_time?: string
  message?: string
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  created_at: string
  updated_at: string
}

interface ConsultationsTableProps {
  page: number
  status: string
  search: string
}

export function ConsultationsTable({ page, status, search }: ConsultationsTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [consultations, setConsultations] = useState<ConsultationRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedConsultations, setSelectedConsultations] = useState<string[]>([])
  const [searchValue, setSearchValue] = useState(search)
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  // Fetch consultations
  useEffect(() => {
    fetchConsultations()
  }, [page, status, search])

  const fetchConsultations = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...(status !== 'all' && { status }),
        ...(search && { search })
      })

      const response = await fetch(`/api/consultation?${params}`)
      
      if (!response.ok) {
        throw new Error('상담신청 데이터를 불러올 수 없습니다')
      }

      const result = await response.json()
      
      if (result.success) {
        setConsultations(result.data)
        setTotalCount(result.pagination.total)
        setTotalPages(result.pagination.totalPages)
      } else {
        throw new Error(result.error || '데이터를 불러올 수 없습니다')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다')
    } finally {
      setLoading(false)
    }
  }

  // Update URL with filters
  const updateFilters = (newFilters: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString())
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== 'all' && value !== '') {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })

    // Reset to page 1 when filters change
    if (newFilters.status || newFilters.search !== undefined) {
      params.delete('page')
    }
    
    router.push(`/admin/consultations?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilters({ search: searchValue.trim() || undefined })
  }

  const handleStatusFilter = (newStatus: string) => {
    updateFilters({ status: newStatus === 'all' ? undefined : newStatus })
  }

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    if (newPage === 1) {
      params.delete('page')
    } else {
      params.set('page', newPage.toString())
    }
    router.push(`/admin/consultations?${params.toString()}`)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: '대기중', color: 'bg-orange-100 text-orange-800' },
      in_progress: { label: '진행중', color: 'bg-blue-100 text-blue-800' },
      completed: { label: '완료', color: 'bg-green-100 text-green-800' },
      cancelled: { label: '취소', color: 'bg-gray-100 text-gray-800' }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending

    return (
      <span className={cn('px-2 py-1 text-xs font-medium rounded-full', config.color)}>
        {config.label}
      </span>
    )
  }

  const getConsultationTypeLabel = (type: string) => {
    const types = {
      general: '일반 상담',
      product: '제품 상담',
      business: '사업 제휴',
      other: '기타'
    }
    return types[type as keyof typeof types] || type
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {/* Header Skeleton */}
          <div className="flex justify-between items-center mb-6">
            <div className="h-8 w-48 bg-gray-200 rounded"></div>
            <div className="flex space-x-2">
              <div className="h-10 w-32 bg-gray-200 rounded"></div>
              <div className="h-10 w-24 bg-gray-200 rounded"></div>
            </div>
          </div>

          {/* Table Skeleton */}
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            데이터를 불러올 수 없습니다
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchConsultations}>
            다시 시도
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            상담신청 목록
          </h2>
          <p className="text-sm text-gray-600">
            총 {totalCount}개의 상담신청
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="이름, 전화번호, 이메일 검색..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </form>

          {/* Status Filter */}
          <div className="flex space-x-2">
            {[
              { value: 'all', label: '전체' },
              { value: 'pending', label: '대기중' },
              { value: 'in_progress', label: '진행중' },
              { value: 'completed', label: '완료' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => handleStatusFilter(option.value)}
                className={cn(
                  'px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                  status === option.value || (status === 'all' && option.value === 'all')
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      {consultations.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            상담신청이 없습니다
          </h3>
          <p className="text-gray-600">
            검색 조건을 변경하거나 필터를 초기화해보세요.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    고객 정보
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상담 유형
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    신청일
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {consultations.map((consultation) => (
                  <tr key={consultation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {consultation.name}
                            {consultation.company && (
                              <span className="text-gray-500 ml-1">
                                ({consultation.company})
                              </span>
                            )}
                          </div>
                          <div className="flex items-center text-sm text-gray-500 space-x-4">
                            <div className="flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              {consultation.phone}
                            </div>
                            {consultation.email && (
                              <div className="flex items-center">
                                <Mail className="h-3 w-3 mr-1" />
                                {consultation.email}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {getConsultationTypeLabel(consultation.consultation_type)}
                      </div>
                      {consultation.product_interests && consultation.product_interests.length > 0 && (
                        <div className="text-xs text-gray-500">
                          관심제품: {consultation.product_interests.slice(0, 2).join(', ')}
                          {consultation.product_interests.length > 2 && ' 외'}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="h-3 w-3 mr-1" />
                        {format(new Date(consultation.created_at), 'yyyy.MM.dd', { locale: ko })}
                      </div>
                      <div className="text-xs text-gray-500">
                        {format(new Date(consultation.created_at), 'HH:mm')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(consultation.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-gray-600 hover:text-gray-700"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-6">
              <div className="text-sm text-gray-700">
                {((page - 1) * 20) + 1}-{Math.min(page * 20, totalCount)} / {totalCount}개 표시
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                >
                  이전
                </Button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(page - 2 + i, totalPages - 4 + i))
                  return (
                    <Button
                      key={pageNum}
                      variant={page === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                      className="min-w-[36px]"
                    >
                      {pageNum}
                    </Button>
                  )
                })}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                >
                  다음
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}