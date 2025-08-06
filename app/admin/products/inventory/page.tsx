'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Search,
  Filter,
  Download,
  Upload,
  Edit2,
  Save,
  X
} from 'lucide-react';
import type { Product } from '@/lib/types/cms';

interface InventoryItem extends Product {
  stock_status: 'in_stock' | 'low_stock' | 'out_of_stock';
  stock_alert_level: number;
  stock_quantity: number;
  price: number;
  category: string;
  images?: string[];
}

// Mock data for inventory
const mockProducts: InventoryItem[] = [
  {
    id: '1',
    sku: 'PRD-001',
    name: { ko: '멀티비타민', en: 'Multivitamin' },
    slug: 'multivitamin',
    stock_quantity: 150,
    price: 45000,
    category: 'vitamin',
    stock_status: 'in_stock',
    stock_alert_level: 20,
    pricing: {
      display_price: 45000,
      price_text: '₩45,000',
      is_price_visible: true
    },
    media: {
      gallery: [],
      videos: [],
      documents: []
    },
    category_ids: [],
    inquiry_settings: {
      enable_inquiry: true,
      inquiry_button_text: '문의하기',
      show_kakao_chat: false,
      show_phone_number: false
    },
    related_products: {
      cross_sells: [],
      up_sells: [],
      frequently_bought: []
    },
    quality: {
      gmp_certified: true,
      haccp_certified: true,
      organic_certified: false,
      other_certifications: []
    },
    status: 'published',
    featured: false,
    is_new: false,
    is_best: false,
    stats: {
      view_count: 0,
      inquiry_count: 0,
      brochure_download_count: 0
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    sku: 'PRD-002',
    name: { ko: '오메가3', en: 'Omega-3' },
    slug: 'omega-3',
    stock_quantity: 18,
    price: 35000,
    category: 'health',
    stock_status: 'low_stock',
    stock_alert_level: 20,
    pricing: {
      display_price: 35000,
      price_text: '₩35,000',
      is_price_visible: true
    },
    media: {
      gallery: [],
      videos: [],
      documents: []
    },
    category_ids: [],
    inquiry_settings: {
      enable_inquiry: true,
      inquiry_button_text: '문의하기',
      show_kakao_chat: false,
      show_phone_number: false
    },
    related_products: {
      cross_sells: [],
      up_sells: [],
      frequently_bought: []
    },
    quality: {
      gmp_certified: true,
      haccp_certified: true,
      organic_certified: false,
      other_certifications: []
    },
    status: 'published',
    featured: false,
    is_new: false,
    is_best: false,
    stats: {
      view_count: 0,
      inquiry_count: 0,
      brochure_download_count: 0
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    sku: 'PRD-003',
    name: { ko: '프로바이오틱스', en: 'Probiotics' },
    slug: 'probiotics',
    stock_quantity: 0,
    price: 55000,
    category: 'health',
    stock_status: 'out_of_stock',
    stock_alert_level: 20,
    pricing: {
      display_price: 55000,
      price_text: '₩55,000',
      is_price_visible: true
    },
    media: {
      gallery: [],
      videos: [],
      documents: []
    },
    category_ids: [],
    inquiry_settings: {
      enable_inquiry: true,
      inquiry_button_text: '문의하기',
      show_kakao_chat: false,
      show_phone_number: false
    },
    related_products: {
      cross_sells: [],
      up_sells: [],
      frequently_bought: []
    },
    quality: {
      gmp_certified: true,
      haccp_certified: true,
      organic_certified: true,
      other_certifications: []
    },
    status: 'out_of_stock',
    featured: false,
    is_new: false,
    is_best: false,
    stats: {
      view_count: 0,
      inquiry_count: 0,
      brochure_download_count: 0
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export default function InventoryPage() {
  const [products, setProducts] = useState<InventoryItem[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingStock, setEditingStock] = useState<number>(0);
  
  const inventoryItems: InventoryItem[] = products.map(product => ({
    ...product,
    stock_status: product.stock_quantity === 0 
      ? 'out_of_stock' 
      : product.stock_quantity < 20 
        ? 'low_stock' 
        : 'in_stock',
    stock_alert_level: 20
  }));

  const stats = {
    total: inventoryItems.length,
    in_stock: inventoryItems.filter(item => item.stock_status === 'in_stock').length,
    low_stock: inventoryItems.filter(item => item.stock_status === 'low_stock').length,
    out_of_stock: inventoryItems.filter(item => item.stock_status === 'out_of_stock').length,
    total_value: inventoryItems.reduce((sum, item) => sum + (item.price * item.stock_quantity), 0)
  };

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = !searchTerm || 
      item.name.ko.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || item.category === filterCategory;
    const matchesStatus = !filterStatus || item.stock_status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleStockUpdate = async (productId: string) => {
    setProducts(prevProducts => 
      prevProducts.map(p => 
        p.id === productId 
          ? { 
              ...p, 
              stock_quantity: editingStock,
              stock_status: editingStock === 0 
                ? 'out_of_stock' 
                : editingStock < 20 
                  ? 'low_stock' 
                  : 'in_stock'
            }
          : p
      )
    );
    setEditingId(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in_stock':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">재고 있음</span>;
      case 'low_stock':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">재고 부족</span>;
      case 'out_of_stock':
        return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">품절</span>;
      default:
        return null;
    }
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">재고 관리</h1>
          <p className="text-gray-600">제품 재고를 실시간으로 관리하고 모니터링합니다.</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <Package className="w-8 h-8 text-gray-400" />
              <span className="text-2xl font-bold text-gray-900">{stats.total}</span>
            </div>
            <p className="text-sm text-gray-600">전체 제품</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-green-500" />
              <span className="text-2xl font-bold text-gray-900">{stats.in_stock}</span>
            </div>
            <p className="text-sm text-gray-600">재고 있음</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
              <span className="text-2xl font-bold text-gray-900">{stats.low_stock}</span>
            </div>
            <p className="text-sm text-gray-600">재고 부족</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <TrendingDown className="w-8 h-8 text-red-500" />
              <span className="text-2xl font-bold text-gray-900">{stats.out_of_stock}</span>
            </div>
            <p className="text-sm text-gray-600">품절</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">총 재고 가치</span>
            </div>
            <p className="text-xl font-bold text-emerald-600">
              ₩{stats.total_value.toLocaleString()}
            </p>
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
                  placeholder="제품명 또는 SKU로 검색..."
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
              <option value="">모든 카테고리</option>
              <option value="health">건강기능식품</option>
              <option value="vitamin">비타민/미네랄</option>
              <option value="diet">다이어트</option>
              <option value="beauty">뷰티/이너뷰티</option>
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">모든 상태</option>
              <option value="in_stock">재고 있음</option>
              <option value="low_stock">재고 부족</option>
              <option value="out_of_stock">품절</option>
            </select>
            
            <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              내보내기
            </button>
            
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
              <Upload className="w-4 h-4" />
              가져오기
            </button>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    제품
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    카테고리
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    현재 재고
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    알림 수준
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    재고 가치
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          {item.images?.[0] ? (
                            <img
                              className="h-10 w-10 rounded-lg object-cover"
                              src={item.images[0]}
                              alt={item.name.ko}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                              <Package className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{item.name.ko}</div>
                          <div className="text-sm text-gray-500">{item.name.en}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.sku || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {editingId === item.id ? (
                        <input
                          type="number"
                          value={editingStock}
                          onChange={(e) => setEditingStock(parseInt(e.target.value) || 0)}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          autoFocus
                        />
                      ) : (
                        <div className="text-sm font-medium text-gray-900">{item.stock_quantity}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-900">{item.stock_alert_level}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {getStatusBadge(item.stock_status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm font-medium text-gray-900">
                        ₩{(item.price * item.stock_quantity).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {editingId === item.id ? (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleStockUpdate(item.id)}
                            className="text-emerald-600 hover:text-emerald-700"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-gray-400 hover:text-gray-500"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingId(item.id);
                            setEditingStock(item.stock_quantity);
                          }}
                          className="text-gray-400 hover:text-emerald-600"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
}