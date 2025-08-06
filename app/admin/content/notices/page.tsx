'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Search,
  Eye,
  Pin,
  Calendar,
  User,
  AlertCircle,
  Megaphone,
  Loader2
} from 'lucide-react';
import { 
  getNotices, 
  createNotice, 
  updateNotice, 
  deleteNotice,
  type Notice 
} from '@/lib/supabase/content';
import toast from 'react-hot-toast';

const categories = [
  { value: 'general', label: '일반', color: 'bg-gray-100 text-gray-700' },
  { value: 'service', label: '서비스', color: 'bg-blue-100 text-blue-700' },
  { value: 'event', label: '이벤트', color: 'bg-green-100 text-green-700' },
  { value: 'maintenance', label: '점검', color: 'bg-red-100 text-red-700' }
];

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [formData, setFormData] = useState<Partial<Notice>>({
    title: { ko: '', en: '' },
    content: { ko: '', en: '' },
    category: 'general',
    is_pinned: false,
    is_published: false,
    author: '관리자'
  });

  // Fetch notices from database
  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const data = await getNotices(true); // true for admin view
      setNotices(data);
    } catch (error) {
      console.error('Error fetching notices:', error);
      toast.error('공지사항을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const filteredNotices = notices.filter(notice => {
    const matchesSearch = 
      notice.title.ko.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.title.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.content.ko.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || notice.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (notice: Notice) => {
    setEditingNotice(notice);
    setFormData(notice);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingNotice(null);
    setFormData({
      title: { ko: '', en: '' },
      content: { ko: '', en: '' },
      category: 'general',
      is_pinned: false,
      is_published: false,
      author: '관리자'
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (editingNotice) {
        // Update existing notice
        const updated = await updateNotice(editingNotice.id, formData);
        toast.success('공지사항이 수정되었습니다.');
        await fetchNotices();
      } else {
        // Create new notice
        const newNotice = await createNotice({
          title: formData.title || { ko: '', en: '' },
          content: formData.content || { ko: '', en: '' },
          category: formData.category || 'general',
          is_pinned: formData.is_pinned || false,
          is_published: formData.is_published || false,
          author: formData.author || '관리자'
        });
        toast.success('공지사항이 작성되었습니다.');
        await fetchNotices();
      }
      setShowModal(false);
    } catch (error) {
      console.error('Error saving notice:', error);
      toast.error('저장 중 오류가 발생했습니다.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('이 공지사항을 삭제하시겠습니까?')) {
      try {
        await deleteNotice(id);
        toast.success('공지사항이 삭제되었습니다.');
        await fetchNotices();
      } catch (error) {
        console.error('Error deleting notice:', error);
        toast.error('삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const togglePin = async (notice: Notice) => {
    try {
      await updateNotice(notice.id, { is_pinned: !notice.is_pinned });
      await fetchNotices();
    } catch (error) {
      console.error('Error toggling pin:', error);
      toast.error('오류가 발생했습니다.');
    }
  };

  const togglePublish = async (notice: Notice) => {
    try {
      await updateNotice(notice.id, { is_published: !notice.is_published });
      await fetchNotices();
    } catch (error) {
      console.error('Error toggling publish:', error);
      toast.error('오류가 발생했습니다.');
    }
  };

  const getCategoryBadge = (category: string) => {
    const cat = categories.find(c => c.value === category);
    return cat ? (
      <span className={`px-2 py-1 rounded-full text-xs ${cat.color}`}>
        {cat.label}
      </span>
    ) : null;
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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">공지사항 관리</h1>
            <p className="text-gray-600">공지사항을 작성하고 관리합니다.</p>
          </div>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            공지사항 작성
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
                  placeholder="공지사항 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
            
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">모든 카테고리</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Notices List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    제목
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    카테고리
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작성자
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    조회수
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작성일
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
                {filteredNotices.map((notice) => (
                  <tr key={notice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {notice.is_pinned && (
                          <Pin className="w-4 h-4 text-red-500" />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{notice.title.ko}</div>
                          <div className="text-sm text-gray-500">{notice.title.en}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getCategoryBadge(notice.category)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1 text-sm text-gray-900">
                        <User className="w-4 h-4" />
                        {notice.author}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm text-gray-900">{notice.views}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="text-sm text-gray-900">
                        {new Date(notice.created_at).toLocaleDateString('ko-KR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {notice.is_published ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                          게시중
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                          비공개
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => togglePin(notice)}
                          className={`${
                            notice.is_pinned ? 'text-red-500' : 'text-gray-400'
                          } hover:text-red-600`}
                          title="고정"
                        >
                          <Pin className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => togglePublish(notice)}
                          className="text-gray-400 hover:text-emerald-600"
                          title={notice.is_published ? '비공개' : '게시'}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(notice)}
                          className="text-gray-400 hover:text-blue-600"
                          title="수정"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(notice.id)}
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
          )}
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
                {editingNotice ? '공지사항 수정' : '공지사항 작성'}
              </h2>
            </div>

            <div className="p-6 space-y-6">
              {/* Category and Settings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.is_pinned}
                      onChange={(e) => setFormData({ ...formData, is_pinned: e.target.checked })}
                      className="rounded border-gray-300 text-emerald-600"
                    />
                    <span className="text-sm font-medium text-gray-700">상단 고정</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.is_published}
                      onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                      className="rounded border-gray-300 text-emerald-600"
                    />
                    <span className="text-sm font-medium text-gray-700">즉시 게시</span>
                  </label>
                </div>
              </div>

              {/* Advanced Settings - Date and Views */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">작성일 (수동 설정)</label>
                  <input
                    type="datetime-local"
                    value={formData.created_at ? new Date(formData.created_at).toISOString().slice(0, 16) : ''}
                    onChange={(e) => setFormData({ ...formData, created_at: new Date(e.target.value).toISOString() })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">조회수</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.views || 0}
                    onChange={(e) => setFormData({ ...formData, views: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">작성자</label>
                  <input
                    type="text"
                    value={formData.author || '관리자'}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Title */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">제목 (한국어)</label>
                  <input
                    type="text"
                    value={formData.title?.ko || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      title: { ...formData.title!, ko: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">제목 (영어)</label>
                  <input
                    type="text"
                    value={formData.title?.en || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      title: { ...formData.title!, en: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">내용 (한국어)</label>
                  <textarea
                    value={formData.content?.ko || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      content: { ...formData.content!, ko: e.target.value }
                    })}
                    rows={10}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">내용 (영어)</label>
                  <textarea
                    value={formData.content?.en || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      content: { ...formData.content!, en: e.target.value }
                    })}
                    rows={10}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
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
    </div>
  );
}