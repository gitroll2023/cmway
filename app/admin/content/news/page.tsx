'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Search,
  Eye,
  Calendar,
  User,
  Image as ImageIcon,
  Clock,
  TrendingUp,
  Star,
  MessageSquare,
  Loader2
} from 'lucide-react';
import {
  getNews,
  createNewsItem,
  updateNewsItem,
  deleteNewsItem,
  type NewsItem
} from '@/lib/supabase/content';
import toast from 'react-hot-toast';

const categories = [
  { value: 'news', label: '뉴스', color: 'bg-blue-100 text-blue-700' },
  { value: 'event', label: '이벤트', color: 'bg-green-100 text-green-700' },
  { value: 'promotion', label: '프로모션', color: 'bg-purple-100 text-purple-700' },
  { value: 'update', label: '업데이트', color: 'bg-gray-100 text-gray-700' }
];

export default function NewsPage() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'media' | 'settings'>('content');
  const [formData, setFormData] = useState<Partial<NewsItem>>({
    title: { ko: '', en: '' },
    content: { ko: '', en: '' },
    excerpt: { ko: '', en: '' },
    category: 'news',
    is_featured: false,
    is_published: false,
    author: '홍보팀',
    tags: []
  });

  // Fetch news items from database
  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const data = await getNews(true); // true for admin view
      setNewsItems(data);
    } catch (error) {
      console.error('Error fetching news:', error);
      toast.error('뉴스/이벤트를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const filteredNews = newsItems.filter(item => {
    const matchesSearch = 
      item.title.ko.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.title.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.ko.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (item: NewsItem) => {
    setEditingItem(item);
    setFormData(item);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      title: { ko: '', en: '' },
      content: { ko: '', en: '' },
      excerpt: { ko: '', en: '' },
      category: 'news',
      is_featured: false,
      is_published: false,
      author: '홍보팀',
      tags: []
    });
    setShowModal(true);
    setActiveTab('content');
  };

  const handleSave = async () => {
    try {
      if (editingItem) {
        // Update existing news item
        await updateNewsItem(editingItem.id, formData);
        toast.success('뉴스/이벤트가 수정되었습니다.');
        await fetchNews();
      } else {
        // Create new news item
        await createNewsItem({
          title: formData.title || { ko: '', en: '' },
          content: formData.content || { ko: '', en: '' },
          excerpt: formData.excerpt || { ko: '', en: '' },
          category: formData.category || 'news',
          featured_image: formData.featured_image,
          author: formData.author || '홍보팀',
          is_featured: formData.is_featured || false,
          is_published: formData.is_published || false,
          tags: formData.tags || [],
          event_date: formData.event_date
        });
        toast.success('뉴스/이벤트가 작성되었습니다.');
        await fetchNews();
      }
      setShowModal(false);
    } catch (error) {
      console.error('Error saving news item:', error);
      toast.error('저장 중 오류가 발생했습니다.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('이 뉴스/이벤트를 삭제하시겠습니까?')) {
      try {
        await deleteNewsItem(id);
        toast.success('뉴스/이벤트가 삭제되었습니다.');
        await fetchNews();
      } catch (error) {
        console.error('Error deleting news item:', error);
        toast.error('삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const toggleFeatured = async (item: NewsItem) => {
    try {
      await updateNewsItem(item.id, { is_featured: !item.is_featured });
      await fetchNews();
    } catch (error) {
      console.error('Error toggling featured:', error);
      toast.error('오류가 발생했습니다.');
    }
  };

  const togglePublish = async (item: NewsItem) => {
    try {
      await updateNewsItem(item.id, { is_published: !item.is_published });
      await fetchNews();
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

  const handleTagAdd = (tag: string) => {
    if (tag && !formData.tags?.includes(tag)) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tag]
      });
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter(tag => tag !== tagToRemove) || []
    });
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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">뉴스/이벤트 관리</h1>
            <p className="text-gray-600">뉴스와 이벤트를 작성하고 관리합니다.</p>
          </div>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            뉴스/이벤트 작성
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">전체 게시물</p>
                <p className="text-2xl font-bold text-gray-900">{newsItems.length}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-emerald-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">게시중</p>
                <p className="text-2xl font-bold text-gray-900">
                  {newsItems.filter(item => item.is_published).length}
                </p>
              </div>
              <Eye className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">주요 게시물</p>
                <p className="text-2xl font-bold text-gray-900">
                  {newsItems.filter(item => item.is_featured).length}
                </p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">총 조회수</p>
                <p className="text-2xl font-bold text-gray-900">
                  {newsItems.reduce((sum, item) => sum + item.views, 0).toLocaleString()}
                </p>
              </div>
              <MessageSquare className="w-8 h-8 text-purple-600" />
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
                  placeholder="뉴스/이벤트 검색..."
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

        {/* News List */}
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
                    통계
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
                {filteredNews.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {item.featured_image ? (
                          <img 
                            src={item.featured_image} 
                            alt="" 
                            className="w-16 h-12 object-cover rounded"
                          />
                        ) : (
                          <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center">
                            <ImageIcon className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            {item.is_featured && (
                              <Star className="w-4 h-4 text-yellow-500" />
                            )}
                            <div className="text-sm font-medium text-gray-900">{item.title.ko}</div>
                          </div>
                          <div className="text-sm text-gray-500">{item.title.en}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getCategoryBadge(item.category)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1 text-sm text-gray-900">
                        <User className="w-4 h-4" />
                        {item.author}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-3 text-sm">
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4 text-gray-400" />
                          {item.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-gray-400" />
                          {item.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4 text-gray-400" />
                          {item.comments}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="text-sm text-gray-900">
                        {new Date(item.created_at).toLocaleDateString('ko-KR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {item.is_published ? (
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
                          onClick={() => toggleFeatured(item)}
                          className={`${
                            item.is_featured ? 'text-yellow-500' : 'text-gray-400'
                          } hover:text-yellow-600`}
                          title="주요 게시물"
                        >
                          <Star className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => togglePublish(item)}
                          className="text-gray-400 hover:text-emerald-600"
                          title={item.is_published ? '비공개' : '게시'}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-gray-400 hover:text-blue-600"
                          title="수정"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
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
                {editingItem ? '뉴스/이벤트 수정' : '뉴스/이벤트 작성'}
              </h2>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('content')}
                  className={`px-6 py-3 text-sm font-medium ${
                    activeTab === 'content'
                      ? 'border-b-2 border-emerald-600 text-emerald-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  내용
                </button>
                <button
                  onClick={() => setActiveTab('media')}
                  className={`px-6 py-3 text-sm font-medium ${
                    activeTab === 'media'
                      ? 'border-b-2 border-emerald-600 text-emerald-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  미디어
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`px-6 py-3 text-sm font-medium ${
                    activeTab === 'settings'
                      ? 'border-b-2 border-emerald-600 text-emerald-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  설정
                </button>
              </div>
            </div>

            <div className="p-6">
              {activeTab === 'content' && (
                <div className="space-y-6">
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

                  {/* Excerpt */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">요약 (한국어)</label>
                      <textarea
                        value={formData.excerpt?.ko || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          excerpt: { ...formData.excerpt!, ko: e.target.value }
                        })}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">요약 (영어)</label>
                      <textarea
                        value={formData.excerpt?.en || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          excerpt: { ...formData.excerpt!, en: e.target.value }
                        })}
                        rows={2}
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
              )}

              {activeTab === 'media' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">대표 이미지</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">이미지를 드래그하거나 클릭하여 업로드</p>
                      <button className="mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                        파일 선택
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-6">
                  {/* Category and Settings */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">작성자</label>
                      <input
                        type="text"
                        value={formData.author || ''}
                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Advanced Settings - Date and Statistics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">작성일</label>
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">좋아요</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.likes || 0}
                        onChange={(e) => setFormData({ ...formData, likes: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">댓글</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.comments || 0}
                        onChange={(e) => setFormData({ ...formData, comments: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Event Date (if event) */}
                  {formData.category === 'event' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">이벤트 날짜</label>
                      <input
                        type="datetime-local"
                        value={formData.event_date?.slice(0, 16) || ''}
                        onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  )}

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">태그</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.tags?.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center gap-1">
                          {tag}
                          <button
                            onClick={() => handleTagRemove(tag)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="태그 입력 후 Enter"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleTagAdd(e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Options */}
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.is_featured}
                        onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                        className="rounded border-gray-300 text-emerald-600"
                      />
                      <span className="text-sm font-medium text-gray-700">주요 게시물</span>
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
              )}
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