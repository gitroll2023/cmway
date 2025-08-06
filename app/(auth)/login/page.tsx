'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const supabase = createClient()
      
      // 테스트용: admin@cmway.co.kr / admin1234 로 하드코딩
      if (email === 'admin@cmway.co.kr' && password === 'admin1234') {
        // 세션 스토리지에 간단한 인증 정보 저장
        sessionStorage.setItem('isAdmin', 'true')
        sessionStorage.setItem('adminEmail', email)
        
        // 관리자 대시보드로 이동
        router.push('/admin')
      } else {
        // 실제 Supabase 인증 시도
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          setError('이메일 또는 비밀번호가 올바르지 않습니다.')
        } else {
          router.push('/admin')
        }
      }
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">관리자 로그인</h2>
          <p className="mt-2 text-sm text-gray-600">
            씨엠웨이 CMS 관리자 페이지
          </p>
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
            <p className="text-xs text-yellow-800">
              <strong>테스트 계정:</strong><br/>
              이메일: admin@cmway.co.kr<br/>
              비밀번호: admin1234
            </p>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                이메일
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="admin@cmway.co.kr"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                로그인 상태 유지
              </label>
            </div>

            <div className="text-sm">
              <Link href="/forgot-password" className="font-medium text-green-600 hover:text-green-500">
                비밀번호를 잊으셨나요?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>

          <div className="text-center">
            <span className="text-sm text-gray-600">계정이 없으신가요? </span>
            <Link href="/register" className="text-sm font-medium text-green-600 hover:text-green-500">
              회원가입
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}