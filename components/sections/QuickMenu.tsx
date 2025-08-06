'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FileText, Award, Download, Phone, BookOpen } from 'lucide-react';

const menuItems = [
  {
    icon: Award,
    title: '기업인증서',
    description: '각종 인증서 및 수상 내역을 확인하세요',
    link: '/about/certification',
    gradient: 'from-purple-600 to-purple-700',
    hoverGradient: 'hover:from-purple-700 hover:to-purple-800',
  },
  {
    icon: BookOpen,
    title: '자료실',
    description: '제품 자료, 연구 보고서, 논문 자료를 확인하세요',
    link: '/resources',
    gradient: 'from-blue-600 to-blue-700',
    hoverGradient: 'hover:from-blue-700 hover:to-blue-800',
  },
  {
    icon: FileText,
    title: '공지사항',
    description: '최신 소식과 공지사항을 확인하세요',
    link: '/news?category=notice',
    gradient: 'from-indigo-600 to-indigo-700',
    hoverGradient: 'hover:from-indigo-700 hover:to-indigo-800',
  },
  {
    icon: Phone,
    title: '상담 예약',
    description: '전문 상담사와 1:1 건강 상담을 예약하세요',
    link: '/consultation',
    gradient: 'from-emerald-600 to-emerald-700',
    hoverGradient: 'hover:from-emerald-700 hover:to-emerald-800',
  },
];

export default function QuickMenu() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-emerald-600 font-semibold mb-4 text-lg">QUICK MENU</h2>
          <h3 className="text-3xl lg:text-5xl font-bold text-gray-900">
            빠른 메뉴
          </h3>
        </motion.div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {menuItems.map((item, index) => (
            <motion.a
              key={index}
              href={item.link}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative overflow-hidden"
            >
              <div className={`
                relative p-8 lg:p-10 rounded-2xl bg-gradient-to-br ${item.gradient} ${item.hoverGradient}
                transition-all duration-300 transform hover:scale-105 hover:shadow-2xl
              `}>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute -right-10 -top-10 w-40 h-40 bg-white rounded-full" />
                  <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white rounded-full" />
                </div>

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Text */}
                  <h4 className="text-2xl font-bold text-white mb-3">
                    {item.title}
                  </h4>
                  <p className="text-white/90 leading-relaxed mb-4">
                    {item.description}
                  </p>

                  {/* Arrow */}
                  <div className="flex items-center text-white">
                    <span className="mr-2 font-semibold">자세히 보기</span>
                    <svg
                      className="w-5 h-5 transform group-hover:translate-x-2 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>
                </div>

                {/* Hover Effect */}
                <motion.div
                  className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                  whileHover={{ scale: 1.5, rotate: 45 }}
                  transition={{ duration: 0.6 }}
                />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}