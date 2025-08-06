'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { User, Mail, Lock, Phone, Calendar, Check } from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    phone: '',
    birthDate: '',
    agreeTerms: false,
    agreePrivacy: false,
    agreeMarketing: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name) newErrors.name = '이름을 입력해주세요'
    if (!formData.email) newErrors.email = '이메일을 입력해주세요'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = '올바른 이메일 형식이 아닙니다'
    
    if (!formData.password) newErrors.password = '비밀번호를 입력해주세요'
    else if (formData.password.length < 8) newErrors.password = '비밀번호는 8자 이상이어야 합니다'
    
    if (!formData.passwordConfirm) newErrors.passwordConfirm = '비밀번호 확인을 입력해주세요'
    else if (formData.password !== formData.passwordConfirm) newErrors.passwordConfirm = '비밀번호가 일치하지 않습니다'
    
    if (!formData.phone) newErrors.phone = '휴대폰 번호를 입력해주세요'
    if (!formData.birthDate) newErrors.birthDate = '생년월일을 입력해주세요'
    
    if (!formData.agreeTerms) newErrors.agreeTerms = '이용약관에 동의해주세요'
    if (!formData.agreePrivacy) newErrors.agreePrivacy = '개인정보처리방침에 동의해주세요'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsLoading(false)
    
    alert('회원가입이 완료되었습니다!')
    router.push('/login')
  }

  const handleAllAgree = () => {
    const allAgree = !formData.agreeTerms || !formData.agreePrivacy || !formData.agreeMarketing
    setFormData(prev => ({
      ...prev,
      agreeTerms: allAgree,
      agreePrivacy: allAgree,
      agreeMarketing: allAgree,
    }))
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <h1 className="text-3xl font-bold text-emerald-600">씨엠웨이</h1>
          </Link>
          <h2 className="text-2xl font-bold text-gray-900">회원가입</h2>
          <p className="mt-2 text-gray-600">건강한 삶의 시작, 씨엠웨이와 함께하세요</p>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white shadow-xl rounded-2xl p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이름 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border ${errors.name ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                  placeholder="홍길동"
                />
                <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이메일 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                  placeholder="example@email.com"
                />
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                비밀번호 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border ${errors.password ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                  placeholder="8자 이상 입력"
                />
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            {/* Password Confirm */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                비밀번호 확인 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="passwordConfirm"
                  value={formData.passwordConfirm}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border ${errors.passwordConfirm ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                  placeholder="비밀번호 재입력"
                />
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              {errors.passwordConfirm && <p className="mt-1 text-sm text-red-600">{errors.passwordConfirm}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                휴대폰 번호 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border ${errors.phone ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                  placeholder="010-0000-0000"
                />
                <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
            </div>

            {/* Birth Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                생년월일 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border ${errors.birthDate ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                />
                <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              {errors.birthDate && <p className="mt-1 text-sm text-red-600">{errors.birthDate}</p>}
            </div>

            {/* Terms */}
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="allAgree"
                  checked={formData.agreeTerms && formData.agreePrivacy && formData.agreeMarketing}
                  onChange={handleAllAgree}
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <label htmlFor="allAgree" className="ml-2 text-sm font-medium text-gray-900">
                  전체 동의
                </label>
              </div>

              <div className="ml-6 space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  />
                  <label htmlFor="agreeTerms" className="ml-2 text-sm text-gray-700">
                    [필수] 이용약관 동의
                  </label>
                  <Link href="/terms" className="ml-auto text-xs text-emerald-600 hover:underline">
                    보기
                  </Link>
                </div>
                {errors.agreeTerms && <p className="ml-6 text-xs text-red-600">{errors.agreeTerms}</p>}

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="agreePrivacy"
                    name="agreePrivacy"
                    checked={formData.agreePrivacy}
                    onChange={handleChange}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  />
                  <label htmlFor="agreePrivacy" className="ml-2 text-sm text-gray-700">
                    [필수] 개인정보처리방침 동의
                  </label>
                  <Link href="/privacy" className="ml-auto text-xs text-emerald-600 hover:underline">
                    보기
                  </Link>
                </div>
                {errors.agreePrivacy && <p className="ml-6 text-xs text-red-600">{errors.agreePrivacy}</p>}

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="agreeMarketing"
                    name="agreeMarketing"
                    checked={formData.agreeMarketing}
                    onChange={handleChange}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  />
                  <label htmlFor="agreeMarketing" className="ml-2 text-sm text-gray-700">
                    [선택] 마케팅 정보 수신 동의
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '처리 중...' : '회원가입'}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center text-sm text-gray-600">
            이미 계정이 있으신가요?{' '}
            <Link href="/login" className="font-medium text-emerald-600 hover:text-emerald-500">
              로그인
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
    </MainLayout>
  )
}