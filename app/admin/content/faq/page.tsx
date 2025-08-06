'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Search,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Tag,
  Eye,
  EyeOff,
  Move,
  Copy,
  Loader2
} from 'lucide-react';
import {
  getFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  updateFAQOrder,
  type FAQItem
} from '@/lib/supabase/content';
import toast from 'react-hot-toast';

const categories = [
  { value: 'general', label: '일반', color: 'bg-gray-100 text-gray-700' },
  { value: 'product', label: '제품', color: 'bg-blue-100 text-blue-700' },
  { value: 'order', label: '주문', color: 'bg-green-100 text-green-700' },
  { value: 'delivery', label: '배송', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'return', label: '반품/교환', color: 'bg-red-100 text-red-700' },
  { value: 'payment', label: '결제', color: 'bg-purple-100 text-purple-700' },
  { value: 'membership', label: '회원', color: 'bg-indigo-100 text-indigo-700' }
];

export default function FAQPage() {
  const [faqs, setFAQs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<FAQItem | null>(null);
  const [formData, setFormData] = useState<Partial<FAQItem>>({
    question: { ko: '', en: '' },
    answer: { ko: '', en: '' },
    category: 'general',
    tags: [],
    is_published: false,
    is_featured: false,
    display_order: 0
  });

  // Fetch FAQs from database
  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    setLoading(true);
    try {
      const data = await getFAQs(true); // true for admin view
      setFAQs(data);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      toast.error('FAQ를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const filteredFAQs = faqs
    .filter(item => {
      const matchesSearch = 
        item.question.ko.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.question.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.answer.ko.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(tag => tag.includes(searchTerm));
      const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => a.display_order - b.display_order);

  const handleEdit = (item: FAQItem) => {
    setEditingItem(item);
    setFormData(item);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    const maxOrder = Math.max(...faqs.map(f => f.display_order), 0);
    setFormData({
      question: { ko: '', en: '' },
      answer: { ko: '', en: '' },
      category: 'general',
      tags: [],
      is_published: false,
      is_featured: false,
      display_order: maxOrder + 1
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (editingItem) {
        // Update existing FAQ
        await updateFAQ(editingItem.id, formData);
        toast.success('FAQ가 수정되었습니다.');
        await fetchFAQs();
      } else {
        // Create new FAQ
        await createFAQ({
          question: formData.question || { ko: '', en: '' },
          answer: formData.answer || { ko: '', en: '' },
          category: formData.category || 'general',
          tags: formData.tags || [],
          is_published: formData.is_published || false,
          is_featured: formData.is_featured || false,
          display_order: formData.display_order || 0
        });
        toast.success('FAQ가 추가되었습니다.');
        await fetchFAQs();
      }
      setShowModal(false);
    } catch (error) {
      console.error('Error saving FAQ:', error);
      toast.error('저장 중 오류가 발생했습니다.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('이 FAQ를 삭제하시겠습니까?')) {
      try {
        await deleteFAQ(id);
        toast.success('FAQ가 삭제되었습니다.');
        await fetchFAQs();
      } catch (error) {
        console.error('Error deleting FAQ:', error);
        toast.error('삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const handleDuplicate = async (item: FAQItem) => {
    try {
      const maxOrder = Math.max(...faqs.map(f => f.display_order), 0);
      await createFAQ({
        question: { 
          ko: `${item.question.ko} (복사본)`, 
          en: `${item.question.en} (Copy)` 
        },
        answer: item.answer,
        category: item.category,
        tags: item.tags,
        is_published: false,
        is_featured: false,
        display_order: maxOrder + 1
      });
      toast.success('FAQ가 복제되었습니다.');
      await fetchFAQs();
    } catch (error) {
      console.error('Error duplicating FAQ:', error);
      toast.error('복제 중 오류가 발생했습니다.');
    }
  };

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const togglePublish = async (item: FAQItem) => {
    try {
      await updateFAQ(item.id, { is_published: !item.is_published });
      await fetchFAQs();
    } catch (error) {
      console.error('Error toggling publish:', error);
      toast.error('오류가 발생했습니다.');
    }
  };

  const toggleFeatured = async (item: FAQItem) => {
    try {
      await updateFAQ(item.id, { is_featured: !item.is_featured });
      await fetchFAQs();
    } catch (error) {
      console.error('Error toggling featured:', error);
      toast.error('오류가 발생했습니다.');
    }
  };

  const moveItem = async (item: FAQItem, direction: 'up' | 'down') => {
    try {
      const currentIndex = faqs.findIndex(f => f.id === item.id);
      const newFAQs = [...faqs];
      
      if (direction === 'up' && currentIndex > 0) {
        const prevItem = newFAQs[currentIndex - 1];
        const tempOrder = item.display_order;
        newFAQs[currentIndex] = { ...item, display_order: prevItem.display_order };
        newFAQs[currentIndex - 1] = { ...prevItem, display_order: tempOrder };
      } else if (direction === 'down' && currentIndex < faqs.length - 1) {
        const nextItem = newFAQs[currentIndex + 1];
        const tempOrder = item.display_order;
        newFAQs[currentIndex] = { ...item, display_order: nextItem.display_order };
        newFAQs[currentIndex + 1] = { ...nextItem, display_order: tempOrder };
      } else {
        return;
      }
      
      // Update order in database
      await updateFAQOrder(newFAQs.map(f => ({ id: f.id, display_order: f.display_order })));
      await fetchFAQs();
    } catch (error) {
      console.error('Error moving FAQ:', error);
      toast.error('순서 변경 중 오류가 발생했습니다.');
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

  const stats = {
    total: faqs.length,
    published: faqs.filter(f => f.is_published).length,
    featured: faqs.filter(f => f.is_featured).length,
    totalViews: faqs.reduce((sum, f) => sum + f.views, 0)
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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">FAQ 관리</h1>
            <p className="text-gray-600">자주 묻는 질문을 관리합니다.</p>
          </div>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            FAQ 추가
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">전체 FAQ</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <HelpCircle className="w-8 h-8 text-emerald-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">게시중</p>
                <p className="text-2xl font-bold text-gray-900">{stats.published}</p>
              </div>
              <Eye className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">주요 FAQ</p>
                <p className="text-2xl font-bold text-gray-900">{stats.featured}</p>
              </div>
              <Tag className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">총 조회수</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</p>
              </div>
              <Eye className="w-8 h-8 text-purple-600" />
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
                  placeholder="FAQ 검색..."
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

        {/* FAQ List */}
        {loading ? (
          <div className="flex items-center justify-center py-12 bg-white rounded-lg">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          </div>
        ) : (
        <div className="space-y-4">
          {filteredFAQs.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200"
            >
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {item.is_featured && (
                        <Tag className="w-4 h-4 text-yellow-500" />
                      )}
                      <h3 className="font-medium text-gray-900">{item.question.ko}</h3>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{item.question.en}</p>
                    <div className="flex items-center gap-4 text-sm">
                      {getCategoryBadge(item.category)}
                      <span className="text-gray-500">
                        <Eye className="w-4 h-4 inline mr-1" />
                        {item.views}
                      </span>
                      <span className="text-gray-500">
                        👍 {item.helpful_yes} / 👎 {item.helpful_no}
                      </span>
                      {!item.is_published && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                          비공개
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => moveItem(item, 'up')}
                      className="text-gray-400 hover:text-gray-600"
                      disabled={index === 0}
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveItem(item, 'down')}
                      className="text-gray-400 hover:text-gray-600"
                      disabled={index === filteredFAQs.length - 1}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleFeatured(item)}
                      className={`${
                        item.is_featured ? 'text-yellow-500' : 'text-gray-400'
                      } hover:text-yellow-600`}
                      title="주요 FAQ"
                    >
                      <Tag className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => togglePublish(item)}
                      className="text-gray-400 hover:text-emerald-600"
                      title={item.is_published ? '비공개' : '게시'}
                    >
                      {item.is_published ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDuplicate(item)}
                      className="text-gray-400 hover:text-purple-600"
                      title="복제"
                    >
                      <Copy className="w-4 h-4" />
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
                    <button
                      onClick={() => toggleExpanded(item.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {expandedItems.includes(item.id) ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                
                {expandedItems.includes(item.id) && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="prose prose-sm max-w-none">
                      <p className="text-gray-700">{item.answer.ko}</p>
                      <p className="text-gray-500 mt-2">{item.answer.en}</p>
                    </div>
                    {item.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {item.tags.map(tag => (
                          <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        )}
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
                {editingItem ? 'FAQ 수정' : 'FAQ 추가'}
              </h2>
            </div>

            <div className="p-6 space-y-6">
              {/* Category and Order */}
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">순서</label>
                  <input
                    type="number"
                    value={formData.display_order || 0}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="flex items-end gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                      className="rounded border-gray-300 text-emerald-600"
                    />
                    <span className="text-sm font-medium text-gray-700">주요 FAQ</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.is_published}
                      onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                      className="rounded border-gray-300 text-emerald-600"
                    />
                    <span className="text-sm font-medium text-gray-700">게시</span>
                  </label>
                </div>
              </div>

              {/* Advanced Settings - Views and Feedback */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">도움됨 (예)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.helpful_yes || 0}
                    onChange={(e) => setFormData({ ...formData, helpful_yes: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">도움안됨 (아니오)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.helpful_no || 0}
                    onChange={(e) => setFormData({ ...formData, helpful_no: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">작성일</label>
                  <input
                    type="datetime-local"
                    value={formData.created_at ? new Date(formData.created_at).toISOString().slice(0, 16) : ''}
                    onChange={(e) => setFormData({ ...formData, created_at: new Date(e.target.value).toISOString() })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Question */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">질문 (한국어)</label>
                  <textarea
                    value={formData.question?.ko || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      question: { ...formData.question!, ko: e.target.value }
                    })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">질문 (영어)</label>
                  <textarea
                    value={formData.question?.en || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      question: { ...formData.question!, en: e.target.value }
                    })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Answer */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">답변 (한국어)</label>
                  <textarea
                    value={formData.answer?.ko || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      answer: { ...formData.answer!, ko: e.target.value }
                    })}
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">답변 (영어)</label>
                  <textarea
                    value={formData.answer?.en || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      answer: { ...formData.answer!, en: e.target.value }
                    })}
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

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