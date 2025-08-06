import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ContactInquiriesTable } from '@/components/admin/contact-inquiries-table'
import { contacts } from '@/lib/cms'

export const metadata: Metadata = {
  title: '문의내역 관리 | CMWay Admin',
  description: '고객 문의내역 현황 및 관리'
}

interface InquiriesPageProps {
  searchParams: {
    page?: string
    status?: string
    search?: string
  }
}

export default async function InquiriesPage({ searchParams }: InquiriesPageProps) {
  const currentPage = parseInt(searchParams.page || '1')
  const currentStatus = searchParams.status || 'all'
  const currentSearch = searchParams.search || ''

  // Fetch contact statistics
  const { data: stats } = await contacts.getStats()

  // Get status counts
  const [
    { count: totalCount },
    { count: newCount },
    { count: repliedCount },
    { count: resolvedCount }
  ] = await Promise.all([
    contacts.getAll(),
    contacts.getAll({ status: 'new' }),
    contacts.getAll({ status: 'replied' }),
    contacts.getAll({ status: 'resolved' })
  ]).then(results => results.map(result => ({ count: result.count || 0 })))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button asChild variant="ghost" size="sm">
                <Link href="/admin/consultations">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  상담신청 관리
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  문의내역 관리
                </h1>
                <p className="text-gray-600">
                  고객 문의내역을 확인하고 관리하세요
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
                <p className="text-gray-600 text-sm">전체 문의</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.total || 0}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <MessageCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">신규</p>
                <p className="text-2xl font-bold text-orange-600">{newCount || 0}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <MessageCircle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">답변완료</p>
                <p className="text-2xl font-bold text-blue-600">{repliedCount || 0}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <MessageCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">해결됨</p>
                <p className="text-2xl font-bold text-green-600">{resolvedCount || 0}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <MessageCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Contact Inquiries Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <ContactInquiriesTable 
            page={currentPage}
            status={currentStatus}
            search={currentSearch}
          />
        </div>
      </main>
    </div>
  )
}