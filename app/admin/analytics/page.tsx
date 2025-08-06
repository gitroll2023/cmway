'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShoppingCart,
  Eye,
  DollarSign,
  Calendar,
  Download,
  Filter,
  BarChart3,
  LineChart,
  PieChart,
  Activity,
  Globe,
  Monitor,
  Smartphone,
  Clock,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

// Mock data for charts
const visitorData = [
  { date: '1/1', visitors: 1200, pageViews: 3400 },
  { date: '1/2', visitors: 1350, pageViews: 3900 },
  { date: '1/3', visitors: 1100, pageViews: 3100 },
  { date: '1/4', visitors: 1450, pageViews: 4200 },
  { date: '1/5', visitors: 1600, pageViews: 4800 },
  { date: '1/6', visitors: 1750, pageViews: 5200 },
  { date: '1/7', visitors: 1900, pageViews: 5600 }
];

const salesData = [
  { date: '1/1', sales: 45000, orders: 12 },
  { date: '1/2', sales: 52000, orders: 15 },
  { date: '1/3', sales: 38000, orders: 9 },
  { date: '1/4', sales: 61000, orders: 18 },
  { date: '1/5', sales: 73000, orders: 22 },
  { date: '1/6', sales: 89000, orders: 28 },
  { date: '1/7', sales: 95000, orders: 31 }
];

const topProducts = [
  { name: '프리미엄 비타민 C', sales: 234, revenue: 7020000 },
  { name: '오메가-3 플러스', sales: 189, revenue: 5670000 },
  { name: '프로바이오틱스', sales: 156, revenue: 4680000 },
  { name: '멀티비타민', sales: 145, revenue: 4350000 },
  { name: '콜라겐 부스터', sales: 132, revenue: 3960000 }
];

const trafficSources = [
  { source: '직접 방문', visitors: 4500, percentage: 35 },
  { source: '검색 엔진', visitors: 3800, percentage: 30 },
  { source: '소셜 미디어', visitors: 2500, percentage: 20 },
  { source: '이메일', visitors: 1200, percentage: 10 },
  { source: '기타', visitors: 650, percentage: 5 }
];

const deviceTypes = [
  { type: '데스크톱', users: 5200, percentage: 45 },
  { type: '모바일', users: 5800, percentage: 50 },
  { type: '태블릿', users: 580, percentage: 5 }
];

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('7days');
  const [selectedMetric, setSelectedMetric] = useState<'visitors' | 'sales'>('visitors');

  // Calculate statistics
  const stats = {
    totalVisitors: 10250,
    visitorChange: 12.5,
    totalRevenue: 458000000,
    revenueChange: 18.3,
    totalOrders: 125,
    orderChange: -5.2,
    avgOrderValue: 3664000,
    orderValueChange: 8.7,
    conversionRate: 2.8,
    conversionChange: 0.3,
    bounceRate: 42.3,
    bounceChange: -2.1
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ko-KR').format(num);
  };

  const StatCard = ({ title, value, change, icon: Icon, prefix = '', suffix = '' }: any) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <Icon className="w-8 h-8 text-emerald-600" />
        <div className={`flex items-center gap-1 text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {change >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
          {Math.abs(change)}%
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-1">{title}</p>
      <p className="text-2xl font-bold text-gray-900">
        {prefix}{typeof value === 'number' ? formatNumber(value) : value}{suffix}
      </p>
    </div>
  );

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">분석 대시보드</h1>
            <p className="text-gray-600">웹사이트 트래픽, 판매, 사용자 행동을 분석합니다.</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="today">오늘</option>
              <option value="yesterday">어제</option>
              <option value="7days">최근 7일</option>
              <option value="30days">최근 30일</option>
              <option value="90days">최근 90일</option>
            </select>
            <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              리포트 다운로드
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          <StatCard
            title="총 방문자"
            value={stats.totalVisitors}
            change={stats.visitorChange}
            icon={Users}
            suffix="명"
          />
          <StatCard
            title="총 매출"
            value={formatCurrency(stats.totalRevenue)}
            change={stats.revenueChange}
            icon={DollarSign}
          />
          <StatCard
            title="총 주문"
            value={stats.totalOrders}
            change={stats.orderChange}
            icon={ShoppingCart}
            suffix="건"
          />
          <StatCard
            title="평균 주문액"
            value={formatCurrency(stats.avgOrderValue)}
            change={stats.orderValueChange}
            icon={TrendingUp}
          />
          <StatCard
            title="전환율"
            value={stats.conversionRate}
            change={stats.conversionChange}
            icon={Activity}
            suffix="%"
          />
          <StatCard
            title="이탈률"
            value={stats.bounceRate}
            change={stats.bounceChange}
            icon={TrendingDown}
            suffix="%"
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Visitor Trend Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">방문자 추이</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedMetric('visitors')}
                  className={`px-3 py-1 rounded text-sm ${
                    selectedMetric === 'visitors' 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  방문자
                </button>
                <button
                  onClick={() => setSelectedMetric('sales')}
                  className={`px-3 py-1 rounded text-sm ${
                    selectedMetric === 'sales' 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  매출
                </button>
              </div>
            </div>
            <div className="h-64 flex items-end justify-between gap-2">
              {(selectedMetric === 'visitors' ? visitorData : salesData).map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-emerald-100 rounded-t relative" 
                    style={{ 
                      height: `${(selectedMetric === 'visitors' 
                        ? (item.visitors / 2000) * 100 
                        : ((item as any).sales / 100000) * 100)}%` 
                    }}
                  >
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 whitespace-nowrap">
                      {selectedMetric === 'visitors' 
                        ? formatNumber(item.visitors)
                        : formatCurrency((item as any).sales)}
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 mt-2">{item.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sales Performance */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">판매 실적</h2>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700">{product.name}</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(product.revenue)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-emerald-600 h-2 rounded-full"
                      style={{ width: `${(product.revenue / 7020000) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{product.sales}개 판매</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Traffic Sources */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">트래픽 소스</h2>
            <div className="space-y-3">
              {trafficSources.map((source, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      index === 0 ? 'bg-blue-500' :
                      index === 1 ? 'bg-green-500' :
                      index === 2 ? 'bg-purple-500' :
                      index === 3 ? 'bg-yellow-500' : 'bg-gray-500'
                    }`} />
                    <span className="text-sm text-gray-700">{source.source}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">
                      {formatNumber(source.visitors)}
                    </span>
                    <span className="text-xs text-gray-500">({source.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex h-4 rounded-full overflow-hidden">
                {trafficSources.map((source, index) => (
                  <div 
                    key={index}
                    className={`${
                      index === 0 ? 'bg-blue-500' :
                      index === 1 ? 'bg-green-500' :
                      index === 2 ? 'bg-purple-500' :
                      index === 3 ? 'bg-yellow-500' : 'bg-gray-500'
                    }`}
                    style={{ width: `${source.percentage}%` }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Device Types */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">디바이스 유형</h2>
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#e5e7eb"
                    strokeWidth="16"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#10b981"
                    strokeWidth="16"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56 * 0.45} ${2 * Math.PI * 56}`}
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#3b82f6"
                    strokeWidth="16"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56 * 0.5} ${2 * Math.PI * 56}`}
                    strokeDashoffset={`-${2 * Math.PI * 56 * 0.45}`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{formatNumber(11580)}</p>
                    <p className="text-xs text-gray-500">총 사용자</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              {deviceTypes.map((device, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {device.type === '데스크톱' ? <Monitor className="w-4 h-4" /> :
                     device.type === '모바일' ? <Smartphone className="w-4 h-4" /> :
                     <Monitor className="w-4 h-4" />}
                    <span className="text-sm text-gray-700">{device.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">
                      {formatNumber(device.users)}
                    </span>
                    <span className="text-xs text-gray-500">({device.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Real-time Stats */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">실시간 통계</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm text-gray-700">현재 활성 사용자</span>
                </div>
                <span className="text-lg font-bold text-green-600">127</span>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">인기 페이지</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">/products/vitamin-c</span>
                    <span className="text-xs font-semibold">23명</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">/</span>
                    <span className="text-xs font-semibold">18명</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">/products</span>
                    <span className="text-xs font-semibold">15명</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">/about</span>
                    <span className="text-xs font-semibold">12명</span>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">최근 이벤트</p>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-gray-600">제품 구매 - 비타민 C</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-gray-600">회원 가입</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-gray-600">장바구니 추가</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">지역별 방문자</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">서울</p>
              <p className="text-sm text-gray-600">4,520명 (44%)</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">경기</p>
              <p className="text-sm text-gray-600">2,130명 (21%)</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">부산</p>
              <p className="text-sm text-gray-600">820명 (8%)</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">광주</p>
              <p className="text-sm text-gray-600">1,235명 (12%)</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">대구</p>
              <p className="text-sm text-gray-600">615명 (6%)</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">대전</p>
              <p className="text-sm text-gray-600">410명 (4%)</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">인천</p>
              <p className="text-sm text-gray-600">308명 (3%)</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">기타</p>
              <p className="text-sm text-gray-600">212명 (2%)</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}