'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { 
  ArrowLeft, 
  Share2, 
  Heart, 
  ShoppingCart, 
  Phone, 
  MessageCircle, 
  Download,
  Shield,
  Award,
  Star,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  Calendar,
  FileText,
  Play,
  Zap,
  Users,
  Building
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { products } from '@/lib/cms'
import type { Product } from '@/lib/types/cms'

// Image Gallery Component
export function ProductImageGallery({ product }: { product: Product }) {
  const [selectedImage, setSelectedImage] = useState(0)
  const images = [
    product.media?.featured_image,
    ...(product.media?.gallery || [])
  ].filter(Boolean) as string[]

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl flex items-center justify-center">
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center">
          <Star className="h-12 w-12 text-emerald-600" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-lg group">
        <Image
          src={images[selectedImage]}
          alt={product.name.ko || ''}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          priority
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 space-y-2">
          {product.is_new && (
            <Badge className="bg-blue-500 text-white">NEW</Badge>
          )}
          {product.featured && (
            <Badge className="bg-yellow-500 text-white">인기</Badge>
          )}
          {product.is_best && (
            <Badge className="bg-red-500 text-white">BEST</Badge>
          )}
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setSelectedImage((prev) => 
                prev === 0 ? images.length - 1 : prev - 1
              )}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => setSelectedImage((prev) => 
                prev === images.length - 1 ? 0 : prev + 1
              )}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={cn(
                "flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200",
                selectedImage === index 
                  ? "border-emerald-500 shadow-lg" 
                  : "border-transparent hover:border-gray-300"
              )}
            >
              <Image
                src={image}
                alt={`${product.name.ko || ''} ${index + 1}`}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Video Thumbnails if available */}
      {product.media?.videos && product.media.videos.length > 0 && (
        <div className="pt-4 border-t">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">제품 영상</h4>
          <div className="flex gap-3 overflow-x-auto">
            {product.media.videos.map((video, index) => (
              <button
                key={index}
                className="flex-shrink-0 w-20 h-20 bg-black rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors"
              >
                <Play className="h-6 w-6 text-white" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Product Actions Component
export function ProductActions({ product }: { product: Product }) {
  const [isLiked, setIsLiked] = useState(false)

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name.ko,
          text: product.short_description?.ko,
          url: window.location.href,
        })
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <div className="flex flex-col space-y-4">
      {/* Primary Actions */}
      <div className="flex gap-3">
        {product.inquiry_settings?.enable_inquiry && (
          <Button 
            size="lg" 
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
            asChild
          >
            <Link href={`/consultation?product=${product.slug}`}>
              <MessageCircle className="mr-2 h-5 w-5" />
              {product.inquiry_settings.inquiry_button_text || '상담 신청'}
            </Link>
          </Button>
        )}
        
        {product.inquiry_settings?.show_phone_number && (
          <Button size="lg" variant="outline" asChild>
            <a href="tel:1588-0000">
              <Phone className="mr-2 h-5 w-5" />
              전화 상담
            </a>
          </Button>
        )}
      </div>

      {/* Secondary Actions */}
      <div className="flex gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsLiked(!isLiked)}
          className={cn(
            "flex-1",
            isLiked ? "text-red-600 bg-red-50 hover:bg-red-100" : ""
          )}
        >
          <Heart className={cn("mr-2 h-4 w-4", isLiked && "fill-current")} />
          {isLiked ? '관심상품 해제' : '관심상품 등록'}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleShare}
          className="flex-1"
        >
          <Share2 className="mr-2 h-4 w-4" />
          공유하기
        </Button>
      </div>

      {/* Document Downloads */}
      {product.media?.documents && product.media.documents.length > 0 && (
        <div className="pt-4 border-t">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">제품 자료</h4>
          <div className="space-y-2">
            {product.media.documents.map((doc, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="w-full justify-start"
                asChild
              >
                <a href={doc} download>
                  <Download className="mr-2 h-4 w-4" />
                  제품 카탈로그 다운로드
                </a>
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Related Products Component
export function RelatedProducts({ productId }: { productId: string }) {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadRelatedProducts = async () => {
      try {
        // Try to get cross-sell products first
        const { data: crossSells } = await products.getRelated(productId, 'cross_sells')
        if (crossSells && crossSells.length > 0) {
          setRelatedProducts(crossSells.slice(0, 4))
        } else {
          // Fallback to featured products if no related products
          const { data: featured } = await products.getFeatured(4)
          if (featured) {
            setRelatedProducts(featured.filter(p => p.id !== productId).slice(0, 4))
          }
        }
      } catch (error) {
        console.error('Failed to load related products:', error)
      } finally {
        setLoading(false)
      }
    }

    loadRelatedProducts()
  }, [productId])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white rounded-2xl p-4 animate-pulse">
            <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    )
  }

  if (relatedProducts.length === 0) return null

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            관련 제품
          </h2>
          <p className="text-gray-600">
            함께 보면 좋은 다른 제품들을 확인해보세요
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              <div className="relative aspect-square bg-gradient-to-br from-green-50 to-blue-50">
                {product.media?.featured_image ? (
                  <Image
                    src={product.media.featured_image}
                    alt={product.name.ko || ''}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <Star className="h-12 w-12 text-emerald-600" />
                  </div>
                )}
                
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

              <div className="p-6">
                <h3 className="font-bold text-lg mb-2 group-hover:text-emerald-600 transition-colors">
                  <Link href={`/products/${product.slug}`}>
                    {product.name.ko}
                  </Link>
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {product.short_description?.ko}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Product Detail Tabs Component
export function ProductDetailTabs({ product }: { product: Product }) {
  const [activeTab, setActiveTab] = useState('overview')
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-2xl p-8 shadow-lg"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto mb-8">
          <TabsTrigger value="overview">제품 개요</TabsTrigger>
          <TabsTrigger value="benefits">효능·효과</TabsTrigger>
          <TabsTrigger value="usage">섭취방법</TabsTrigger>
          <TabsTrigger value="quality">품질관리</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">제품 상세 정보</h3>
            <div className="prose max-w-none text-gray-700">
              {product.description?.ko ? (
                <p className="text-lg leading-relaxed">{product.description.ko}</p>
              ) : (
                <p>상세 제품 정보가 준비 중입니다.</p>
              )}
            </div>
          </div>

          {/* Specifications Table if available */}
          {product.specifications && (
            <div>
              <h4 className="text-xl font-semibold text-gray-900 mb-4">제품 규격</h4>
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 rounded-lg">
                  <tbody>
                    {(() => {
                      // 영어 키를 한글로 변환하는 매핑
                      const labelMap: Record<string, string> = {
                        'form': '제형',
                        'quantity': '용량',
                        'per_capsule': '캡슐당 함량',
                        'per_pack': '포당 함량',
                        'per_tablet': '정당 함량',
                        'per_dose': '1회 복용량',
                        'dosage': '복용법',
                        'volume': '용량',
                        'origin': '원산지',
                        'extraction': '추출 방법',
                        'concentration': '농도',
                        'per_serving': '1회 제공량',
                        'servings': '총 제공 횟수',
                        'weight': '중량',
                        'expiration': '유통기한',
                        'storage': '보관 방법',
                        'manufacturer': '제조사',
                        'importer': '수입사',
                        'size': '크기',
                        'color': '색상',
                        'ingredients': '성분',
                        'main_ingredient': '주성분',
                        'sub_ingredients': '부성분',
                        'purity': '순도',
                        'certification': '인증',
                        'package': '포장',
                        'shelf_life': '보존기간',
                        'caution': '주의사항'
                      }
                      
                      // 표시할 순서 정의
                      const displayOrder = [
                        'form', 'quantity', 'volume', 'per_capsule', 'per_pack', 'per_tablet',
                        'per_dose', 'dosage', 'concentration', 'purity', 'origin', 
                        'extraction', 'manufacturer', 'expiration', 'storage'
                      ]
                      
                      // 순서대로 정렬된 entries 생성
                      const sortedEntries = displayOrder
                        .filter(key => key in product.specifications)
                        .map(key => [key, product.specifications[key]])
                        .concat(
                          Object.entries(product.specifications)
                            .filter(([key]) => !displayOrder.includes(key))
                        )
                      
                      return sortedEntries.map(([key, value]) => {
                        const label = labelMap[key] || key
                        return (
                          <tr key={key} className="border-b last:border-b-0">
                            <td className="px-4 py-3 bg-gray-50 font-medium text-gray-700">{label}</td>
                            <td className="px-4 py-3 text-gray-900">{String(value)}</td>
                          </tr>
                        )
                      })
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="benefits" className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">효능 및 효과</h3>
            {product.benefits?.ko && product.benefits.ko.length > 0 ? (
              <div className="grid gap-4">
                {product.benefits.ko.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-emerald-50 rounded-lg">
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-gray-800">{benefit}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">효능·효과 정보가 준비 중입니다.</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">섭취 방법</h3>
            {product.usage?.ko ? (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
                <p className="text-gray-800 text-lg">{product.usage.ko}</p>
              </div>
            ) : (
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-600">섭취 방법은 제품 상담시 안내해드리겠습니다.</p>
              </div>
            )}
          </div>

          {/* Nutrition Facts if available */}
          {product.nutrition_facts && (
            <div>
              <h4 className="text-xl font-semibold text-gray-900 mb-4">영양 성분표</h4>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                {/* Add nutrition facts table here */}
                <p className="text-gray-600">영양 성분 정보가 준비 중입니다.</p>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="quality" className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">품질 관리 및 인증</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Quality Certifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-emerald-600" />
                    품질 인증
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {product.quality?.gmp_certified && (
                    <div className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-600" />
                      <span>GMP 인증 (우수의약품제조품질관리기준)</span>
                    </div>
                  )}
                  {product.quality?.haccp_certified && (
                    <div className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-600" />
                      <span>HACCP 인증 (위해요소중점관리기준)</span>
                    </div>
                  )}
                  {product.quality?.organic_certified && (
                    <div className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-600" />
                      <span>유기농 인증</span>
                    </div>
                  )}
                  {product.quality?.other_certifications?.map((cert, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-600" />
                      <span>{cert}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Company Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-emerald-600" />
                    제조사 정보
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-600">제조회사</div>
                    <div className="font-medium">씨엠웨이(주)</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">제조국</div>
                    <div className="font-medium">대한민국</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">제품 문의</div>
                    <div className="font-medium">1588-0000</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Additional Quality Info */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">품질 보증</h4>
              <p className="text-gray-700">
                당사는 ISO 22000, HACCP, GMP 인증을 받은 시설에서 
                엄격한 품질 관리 기준에 따라 제품을 생산하고 있습니다. 
                모든 제품은 출하 전 품질 검사를 통과한 제품만 고객님께 전달됩니다.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}