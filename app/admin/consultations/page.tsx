import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ConsultationsTable } from '@/components/admin/consultations-table'
import { consultations } from '@/lib/cms'

export const metadata: Metadata = {
  title: '상담신청 관리 | CMWay Admin',
  description: '고객 상담신청 현황 및 관리'
}

interface ConsultationsPageProps {
  searchParams: {
    page?: string
    status?: string
    search?: string
  }
}

export default async function ConsultationsPage({ searchParams }: ConsultationsPageProps) {
  const currentPage = parseInt(searchParams.page || '1')
  const currentStatus = searchParams.status || 'all'
  const currentSearch = searchParams.search || ''

  // Fetch consultation statistics
  const { data: stats } = await consultations.getStats()

  // Get status counts
  const [
    { count: totalCount },
    { count: pendingCount },
    { count: inProgressCount },
    { count: completedCount }
  ] = await Promise.all([
    consultations.getAll(),
    consultations.getAll({ status: 'pending' }),
    consultations.getAll({ status: 'in_progress' }),
    consultations.getAll({ status: 'completed' })
  ]).then(results => results.map(result => ({ count: result.count || 0 })))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button asChild variant="ghost" size="sm">
                <Link href="/admin">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  대시보드
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  상담신청 관리
                </h1>
                <p className="text-gray-600">
                  고객 상담신청 현황을 확인하고 관리하세요
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button asChild variant="outline">
                <Link href="/">
                  사이트 보기
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">전체 신청</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.total || 0}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">대기중</p>
                <p className="text-2xl font-bold text-orange-600">{stats?.pending || 0}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <MessageSquare className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">진행중</p>
                <p className="text-2xl font-bold text-blue-600">{inProgressCount || 0}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">완료</p>
                <p className="text-2xl font-bold text-green-600">{completedCount || 0}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <MessageSquare className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Consultations Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <ConsultationsTable 
            page={currentPage}
            status={currentStatus}
            search={currentSearch}
          />
        </div>
      </main>
    </div>
  )
}