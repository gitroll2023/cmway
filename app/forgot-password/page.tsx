'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft, CheckCircle, Phone, User } from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'

type ResetMethod = 'email' | 'phone'
type Step = 'method' | 'input' | 'verify' | 'reset' | 'complete'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('method')
  const [resetMethod, setResetMethod] = useState<ResetMethod>('email')
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    name: '',
    verificationCode: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleMethodSelect = (method: ResetMethod) => {
    setResetMethod(method)
    setStep('input')
  }

  const handleSendCode = async () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name) newErrors.name = '이름을 입력해주세요'
    
    if (resetMethod === 'email') {
      if (!formData.email) newErrors.email = '이메일을 입력해주세요'
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = '올바른 이메일 형식이 아닙니다'
    } else {
      if (!formData.phone) newErrors.phone = '휴대폰 번호를 입력해주세요'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsLoading(false)
    setStep('verify')
  }

  const handleVerifyCode = async () => {
    if (!formData.verificationCode) {
      setErrors({ verificationCode: '인증번호를 입력해주세요' })
      return
    }

    if (formData.verificationCode.length !== 6) {
      setErrors({ verificationCode: '6자리 인증번호를 입력해주세요' })
      return
    }

    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    setStep('reset')
  }

  const handleResetPassword = async () => {
    const newErrors: Record<string, string> = {}

    if (!formData.newPassword) newErrors.newPassword = '새 비밀번호를 입력해주세요'
    else if (formData.newPassword.length < 8) newErrors.newPassword = '비밀번호는 8자 이상이어야 합니다'
    
    if (!formData.confirmPassword) newErrors.confirmPassword = '비밀번호 확인을 입력해주세요'
    else if (formData.newPassword !== formData.confirmPassword) newErrors.confirmPassword = '비밀번호가 일치하지 않습니다'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsLoading(false)
    setStep('complete')
  }

  const renderStepContent = () => {
    switch (step) {
      case 'method':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 text-center mb-6">
              비밀번호 재설정 방법을 선택해주세요
            </h3>
            
            <button
              onClick={() => handleMethodSelect('email')}
              className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all group"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                  <Mail className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="ml-4 text-left">
                  <p className="font-medium text-gray-900">이메일로 재설정</p>
                  <p className="text-sm text-gray-500">가입 시 등록한 이메일로 인증</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleMethodSelect('phone')}
              className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all group"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <Phone className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4 text-left">
                  <p className="font-medium text-gray-900">휴대폰으로 재설정</p>
                  <p className="text-sm text-gray-500">가입 시 등록한 휴대폰으로 인증</p>
                </div>
              </div>
            </button>
          </div>
        )

      case 'input':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 text-center mb-6">
              {resetMethod === 'email' ? '이메일 정보 입력' : '휴대폰 정보 입력'}
            </h3>

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

            {resetMethod === 'email' ? (
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
            ) : (
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
            )}

            <button
              onClick={handleSendCode}
              disabled={isLoading}
              className="w-full py-3 px-4 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '전송 중...' : '인증번호 전송'}
            </button>
          </div>
        )

      case 'verify':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
              인증번호 입력
            </h3>
            <p className="text-sm text-gray-600 text-center mb-6">
              {resetMethod === 'email' 
                ? `${formData.email}로 전송된 인증번호를 입력해주세요`
                : `${formData.phone}로 전송된 인증번호를 입력해주세요`}
            </p>

            <div>
              <input
                type="text"
                name="verificationCode"
                value={formData.verificationCode}
                onChange={handleChange}
                maxLength={6}
                className={`w-full px-4 py-3 text-center text-2xl tracking-widest border ${errors.verificationCode ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                placeholder="000000"
              />
              {errors.verificationCode && <p className="mt-1 text-sm text-red-600 text-center">{errors.verificationCode}</p>}
            </div>

            <button
              onClick={handleVerifyCode}
              disabled={isLoading}
              className="w-full py-3 px-4 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '확인 중...' : '인증번호 확인'}
            </button>

            <button
              onClick={handleSendCode}
              className="w-full py-2 text-sm text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              인증번호 재전송
            </button>
          </div>
        )

      case 'reset':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 text-center mb-6">
              새 비밀번호 설정
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                새 비밀번호 <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors.newPassword ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                placeholder="8자 이상 입력"
              />
              {errors.newPassword && <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                비밀번호 확인 <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                placeholder="비밀번호 재입력"
              />
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>

            <button
              onClick={handleResetPassword}
              disabled={isLoading}
              className="w-full py-3 px-4 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '변경 중...' : '비밀번호 변경'}
            </button>
          </div>
        )

      case 'complete':
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-10 w-10 text-emerald-600" />
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                비밀번호 변경 완료!
              </h3>
              <p className="text-gray-600">
                새로운 비밀번호로 로그인해주세요
              </p>
            </div>

            <button
              onClick={() => router.push('/login')}
              className="w-full py-3 px-4 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
            >
              로그인 페이지로 이동
            </button>
          </div>
        )
    }
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
          <h2 className="text-2xl font-bold text-gray-900">비밀번호 찾기</h2>
          <p className="mt-2 text-gray-600">
            {step === 'complete' ? '비밀번호가 성공적으로 변경되었습니다' : '가입 시 등록한 정보로 비밀번호를 재설정하세요'}
          </p>
        </div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white shadow-xl rounded-2xl p-8"
        >
          {/* Back Button */}
          {step !== 'method' && step !== 'complete' && (
            <button
              onClick={() => {
                if (step === 'input') setStep('method')
                else if (step === 'verify') setStep('input')
                else if (step === 'reset') setStep('verify')
              }}
              className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              이전 단계
            </button>
          )}

          {/* Step Indicator */}
          {step !== 'method' && step !== 'complete' && (
            <div className="flex items-center justify-center mb-6">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === 'input' ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-600'
              }`}>
                1
              </div>
              <div className={`w-16 h-1 ${step === 'verify' || step === 'reset' ? 'bg-emerald-600' : 'bg-gray-300'}`} />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === 'verify' ? 'bg-emerald-600 text-white' : step === 'reset' ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-300 text-gray-500'
              }`}>
                2
              </div>
              <div className={`w-16 h-1 ${step === 'reset' ? 'bg-emerald-600' : 'bg-gray-300'}`} />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === 'reset' ? 'bg-emerald-600 text-white' : 'bg-gray-300 text-gray-500'
              }`}>
                3
              </div>
            </div>
          )}

          {/* Step Content */}
          {renderStepContent()}

          {/* Footer Links */}
          {step === 'method' && (
            <div className="mt-6 text-center text-sm text-gray-600">
              <Link href="/login" className="font-medium text-emerald-600 hover:text-emerald-500">
                로그인으로 돌아가기
              </Link>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
    </MainLayout>
  )
}