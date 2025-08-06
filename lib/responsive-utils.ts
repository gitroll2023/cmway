// Responsive Design Utilities
// 반응형 디자인을 위한 유틸리티 함수 및 상수

// Breakpoint constants
export const BREAKPOINTS = {
  xs: 375,    // Mobile Small
  sm: 640,    // Mobile Large
  md: 768,    // Tablet
  lg: 1024,   // Desktop
  xl: 1280,   // Desktop Large
  '2xl': 1536 // Desktop Extra Large
} as const

// Device types
export type DeviceType = 'mobile' | 'tablet' | 'desktop'

// Check if window is available (client-side)
export const isClient = typeof window !== 'undefined'

// Get current viewport width
export const getViewportWidth = (): number => {
  if (!isClient) return 0
  return window.innerWidth || document.documentElement.clientWidth
}

// Get current viewport height
export const getViewportHeight = (): number => {
  if (!isClient) return 0
  return window.innerHeight || document.documentElement.clientHeight
}

// Get device type based on viewport width
export const getDeviceType = (width?: number): DeviceType => {
  const viewportWidth = width || getViewportWidth()
  
  if (viewportWidth < BREAKPOINTS.md) return 'mobile'
  if (viewportWidth < BREAKPOINTS.lg) return 'tablet'
  return 'desktop'
}

// Check if viewport matches breakpoint
export const matchesBreakpoint = (breakpoint: keyof typeof BREAKPOINTS): boolean => {
  if (!isClient) return false
  return getViewportWidth() >= BREAKPOINTS[breakpoint]
}

// Responsive text size classes
export const getResponsiveTextSize = (
  mobile: string,
  tablet?: string,
  desktop?: string
): string => {
  const tabletSize = tablet || mobile
  const desktopSize = desktop || tablet || mobile
  
  return `${mobile} md:${tabletSize} lg:${desktopSize}`
}

// Responsive padding classes
export const getResponsivePadding = (
  mobile: string,
  tablet?: string,
  desktop?: string
): string => {
  const tabletPadding = tablet || mobile
  const desktopPadding = desktop || tablet || mobile
  
  return `${mobile} md:${tabletPadding} lg:${desktopPadding}`
}

// Responsive grid columns
export const getResponsiveGrid = (
  mobile: number = 1,
  tablet?: number,
  desktop?: number,
  xl?: number
): string => {
  const cols = {
    mobile: `grid-cols-${mobile}`,
    tablet: tablet ? `md:grid-cols-${tablet}` : '',
    desktop: desktop ? `lg:grid-cols-${desktop}` : '',
    xl: xl ? `xl:grid-cols-${xl}` : ''
  }
  
  return Object.values(cols).filter(Boolean).join(' ')
}

// Touch-friendly size classes
export const getTouchFriendlySize = (baseSize: string): string => {
  // Ensure minimum 44px touch target on mobile
  return `${baseSize} min-h-[44px] min-w-[44px]`
}

// Responsive image optimization
export const getResponsiveImageSizes = (
  mobile: number,
  tablet?: number,
  desktop?: number
): string => {
  const sizes = []
  
  if (desktop) {
    sizes.push(`(min-width: ${BREAKPOINTS.lg}px) ${desktop}vw`)
  }
  if (tablet) {
    sizes.push(`(min-width: ${BREAKPOINTS.md}px) ${tablet}vw`)
  }
  sizes.push(`${mobile}vw`)
  
  return sizes.join(', ')
}

// Responsive spacing scale
export const responsiveSpacing = {
  xs: 'p-2 md:p-3 lg:p-4',
  sm: 'p-3 md:p-4 lg:p-5',
  md: 'p-4 md:p-6 lg:p-8',
  lg: 'p-6 md:p-8 lg:p-10',
  xl: 'p-8 md:p-10 lg:p-12',
}

// Responsive font sizes
export const responsiveFontSizes = {
  xs: 'text-xs md:text-sm',
  sm: 'text-sm md:text-base',
  base: 'text-base md:text-lg',
  lg: 'text-lg md:text-xl lg:text-2xl',
  xl: 'text-xl md:text-2xl lg:text-3xl',
  '2xl': 'text-2xl md:text-3xl lg:text-4xl',
  '3xl': 'text-3xl md:text-4xl lg:text-5xl',
  '4xl': 'text-4xl md:text-5xl lg:text-6xl',
}

// Responsive margins
export const responsiveMargins = {
  xs: 'mb-2 md:mb-3 lg:mb-4',
  sm: 'mb-3 md:mb-4 lg:mb-5',
  md: 'mb-4 md:mb-6 lg:mb-8',
  lg: 'mb-6 md:mb-8 lg:mb-10',
  xl: 'mb-8 md:mb-10 lg:mb-12',
}

// Mobile-first hide/show utilities
export const visibility = {
  mobileOnly: 'block md:hidden',
  tabletOnly: 'hidden md:block lg:hidden',
  desktopOnly: 'hidden lg:block',
  mobileTablet: 'block lg:hidden',
  tabletDesktop: 'hidden md:block',
}

// Container with responsive padding
export const getResponsiveContainer = (): string => {
  return 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'
}

// Responsive section padding
export const getResponsiveSection = (): string => {
  return 'py-12 md:py-16 lg:py-20 xl:py-24'
}

// Touch gesture classes
export const touchGestures = {
  swipeable: 'touch-pan-y',
  draggable: 'touch-none active:touch-none',
  scrollable: 'overflow-auto -webkit-overflow-scrolling-touch',
}

// Safe area padding for mobile devices (notch, etc.)
export const safeAreaPadding = {
  top: 'pt-safe',
  bottom: 'pb-safe',
  left: 'pl-safe',
  right: 'pr-safe',
  all: 'p-safe',
}

// Responsive aspect ratios
export const aspectRatios = {
  square: 'aspect-square',
  video: 'aspect-video',
  portrait: 'aspect-[3/4]',
  landscape: 'aspect-[4/3]',
  wide: 'aspect-[16/9]',
  ultrawide: 'aspect-[21/9]',
}

// Performance optimizations for mobile
export const mobileOptimizations = {
  // Reduce animations on mobile for better performance
  reducedMotion: 'motion-reduce:transition-none motion-reduce:animate-none',
  // Hardware acceleration
  accelerated: 'transform-gpu',
  // Optimize for touch scrolling
  smoothScroll: 'scroll-smooth',
  // Prevent layout shift
  stableLayout: 'will-change-auto',
}

// Export all utilities as a single object for convenience
export const responsive = {
  breakpoints: BREAKPOINTS,
  isClient,
  getViewportWidth,
  getViewportHeight,
  getDeviceType,
  matchesBreakpoint,
  text: getResponsiveTextSize,
  padding: getResponsivePadding,
  grid: getResponsiveGrid,
  touchSize: getTouchFriendlySize,
  imageSizes: getResponsiveImageSizes,
  spacing: responsiveSpacing,
  fontSize: responsiveFontSizes,
  margin: responsiveMargins,
  visibility,
  container: getResponsiveContainer,
  section: getResponsiveSection,
  touch: touchGestures,
  safeArea: safeAreaPadding,
  aspect: aspectRatios,
  performance: mobileOptimizations,
}

export default responsive