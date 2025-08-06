'use client'

import { motion } from 'framer-motion'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/footer'
import { Calendar, Award, Rocket, Globe, Building, TrendingUp } from 'lucide-react'

const historyData = [
  {
    year: '2024',
    icon: <Rocket className="h-6 w-6" />,
    title: '[임시] AI 기반 맞춤형 건강 관리 서비스 론칭',
    description: '개인 맞춤형 건강 솔루션 제공 시작',
    highlight: true
  },
  {
    year: '2020',
    icon: <Globe className="h-6 w-6" />,
    title: '[임시] 친환경 패키징 도입 및 ESG 경영 시작',
    description: '지속가능한 경영 체계 구축',
    highlight: false
  },
  {
    year: '2018',
    icon: <Award className="h-6 w-6" />,
    title: '[임시] 클로로필a 특허 획득',
    description: '항암 효능 관련 특허 등록 완료',
    highlight: true
  },
  {
    year: '2015',
    icon: <Building className="h-6 w-6" />,
    title: '[임시] 연구개발센터 설립',
    description: 'R&D 역량 강화 및 신제품 개발 가속화',
    highlight: false
  },
  {
    year: '2010',
    icon: <Globe className="h-6 w-6" />,
    title: '[임시] 해외 수출 시작',
    description: '글로벌 시장 진출 및 수출 확대',
    highlight: true
  },
  {
    year: '2005',
    icon: <TrendingUp className="h-6 w-6" />,
    title: '[임시] 매출 100억 돌파',
    description: '안정적인 성장세 유지',
    highlight: false
  },
  {
    year: '2000',
    icon: <Award className="h-6 w-6" />,
    title: '[임시] GMP 인증 획득',
    description: '우수의약품제조관리기준 인증',
    highlight: true
  },
  {
    year: '1994',
    icon: <Building className="h-6 w-6" />,
    title: '[임시] 씨엠웨이 설립',
    description: '건강기능식품 전문기업으로 출발',
    highlight: true
  }
]

export default function HistoryPage() {
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
                <Calendar className="h-8 w-8 text-emerald-600" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                회사연혁
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                30년간의 도전과 혁신, 씨엠웨이의 성장 스토리
              </p>
            </motion.div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-2">30+</div>
                <div className="text-gray-600">년의 역사</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-2">50+</div>
                <div className="text-gray-600">해외 진출국</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-2">100+</div>
                <div className="text-gray-600">특허 보유</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-2">1M+</div>
                <div className="text-gray-600">고객 수</div>
              </div>
            </motion.div>

            {/* Timeline */}
            <div className="relative">
              {/* Center Line */}
              <div className="absolute left-1/2 transform -translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-200 via-emerald-300 to-emerald-200"></div>

              {/* Timeline Items */}
              {historyData.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative flex items-center mb-12 ${
                    index % 2 === 0 ? 'justify-start' : 'justify-end'
                  }`}
                >
                  {/* Content */}
                  <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                    <div
                      className={`bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ${
                        item.highlight ? 'border-2 border-emerald-200' : 'border border-gray-100'
                      }`}
                    >
                      <div className={`flex items-center gap-3 mb-3 ${
                        index % 2 === 0 ? 'justify-end' : ''
                      }`}>
                        <div className={`text-2xl font-bold ${
                          item.highlight ? 'text-emerald-600' : 'text-gray-700'
                        }`}>
                          {item.year}
                        </div>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          item.highlight ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {item.icon}
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-600">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Center Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2">
                    <div className={`w-4 h-4 rounded-full border-4 border-white ${
                      item.highlight ? 'bg-emerald-500 shadow-lg shadow-emerald-200' : 'bg-gray-400'
                    }`}></div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Future Vision */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mt-20 p-8 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl text-center"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                미래를 향한 도전은 계속됩니다
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                씨엠웨이는 지속적인 혁신과 연구개발을 통해 
                글로벌 건강기능식품 선도기업으로 도약하겠습니다.
              </p>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}