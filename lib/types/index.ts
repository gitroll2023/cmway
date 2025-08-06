// Common types and interfaces for CMWay CMS

export * from './cms';
export * from './database';

// Common UI types
export interface BaseProps {
  className?: string;
  children?: React.ReactNode;
}

// Animation types
export interface AnimationConfig {
  initial?: any;
  animate?: any;
  transition?: any;
  whileHover?: any;
  whileTap?: any;
  exit?: any;
}

// Form types
export interface FormField {
  name: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'file';
  label: string;
  placeholder?: string;
  required?: boolean;
  validation?: any;
  options?: Array<{
    value: string;
    label: string;
  }>;
}

// API response types
export interface ApiResponse<T = any> {
  data: T;
  error: string | null;
  success: boolean;
  message?: string;
}

// Pagination types
export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Theme types
export interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    muted: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };
  fonts: {
    heading: string;
    body: string;
    mono: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
  };
  breakpoints: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
  };
}

// SEO types
export interface SEOData {
  title: string;
  description: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonical?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

// Media types
export interface MediaItem {
  id: string;
  filename: string;
  original_name: string;
  mime_type: string;
  size_bytes: number;
  public_url: string;
  cdn_url?: string;
  alt_text?: {
    [locale: string]: string;
  };
  caption?: {
    [locale: string]: string;
  };
  dimensions?: {
    width: number;
    height: number;
  };
  thumbnails?: {
    [size: string]: string;
  };
  folder_path: string;
  tags: string[];
  created_at: string;
}

// User types
export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role: 'admin' | 'editor' | 'customer';
  created_at: string;
  updated_at: string;
}

// Consultation types
export interface ConsultationRequest {
  id: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  consultation_type: '방문상담' | '전화상담' | '화상상담';
  preferred_date?: string;
  preferred_time?: string;
  product_interests: string[];
  message?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  assigned_to?: string;
  admin_notes?: string;
  consultation_result?: string;
  marketing_agreed: boolean;
  privacy_agreed: boolean;
  created_at: string;
  updated_at: string;
}

// Contact request types
export interface ContactRequest {
  id: string;
  name: string;
  phone: string;
  email?: string;
  subject: string;
  message: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'closed';
  assigned_to?: string;
  admin_notes?: string;
  response?: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  updated_at?: string;
}

// Store location types are exported from cms.ts

// Banner types
export interface Banner {
  id: string;
  name: string;
  type: 'hero' | 'promotion' | 'notice' | 'popup' | 'modal';
  content: {
    title?: {
      [locale: string]: string;
    };
    subtitle?: {
      [locale: string]: string;
    };
    description?: {
      [locale: string]: string;
    };
    button_text?: {
      [locale: string]: string;
    };
  };
  media?: {
    desktop?: string;
    tablet?: string;
    mobile?: string;
    video?: string;
  };
  link_url?: string;
  link_target: '_self' | '_blank';
  display_rules: {
    pages: string[];
    start_date?: string;
    end_date?: string;
    show_once: boolean;
    cookie_days: number;
    trigger: 'immediate' | 'delay' | 'scroll' | 'exit';
    trigger_value: number;
  };
  targeting: {
    devices: ('desktop' | 'tablet' | 'mobile')[];
    user_types: string[];
    languages: string[];
  };
  styles?: any;
  animations: {
    entrance: string;
    exit: string;
    duration: number;
  };
  priority: number;
  is_active: boolean;
  impressions: number;
  clicks: number;
  created_at: string;
  updated_at: string;
}