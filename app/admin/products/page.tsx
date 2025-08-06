'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Package, 
  Plus, 
  Search, 
  Filter,
  Edit2,
  Trash2,
  MoreVertical,
  Image as ImageIcon,
  Tag,
  TrendingUp,
  AlertCircle,
  Download,
  Upload,
  Eye,
  Copy
} from 'lucide-react';
import { useCMSStore } from '@/store/cms';
import type { Product } from '@/lib/types';

export default function ProductsPage() {
  const { products = [], categories = [], deleteProduct } = useCMSStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortBy, setSortBy] = useState('created_desc');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = !searchTerm || 
      product.name.ko.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.name.en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || product.category === filterCategory;
    const matchesStatus = !filterStatus || 
      (filterStatus === 'active' && product.is_active) ||
      (filterStatus === 'inactive' && !product.is_active) ||
      (filterStatus === 'out_of_stock' && product.stock_quantity === 0);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'name_asc':
        return a.name.ko.localeCompare(b.name.ko);
      case 'name_desc':
        return b.name.ko.localeCompare(a.name.ko);
      case 'price_asc':
        return a.price - b.price;
      case 'price_desc':
        return b.price - a.price;
      case 'stock_asc':
        return a.stock_quantity - b.stock_quantity;
      case 'stock_desc':
        return b.stock_quantity - a.stock_quantity;
      case 'created_desc':
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  const stats = {
    total: products.length,
    active: products.filter(p => p.is_active).length,
    outOfStock: products.filter(p => p.stock_quantity === 0).length,
    totalValue: products.reduce((sum, p) => sum + (p.price * p.stock_quantity), 0)
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedProducts(sortedProducts.map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm('이 제품을 삭제하시겠습니까?')) {
      await deleteProduct(productId);
    }
  };

  const handleBulkDelete = async () => {
    if (confirm(`선택한 ${selectedProducts.length}개의 제품을 삭제하시겠습니까?`)) {
      for (const id of selectedProducts) {
        await deleteProduct(id);
      }
      setSelectedProducts([]);
    }
  };

  const handleDuplicateProduct = (product: Product) => {
    // Duplicate product logic
    console.log('Duplicate product:', product);
  };

  const getStockBadge = (quantity: number) => {
    if (quantity === 0) {
      return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">품절</span>;
    } else if (quantity < 20) {
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">재고 부족</span>;
    }
    return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">재고 있음</span>;
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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">제품 관리</h1>
            <p className="text-gray-600">제품을 추가, 수정, 삭제하고 재고를 관리합니다.</p>
          </div>
          <Link
            href="/admin/products/new"
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            제품 추가
          </Link>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <Package className="w-8 h-8 text-emerald-600" />
              <span className="text-2xl font-bold text-gray-900">{stats.total}</span>
            </div>
            <p className="text-sm text-gray-600">전체 제품</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <span className="text-2xl font-bold text-gray-900">{stats.active}</span>
            </div>
            <p className="text-sm text-gray-600">판매중</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="w-8 h-8 text-red-600" />
              <span className="text-2xl font-bold text-gray-900">{stats.outOfStock}</span>
            </div>
            <p className="text-sm text-gray-600">품절</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <Tag className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-lg font-bold text-gray-900">₩{stats.totalValue.toLocaleString()}</p>
            <p className="text-sm text-gray-600">총 재고 가치</p>
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
                  placeholder="제품명, SKU로 검색..."
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
              {categories.map(cat => (
                <option key={cat.id} value={cat.slug}>{cat.name.ko}</option>
              ))}
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">모든 상태</option>
              <option value="active">판매중</option>
              <option value="inactive">판매중지</option>
              <option value="out_of_stock">품절</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="created_desc">최신순</option>
              <option value="name_asc">이름순 (가-하)</option>
              <option value="name_desc">이름순 (하-가)</option>
              <option value="price_asc">가격 낮은순</option>
              <option value="price_desc">가격 높은순</option>
              <option value="stock_asc">재고 적은순</option>
              <option value="stock_desc">재고 많은순</option>
            </select>
            
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              내보내기
            </button>
          </div>
        </div>

        {/* Selected Actions */}
        {selectedProducts.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              <span className="text-blue-700">{selectedProducts.length}개 제품 선택됨</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 bg-white text-blue-600 rounded border border-blue-300 hover:bg-blue-50 text-sm">
                카테고리 변경
              </button>
              <button className="px-3 py-1 bg-white text-blue-600 rounded border border-blue-300 hover:bg-blue-50 text-sm">
                상태 변경
              </button>
              <button 
                onClick={handleBulkDelete}
                className="px-3 py-1 bg-white text-red-600 rounded border border-red-300 hover:bg-red-50 text-sm"
              >
                삭제
              </button>
            </div>
          </div>
        )}

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedProducts.length === sortedProducts.length && sortedProducts.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                  </th>
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
                    가격
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    재고
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
                {sortedProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => handleSelectProduct(product.id)}
                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          {product.images?.[0] ? (
                            <img
                              className="h-10 w-10 rounded-lg object-cover"
                              src={product.images[0]}
                              alt={product.name.ko}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                              <ImageIcon className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name.ko}</div>
                          {product.name.en && (
                            <div className="text-sm text-gray-500">{product.name.en}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.sku || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {categories.find(c => c.slug === product.category)?.name.ko || product.category}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm font-medium text-gray-900">
                        ₩{product.price.toLocaleString()}
                      </div>
                      {product.original_price && product.original_price > product.price && (
                        <div className="text-xs text-gray-500 line-through">
                          ₩{product.original_price.toLocaleString()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm font-medium text-gray-900">{product.stock_quantity}</div>
                      {getStockBadge(product.stock_quantity)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {product.is_active ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                          판매중
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                          판매중지
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/products/${product.slug || product.id}`}
                          className="text-gray-400 hover:text-blue-600"
                          title="미리보기"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="text-gray-400 hover:text-emerald-600"
                          title="수정"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDuplicateProduct(product)}
                          className="text-gray-400 hover:text-purple-600"
                          title="복제"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
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
          
          {sortedProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">제품이 없습니다.</p>
              <Link
                href="/admin/products/new"
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                첫 제품 추가하기
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}