'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Download,
  Eye,
  Calendar,
  File,
  Loader2,
  Maximize,
  Minimize
} from 'lucide-react';
import { 
  getDocument,
  incrementDownloadCount,
  type Document
} from '@/lib/supabase/documents';
import Link from 'next/link';

export default function DocumentViewPage() {
  const params = useParams();
  const router = useRouter();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    if (params.id) {
      loadDocument(params.id as string);
    }
  }, [params.id]);

  const loadDocument = async (id: string) => {
    setLoading(true);
    try {
      const data = await getDocument(id);
      setDocument(data);
    } catch (error) {
      console.error('Error loading document:', error);
      router.push('/resources');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!document) return;
    
    try {
      await incrementDownloadCount(document.id);
      window.open(document.file_url, '_blank');
      setDocument(prev => prev ? { ...prev, downloads: prev.downloads + 1 } : null);
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  };

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  const getFileIcon = (fileType: string, fileName?: string) => {
    if (fileType?.includes('pdf')) return '📄';
    if (fileType?.includes('image')) return '🖼️';
    if (fileType?.includes('text')) return '📝';
    if (fileType?.includes('hwp') || fileName?.endsWith('.hwp')) return '📋';
    return '📎';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1024 / 1024).toFixed(1) + ' MB';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <File className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">문서를 찾을 수 없습니다.</p>
          <Link
            href="/resources"
            className="mt-4 inline-block px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            자료실로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const isPDF = document.file_type?.includes('pdf');
  const isImage = document.file_type?.includes('image');
  const isText = document.file_type?.includes('text') || document.file_name?.endsWith('.txt');
  const isHWP = document.file_type?.includes('hwp') || document.file_name?.endsWith('.hwp');

  return (
    <div className={`min-h-screen bg-gray-50 ${fullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header */}
      {!fullscreen && (
        <div className="bg-white border-b">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link
                  href="/resources"
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{document.title.ko}</h1>
                  {document.title.en && (
                    <p className="text-sm text-gray-500">{document.title.en}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {(isPDF || isImage) && (
                  <button
                    onClick={toggleFullscreen}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title={fullscreen ? '전체화면 종료' : '전체화면'}
                  >
                    {fullscreen ? (
                      <Minimize className="w-5 h-5" />
                    ) : (
                      <Maximize className="w-5 h-5" />
                    )}
                  </button>
                )}
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  다운로드
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={`${fullscreen ? 'h-full' : 'container mx-auto px-6 py-8'}`}>
        <div className={`${fullscreen ? 'h-full' : 'grid grid-cols-1 lg:grid-cols-3 gap-8'}`}>
          {/* Document Viewer */}
          <div className={`${fullscreen ? 'h-full' : 'lg:col-span-2'}`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white rounded-lg shadow-sm ${fullscreen ? 'h-full' : ''}`}
            >
              {isPDF ? (
                <div className={`${fullscreen ? 'h-full' : 'h-[800px]'} relative`}>
                  <iframe
                    src={`${document.file_url}#toolbar=1&navpanes=0&scrollbar=1`}
                    className="w-full h-full rounded-lg"
                    title={document.title.ko}
                  />
                  {fullscreen && (
                    <button
                      onClick={toggleFullscreen}
                      className="absolute top-4 right-4 p-2 bg-white rounded-lg shadow-md hover:bg-gray-100 transition-colors"
                    >
                      <Minimize className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ) : isImage ? (
                <div className={`${fullscreen ? 'h-full flex items-center justify-center bg-black' : 'p-6'}`}>
                  <img
                    src={document.file_url}
                    alt={document.title.ko}
                    className={`${fullscreen ? 'max-w-full max-h-full object-contain' : 'w-full rounded-lg'}`}
                  />
                  {fullscreen && (
                    <button
                      onClick={toggleFullscreen}
                      className="absolute top-4 right-4 p-2 bg-white rounded-lg shadow-md hover:bg-gray-100 transition-colors"
                    >
                      <Minimize className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ) : (isText || isHWP) && document.content_text ? (
                <div className="p-6">
                  {isHWP && (
                    <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <strong>참고:</strong> HWP 파일은 온라인에서 직접 볼 수 없습니다. 
                        아래는 문서의 텍스트 미리보기이며, 원본 HWP 파일은 다운로드하여 한글 프로그램에서 확인하세요.
                      </p>
                    </div>
                  )}
                  <pre className="whitespace-pre-wrap font-sans text-gray-700 bg-gray-50 p-4 rounded-lg max-h-[600px] overflow-y-auto">
                    {document.content_text}
                  </pre>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="text-6xl mb-4">{getFileIcon(document.file_type, document.file_name)}</div>
                  <p className="text-gray-600 mb-2">이 파일은 미리보기를 지원하지 않습니다.</p>
                  <p className="text-sm text-gray-500 mb-6">다운로드하여 확인해주세요.</p>
                  <button
                    onClick={handleDownload}
                    className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors inline-flex items-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    파일 다운로드
                  </button>
                </div>
              )}
            </motion.div>
          </div>

          {/* Document Info */}
          {!fullscreen && (
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-lg shadow-sm p-6 sticky top-4"
              >
                <h2 className="text-lg font-bold text-gray-900 mb-4">문서 정보</h2>
                
                <div className="space-y-4">
                  {document.description?.ko && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-1">설명</h3>
                      <p className="text-sm text-gray-600">{document.description.ko}</p>
                    </div>
                  )}
                  
                  {document.category && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-1">카테고리</h3>
                      <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm">
                        {document.category.name.ko}
                      </span>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-1">파일 정보</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>파일명: {document.file_name}</p>
                      <p>크기: {formatFileSize(document.file_size)}</p>
                      <p>형식: {document.file_type}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-1">통계</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{document.views}회 조회</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        <span>{document.downloads}회 다운로드</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-1">등록일</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(document.created_at)}</span>
                    </div>
                  </div>
                  
                  {document.tags && document.tags.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">태그</h3>
                      <div className="flex flex-wrap gap-2">
                        {document.tags.map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 pt-6 border-t">
                  <button
                    onClick={handleDownload}
                    className="w-full px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    파일 다운로드
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}