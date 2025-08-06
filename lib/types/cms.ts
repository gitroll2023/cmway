// CMS Types for CMWay Platform

export interface SiteSettings {
  id: string;
  site_name: {
    ko: string;
    en: string;
  };
  tagline: {
    ko: string;
    en: string;
  };
  description?: {
    ko: string;
    en: string;
  };
  logo_light?: string;
  logo_dark?: string;
  logo_mobile?: string;
  favicon?: string;
  og_image?: string;
  company_info: {
    name: string;
    ceo: string;
    business_number: string;
    online_business_number: string;
    address: {
      ko: string;
      en: string;
    };
    phone: string;
    fax: string;
    email: string;
    customer_center: {
      phone: string;
      hours: string;
      lunch: string;
      holiday: string;
    };
  };
  seo_config: {
    default_title: string;
    title_template: string;
    default_description: string;
    default_keywords: string[];
    robots: string;
    canonical_domain: string;
  };
  og_config: {
    og_type: string;
    og_site_name: string;
    twitter_card: string;
    twitter_handle: string;
  };
  social_links: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    blog?: string;
    kakao?: string;
  };
  integrations: {
    google_analytics?: string;
    google_tag_manager?: string;
    naver_site_verification?: string;
    facebook_pixel?: string;
    kakao_sdk_key?: string;
    channel_talk_key?: string;
  };
  footer_config: {
    copyright: string;
    show_family_sites: boolean;
    show_certifications: boolean;
    show_payment_methods: boolean;
  };
  design_tokens: {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      success: string;
      warning: string;
      error: string;
    };
    fonts: {
      heading: string;
      body: string;
      code: string;
    };
    animations: {
      enable_scroll: boolean;
      enable_hover: boolean;
      enable_page_transition: boolean;
    };
  };
  maintenance: {
    enabled: boolean;
    message: string;
    expected_time?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface Translation {
  id: string;
  key: string;
  namespace: string;
  translations: {
    [locale: string]: string;
  };
  description?: string;
  is_rich_text: boolean;
  created_at: string;
  updated_at: string;
}

export interface Menu {
  id: string;
  menu_location: 'header' | 'footer' | 'mobile' | 'sidebar';
  parent_id?: string;
  title: {
    [locale: string]: string;
  };
  url?: string;
  url_type: 'internal' | 'external' | 'anchor' | 'category' | 'page';
  target: '_self' | '_blank';
  icon?: string;
  badge_text?: string;
  badge_color?: string;
  css_class?: string;
  is_mega_menu: boolean;
  mega_menu_columns: number;
  mega_menu_content?: any;
  visibility_rules: {
    show_logged_in: boolean;
    show_logged_out: boolean;
    required_roles: string[];
    hide_on_mobile: boolean;
  };
  position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Page {
  id: string;
  slug: string;
  template: 'default' | 'landing' | 'product' | 'blog' | 'custom';
  page_type: 'static' | 'dynamic' | 'system';
  meta: {
    title: {
      [locale: string]: string;
    };
    description: {
      [locale: string]: string;
    };
    keywords: string[];
    og_title?: string;
    og_description?: string;
    og_image?: string;
  };
  settings: {
    show_header: boolean;
    show_footer: boolean;
    show_breadcrumb: boolean;
    container_width: 'default' | 'wide' | 'full';
    background_color?: string;
    background_image?: string;
  };
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  published_at?: string;
  scheduled_at?: string;
  access_rules: {
    require_login: boolean;
    allowed_roles: string[];
    redirect_url: string;
  };
  animations: {
    page_transition: string;
    scroll_animation: string;
    animation_duration: number;
    stagger_delay: number;
  };
  version: number;
  draft_content?: any;
  published_content?: any;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

export interface ContentBlock {
  id: string;
  name: string;
  type: string;
  category: 'hero' | 'content' | 'feature' | 'testimonial' | 'cta' | 'form';
  content: any;
  animations: {
    on_scroll: {
      enabled: boolean;
      type: string;
      duration: number;
      delay: number;
      offset: number;
    };
    on_hover: {
      enabled: boolean;
      type: string;
      scale?: number;
    };
  };
  responsive: {
    desktop: { display: boolean; columns: number };
    tablet: { display: boolean; columns: number };
    mobile: { display: boolean; columns: number };
  };
  is_global: boolean;
  is_template: boolean;
  created_at: string;
  updated_at: string;
}

export interface PageBlock {
  id: string;
  page_id: string;
  block_id: string;
  section: 'header' | 'hero' | 'main' | 'sidebar' | 'footer';
  position: number;
  override_content?: any;
  override_animations?: any;
  override_responsive?: any;
  visibility_rules: {
    show_on_desktop: boolean;
    show_on_tablet: boolean;
    show_on_mobile: boolean;
    show_logged_in: boolean;
    show_logged_out: boolean;
  };
  is_active: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  parent_id?: string;
  name: {
    [locale: string]: string;
  };
  slug: string;
  description?: {
    [locale: string]: string;
  };
  thumbnail?: string;
  banner_image?: string;
  icon?: string;
  meta: any;
  display_settings: {
    show_in_menu: boolean;
    show_in_homepage: boolean;
    show_in_footer: boolean;
    featured: boolean;
  };
  layout_settings: {
    products_per_page: number;
    default_view: 'grid' | 'list';
    show_filters: boolean;
    show_sorting: boolean;
  };
  custom_fields: any;
  position: number;
  path?: string;
  level: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  sku: string;
  barcode?: string;
  name: {
    [locale: string]: string;
  };
  slug: string;
  short_description?: {
    [locale: string]: string;
  };
  description?: {
    [locale: string]: string;
  };
  features?: {
    [locale: string]: string[];
  };
  benefits?: {
    [locale: string]: string[];
  };
  usage?: {
    [locale: string]: string;
  };
  primary_category_id?: string;
  category_ids: string[];
  brand_id?: string;
  pricing: {
    display_price?: number;
    price_text: string;
    is_price_visible: boolean;
  };
  media: {
    featured_image?: string;
    gallery: string[];
    videos: string[];
    "360_view"?: string;
    documents: string[];
  };
  specifications?: any;
  ingredients?: any;
  nutrition_facts?: any;
  certifications?: any;
  quality: {
    gmp_certified: boolean;
    haccp_certified: boolean;
    organic_certified: boolean;
    other_certifications: string[];
  };
  seo: any;
  inquiry_settings: {
    enable_inquiry: boolean;
    inquiry_button_text: string;
    show_kakao_chat: boolean;
    show_phone_number: boolean;
  };
  related_products: {
    cross_sells: string[];
    up_sells: string[];
    frequently_bought: string[];
  };
  status: 'draft' | 'published' | 'out_of_stock';
  featured: boolean;
  is_new: boolean;
  is_best: boolean;
  stats: {
    view_count: number;
    inquiry_count: number;
    brochure_download_count: number;
  };
  custom_fields: any;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface Banner {
  id: string;
  name: string;
  type: 'hero' | 'promotional' | 'notification' | 'announcement';
  title: {
    [locale: string]: string;
  };
  subtitle?: {
    [locale: string]: string;
  };
  description?: {
    [locale: string]: string;
  };
  image: {
    desktop: string;
    tablet?: string;
    mobile?: string;
  };
  background_color?: string;
  text_color?: string;
  button?: {
    text: {
      [locale: string]: string;
    };
    url: string;
    style: 'primary' | 'secondary' | 'outline';
  };
  position: {
    location: 'header' | 'hero' | 'middle' | 'footer' | 'popup';
    priority: number;
  };
  display_rules: {
    pages: string[];
    start_date?: string;
    end_date?: string;
    show_logged_in: boolean;
    show_logged_out: boolean;
    max_impressions?: number;
    frequency: 'always' | 'once_per_session' | 'once_per_day';
  };
  analytics: {
    impressions: number;
    clicks: number;
    conversion_rate: number;
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface StoreLocation {
  id: string;
  name: {
    [locale: string]: string;
  };
  type: 'headquarters' | 'branch' | 'warehouse' | 'showroom';
  address: {
    [locale: string]: string;
  };
  postal_code?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  contact: {
    phone?: string;
    fax?: string;
    email?: string;
  };
  hours: {
    monday?: { open: string; close: string; closed?: boolean };
    tuesday?: { open: string; close: string; closed?: boolean };
    wednesday?: { open: string; close: string; closed?: boolean };
    thursday?: { open: string; close: string; closed?: boolean };
    friday?: { open: string; close: string; closed?: boolean };
    saturday?: { open: string; close: string; closed?: boolean };
    sunday?: { open: string; close: string; closed?: boolean };
  };
  services: string[];
  features: {
    parking: boolean;
    wheelchair_accessible: boolean;
    public_transport: boolean;
    wifi: boolean;
  };
  images: string[];
  description?: {
    [locale: string]: string;
  };
  manager?: {
    name: string;
    phone?: string;
    email?: string;
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
}