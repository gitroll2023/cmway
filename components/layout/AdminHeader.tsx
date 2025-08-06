'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings, 
  Bell,
  Home,
  Package,
  Users,
  FileText,
  BarChart3,
  Image as ImageIcon,
  MessageSquare,
  Shield
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const adminMenuItems = [
  {
    title: '대시보드',
    href: '/admin',
    icon: Home,
  },
  {
    title: '사이트 설정',
    href: '/admin/settings',
    icon: Settings,
    submenu: [
      { title: '기본 설정', href: '/admin/settings/general' },
      { title: '히어로 섹션', href: '/admin/site/hero' },
      { title: '메뉴 관리', href: '/admin/settings/navigation' },
      { title: 'SEO 설정', href: '/admin/settings/seo' },
    ]
  },
  {
    title: '제품 관리',
    href: '/admin/products',
    icon: Package,
    submenu: [
      { title: '제품 목록', href: '/admin/products' },
      { title: '카테고리 관리', href: '/admin/products/categories' },
      { title: '재고 관리', href: '/admin/products/inventory' },
    ]
  },
  {
    title: '회원 관리',
    href: '/admin/users',
    icon: Users,
    submenu: [
      { title: '회원 목록', href: '/admin/users' },
      { title: '회원 그룹', href: '/admin/users/groups' },
      { title: '탈퇴 회원', href: '/admin/users/withdrawn' },
    ]
  },
  {
    title: '콘텐츠 관리',
    href: '/admin/content',
    icon: FileText,
    submenu: [
      { title: '페이지 관리', href: '/admin/content/pages' },
      { title: '공지사항', href: '/admin/content/notices' },
      { title: '뉴스/이벤트', href: '/admin/content/news' },
      { title: 'FAQ', href: '/admin/content/faq' },
      { title: '자료실', href: '/admin/resources/documents' },
    ]
  },
  {
    title: '상담 관리',
    href: '/admin/consultations',
    icon: MessageSquare,
    submenu: [
      { title: '상담 신청', href: '/admin/consultations' },
      { title: '문의 내역', href: '/admin/consultations/inquiries' },
    ]
  },
  {
    title: '미디어',
    href: '/admin/media',
    icon: ImageIcon,
  },
  {
    title: '통계',
    href: '/admin/analytics',
    icon: BarChart3,
  },
  {
    title: '관리자',
    href: '/admin/admins',
    icon: Shield,
    submenu: [
      { title: '관리자 목록', href: '/admin/admins' },
      { title: '권한 관리', href: '/admin/admins/permissions' },
      { title: '활동 로그', href: '/admin/admins/logs' },
    ]
  },
]

export function AdminHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const toggleSubmenu = (title: string) => {
    setExpandedMenu(expandedMenu === title ? null : title)
  }

  const handleLogout = () => {
    // 로그아웃 처리
    router.push('/login')
  }

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-gray-900 text-white shadow-lg">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-800 transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Logo */}
            <Link href="/admin" className="flex items-center space-x-2">
              <div className="text-xl font-bold">
                <span className="text-emerald-400">CMWay</span>
                <span className="text-gray-400 text-sm ml-2">Admin</span>
              </div>
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Go to Site */}
            <Link
              href="/"
              target="_blank"
              className="hidden sm:flex items-center space-x-1 px-3 py-1.5 text-sm bg-gray-800 hover:bg-gray-700 rounded-md transition-colors"
            >
              <Home className="h-4 w-4" />
              <span>사이트 보기</span>
            </Link>

            {/* Notifications */}
            <button className="relative p-2 rounded-md hover:bg-gray-800 transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-800 transition-colors"
              >
                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5" />
                </div>
                <span className="hidden md:block text-sm">관리자</span>
              </button>

              {/* User Dropdown */}
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden"
                  >
                    
                    <hr className="border-gray-200" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="text-sm">로그아웃</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 overflow-y-auto">
        <nav className="p-4">
          {adminMenuItems.map((item) => (
            <div key={item.title} className="mb-2">
              <button
                onClick={() => item.submenu ? toggleSubmenu(item.title) : router.push(item.href)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                  pathname === item.href 
                    ? 'bg-emerald-50 text-emerald-600' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.title}</span>
                </div>
                {item.submenu && (
                  <motion.div
                    animate={{ rotate: expandedMenu === item.title ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.div>
                )}
              </button>

              {/* Submenu */}
              <AnimatePresence>
                {item.submenu && expandedMenu === item.title && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="ml-8 mt-1 space-y-1">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                            pathname === subItem.href
                              ? 'bg-emerald-50 text-emerald-600'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
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
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsSidebarOpen(false)}
            />

            {/* Sidebar */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="lg:hidden fixed left-0 top-0 w-64 h-full bg-white z-50 overflow-y-auto"
            >
              {/* Sidebar Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="text-xl font-bold">
                  <span className="text-emerald-600">CMWay</span>
                  <span className="text-gray-400 text-sm ml-2">Admin</span>
                </div>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Sidebar Navigation */}
              <nav className="p-4">
                {adminMenuItems.map((item) => (
                  <div key={item.title} className="mb-2">
                    <button
                      onClick={() => {
                        if (item.submenu) {
                          toggleSubmenu(item.title)
                        } else {
                          router.push(item.href)
                          setIsSidebarOpen(false)
                        }
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                        pathname === item.href 
                          ? 'bg-emerald-50 text-emerald-600' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium">{item.title}</span>
                      </div>
                      {item.submenu && (
                        <motion.div
                          animate={{ rotate: expandedMenu === item.title ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </motion.div>
                      )}
                    </button>

                    {/* Submenu */}
                    <AnimatePresence>
                      {item.submenu && expandedMenu === item.title && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="ml-8 mt-1 space-y-1">
                            {item.submenu.map((subItem) => (
                              <Link
                                key={subItem.href}
                                href={subItem.href}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                                  pathname === subItem.href
                                    ? 'bg-emerald-50 text-emerald-600'
                                    : 'text-gray-600 hover:bg-gray-50'
                                }`}
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
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}