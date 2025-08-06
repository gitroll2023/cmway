'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import Link from 'next/link';

const features = [
  {
    title: 'Eco-Friendly',
    subtitle: '친환경',
    description: '환경과 미래를 생각하는 기업',
    bgImage: '/mock/slide1.jpg', // 배경 이미지 사용
  },
  {
    title: 'Satisfaction',
    subtitle: '고객 신뢰',
    description: '고객만족을 최우선으로 하는 기업',
    bgImage: '/mock/slide2.jpg',
  },
  {
    title: 'Innovation',
    subtitle: '혁신',
    description: '혁신 기술을 통해 최고의 솔루션 제공',
    bgImage: '/mock/slide3.jpg',
  },
  {
    title: 'Global Leap',
    subtitle: '도약',
    description: '책임 경영으로 세계적 기업을 향한 도약',
    bgImage: '/mock/slide1.jpg',
  },
];

export default function WhoWeAre() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const controls = useAnimation();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <section ref={ref} className="py-20 lg:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-green-600 font-medium mb-4 text-lg tracking-wider">
            WHO WE ARE
          </h2>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between">
            <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 lg:mb-0">
              건강기능식품 분야의 중심, <strong className="text-green-600">CMWay</strong>
            </h3>
            <Link
              href="/about"
              className="inline-flex items-center text-green-600 font-medium hover:text-green-700 transition-colors group"
            >
              <span className="mr-2">회사소개</span>
              <svg
                className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
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
          </div>
        </motion.div>

        {/* Features Grid - hdsgj.co.kr 스타일 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="relative group h-[400px] overflow-hidden cursor-pointer"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ 
                  backgroundImage: `url(${feature.bgImage})`,
                }}
              >
                {/* Overlay */}
                <div className={`absolute inset-0 transition-all duration-500 ${
                  hoveredIndex === index 
                    ? 'bg-gradient-to-t from-green-900/90 via-green-800/70 to-transparent' 
                    : 'bg-gradient-to-t from-gray-900/80 via-gray-800/50 to-transparent'
                }`} />
              </div>

              {/* Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                {/* Icon/Number */}
                <div className={`mb-4 transition-all duration-500 ${
                  hoveredIndex === index ? 'transform -translate-y-2' : ''
                }`}>
                  <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold">{String(index + 1).padStart(2, '0')}</span>
                  </div>
                </div>

                {/* Text Content */}
                <div className={`transition-all duration-500 ${
                  hoveredIndex === index ? 'transform -translate-y-2' : ''
                }`}>
                  <p className="text-green-300 text-sm font-medium mb-2 uppercase tracking-wider">
                    {feature.title}
                  </p>
                  <h4 className="text-2xl font-bold mb-3">
                    {feature.subtitle}
                  </h4>
                  
                  {/* Description - shows on hover */}
                  <p className={`text-gray-200 transition-all duration-500 ${
                    hoveredIndex === index 
                      ? 'opacity-100 max-h-20' 
                      : 'opacity-0 max-h-0 overflow-hidden'
                  }`}>
                    {feature.description}
                  </p>
                </div>

                {/* Bottom Line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-blue-500 transform transition-transform duration-500 origin-left scale-x-0 group-hover:scale-x-100" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            CMWay는 30년 전통의 건강기능식품 전문기업으로<br className="hidden md:block" />
            고객님의 건강한 삶을 위해 최고의 품질과 서비스를 제공합니다
          </p>
        </motion.div>
      </div>
    </section>
  );
}