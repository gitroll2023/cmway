'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Search,
  User,
  Mail,
  Phone,
  Shield,
  Calendar,
  Activity,
  Lock,
  Unlock,
  UserPlus,
  UserCheck,
  UserX,
  Key,
  Settings,
  AlertCircle,
  Check,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Admin {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'super_admin' | 'admin' | 'manager' | 'viewer';
  department: string;
  status: 'active' | 'inactive' | 'suspended';
  last_login: string;
  created_at: string;
  updated_at: string;
  login_count: number;
  permissions: string[];
}

// Mock data
const mockAdmins: Admin[] = [
  {
    id: '1',
    name: '김철수',
    email: 'admin@cmway.kr',
    phone: '010-1234-5678',
    role: 'super_admin',
    department: '경영지원팀',
    status: 'active',
    last_login: '2024-01-06T10:30:00Z',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2024-01-06T10:30:00Z',
    login_count: 523,
    permissions: ['all']
  },
  {
    id: '2',
    name: '이영희',
    email: 'manager@cmway.kr',
    phone: '010-2345-6789',
    role: 'admin',
    department: '마케팅팀',
    status: 'active',
    last_login: '2024-01-06T09:15:00Z',
    created_at: '2023-03-15T00:00:00Z',
    updated_at: '2024-01-06T09:15:00Z',
    login_count: 342,
    permissions: ['content', 'media', 'products', 'orders']
  },
  {
    id: '3',
    name: '박민수',
    email: 'support@cmway.kr',
    phone: '010-3456-7890',
    role: 'manager',
    department: '고객지원팀',
    status: 'active',
    last_login: '2024-01-05T14:20:00Z',
    created_at: '2023-06-01T00:00:00Z',
    updated_at: '2024-01-05T14:20:00Z',
    login_count: 189,
    permissions: ['orders', 'customers', 'support']
  },
  {
    id: '4',
    name: '정수진',
    email: 'content@cmway.kr',
    phone: '010-4567-8901',
    role: 'manager',
    department: '콘텐츠팀',
    status: 'inactive',
    last_login: '2023-12-20T11:00:00Z',
    created_at: '2023-07-10T00:00:00Z',
    updated_at: '2023-12-20T11:00:00Z',
    login_count: 145,
    permissions: ['content', 'media']
  },
  {
    id: '5',
    name: '최동훈',
    email: 'viewer@cmway.kr',
    phone: '010-5678-9012',
    role: 'viewer',
    department: '영업팀',
    status: 'suspended',
    last_login: '2023-11-15T10:00:00Z',
    created_at: '2023-08-01T00:00:00Z',
    updated_at: '2023-11-15T10:00:00Z',
    login_count: 67,
    permissions: ['view_only']
  }
];

const roles = [
  { value: 'super_admin', label: '최고 관리자', color: 'bg-red-100 text-red-700' },
  { value: 'admin', label: '관리자', color: 'bg-purple-100 text-purple-700' },
  { value: 'manager', label: '매니저', color: 'bg-blue-100 text-blue-700' },
  { value: 'viewer', label: '뷰어', color: 'bg-gray-100 text-gray-700' }
];

const departments = [
  '경영지원팀',
  '마케팅팀',
  '고객지원팀',
  '콘텐츠팀',
  '영업팀',
  '개발팀',
  '디자인팀'
];

const allPermissions = [
  { value: 'all', label: '전체 권한' },
  { value: 'content', label: '콘텐츠 관리' },
  { value: 'media', label: '미디어 관리' },
  { value: 'products', label: '상품 관리' },
  { value: 'orders', label: '주문 관리' },
  { value: 'customers', label: '고객 관리' },
  { value: 'support', label: '고객 지원' },
  { value: 'analytics', label: '분석 대시보드' },
  { value: 'settings', label: '설정 관리' },
  { value: 'admins', label: '관리자 관리' },
  { value: 'view_only', label: '읽기 전용' }
];

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>(mockAdmins);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [formData, setFormData] = useState<Partial<Admin>>({
    name: '',
    email: '',
    phone: '',
    role: 'viewer',
    department: '경영지원팀',
    status: 'active',
    permissions: []
  });

  const filteredAdmins = admins.filter(admin => {
    const matchesSearch = 
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || admin.role === filterRole;
    const matchesStatus = filterStatus === 'all' || admin.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const stats = {
    total: admins.length,
    active: admins.filter(a => a.status === 'active').length,
    inactive: admins.filter(a => a.status === 'inactive').length,
    suspended: admins.filter(a => a.status === 'suspended').length,
    superAdmins: admins.filter(a => a.role === 'super_admin').length,
    recentLogins: admins.filter(a => {
      const lastLogin = new Date(a.last_login);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - lastLogin.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    }).length
  };

  const handleEdit = (admin: Admin) => {
    setEditingAdmin(admin);
    setFormData(admin);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingAdmin(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'viewer',
      department: '경영지원팀',
      status: 'active',
      permissions: []
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (editingAdmin) {
      setAdmins(admins.map(admin =>
        admin.id === editingAdmin.id
          ? { ...admin, ...formData, updated_at: new Date().toISOString() }
          : admin
      ));
      toast.success('관리자 정보가 수정되었습니다.');
    } else {
      const newAdmin: Admin = {
        id: Date.now().toString(),
        name: formData.name || '',
        email: formData.email || '',
        phone: formData.phone || '',
        role: formData.role as Admin['role'],
        department: formData.department || '',
        status: formData.status as Admin['status'],
        permissions: formData.permissions || [],
        last_login: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        login_count: 0
      };
      setAdmins([...admins, newAdmin]);
      toast.success('새 관리자가 추가되었습니다.');
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('이 관리자를 삭제하시겠습니까?')) {
      setAdmins(admins.filter(admin => admin.id !== id));
      toast.success('관리자가 삭제되었습니다.');
    }
  };

  const handleStatusChange = (admin: Admin, status: Admin['status']) => {
    setAdmins(admins.map(a =>
      a.id === admin.id ? { ...a, status, updated_at: new Date().toISOString() } : a
    ));
    toast.success(`관리자 상태가 ${status === 'active' ? '활성화' : status === 'inactive' ? '비활성화' : '정지'}되었습니다.`);
  };

  const handleResetPassword = (admin: Admin) => {
    setSelectedAdmin(admin);
    setShowPasswordModal(true);
  };

  const sendPasswordReset = () => {
    toast.success(`${selectedAdmin?.email}로 비밀번호 재설정 링크를 발송했습니다.`);
    setShowPasswordModal(false);
    setSelectedAdmin(null);
  };

  const getRoleBadge = (role: string) => {
    const r = roles.find(r => r.value === role);
    return r ? (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${r.color}`}>
        {r.label}
      </span>
    ) : null;
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 1) {
      const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
      if (diffHours < 1) {
        const diffMinutes = Math.ceil(diffTime / (1000 * 60));
        return `${diffMinutes}분 전`;
      }
      return `${diffHours}시간 전`;
    } else if (diffDays === 1) {
      return '어제';
    } else if (diffDays < 7) {
      return `${diffDays}일 전`;
    }
    return date.toLocaleDateString('ko-KR');
  };

  const handlePermissionToggle = (permission: string) => {
    if (permission === 'all') {
      setFormData({
        ...formData,
        permissions: formData.permissions?.includes('all') ? [] : ['all']
      });
    } else {
      const currentPermissions = formData.permissions || [];
      const newPermissions = currentPermissions.includes(permission)
        ? currentPermissions.filter(p => p !== permission)
        : [...currentPermissions.filter(p => p !== 'all'), permission];
      setFormData({ ...formData, permissions: newPermissions });
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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">관리자 계정 관리</h1>
            <p className="text-gray-600">관리자 계정과 권한을 관리합니다.</p>
          </div>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            관리자 추가
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">전체 관리자</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <User className="w-8 h-8 text-emerald-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">활성</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <UserCheck className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">비활성</p>
                <p className="text-2xl font-bold text-gray-600">{stats.inactive}</p>
              </div>
              <UserX className="w-8 h-8 text-gray-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">정지</p>
                <p className="text-2xl font-bold text-red-600">{stats.suspended}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">최고 관리자</p>
                <p className="text-2xl font-bold text-purple-600">{stats.superAdmins}</p>
              </div>
              <Shield className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">최근 로그인</p>
                <p className="text-2xl font-bold text-blue-600">{stats.recentLogins}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-600" />
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
                  placeholder="이름, 이메일, 부서로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
            
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">모든 역할</option>
              {roles.map(role => (
                <option key={role.value} value={role.value}>{role.label}</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">모든 상태</option>
              <option value="active">활성</option>
              <option value="inactive">비활성</option>
              <option value="suspended">정지</option>
            </select>
          </div>
        </div>

        {/* Admins List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    관리자
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    역할/부서
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    마지막 로그인
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    로그인 횟수
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    가입일
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAdmins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{admin.name}</div>
                          <div className="text-sm text-gray-500">{admin.email}</div>
                          <div className="text-xs text-gray-400">{admin.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        {getRoleBadge(admin.role)}
                        <div className="text-sm text-gray-500 mt-1">{admin.department}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {getStatusBadge(admin.status)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="text-sm text-gray-900">{formatDate(admin.last_login)}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="text-sm text-gray-900">{admin.login_count}회</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="text-sm text-gray-900">
                        {new Date(admin.created_at).toLocaleDateString('ko-KR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {admin.status === 'active' ? (
                          <button
                            onClick={() => handleStatusChange(admin, 'inactive')}
                            className="text-gray-400 hover:text-orange-600"
                            title="비활성화"
                          >
                            <Lock className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStatusChange(admin, 'active')}
                            className="text-gray-400 hover:text-green-600"
                            title="활성화"
                          >
                            <Unlock className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleResetPassword(admin)}
                          className="text-gray-400 hover:text-purple-600"
                          title="비밀번호 재설정"
                        >
                          <Key className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(admin)}
                          className="text-gray-400 hover:text-blue-600"
                          title="수정"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(admin.id)}
                          className="text-gray-400 hover:text-red-600"
                          title="삭제"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editingAdmin ? '관리자 수정' : '관리자 추가'}
              </h2>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">이름</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">이메일</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">전화번호</label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">부서</label>
                  <select
                    value={formData.department || ''}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">역할</label>
                  <select
                    value={formData.role || ''}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as Admin['role'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {roles.map(role => (
                      <option key={role.value} value={role.value}>{role.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">상태</label>
                  <select
                    value={formData.status || ''}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Admin['status'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="active">활성</option>
                    <option value="inactive">비활성</option>
                    <option value="suspended">정지</option>
                  </select>
                </div>
              </div>

              {/* Permissions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">권한</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {allPermissions.map(permission => (
                    <label key={permission.value} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.permissions?.includes(permission.value) || false}
                        onChange={() => handlePermissionToggle(permission.value)}
                        className="rounded border-gray-300 text-emerald-600"
                      />
                      <span className="text-sm text-gray-700">{permission.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                저장
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Password Reset Modal */}
      {showPasswordModal && selectedAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-md w-full"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">비밀번호 재설정</h2>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Key className="w-8 h-8 text-emerald-600" />
                <div>
                  <p className="text-gray-900 font-medium">{selectedAdmin.name}</p>
                  <p className="text-sm text-gray-500">{selectedAdmin.email}</p>
                </div>
              </div>
              <p className="text-gray-600">
                이 관리자의 이메일로 비밀번호 재설정 링크를 발송하시겠습니까?
              </p>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={sendPasswordReset}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                링크 발송
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}