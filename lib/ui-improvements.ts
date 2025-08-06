// UI/UX Improvements and Consistent Patterns
// 전체 사이트의 일관된 UX/UI를 위한 개선 사항

import { components } from './design-system'

// Consistent Animation Delays
export const animationDelays = {
  none: 0,
  fast: 0.1,
  normal: 0.2,
  slow: 0.3,
  slower: 0.5,
  stagger: (index: number) => index * 0.1,
}

// Consistent Page Transitions
export const pageTransitions = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.5 },
  },
  slideInFromLeft: {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 },
    transition: { duration: 0.5 },
  },
  slideInFromRight: {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
    transition: { duration: 0.5 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: 0.4 },
  },
}

// Consistent Hover Effects
export const hoverEffects = {
  lift: 'hover:-translate-y-1 transition-transform duration-300',
  grow: 'hover:scale-105 transition-transform duration-300',
  glow: 'hover:shadow-xl transition-shadow duration-300',
  brighten: 'hover:brightness-110 transition-all duration-300',
  gradient: 'hover:bg-gradient-to-r hover:from-emerald-600 hover:to-blue-600 transition-all duration-300',
}

// Consistent Loading States
export const loadingStates = {
  spinner: `
    <div class="flex items-center justify-center p-8">
      <div class="spinner"></div>
    </div>
  `,
  skeleton: `
    <div class="animate-pulse">
      <div class="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div class="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
      <div class="h-4 bg-gray-200 rounded w-2/3"></div>
    </div>
  `,
  shimmer: `
    <div class="relative overflow-hidden bg-gray-200 rounded">
      <div class="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white to-transparent"></div>
    </div>
  `,
}

// Consistent Error States
export const errorStates = {
  inline: 'text-red-600 text-sm mt-1',
  banner: 'bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg',
  toast: 'fixed bottom-4 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg',
}

// Consistent Success States
export const successStates = {
  inline: 'text-green-600 text-sm mt-1',
  banner: 'bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg',
  toast: 'fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg',
}

// Improved Accessibility
export const a11y = {
  // Screen reader only text
  srOnly: 'sr-only',
  // Focus trap for modals
  focusTrap: 'focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2',
  // Skip links
  skipLink: 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-white px-4 py-2 rounded shadow-lg',
  // ARIA labels
  ariaLabel: (label: string) => ({ 'aria-label': label }),
  // Role attributes
  role: (role: string) => ({ role }),
}

// Consistent Form Validation
export const formValidation = {
  required: 'border-red-500 focus:ring-red-500',
  valid: 'border-green-500 focus:ring-green-500',
  disabled: 'bg-gray-100 cursor-not-allowed opacity-50',
  readonly: 'bg-gray-50 cursor-default',
}

// Improved Mobile Navigation
export const mobileNav = {
  menuButton: 'lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors',
  overlay: 'fixed inset-0 bg-black/50 z-40 lg:hidden',
  slidePanel: 'fixed top-0 right-0 w-[85%] max-w-sm h-full bg-white z-50 transform transition-transform duration-300',
  menuItem: 'block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-emerald-600 transition-colors',
}

// Consistent Card Layouts
export const cardLayouts = {
  vertical: 'flex flex-col',
  horizontal: 'flex flex-row gap-4',
  grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
  masonry: 'columns-1 md:columns-2 lg:columns-3 gap-6',
}

// Improved Table Styles
export const tableStyles = {
  wrapper: 'overflow-x-auto -mx-4 sm:mx-0',
  table: 'min-w-full divide-y divide-gray-200',
  thead: 'bg-gray-50',
  th: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
  tbody: 'bg-white divide-y divide-gray-200',
  td: 'px-6 py-4 whitespace-nowrap text-sm text-gray-900',
  tdMobile: 'px-4 py-3 text-sm', // Smaller padding on mobile
}

// Consistent Modal Styles
export const modalStyles = {
  overlay: 'fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4',
  content: 'bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto',
  header: 'sticky top-0 bg-white px-6 py-4 border-b border-gray-200',
  body: 'px-6 py-4',
  footer: 'sticky bottom-0 bg-white px-6 py-4 border-t border-gray-200',
  closeButton: 'absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors',
}

// Improved Badge Styles
export const badgeVariants = {
  primary: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  secondary: 'bg-blue-100 text-blue-700 border border-blue-200',
  success: 'bg-green-100 text-green-700 border border-green-200',
  warning: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
  error: 'bg-red-100 text-red-700 border border-red-200',
  info: 'bg-blue-100 text-blue-700 border border-blue-200',
  neutral: 'bg-gray-100 text-gray-700 border border-gray-200',
}

// Consistent Icon Sizes
export const iconSizes = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
  xl: 'h-8 w-8',
  '2xl': 'h-10 w-10',
}

// Improved Tooltip Styles
export const tooltipStyles = {
  trigger: 'relative inline-flex cursor-help',
  content: 'absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg',
  arrow: 'absolute w-2 h-2 bg-gray-900 transform rotate-45',
  positions: {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  },
}

// Performance Optimizations
export const performance = {
  // Lazy load images
  lazyImage: 'loading-lazy',
  // Defer non-critical scripts
  deferScript: 'defer',
  // Preload critical resources
  preloadFont: 'rel-preload as-font crossorigin',
  // Use will-change for animations
  willChange: 'will-change-transform',
  // Hardware acceleration
  gpuAcceleration: 'transform-gpu',
}

// SEO Improvements
export const seo = {
  // Structured data for rich snippets
  structuredData: (data: any) => ({
    dangerouslySetInnerHTML: {
      __html: JSON.stringify(data),
    },
  }),
  // Meta tags
  metaTags: {
    viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
    description: '씨엠웨이 - 클로로필a 전문 건강기능식품 기업',
    keywords: '클로로필a, 건강기능식품, 항암, 면역력, 씨엠웨이, CMWay',
  },
  // Open Graph tags
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: '씨엠웨이',
  },
}

// Export all improvements
export const uiImprovements = {
  animations: animationDelays,
  transitions: pageTransitions,
  hover: hoverEffects,
  loading: loadingStates,
  error: errorStates,
  success: successStates,
  accessibility: a11y,
  validation: formValidation,
  mobile: mobileNav,
  cards: cardLayouts,
  tables: tableStyles,
  modals: modalStyles,
  badges: badgeVariants,
  icons: iconSizes,
  tooltips: tooltipStyles,
  perf: performance,
  seo,
}

export default uiImprovements