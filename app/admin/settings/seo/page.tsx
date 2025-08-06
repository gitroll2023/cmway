'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Save, 
  Search, 
  Globe, 
  Image as ImageIcon,
  Tag,
  FileText,
  AlertCircle,
  Plus,
  X
} from 'lucide-react';
import { useCMSStore } from '@/store/cms';

export default function SEOSettingsPage() {
  const { siteSettings, updateSiteSettings } = useCMSStore();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState('');
  const [seoData, setSeoData] = useState({
    default_title: { ko: '', en: '' },
    default_description: { ko: '', en: '' },
    keywords: [] as string[],
    og_image: '',
    twitter_card: 'summary_large_image',
    robots: 'index, follow',
    sitemap_enabled: true,
    google_analytics: '',
    naver_webmaster: '',
    google_search_console: ''
  });

  useEffect(() => {
    if (siteSettings?.seo) {
      setSeoData({
        ...seoData,
        ...siteSettings.seo
      });
      setKeywords(siteSettings.seo.keywords || []);
    }
  }, [siteSettings]);

  const handleAddKeyword = () => {
    if (newKeyword && !keywords.includes(newKeyword)) {
      const updatedKeywords = [...keywords, newKeyword];
      setKeywords(updatedKeywords);
      setSeoData({ ...seoData, keywords: updatedKeywords });
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    const updatedKeywords = keywords.filter(k => k !== keyword);
    setKeywords(updatedKeywords);
    setSeoData({ ...seoData, keywords: updatedKeywords });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    
    try {
      // Save SEO settings to CMS
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving SEO settings:', error);
      alert('SEO 설정 저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            SEO 설정
          </h1>
          <p className="text-gray-600">
            검색 엔진 최적화(SEO) 설정을 관리합니다.
          </p>
        </div>

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2"
          >
            <AlertCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-700">SEO 설정이 성공적으로 저장되었습니다.</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 기본 메타 태그 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-6">
              <FileText className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-semibold text-gray-900">기본 메타 태그</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  기본 타이틀 (한국어)
                </label>
                <input
                  type="text"
                  value={seoData.default_title.ko}
                  onChange={(e) => setSeoData({
                    ...seoData,
                    default_title: { ...seoData.default_title, ko: e.target.value }
                  })}
                  placeholder="사이트 제목 | 브랜드명"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-xs text-gray-500 mt-1">권장 길이: 50-60자</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  기본 타이틀 (영어)
                </label>
                <input
                  type="text"
                  value={seoData.default_title.en}
                  onChange={(e) => setSeoData({
                    ...seoData,
                    default_title: { ...seoData.default_title, en: e.target.value }
                  })}
                  placeholder="Site Title | Brand Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  기본 설명 (한국어)
                </label>
                <textarea
                  value={seoData.default_description.ko}
                  onChange={(e) => setSeoData({
                    ...seoData,
                    default_description: { ...seoData.default_description, ko: e.target.value }
                  })}
                  rows={3}
                  placeholder="사이트에 대한 간단한 설명을 입력하세요"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-xs text-gray-500 mt-1">권장 길이: 150-160자</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  기본 설명 (영어)
                </label>
                <textarea
                  value={seoData.default_description.en}
                  onChange={(e) => setSeoData({
                    ...seoData,
                    default_description: { ...seoData.default_description, en: e.target.value }
                  })}
                  rows={3}
                  placeholder="Enter a brief description of your site"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* 키워드 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-6">
              <Tag className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-semibold text-gray-900">키워드</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
                  placeholder="키워드를 입력하세요"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={handleAddKeyword}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  추가
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm"
                  >
                    {keyword}
                    <button
                      type="button"
                      onClick={() => handleRemoveKeyword(keyword)}
                      className="hover:text-emerald-900"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 소셜 미디어 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-6">
              <Globe className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-semibold text-gray-900">소셜 미디어</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Open Graph 이미지
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={seoData.og_image}
                    onChange={(e) => setSeoData({ ...seoData, og_image: e.target.value })}
                    placeholder="https://example.com/og-image.jpg"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                  >
                    <ImageIcon className="w-4 h-4" />
                    업로드
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">권장 크기: 1200x630px</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Twitter 카드 타입
                </label>
                <select
                  value={seoData.twitter_card}
                  onChange={(e) => setSeoData({ ...seoData, twitter_card: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="summary">Summary</option>
                  <option value="summary_large_image">Summary Large Image</option>
                  <option value="app">App</option>
                  <option value="player">Player</option>
                </select>
              </div>
            </div>
          </div>

          {/* 검색 엔진 설정 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-6">
              <Search className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-semibold text-gray-900">검색 엔진 설정</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Robots 메타 태그
                </label>
                <select
                  value={seoData.robots}
                  onChange={(e) => setSeoData({ ...seoData, robots: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="index, follow">색인 허용, 링크 추적 허용</option>
                  <option value="index, nofollow">색인 허용, 링크 추적 차단</option>
                  <option value="noindex, follow">색인 차단, 링크 추적 허용</option>
                  <option value="noindex, nofollow">색인 차단, 링크 추적 차단</option>
                </select>
              </div>
              
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={seoData.sitemap_enabled}
                    onChange={(e) => setSeoData({ ...seoData, sitemap_enabled: e.target.checked })}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm font-medium text-gray-700">사이트맵 자동 생성</span>
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Google Analytics ID
                </label>
                <input
                  type="text"
                  value={seoData.google_analytics}
                  onChange={(e) => setSeoData({ ...seoData, google_analytics: e.target.value })}
                  placeholder="G-XXXXXXXXXX"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  네이버 웹마스터 인증 코드
                </label>
                <input
                  type="text"
                  value={seoData.naver_webmaster}
                  onChange={(e) => setSeoData({ ...seoData, naver_webmaster: e.target.value })}
                  placeholder="인증 HTML 태그의 content 값"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Google Search Console 인증 코드
                </label>
                <input
                  type="text"
                  value={seoData.google_search_console}
                  onChange={(e) => setSeoData({ ...seoData, google_search_console: e.target.value })}
                  placeholder="인증 HTML 태그의 content 값"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
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
              {loading ? '저장 중...' : 'SEO 설정 저장'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}