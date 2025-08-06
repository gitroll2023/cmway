import { Suspense } from 'react'
import { Metadata } from 'next'
import { MainLayout } from '@/components/layout/main-layout'
import { ProductsGrid } from '@/components/cms/products-grid'
import { ProductsFilter } from '@/components/cms/products-filter'

export const metadata: Metadata = {
  title: '제품소개 | CMWay',
  description: '프리미엄 건강식품 전문기업 CMWay의 고품질 건강기능식품을 만나보세요.',
}

interface ProductsPageProps {
  searchParams: {
    category?: string
    search?: string
    sort?: string
    page?: string
  }
}

function ProductsPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="animate-pulse">
        {/* Header Skeleton */}
        <div className="text-center mb-12">
          <div className="h-8 w-64 bg-gray-200 rounded mx-auto mb-4"></div>
          <div className="h-6 w-96 bg-gray-200 rounded mx-auto"></div>
        </div>

        {/* Filter Skeleton */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 w-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="h-64 bg-gray-200"></div>
              <div className="p-6 space-y-4">
                <div className="h-6 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ProductsPage({ searchParams }: ProductsPageProps) {
  return (
    <MainLayout>
      {/* Page Header */}
      <section className="bg-gradient-to-br from-green-50 to-blue-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            제품소개
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            과학적 연구를 바탕으로 개발된 프리미엄 건강기능식품으로<br />
            여러분의 건강한 삶을 지원합니다.
          </p>
        </div>
      </section>

      {/* Products Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Suspense fallback={<ProductsPageSkeleton />}>
            {/* Filter Component */}
            <div className="mb-12">
              <ProductsFilter 
                currentCategory={searchParams.category}
                currentSearch={searchParams.search}
                currentSort={searchParams.sort}
              />
            </div>

            {/* Products Grid */}
            <ProductsGrid 
              category={searchParams.category}
              search={searchParams.search}
              sort={searchParams.sort}
              page={parseInt(searchParams.page || '1')}
              itemsPerPage={12}
            />
          </Suspense>
        </div>
      </section>
    </MainLayout>
  )
}