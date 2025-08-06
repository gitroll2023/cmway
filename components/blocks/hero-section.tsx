'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface HeroSlide {
  id: string
  title: {
    ko: string
    en: string
  }
  subtitle: {
    ko: string
    en: string
  }
  description: {
    ko: string
    en: string
  }
  background_image?: string
  background_video?: string
  button_primary?: {
    text: string
    link: string
    variant: 'default' | 'secondary' | 'outline'
  }
  button_secondary?: {
    text: string
    link: string
    variant: 'default' | 'secondary' | 'outline'
  }
  text_color: 'light' | 'dark'
  overlay_opacity: number
}

interface HeroSectionProps {
  slides?: HeroSlide[]
  autoPlay?: boolean
  interval?: number
  locale?: 'ko' | 'en'
}

export function HeroSection({ 
  slides = [], 
  autoPlay = true, 
  interval = 5000,
  locale = 'ko'
}: HeroSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Default slide if no slides provided
  const defaultSlides: HeroSlide[] = [
    {
      id: 'default-1',
      title: {
        ko: '건강한 삶의 동반자',
        en: 'Your Health Partner'
      },
      subtitle: {
        ko: '프리미엄 건강식품 전문기업',
        en: 'Premium Health Food Company'
      },
      description: {
        ko: '고품질 건강기능식품으로 여러분의 건강한 삶을 지원합니다.',
        en: 'Supporting your healthy life with high-quality functional foods.'
      },
      button_primary: {
        text: '무료 상담신청',
        link: '/consultation',
        variant: 'default'
      },
      button_secondary: {
        text: '제품 둘러보기',
        link: '/products',
        variant: 'outline'
      },
      text_color: 'light',
      overlay_opacity: 0.4
    }
  ]

  const displaySlides = slides.length > 0 ? slides : defaultSlides

  useEffect(() => {
    if (!autoPlay || displaySlides.length <= 1) return

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % displaySlides.length)
    }, interval)

    return () => clearInterval(timer)
  }, [autoPlay, interval, displaySlides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % displaySlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + displaySlides.length) % displaySlides.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const current = displaySlides[currentSlide]

  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        {current.background_video ? (
          <video
            key={current.id}
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
          >
            <source src={current.background_video} type="video/mp4" />
          </video>
        ) : current.background_image ? (
          <Image
            src={current.background_image}
            alt={current.title[locale]}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-green-50 to-blue-50" />
        )}
        
        {/* Overlay */}
        <div 
          className="absolute inset-0 bg-black"
          style={{ opacity: current.overlay_opacity }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className={cn(
                'space-y-6',
                current.text_color === 'light' ? 'text-white' : 'text-gray-900'
              )}
            >
              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className={cn(
                  'text-lg md:text-xl font-medium',
                  current.text_color === 'light' 
                    ? 'text-gray-200' 
                    : 'text-gray-600'
                )}
              >
                {current.subtitle[locale]}
              </motion.p>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight"
              >
                {current.title[locale]}
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className={cn(
                  'text-lg md:text-xl max-w-2xl mx-auto leading-relaxed',
                  current.text_color === 'light' 
                    ? 'text-gray-200' 
                    : 'text-gray-600'
                )}
              >
                {current.description[locale]}
              </motion.p>

              {/* Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 justify-center pt-6"
              >
                {current.button_primary && (
                  <Button 
                    asChild 
                    size="lg" 
                    variant={current.button_primary.variant}
                    className="text-lg px-8 py-6"
                  >
                    <Link href={current.button_primary.link}>
                      {current.button_primary.text}
                    </Link>
                  </Button>
                )}
                
                {current.button_secondary && (
                  <Button 
                    asChild 
                    size="lg" 
                    variant={current.button_secondary.variant}
                    className="text-lg px-8 py-6"
                  >
                    <Link href={current.button_secondary.link}>
                      {current.button_secondary.text}
                    </Link>
                  </Button>
                )}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      {displaySlides.length > 1 && (
        <>
          {/* Arrow Buttons */}
          <button
            onClick={prevSlide}
            className={cn(
              'absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full',
              'bg-black/20 backdrop-blur-sm hover:bg-black/40 transition-colors',
              current.text_color === 'light' ? 'text-white' : 'text-gray-900'
            )}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <button
            onClick={nextSlide}
            className={cn(
              'absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full',
              'bg-black/20 backdrop-blur-sm hover:bg-black/40 transition-colors',
              current.text_color === 'light' ? 'text-white' : 'text-gray-900'
            )}
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
            {displaySlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  'w-3 h-3 rounded-full transition-all duration-300',
                  index === currentSlide
                    ? 'bg-white scale-110'
                    : 'bg-white/50 hover:bg-white/70'
                )}
              />
            ))}
          </div>
        </>
      )}

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <div className={cn(
          'flex flex-col items-center space-y-2',
          current.text_color === 'light' ? 'text-white/70' : 'text-gray-600'
        )}>
          <span className="text-sm">스크롤</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-8 rounded-full bg-current opacity-50"
          />
        </div>
      </motion.div>
    </section>
  )
}