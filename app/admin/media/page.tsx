'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  Image as ImageIcon, 
  Film, 
  FileText, 
  Download,
  Trash2,
  Edit2,
  Search,
  Filter,
  Grid,
  List,
  Eye,
  Copy,
  Check,
  X,
  Folder,
  FolderOpen,
  Star,
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadFile, uploadFiles, deleteFile, getImages, getVideos } from '@/lib/supabase/storage';

interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'document' | 'other';
  size: number;
  dimensions?: { width: number; height: number };
  folder: string;
  bucket?: string;
  path?: string;
  tags: string[];
  alt_text?: string;
  is_hero?: boolean; // 히어로 이미지 여부
  created_at: string;
  updated_at: string;
}

// Mock data with hero images
const mockMediaItems: MediaItem[] = [
  {
    id: '1',
    name: 'hero-main-1.jpg',
    url: '/images/hero/slide1.jpg',
    type: 'image',
    size: 524288,
    dimensions: { width: 1920, height: 1080 },
    folder: 'hero',
    tags: ['히어로', '메인', '슬라이드'],
    alt_text: '건강한 라이프스타일',
    is_hero: true,
    created_at: '2024-12-01T00:00:00Z',
    updated_at: '2024-12-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'hero-main-2.jpg',
    url: '/images/hero/slide2.jpg',
    type: 'image',
    size: 456789,
    dimensions: { width: 1920, height: 1080 },
    folder: 'hero',
    tags: ['히어로', '메인', '슬라이드'],
    alt_text: '프리미엄 건강 제품',
    is_hero: true,
    created_at: '2024-12-02T00:00:00Z',
    updated_at: '2024-12-02T00:00:00Z'
  },
  {
    id: '3',
    name: 'hero-main-3.jpg',
    url: '/images/hero/slide3.jpg',
    type: 'image',
    size: 398765,
    dimensions: { width: 1920, height: 1080 },
    folder: 'hero',
    tags: ['히어로', '메인', '슬라이드'],
    alt_text: '건강한 가족',
    is_hero: true,
    created_at: '2024-12-03T00:00:00Z',
    updated_at: '2024-12-03T00:00:00Z'
  },
  {
    id: '4',
    name: 'product-vitamin-c.jpg',
    url: '/images/products/vitamin-c.jpg',
    type: 'image',
    size: 234567,
    dimensions: { width: 800, height: 800 },
    folder: 'products',
    tags: ['제품', '비타민'],
    alt_text: '비타민 C 제품',
    is_hero: false,
    created_at: '2024-12-10T00:00:00Z',
    updated_at: '2024-12-10T00:00:00Z'
  },
  {
    id: '5',
    name: 'blog-health-tips.jpg',
    url: '/images/blog/health-tips.jpg',
    type: 'image',
    size: 345678,
    dimensions: { width: 1200, height: 628 },
    folder: 'blog',
    tags: ['블로그', '건강팁'],
    alt_text: '건강 팁 이미지',
    is_hero: false,
    created_at: '2024-12-15T00:00:00Z',
    updated_at: '2024-12-15T00:00:00Z'
  }
];

const folders = [
  { name: 'all', label: '전체', icon: Folder },
  { name: 'hero', label: '히어로 이미지', icon: Star },
  { name: 'products', label: '제품', icon: Folder },
  { name: 'blog', label: '블로그', icon: Folder },
  { name: 'banners', label: '배너', icon: Folder },
  { name: 'icons', label: '아이콘', icon: Folder },
  { name: 'documents', label: '문서', icon: FileText }
];

export default function MediaPage() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Supabase Storage에서 미디어 파일 가져오기
  useEffect(() => {
    fetchMediaItems();
  }, []);

  const fetchMediaItems = async () => {
    setLoading(true);
    try {
      const [images, videos] = await Promise.all([
        getImages(),
        getVideos()
      ]);
      
      const allItems: MediaItem[] = [];
      
      // 이미지 처리
      images.forEach(img => {
        allItems.push({
          id: img.id,
          name: img.name,
          url: img.url,
          type: 'image',
          size: img.size,
          folder: 'images',
          bucket: 'images',
          path: img.path,
          tags: [],
          is_hero: false,
          created_at: img.created_at,
          updated_at: img.created_at
        });
      });
      
      // 비디오 처리
      videos.forEach(vid => {
        allItems.push({
          id: vid.id,
          name: vid.name,
          url: vid.url,
          type: 'video',
          size: vid.size,
          folder: 'videos',
          bucket: 'videos',
          path: vid.path,
          tags: [],
          is_hero: false,
          created_at: vid.created_at,
          updated_at: vid.created_at
        });
      });
      
      setMediaItems(allItems);
    } catch (error) {
      console.error('Error fetching media:', error);
      toast.error('미디어 파일을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = mediaItems.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.alt_text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesFolder = selectedFolder === 'all' || item.folder === selectedFolder;
    return matchesSearch && matchesType && matchesFolder;
  });

  const stats = {
    total: mediaItems.length,
    images: mediaItems.filter(item => item.type === 'image').length,
    videos: mediaItems.filter(item => item.type === 'video').length,
    documents: mediaItems.filter(item => item.type === 'document').length,
    totalSize: mediaItems.reduce((sum, item) => sum + item.size, 0),
    heroImages: mediaItems.filter(item => item.is_hero).length
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleCopyUrl = (item: MediaItem) => {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    toast.success('URL이 복사되었습니다.');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string) => {
    const item = mediaItems.find(m => m.id === id);
    if (!item) return;
    
    if (confirm('이 파일을 삭제하시겠습니까?')) {
      try {
        if (item.bucket && item.path) {
          await deleteFile(item.bucket, item.path);
        }
        setMediaItems(mediaItems.filter(m => m.id !== id));
        toast.success('파일이 삭제되었습니다.');
      } catch (error) {
        console.error('Delete error:', error);
        toast.error('파일 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const handleBulkDelete = async () => {
    if (confirm(`선택한 ${selectedItems.length}개의 파일을 삭제하시겠습니까?`)) {
      try {
        const deletePromises = selectedItems.map(id => {
          const item = mediaItems.find(m => m.id === id);
          if (item?.bucket && item?.path) {
            return deleteFile(item.bucket, item.path);
          }
          return Promise.resolve();
        });
        
        await Promise.all(deletePromises);
        setMediaItems(mediaItems.filter(item => !selectedItems.includes(item.id)));
        setSelectedItems([]);
        toast.success('선택한 파일들이 삭제되었습니다.');
      } catch (error) {
        console.error('Bulk delete error:', error);
        toast.error('일부 파일 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const handleEdit = (item: MediaItem) => {
    setEditingItem(item);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (editingItem) {
      setMediaItems(mediaItems.map(item =>
        item.id === editingItem.id ? editingItem : item
      ));
      toast.success('파일 정보가 수정되었습니다.');
      setShowEditModal(false);
      setEditingItem(null);
    }
  };

  const toggleHeroImage = (item: MediaItem) => {
    setMediaItems(mediaItems.map(m =>
      m.id === item.id ? { ...m, is_hero: !m.is_hero } : m
    ));
    toast.success(item.is_hero ? '히어로 이미지에서 제거되었습니다.' : '히어로 이미지로 설정되었습니다.');
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedItems(filteredItems.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return <ImageIcon className="w-4 h-4" />;
      case 'video': return <Film className="w-4 h-4" />;
      case 'document': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">미디어 관리</h1>
            <p className="text-gray-600">이미지, 동영상, 문서 등 미디어 파일을 관리합니다.</p>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            파일 업로드
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">전체 파일</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Folder className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">히어로 이미지</p>
                <p className="text-2xl font-bold text-emerald-600">{stats.heroImages}</p>
              </div>
              <Star className="w-8 h-8 text-emerald-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">이미지</p>
                <p className="text-2xl font-bold text-gray-900">{stats.images}</p>
              </div>
              <ImageIcon className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">동영상</p>
                <p className="text-2xl font-bold text-gray-900">{stats.videos}</p>
              </div>
              <Film className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">문서</p>
                <p className="text-2xl font-bold text-gray-900">{stats.documents}</p>
              </div>
              <FileText className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">총 용량</p>
                <p className="text-lg font-bold text-gray-900">{formatFileSize(stats.totalSize)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar - Folders */}
          <div className="w-64 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-4">폴더</h3>
            <div className="space-y-2">
              {folders.map(folder => (
                <button
                  key={folder.name}
                  onClick={() => setSelectedFolder(folder.name)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    selectedFolder === folder.name
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {selectedFolder === folder.name ? (
                    <FolderOpen className="w-5 h-5" />
                  ) : (
                    <folder.icon className="w-5 h-5" />
                  )}
                  <span className="flex-1">{folder.label}</span>
                  {folder.name !== 'all' && (
                    <span className="text-xs text-gray-500">
                      {mediaItems.filter(item => 
                        folder.name === 'hero' ? item.is_hero : item.folder === folder.name
                      ).length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="파일명, 태그로 검색..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
                
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all">모든 유형</option>
                  <option value="image">이미지</option>
                  <option value="video">동영상</option>
                  <option value="document">문서</option>
                </select>

                <div className="flex items-center gap-2 border-l pl-4">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-500 hover:bg-gray-100'}`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-500 hover:bg-gray-100'}`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {selectedItems.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                  <span className="text-blue-700">{selectedItems.length}개 선택됨</span>
                  <button
                    onClick={handleBulkDelete}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    선택 삭제
                  </button>
                </div>
              )}
            </div>

            {/* Media Grid/List */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredItems.map(item => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="relative aspect-square bg-gray-100">
                      {item.type === 'image' ? (
                        <img
                          src={item.url}
                          alt={item.alt_text || item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          {getTypeIcon(item.type)}
                        </div>
                      )}
                      
                      {item.is_hero && (
                        <div className="absolute top-2 left-2 px-2 py-1 bg-emerald-600 text-white text-xs rounded">
                          히어로
                        </div>
                      )}

                      <div className="absolute top-2 right-2">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => handleSelectItem(item.id)}
                          className="rounded border-gray-300 text-emerald-600"
                        />
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                        <div className="flex items-center justify-between">
                          <span className="text-white text-xs">{formatFileSize(item.size)}</span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => toggleHeroImage(item)}
                              className={`p-1 rounded ${item.is_hero ? 'text-yellow-400' : 'text-white/60 hover:text-white'}`}
                              title={item.is_hero ? '히어로 이미지 해제' : '히어로 이미지로 설정'}
                            >
                              <Star className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleCopyUrl(item)}
                              className="p-1 text-white/60 hover:text-white"
                            >
                              {copiedId === item.id ? (
                                <Check className="w-4 h-4 text-green-400" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => handleEdit(item)}
                              className="p-1 text-white/60 hover:text-white"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-1 text-white/60 hover:text-white"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{item.folder}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                          onChange={handleSelectAll}
                          className="rounded border-gray-300 text-emerald-600"
                        />
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        파일
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        폴더
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        유형
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        크기
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        히어로
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        작업
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredItems.map(item => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item.id)}
                            onChange={() => handleSelectItem(item.id)}
                            className="rounded border-gray-300 text-emerald-600"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {item.type === 'image' ? (
                              <img
                                src={item.url}
                                alt={item.alt_text || item.name}
                                className="w-10 h-10 object-cover rounded"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                                {getTypeIcon(item.type)}
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-medium text-gray-900">{item.name}</p>
                              {item.alt_text && (
                                <p className="text-xs text-gray-500">{item.alt_text}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-900">{item.folder}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                            {item.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-sm text-gray-900">{formatFileSize(item.size)}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => toggleHeroImage(item)}
                            className={item.is_hero ? 'text-yellow-500' : 'text-gray-300'}
                          >
                            <Star className="w-5 h-5" />
                          </button>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleCopyUrl(item)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              {copiedId === item.id ? (
                                <Check className="w-4 h-4 text-green-500" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => handleEdit(item)}
                              className="text-gray-400 hover:text-blue-600"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="text-gray-400 hover:text-red-600"
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
        </div>
      </motion.div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-2xl w-full"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">파일 업로드</h2>
            </div>
            <div className="p-6">
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-emerald-400 transition-colors"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add('border-emerald-400', 'bg-emerald-50');
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('border-emerald-400', 'bg-emerald-50');
                }}
                onDrop={async (e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('border-emerald-400', 'bg-emerald-50');
                  const files = Array.from(e.dataTransfer.files);
                  setSelectedFiles(files);
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setSelectedFiles(files);
                  }}
                  className="hidden"
                />
                {uploading ? (
                  <div>
                    <Loader2 className="w-12 h-12 text-emerald-600 mx-auto mb-4 animate-spin" />
                    <p className="text-gray-600">업로드 중...</p>
                  </div>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">파일을 드래그하거나 클릭하여 업로드</p>
                    <p className="text-sm text-gray-500">최대 50MB, 이미지(JPG, PNG, GIF, WebP) 또는 비디오(MP4)</p>
                    <button 
                      type="button"
                      className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                    >
                      파일 선택
                    </button>
                  </>
                )}
              </div>
              
              {selectedFiles.length > 0 && !uploading && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">선택된 파일 ({selectedFiles.length}개)</h3>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-2">
                          {file.type.startsWith('image/') ? (
                            <ImageIcon className="w-4 h-4 text-blue-500" />
                          ) : (
                            <Film className="w-4 h-4 text-purple-500" />
                          )}
                          <span className="text-sm text-gray-700">{file.name}</span>
                          <span className="text-xs text-gray-500">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedFiles([]);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                disabled={uploading}
              >
                취소
              </button>
              <button 
                onClick={async () => {
                  if (selectedFiles.length === 0) {
                    toast.error('업로드할 파일을 선택해주세요.');
                    return;
                  }
                  
                  setUploading(true);
                  try {
                    const { uploadFiles } = await import('@/lib/supabase/storage');
                    const uploadedFiles = await uploadFiles(selectedFiles);
                    
                    // 업로드된 파일을 미디어 아이템에 추가
                    const newItems: MediaItem[] = uploadedFiles.map(file => ({
                      id: file.id,
                      name: file.name,
                      url: file.url,
                      type: file.type,
                      size: file.size,
                      folder: file.type === 'image' ? 'images' : 'videos',
                      bucket: file.bucket,
                      path: file.path,
                      tags: [],
                      is_hero: false,
                      created_at: file.created_at,
                      updated_at: file.created_at
                    }));
                    
                    setMediaItems([...newItems, ...mediaItems]);
                    toast.success(`${uploadedFiles.length}개 파일이 업로드되었습니다.`);
                    setShowUploadModal(false);
                    setSelectedFiles([]);
                  } catch (error: any) {
                    console.error('Upload error:', error);
                    toast.error(error.message || '파일 업로드 중 오류가 발생했습니다.');
                  } finally {
                    setUploading(false);
                  }
                }}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                disabled={uploading || selectedFiles.length === 0}
              >
                {uploading ? '업로드 중...' : '업로드'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-2xl w-full"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">파일 정보 수정</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">파일명</label>
                <input
                  type="text"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">대체 텍스트</label>
                <input
                  type="text"
                  value={editingItem.alt_text || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, alt_text: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">폴더</label>
                <select
                  value={editingItem.folder}
                  onChange={(e) => setEditingItem({ ...editingItem, folder: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {folders.filter(f => f.name !== 'all' && f.name !== 'hero').map(folder => (
                    <option key={folder.name} value={folder.name}>{folder.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editingItem.is_hero || false}
                    onChange={(e) => setEditingItem({ ...editingItem, is_hero: e.target.checked })}
                    className="rounded border-gray-300 text-emerald-600"
                  />
                  <span className="text-sm font-medium text-gray-700">히어로 이미지로 사용</span>
                </label>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingItem(null);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
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