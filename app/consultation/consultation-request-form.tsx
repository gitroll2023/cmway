'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CheckCircle, Phone, Mail, Clock, Calendar, User, Building, MessageSquare, Shield } from 'lucide-react'

// Form validation schema
const consultationRequestSchema = z.object({
  name: z.string()
    .min(2, '이름을 2글자 이상 입력해주세요')
    .max(50, '이름은 50글자 이하로 입력해주세요'),
  phone: z.string()
    .min(10, '전화번호를 정확히 입력해주세요')
    .max(15, '전화번호를 정확히 입력해주세요')
    .regex(/^[0-9-]+$/, '전화번호는 숫자와 하이픈만 입력 가능합니다'),
  email: z.string()
    .email('올바른 이메일 형식이 아닙니다')
    .optional()
    .or(z.literal('')),
  company: z.string().optional(),
  consultation_type: z.string()
    .min(1, '상담 유형을 선택해주세요'),
  health_concerns: z.array(z.string()).optional(),
  preferred_date: z.string().optional(),
  preferred_time: z.string().optional(),
  message: z.string()
    .max(1000, '메시지는 1000글자 이하로 입력해주세요')
    .optional(),
  privacy_agreed: z.boolean()
    .refine(val => val === true, '개인정보 처리방침에 동의해주세요'),
  marketing_agreed: z.boolean().optional(),
})

type ConsultationRequestFormData = z.infer<typeof consultationRequestSchema>

export function ConsultationRequestForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    reset
  } = useForm<ConsultationRequestFormData>({
    mode: 'onChange',
    defaultValues: {
      consultation_type: '',
      health_concerns: [],
      privacy_agreed: false,
      marketing_agreed: false
    }
  })

  const watchedHealthConcerns = watch('health_concerns') || []

  const healthConcernOptions = [
    '면역력 강화',
    '피로 회복',
    '관절 건강',
    '눈 건강',
    '소화 건강',
    '혈관 건강',
    '항산화',
    '다이어트',
    '갱년기 관리',
    '수면 개선',
    '기타'
  ]

  const onSubmit = async (data: ConsultationRequestFormData) => {
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/consultation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          product_interests: data.health_concerns // Map health_concerns to product_interests for API compatibility
        }),
      })

      if (response.ok) {
        setSubmitSuccess(true)
        reset()
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || '상담신청에 실패했습니다')
      }
    } catch (error) {
      console.error('Consultation form error:', error)
      alert('상담신청에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleHealthConcernChange = (concern: string, checked: boolean) => {
    const current = watchedHealthConcerns
    if (checked) {
      setValue('health_concerns', [...current, concern])
    } else {
      setValue('health_concerns', current.filter(c => c !== concern))
    }
  }

  if (submitSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-16"
      >
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-emerald-600" />
        </div>
        <h3 className="text-3xl font-bold text-gray-900 mb-4">
          상담신청이 완료되었습니다!
        </h3>
        <p className="text-lg text-gray-600 mb-2">
          건강 전문가가 빠른 시일 내에 연락드리겠습니다.
        </p>
        <p className="text-gray-500 mb-8">
          평균 응답 시간: 24시간 이내
        </p>
        
        <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl p-6 mb-8">
          <h4 className="font-semibold text-gray-900 mb-3">다음 단계</h4>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2 text-emerald-600" />
              전문가가 고객님의 요청을 검토합니다
            </div>
            <div className="flex items-center">
              <Phone className="w-4 h-4 mr-2 text-emerald-600" />
              24시간 내 전화 또는 이메일로 연락드립니다
            </div>
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2 text-emerald-600" />
              1:1 맞춤 건강 상담을 진행합니다
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => setSubmitSuccess(false)}
            variant="outline"
            className="px-8"
          >
            추가 상담 신청
          </Button>
          <Button
            onClick={() => router.push('/')}
            className="px-8"
          >
            홈으로 돌아가기
          </Button>
        </div>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Personal Information */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-emerald-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">개인정보</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이름 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('name', {
                required: '이름을 입력해주세요',
                minLength: { value: 2, message: '이름을 2글자 이상 입력해주세요' },
                maxLength: { value: 50, message: '이름은 50글자 이하로 입력해주세요' }
              })}
              className={cn(
                'w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors',
                errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'
              )}
              placeholder="홍길동"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-2 flex items-center">
                <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              전화번호 <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              {...register('phone', {
                required: '전화번호를 입력해주세요',
                pattern: {
                  value: /^[0-9-]+$/,
                  message: '전화번호는 숫자와 하이픈만 입력 가능합니다'
                },
                minLength: { value: 10, message: '전화번호를 정확히 입력해주세요' },
                maxLength: { value: 15, message: '전화번호를 정확히 입력해주세요' }
              })}
              className={cn(
                'w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors',
                errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-200'
              )}
              placeholder="010-1234-5678"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-2 flex items-center">
                <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                {errors.phone.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이메일
            </label>
            <input
              type="email"
              {...register('email', {
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: '올바른 이메일 형식이 아닙니다'
                }
              })}
              className={cn(
                'w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors',
                errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'
              )}
              placeholder="example@email.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-2 flex items-center">
                <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              회사명
            </label>
            <input
              type="text"
              {...register('company')}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              placeholder="회사명 (선택사항)"
            />
          </div>
        </div>
      </div>

      {/* Consultation Type */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">상담 유형</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { value: 'health_consultation', label: '건강 상담', desc: '개인 맞춤 건강 관리 상담' },
            { value: 'product_consultation', label: '제품 상담', desc: '건강기능식품 추천 및 상담' },
            { value: 'nutrition_consultation', label: '영양 상담', desc: '영양 관리 및 식습관 개선' },
            { value: 'other', label: '기타 상담', desc: '기타 건강 관련 문의사항' }
          ].map((type) => (
            <label key={type.value} className="relative cursor-pointer">
              <input
                type="radio"
                value={type.value}
                {...register('consultation_type', {
                  required: '상담 유형을 선택해주세요'
                })}
                className="sr-only"
              />
              <div className={cn(
                'p-4 border-2 rounded-xl transition-all',
                watch('consultation_type') === type.value
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-gray-200 hover:border-gray-300'
              )}>
                <div className="font-medium text-gray-900">{type.label}</div>
                <div className="text-sm text-gray-500 mt-1">{type.desc}</div>
              </div>
            </label>
          ))}
        </div>
        {errors.consultation_type && (
          <p className="text-red-500 text-sm flex items-center">
            <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
            {errors.consultation_type.message}
          </p>
        )}
      </div>

      {/* Health Concerns */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
            <Shield className="w-4 h-4 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">관심 건강 분야</h3>
          <span className="text-sm text-gray-500">(복수 선택 가능)</span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {healthConcernOptions.map((concern) => (
            <label key={concern} className="relative cursor-pointer">
              <input
                type="checkbox"
                checked={watchedHealthConcerns.includes(concern)}
                onChange={(e) => handleHealthConcernChange(concern, e.target.checked)}
                className="sr-only"
              />
              <div className={cn(
                'p-3 text-center border-2 rounded-lg transition-all text-sm',
                watchedHealthConcerns.includes(concern)
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              )}>
                {concern}
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Preferred Schedule */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
            <Calendar className="w-4 h-4 text-indigo-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">희망 상담 일정</h3>
          <span className="text-sm text-gray-500">(선택사항)</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              희망 날짜
            </label>
            <input
              type="date"
              {...register('preferred_date')}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              희망 시간대
            </label>
            <select
              {...register('preferred_time')}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            >
              <option value="">선택해주세요</option>
              <option value="morning">오전 (09:00~12:00)</option>
              <option value="afternoon">오후 (13:00~17:00)</option>
              <option value="evening">저녁 (18:00~20:00)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Message */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-orange-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">상담 내용 및 요청사항</h3>
        </div>
        
        <textarea
          {...register('message', {
            maxLength: { value: 1000, message: '메시지는 1000글자 이하로 입력해주세요' }
          })}
          rows={5}
          className={cn(
            'w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none',
            errors.message ? 'border-red-300 bg-red-50' : 'border-gray-200'
          )}
          placeholder="건강 상담을 받고 싶은 구체적인 내용이나 궁금한 점을 자유롭게 입력해주세요.

예시:
- 현재 복용 중인 약물이나 건강기능식품
- 평소 생활 습관이나 건강 고민
- 기존에 있던 질환이나 알레르기
- 건강 목표나 개선하고 싶은 부분"
        />
        {errors.message && (
          <p className="text-red-500 text-sm flex items-center">
            <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
            {errors.message.message}
          </p>
        )}
      </div>

      {/* Agreement */}
      <div className="space-y-4 p-6 bg-gray-50 rounded-xl">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <Shield className="w-4 h-4 text-gray-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">개인정보 동의</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              {...register('privacy_agreed', {
                required: '개인정보 처리방침에 동의해주세요'
              })}
              className="mt-1 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
            />
            <label className="text-sm text-gray-700 leading-relaxed">
              <span className="text-red-500 font-medium">*</span> 개인정보 수집 및 이용에 동의합니다.
              <div className="mt-2 p-3 bg-white rounded-lg border text-xs text-gray-600">
                <div className="font-medium mb-1">수집 목적:</div>
                <div>건강 상담 서비스 제공, 상담 일정 조율, 상담 결과 안내</div>
                <div className="font-medium mt-2 mb-1">수집 항목:</div>
                <div>이름, 전화번호, 이메일, 상담 내용</div>
                <div className="font-medium mt-2 mb-1">보유 기간:</div>
                <div>상담 완료 후 3년 (관련 법령에 따른 보존)</div>
              </div>
              <a href="/privacy" target="_blank" className="text-emerald-600 hover:underline font-medium">
                개인정보처리방침 전문 보기 →
              </a>
            </label>
          </div>
          {errors.privacy_agreed && (
            <p className="text-red-500 text-sm flex items-center">
              <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
              {errors.privacy_agreed.message}
            </p>
          )}

          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              {...register('marketing_agreed')}
              className="mt-1 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
            />
            <label className="text-sm text-gray-700 leading-relaxed">
              마케팅 정보 수신에 동의합니다. (선택사항)
              <div className="text-xs text-gray-500 mt-1">
                건강 정보, 신제품 안내, 이벤트 소식 등을 받아보실 수 있습니다.
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <Button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="w-full py-4 text-lg font-semibold rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
              상담신청 처리 중...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              무료 건강 상담 신청하기
            </div>
          )}
        </Button>

        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-gray-600 flex items-center justify-center">
            <Clock className="w-4 h-4 mr-2 text-emerald-600" />
            상담신청 후 24시간 이내에 전문 상담사가 연락드립니다.
          </p>
          <p className="text-xs text-gray-500">
            급한 문의사항은 고객센터 <span className="text-emerald-600 font-medium">1588-0000</span>으로 연락해주세요.
          </p>
        </div>
      </div>
    </form>
  )
}