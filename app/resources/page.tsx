'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText,
  Download,
  Eye,
  Search,
  Filter,
  Loader2,
  ChevronRight,
  Star,
  Calendar,
  File,
  Home,
  ArrowLeft
} from 'lucide-react';
import { 
  getDocuments, 
  getDocumentCategories,
  incrementDownloadCount,
  type Document,
  type DocumentCategory
} from '@/lib/supabase/documents';
import Link from 'next/link';

export default function ResourcesPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [categories, setCategories] = useState<DocumentCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [docsData, catsData] = await Promise.all([
        getDocuments({ published_only: true }),
        getDocumentCategories(true)
      ]);
      setDocuments(docsData);
      setCategories(catsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (doc: Document) => {
    try {
      await incrementDownloadCount(doc.id);
      // 새 탭에서 파일 열기
      window.open(doc.file_url, '_blank');
      // 다운로드 수 업데이트
      setDocuments(docs => 
        docs.map(d => d.id === doc.id ? { ...d, downloads: d.downloads + 1 } : d)
      );
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = !searchTerm || 
      doc.title.ko.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.title.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description?.ko?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.file_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // 주요 문서
  const featuredDocuments = documents.filter(doc => doc.is_featured);

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('text')) return '📝';
    if (fileType.includes('hwp')) return '📋';
    return '📎';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1024 / 1024).toFixed(1) + ' MB';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl"
          >
            <div className="mb-6">
              <Link 
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-colors"
              >
                <Home className="w-4 h-4" />
                <span className="font-medium">메인으로</span>
              </Link>
            </div>
            <h1 className="text-4xl font-bold mb-4">자료실</h1>
            <p className="text-xl text-emerald-100">
              CMWay의 다양한 제품 자료와 인증서를 확인하실 수 있습니다.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="자료 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">모든 카테고리</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name.ko}</option>
                ))}
              </select>

              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewType('grid')}
                  className={`px-3 py-2 rounded ${
                    viewType === 'grid' 
                      ? 'bg-white shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewType('list')}
                  className={`px-3 py-2 rounded ${
                    viewType === 'list' 
                      ? 'bg-white shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Documents */}
        {featuredDocuments.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">주요 자료</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredDocuments.map((doc) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all border-2 border-emerald-100"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-4xl">{getFileIcon(doc.file_type)}</div>
                      <Star className="w-5 h-5 text-yellow-500" />
                    </div>
                    
                    <h3 className="font-bold text-gray-900 mb-2">{doc.title.ko}</h3>
                    {doc.description?.ko && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {doc.description.ko}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <span>{formatFileSize(doc.file_size)}</span>
                      <span>다운로드 {doc.downloads}회</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Link
                        href={`/resources/${doc.id}`}
                        className="flex-1 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors text-center text-sm font-medium"
                      >
                        보기
                      </Link>
                      <button
                        onClick={() => handleDownload(doc)}
                        className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium flex items-center justify-center gap-1"
                      >
                        <Download className="w-4 h-4" />
                        다운로드
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* All Documents */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {selectedCategory === 'all' ? '전체 자료' : 
              categories.find(c => c.id === selectedCategory)?.name.ko || '자료'}
          </h2>
          
          {viewType === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredDocuments.map((doc, index) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all"
                >
                  <div className="p-6">
                    <div className="text-4xl mb-4">{getFileIcon(doc.file_type)}</div>
                    
                    <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">
                      {doc.title.ko}
                    </h3>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <span>{formatFileSize(doc.file_size)}</span>
                      <span>{doc.downloads} 다운로드</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Link
                        href={`/resources/${doc.id}`}
                        className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors text-center text-sm"
                      >
                        보기
                      </Link>
                      <button
                        onClick={() => handleDownload(doc)}
                        className="flex-1 px-3 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors text-sm"
                      >
                        다운로드
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      파일
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      카테고리
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      크기
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      다운로드
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      작업
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredDocuments.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">{getFileIcon(doc.file_type)}</span>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {doc.title.ko}
                            </div>
                            {doc.description?.ko && (
                              <div className="text-sm text-gray-500">
                                {doc.description.ko}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                          {doc.category?.name.ko}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatFileSize(doc.file_size)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {doc.downloads}회
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/resources/${doc.id}`}
                            className="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                          >
                            보기
                          </Link>
                          <button
                            onClick={() => handleDownload(doc)}
                            className="px-3 py-1 text-sm bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
                          >
                            다운로드
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

        {filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <File className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}