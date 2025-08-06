'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Search, MapPin, Filter, Building, Warehouse, Store, Home } from 'lucide-react';
import { MainLayout } from '@/components/layout/main-layout';
import StoreList from '@/components/map/store-list';
import { storeLocationsApi } from '@/lib/api/cms';
import type { StoreLocation } from '@/lib/types';

// Dynamic import for map component
const GoogleMap = dynamic(
  () => import('@/components/map/google-map'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-2"></div>
          <p className="text-gray-500">지도를 로딩중입니다...</p>
        </div>
      </div>
    )
  }
);

const storeTypes = [
  { value: '', label: '전체', icon: Store },
  { value: 'headquarters', label: '본사', icon: Home },
  { value: 'branch', label: '지점', icon: Building },
  { value: 'warehouse', label: '물류센터', icon: Warehouse },
  { value: 'showroom', label: '쇼룸', icon: Store }
];

// Mock data for demonstration (will be replaced with real CMS data)
const mockStores: StoreLocation[] = [
  {
    id: '1',
    name: { ko: '씨엠웨이 본사', en: 'CMWay Headquarters' },
    type: 'headquarters',
    address: { ko: '광주광역시 서구 월드컵4강로 186-1, 302호', en: '302, 186-1, World Cup 4gang-ro, Seo-gu, Gwangju' },
    postal_code: '61965',
    coordinates: { latitude: 35.152841, longitude: 126.869796 },
    contact: {
      phone: '062-123-4567',
      fax: '062-123-4568',
      email: 'info@cmway.co.kr'
    },
    hours: {
      monday: { open: '09:00', close: '18:00' },
      tuesday: { open: '09:00', close: '18:00' },
      wednesday: { open: '09:00', close: '18:00' },
      thursday: { open: '09:00', close: '18:00' },
      friday: { open: '09:00', close: '18:00' },
      saturday: { open: '', close: '', closed: true },
      sunday: { open: '', close: '', closed: true }
    },
    services: ['제품 상담', '고객 서비스', '브로슈어 제공'],
    features: {
      parking: true,
      wheelchair_accessible: true,
      public_transport: true,
      wifi: true
    },
    images: [],
    description: { ko: '씨엠웨이 본사로, 모든 제품 상담 및 고객 서비스를 제공합니다.', en: 'CMWay headquarters providing all product consultation and customer services.' },
    manager: {
      name: '김본사',
      phone: '02-1234-5678',
      email: 'manager@cmway.co.kr'
    },
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: { ko: '씨엠웨이 강남지점', en: 'CMWay Gangnam Branch' },
    type: 'branch',
    address: { ko: '서울특별시 강남구 역삼동 456', en: 'Yeoksam-dong 456, Gangnam-gu, Seoul' },
    postal_code: '06253',
    coordinates: { latitude: 37.4979, longitude: 127.0276 },
    contact: {
      phone: '02-2345-6789',
      email: 'gangnam@cmway.co.kr'
    },
    hours: {
      monday: { open: '10:00', close: '19:00' },
      tuesday: { open: '10:00', close: '19:00' },
      wednesday: { open: '10:00', close: '19:00' },
      thursday: { open: '10:00', close: '19:00' },
      friday: { open: '10:00', close: '19:00' },
      saturday: { open: '10:00', close: '17:00' },
      sunday: { open: '', close: '', closed: true }
    },
    services: ['제품 상담', '샘플 제공', '주문 접수'],
    features: {
      parking: true,
      wheelchair_accessible: true,
      public_transport: true,
      wifi: true
    },
    images: [],
    description: { ko: '강남 지역 고객을 위한 상담센터입니다.', en: 'Consultation center for Gangnam area customers.' },
    manager: {
      name: '이지점',
      phone: '02-2345-6789',
      email: 'gangnam.manager@cmway.co.kr'
    },
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: { ko: '씨엠웨이 물류센터', en: 'CMWay Distribution Center' },
    type: 'warehouse',
    address: { ko: '경기도 성남시 분당구 야탑동 789', en: 'Yatap-dong 789, Bundang-gu, Seongnam' },
    postal_code: '13494',
    coordinates: { latitude: 37.4138, longitude: 127.1285 },
    contact: {
      phone: '031-1234-5678',
      email: 'logistics@cmway.co.kr'
    },
    hours: {
      monday: { open: '08:00', close: '17:00' },
      tuesday: { open: '08:00', close: '17:00' },
      wednesday: { open: '08:00', close: '17:00' },
      thursday: { open: '08:00', close: '17:00' },
      friday: { open: '08:00', close: '17:00' },
      saturday: { open: '', close: '', closed: true },
      sunday: { open: '', close: '', closed: true }
    },
    services: ['물류 배송', '재고 관리', '대량 주문'],
    features: {
      parking: true,
      wheelchair_accessible: false,
      public_transport: false,
      wifi: false
    },
    images: [],
    description: { ko: '전국 배송을 담당하는 물류센터입니다.', en: 'Distribution center handling nationwide delivery.' },
    manager: {
      name: '박물류',
      phone: '031-1234-5678',
      email: 'logistics.manager@cmway.co.kr'
    },
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  }
];

export default function StoresPage() {
  const [stores, setStores] = useState<StoreLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStore, setSelectedStore] = useState<StoreLocation | null>(null);
  const [viewMode, setViewMode] = useState<'split' | 'map' | 'list'>('split');

  // Load stores data
  useEffect(() => {
    const loadStores = async () => {
      try {
        setLoading(true);
        const response = await storeLocationsApi.getAll();
        
        if (response.success && response.data) {
          setStores(response.data);
        } else {
          // Fallback to mock data if CMS is not available
          console.warn('CMS data not available, using mock data');
          setStores(mockStores);
        }
      } catch (err) {
        console.error('Error loading stores:', err);
        // Fallback to mock data
        setStores(mockStores);
      } finally {
        setLoading(false);
      }
    };

    loadStores();
  }, []);

  // Filter stores based on search and type
  const filteredStores = useMemo(() => {
    return stores.filter(store => {
      const matchesSearch = !searchTerm || 
        (store.name?.ko && store.name.ko.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (store.name?.en && store.name.en.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (store.address?.ko && store.address.ko.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (store.address?.en && store.address.en.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesType = !selectedType || store.type === selectedType;
      
      return matchesSearch && matchesType;
    });
  }, [stores, searchTerm, selectedType]);

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">매장 정보를 불러오는 중입니다...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-6">
              <MapPin className="w-8 h-8 text-emerald-600" />
            </div>
            <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
              매장 <span className="text-emerald-600">찾기</span>
            </h1>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              전국에 위치한 씨엠웨이 매장을 찾아보세요. 가까운 매장에서 전문 상담과 다양한 서비스를 제공받으실 수 있습니다.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="매장명 또는 주소로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Type Filter */}
            <div className="flex flex-wrap gap-2">
              {storeTypes.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setSelectedType(value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                    selectedType === value
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-emerald-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('split')}
                className={`px-4 py-2 text-sm font-medium ${
                  viewMode === 'split'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                지도+목록
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-4 py-2 text-sm font-medium border-l border-gray-300 ${
                  viewMode === 'map'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                지도만
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 text-sm font-medium border-l border-gray-300 ${
                  viewMode === 'list'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                목록만
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className={`grid gap-6 ${
            viewMode === 'split' ? 'lg:grid-cols-2' : 'grid-cols-1'
          }`}>
            {/* Map */}
            {(viewMode === 'split' || viewMode === 'map') && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className={`${viewMode === 'map' ? 'h-[600px]' : 'h-[500px]'}`}
              >
                <GoogleMap
                  stores={filteredStores}
                  selectedStore={selectedStore}
                  onStoreSelect={setSelectedStore}
                  className="h-full"
                />
              </motion.div>
            )}

            {/* Store List */}
            {(viewMode === 'split' || viewMode === 'list') && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="space-y-4"
              >
                <StoreList
                  stores={filteredStores}
                  selectedStore={selectedStore}
                  onStoreSelect={setSelectedStore}
                  searchTerm={searchTerm}
                  selectedType={selectedType}
                />
              </motion.div>
            )}
          </div>

          {/* Empty State */}
          {filteredStores.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                매장을 찾을 수 없습니다
              </h3>
              <p className="text-gray-600 mb-6">
                검색 조건을 다시 확인하시거나 전체 매장을 확인해보세요.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedType('');
                }}
                className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                전체 매장 보기
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
              매장을 찾지 못하셨나요?
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              고객센터에 문의하시면 가까운 매장 정보나 온라인 상담을 받으실 수 있습니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:1588-0000"
                className="inline-flex items-center justify-center px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
              >
                고객센터 전화하기
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-colors font-semibold"
              >
                온라인 문의
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
}