'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users as UsersIcon,
  Search,
  Filter,
  Download,
  UserPlus,
  Mail,
  Phone,
  Calendar,
  Shield,
  MoreVertical,
  Edit2,
  Trash2,
  AlertCircle
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  group: string;
  status: 'active' | 'inactive' | 'suspended';
  joinDate: string;
  lastLogin: string;
  totalOrders: number;
  totalSpent: number;
}

const mockUsers: User[] = [
  {
    id: '1',
    name: '김철수',
    email: 'kim@example.com',
    phone: '010-1234-5678',
    group: '일반회원',
    status: 'active',
    joinDate: '2024-01-15',
    lastLogin: '2025-01-05',
    totalOrders: 12,
    totalSpent: 458000
  },
  {
    id: '2',
    name: '이영희',
    email: 'lee@example.com',
    phone: '010-2345-6789',
    group: 'VIP',
    status: 'active',
    joinDate: '2023-06-20',
    lastLogin: '2025-01-04',
    totalOrders: 45,
    totalSpent: 2340000
  },
  {
    id: '3',
    name: '박민수',
    email: 'park@example.com',
    phone: '010-3456-7890',
    group: '일반회원',
    status: 'inactive',
    joinDate: '2023-11-10',
    lastLogin: '2024-10-15',
    totalOrders: 3,
    totalSpent: 120000
  }
];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGroup, setFilterGroup] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchTerm || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);
    const matchesGroup = !filterGroup || user.group === filterGroup;
    const matchesStatus = !filterStatus || user.status === filterStatus;
    
    return matchesSearch && matchesGroup && matchesStatus;
  });

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    vip: users.filter(u => u.group === 'VIP').length,
    today: users.filter(u => u.lastLogin === new Date().toISOString().split('T')[0]).length
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedUsers(filteredUsers.map(u => u.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">활성</span>;
      case 'inactive':
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">비활성</span>;
      case 'suspended':
        return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">정지</span>;
      default:
        return null;
    }
  };

  const getGroupBadge = (group: string) => {
    switch (group) {
      case 'VIP':
        return <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">VIP</span>;
      case 'VVIP':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">VVIP</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">{group}</span>;
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">회원 관리</h1>
          <p className="text-gray-600">회원 정보를 조회하고 관리합니다.</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <UsersIcon className="w-8 h-8 text-emerald-600" />
              <span className="text-2xl font-bold text-gray-900">{stats.total}</span>
            </div>
            <p className="text-sm text-gray-600">전체 회원</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <Shield className="w-8 h-8 text-green-600" />
              <span className="text-2xl font-bold text-gray-900">{stats.active}</span>
            </div>
            <p className="text-sm text-gray-600">활성 회원</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold text-xs">VIP</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.vip}</span>
            </div>
            <p className="text-sm text-gray-600">VIP 회원</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">{stats.today}</span>
            </div>
            <p className="text-sm text-gray-600">오늘 접속</p>
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
              value={filterGroup}
              onChange={(e) => setFilterGroup(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">모든 그룹</option>
              <option value="일반회원">일반회원</option>
              <option value="VIP">VIP</option>
              <option value="VVIP">VVIP</option>
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">모든 상태</option>
              <option value="active">활성</option>
              <option value="inactive">비활성</option>
              <option value="suspended">정지</option>
            </select>
            
            <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              회원 추가
            </button>
            
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              내보내기
            </button>
          </div>
        </div>

        {/* Selected Actions */}
        {selectedUsers.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              <span className="text-blue-700">{selectedUsers.length}명 선택됨</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 bg-white text-blue-600 rounded border border-blue-300 hover:bg-blue-50 text-sm">
                메일 발송
              </button>
              <button className="px-3 py-1 bg-white text-blue-600 rounded border border-blue-300 hover:bg-blue-50 text-sm">
                그룹 변경
              </button>
              <button className="px-3 py-1 bg-white text-red-600 rounded border border-red-300 hover:bg-red-50 text-sm">
                삭제
              </button>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    회원 정보
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    연락처
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    그룹
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    가입일
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    구매 정보
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">최근 접속: {user.lastLogin}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center gap-1">
                        <Mail className="w-4 h-4 text-gray-400" />
                        {user.email}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Phone className="w-4 h-4 text-gray-400" />
                        {user.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {getGroupBadge(user.group)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-900">{user.joinDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-900">{user.totalOrders}건</div>
                      <div className="text-sm text-gray-500">₩{user.totalSpent.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button className="text-gray-400 hover:text-emerald-600">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="text-gray-400 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
}