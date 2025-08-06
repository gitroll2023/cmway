'use client'

import { motion } from 'framer-motion'
import { HeroSection } from '@/components/blocks/hero-section'
import { CompanySection } from '@/components/blocks/company-section'
import { ProductsSection } from '@/components/blocks/products-section'
import { cn } from '@/lib/utils'
import type { Page } from '@/lib/types/cms'

interface PageBuilderProps {
  page: Page
  content: any
  locale?: 'ko' | 'en'
}

interface BlockData {
  id: string
  type: string
  data: any
  animations?: {
    on_scroll?: {
      enabled: boolean
      type: string
      duration: number
      delay: number
    }
  }
}

export function PageBuilder({ page, content, locale = 'ko' }: PageBuilderProps) {
  if (!content || !content.blocks) {
    return <DefaultPageContent page={page} locale={locale} />
  }

  const containerWidth = page.settings?.container_width || 'default'
  const backgroundColor = page.settings?.background_color
  const backgroundImage = page.settings?.background_image

  const containerClasses = cn(
    'min-h-screen',
    {
      'max-w-7xl mx-auto': containerWidth === 'default',
      'max-w-full': containerWidth === 'wide',
      'w-full': containerWidth === 'full'
    }
  )

  return (
    <div 
      className={containerClasses}
      style={{
        backgroundColor,
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Page Animation Wrapper */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ 
          duration: page.animations?.animation_duration || 0.5 
        }}
      >
        {/* Render Blocks */}
        {content.blocks.map((block: BlockData, index: number) => (
          <BlockRenderer 
            key={block.id || index}
            block={block}
            index={index}
            locale={locale}
            totalBlocks={content.blocks.length}
          />
        ))}
      </motion.div>
    </div>
  )
}

interface BlockRendererProps {
  block: BlockData
  index: number
  locale: string
  totalBlocks: number
}

function BlockRenderer({ block, index, locale, totalBlocks }: BlockRendererProps) {
  const { type, data, animations } = block

  // Animation configuration
  const animationProps = animations?.on_scroll?.enabled ? {
    initial: { opacity: 0, y: 50 },
    whileInView: { opacity: 1, y: 0 },
    transition: { 
      duration: animations.on_scroll.duration || 0.6,
      delay: animations.on_scroll.delay || index * 0.1
    },
    viewport: { once: true, margin: "-100px" }
  } : {}

  const renderBlock = () => {
    switch (type) {
      case 'hero':
        return (
          <HeroSection 
            slides={data.slides}
            autoPlay={data.autoPlay}
            interval={data.interval}
            locale={locale as 'ko' | 'en'}
          />
        )

      case 'company-intro':
        return (
          <CompanySection
            title={data.title?.[locale]}
            subtitle={data.subtitle?.[locale]}
            description={data.description?.[locale]}
            image={data.image}
            features={data.features?.map((f: any) => ({
              ...f,
              title: f.title?.[locale] || f.title,
              description: f.description?.[locale] || f.description
            }))}
            stats={data.stats}
            cta={data.cta}
            locale={locale as 'ko' | 'en'}
          />
        )

      case 'products':
        return (
          <ProductsSection
            title={data.title?.[locale]}
            subtitle={data.subtitle?.[locale]}
            description={data.description?.[locale]}
            products={data.products}
            categories={data.categories}
            featuredOnly={data.featuredOnly}
            maxProducts={data.maxProducts}
            showCategories={data.showCategories}
            cta={data.cta}
            locale={locale as 'ko' | 'en'}
          />
        )

      case 'text':
        return (
          <section className={cn(
            'py-20',
            data.backgroundColor && `bg-${data.backgroundColor}`,
            data.textAlign === 'center' && 'text-center'
          )}>
            <div className="container mx-auto px-4">
              {data.title && (
                <h2 className={cn(
                  'text-3xl md:text-4xl font-bold mb-6',
                  data.titleColor ? `text-${data.titleColor}` : 'text-gray-900'
                )}>
                  {data.title[locale] || data.title}
                </h2>
              )}
              {data.content && (
                <div 
                  className={cn(
                    'prose prose-lg max-w-none',
                    data.textColor ? `text-${data.textColor}` : 'text-gray-600'
                  )}
                  dangerouslySetInnerHTML={{ 
                    __html: data.content[locale] || data.content 
                  }} 
                />
              )}
            </div>
          </section>
        )

      case 'image':
        return (
          <section className="py-20">
            <div className="container mx-auto px-4">
              <div className={cn(
                'max-w-4xl mx-auto',
                data.alignment === 'center' && 'text-center',
                data.alignment === 'right' && 'text-right'
              )}>
                {data.image && (
                  <img
                    src={data.image}
                    alt={data.alt?.[locale] || data.alt || ''}
                    className={cn(
                      'w-full h-auto rounded-lg shadow-lg',
                      data.rounded && 'rounded-2xl',
                      data.shadow && 'shadow-2xl'
                    )}
                  />
                )}
                {data.caption && (
                  <p className="mt-4 text-sm text-gray-500">
                    {data.caption[locale] || data.caption}
                  </p>
                )}
              </div>
            </div>
          </section>
        )

      case 'cta':
        return (
          <section className={cn(
            'py-20',
            data.backgroundColor || 'bg-gray-900'
          )}>
            <div className="container mx-auto px-4 text-center">
              {data.title && (
                <h2 className={cn(
                  'text-3xl md:text-4xl font-bold mb-6',
                  data.textColor || 'text-white'
                )}>
                  {data.title[locale] || data.title}
                </h2>
              )}
              {data.description && (
                <p className={cn(
                  'text-xl mb-8 max-w-2xl mx-auto',
                  data.textColor || 'text-gray-300'
                )}>
                  {data.description[locale] || data.description}
                </p>
              )}
              {data.buttons?.map((button: any, idx: number) => (
                <a
                  key={idx}
                  href={button.link}
                  className={cn(
                    'inline-block px-8 py-4 rounded-lg font-semibold text-lg mr-4 mb-4 transition-colors',
                    button.variant === 'primary' 
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900'
                  )}
                >
                  {button.text[locale] || button.text}
                </a>
              ))}
            </div>
          </section>
        )

      case 'spacer':
        return (
          <div 
            className="w-full" 
            style={{ height: data.height || '40px' }} 
          />
        )

      default:
        return (
          <div className="py-8">
            <div className="container mx-auto px-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800">
                  Unknown block type: <code>{type}</code>
                </p>
              </div>
            </div>
          </div>
        )
    }
  }

  return animations?.on_scroll?.enabled ? (
    <motion.div {...animationProps}>
      {renderBlock()}
    </motion.div>
  ) : (
    renderBlock()
  )
}

// Default content when no blocks are available
function DefaultPageContent({ page, locale }: { page: Page; locale: string }) {
  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {page.meta?.title?.[locale] || page.slug}
          </h1>
          {page.meta?.description?.[locale] && (
            <p className="text-xl text-gray-600 mb-8">
              {page.meta.description[locale]}
            </p>
          )}
          <div className="bg-gray-50 rounded-lg p-8">
            <p className="text-gray-500">
              이 페이지는 아직 콘텐츠가 설정되지 않았습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}