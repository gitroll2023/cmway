'use client';

import { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { 
  Shield, 
  Heart, 
  Users, 
  Globe, 
  Award, 
  Star,
  MapPin,
  Phone,
  Mail,
  Clock,
  TrendingUp,
  Target,
  Lightbulb,
  CheckCircle
} from 'lucide-react';
import { MainLayout } from '@/components/layout/main-layout';
import { useCMSStore } from '@/store/cms';
import Image from 'next/image';

// Core Values Data
const coreValues = [
  {
    icon: Shield,
    title: '신뢰성',
    description: 'GMP 인증 시설과 30년 전통으로 고객님께 최고의 품질을 약속합니다',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  {
    icon: Heart,
    title: '고객중심',
    description: '고객님의 건강과 만족을 최우선으로 생각하며 맞춤형 서비스를 제공합니다',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
  {
    icon: Lightbulb,
    title: '혁신',
    description: '지속적인 연구개발을 통해 더 나은 건강 솔루션을 개발합니다',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
  },
  {
    icon: Globe,
    title: '지속가능성',
    description: '환경을 생각하는 친환경 제품과 지속가능한 경영을 실천합니다',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
];

// History Timeline Data
const historyData = [
  { year: '1994', event: '씨엠웨이 설립, 건강식품 사업 시작' },
  { year: '2000', event: 'GMP 인증 획득, 품질 관리 체계 구축' },
  { year: '2005', event: '온라인 쇼핑몰 오픈, 디지털 전환' },
  { year: '2010', event: '해외 수출 시작, 글로벌 진출' },
  { year: '2015', event: '연구개발센터 설립, R&D 강화' },
  { year: '2020', event: '친환경 패키징 도입, ESG 경영 시작' },
  { year: '2024', event: 'AI 기반 맞춤형 건강 관리 서비스 론칭' },
];

// Company Statistics
const statistics = [
  { number: '30+', label: '년의 경험', icon: Star },
  { number: '1M+', label: '만족한 고객', icon: Users },
  { number: '500+', label: '제품 라인업', icon: Award },
  { number: '50+', label: '해외 진출국', icon: Globe },
];

// Certifications
const certifications = [
  { name: 'GMP 인증', image: '/images/cert-gmp.jpg', description: '우수의약품제조관리기준' },
  { name: 'ISO 9001', image: '/images/cert-iso.jpg', description: '품질경영시스템 인증' },
  { name: 'HACCP', image: '/images/cert-haccp.jpg', description: '식품안전관리인증' },
  { name: '친환경 인증', image: '/images/cert-eco.jpg', description: '환경친화적 제품 인증' },
];

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.6, 
      ease: [0.25, 0.46, 0.45, 0.94] // easeOut cubic-bezier
    } 
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

// Section component for reusability
function Section({ children, className = "", id }: { children: React.ReactNode, className?: string, id?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className={`py-20 lg:py-24 ${className}`} id={id}>
      <motion.div
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="max-w-7xl mx-auto px-4"
      >
        {children}
      </motion.div>
    </section>
  );
}

export default function AboutPage() {
  const { siteSettings, isLoading } = useCMSStore();

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Hero Section */}
      <Section className="bg-gradient-to-br from-emerald-50 via-blue-50 to-green-50 pt-32">
        <motion.div variants={fadeInUp} className="text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            <span className="text-emerald-600">건강한 미래</span>를 만들어가는
            <br />
            {siteSettings?.site_name.ko || '씨엠웨이'}
          </h1>
          <p className="text-xl lg:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
            30년 전통의 건강식품 전문기업으로, 고객님의 건강한 삶을 위해 
            끊임없이 연구하고 발전하고 있습니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-emerald-600 text-white font-semibold rounded-full hover:bg-emerald-700 transition-all duration-300 transform hover:scale-105">
              제품 둘러보기
            </button>
            <button className="px-8 py-4 border-2 border-emerald-600 text-emerald-600 font-semibold rounded-full hover:bg-emerald-600 hover:text-white transition-all duration-300">
              상담 신청하기
            </button>
          </div>
        </motion.div>
      </Section>

      {/* Company Statistics */}
      <Section className="bg-white">
        <motion.div variants={staggerContainer} className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {statistics.map((stat, index) => (
            <motion.div key={index} variants={fadeInUp} className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                <stat.icon className="w-8 h-8" />
              </div>
              <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* History Timeline */}
      <Section className="bg-gray-50">
        <motion.div variants={fadeInUp} className="text-center mb-16">
          <h2 className="text-emerald-600 font-semibold mb-4 text-lg">COMPANY HISTORY</h2>
          <h3 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
            30년간의 <span className="text-emerald-600">성장 스토리</span>
          </h3>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            1994년 설립 이후 끊임없는 혁신과 도전으로 건강식품 업계를 선도해온 씨엠웨이의 발자취입니다.
          </p>
        </motion.div>

        <motion.div variants={staggerContainer} className="relative">
          {/* Timeline Line */}
          <div className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-0.5 bg-emerald-200 transform lg:-translate-x-px"></div>
          
          {historyData.map((item, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className={`relative flex items-center mb-12 ${
                index % 2 === 0 ? 'lg:justify-start' : 'lg:justify-end'
              }`}
            >
              <div className={`relative bg-white rounded-xl p-6 shadow-lg border border-gray-100 max-w-md ${
                index % 2 === 0 ? 'ml-12 lg:ml-0 lg:mr-8' : 'ml-12 lg:ml-8 lg:mr-0'
              }`}>
                <div className="absolute -left-3 lg:-left-3 top-6 w-6 h-6 bg-emerald-600 rounded-full border-4 border-white shadow-md"></div>
                <div className="text-emerald-600 font-bold text-lg mb-2">{item.year}</div>
                <p className="text-gray-700 leading-relaxed">{item.event}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* Core Values */}
      <Section className="bg-white">
        <motion.div variants={fadeInUp} className="text-center mb-16">
          <h2 className="text-emerald-600 font-semibold mb-4 text-lg">CORE VALUES</h2>
          <h3 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
            우리의 <span className="text-emerald-600">핵심 가치</span>
          </h3>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            씨엠웨이가 추구하는 핵심 가치들로 모든 사업 활동의 기준이 됩니다.
          </p>
        </motion.div>

        <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {coreValues.map((value, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className={`group p-8 bg-white rounded-2xl border-2 ${value.borderColor} hover:shadow-xl transition-all duration-300 hover:-translate-y-2`}
            >
              <div className={`w-16 h-16 ${value.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <value.icon className={`w-8 h-8 ${value.color}`} />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h4>
              <p className="text-gray-600 leading-relaxed">{value.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* CEO Message */}
      <Section className="bg-gradient-to-r from-emerald-600 to-green-600 text-white">
        <motion.div variants={fadeInUp} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-white/90 font-semibold mb-4 text-lg">CEO MESSAGE</h2>
            <h3 className="text-3xl lg:text-4xl font-bold mb-6">
              대표이사 인사말
            </h3>
            <div className="space-y-6 text-lg leading-relaxed text-white/90">
              <p>
                안녕하십니까. 씨엠웨이 대표이사 {siteSettings?.company_info.ceo || '김대표'}입니다.
              </p>
              <p>
                저희 씨엠웨이는 1994년 설립 이래 30년간 오직 고객님의 건강한 삶을 위해 
                최고의 품질과 서비스를 제공해왔습니다. 앞으로도 끊임없는 혁신과 연구개발을 통해 
                더 나은 건강 솔루션을 제공하겠습니다.
              </p>
              <p>
                고객님의 믿음과 신뢰에 보답하는 기업이 되도록 최선을 다하겠습니다.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-white/20">
              <div className="text-2xl font-bold">김대표</div>
              <div className="text-white/80">씨엠웨이 대표이사</div>
            </div>
          </div>
          <div className="order-1 lg:order-2 text-center">
            <div className="relative inline-block">
              <div className="w-80 h-80 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <div className="w-64 h-64 bg-white/20 rounded-full flex items-center justify-center">
                  <Users className="w-32 h-32 text-white/60" />
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center">
                <Star className="w-12 h-12 text-yellow-600" />
              </div>
            </div>
          </div>
        </motion.div>
      </Section>

      {/* Certifications Gallery */}
      <Section className="bg-gray-50">
        <motion.div variants={fadeInUp} className="text-center mb-16">
          <h2 className="text-emerald-600 font-semibold mb-4 text-lg">CERTIFICATIONS</h2>
          <h3 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
            <span className="text-emerald-600">인증</span>과 자격
          </h3>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            국내외 공인기관으로부터 받은 다양한 인증들로 제품의 품질과 안전성을 보장합니다.
          </p>
        </motion.div>

        <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {certifications.map((cert, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
            >
              <div className="aspect-square bg-gray-100 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                <Award className="w-16 h-16 text-emerald-600 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">{cert.name}</h4>
              <p className="text-gray-600 text-sm">{cert.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* Office Photos */}
      <Section className="bg-white">
        <motion.div variants={fadeInUp} className="text-center mb-16">
          <h2 className="text-emerald-600 font-semibold mb-4 text-lg">OFFICE & FACILITIES</h2>
          <h3 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
            <span className="text-emerald-600">최첨단 시설</span>과 환경
          </h3>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            GMP 인증을 받은 최신 시설에서 안전하고 품질 높은 제품을 생산하고 있습니다.
          </p>
        </motion.div>

        <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: '생산 시설', description: 'GMP 인증 생산라인' },
            { title: '연구개발센터', description: '최첨단 R&D 시설' },
            { title: '품질관리실', description: '엄격한 품질 검사' },
            { title: '물류센터', description: '자동화 물류 시스템' },
            { title: '본사 사무실', description: '현대적 업무 환경' },
            { title: '고객상담센터', description: '전문 상담 서비스' },
          ].map((office, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="group relative overflow-hidden rounded-2xl aspect-[4/3] bg-gradient-to-br from-emerald-100 to-blue-100"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <MapPin className="w-16 h-16 text-emerald-600/60" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h4 className="text-xl font-bold mb-2">{office.title}</h4>
                <p className="text-white/80">{office.description}</p>
              </div>
              <div className="absolute inset-0 bg-emerald-600/0 group-hover:bg-emerald-600/10 transition-all duration-300"></div>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* Contact CTA */}
      <Section className="bg-emerald-600 text-white">
        <motion.div variants={fadeInUp} className="text-center">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">
            더 자세한 정보가 필요하신가요?
          </h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-3xl mx-auto">
            씨엠웨이에 대해 더 궁금한 점이 있으시거나 상담을 원하신다면 언제든 연락주세요.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="flex items-center justify-center space-x-3">
              <Phone className="w-6 h-6" />
              <span className="text-lg font-semibold">{siteSettings?.company_info.phone}</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Mail className="w-6 h-6" />
              <span className="text-lg font-semibold">{siteSettings?.company_info.email}</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Clock className="w-6 h-6" />
              <span className="text-lg font-semibold">{siteSettings?.company_info.customer_center.hours}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-emerald-600 font-semibold rounded-full hover:bg-emerald-50 transition-all duration-300 transform hover:scale-105">
              <Phone className="w-5 h-5 inline mr-2" />
              전화 상담하기
            </button>
            <button className="px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-emerald-600 transition-all duration-300">
              <Mail className="w-5 h-5 inline mr-2" />
              이메일 문의
            </button>
          </div>
        </motion.div>
      </Section>
    </MainLayout>
  );
}