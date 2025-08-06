'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  Save, 
  Plus, 
  Trash2, 
  Move,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Loader2,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { uploadFile } from '@/lib/supabase/storage';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import toast from 'react-hot-toast';

interface HeroSlide {
  id: string;
  image: string;
  title: { ko: string; en: string };
  subtitle: { ko: string; en: string };
  link: string;
  is_active: boolean;
  order: number;
}

export default function HeroSettingsPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const supabase = createClientComponentClient();

  useEffect(() => {
    loadHeroSettings();
  }, []);

  const loadHeroSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('site_settings')
        .select('hero_images')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data?.hero_images) {
        setSlides(data.hero_images);
      }
    } catch (error) {
      console.error('Error loading hero settings:', error);
      toast.error('히어로 설정을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const saveHeroSettings = async () => {
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          id: 1,
          hero_images: slides,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        });

      if (error) throw error;

      toast.success('히어로 설정이 저장되었습니다.');
    } catch (error) {
      console.error('Error saving hero settings:', error);
      toast.error('히어로 설정 저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      setUploadingImage(true);
      
      // 파일을 hero 폴더에 업로드
      const ext = file.name.split('.').pop();
      const fileName = `hero/slide-${Date.now()}.${ext}`;
      
      const { data, error } = await supabase.storage
        .from('images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // 공개 URL 가져오기
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('이미지 업로드에 실패했습니다.');
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddSlide = () => {
    const newSlide: HeroSlide = {
      id: `slide-${Date.now()}`,
      image: '',
      title: { ko: '', en: '' },
      subtitle: { ko: '', en: '' },
      link: '/',
      is_active: true,
      order: slides.length
    };
    setEditingSlide(newSlide);
    setShowModal(true);
  };

  const handleEditSlide = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setShowModal(true);
  };

  const handleSaveSlide = () => {
    if (!editingSlide) return;

    if (editingSlide.id.startsWith('slide-')) {
      // 새 슬라이드 추가
      setSlides([...slides, editingSlide]);
    } else {
      // 기존 슬라이드 수정
      setSlides(slides.map(s => s.id === editingSlide.id ? editingSlide : s));
    }

    setShowModal(false);
    setEditingSlide(null);
  };

  const handleDeleteSlide = (id: string) => {
    if (confirm('이 슬라이드를 삭제하시겠습니까?')) {
      setSlides(slides.filter(s => s.id !== id));
    }
  };

  const handleToggleActive = (id: string) => {
    setSlides(slides.map(s => 
      s.id === id ? { ...s, is_active: !s.is_active } : s
    ));
  };

  const handleMoveSlide = (index: number, direction: 'up' | 'down') => {
    const newSlides = [...slides];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex >= 0 && newIndex < slides.length) {
      [newSlides[index], newSlides[newIndex]] = [newSlides[newIndex], newSlides[index]];
      // 순서 업데이트
      newSlides.forEach((slide, i) => {
        slide.order = i;
      });
      setSlides(newSlides);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && editingSlide) {
      const url = await handleImageUpload(e.target.files[0]);
      if (url) {
        setEditingSlide({ ...editingSlide, image: url });
      }
    }
  };

  // Mock 이미지 자동 업로드 기능
  const uploadMockImages = async () => {
    try {
      setLoading(true);
      toast.info('Mock 이미지를 업로드하는 중...');
      
      const mockSlides: HeroSlide[] = [
        {
          id: 'slide-1',
          image: '/mock/slide1.jpg',
          title: { 
            ko: '최고의 품질, 최상의 서비스', 
            en: 'Best Quality, Best Service' 
          },
          subtitle: { 
            ko: 'CMWay가 만들어가는 건강한 미래', 
            en: 'Building a Healthy Future with CMWay' 
          },
          link: '/products',
          is_active: true,
          order: 0
        },
        {
          id: 'slide-2',
          image: '/mock/slide2.jpg',
          title: { 
            ko: '자연에서 온 건강', 
            en: 'Health from Nature' 
          },
          subtitle: { 
            ko: '엄선된 원료, 과학적인 제조 공정', 
            en: 'Selected Ingredients, Scientific Manufacturing' 
          },
          link: '/about',
          is_active: true,
          order: 1
        },
        {
          id: 'slide-3',
          image: '/mock/slide3.jpg',
          title: { 
            ko: '함께 만드는 건강한 세상', 
            en: 'Creating a Healthy World Together' 
          },
          subtitle: { 
            ko: '고객과 함께 성장하는 CMWay', 
            en: 'Growing Together with Our Customers' 
          },
          link: '/contact',
          is_active: true,
          order: 2
        }
      ];

      // Mock 이미지를 실제 Storage URL로 변환
      for (let i = 0; i < mockSlides.length; i++) {
        const response = await fetch(mockSlides[i].image);
        const blob = await response.blob();
        const file = new File([blob], `slide${i + 1}.jpg`, { type: 'image/jpeg' });
        
        const url = await handleImageUpload(file);
        if (url) {
          mockSlides[i].image = url;
        }
      }

      setSlides(mockSlides);
      toast.success('Mock 이미지가 업로드되었습니다. 저장 버튼을 클릭하세요.');
    } catch (error) {
      console.error('Error uploading mock images:', error);
      toast.error('Mock 이미지 업로드에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">히어로 섹션 관리</h1>
            <p className="text-gray-600">메인 페이지 히어로 이미지를 관리합니다.</p>
          </div>
          <div className="flex gap-3">
            {slides.length === 0 && (
              <button
                onClick={uploadMockImages}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Mock 이미지 업로드
              </button>
            )}
            <button
              onClick={handleAddSlide}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              슬라이드 추가
            </button>
            <button
              onClick={saveHeroSettings}
              disabled={saving}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              저장
            </button>
          </div>
        </div>

        {/* Slides List */}
        <div className="space-y-4">
          {slides.length === 0 ? (
            <div className="bg-white rounded-lg p-12 text-center border-2 border-dashed border-gray-300">
              <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">히어로 슬라이드가 없습니다.</p>
              <p className="text-sm text-gray-500 mb-4">
                Mock 이미지를 업로드하거나 새 슬라이드를 추가하세요.
              </p>
            </div>
          ) : (
            slides.sort((a, b) => a.order - b.order).map((slide, index) => (
              <div
                key={slide.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-start gap-6">
                  {/* Image Preview */}
                  <div className="w-48 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {slide.image ? (
                      <img
                        src={slide.image}
                        alt={slide.title.ko}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Slide Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {slide.title.ko || '제목 없음'}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {slide.subtitle.ko || '부제목 없음'}
                        </p>
                        <div className="flex items-center gap-4 mt-3">
                          <span className="text-sm text-gray-600">
                            링크: {slide.link}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            slide.is_active 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {slide.is_active ? '활성' : '비활성'}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleMoveSlide(index, 'up')}
                          disabled={index === 0}
                          className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleMoveSlide(index, 'down')}
                          disabled={index === slides.length - 1}
                          className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleActive(slide.id)}
                          className="p-2 text-gray-400 hover:text-emerald-600"
                        >
                          {slide.is_active ? (
                            <Eye className="w-4 h-4" />
                          ) : (
                            <EyeOff className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleEditSlide(slide)}
                          className="p-2 text-gray-400 hover:text-blue-600"
                        >
                          <Move className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSlide(slide.id)}
                          className="p-2 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>

      {/* Edit Modal */}
      {showModal && editingSlide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editingSlide.id.startsWith('slide-') ? '슬라이드 추가' : '슬라이드 수정'}
              </h2>
            </div>

            <div className="p-6 space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이미지
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  {editingSlide.image ? (
                    <div className="space-y-4">
                      <img
                        src={editingSlide.image}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => setEditingSlide({ ...editingSlide, image: '' })}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        이미지 제거
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">
                        이미지를 선택하세요
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="image-upload"
                        disabled={uploadingImage}
                      />
                      <label
                        htmlFor="image-upload"
                        className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 cursor-pointer"
                      >
                        {uploadingImage ? '업로드 중...' : '파일 선택'}
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Title */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    제목 (한국어)
                  </label>
                  <input
                    type="text"
                    value={editingSlide.title.ko}
                    onChange={(e) => setEditingSlide({
                      ...editingSlide,
                      title: { ...editingSlide.title, ko: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    제목 (영어)
                  </label>
                  <input
                    type="text"
                    value={editingSlide.title.en}
                    onChange={(e) => setEditingSlide({
                      ...editingSlide,
                      title: { ...editingSlide.title, en: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Subtitle */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    부제목 (한국어)
                  </label>
                  <input
                    type="text"
                    value={editingSlide.subtitle.ko}
                    onChange={(e) => setEditingSlide({
                      ...editingSlide,
                      subtitle: { ...editingSlide.subtitle, ko: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    부제목 (영어)
                  </label>
                  <input
                    type="text"
                    value={editingSlide.subtitle.en}
                    onChange={(e) => setEditingSlide({
                      ...editingSlide,
                      subtitle: { ...editingSlide.subtitle, en: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  링크
                </label>
                <input
                  type="text"
                  value={editingSlide.link}
                  onChange={(e) => setEditingSlide({
                    ...editingSlide,
                    link: e.target.value
                  })}
                  placeholder="/"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Active Status */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is-active"
                  checked={editingSlide.is_active}
                  onChange={(e) => setEditingSlide({
                    ...editingSlide,
                    is_active: e.target.checked
                  })}
                  className="rounded border-gray-300 text-emerald-600"
                />
                <label htmlFor="is-active" className="text-sm font-medium text-gray-700">
                  활성화
                </label>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingSlide(null);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleSaveSlide}
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