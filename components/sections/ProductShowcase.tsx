'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { useCategories } from '@/lib/hooks/use-cms';

const defaultCategories = [
  {
    id: 'cat-001',
    slug: 'chlorophyll-liquid',
    title: '클로로필a 원액',
    description: '99.9% 고순도 클로로필a 원액 제품',
    image: '/images/chlorophyll-leaflet.jpg',
    hoverColor: 'hover:from-green-700/90 hover:to-green-900/90',
  },
  {
    id: 'cat-002',
    slug: 'chlorophyll-capsule',
    title: '클로로필a 캡슐',
    description: '간편하게 섭취하는 클로로필a 캡슐',
    image: '/mock/slide1.jpg',
    hoverColor: 'hover:from-emerald-700/90 hover:to-emerald-900/90',
  },
  {
    id: 'cat-003',
    slug: 'health-functional',
    title: '건강기능식품',
    description: '과학적으로 입증된 건강기능식품',
    image: '/mock/slide2.jpg',
    hoverColor: 'hover:from-blue-700/90 hover:to-blue-900/90',
  },
  {
    id: 'cat-004',
    slug: 'research-products',
    title: '연구개발 제품',
    description: '지속적인 연구를 통한 혁신 제품',
    image: '/mock/slide3.jpg',
    hoverColor: 'hover:from-purple-700/90 hover:to-purple-900/90',
  },
];

const hoverColors = [
  'hover:from-red-700/90 hover:to-red-900/90',
  'hover:from-orange-700/90 hover:to-orange-900/90',
  'hover:from-blue-700/90 hover:to-blue-900/90',
  'hover:from-teal-700/90 hover:to-teal-900/90',
];

export default function ProductShowcase() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { categories, loading } = useCategories({ featured: true });
  const [productCategories, setProductCategories] = useState(defaultCategories);

  useEffect(() => {
    if (categories && categories.length > 0) {
      const mappedCategories = categories.slice(0, 4).map((cat, index) => ({
        id: cat.id,
        slug: cat.slug,
        title: cat.name.ko || cat.name.en || '',
        description: cat.description?.ko || cat.description?.en || '',
        image: defaultCategories[index]?.image || '/mock/slide1.jpg',
        hoverColor: hoverColors[index % hoverColors.length],
        link: `/products?category=${cat.slug}` // Using slug for URL
      }));
      setProductCategories(mappedCategories);
    }
  }, [categories]);

  return (
    <section ref={ref} className="py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header - hdsgj 스타일 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-green-600 font-medium mb-4 text-lg tracking-wider">
            PRODUCT CATEGORY
          </h2>
          <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            CMWay, <strong className="text-green-600">제품소개</strong>
          </h3>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            혁신적인 기술이 접목된 최고의 건강기능식품을 소개합니다.
          </p>
        </motion.div>

        {/* Product Categories Grid - hdsgj 스타일 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {productCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * index }}
            >
              <Link href={category.link || `/products?category=${category.slug}`} className="group block">
                <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-500">
                  {/* Image Container */}
                  <div className="relative h-80 overflow-hidden">
                    <Image
                      src={category.image}
                      alt={category.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Overlay - hdsgj 스타일 그라데이션 */}
                    <div className={`absolute inset-0 bg-gradient-to-t from-gray-900/80 to-gray-900/20 transition-all duration-500 ${category.hoverColor}`} />
                    
                    {/* Content */}
                    <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                      {/* Category Icon/Circle */}
                      <div className="mb-4">
                        <div className="w-12 h-12 rounded-full border-2 border-white/50 flex items-center justify-center transition-all duration-500 group-hover:border-white group-hover:bg-white/10">
                          <span className="text-lg font-bold">{String(index + 1).padStart(2, '0')}</span>
                        </div>
                      </div>
                      
                      {/* Title */}
                      <h4 className="text-xl font-bold mb-2 transition-transform duration-500 group-hover:-translate-y-1">
                        {category.title}
                      </h4>
                      
                      {/* Description */}
                      <p className="text-gray-200 text-sm transition-all duration-500 opacity-90 group-hover:opacity-100">
                        {category.description}
                      </p>
                      
                      {/* Hover Arrow */}
                      <div className="mt-4 flex items-center text-white/80 group-hover:text-white transition-colors duration-300">
                        <span className="text-sm mr-2">자세히 보기</span>
                        <svg
                          className="w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Bottom Border Animation */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-blue-500 transform transition-transform duration-500 origin-left scale-x-0 group-hover:scale-x-100" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Section - Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-12 text-center"
        >
          <h4 className="text-2xl font-bold text-gray-900 mb-4">
            맞춤형 건강 상담 서비스
          </h4>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            전문 상담사가 고객님의 건강 상태와 라이프스타일을 분석하여
            최적의 건강기능식품을 추천해 드립니다.
          </p>
          <Link
            href="/consultation"
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-full hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            무료 건강 상담 신청
            <svg
              className="ml-2 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}