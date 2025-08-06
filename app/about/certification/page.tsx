'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/footer'
import { Award, Shield, FileCheck, Globe, Leaf, Heart } from 'lucide-react'
import Image from 'next/image'

const certifications = [
  {
    id: 1,
    category: '품질인증',
    title: '[임시] GMP 인증',
    description: '우수의약품제조관리기준 인증',
    issuer: '식품의약품안전처',
    date: '2023.01.01',
    icon: <Shield className="h-8 w-8" />,
    image: '/images/cert-gmp.jpg'
  },
  {
    id: 2,
    category: '품질인증',
    title: '[임시] HACCP 인증',
    description: '식품안전관리인증',
    issuer: '한국식품안전관리인증원',
    date: '2023.03.01',
    icon: <FileCheck className="h-8 w-8" />,
    image: '/images/cert-haccp.jpg'
  },
  {
    id: 3,
    category: '국제인증',
    title: '[임시] ISO 9001',
    description: '품질경영시스템 국제인증',
    issuer: 'ISO 국제표준화기구',
    date: '2022.12.01',
    icon: <Globe className="h-8 w-8" />,
    image: '/images/cert-iso9001.jpg'
  },
  {
    id: 4,
    category: '국제인증',
    title: '[임시] ISO 22000',
    description: '식품안전경영시스템 국제인증',
    issuer: 'ISO 국제표준화기구',
    date: '2022.12.01',
    icon: <Globe className="h-8 w-8" />,
    image: '/images/cert-iso22000.jpg'
  },
  {
    id: 5,
    category: '친환경인증',
    title: '[임시] 친환경 인증',
    description: '친환경 제품 생산 인증',
    issuer: '한국환경산업기술원',
    date: '2023.06.01',
    icon: <Leaf className="h-8 w-8" />,
    image: '/images/cert-eco.jpg'
  },
  {
    id: 6,
    category: '기타인증',
    title: '[임시] 건강기능식품 인증',
    description: '건강기능식품 제조 인증',
    issuer: '식품의약품안전처',
    date: '2023.02.01',
    icon: <Heart className="h-8 w-8" />,
    image: '/images/cert-health.jpg'
  }
]

const categories = ['전체', '품질인증', '국제인증', '친환경인증', '기타인증']

export default function CertificationPage() {
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [selectedCert, setSelectedCert] = useState<typeof certifications[0] | null>(null)

  const filteredCerts = selectedCategory === '전체'
    ? certifications
    : certifications.filter(cert => cert.category === selectedCategory)

  return (
    <>
      <Header />
      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-24 bg-gradient-to-br from-emerald-50 via-blue-50 to-green-50">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-6">
                <Award className="h-8 w-8 text-emerald-600" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                인증서
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                국내외 공인기관으로부터 인정받은 품질과 안전성
              </p>
            </motion.div>
          </div>
        </section>

        {/* Certifications Grid */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-emerald-600 to-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Certifications Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCerts.map((cert, index) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer"
                  onClick={() => setSelectedCert(cert)}
                >
                  {/* Certificate Image */}
                  <div className="relative h-48 bg-gradient-to-br from-emerald-50 to-blue-50 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-emerald-600 opacity-20 group-hover:opacity-30 transition-opacity">
                        {cert.icon}
                      </div>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur text-xs font-medium text-emerald-600 rounded-full">
                        {cert.category}
                      </span>
                    </div>
                  </div>

                  {/* Certificate Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                      {cert.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {cert.description}
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">발급기관</span>
                        <span className="text-gray-700 font-medium">{cert.issuer}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">인증일자</span>
                        <span className="text-gray-700 font-medium">{cert.date}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quality Promise */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-20 p-12 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-3xl"
            >
              <div className="text-center">
                <Award className="h-12 w-12 text-emerald-600 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  품질에 대한 약속
                </h3>
                <p className="text-gray-600 max-w-3xl mx-auto mb-8">
                  씨엠웨이는 엄격한 품질관리 시스템과 지속적인 연구개발을 통해
                  고객님께 최고의 제품만을 제공할 것을 약속드립니다.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-600 mb-2">100%</div>
                    <div className="text-gray-600">품질 검사 통과율</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-600 mb-2">15+</div>
                    <div className="text-gray-600">보유 인증서</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-600 mb-2">365일</div>
                    <div className="text-gray-600">품질 모니터링</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />

      {/* Certificate Modal */}
      {selectedCert && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedCert(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-3xl w-full p-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {selectedCert.title}
              </h3>
              <button
                onClick={() => setSelectedCert(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {/* 인증서 이미지 영역 */}
            <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center min-h-[500px]">
              {selectedCert.image ? (
                <Image
                  src={selectedCert.image}
                  alt={selectedCert.title}
                  width={600}
                  height={800}
                  className="max-w-full h-auto"
                />
              ) : (
                <div className="text-center">
                  <div className="text-6xl text-gray-400 mb-4">{selectedCert.icon}</div>
                  <p className="text-gray-500">인증서 이미지 준비중</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </>
  )
}