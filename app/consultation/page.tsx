import { Metadata } from 'next'
import { MainLayout } from '@/components/layout/main-layout'
import { ConsultationRequestForm } from './consultation-request-form'
import { CheckCircle, Clock, UserCheck, Phone, Mail, MapPin, ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: '무료 건강 상담신청 | CMWay',
  description: '건강 전문가와의 1:1 맞춤 상담을 통해 최적화된 건강 솔루션을 받아보세요. 30년 경험의 건강식품 전문가가 도와드립니다.',
}

// FAQ 데이터
const faqs = [
  {
    question: '상담은 정말 무료인가요?',
    answer: '네, 모든 상담은 완전 무료입니다. 추가 비용 없이 전문가의 건강 상담을 받으실 수 있습니다.'
  },
  {
    question: '상담은 어떤 방식으로 진행되나요?',
    answer: '전화 또는 대면 상담 중 선택하실 수 있습니다. 고객님의 편의에 맞춰 시간과 방법을 조정해드립니다.'
  },
  {
    question: '상담 후 제품 구매를 강요하지 않나요?',
    answer: '절대 그렇지 않습니다. 상담은 순수하게 건강 정보 제공을 목적으로 하며, 구매 결정은 전적으로 고객님의 선택입니다.'
  },
  {
    question: '얼마나 빨리 연락을 받을 수 있나요?',
    answer: '신청 후 24시간 내에 전문 상담사가 연락드립니다. 급한 경우 직접 전화(1588-0000)로 문의해주세요.'
  },
  {
    question: '어떤 건강 정보를 상담받을 수 있나요?',
    answer: '건강기능식품 선택, 영양 관리, 생활습관 개선, 제품별 효능 등 종합적인 건강 관리 정보를 제공합니다.'
  }
]

export default function ConsultationPage() {
  return (
    <MainLayout>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-emerald-50 via-blue-50 to-green-50 py-20 lg:py-32">
          <div className="absolute inset-0 bg-[url('/images/health-pattern.svg')] opacity-5"></div>
          <div className="relative max-w-7xl mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                전문가와 함께하는<br />
                <span className="text-emerald-600">무료 건강 상담</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
                30년 경험의 건강식품 전문가가 여러분의 건강 고민을 해결해드립니다.<br />
                개인 맞춤형 건강 솔루션을 무료로 받아보세요.
              </p>
              
              {/* Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserCheck className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">전문가 1:1 상담</h3>
                  <p className="text-gray-600 text-sm">건강기능식품 전문가의 개인 맞춤 상담</p>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">완전 무료 서비스</h3>
                  <p className="text-gray-600 text-sm">상담료, 추가비용 없는 100% 무료</p>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">빠른 응답</h3>
                  <p className="text-gray-600 text-sm">24시간 내 전문 상담사 연락</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Consultation Form */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      건강 상담 신청서
                    </h2>
                    <p className="text-gray-600 text-lg">
                      아래 정보를 입력해주시면 건강 전문가가 맞춤 상담을 도와드립니다.
                    </p>
                  </div>

                  <ConsultationRequestForm />
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                {/* Process Steps */}
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-3xl p-8">
                  <h3 className="text-2xl font-bold text-emerald-800 mb-6">
                    상담 진행 절차
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        1
                      </div>
                      <div>
                        <h4 className="font-semibold text-emerald-800 mb-1">상담 신청</h4>
                        <p className="text-emerald-700 text-sm">온라인 양식 작성 및 제출</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        2
                      </div>
                      <div>
                        <h4 className="font-semibold text-emerald-800 mb-1">전문가 배정</h4>
                        <p className="text-emerald-700 text-sm">고객님 상황에 맞는 전문가 매칭</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        3
                      </div>
                      <div>
                        <h4 className="font-semibold text-emerald-800 mb-1">상담 연락</h4>
                        <p className="text-emerald-700 text-sm">24시간 내 전문가 직접 연락</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        4
                      </div>
                      <div>
                        <h4 className="font-semibold text-emerald-800 mb-1">맞춤 상담</h4>
                        <p className="text-emerald-700 text-sm">개인별 건강 솔루션 제공</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white rounded-3xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    연락처 안내
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Phone className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">고객센터</p>
                        <p className="text-blue-600 font-semibold text-lg">1588-0000</p>
                        <p className="text-gray-500 text-sm">평일 09:00 ~ 18:00</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                        <Mail className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">이메일 문의</p>
                        <p className="text-emerald-600 font-semibold">contact@cmway.co.kr</p>
                        <p className="text-gray-500 text-sm">24시간 접수 가능</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                        <MapPin className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">본사 위치</p>
                        <p className="text-gray-600">서울특별시 강남구</p>
                        <p className="text-gray-500 text-sm">방문 상담 가능</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600 text-center">
                      <strong>긴급 문의</strong><br />
                      평일 18시 이후나 주말에는 이메일로 문의해주시면<br />
                      다음 영업일에 우선 연락드립니다.
                    </p>
                  </div>
                </div>

                {/* Additional Benefits */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8">
                  <h3 className="text-2xl font-bold text-blue-800 mb-6">
                    상담 혜택
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <ChevronRight className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-blue-800">개인 맞춤형 건강 관리 플랜 제공</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <ChevronRight className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-blue-800">건강기능식품 전문 추천 및 상담</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <ChevronRight className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-blue-800">정기적인 건강 체크 및 피드백</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <ChevronRight className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-blue-800">신제품 출시 시 우선 안내</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <ChevronRight className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-blue-800">회원 전용 할인 혜택 제공</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                자주 묻는 질문
              </h2>
              <p className="text-xl text-gray-600">
                상담 신청 전 궁금한 점들을 확인해보세요
              </p>
            </div>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Q. {faq.question}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    A. {faq.answer}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <p className="text-gray-600 mb-4">
                더 궁금한 점이 있으시다면 언제든 연락해주세요!
              </p>
              <a 
                href="tel:1588-0000"
                className="inline-flex items-center px-8 py-4 bg-emerald-600 text-white font-semibold rounded-full hover:bg-emerald-700 transition-colors"
              >
                <Phone className="h-5 w-5 mr-2" />
                1588-0000 전화상담
              </a>
            </div>
          </div>
        </section>
    </MainLayout>
  )
}