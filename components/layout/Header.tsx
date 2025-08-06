'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCMSStore } from '@/store/cms'
import { usePathname } from 'next/navigation'

const navigationItems = [
  {
    title: '회사소개',
    href: '/about',
    submenu: [
      { title: '인사말', href: '/about' },
      { title: '회사연혁', href: '/about/history' },
      { title: '인증서', href: '/about/certification' },
      { title: '오시는 길', href: '/stores' },
    ]
  },
  {
    title: '제품소개',
    href: '/products',
    submenu: []
  },
  {
    title: '매장안내',
    href: '/stores',
    submenu: [
      { title: '매장 찾기', href: '/stores' },
      { title: '제품 문의', href: '/consultation' },
    ]
  },

  {
    title: '고객센터',
    href: '/consultation',
    submenu: [
      { title: '상담 신청', href: '/consultation' },
      { title: '자주 묻는 질문', href: '/faq' },
      { title: '공지사항', href: '/news?category=notice' },
      { title: '자료실', href: '/resources' },
      { title: '문의하기', href: '/contact' },
    ]
  },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSubmenu, setActiveSubmenu] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)
  const { siteSettings } = useCMSStore()
  const pathname = usePathname()
  
  // 메인 페이지인지 확인 - 정확한 경로 매칭
  const isMainPage = pathname === '/'
  console.log('Current path:', pathname, 'isMainPage:', isMainPage) // 디버깅용

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Main Header */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          pathname !== '/' 
            ? 'bg-white shadow-lg' 
            : isScrolled 
            ? 'bg-white shadow-lg' 
            : isHovered 
            ? 'bg-white/95 backdrop-blur-sm shadow-lg'
            : 'bg-transparent'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        id="header"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center relative z-10">
              {siteSettings?.logo ? (
                <Image
                  src={siteSettings.logo}
                  alt={siteSettings.site_name?.ko || 'CMWay'}
                  width={180}
                  height={50}
                  className={`h-12 w-auto transition-all duration-300 ${
                    pathname === '/' && !(isScrolled || isHovered) ? 'brightness-0 invert' : ''
                  }`}
                />
              ) : (
                <div className="flex flex-col">
                  <span className={`text-2xl font-bold transition-colors duration-300 ${
                    pathname === '/' && !(isScrolled || isHovered)
                      ? 'text-white'
                      : 'bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent'
                  }`}>
                    {siteSettings?.site_name?.ko || 'CMWay'}
                  </span>
                  <span className={`text-xs transition-colors duration-300 ${
                    pathname === '/' && !(isScrolled || isHovered) ? 'text-white/80' : 'text-gray-500'
                  }`}>
                    건강기능식품 전문기업
                  </span>
                </div>
              )}
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center">
              <ul className="flex items-center">
                {navigationItems.map((item, index) => (
                  <li
                    key={index}
                    className="relative group"
                    onMouseEnter={() => setActiveSubmenu(index)}
                    onMouseLeave={() => setActiveSubmenu(null)}
                  >
                    <Link
                      href={item.href}
                      className={`block px-6 py-8 text-base font-medium transition-all duration-300 ${
                        pathname === '/' && !(isScrolled || isHovered)
                          ? 'text-white hover:text-green-300'
                          : 'text-gray-700 hover:text-green-600'
                      }`}
                    >
                      {item.title}
                    </Link>

                    {/* Submenu - 드롭다운 메뉴 */}
                    <AnimatePresence>
                      {item.submenu && activeSubmenu === index && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 w-52 bg-white shadow-2xl overflow-hidden"
                        >
                          {item.submenu.map((subItem, subIndex) => (
                            <Link
                              key={subIndex}
                              href={subItem.href}
                              className="block px-5 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 hover:text-green-700 transition-all duration-200 border-b border-gray-100 last:border-0"
                            >
                              {subItem.title}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                ))}
              </ul>
              
              {/* Login Button - Desktop */}
              <Link
                href="/login"
                className={`ml-6 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  pathname === '/' && !(isScrolled || isHovered)
                    ? 'bg-white/20 text-white hover:bg-white/30'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                로그인
              </Link>
            </nav>

            {/* Mobile Menu Toggle */}
            <button
              className={`lg:hidden p-2 transition-colors ${
                pathname === '/' && !(isScrolled || isHovered)
                  ? 'text-white'
                  : 'text-gray-700 hover:text-green-600'
              }`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        
      </header>

      {/* Mobile Side Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Side Menu */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 w-[85%] max-w-sm h-full bg-white z-50 lg:hidden overflow-y-auto"
            >
              {/* Menu Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
                <div className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  {siteSettings?.site_name?.ko || 'CMWay'}
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-white/50 transition-colors"
                >
                  <X className="h-6 w-6 text-gray-600" />
                </button>
              </div>

              {/* User Actions */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <Link
                    href="/login"
                    className="flex-1 py-2 text-center text-sm text-gray-600 hover:text-primary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    로그인
                  </Link>
                  <div className="w-px h-4 bg-gray-300" />
                  <Link
                    href="/register"
                    className="flex-1 py-2 text-center text-sm text-gray-600 hover:text-primary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    회원가입
                  </Link>
               
                </div>
              </div>

              {/* Navigation Menu */}
              <nav className="p-4">
                {navigationItems.map((item, index) => (
                  <div key={index} className="mb-4">
                    <div className="flex items-center justify-between">
                      <Link
                        href={item.href}
                        className="flex-1 py-2 text-lg font-medium text-gray-800 hover:text-primary transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.title}
                      </Link>
                      {item.submenu && (
                        <button
                          className={`p-2 transition-transform ${
                            activeSubmenu === index ? 'rotate-180' : ''
                          }`}
                          onClick={() => setActiveSubmenu(activeSubmenu === index ? null : index)}
                        >
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      )}
                    </div>
                    
                    {/* Submenu */}
                    <AnimatePresence>
                      {item.submenu && activeSubmenu === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="pl-4 mt-2 space-y-2">
                            {item.submenu.map((subItem, subIndex) => (
                              <Link
                                key={subIndex}
                                href={subItem.href}
                                className="block py-2 text-gray-600 hover:text-primary transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                {subItem.title}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </nav>

              {/* Bottom Actions */}
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <Link
                  href="/consultation"
                  className="block w-full px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-medium rounded-full text-center hover:shadow-lg transition-all duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  무료 건강상담
                </Link>
                
                {/* Contact Info */}
                <div className="mt-4 text-center">
                  <div className="text-sm text-gray-600">고객센터</div>
                  <div className="mt-1 text-lg font-semibold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    {siteSettings?.company_info?.customer_center?.phone || '1588-0000'}
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {siteSettings?.company_info?.customer_center?.hours || '평일 09:00 - 18:00'}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer 제거 - 히어로 섹션이 헤더 뒤에 위치하도록 */}
    </>
  )
}