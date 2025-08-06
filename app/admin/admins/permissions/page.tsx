'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield,
  Users,
  Lock,
  Unlock,
  Key,
  Settings,
  Eye,
  Edit2,
  FileText,
  ShoppingCart,
  Package,
  BarChart3,
  Megaphone,
  Image,
  User,
  HelpCircle,
  MessageSquare,
  AlertCircle,
  Check,
  X,
  ChevronRight,
  Plus,
  Trash2,
  Copy,
  Save
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Permission {
  id: string;
  name: string;
  key: string;
  description: string;
  category: string;
  icon: any;
  subPermissions?: SubPermission[];
}

interface SubPermission {
  id: string;
  name: string;
  key: string;
  description: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  level: number;
  permissions: string[];
  userCount: number;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

const permissionCategories = [
  {
    name: '콘텐츠 관리',
    icon: FileText,
    permissions: [
      {
        id: 'content.notices',
        name: '공지사항',
        key: 'notices',
        description: '공지사항 작성, 수정, 삭제',
        category: '콘텐츠 관리',
        icon: Megaphone,
        subPermissions: [
          { id: 'content.notices.view', name: '조회', key: 'view', description: '공지사항 조회' },
          { id: 'content.notices.create', name: '작성', key: 'create', description: '공지사항 작성' },
          { id: 'content.notices.edit', name: '수정', key: 'edit', description: '공지사항 수정' },
          { id: 'content.notices.delete', name: '삭제', key: 'delete', description: '공지사항 삭제' }
        ]
      },
      {
        id: 'content.news',
        name: '뉴스/이벤트',
        key: 'news',
        description: '뉴스 및 이벤트 관리',
        category: '콘텐츠 관리',
        icon: FileText,
        subPermissions: [
          { id: 'content.news.view', name: '조회', key: 'view', description: '뉴스/이벤트 조회' },
          { id: 'content.news.create', name: '작성', key: 'create', description: '뉴스/이벤트 작성' },
          { id: 'content.news.edit', name: '수정', key: 'edit', description: '뉴스/이벤트 수정' },
          { id: 'content.news.delete', name: '삭제', key: 'delete', description: '뉴스/이벤트 삭제' }
        ]
      },
      {
        id: 'content.faq',
        name: 'FAQ',
        key: 'faq',
        description: '자주 묻는 질문 관리',
        category: '콘텐츠 관리',
        icon: HelpCircle,
        subPermissions: [
          { id: 'content.faq.view', name: '조회', key: 'view', description: 'FAQ 조회' },
          { id: 'content.faq.create', name: '작성', key: 'create', description: 'FAQ 작성' },
          { id: 'content.faq.edit', name: '수정', key: 'edit', description: 'FAQ 수정' },
          { id: 'content.faq.delete', name: '삭제', key: 'delete', description: 'FAQ 삭제' }
        ]
      }
    ]
  },
  {
    name: '미디어 관리',
    icon: Image,
    permissions: [
      {
        id: 'media.files',
        name: '파일 관리',
        key: 'files',
        description: '이미지, 동영상, 문서 파일 관리',
        category: '미디어 관리',
        icon: Image,
        subPermissions: [
          { id: 'media.files.view', name: '조회', key: 'view', description: '파일 조회' },
          { id: 'media.files.upload', name: '업로드', key: 'upload', description: '파일 업로드' },
          { id: 'media.files.edit', name: '수정', key: 'edit', description: '파일 정보 수정' },
          { id: 'media.files.delete', name: '삭제', key: 'delete', description: '파일 삭제' }
        ]
      }
    ]
  },
  {
    name: '상품 관리',
    icon: Package,
    permissions: [
      {
        id: 'products.management',
        name: '상품 관리',
        key: 'products',
        description: '상품 등록, 수정, 삭제',
        category: '상품 관리',
        icon: Package,
        subPermissions: [
          { id: 'products.management.view', name: '조회', key: 'view', description: '상품 조회' },
          { id: 'products.management.create', name: '등록', key: 'create', description: '상품 등록' },
          { id: 'products.management.edit', name: '수정', key: 'edit', description: '상품 수정' },
          { id: 'products.management.delete', name: '삭제', key: 'delete', description: '상품 삭제' }
        ]
      },
      {
        id: 'products.inventory',
        name: '재고 관리',
        key: 'inventory',
        description: '재고 조회 및 조정',
        category: '상품 관리',
        icon: Package,
        subPermissions: [
          { id: 'products.inventory.view', name: '조회', key: 'view', description: '재고 조회' },
          { id: 'products.inventory.adjust', name: '조정', key: 'adjust', description: '재고 조정' }
        ]
      }
    ]
  },
  {
    name: '주문 관리',
    icon: ShoppingCart,
    permissions: [
      {
        id: 'orders.management',
        name: '주문 관리',
        key: 'orders',
        description: '주문 조회 및 처리',
        category: '주문 관리',
        icon: ShoppingCart,
        subPermissions: [
          { id: 'orders.management.view', name: '조회', key: 'view', description: '주문 조회' },
          { id: 'orders.management.process', name: '처리', key: 'process', description: '주문 처리' },
          { id: 'orders.management.cancel', name: '취소', key: 'cancel', description: '주문 취소' },
          { id: 'orders.management.refund', name: '환불', key: 'refund', description: '환불 처리' }
        ]
      }
    ]
  },
  {
    name: '고객 관리',
    icon: Users,
    permissions: [
      {
        id: 'customers.management',
        name: '고객 관리',
        key: 'customers',
        description: '고객 정보 조회 및 관리',
        category: '고객 관리',
        icon: Users,
        subPermissions: [
          { id: 'customers.management.view', name: '조회', key: 'view', description: '고객 정보 조회' },
          { id: 'customers.management.edit', name: '수정', key: 'edit', description: '고객 정보 수정' },
          { id: 'customers.management.message', name: '메시지', key: 'message', description: '메시지 발송' }
        ]
      },
      {
        id: 'customers.support',
        name: '고객 지원',
        key: 'support',
        description: '고객 문의 및 지원',
        category: '고객 관리',
        icon: MessageSquare,
        subPermissions: [
          { id: 'customers.support.view', name: '조회', key: 'view', description: '문의 조회' },
          { id: 'customers.support.respond', name: '답변', key: 'respond', description: '문의 답변' }
        ]
      }
    ]
  },
  {
    name: '분석',
    icon: BarChart3,
    permissions: [
      {
        id: 'analytics.dashboard',
        name: '대시보드',
        key: 'dashboard',
        description: '분석 대시보드 접근',
        category: '분석',
        icon: BarChart3,
        subPermissions: [
          { id: 'analytics.dashboard.view', name: '조회', key: 'view', description: '대시보드 조회' },
          { id: 'analytics.dashboard.export', name: '내보내기', key: 'export', description: '데이터 내보내기' }
        ]
      }
    ]
  },
  {
    name: '시스템 관리',
    icon: Settings,
    permissions: [
      {
        id: 'system.admins',
        name: '관리자 관리',
        key: 'admins',
        description: '관리자 계정 및 권한 관리',
        category: '시스템 관리',
        icon: User,
        subPermissions: [
          { id: 'system.admins.view', name: '조회', key: 'view', description: '관리자 조회' },
          { id: 'system.admins.create', name: '생성', key: 'create', description: '관리자 생성' },
          { id: 'system.admins.edit', name: '수정', key: 'edit', description: '관리자 수정' },
          { id: 'system.admins.delete', name: '삭제', key: 'delete', description: '관리자 삭제' }
        ]
      },
      {
        id: 'system.settings',
        name: '설정',
        key: 'settings',
        description: '시스템 설정 관리',
        category: '시스템 관리',
        icon: Settings,
        subPermissions: [
          { id: 'system.settings.view', name: '조회', key: 'view', description: '설정 조회' },
          { id: 'system.settings.edit', name: '수정', key: 'edit', description: '설정 수정' }
        ]
      }
    ]
  }
];

const mockRoles: Role[] = [
  {
    id: '1',
    name: '최고 관리자',
    description: '모든 권한을 가진 최고 관리자',
    level: 100,
    permissions: ['*'],
    userCount: 1,
    isSystem: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: '관리자',
    description: '일반 관리 권한',
    level: 80,
    permissions: [
      'content.*',
      'media.*',
      'products.*',
      'orders.*',
      'customers.management.view',
      'customers.support.*',
      'analytics.dashboard.view'
    ],
    userCount: 3,
    isSystem: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: '콘텐츠 매니저',
    description: '콘텐츠 및 미디어 관리',
    level: 60,
    permissions: [
      'content.*',
      'media.*',
      'analytics.dashboard.view'
    ],
    userCount: 5,
    isSystem: false,
    createdAt: '2023-03-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    name: '고객지원팀',
    description: '고객 문의 및 주문 처리',
    level: 50,
    permissions: [
      'orders.management.view',
      'orders.management.process',
      'customers.management.view',
      'customers.support.*'
    ],
    userCount: 8,
    isSystem: false,
    createdAt: '2023-05-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '5',
    name: '뷰어',
    description: '읽기 전용 권한',
    level: 10,
    permissions: [
      'content.*.view',
      'media.files.view',
      'products.*.view',
      'orders.management.view',
      'customers.management.view',
      'analytics.dashboard.view'
    ],
    userCount: 12,
    isSystem: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  }
];

export default function PermissionsPage() {
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [selectedRole, setSelectedRole] = useState<Role | null>(roles[0]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState<Partial<Role>>({
    name: '',
    description: '',
    level: 50,
    permissions: []
  });
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const handleCreateRole = () => {
    setEditingRole(null);
    setFormData({
      name: '',
      description: '',
      level: 50,
      permissions: []
    });
    setShowCreateModal(true);
  };

  const handleEditRole = (role: Role) => {
    if (role.isSystem) {
      toast.error('시스템 역할은 수정할 수 없습니다.');
      return;
    }
    setEditingRole(role);
    setFormData(role);
    setShowCreateModal(true);
  };

  const handleSaveRole = () => {
    if (editingRole) {
      setRoles(roles.map(r =>
        r.id === editingRole.id
          ? { ...r, ...formData, updatedAt: new Date().toISOString() }
          : r
      ));
      toast.success('역할이 수정되었습니다.');
    } else {
      const newRole: Role = {
        id: Date.now().toString(),
        name: formData.name || '',
        description: formData.description || '',
        level: formData.level || 50,
        permissions: formData.permissions || [],
        userCount: 0,
        isSystem: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setRoles([...roles, newRole]);
      toast.success('새 역할이 생성되었습니다.');
    }
    setShowCreateModal(false);
  };

  const handleDeleteRole = (role: Role) => {
    if (role.isSystem) {
      toast.error('시스템 역할은 삭제할 수 없습니다.');
      return;
    }
    if (role.userCount > 0) {
      toast.error('사용 중인 역할은 삭제할 수 없습니다.');
      return;
    }
    if (confirm(`'${role.name}' 역할을 삭제하시겠습니까?`)) {
      setRoles(roles.filter(r => r.id !== role.id));
      if (selectedRole?.id === role.id) {
        setSelectedRole(roles[0]);
      }
      toast.success('역할이 삭제되었습니다.');
    }
  };

  const handleDuplicateRole = (role: Role) => {
    const newRole: Role = {
      ...role,
      id: Date.now().toString(),
      name: `${role.name} (복사본)`,
      isSystem: false,
      userCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setRoles([...roles, newRole]);
    toast.success('역할이 복제되었습니다.');
  };

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryName)
        ? prev.filter(c => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  const hasPermission = (role: Role | null, permissionKey: string): boolean => {
    if (!role) return false;
    if (role.permissions.includes('*')) return true;
    return role.permissions.some(p => {
      if (p === permissionKey) return true;
      if (p.endsWith('*')) {
        const prefix = p.slice(0, -1);
        return permissionKey.startsWith(prefix);
      }
      return false;
    });
  };

  const togglePermission = (permissionKey: string) => {
    if (!formData.permissions) return;
    
    const newPermissions = [...formData.permissions];
    const index = newPermissions.indexOf(permissionKey);
    
    if (index > -1) {
      newPermissions.splice(index, 1);
    } else {
      newPermissions.push(permissionKey);
    }
    
    setFormData({ ...formData, permissions: newPermissions });
  };

  const getLevelBadge = (level: number) => {
    if (level >= 90) return 'bg-red-100 text-red-700';
    if (level >= 70) return 'bg-purple-100 text-purple-700';
    if (level >= 50) return 'bg-blue-100 text-blue-700';
    if (level >= 30) return 'bg-green-100 text-green-700';
    return 'bg-gray-100 text-gray-700';
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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">권한 관리</h1>
            <p className="text-gray-600">역할별 권한을 설정하고 관리합니다.</p>
          </div>
          <button
            onClick={handleCreateRole}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            역할 생성
          </button>
        </div>

        <div className="flex gap-6">
          {/* Roles List */}
          <div className="w-80 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">역할 목록</h2>
            </div>
            <div className="p-4 space-y-2">
              {roles.map(role => (
                <div
                  key={role.id}
                  onClick={() => setSelectedRole(role)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedRole?.id === role.id
                      ? 'bg-emerald-50 border border-emerald-200'
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-emerald-600" />
                      <span className="font-medium text-gray-900">{role.name}</span>
                    </div>
                    {role.isSystem && (
                      <Lock className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mb-2">{role.description}</p>
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelBadge(role.level)}`}>
                      Level {role.level}
                    </span>
                    <span className="text-xs text-gray-500">{role.userCount}명 사용</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Permission Details */}
          <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200">
            {selectedRole ? (
              <>
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-1">{selectedRole.name}</h2>
                      <p className="text-gray-600">{selectedRole.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {!selectedRole.isSystem && (
                        <>
                          <button
                            onClick={() => handleEditRole(selectedRole)}
                            className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1 text-sm"
                          >
                            <Edit2 className="w-3 h-3" />
                            수정
                          </button>
                          <button
                            onClick={() => handleDuplicateRole(selectedRole)}
                            className="px-3 py-1.5 bg-purple-600 text-white rounded hover:bg-purple-700 flex items-center gap-1 text-sm"
                          >
                            <Copy className="w-3 h-3" />
                            복제
                          </button>
                          <button
                            onClick={() => handleDeleteRole(selectedRole)}
                            className="px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-1 text-sm"
                          >
                            <Trash2 className="w-3 h-3" />
                            삭제
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {selectedRole.permissions.includes('*') ? (
                    <div className="text-center py-8">
                      <Shield className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                      <p className="text-lg font-medium text-gray-900">전체 권한</p>
                      <p className="text-gray-500">이 역할은 모든 권한을 가지고 있습니다.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {permissionCategories.map(category => (
                        <div key={category.name} className="border border-gray-200 rounded-lg">
                          <button
                            onClick={() => toggleCategory(category.name)}
                            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50"
                          >
                            <div className="flex items-center gap-3">
                              <category.icon className="w-5 h-5 text-gray-600" />
                              <span className="font-medium text-gray-900">{category.name}</span>
                            </div>
                            <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${
                              expandedCategories.includes(category.name) ? 'rotate-90' : ''
                            }`} />
                          </button>
                          
                          {expandedCategories.includes(category.name) && (
                            <div className="p-4 border-t border-gray-200 space-y-3">
                              {category.permissions.map(permission => (
                                <div key={permission.id} className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <permission.icon className="w-4 h-4 text-gray-500" />
                                      <span className="font-medium text-gray-700">{permission.name}</span>
                                    </div>
                                    {hasPermission(selectedRole, permission.id) ? (
                                      <Check className="w-4 h-4 text-green-600" />
                                    ) : (
                                      <X className="w-4 h-4 text-gray-300" />
                                    )}
                                  </div>
                                  <div className="ml-6 grid grid-cols-2 md:grid-cols-4 gap-2">
                                    {permission.subPermissions?.map(sub => (
                                      <div key={sub.id} className="flex items-center gap-1">
                                        {hasPermission(selectedRole, sub.id) ? (
                                          <Check className="w-3 h-3 text-green-600" />
                                        ) : (
                                          <X className="w-3 h-3 text-gray-300" />
                                        )}
                                        <span className="text-sm text-gray-600">{sub.name}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Shield className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">역할을 선택하세요</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Create/Edit Role Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editingRole ? '역할 수정' : '역할 생성'}
              </h2>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">역할 이름</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">권한 레벨</label>
                  <input
                    type="number"
                    min="0"
                    max="99"
                    value={formData.level || 50}
                    onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">설명</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">권한 설정</label>
                <div className="space-y-3 max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4">
                  {permissionCategories.map(category => (
                    <div key={category.name} className="space-y-2">
                      <div className="font-medium text-gray-900 flex items-center gap-2">
                        <category.icon className="w-4 h-4" />
                        {category.name}
                      </div>
                      {category.permissions.map(permission => (
                        <div key={permission.id} className="ml-6 space-y-1">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={hasPermission({ permissions: formData.permissions || [] } as Role, permission.id)}
                              onChange={() => togglePermission(permission.id)}
                              className="rounded border-gray-300 text-emerald-600"
                            />
                            <span className="text-sm text-gray-700">{permission.name} (전체)</span>
                          </label>
                          <div className="ml-6 grid grid-cols-2 gap-2">
                            {permission.subPermissions?.map(sub => (
                              <label key={sub.id} className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={hasPermission({ permissions: formData.permissions || [] } as Role, sub.id)}
                                  onChange={() => togglePermission(sub.id)}
                                  className="rounded border-gray-300 text-emerald-600"
                                />
                                <span className="text-xs text-gray-600">{sub.name}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleSaveRole}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                저장
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}