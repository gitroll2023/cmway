'use client'

import { useEffect } from 'react'
import { Header } from './header'
import { Footer } from './footer'
import { useCMSStore } from '@/store/cms'
import { siteSettingsApi } from '@/lib/api/cms'
import { usePathname } from 'next/navigation'

interface MainLayoutProps {
  children: React.ReactNode
  showHeader?: boolean
  showFooter?: boolean
}

export function MainLayout({ 
  children, 
  showHeader = true, 
  showFooter = true 
}: MainLayoutProps) {
  const { setSiteSettings, setLoading } = useCMSStore()
  const pathname = usePathname()
  
  // 메인 페이지인지 확인
  const isMainPage = pathname === '/'

  useEffect(() => {
    const loadSiteSettings = async () => {
      setLoading(true)
      try {
        const response = await siteSettingsApi.get()
        if (response.success && response.data) {
          setSiteSettings(response.data)
        }
      } catch (error) {
        console.error('Failed to load site settings:', error)
      } finally {
        setLoading(false)
      }
    }

    loadSiteSettings()
  }, [setSiteSettings, setLoading])

  return (
    <div className="min-h-screen flex flex-col">
      {showHeader && <Header />}
      
      <main className={`flex-1 ${!isMainPage ? 'pt-20' : ''}`}>
        {children}
      </main>
      
      {showFooter && <Footer />}
    </div>
  )
}