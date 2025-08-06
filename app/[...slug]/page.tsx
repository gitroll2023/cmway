import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { MainLayout } from '@/components/layout/main-layout'
import { PageBuilder } from '@/components/cms/page-builder'
import { pagesApi } from '@/lib/api/cms'
import type { Page } from '@/lib/types/cms'

interface DynamicPageProps {
  params: {
    slug: string[]
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: DynamicPageProps): Promise<Metadata> {
  const slug = params.slug.join('/')
  const response = await pagesApi.getBySlug(slug)
  
  if (!response.success || !response.data) {
    return {
      title: '페이지를 찾을 수 없습니다 | CMWay',
      description: '요청하신 페이지를 찾을 수 없습니다.'
    }
  }

  const page = response.data
  const locale = 'ko' // TODO: Get from context or params
  
  return {
    title: page.meta?.title?.[locale] || page.slug,
    description: page.meta?.description?.[locale],
    keywords: page.meta?.keywords || [],
    openGraph: {
      title: page.meta?.og_title || page.meta?.title?.[locale],
      description: page.meta?.og_description || page.meta?.description?.[locale],
      images: page.meta?.og_image ? [{ url: page.meta.og_image }] : undefined,
    }
  }
}

// Generate static paths for known pages
export async function generateStaticParams() {
  try {
    const response = await pagesApi.getAll()
    
    if (!response.success) {
      return []
    }

    return response.data
      .filter(page => page.status === 'published')
      .map((page) => ({
        slug: page.slug.split('/').filter(Boolean)
      }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

export default async function DynamicPage({ params }: DynamicPageProps) {
  const slug = params.slug.join('/')
  
  // Fetch page data
  const response = await pagesApi.getBySlug(slug)
  
  if (!response.success || !response.data) {
    notFound()
  }

  const page = response.data

  // Check access rules
  if (page.access_rules?.require_login) {
    // TODO: Check authentication status
    // For now, redirect to login or show access denied
  }

  // Handle scheduled pages
  if (page.status === 'scheduled' && page.scheduled_at) {
    const scheduledDate = new Date(page.scheduled_at)
    if (scheduledDate > new Date()) {
      notFound() // Page not yet published
    }
  }

  // Get page content (prefer published over draft)
  const content = page.published_content || page.draft_content

  return (
    <MainLayout 
      showHeader={page.settings?.show_header !== false}
      showFooter={page.settings?.show_footer !== false}
    >
      <PageBuilder 
        page={page}
        content={content}
        locale="ko" // TODO: Get from context
      />
    </MainLayout>
  )
}