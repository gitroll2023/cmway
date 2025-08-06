'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Save, 
  Globe, 
  Building, 
  Phone, 
  Mail, 
  MapPin,
  Clock,
  Image as ImageIcon,
  AlertCircle
} from 'lucide-react';
import { useCMSStore } from '@/store/cms';
import toast from 'react-hot-toast';

export default function GeneralSettingsPage() {
  const { siteSettings, updateSiteSettings } = useCMSStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    site_name: { ko: '', en: '' },
    tagline: { ko: '', en: '' },
    logo: '',
    logo_dark: '',
    favicon: '',
    company_info: {
      name: '',
      ceo: '',
      business_number: '',
      online_business_number: '',
      email: '',
      phone: '',
      fax: '',
      address: { ko: '', en: '' },
      customer_center: {
        phone: '',
        hours: '',
        lunch: '',
        holiday: ''
      }
    },
    social_links: {
      facebook: '',
      instagram: '',
      youtube: '',
      blog: '',
      kakao: ''
    },
    footer_config: {
      copyright: '',
      show_social_links: true,
      show_customer_center: true
    }
  });

  useEffect(() => {
    if (siteSettings) {
      setFormData({
        site_name: siteSettings.site_name,
        tagline: siteSettings.tagline,
        logo: siteSettings.logo || '',
        logo_dark: siteSettings.logo_dark || '',
        favicon: siteSettings.favicon || '',
        company_info: siteSettings.company_info,
        social_links: {
          facebook: siteSettings.social_links?.facebook || '',
          instagram: siteSettings.social_links?.instagram || '',
          youtube: siteSettings.social_links?.youtube || '',
          blog: siteSettings.social_links?.blog || '',
          kakao: siteSettings.social_links?.kakao || ''
        },
        footer_config: siteSettings.footer_config
      });
    }
  }, [siteSettings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await updateSiteSettings(formData);
      toast.success('설정이 성공적으로 저장되었습니다.');
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('설정 저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (path: string, value: any) => {
    const keys = path.split('.');
    setFormData(prev => {
      const newData = { ...prev };
      let current: any = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });
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
            기본 설정
          </h1>
          <p className="text-gray-600">
            사이트의 기본 정보와 회사 정보를 관리합니다.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 사이트 정보 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-6">
              <Globe className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-semibold text-gray-900">사이트 정보</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  사이트명 (한국어)
                </label>
                <input
                  type="text"
                  value={formData.site_name.ko}
                  onChange={(e) => handleInputChange('site_name.ko', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  사이트명 (영어)
                </label>
                <input
                  type="text"
                  value={formData.site_name.en}
                  onChange={(e) => handleInputChange('site_name.en', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  태그라인 (한국어)
                </label>
                <textarea
                  value={formData.tagline.ko}
                  onChange={(e) => handleInputChange('tagline.ko', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  태그라인 (영어)
                </label>
                <textarea
                  value={formData.tagline.en}
                  onChange={(e) => handleInputChange('tagline.en', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* 회사 정보 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-6">
              <Building className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-semibold text-gray-900">회사 정보</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  회사명
                </label>
                <input
                  type="text"
                  value={formData.company_info.name}
                  onChange={(e) => handleInputChange('company_info.name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  대표자명
                </label>
                <input
                  type="text"
                  value={formData.company_info.ceo}
                  onChange={(e) => handleInputChange('company_info.ceo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  사업자등록번호
                </label>
                <input
                  type="text"
                  value={formData.company_info.business_number}
                  onChange={(e) => handleInputChange('company_info.business_number', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  통신판매업신고번호
                </label>
                <input
                  type="text"
                  value={formData.company_info.online_business_number}
                  onChange={(e) => handleInputChange('company_info.online_business_number', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  대표 이메일
                </label>
                <input
                  type="email"
                  value={formData.company_info.email}
                  onChange={(e) => handleInputChange('company_info.email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  대표 전화
                </label>
                <input
                  type="tel"
                  value={formData.company_info.phone}
                  onChange={(e) => handleInputChange('company_info.phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  팩스
                </label>
                <input
                  type="tel"
                  value={formData.company_info.fax}
                  onChange={(e) => handleInputChange('company_info.fax', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  주소 (한국어)
                </label>
                <input
                  type="text"
                  value={formData.company_info.address.ko}
                  onChange={(e) => handleInputChange('company_info.address.ko', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  주소 (영어)
                </label>
                <input
                  type="text"
                  value={formData.company_info.address.en}
                  onChange={(e) => handleInputChange('company_info.address.en', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* 고객센터 정보 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-6">
              <Phone className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-semibold text-gray-900">고객센터 정보</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  고객센터 전화
                </label>
                <input
                  type="tel"
                  value={formData.company_info.customer_center.phone}
                  onChange={(e) => handleInputChange('company_info.customer_center.phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  운영 시간
                </label>
                <input
                  type="text"
                  value={formData.company_info.customer_center.hours}
                  onChange={(e) => handleInputChange('company_info.customer_center.hours', e.target.value)}
                  placeholder="평일 09:00 - 18:00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  점심시간
                </label>
                <input
                  type="text"
                  value={formData.company_info.customer_center.lunch}
                  onChange={(e) => handleInputChange('company_info.customer_center.lunch', e.target.value)}
                  placeholder="점심시간 12:00 - 13:00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  휴무일
                </label>
                <input
                  type="text"
                  value={formData.company_info.customer_center.holiday}
                  onChange={(e) => handleInputChange('company_info.customer_center.holiday', e.target.value)}
                  placeholder="토요일, 일요일, 공휴일"
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
              {loading ? '저장 중...' : '설정 저장'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}