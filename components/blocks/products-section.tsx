'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Star, Heart, Shield, Zap, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Product, Category } from '@/lib/types/cms'

interface ProductsSectionProps {
  title?: string
  subtitle?: string
  description?: string
  products?: Product[]
  categories?: Category[]
  featuredOnly?: boolean
  maxProducts?: number
  showCategories?: boolean
  cta?: {
    text: string
    link: string
  }
  locale?: 'ko' | 'en'
}

export function ProductsSection({
  title = "프리미엄 건강식품",
  subtitle = "과학적 연구를 바탕으로 한",
  description = "GMP 인증 시설에서 생산되는 최고 품질의 건강기능식품으로 여러분의 건강한 삶을 지원합니다.",
  products = [],
  categories = [],
  featuredOnly = true,
  maxProducts = 6,
  showCategories = true,
  cta = {
    text: "모든 제품 보기",
    link: "/products"
  },
  locale = 'ko'
}: ProductsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Default products if none provided
  const defaultProducts = [
    {
      id: '1',
      sku: 'PMV-001',
      name: { ko: '프리미엄 멀티비타민', en: 'Premium Multivitamin' },
      slug: 'premium-multivitamin',
      short_description: { 
        ko: '하루 한 번으로 충분한 종합 비타민', 
        en: 'Complete daily vitamin in one capsule' 
      },
      pricing: { price_text: '상담 후 안내', is_price_visible: false },
      media: { featured_image: undefined, gallery: [], videos: [], documents: [] },
      quality: { gmp_certified: true, haccp_certified: true, organic_certified: false, other_certifications: [] },
      seo: {},
      inquiry_settings: { enable_inquiry: true, inquiry_button_text: '문의하기', show_kakao_chat: true, show_phone_number: true },
      related_products: { cross_sells: [], up_sells: [], frequently_bought: [] },
      status: 'published' as const,
      stats: { view_count: 0, inquiry_count: 0, brochure_download_count: 0 },
      custom_fields: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      featured: true,
      is_new: true,
      is_best: false,
      category_ids: ['vitamins']
    },
    {
      id: '2',
      sku: 'OMG-002', 
      name: { ko: '오메가-3 프리미엄', en: 'Premium Omega-3' },
      slug: 'premium-omega-3',
      short_description: { 
        ko: '고농도 EPA/DHA 오메가-3', 
        en: 'High concentration EPA/DHA Omega-3' 
      },
      pricing: { price_text: '상담 후 안내', is_price_visible: false },
      media: { featured_image: undefined, gallery: [], videos: [], documents: [] },
      quality: { gmp_certified: true, haccp_certified: true, organic_certified: false, other_certifications: [] },
      seo: {},
      inquiry_settings: { enable_inquiry: true, inquiry_button_text: '문의하기', show_kakao_chat: true, show_phone_number: true },
      related_products: { cross_sells: [], up_sells: [], frequently_bought: [] },
      status: 'published' as const,
      stats: { view_count: 0, inquiry_count: 0, brochure_download_count: 0 },
      custom_fields: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      featured: true,
      is_new: false,
      is_best: false,
      category_ids: ['omega']
    },
    {
      id: '3',
      sku: 'PRO-003',
      name: { ko: '프로바이오틱스 플러스', en: 'Probiotics Plus' },
      slug: 'probiotics-plus',
      short_description: { 
        ko: '장 건강을 위한 유산균', 
        en: 'Beneficial bacteria for gut health' 
      },
      pricing: { price_text: '상담 후 안내', is_price_visible: false },
      media: { featured_image: undefined, gallery: [], videos: [], documents: [] },
      quality: { gmp_certified: true, haccp_certified: true, organic_certified: false, other_certifications: [] },
      seo: {},
      inquiry_settings: { enable_inquiry: true, inquiry_button_text: '문의하기', show_kakao_chat: true, show_phone_number: true },
      related_products: { cross_sells: [], up_sells: [], frequently_bought: [] },
      status: 'published' as const,
      stats: { view_count: 0, inquiry_count: 0, brochure_download_count: 0 },
      custom_fields: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      featured: true,
      is_new: false,
      is_best: false,
      category_ids: ['probiotics']
    }
  ] as Product[]

  const defaultCategories = [
    { 
      id: 'all', 
      name: { ko: '전체', en: 'All' }, 
      slug: 'all',
      meta: {},
      display_settings: { show_in_menu: true, show_in_homepage: true, show_in_footer: false, featured: false },
      layout_settings: { products_per_page: 12, default_view: 'grid' as const, show_filters: true, show_sorting: true },
      custom_fields: {},
      position: 0,
      level: 0,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    { 
      id: 'vitamins', 
      name: { ko: '비타민', en: 'Vitamins' }, 
      slug: 'vitamins',
      meta: {},
      display_settings: { show_in_menu: true, show_in_homepage: true, show_in_footer: false, featured: true },
      layout_settings: { products_per_page: 12, default_view: 'grid' as const, show_filters: true, show_sorting: true },
      custom_fields: {},
      position: 1,
      level: 0,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    { 
      id: 'omega', 
      name: { ko: '오메가-3', en: 'Omega-3' }, 
      slug: 'omega',
      meta: {},
      display_settings: { show_in_menu: true, show_in_homepage: true, show_in_footer: false, featured: true },
      layout_settings: { products_per_page: 12, default_view: 'grid' as const, show_filters: true, show_sorting: true },
      custom_fields: {},
      position: 2,
      level: 0,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    { 
      id: 'probiotics', 
      name: { ko: '프로바이오틱스', en: 'Probiotics' }, 
      slug: 'probiotics',
      meta: {},
      display_settings: { show_in_menu: true, show_in_homepage: true, show_in_footer: false, featured: true },
      layout_settings: { products_per_page: 12, default_view: 'grid' as const, show_filters: true, show_sorting: true },
      custom_fields: {},
      position: 3,
      level: 0,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ] as Category[]

  const displayProducts = products.length > 0 ? products : defaultProducts
  const displayCategories = categories.length > 0 ? categories : defaultCategories

  // Filter products based on selected category and other criteria
  const filteredProducts = displayProducts
    .filter(product => {
      if (featuredOnly && !product.featured) return false
      if (selectedCategory && selectedCategory !== 'all' && 
          !product.category_ids?.includes(selectedCategory)) return false
      return true
    })
    .slice(0, maxProducts)

  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case 'vitamins':
        return <Zap className="h-5 w-5" />
      case 'omega':
        return <Heart className="h-5 w-5" />
      case 'probiotics':
        return <Shield className="h-5 w-5" />
      default:
        return <Star className="h-5 w-5" />
    }
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-green-600 font-semibold text-lg mb-2">
            {subtitle}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {description}
          </p>
        </motion.div>

        {/* Category Filter */}
        {showCategories && displayCategories.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex justify-center mb-12"
          >
            <div className="flex flex-wrap gap-2 bg-gray-100 rounded-full p-2">
              {displayCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(
                    selectedCategory === category.id ? null : category.id
                  )}
                  className={cn(
                    'flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-300',
                    selectedCategory === category.id || (!selectedCategory && category.id === 'all')
                      ? 'bg-green-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                  )}
                >
                  {getCategoryIcon(category.id)}
                  <span>{category.name[locale]}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* Product Image */}
              <div className="relative h-64 bg-gradient-to-br from-green-50 to-blue-50 overflow-hidden">
                {product.media?.featured_image ? (
                  <Image
                    src={product.media.featured_image}
                    alt={product.name[locale] || ''}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                      <Shield className="h-10 w-10 text-green-600" />
                    </div>
                  </div>
                )}
                
                {/* Badges */}
                <div className="absolute top-4 left-4 space-y-2">
                  {product.is_new && (
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      NEW
                    </span>
                  )}
                  {product.featured && (
                    <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      인기
                    </span>
                  )}
                </div>

                {/* Quick View Button */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <Button
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    asChild
                  >
                    <Link href={`/products/${product.slug}`}>
                      <Eye className="h-4 w-4 mr-2" />
                      자세히 보기
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                  <Link href={`/products/${product.slug}`}>
                    {product.name[locale]}
                  </Link>
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {product.short_description?.[locale]}
                </p>

                <div className="flex items-center justify-between">
                  {product.pricing?.is_price_visible ? (
                    <div className="text-lg font-bold text-green-600">
                      {product.pricing.price_text}
                    </div>
                  ) : (
                    <div className="text-gray-500">
                      상담 후 안내
                    </div>
                  )}
                  
                  <Button size="sm" variant="ghost" asChild>
                    <Link href={`/products/${product.slug}`}>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button asChild size="lg" className="group">
            <Link href={cta.link}>
              {cta.text}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}