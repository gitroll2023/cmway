'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Search,
  Eye,
  EyeOff,
  Calendar,
  FileText,
  Globe,
  Settings,
  Shield,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useCMSStore } from '@/store/cms';

interface PageData {
  id: string;
  slug: string;
  template: 'default' | 'landing' | 'product' | 'blog' | 'custom';
  page_type: 'static' | 'dynamic' | 'system';
  meta: {
    title: { ko: string; en: string };
    description: { ko: string; en: string };
    keywords: string[];
  };
  settings: {
    show_header: boolean;
    show_footer: boolean;
    show_breadcrumb: boolean;
    container_width: 'default' | 'wide' | 'full';
  };
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  published_at?: string;
  created_at: string;
  updated_at: string;
}

// Mock data for demonstration
const mockPages: PageData[] = [
  {
    id: '1',
    slug: 'about',
    template: 'default',
    page_type: 'static',
    meta: {
      title: { ko: '회사소개', en: 'About Us' },
      description: { ko: '씨엠웨이 회사 소개 페이지', en: 'CMWay company introduction page' },
      keywords: ['회사소개', '씨엠웨이', 'CMWay']
    },
    settings: {
      show_header: true,
      show_footer: true,
      show_breadcrumb: true,
      container_width: 'default'
    },
    status: 'published',
    published_at: '2024-01-15T00:00:00Z',
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z'
  },
  {
    id: '2',
    slug: 'privacy-policy',
    template: 'default',
    page_type: 'system',
    meta: {
      title: { ko: '개인정보처리방침', en: 'Privacy Policy' },
      description: { ko: '개인정보처리방침 안내', en: 'Privacy policy information' },
      keywords: ['개인정보', 'privacy']
    },
    settings: {
      show_header: true,
      show_footer: true,
      show_breadcrumb: false,
      container_width: 'default'
    },
    status: 'published',
    published_at: '2024-01-01T00:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

export default function PagesPage() {
  const [pages, setPages] = useState<PageData[]>(mockPages);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingPage, setEditingPage] = useState<PageData | null>(null);
  const [formData, setFormData] = useState<Partial<PageData>>({
    slug: '',
    template: 'default',
    page_type: 'static',
    meta: {
      title: { ko: '', en: '' },
      description: { ko: '', en: '' },
      keywords: []
    },
    settings: {
      show_header: true,
      show_footer: true,
      show_breadcrumb: true,
      container_width: 'default'
    },
    status: 'draft'
  });

  const filteredPages = pages.filter(page => {
    const matchesSearch = 
      page.meta.title.ko.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.meta.title.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || page.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (page: PageData) => {
    setEditingPage(page);
    setFormData(page);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingPage(null);
    setFormData({
      slug: '',
      template: 'default',
      page_type: 'static',
      meta: {
        title: { ko: '', en: '' },
        description: { ko: '', en: '' },
        keywords: []
      },
      settings: {
        show_header: true,
        show_footer: true,
        show_breadcrumb: true,
        container_width: 'default'
      },
      status: 'draft'
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (editingPage) {
      // Update existing page
      setPages(pages.map(p => 
        p.id === editingPage.id 
          ? { ...editingPage, ...formData, updated_at: new Date().toISOString() }
          : p
      ));
    } else {
      // Add new page
      const newPage: PageData = {
        id: Date.now().toString(),
        slug: formData.slug || '',
        template: formData.template || 'default',
        page_type: formData.page_type || 'static',
        meta: formData.meta || { title: { ko: '', en: '' }, description: { ko: '', en: '' }, keywords: [] },
        settings: formData.settings || { show_header: true, show_footer: true, show_breadcrumb: true, container_width: 'default' },
        status: formData.status || 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      if (formData.status === 'published') {
        newPage.published_at = new Date().toISOString();
      }
      setPages([...pages, newPage]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('이 페이지를 삭제하시겠습니까?')) {
      setPages(pages.filter(p => p.id !== id));
    }
  };

  const toggleStatus = (page: PageData) => {
    const newStatus = page.status === 'published' ? 'draft' : 'published';
    setPages(pages.map(p => 
      p.id === page.id 
        ? { 
            ...p, 
            status: newStatus,
            published_at: newStatus === 'published' ? new Date().toISOString() : undefined,
            updated_at: new Date().toISOString()
          }
        : p
    ));
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      draft: 'bg-gray-100 text-gray-700',
      published: 'bg-green-100 text-green-700',
      scheduled: 'bg-blue-100 text-blue-700',
      archived: 'bg-yellow-100 text-yellow-700'
    };
    const statusLabels = {
      draft: '초안',
      published: '게시됨',
      scheduled: '예약됨',
      archived: '보관됨'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${statusColors[status as keyof typeof statusColors]}`}>
        {statusLabels[status as keyof typeof statusLabels]}
      </span>
    );
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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">페이지 관리</h1>
            <p className="text-gray-600">웹사이트의 페이지를 생성하고 관리합니다.</p>
          </div>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            페이지 추가
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="페이지 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">모든 상태</option>
              <option value="draft">초안</option>
              <option value="published">게시됨</option>
              <option value="scheduled">예약됨</option>
              <option value="archived">보관됨</option>
            </select>
          </div>
        </div>

        {/* Pages Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    제목
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    슬러그
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    템플릿
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    게시일
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPages.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      페이지가 없습니다.
                    </td>
                  </tr>
                ) : (
                  filteredPages.map((page) => (
                    <tr key={page.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{page.meta.title.ko}</div>
                          <div className="text-sm text-gray-500">{page.meta.title.en}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm text-gray-700">
                          /{page.slug}
                        </code>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900 capitalize">{page.template}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {getStatusBadge(page.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {page.published_at ? (
                          <div className="flex items-center justify-center gap-2 text-sm text-gray-900">
                            <Calendar className="w-4 h-4" />
                            {new Date(page.published_at).toLocaleDateString('ko-KR')}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => toggleStatus(page)}
                            className="text-gray-400 hover:text-emerald-600"
                            title={page.status === 'published' ? '비공개로 변경' : '게시'}
                          >
                            {page.status === 'published' ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleEdit(page)}
                            className="text-gray-400 hover:text-blue-600"
                            title="편집"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(page.id)}
                            className="text-gray-400 hover:text-red-600"
                            title="삭제"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editingPage ? '페이지 편집' : '새 페이지 추가'}
              </h2>
              <p className="text-gray-600 mt-1">페이지 정보를 입력하세요.</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  기본 정보
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">슬러그</label>
                    <input
                      type="text"
                      value={formData.slug || ''}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="about-us"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">템플릿</label>
                    <select
                      value={formData.template || 'default'}
                      onChange={(e) => setFormData({ ...formData, template: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="default">기본</option>
                      <option value="landing">랜딩</option>
                      <option value="product">제품</option>
                      <option value="blog">블로그</option>
                      <option value="custom">커스텀</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">페이지 타입</label>
                    <select
                      value={formData.page_type || 'static'}
                      onChange={(e) => setFormData({ ...formData, page_type: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="static">정적</option>
                      <option value="dynamic">동적</option>
                      <option value="system">시스템</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Meta Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-emerald-600" />
                  메타 정보
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">제목 (한국어)</label>
                      <input
                        type="text"
                        value={formData.meta?.title?.ko || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          meta: {
                            ...formData.meta!,
                            title: { ...formData.meta!.title, ko: e.target.value }
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">제목 (영어)</label>
                      <input
                        type="text"
                        value={formData.meta?.title?.en || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          meta: {
                            ...formData.meta!,
                            title: { ...formData.meta!.title, en: e.target.value }
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">설명 (한국어)</label>
                      <textarea
                        value={formData.meta?.description?.ko || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          meta: {
                            ...formData.meta!,
                            description: { ...formData.meta!.description, ko: e.target.value }
                          }
                        })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">설명 (영어)</label>
                      <textarea
                        value={formData.meta?.description?.en || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          meta: {
                            ...formData.meta!,
                            description: { ...formData.meta!.description, en: e.target.value }
                          }
                        })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Settings */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-emerald-600" />
                  페이지 설정
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={formData.settings?.show_header}
                        onChange={(e) => setFormData({
                          ...formData,
                          settings: { ...formData.settings!, show_header: e.target.checked }
                        })}
                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-sm font-medium text-gray-700">헤더 표시</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={formData.settings?.show_footer}
                        onChange={(e) => setFormData({
                          ...formData,
                          settings: { ...formData.settings!, show_footer: e.target.checked }
                        })}
                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-sm font-medium text-gray-700">푸터 표시</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={formData.settings?.show_breadcrumb}
                        onChange={(e) => setFormData({
                          ...formData,
                          settings: { ...formData.settings!, show_breadcrumb: e.target.checked }
                        })}
                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-sm font-medium text-gray-700">브레드크럼 표시</span>
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">컨테이너 너비</label>
                    <select
                      value={formData.settings?.container_width || 'default'}
                      onChange={(e) => setFormData({
                        ...formData,
                        settings: { ...formData.settings!, container_width: e.target.value as any }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="default">기본</option>
                      <option value="wide">넓게</option>
                      <option value="full">전체 너비</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">상태</label>
                <select
                  value={formData.status || 'draft'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="draft">초안</option>
                  <option value="published">게시됨</option>
                  <option value="scheduled">예약됨</option>
                  <option value="archived">보관됨</option>
                </select>
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
    </div>
  );
}