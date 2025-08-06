'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

// 클로로필a 전문 기업에 맞는 슬라이드 데이터
const slides = [
  {
    id: 1,
    image: '/mock/slide1.jpg',
    title: '생명의 근원 클로로필a',
    subtitle: 'RETURN TO NATURE',
    description: '99.9% 고순도 클로로필a로 건강한 삶을 만들어갑니다',
    gradient: 'from-green-900/80 to-emerald-900/60',
  },
  {
    id: 2,
    image: '/mock/slide2.jpg',
    title: '과학적으로 입증된 효능',
    subtitle: '광주과학기술원 공동연구',
    description: '항암효능 관련 동물실험으로 검증된 클로로필a의 효과',
    gradient: 'from-emerald-900/80 to-green-900/60',
  },
  {
    id: 3,
    image: '/mock/slide3.jpg',
    title: '세포부활과 면역력 증진',
    subtitle: '건강기능식품 인증',
    description: '초혈작용, 해독작용, 세포부활작용으로 건강을 지킵니다',
    gradient: 'from-green-900/80 to-blue-900/60',
  },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000); // 슬라이드 전환 시간을 8초로 늘림

    return () => clearInterval(interval);
  }, [isAutoPlaying, currentSlide]);

  return (
    <section className="relative w-full h-screen min-h-[700px] overflow-hidden">
      {/* Slides */}
      <AnimatePresence mode="sync">
        {slides.map((slide, index) => (
          index === currentSlide && (
            <motion.div
              key={slide.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.5, ease: "easeInOut" }} // 더 부드러운 전환
              className="absolute inset-0"
            >
              {/* Background Image with Parallax Effect */}
              <motion.div 
                className="absolute inset-0"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 10, ease: "easeOut" }} // 더 느린 줌 효과
              >
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  quality={100}
                />
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient}`} />
              </motion.div>

              {/* Content */}
              <div className="relative h-full flex items-center justify-center">
                <div className="text-center text-white px-4 max-w-5xl mx-auto">
                  {/* Main Text */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 1.5, ease: "easeOut" }} // 더 부드러운 텍스트 애니메이션
                  >
                    <p className="text-lg md:text-xl mb-4 tracking-widest uppercase opacity-90">
                      {slide.subtitle}
                    </p>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                      {slide.title.split(' ').map((word, i) => (
                        <span key={i}>
                          {i === 0 ? word : (
                            <>
                              <br className="hidden md:block" />
                              {word}
                            </>
                          )}{' '}
                        </span>
                      ))}
                    </h1>
                    <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
                      {slide.description}
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )
        ))}
      </AnimatePresence>

      {/* Slide Indicators - PC: 우측 세로, Mobile: 하단 가로 */}
      <div className="absolute md:right-8 md:top-1/2 md:-translate-y-1/2 bottom-20 left-1/2 md:left-auto -translate-x-1/2 md:translate-x-0 flex md:flex-col items-center md:space-y-4 space-x-4 md:space-x-0 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentSlide(index);
              setIsAutoPlaying(false);
            }}
            className="relative group"
            aria-label={`Go to slide ${index + 1}`}
          >
            <div className={`transition-all duration-500 ${
              index === currentSlide
                ? 'md:w-1 md:h-16 w-12 h-1 bg-white'
                : 'md:w-1 md:h-8 w-6 h-1 bg-white/40 hover:bg-white/60'
            }`} />
            {index === currentSlide && (
              <motion.div
                className="absolute inset-0 bg-white"
                initial={{ scaleY: 0, scaleX: 0 }}
                animate={{ scaleY: 1, scaleX: 1 }}
                transition={{ duration: 8, ease: "linear" }} // 인디케이터도 8초로 맞춤
                style={{ transformOrigin: "left top" }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Scroll Down Indicator - 정중앙 하단 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center cursor-pointer"
          onClick={() => {
            window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
          }}
        >
          <span className="text-xs uppercase tracking-[0.2em] mb-3 opacity-80">Scroll Down</span>
          <div className="flex flex-col items-center">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown className="w-6 h-6" />
            </motion.div>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
              className="-mt-3"
            >
              <ChevronDown className="w-6 h-6 opacity-60" />
            </motion.div>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
              className="-mt-3"
            >
              <ChevronDown className="w-6 h-6 opacity-30" />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}