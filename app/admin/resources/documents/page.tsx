'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  Plus, 
  Edit2, 
  Trash2, 
  FileText,
  File,
  Download,
  Eye,
  EyeOff,
  Search,
  Filter,
  Loader2,
  Image as ImageIcon,
  Star
} from 'lucide-react';
import { 
  getDocuments, 
  createDocument, 
  updateDocument, 
  deleteDocument,
  getDocumentCategories,
  type Document,
  type DocumentCategory
} from '@/lib/supabase/documents';
import { uploadFile } from '@/lib/supabase/storage';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import toast from 'react-hot-toast';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [categories, setCategories] = useState<DocumentCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [formData, setFormData] = useState<Partial<Document>>({
    title: { ko: '', en: '' },
    description: { ko: '', en: '' },
    category_id: '',
    tags: [],
    is_featured: false,
    is_published: false,
    display_order: 0
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const supabase = createClientComponentClient();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [docsData, catsData] = await Promise.all([
        getDocuments(),
        getDocumentCategories()
      ]);
      setDocuments(docsData);
      setCategories(catsData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      setUploading(true);
      
      // 파일 업로드
      const ext = file.name.split('.').pop()?.toLowerCase();
      const fileName = `documents/${Date.now()}-${file.name}`;
      
      // 파일 타입에 따라 버킷 선택
      let bucket = 'documents';
      if (file.type.startsWith('image/')) {
        bucket = 'images';
      }
      
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // 공개 URL 가져오기
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      // 텍스트 파일인 경우 내용 읽기
      let contentText = undefined;
      if (ext === 'txt') {
        contentText = await file.text();
      }

      return {
        file_url: publicUrl,
        file_name: file.name,
        file_type: file.type || 'application/octet-stream',
        file_size: file.size,
        content_text: contentText
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('파일 업로드에 실패했습니다.');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title?.ko || !formData.category_id) {
      toast.error('제목과 카테고리는 필수입니다.');
      return;
    }

    try {
      let fileData = {};
      
      // 새 문서인 경우 파일 업로드
      if (!editingDocument && selectedFile) {
        const uploadResult = await handleFileUpload(selectedFile);
        if (!uploadResult) return;
        fileData = uploadResult;
      }

      const documentData = {
        ...formData,
        ...fileData,
        views: formData.views || 0,
        downloads: formData.downloads || 0
      };

      if (editingDocument) {
        await updateDocument(editingDocument.id, documentData);
        toast.success('문서가 수정되었습니다.');
      } else {
        await createDocument(documentData as any);
        toast.success('문서가 추가되었습니다.');
      }

      setShowModal(false);
      setEditingDocument(null);
      setSelectedFile(null);
      await loadData();
    } catch (error) {
      console.error('Error saving document:', error);
      toast.error('저장 중 오류가 발생했습니다.');
    }
  };

  const handleEdit = (doc: Document) => {
    setEditingDocument(doc);
    setFormData(doc);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingDocument(null);
    setFormData({
      title: { ko: '', en: '' },
      description: { ko: '', en: '' },
      category_id: categories[0]?.id || '',
      tags: [],
      is_featured: false,
      is_published: false,
      display_order: documents.length
    });
    setSelectedFile(null);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('이 문서를 삭제하시겠습니까?')) {
      try {
        await deleteDocument(id);
        toast.success('문서가 삭제되었습니다.');
        await loadData();
      } catch (error) {
        console.error('Error deleting document:', error);
        toast.error('삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const handleTogglePublish = async (doc: Document) => {
    try {
      await updateDocument(doc.id, { is_published: !doc.is_published });
      await loadData();
    } catch (error) {
      console.error('Error toggling publish:', error);
      toast.error('오류가 발생했습니다.');
    }
  };

  const handleToggleFeatured = async (doc: Document) => {
    try {
      await updateDocument(doc.id, { is_featured: !doc.is_featured });
      await loadData();
    } catch (error) {
      console.error('Error toggling featured:', error);
      toast.error('오류가 발생했습니다.');
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = !searchTerm || 
      doc.title.ko.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.title.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.file_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || doc.category_id === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('text')) return '📝';
    if (fileType.includes('hwp')) return '📋';
    return '📎';
  };

  // 초기 데이터 업로드 함수
  const uploadInitialFiles = async () => {
    try {
      setLoading(true);
      toast('파일들을 업로드하는 중...', { icon: 'ℹ️' });

      // 카테고리 생성
      const categories = [
        { name: { ko: '제품 자료', en: 'Product Documents' }, slug: 'product' },
        { name: { ko: '인증서', en: 'Certificates' }, slug: 'certificates' },
        { name: { ko: '브로슈어', en: 'Brochures' }, slug: 'brochures' }
      ];

      // 파일 목록
      const files = [
        { 
          name: 'CM클로로필a 시험성적서.pdf', 
          category: 'product',
          title: { ko: 'CM클로로필a 시험성적서', en: 'CM Chlorophyll-a Test Report' }
        },
        { 
          name: 'brochure.pdf', 
          category: 'brochures',
          title: { ko: '회사 브로슈어', en: 'Company Brochure' }
        },
        { 
          name: 'preschool 수료증1.pdf', 
          category: 'certificates',
          title: { ko: 'Preschool 수료증 1', en: 'Preschool Certificate 1' }
        },
        { 
          name: 'preschool 수료증2.pdf', 
          category: 'certificates',
          title: { ko: 'Preschool 수료증 2', en: 'Preschool Certificate 2' }
        },
        { 
          name: '비젼리더십 수료증.pdf', 
          category: 'certificates',
          title: { ko: '비전리더십 수료증', en: 'Vision Leadership Certificate' }
        },
        { 
          name: '씨엠바이오 항암효능관련 동물실험 보고서.pdf', 
          category: 'product',
          title: { ko: '씨엠바이오 항암효능 동물실험 보고서', en: 'CM Bio Anti-cancer Animal Test Report' }
        },
        { 
          name: '청년창업사관학교 졸업장.pdf', 
          category: 'certificates',
          title: { ko: '청년창업사관학교 졸업장', en: 'Youth Startup Academy Diploma' }
        },
        { 
          name: '클로로필 안내 리플렛(090107)-02.jpg', 
          category: 'product',
          title: { ko: '클로로필 안내 리플렛', en: 'Chlorophyll Information Leaflet' }
        },
        { 
          name: '논문정리.txt', 
          category: 'product',
          title: { ko: '클로로필a 논문 정리', en: 'Chlorophyll-a Research Summary' }
        }
      ];

      toast.success('파일 정보가 준비되었습니다. 실제 업로드는 각 파일을 개별적으로 진행해주세요.');
      
    } catch (error) {
      console.error('Error uploading initial files:', error);
      toast.error('초기 파일 업로드에 실패했습니다.');
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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">자료실 관리</h1>
            <p className="text-gray-600">PDF, 이미지 등 다양한 자료를 관리합니다.</p>
          </div>
          <div className="flex gap-3">
            {documents.length === 0 && (
              <button
                onClick={uploadInitialFiles}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                초기 파일 정보 등록
              </button>
            )}
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              문서 추가
            </button>
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
                  placeholder="문서 검색..."
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
                <option key={cat.id} value={cat.id}>{cat.name.ko}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{getFileIcon(doc.file_type)}</div>
                  <div className="flex items-center gap-2">
                    {doc.is_featured && (
                      <Star className="w-4 h-4 text-yellow-500" />
                    )}
                    {doc.is_published ? (
                      <Eye className="w-4 h-4 text-green-500" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </div>
                
                <h3 className="font-medium text-gray-900 mb-1">{doc.title.ko}</h3>
                <p className="text-sm text-gray-500 mb-2">{doc.title.en}</p>
                
                {doc.description?.ko && (
                  <p className="text-sm text-gray-600 mb-3">{doc.description.ko}</p>
                )}
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span>{(doc.file_size / 1024 / 1024).toFixed(2)} MB</span>
                  <span>조회 {doc.views} · 다운로드 {doc.downloads}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleFeatured(doc)}
                    className={`p-2 rounded ${
                      doc.is_featured ? 'text-yellow-500 bg-yellow-50' : 'text-gray-400 hover:bg-gray-50'
                    }`}
                    title="주요 문서"
                  >
                    <Star className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleTogglePublish(doc)}
                    className={`p-2 rounded ${
                      doc.is_published ? 'text-green-500 bg-green-50' : 'text-gray-400 hover:bg-gray-50'
                    }`}
                    title={doc.is_published ? '비공개' : '게시'}
                  >
                    {doc.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleEdit(doc)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    title="수정"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                    title="삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editingDocument ? '문서 수정' : '문서 추가'}
              </h2>
            </div>

            <div className="p-6 space-y-6">
              {/* File Upload */}
              {!editingDocument && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    파일 선택 *
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.txt,.jpg,.jpeg,.png,.hwp,.hwpx"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  {selectedFile && (
                    <p className="mt-2 text-sm text-gray-600">
                      선택된 파일: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>
              )}

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  카테고리 *
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">선택하세요</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name.ko}</option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    제목 (한국어) *
                  </label>
                  <input
                    type="text"
                    value={formData.title?.ko || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      title: { ...formData.title!, ko: e.target.value }
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
                    value={formData.title?.en || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      title: { ...formData.title!, en: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    설명 (한국어)
                  </label>
                  <textarea
                    value={formData.description?.ko || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      description: { ...formData.description!, ko: e.target.value }
                    })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    설명 (영어)
                  </label>
                  <textarea
                    value={formData.description?.en || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      description: { ...formData.description!, en: e.target.value }
                    })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Options */}
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="rounded border-gray-300 text-emerald-600"
                  />
                  <span className="text-sm font-medium text-gray-700">주요 문서</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                    className="rounded border-gray-300 text-emerald-600"
                  />
                  <span className="text-sm font-medium text-gray-700">즉시 게시</span>
                </label>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingDocument(null);
                  setSelectedFile(null);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                disabled={uploading}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {uploading && <Loader2 className="w-4 h-4 animate-spin" />}
                저장
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}