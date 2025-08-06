'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { FileText, Download, Eye, Star, ArrowRight, File } from 'lucide-react';
import { getDocuments, type Document } from '@/lib/supabase/documents';

export default function ResourcesSection() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const data = await getDocuments({ 
        published_only: true,
        featured_only: true 
      });
      setDocuments(data.slice(0, 4)); // 최대 4개만 표시
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType?.includes('pdf')) return '📄';
    if (fileType?.includes('image')) return '🖼️';
    if (fileType?.includes('text')) return '📝';
    return '📎';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1024 / 1024).toFixed(1) + ' MB';
  };

  return (
    <section ref={ref} className="py-20 lg:py-32 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-emerald-600 font-semibold mb-4 text-lg">RESOURCES</h2>
          <h3 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
            자료실
          </h3>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            CMWay의 제품 자료, 연구 보고서, 인증서 등 다양한 자료를 확인하세요
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                <div className="w-16 h-16 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : documents.length > 0 ? (
          <>
            {/* Documents Grid - 문서 개수에 따라 그리드 조정 */}
            <div className={`grid gap-6 mb-12 ${
              documents.length === 1 
                ? 'grid-cols-1 max-w-md mx-auto' 
                : documents.length === 2
                ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto'
                : documents.length === 3
                ? 'grid-cols-1 md:grid-cols-3 max-w-5xl mx-auto'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
            }`}>
              {documents.map((doc, index) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  <div className="p-6">
                    {/* File Icon */}
                    <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {getFileIcon(doc.file_type)}
                    </div>
                    
                    {/* Featured Badge */}
                    {doc.is_featured && (
                      <div className="flex items-center gap-1 mb-3">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-xs text-yellow-600 font-semibold">주요 자료</span>
                      </div>
                    )}
                    
                    {/* Title */}
                    <h4 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                      {doc.title.ko}
                    </h4>
                    
                    {/* Description */}
                    {doc.description?.ko && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {doc.description.ko}
                      </p>
                    )}
                    
                    {/* Stats */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {doc.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="w-3 h-3" />
                        {doc.downloads}
                      </span>
                      <span>{formatFileSize(doc.file_size)}</span>
                    </div>
                    
                    {/* View Button */}
                    <Link
                      href={`/resources/${doc.id}`}
                      className="block w-full py-2 px-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white text-center rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 font-medium"
                    >
                      자료 보기
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* View All Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center"
            >
              <Link
                href="/resources"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-emerald-600 text-emerald-600 rounded-full hover:bg-emerald-600 hover:text-white transition-all duration-300 font-semibold text-lg group"
              >
                <File className="w-5 h-5" />
                전체 자료 보기
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <File className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-6">등록된 자료가 없습니다.</p>
            <Link
              href="/resources"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              자료실 둘러보기
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}