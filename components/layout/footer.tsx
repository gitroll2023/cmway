'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, Youtube, Phone, Mail, MapPin } from 'lucide-react'
import { useCMSStore } from '@/store/cms'

export function Footer() {
  const { siteSettings } = useCMSStore()

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              {siteSettings?.logo_dark ? (
                <Image
                  src={siteSettings.logo_dark}
                  alt={siteSettings.site_name?.ko || 'CMWay'}
                  width={160}
                  height={40}
                  className="h-10 w-auto"
                />
              ) : (
                <div className="text-2xl font-bold text-white">
                  {siteSettings?.site_name?.ko || 'CMWay'}
                </div>
              )}
            </div>
            
            <p className="text-gray-300 mb-4 leading-relaxed">
              {siteSettings?.tagline?.ko || '건강한 삶의 동반자'}
            </p>

            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-300">
                    {siteSettings?.company_info?.address?.ko || '서울특별시 강남구 테헤란로 000'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-300">
                    대표: {siteSettings?.company_info?.phone || '02-0000-0000'}
                  </p>
                  <p className="text-sm text-gray-300">
                    고객센터: {siteSettings?.company_info?.customer_center?.phone || '1588-0000'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                <p className="text-sm text-gray-300">
                  {siteSettings?.company_info?.email || 'contact@cmway.co.kr'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">바로가기</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/about" 
                  className="text-gray-300 hover:text-primary transition-colors"
                >
                  회사소개
                </Link>
              </li>
              <li>
                <Link 
                  href="/products" 
                  className="text-gray-300 hover:text-primary transition-colors"
                >
                  제품소개
                </Link>
              </li>
              <li>
                <Link 
                  href="/stores" 
                  className="text-gray-300 hover:text-primary transition-colors"
                >
                  매장안내
                </Link>
              </li>
              <li>
                <Link 
                  href="/consultation" 
                  className="text-gray-300 hover:text-primary transition-colors"
                >
                  상담신청
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-gray-300 hover:text-primary transition-colors"
                >
                  문의하기
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">고객센터</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xl font-bold text-primary">
                  {siteSettings?.company_info?.customer_center?.phone || '1588-0000'}
                </p>
                <p className="text-sm text-gray-300">
                  {siteSettings?.company_info?.customer_center?.hours || '평일 09:00 - 18:00'}
                </p>
                <p className="text-sm text-gray-300">
                  {siteSettings?.company_info?.customer_center?.lunch || '점심시간 12:00 - 13:00'}
                </p>
                <p className="text-sm text-gray-300">
                  {siteSettings?.company_info?.customer_center?.holiday || '토/일/공휴일 휴무'}
                </p>
              </div>
            </div>

            {/* Social Links */}
            {(siteSettings?.social_links?.facebook || 
              siteSettings?.social_links?.instagram || 
              siteSettings?.social_links?.youtube) && (
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-3">소셜 미디어</h4>
                <div className="flex space-x-3">
                  {siteSettings?.social_links?.facebook && (
                    <a
                      href={siteSettings.social_links.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
                    >
                      <Facebook className="h-4 w-4" />
                    </a>
                  )}
                  {siteSettings?.social_links?.instagram && (
                    <a
                      href={siteSettings.social_links.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
                    >
                      <Instagram className="h-4 w-4" />
                    </a>
                  )}
                  {siteSettings?.social_links?.youtube && (
                    <a
                      href={siteSettings.social_links.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
                    >
                      <Youtube className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-400 mb-1">
                {siteSettings?.company_info?.name || '씨엠웨이(주)'} | 
                대표이사: {siteSettings?.company_info?.ceo || '대표이사명'}
              </p>
              <p className="text-sm text-gray-400 mb-1">
                사업자등록번호: {siteSettings?.company_info?.business_number || '000-00-00000'} | 
                통신판매업신고번호: {siteSettings?.company_info?.online_business_number || '제 0000-서울-0000호'}
              </p>
              <p className="text-sm text-gray-400">
                {siteSettings?.footer_config?.copyright || '© 2025 CMWay Co., Ltd. All rights reserved.'}
              </p>
            </div>

            <div className="flex space-x-6 text-sm">
              <Link 
                href="/privacy" 
                className="text-gray-400 hover:text-primary transition-colors"
              >
                개인정보처리방침
              </Link>
              <Link 
                href="/terms" 
                className="text-gray-400 hover:text-primary transition-colors"
              >
                이용약관
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}