'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, CheckCircle, Award, Users, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface CompanySectionProps {
  title?: string
  subtitle?: string
  description?: string
  image?: string
  features?: Array<{
    icon: string
    title: string
    description: string
  }>
  stats?: Array<{
    number: string
    label: string
    suffix?: string
  }>
  cta?: {
    text: string
    link: string
  }
  locale?: 'ko' | 'en'
}

export function CompanySection({ 
  title = "신뢰할 수 있는 건강 파트너",
  subtitle = "25년 경험의 건강식품 전문기업",
  description = "1999년 설립 이래 고객의 건강한 삶을 위해 최고 품질의 건강기능식품을 공급하고 있습니다. GMP 인증 시설에서 생산되는 프리미엄 제품으로 건강한 내일을 함께 만들어갑니다.",
  image,
  features = [
    {
      icon: "award",
      title: "GMP 인증시설",
      description: "식품의약품안전처 인증 GMP 시설에서 엄격한 품질관리 하에 생산"
    },
    {
      icon: "users",
      title: "전문 상담팀",
      description: "건강 전문가들이 고객 맞춤형 건강 솔루션 제공"
    },
    {
      icon: "trending",
      title: "지속적 성장",
      description: "25년간 축적된 노하우와 신뢰로 지속 성장"
    }
  ],
  stats = [
    { number: "25", label: "년 경험", suffix: "+" },
    { number: "10", label: "만 고객", suffix: "+" },
    { number: "200", label: "개 제품", suffix: "+" },
    { number: "99", label: "고객 만족도", suffix: "%" }
  ],
  cta = {
    text: "회사소개 자세히 보기",
    link: "/about"
  },
  locale = 'ko'
}: CompanySectionProps) {
  
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'award':
        return <Award className="h-8 w-8" />
      case 'users':
        return <Users className="h-8 w-8" />
      case 'trending':
        return <TrendingUp className="h-8 w-8" />
      case 'check':
        return <CheckCircle className="h-8 w-8" />
      default:
        return <Award className="h-8 w-8" />
    }
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="space-y-4">
              <p className="text-green-600 font-semibold text-lg">
                {subtitle}
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                {title}
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                {description}
              </p>
            </div>

            {/* Features */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start space-x-4"
                >
                  <div className="flex-shrink-0 w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                    {getIcon(feature.icon)}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Button asChild size="lg" className="group">
                <Link href={cta.link}>
                  {cta.text}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Main Image */}
            <div className="relative">
              {image ? (
                <div className="relative h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-green-100 to-blue-100">
                  <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-96 rounded-2xl bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto">
                      <Award className="h-10 w-10 text-white" />
                    </div>
                    <p className="text-green-800 font-semibold">
                      CMWay 건강식품
                    </p>
                  </div>
                </div>
              )}
              
              {/* Floating Stats Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-6 border"
              >
                <div className="grid grid-cols-2 gap-4">
                  {stats.slice(0, 2).map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {stat.number}{stat.suffix}
                      </div>
                      <div className="text-sm text-gray-600">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Additional Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-6"
            >
              {stats.slice(2).map((stat, index) => (
                <div key={index} className="bg-white rounded-xl p-6 text-center shadow-md">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {stat.number}{stat.suffix}
                  </div>
                  <div className="text-gray-600">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}