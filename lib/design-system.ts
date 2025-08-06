// Design System Constants for CMWay
// 전체 사이트에서 일관된 디자인을 위한 통합 시스템

export const colors = {
  // Primary Colors
  primary: {
    emerald: {
      50: '#ecfdf5',
      100: '#d1fae5',
      200: '#a7f3d0',
      300: '#6ee7b7',
      400: '#34d399',
      500: '#10b981',
      600: '#059669',
      700: '#047857',
      800: '#065f46',
      900: '#064e3b',
    },
    blue: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
  },
  // Gradients
  gradients: {
    primary: 'from-emerald-600 to-blue-600',
    light: 'from-emerald-50 to-blue-50',
    hero: 'from-emerald-50 via-blue-50 to-green-50',
    dark: 'from-emerald-700 to-blue-700',
  },
  // Semantic Colors
  semantic: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
}

export const typography = {
  // Font Family
  fontFamily: {
    sans: "'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', sans-serif",
  },
  // Font Sizes
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
  },
  // Font Weights
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
}

export const spacing = {
  // Consistent spacing scale
  section: {
    py: 'py-20 lg:py-24', // Section vertical padding
    px: 'px-4',           // Section horizontal padding
    container: 'max-w-7xl mx-auto px-4', // Container
  },
  card: {
    padding: 'p-6',       // Card padding
    gap: 'gap-6',         // Card content gap
  },
}

export const animation = {
  // Transition Durations
  duration: {
    fast: '150ms',
    base: '300ms',
    slow: '500ms',
    slower: '800ms',
  },
  // Animation Presets
  transition: {
    all: 'transition-all duration-300',
    colors: 'transition-colors duration-300',
    transform: 'transition-transform duration-300',
    shadow: 'transition-shadow duration-300',
  },
  // Framer Motion Variants
  framer: {
    fadeIn: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5 },
    },
    slideUp: {
      initial: { opacity: 0, y: 30 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.6 },
    },
    slideIn: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      transition: { duration: 0.5 },
    },
    scaleIn: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.4 },
    },
  },
}

export const shadows = {
  sm: 'shadow-sm',
  base: 'shadow',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  '2xl': 'shadow-2xl',
  card: 'shadow-lg hover:shadow-2xl transition-shadow duration-300',
}

export const borderRadius = {
  sm: 'rounded-sm',
  base: 'rounded',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-3xl',
  full: 'rounded-full',
}

export const components = {
  // Hero Section Styles
  hero: {
    wrapper: `relative ${spacing.section.py} bg-gradient-to-br ${colors.gradients.hero}`,
    container: spacing.section.container,
    title: 'text-4xl lg:text-5xl font-bold text-gray-900 mb-6',
    subtitle: 'text-xl text-gray-600 max-w-3xl mx-auto',
    icon: 'inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-6',
  },
  // Button Styles
  button: {
    base: 'inline-flex items-center justify-center font-medium rounded-full transition-all duration-300',
    primary: `bg-gradient-to-r ${colors.gradients.primary} text-white hover:shadow-xl transform hover:scale-105`,
    secondary: 'bg-white text-emerald-600 border-2 border-emerald-600 hover:bg-emerald-50',
    sizes: {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    },
  },
  // Card Styles
  card: {
    base: 'bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300',
    padding: 'p-6',
    header: 'mb-4',
    body: 'space-y-4',
  },
  // Section Styles
  section: {
    wrapper: `${spacing.section.py} bg-white`,
    container: spacing.section.container,
    header: 'text-center mb-16',
    title: 'text-3xl lg:text-4xl font-bold text-gray-900 mb-6',
    subtitle: 'text-gray-600 text-lg max-w-3xl mx-auto',
  },
  // Grid Layouts
  grid: {
    cols1: 'grid grid-cols-1 gap-6',
    cols2: 'grid grid-cols-1 md:grid-cols-2 gap-6',
    cols3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
    cols4: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6',
  },
  // Form Elements
  form: {
    input: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300',
    label: 'block text-sm font-medium text-gray-700 mb-2',
    error: 'text-sm text-red-600 mt-1',
    group: 'mb-6',
  },
  // Badge Styles
  badge: {
    base: 'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
    primary: 'bg-emerald-100 text-emerald-700',
    secondary: 'bg-blue-100 text-blue-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    error: 'bg-red-100 text-red-700',
  },
  // Modal Styles
  modal: {
    overlay: 'fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4',
    content: 'bg-white rounded-2xl max-w-2xl w-full p-8',
    header: 'flex justify-between items-start mb-6',
    body: 'space-y-4',
    footer: 'mt-6 flex justify-end gap-4',
  },
}

// Responsive Breakpoints
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
}

// Z-Index Scale
export const zIndex = {
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  modalOverlay: 40,
  modal: 50,
  popover: 60,
  tooltip: 70,
}

// Helper Functions
export const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ')
}

// Get gradient class
export const getGradient = (type: keyof typeof colors.gradients = 'primary') => {
  return `bg-gradient-to-r ${colors.gradients[type]}`
}

// Get button class
export const getButtonClass = (variant: 'primary' | 'secondary' = 'primary', size: 'sm' | 'md' | 'lg' = 'md') => {
  return cn(components.button.base, components.button[variant], components.button.sizes[size])
}

// Get section class
export const getSectionClass = (bg: 'white' | 'gradient' = 'white') => {
  const bgClass = bg === 'gradient' ? `bg-gradient-to-br ${colors.gradients.hero}` : 'bg-white'
  return cn(spacing.section.py, bgClass)
}

// Get card class
export const getCardClass = (hoverable: boolean = true) => {
  return cn(
    components.card.base,
    hoverable && 'hover:shadow-2xl'
  )
}