import { Metadata } from 'next'
import Link from 'next/link'
import { 
  Users, 
  ShoppingBag, 
  FileText, 
  MessageSquare, 
  Settings,
  BarChart3,
  Calendar,
  Globe
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { dashboard } from '@/lib/cms'

export const metadata: Metadata = {
  title: '관리자 대시보드 | CMWay Admin',
  description: 'CMWay CMS 관리자 패널'
}

export default async function AdminDashboard() {
  // TODO: Add authentication check
  
  // Fetch dashboard statistics
  const { data: stats } = await dashboard.getStats()

  const dashboardCards = [
    {
      title: '상담신청 관리',
      description: '고객 상담신청 현황 및 관리',
      href: '/admin/consultations',
      icon: MessageSquare,
      color: 'bg-blue-500',
      stats: `${stats?.consultations?.pending || 0}개 대기중`
    },
    {
      title: '제품 관리',
      description: '제품 정보 및 카테고리 관리',
      href: '/admin/products',
      icon: ShoppingBag,
      color: 'bg-green-500',
      stats: `${stats?.products?.total || 0}개 제품`
    },
    {
      title: '콘텐츠 관리',
      description: '페이지 및 콘텐츠 블록 관리',
      href: '/admin/content',
      icon: FileText,
      color: 'bg-purple-500',
      stats: `${stats?.pages?.total || 0}개 페이지`
    },
    {
      title: '사이트 설정',
      description: '사이트 기본 설정 및 구성',
      href: '/admin/site',
      icon: Settings,
      color: 'bg-gray-500',
      stats: '설정 완료'
    },
    {
      title: '매장 관리',
      description: '매장 정보 및 위치 관리',
      href: '/admin/stores',
      icon: Globe,
      color: 'bg-orange-500',
      stats: `${stats?.stores?.total || 0}개 매장`
    },
    {
      title: '통계 및 분석',
      description: '방문자 및 성과 분석',
      href: '/admin/analytics',
      icon: BarChart3,
      color: 'bg-indigo-500',
      stats: '준비중'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                관리자 대시보드
              </h1>
              <p className="text-gray-600">
                CMWay CMS 관리 시스템
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button asChild variant="outline">
                <Link href="/">
                  사이트 보기
                </Link>
              </Button>
              <Button variant="outline">
                로그아웃
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
            <h2 className="text-2xl font-bold mb-2">
              안녕하세요, 관리자님! 👋
            </h2>
            <p className="text-blue-100">
              오늘도 CMWay와 함께 고객들에게 최상의 서비스를 제공해보세요.
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">오늘 상담신청</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.consultations?.today || 0}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">총 제품</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.products?.published || 0}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <ShoppingBag className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">카테고리</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.categories?.active || 0}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">활성 페이지</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.pages?.published || 0}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <FileText className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Management Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardCards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`${card.color} p-3 rounded-lg`}>
                  <card.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{card.stats}</p>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {card.title}
              </h3>
              
              <p className="text-gray-600 text-sm">
                {card.description}
              </p>
            </Link>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                최근 활동
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {[
                  {
                    type: 'consultation',
                    message: '새로운 상담신청이 접수되었습니다.',
                    time: '5분 전',
                    user: '홍길동'
                  },
                  {
                    type: 'product',
                    message: '제품 정보가 업데이트되었습니다.',
                    time: '1시간 전',
                    user: '관리자'
                  },
                  {
                    type: 'page',
                    message: '홈페이지 콘텐츠가 수정되었습니다.',
                    time: '3시간 전',
                    user: '관리자'
                  }
                ].map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {activity.type === 'consultation' && (
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <MessageSquare className="h-4 w-4 text-blue-600" />
                        </div>
                      )}
                      {activity.type === 'product' && (
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <ShoppingBag className="h-4 w-4 text-green-600" />
                        </div>
                      )}
                      {activity.type === 'page' && (
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <FileText className="h-4 w-4 text-purple-600" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">
                        {activity.user} • {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}