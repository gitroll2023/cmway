'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useProducts } from '@/lib/hooks/use-cms'

// Form validation schema
const consultationSchema = z.object({
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
  product_interests: z.array(z.string()).optional(),
  preferred_date: z.string().optional(),
  preferred_time: z.string().optional(),
  message: z.string()
    .max(1000, '메시지는 1000글자 이하로 입력해주세요')
    .optional(),
  privacy_agreed: z.boolean()
    .refine(val => val === true, '개인정보 처리방침에 동의해주세요'),
  marketing_agreed: z.boolean().optional(),
})

type ConsultationFormData = z.infer<typeof consultationSchema>

interface ConsultationFormProps {
  preSelectedProduct?: string
}

export function ConsultationForm({ preSelectedProduct }: ConsultationFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const { products } = useProducts({ featured: true })

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    reset
  } = useForm<ConsultationFormData>({
    mode: 'onChange',
    defaultValues: {
      consultation_type: 'general',
      product_interests: preSelectedProduct ? [preSelectedProduct] : [],
      privacy_agreed: false,
      marketing_agreed: false
    }
  })

  const watchedProductInterests = watch('product_interests') || []

  useEffect(() => {
    if (preSelectedProduct && !watchedProductInterests.includes(preSelectedProduct)) {
      setValue('product_interests', [preSelectedProduct])
    }
  }, [preSelectedProduct, setValue, watchedProductInterests])

  const onSubmit = async (data: ConsultationFormData) => {
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/consultation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setSubmitSuccess(true)
        reset()
      } else {
        throw new Error('상담신청에 실패했습니다')
      }
    } catch (error) {
      console.error('Consultation form error:', error)
      alert('상담신청에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleProductInterestChange = (productSlug: string, checked: boolean) => {
    const current = watchedProductInterests
    if (checked) {
      setValue('product_interests', [...current, productSlug])
    } else {
      setValue('product_interests', current.filter(p => p !== productSlug))
    }
  }

  if (submitSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          상담신청이 완료되었습니다!
        </h3>
        <p className="text-gray-600 mb-6">
          전문 상담사가 빠른 시일 내에 연락드리겠습니다.
        </p>
        <div className="space-x-4">
          <Button
            onClick={() => setSubmitSuccess(false)}
            variant="outline"
          >
            추가 신청
          </Button>
          <Button
            onClick={() => router.push('/')}
          >
            홈으로 돌아가기
          </Button>
        </div>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">개인정보</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이름 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('name')}
              className={cn(
                'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent',
                errors.name ? 'border-red-300' : 'border-gray-300'
              )}
              placeholder="홍길동"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              전화번호 <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              {...register('phone')}
              className={cn(
                'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent',
                errors.phone ? 'border-red-300' : 'border-gray-300'
              )}
              placeholder="010-1234-5678"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이메일
            </label>
            <input
              type="email"
              {...register('email')}
              className={cn(
                'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent',
                errors.email ? 'border-red-300' : 'border-gray-300'
              )}
              placeholder="example@email.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              회사명
            </label>
            <input
              type="text"
              {...register('company')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="회사명 (선택사항)"
            />
          </div>
        </div>
      </div>

      {/* Consultation Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          상담 유형 <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { value: 'general', label: '일반 상담' },
            { value: 'product', label: '제품 상담' },
            { value: 'business', label: '사업 제휴' },
            { value: 'other', label: '기타' }
          ].map((type) => (
            <label key={type.value} className="flex items-center">
              <input
                type="radio"
                value={type.value}
                {...register('consultation_type')}
                className="mr-2 text-green-600"
              />
              <span className="text-gray-700">{type.label}</span>
            </label>
          ))}
        </div>
        {errors.consultation_type && (
          <p className="text-red-500 text-sm mt-1">{errors.consultation_type.message}</p>
        )}
      </div>

      {/* Product Interests */}
      {products.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            관심 제품 (복수 선택 가능)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
            {products.map((product) => (
              <label key={product.id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={watchedProductInterests.includes(product.slug)}
                  onChange={(e) => handleProductInterestChange(product.slug, e.target.checked)}
                  className="mr-2 text-green-600"
                />
                <span className="text-gray-700 text-sm">{product.name.ko}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Preferred Schedule */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">희망 상담 일정</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              희망 날짜
            </label>
            <input
              type="date"
              {...register('preferred_date')}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              희망 시간
            </label>
            <select
              {...register('preferred_time')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          상담 내용 및 요청사항
        </label>
        <textarea
          {...register('message')}
          rows={4}
          className={cn(
            'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none',
            errors.message ? 'border-red-300' : 'border-gray-300'
          )}
          placeholder="상담받고 싶은 내용이나 궁금한 점을 자유롭게 입력해주세요."
        />
        {errors.message && (
          <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
        )}
      </div>

      {/* Agreement */}
      <div className="space-y-3">
        <div className="flex items-start">
          <input
            type="checkbox"
            {...register('privacy_agreed')}
            className="mr-2 mt-0.5 text-green-600"
          />
          <label className="text-sm text-gray-700">
            <span className="text-red-500">*</span> 개인정보 수집 및 이용에 동의합니다.
            <a href="/privacy" target="_blank" className="text-green-600 hover:underline ml-1">
              자세히 보기
            </a>
          </label>
        </div>
        {errors.privacy_agreed && (
          <p className="text-red-500 text-sm">{errors.privacy_agreed.message}</p>
        )}

        <div className="flex items-start">
          <input
            type="checkbox"
            {...register('marketing_agreed')}
            className="mr-2 mt-0.5 text-green-600"
          />
          <label className="text-sm text-gray-700">
            마케팅 정보 수신에 동의합니다. (선택사항)
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={!isValid || isSubmitting}
        className="w-full py-3 text-lg"
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            상담신청 중...
          </div>
        ) : (
          '무료 상담 신청하기'
        )}
      </Button>

      <p className="text-center text-sm text-gray-500">
        상담신청 후 24시간 이내에 전문 상담사가 연락드립니다.
      </p>
    </form>
  )
}