'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText,
  User,
  Calendar,
  Clock,
  Activity,
  Filter,
  Download,
  Search,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Shield,
  LogIn,
  LogOut,
  Edit2,
  Trash2,
  Plus,
  Eye,
  Lock,
  Unlock,
  Key,
  Settings,
  Database,
  Globe,
  Monitor,
  Smartphone,
  Tablet,
  RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

interface LogEntry {
  id: string;
  timestamp: string;
  admin_id: string;
  admin_name: string;
  admin_email: string;
  action: string;
  category: string;
  resource: string;
  resource_id?: string;
  details: string;
  ip_address: string;
  user_agent: string;
  device_type: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
  location?: string;
  status: 'success' | 'warning' | 'error' | 'info';
  duration?: number; // in milliseconds
}

// Mock data
const mockLogs: LogEntry[] = [
  {
    id: '1',
    timestamp: '2024-01-06T14:30:25Z',
    admin_id: '1',
    admin_name: '김철수',
    admin_email: 'admin@cmway.kr',
    action: 'LOGIN',
    category: '인증',
    resource: '관리자 패널',
    details: '관리자 패널 로그인 성공',
    ip_address: '192.168.1.100',
    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
    device_type: 'desktop',
    browser: 'Chrome',
    os: 'Windows 10',
    location: '서울특별시',
    status: 'success',
    duration: 250
  },
  {
    id: '2',
    timestamp: '2024-01-06T14:28:15Z',
    admin_id: '2',
    admin_name: '이영희',
    admin_email: 'manager@cmway.kr',
    action: 'CREATE',
    category: '콘텐츠',
    resource: '공지사항',
    resource_id: 'notice_123',
    details: '새 공지사항 작성: "1월 이벤트 안내"',
    ip_address: '192.168.1.101',
    user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15',
    device_type: 'desktop',
    browser: 'Safari',
    os: 'macOS',
    location: '서울특별시',
    status: 'success',
    duration: 450
  },
  {
    id: '3',
    timestamp: '2024-01-06T14:25:00Z',
    admin_id: '3',
    admin_name: '박민수',
    admin_email: 'support@cmway.kr',
    action: 'UPDATE',
    category: '주문',
    resource: '주문',
    resource_id: 'order_456',
    details: '주문 상태 변경: 처리중 → 배송중',
    ip_address: '192.168.1.102',
    user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Mobile/15E148',
    device_type: 'mobile',
    browser: 'Safari',
    os: 'iOS',
    location: '경기도 성남시',
    status: 'success',
    duration: 320
  },
  {
    id: '4',
    timestamp: '2024-01-06T14:20:00Z',
    admin_id: '1',
    admin_name: '김철수',
    admin_email: 'admin@cmway.kr',
    action: 'DELETE',
    category: '미디어',
    resource: '이미지',
    resource_id: 'img_789',
    details: '이미지 파일 삭제: banner_old.jpg',
    ip_address: '192.168.1.100',
    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
    device_type: 'desktop',
    browser: 'Chrome',
    os: 'Windows 10',
    location: '서울특별시',
    status: 'warning',
    duration: 180
  },
  {
    id: '5',
    timestamp: '2024-01-06T14:15:00Z',
    admin_id: '4',
    admin_name: '정수진',
    admin_email: 'content@cmway.kr',
    action: 'LOGIN_FAILED',
    category: '인증',
    resource: '관리자 패널',
    details: '로그인 실패: 잘못된 비밀번호',
    ip_address: '192.168.1.103',
    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/120.0.0.0',
    device_type: 'desktop',
    browser: 'Edge',
    os: 'Windows 11',
    location: '부산광역시',
    status: 'error',
    duration: 100
  },
  {
    id: '6',
    timestamp: '2024-01-06T14:10:00Z',
    admin_id: '2',
    admin_name: '이영희',
    admin_email: 'manager@cmway.kr',
    action: 'UPDATE',
    category: '상품',
    resource: '상품',
    resource_id: 'product_101',
    details: '상품 가격 변경: 50,000원 → 45,000원',
    ip_address: '192.168.1.101',
    user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15',
    device_type: 'desktop',
    browser: 'Safari',
    os: 'macOS',
    location: '서울특별시',
    status: 'success',
    duration: 280
  },
  {
    id: '7',
    timestamp: '2024-01-06T14:05:00Z',
    admin_id: '1',
    admin_name: '김철수',
    admin_email: 'admin@cmway.kr',
    action: 'CREATE',
    category: '관리자',
    resource: '관리자 계정',
    resource_id: 'admin_new',
    details: '새 관리자 계정 생성: test@cmway.kr',
    ip_address: '192.168.1.100',
    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
    device_type: 'desktop',
    browser: 'Chrome',
    os: 'Windows 10',
    location: '서울특별시',
    status: 'success',
    duration: 350
  },
  {
    id: '8',
    timestamp: '2024-01-06T14:00:00Z',
    admin_id: '1',
    admin_name: '김철수',
    admin_email: 'admin@cmway.kr',
    action: 'UPDATE',
    category: '시스템',
    resource: '설정',
    resource_id: 'settings_general',
    details: '시스템 설정 변경: 유지보수 모드 활성화',
    ip_address: '192.168.1.100',
    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
    device_type: 'desktop',
    browser: 'Chrome',
    os: 'Windows 10',
    location: '서울특별시',
    status: 'warning',
    duration: 200
  },
  {
    id: '9',
    timestamp: '2024-01-06T13:55:00Z',
    admin_id: '3',
    admin_name: '박민수',
    admin_email: 'support@cmway.kr',
    action: 'VIEW',
    category: '고객',
    resource: '고객 정보',
    resource_id: 'customer_999',
    details: '고객 정보 조회: user999@example.com',
    ip_address: '192.168.1.102',
    user_agent: 'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) Mobile/15E148',
    device_type: 'tablet',
    browser: 'Safari',
    os: 'iPadOS',
    location: '경기도 성남시',
    status: 'info',
    duration: 150
  },
  {
    id: '10',
    timestamp: '2024-01-06T13:50:00Z',
    admin_id: '2',
    admin_name: '이영희',
    admin_email: 'manager@cmway.kr',
    action: 'EXPORT',
    category: '분석',
    resource: '리포트',
    details: '월간 판매 리포트 다운로드',
    ip_address: '192.168.1.101',
    user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15',
    device_type: 'desktop',
    browser: 'Safari',
    os: 'macOS',
    location: '서울특별시',
    status: 'success',
    duration: 1200
  }
];

const actionCategories = [
  { value: 'all', label: '전체', icon: Activity },
  { value: '인증', label: '인증', icon: Shield },
  { value: '콘텐츠', label: '콘텐츠', icon: FileText },
  { value: '미디어', label: '미디어', icon: Globe },
  { value: '상품', label: '상품', icon: Database },
  { value: '주문', label: '주문', icon: Activity },
  { value: '고객', label: '고객', icon: User },
  { value: '관리자', label: '관리자', icon: Shield },
  { value: '시스템', label: '시스템', icon: Settings },
  { value: '분석', label: '분석', icon: Activity }
];

const actionTypes = [
  { value: 'LOGIN', label: '로그인', icon: LogIn },
  { value: 'LOGOUT', label: '로그아웃', icon: LogOut },
  { value: 'LOGIN_FAILED', label: '로그인 실패', icon: XCircle },
  { value: 'CREATE', label: '생성', icon: Plus },
  { value: 'UPDATE', label: '수정', icon: Edit2 },
  { value: 'DELETE', label: '삭제', icon: Trash2 },
  { value: 'VIEW', label: '조회', icon: Eye },
  { value: 'EXPORT', label: '내보내기', icon: Download }
];

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>(mockLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDateRange, setFilterDateRange] = useState('today');
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.admin_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.admin_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || log.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || log.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const stats = {
    total: logs.length,
    success: logs.filter(l => l.status === 'success').length,
    warning: logs.filter(l => l.status === 'warning').length,
    error: logs.filter(l => l.status === 'error').length,
    today: logs.filter(l => {
      const logDate = new Date(l.timestamp);
      const today = new Date();
      return logDate.toDateString() === today.toDateString();
    }).length,
    uniqueAdmins: new Set(logs.map(l => l.admin_id)).size,
    avgDuration: Math.round(
      logs.filter(l => l.duration).reduce((sum, l) => sum + (l.duration || 0), 0) / 
      logs.filter(l => l.duration).length
    )
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffMinutes = Math.ceil(diffTime / (1000 * 60));
    
    if (diffMinutes < 60) {
      return `${diffMinutes}분 전`;
    } else if (diffMinutes < 1440) {
      const diffHours = Math.floor(diffMinutes / 60);
      return `${diffHours}시간 전`;
    }
    return date.toLocaleString('ko-KR');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'info':
        return <Info className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getActionIcon = (action: string) => {
    const actionType = actionTypes.find(a => a.value === action);
    if (actionType) {
      const Icon = actionType.icon;
      return <Icon className="w-4 h-4" />;
    }
    return <Activity className="w-4 h-4" />;
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'desktop':
        return <Monitor className="w-4 h-4" />;
      case 'mobile':
        return <Smartphone className="w-4 h-4" />;
      case 'tablet':
        return <Tablet className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  const handleViewDetails = (log: LogEntry) => {
    setSelectedLog(log);
    setShowDetails(true);
  };

  const handleExportLogs = () => {
    toast.success('로그를 CSV 파일로 다운로드합니다.');
  };

  const handleRefresh = () => {
    toast.success('로그를 새로고침했습니다.');
    // In real implementation, fetch new logs from server
  };

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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">관리자 활동 로그</h1>
            <p className="text-gray-600">관리자의 모든 활동을 추적하고 감사합니다.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              새로고침
            </button>
            <button
              onClick={handleExportLogs}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              로그 내보내기
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">전체 활동</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Activity className="w-8 h-8 text-emerald-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">성공</p>
                <p className="text-2xl font-bold text-green-600">{stats.success}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">경고</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.warning}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">오류</p>
                <p className="text-2xl font-bold text-red-600">{stats.error}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">오늘</p>
                <p className="text-2xl font-bold text-blue-600">{stats.today}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">활동 관리자</p>
                <p className="text-2xl font-bold text-purple-600">{stats.uniqueAdmins}</p>
              </div>
              <User className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">평균 응답</p>
                <p className="text-xl font-bold text-gray-900">{stats.avgDuration}ms</p>
              </div>
              <Clock className="w-8 h-8 text-gray-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="관리자, 활동, 리소스로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
            
            <select
              value={filterDateRange}
              onChange={(e) => setFilterDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="today">오늘</option>
              <option value="yesterday">어제</option>
              <option value="week">이번 주</option>
              <option value="month">이번 달</option>
              <option value="all">전체</option>
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {actionCategories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">모든 상태</option>
              <option value="success">성공</option>
              <option value="warning">경고</option>
              <option value="error">오류</option>
              <option value="info">정보</option>
            </select>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded border-gray-300 text-emerald-600"
              />
              <span className="text-sm text-gray-700 whitespace-nowrap">자동 새로고침</span>
            </label>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    시간
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    관리자
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    활동
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    리소스
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상세 내용
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    장치
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatTimestamp(log.timestamp)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{log.admin_name}</div>
                        <div className="text-xs text-gray-500">{log.admin_email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getActionIcon(log.action)}
                        <span className="text-sm text-gray-900">
                          {actionTypes.find(a => a.value === log.action)?.label || log.action}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm text-gray-900">{log.resource}</div>
                        {log.resource_id && (
                          <div className="text-xs text-gray-500">{log.resource_id}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 max-w-xs truncate">{log.details}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {getDeviceIcon(log.device_type)}
                        <span className="text-xs text-gray-500">{log.browser}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {getStatusIcon(log.status)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleViewDetails(log)}
                        className="text-gray-400 hover:text-blue-600"
                        title="상세 보기"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Details Modal */}
      {showDetails && selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">활동 로그 상세</h2>
                {getStatusIcon(selectedLog.status)}
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">시간</label>
                  <p className="text-gray-900">{new Date(selectedLog.timestamp).toLocaleString('ko-KR')}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">소요 시간</label>
                  <p className="text-gray-900">{selectedLog.duration || '-'}ms</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">관리자</label>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium">{selectedLog.admin_name}</p>
                    <p className="text-sm text-gray-500">{selectedLog.admin_email}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">활동</label>
                  <div className="flex items-center gap-2">
                    {getActionIcon(selectedLog.action)}
                    <span className="text-gray-900">
                      {actionTypes.find(a => a.value === selectedLog.action)?.label || selectedLog.action}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">카테고리</label>
                  <p className="text-gray-900">{selectedLog.category}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">리소스</label>
                <p className="text-gray-900">{selectedLog.resource}</p>
                {selectedLog.resource_id && (
                  <p className="text-sm text-gray-500">ID: {selectedLog.resource_id}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">상세 내용</label>
                <p className="text-gray-900">{selectedLog.details}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">IP 주소</label>
                  <p className="text-gray-900">{selectedLog.ip_address}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">위치</label>
                  <p className="text-gray-900">{selectedLog.location || '-'}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">장치 정보</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {getDeviceIcon(selectedLog.device_type)}
                    <span className="text-gray-900 capitalize">{selectedLog.device_type}</span>
                  </div>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-900">{selectedLog.browser}</span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-900">{selectedLog.os}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">User Agent</label>
                <p className="text-xs text-gray-600 font-mono bg-gray-50 p-2 rounded">
                  {selectedLog.user_agent}
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowDetails(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                닫기
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}