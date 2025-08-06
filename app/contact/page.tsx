'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MainLayout } from '@/components/layout/main-layout';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageCircle, 
  Send,
  Facebook,
  Instagram,
  Youtube,
  ChevronDown,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

// Contact form data interface
interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

// FAQ data
const faqData = [
  {
    question: '제품 주문은 어떻게 하나요?',
    answer: '전화(1588-0000), 온라인 홈페이지, 또는 전국 대리점을 통해 주문하실 수 있습니다. 온라인 주문 시 배송료는 5만원 이상 무료배송입니다.'
  },
  {
    question: '상담은 무료인가요?',
    answer: '네, 모든 건강 상담은 무료입니다. 전문 상담사가 고객님의 건강 상태와 필요에 맞는 맞춤형 솔루션을 제안해드립니다.'
  },
  {
    question: '제품 교환/환불이 가능한가요?',
    answer: '제품 수령 후 7일 이내 미개봉 제품에 한해 교환/환불이 가능합니다. 단, 고객님의 단순 변심에 의한 교환/환불 시 배송비는 고객 부담입니다.'
  },
  {
    question: '정기배송 서비스가 있나요?',
    answer: '네, 정기배송 서비스를 제공합니다. 매월 자동 배송으로 편리하게 이용하시고 10% 할인 혜택도 받으실 수 있습니다.'
  },
  {
    question: '제품 부작용이 있을까요?',
    answer: '저희 제품은 GMP 인증 시설에서 제조되어 안전합니다. 하지만 개인의 체질에 따라 드물게 알레르기 반응이 있을 수 있으니, 섭취 전 성분을 확인해주세요.'
  },
  {
    question: '대리점 가입은 어떻게 하나요?',
    answer: '대리점 가입을 원하시면 본사로 연락주시거나 홈페이지의 사업자 등록 페이지를 통해 신청하실 수 있습니다.'
  }
];

// Contact information
const contactInfo = {
  address: '서울특별시 강남구 테헤란로 123길 45, 씨엠웨이빌딩 10층',
  phone: '1588-0000',
  email: 'info@cmway.co.kr',
  fax: '02-1234-5678',
  businessHours: {
    weekdays: '평일 09:00 - 18:00',
    saturday: '토요일 09:00 - 15:00',
    sunday: '일요일 휴무'
  }
};

// Social media links
const socialLinks = [
  { name: 'Facebook', icon: Facebook, url: 'https://facebook.com/cmway', color: 'text-blue-600' },
  { name: 'Instagram', icon: Instagram, url: 'https://instagram.com/cmway', color: 'text-pink-600' },
  { name: 'YouTube', icon: Youtube, url: 'https://youtube.com/cmway', color: 'text-red-600' }
];

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700 py-24 lg:py-32">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
              문의하기
            </h1>
            <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
              건강한 삶을 위한 여러분의 궁금한 점들을 언제든지 문의해주세요.
              전문 상담사가 친절하게 답변드리겠습니다.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <div className="flex items-center mb-8">
                <MessageCircle className="w-8 h-8 text-emerald-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">문의 보내기</h2>
              </div>

              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-green-800">문의가 성공적으로 전송되었습니다. 빠른 시일 내에 연락드리겠습니다.</span>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                  <span className="text-red-800">문의 전송에 실패했습니다. 다시 시도해주세요.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      이름 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      placeholder="이름을 입력해주세요"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      연락처 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      placeholder="010-1234-5678"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    이메일
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    placeholder="example@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    문의 유형 <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  >
                    <option value="">문의 유형을 선택해주세요</option>
                    <option value="product">제품 문의</option>
                    <option value="order">주문/배송 문의</option>
                    <option value="consultation">건강 상담</option>
                    <option value="partnership">사업 제휴</option>
                    <option value="complaint">불만/개선사항</option>
                    <option value="other">기타 문의</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    문의 내용 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none"
                    placeholder="궁금한 내용을 자세히 적어주세요"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-emerald-600 text-white font-semibold py-4 px-6 rounded-lg hover:bg-emerald-700 transition-colors duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      전송 중...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Send className="w-5 h-5 mr-2" />
                      문의 보내기
                    </div>
                  )}
                </button>
              </form>
            </motion.div>
          </div>

          {/* Contact Info Sidebar */}
          <div className="space-y-8">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">연락처 정보</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <MapPin className="w-6 h-6 text-emerald-600 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">본사 주소</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {contactInfo.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Phone className="w-6 h-6 text-emerald-600 mr-4" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">대표전화</h4>
                    <p className="text-gray-600">{contactInfo.phone}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Mail className="w-6 h-6 text-emerald-600 mr-4" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">이메일</h4>
                    <p className="text-gray-600">{contactInfo.email}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Business Hours */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <div className="flex items-center mb-6">
                <Clock className="w-6 h-6 text-emerald-600 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">운영시간</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">평일</span>
                  <span className="font-semibold text-gray-900">09:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">토요일</span>
                  <span className="font-semibold text-gray-900">09:00 - 15:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">일요일</span>
                  <span className="font-semibold text-red-600">휴무</span>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-emerald-50 rounded-lg">
                <p className="text-sm text-emerald-800">
                  <strong>점심시간:</strong> 12:00 - 13:00<br />
                  <strong>공휴일:</strong> 휴무
                </p>
              </div>
            </motion.div>

            {/* Social Media */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">소셜미디어</h3>
              
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 rounded-full bg-gray-50 ${social.color} hover:bg-gray-100 transition-colors duration-300`}
                  >
                    <social.icon className="w-6 h-6" />
                  </a>
                ))}
              </div>
              
              <p className="text-sm text-gray-600 mt-4">
                최신 소식과 건강 정보를 소셜미디어에서 만나보세요!
              </p>
            </motion.div>
          </div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              자주 묻는 질문
            </h2>
            <p className="text-gray-600 text-lg">
              고객님들이 자주 문의하시는 내용들을 모았습니다
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {faqData.map((faq, index) => (
              <div key={index} className="mb-4">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full bg-white rounded-xl shadow-md p-6 text-left hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 pr-4">
                      {faq.question}
                    </h3>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 transition-transform duration-300 flex-shrink-0 ${
                        openFAQ === index ? 'transform rotate-180' : ''
                      }`}
                    />
                  </div>
                </button>
                
                {openFAQ === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gray-50 rounded-b-xl px-6 pb-6"
                  >
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Emergency Contact */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-20 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl p-8 text-center text-white"
        >
          <h3 className="text-2xl font-bold mb-4">긴급한 문의가 있으신가요?</h3>
          <p className="text-emerald-100 mb-6">
            운영시간 외에도 긴급한 문의사항이 있으시면 언제든지 연락주세요
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`tel:${contactInfo.phone}`}
              className="bg-white text-emerald-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-300 flex items-center"
            >
              <Phone className="w-5 h-5 mr-2" />
              {contactInfo.phone}
            </a>
            <a
              href={`mailto:${contactInfo.email}`}
              className="bg-emerald-800 text-white font-semibold px-6 py-3 rounded-lg hover:bg-emerald-900 transition-colors duration-300 flex items-center"
            >
              <Mail className="w-5 h-5 mr-2" />
              이메일 보내기
            </a>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}