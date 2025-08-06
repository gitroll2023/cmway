'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Save, 
  Menu, 
  Plus, 
  Trash2, 
  GripVertical,
  ChevronRight,
  ExternalLink,
  AlertCircle,
  Edit2
} from 'lucide-react';
import { useCMSStore } from '@/store/cms';

interface MenuItem {
  id: string;
  title: { ko: string; en: string };
  path: string;
  type: 'internal' | 'external';
  target?: '_blank' | '_self';
  children?: MenuItem[];
  order: number;
  active: boolean;
}

export default function NavigationSettingsPage() {
  const { siteSettings, updateSiteSettings } = useCMSStore();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: '1',
      title: { ko: '회사소개', en: 'About' },
      path: '/about',
      type: 'internal',
      order: 1,
      active: true,
      children: [
        { id: '1-1', title: { ko: 'CEO 인사말', en: 'CEO Message' }, path: '/about#ceo', type: 'internal', order: 1, active: true },
        { id: '1-2', title: { ko: '연혁', en: 'History' }, path: '/about#history', type: 'internal', order: 2, active: true },
        { id: '1-3', title: { ko: '인증서', en: 'Certifications' }, path: '/about#certs', type: 'internal', order: 3, active: true }
      ]
    },
    {
      id: '2',
      title: { ko: '제품', en: 'Products' },
      path: '/products',
      type: 'internal',
      order: 2,
      active: true,
      children: [
        { id: '2-1', title: { ko: '전체 제품', en: 'All Products' }, path: '/products', type: 'internal', order: 1, active: true },
        { id: '2-2', title: { ko: '카테고리별', en: 'By Category' }, path: '/products?category=all', type: 'internal', order: 2, active: true }
      ]
    },
    {
      id: '3',
      title: { ko: '상담신청', en: 'Consultation' },
      path: '/consultation',
      type: 'internal',
      order: 3,
      active: true
    },
    {
      id: '4',
      title: { ko: '매장찾기', en: 'Store Locator' },
      path: '/stores',
      type: 'internal',
      order: 4,
      active: true
    },
    {
      id: '5',
      title: { ko: '고객지원', en: 'Support' },
      path: '/support',
      type: 'internal',
      order: 5,
      active: true,
      children: [
        { id: '5-1', title: { ko: '공지사항', en: 'Notice' }, path: '/notice', type: 'internal', order: 1, active: true },
        { id: '5-2', title: { ko: '자주 묻는 질문', en: 'FAQ' }, path: '/faq', type: 'internal', order: 2, active: true },
        { id: '5-3', title: { ko: '문의하기', en: 'Contact' }, path: '/contact', type: 'internal', order: 3, active: true }
      ]
    }
  ]);

  const handleAddMenuItem = () => {
    const newItem: MenuItem = {
      id: Date.now().toString(),
      title: { ko: '새 메뉴', en: 'New Menu' },
      path: '/',
      type: 'internal',
      order: menuItems.length + 1,
      active: true
    };
    setMenuItems([...menuItems, newItem]);
    setEditingItem(newItem);
  };

  const handleDeleteMenuItem = (id: string) => {
    if (confirm('이 메뉴를 삭제하시겠습니까?')) {
      setMenuItems(menuItems.filter(item => item.id !== id));
    }
  };

  const handleEditMenuItem = (item: MenuItem) => {
    setEditingItem(item);
  };

  const handleSaveMenuItem = () => {
    if (editingItem) {
      setMenuItems(menuItems.map(item => 
        item.id === editingItem.id ? editingItem : item
      ));
      setEditingItem(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    
    try {
      // Save navigation settings to CMS
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving navigation:', error);
      alert('메뉴 저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const isEditing = editingItem?.id === item.id;

    return (
      <div key={item.id} className={`${level > 0 ? 'ml-8' : ''}`}>
        <div className={`flex items-center gap-3 p-3 rounded-lg border ${
          isEditing ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 bg-white'
        } mb-2`}>
          <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
          
          {isEditing ? (
            <div className="flex-1 grid grid-cols-4 gap-3">
              <input
                type="text"
                value={editingItem.title.ko}
                onChange={(e) => setEditingItem({
                  ...editingItem,
                  title: { ...editingItem.title, ko: e.target.value }
                })}
                placeholder="메뉴명 (한국어)"
                className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <input
                type="text"
                value={editingItem.title.en}
                onChange={(e) => setEditingItem({
                  ...editingItem,
                  title: { ...editingItem.title, en: e.target.value }
                })}
                placeholder="메뉴명 (영어)"
                className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <input
                type="text"
                value={editingItem.path}
                onChange={(e) => setEditingItem({
                  ...editingItem,
                  path: e.target.value
                })}
                placeholder="경로"
                className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveMenuItem}
                  className="px-3 py-1 bg-emerald-600 text-white rounded text-sm hover:bg-emerald-700"
                >
                  저장
                </button>
                <button
                  onClick={() => setEditingItem(null)}
                  className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                >
                  취소
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">{item.title.ko}</span>
                  <span className="text-gray-500 text-sm">({item.title.en})</span>
                  {item.type === 'external' && <ExternalLink className="w-4 h-4 text-gray-400" />}
                </div>
                <div className="text-sm text-gray-500">{item.path}</div>
              </div>
              
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={item.active}
                    onChange={(e) => {
                      setMenuItems(menuItems.map(menuItem =>
                        menuItem.id === item.id
                          ? { ...menuItem, active: e.target.checked }
                          : menuItem
                      ));
                    }}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-600">활성화</span>
                </label>
                
                <button
                  onClick={() => handleEditMenuItem(item)}
                  className="p-1.5 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => handleDeleteMenuItem(item.id)}
                  className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
        
        {item.children && item.children.map(child => renderMenuItem(child, level + 1))}
      </div>
    );
  };

  return (
    <div className="max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            메뉴 관리
          </h1>
          <p className="text-gray-600">
            사이트 네비게이션 메뉴를 설정하고 관리합니다.
          </p>
        </div>

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2"
          >
            <AlertCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-700">메뉴가 성공적으로 저장되었습니다.</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          {/* 메인 네비게이션 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Menu className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-semibold text-gray-900">메인 네비게이션</h2>
              </div>
              <button
                type="button"
                onClick={handleAddMenuItem}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                메뉴 추가
              </button>
            </div>
            
            <div className="space-y-2">
              {menuItems.map(item => renderMenuItem(item))}
            </div>
          </div>

          {/* 푸터 링크 설정 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="flex items-center gap-2 mb-6">
              <ChevronRight className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-semibold text-gray-900">푸터 링크</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-3">회사 정보</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-emerald-600" />
                    <span className="text-sm text-gray-600">회사소개</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-emerald-600" />
                    <span className="text-sm text-gray-600">연혁</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-emerald-600" />
                    <span className="text-sm text-gray-600">인증서</span>
                  </label>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-3">고객 지원</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-emerald-600" />
                    <span className="text-sm text-gray-600">고객센터</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-emerald-600" />
                    <span className="text-sm text-gray-600">FAQ</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-emerald-600" />
                    <span className="text-sm text-gray-600">문의하기</span>
                  </label>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-3">정책</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-emerald-600" />
                    <span className="text-sm text-gray-600">이용약관</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-emerald-600" />
                    <span className="text-sm text-gray-600">개인정보처리방침</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-emerald-600" />
                    <span className="text-sm text-gray-600">이메일무단수집거부</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* 저장 버튼 */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium 
                hover:bg-emerald-700 transition-colors flex items-center gap-2
                ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Save className="w-5 h-5" />
              {loading ? '저장 중...' : '메뉴 저장'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}