import React from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Shield, Award, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { products } from '@/lib/cms'
import type { Product } from '@/lib/types/cms'
import { MainLayout } from '@/components/layout/main-layout'
import { ProductImageGallery, ProductActions, RelatedProducts, ProductDetailTabs } from './product-detail-client'

interface ProductDetailPageProps {
  params: {
    slug: string
  }
}

// Add metadata generation for SEO
export async function generateMetadata({ params }: ProductDetailPageProps) {
  try {
    const { data: product } = await products.getBySlug(params.slug)
    if (!product) {
      return {
        title: '제품을 찾을 수 없습니다 | CMWay'
      }
    }

    return {
      title: `${product.name.ko} | CMWay`,
      description: product.short_description?.ko || product.description?.ko,
      keywords: product.features?.ko?.join(', '),
      openGraph: {
        title: product.name.ko,
        description: product.short_description?.ko,
        images: product.media?.featured_image ? [product.media.featured_image] : [],
      }
    }
  } catch (error) {
    return {
      title: '제품 상세 | CMWay'
    }
  }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  let product: Product

  try {
    const { data } = await products.getBySlug(params.slug)
    if (!data) {
      notFound()
    }
    product = data
  } catch (error) {
    console.error('Failed to load product:', error)
    notFound()
  }

  return (
    <MainLayout>
      <main className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white py-4 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-emerald-600">홈</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/products" className="hover:text-emerald-600">제품</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900 font-medium">{product.name.ko}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-8 hover:bg-emerald-50" 
          asChild
        >
          <Link href="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            제품 목록으로 돌아가기
          </Link>
        </Button>

        {/* Product Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <ProductImageGallery product={product} />

          {/* Product Info */}
          <div className="space-y-8">
            {/* Basic Info */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                {product.quality?.gmp_certified && (
                  <Badge variant="outline" className="text-emerald-700 border-emerald-200">
                    <Shield className="mr-1 h-3 w-3" />
                    GMP 인증
                  </Badge>
                )}
                {product.quality?.haccp_certified && (
                  <Badge variant="outline" className="text-blue-700 border-blue-200">
                    <Award className="mr-1 h-3 w-3" />
                    HACCP 인증
                  </Badge>
                )}
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {product.name.ko}
              </h1>
              
              <p className="text-xl text-gray-600 mb-6">
                {product.short_description?.ko}
              </p>

              {/* Pricing */}
              <div className="mb-8">
                {product.pricing?.is_price_visible ? (
                  <div className="text-3xl font-bold text-emerald-600">
                    {product.pricing.price_text}
                  </div>
                ) : (
                  <div className="text-lg text-gray-500">
                    상담을 통해 가격을 확인하세요
                  </div>
                )}
              </div>

              {/* Key Features */}
              {product.features?.ko && product.features.ko.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">주요 특징</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {product.features.ko.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Product Stats */}
              {product.stats && (
                <div className="grid grid-cols-3 gap-4 py-6 border-t border-b">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {product.stats.view_count?.toLocaleString() || '0'}
                    </div>
                    <div className="text-sm text-gray-600">조회수</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {product.stats.inquiry_count?.toLocaleString() || '0'}
                    </div>
                    <div className="text-sm text-gray-600">문의수</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {product.stats.brochure_download_count?.toLocaleString() || '0'}
                    </div>
                    <div className="text-sm text-gray-600">자료 다운로드</div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <ProductActions product={product} />
          </div>
        </div>

        {/* Detailed Information Tabs */}
        <ProductDetailTabs product={product} />
      </div>

      {/* Related Products */}
      <RelatedProducts productId={product.id} />
      </main>
    </MainLayout>
  )
}