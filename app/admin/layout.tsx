'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminHeader } from '@/components/layout/AdminHeader'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // 테스트용 인증 체크
    const isAdmin = sessionStorage.getItem('isAdmin')
    if (!isAdmin) {
      router.push('/login')
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      
      {/* Main content area with padding for desktop sidebar */}
      <div className="lg:pl-64 pt-16">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}