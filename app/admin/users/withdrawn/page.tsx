'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  UserX,
  Search,
  Calendar,
  Mail,
  Phone,
  FileText,
  Download,
  RefreshCw,
  Trash2,
  AlertCircle
} from 'lucide-react';

interface WithdrawnUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  withdrawnDate: string;
  reason: string;
  totalOrders: number;
  totalSpent: number;
  status: 'withdrawn' | 'deleted';
  canRestore: boolean;
}

const mockWithdrawnUsers: WithdrawnUser[] = [
  {
    id: '1',
    name: '김*수',
    email: 'k***@example.com',
    phone: '010-****-5678',
    joinDate: '2023-03-15',
    withdrawnDate: '2024-12-20',
    reason: '서비스 불만족',
    totalOrders: 5,
    totalSpent: 234000,
    status: 'withdrawn',
    canRestore: true
  },
  {
    id: '2',
    name: '이*희',
    email: 'l***@example.com',
    phone: '010-****-6789',
    joinDate: '2022-11-10',
    withdrawnDate: '2024-11-15',
    reason: '개인 사정',
    totalOrders: 12,
    totalSpent: 890000,
    status: 'withdrawn',
    canRestore: true
  },
  {
    id: '3',
    name: '박*호',
    email: 'p***@example.com',
    phone: '010-****-7890',
    joinDate: '2023-01-20',
    withdrawnDate: '2024-10-01',
    reason: '이용 빈도 낮음',
    totalOrders: 2,
    totalSpent: 56000,
    status: 'deleted',
    canRestore: false
  }
];

const withdrawReasons = [
  '서비스 불만족',
  '개인 사정',
  '이용 빈도 낮음',
  '다른 서비스 이용',
  '가격 불만족',
  '기타'
];

export default function WithdrawnUsersPage() {
  const [users, setUsers] = useState<WithdrawnUser[]>(mockWithdrawnUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterReason, setFilterReason] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchTerm || 
      user.name.includes(searchTerm) ||
      user.email.includes(searchTerm) ||
      user.phone.includes(searchTerm);
    const matchesReason = !filterReason || user.reason === filterReason;
    
    let matchesPeriod = true;
    if (filterPeriod !== 'all') {
      const withdrawnDate = new Date(user.withdrawnDate);
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - withdrawnDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (filterPeriod === '7days') matchesPeriod = daysDiff <= 7;
      else if (filterPeriod === '30days') matchesPeriod = daysDiff <= 30;
      else if (filterPeriod === '90days') matchesPeriod = daysDiff <= 90;
    }
    
    return matchesSearch && matchesReason && matchesPeriod;
  });

  const stats = {
    total: users.length,
    thisMonth: users.filter(u => {
      const withdrawnDate = new Date(u.withdrawnDate);
      const now = new Date();
      return withdrawnDate.getMonth() === now.getMonth() && 
             withdrawnDate.getFullYear() === now.getFullYear();
    }).length,
    canRestore: users.filter(u => u.canRestore).length,
    deleted: users.filter(u => u.status === 'deleted').length
  };

  const reasonStats = withdrawReasons.map(reason => ({
    reason,
    count: users.filter(u => u.reason === reason).length
  })).sort((a, b) => b.count - a.count);

  const handleRestore = (userId: string) => {
    if (confirm('이 회원을 복구하시겠습니까?')) {
      setUsers(users.filter(u => u.id !== userId));
      alert('회원이 복구되었습니다.');
    }
  };

  const handlePermanentDelete = (userId: string) => {
    if (confirm('이 회원 정보를 영구 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      setUsers(users.map(u => 
        u.id === userId ? { ...u, status: 'deleted', canRestore: false } : u
      ));
    }
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">탈퇴 회원 관리</h1>
          <p className="text-gray-600">탈퇴한 회원 정보를 조회하고 관리합니다.</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <UserX className="w-8 h-8 text-gray-400" />
              <span className="text-2xl font-bold text-gray-900">{stats.total}</span>
            </div>
            <p className="text-sm text-gray-600">전체 탈퇴 회원</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-8 h-8 text-red-500" />
              <span className="text-2xl font-bold text-gray-900">{stats.thisMonth}</span>
            </div>
            <p className="text-sm text-gray-600">이번 달 탈퇴</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <RefreshCw className="w-8 h-8 text-blue-500" />
              <span className="text-2xl font-bold text-gray-900">{stats.canRestore}</span>
            </div>
            <p className="text-sm text-gray-600">복구 가능</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <Trash2 className="w-8 h-8 text-gray-400" />
              <span className="text-2xl font-bold text-gray-900">{stats.deleted}</span>
            </div>
            <p className="text-sm text-gray-600">영구 삭제</p>
          </div>
        </div>

        {/* Withdrawal Reasons */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">탈퇴 사유 통계</h2>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {reasonStats.map(({ reason, count }) => (
              <div key={reason} className="text-center">
                <div className="text-2xl font-bold text-gray-900">{count}</div>
                <div className="text-sm text-gray-600">{reason}</div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-emerald-600 h-2 rounded-full"
                    style={{ width: `${(count / users.length) * 100}%` }}
                  />
                </div>
              </div>
            ))}
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
                  placeholder="이름, 이메일, 전화번호로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
            
            <select
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">전체 기간</option>
              <option value="7days">최근 7일</option>
              <option value="30days">최근 30일</option>
              <option value="90days">최근 90일</option>
            </select>
            
            <select
              value={filterReason}
              onChange={(e) => setFilterReason(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">모든 사유</option>
              {withdrawReasons.map(reason => (
                <option key={reason} value={reason}>{reason}</option>
              ))}
            </select>
            
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              내보내기
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    회원 정보
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    연락처
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    가입일
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    탈퇴일
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    탈퇴 사유
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    구매 정보
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
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">ID: {user.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {user.email}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {user.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-900">{user.joinDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-900">{user.withdrawnDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                        {user.reason}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-900">{user.totalOrders}건</div>
                      <div className="text-sm text-gray-500">₩{user.totalSpent.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {user.status === 'withdrawn' ? (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">
                          탈퇴
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                          삭제됨
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        {user.canRestore && (
                          <button
                            onClick={() => handleRestore(user.id)}
                            className="text-blue-600 hover:text-blue-700"
                            title="복구"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                        )}
                        {user.status === 'withdrawn' && (
                          <button
                            onClick={() => handlePermanentDelete(user.id)}
                            className="text-red-600 hover:text-red-700"
                            title="영구 삭제"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          className="text-gray-400 hover:text-gray-600"
                          title="상세 보기"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">개인정보 처리 안내</p>
              <ul className="space-y-1 text-xs">
                <li>• 탈퇴 후 30일간 복구 가능하며, 이후 개인정보는 자동으로 암호화 처리됩니다.</li>
                <li>• 전자상거래법에 따라 거래 기록은 5년간 보관됩니다.</li>
                <li>• 영구 삭제된 정보는 복구할 수 없습니다.</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}