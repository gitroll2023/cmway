import { Suspense } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import HeroSlider from '@/components/sections/HeroSlider'
import WhoWeAre from '@/components/sections/WhoWeAre'
import ProductShowcase from '@/components/sections/ProductShowcase'
import QuickMenu from '@/components/sections/QuickMenu'
import ResourcesSection from '@/components/sections/ResourcesSection'

// Loading components
function HeroSectionSkeleton() {
  return (
    <div className="h-screen min-h-[600px] bg-gradient-to-br from-green-50 to-blue-50 animate-pulse">
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-8 w-64 bg-gray-200 rounded mx-auto"></div>
          <div className="h-16 w-96 bg-gray-200 rounded mx-auto"></div>
          <div className="h-6 w-80 bg-gray-200 rounded mx-auto"></div>
        </div>
      </div>
    </div>
  )
}

function SectionSkeleton() {
  return (
    <div className="py-20 animate-pulse">
      <div className="container mx-auto px-4">
        <div className="h-8 w-64 bg-gray-200 rounded mx-auto mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default async function Home() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <Suspense fallback={<HeroSectionSkeleton />}>
        <HeroSlider />
      </Suspense>

      {/* WHO WE ARE Section */}
      <Suspense fallback={<SectionSkeleton />}>
        <WhoWeAre />
      </Suspense>

      {/* Products Section */}
      <Suspense fallback={<SectionSkeleton />}>
        <ProductShowcase />
      </Suspense>

      {/* Resources Section */}
      <Suspense fallback={<SectionSkeleton />}>
        <ResourcesSection />
      </Suspense>

      {/* Quick Menu Section */}
      <Suspense fallback={<SectionSkeleton />}>
        <QuickMenu />
      </Suspense>
    </MainLayout>
  );
}
