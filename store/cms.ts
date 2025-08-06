import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SiteSettings {
  site_name: {
    ko: string
    en: string
  }
  tagline: {
    ko: string
    en: string
  }
  logo?: string
  logo_dark?: string
  favicon?: string
  company_info: {
    name: string
    ceo: string
    business_number: string
    online_business_number: string
    address: {
      ko: string
      en: string
    }
    phone: string
    fax: string
    email: string
    customer_center: {
      phone: string
      hours: string
      lunch: string
      holiday: string
    }
  }
  social_links?: {
    facebook?: string
    instagram?: string
    youtube?: string
    blog?: string
    kakao?: string
  }
  footer_config: {
    copyright: string
    show_social_links: boolean
    show_customer_center: boolean
  }
}

interface Navigation {
  id: string
  parent_id?: string
  title: {
    ko: string
    en?: string
  }
  href: string
  order: number
  is_visible: boolean
  target?: '_self' | '_blank'
  icon?: string
}

interface CMSStore {
  siteSettings: SiteSettings | null
  navigation: Navigation[]
  isLoading: boolean
  setSiteSettings: (settings: SiteSettings) => void
  updateSiteSettings: (settings: SiteSettings) => Promise<void>
  setNavigation: (nav: Navigation[]) => void
  setLoading: (loading: boolean) => void
  initializeCMS: () => Promise<void>
}

const defaultSiteSettings: SiteSettings = {
  site_name: {
    ko: '씨엠웨이',
    en: 'CMWay'
  },
  tagline: {
    ko: '건강한 삶의 동반자',
    en: 'Your Health Partner'
  },
  company_info: {
    name: '씨엠웨이(주)',
    ceo: '대표이사',
    business_number: '000-00-00000',
    online_business_number: '제 0000-서울-0000호',
    address: {
      ko: '서울특별시 강남구 테헤란로 000',
      en: 'Teheran-ro, Gangnam-gu, Seoul'
    },
    phone: '02-0000-0000',
    fax: '02-0000-0001',
    email: 'contact@cmway.co.kr',
    customer_center: {
      phone: '1588-0000',
      hours: '평일 09:00 - 18:00',
      lunch: '점심시간 12:00 - 13:00',
      holiday: '토/일/공휴일 휴무'
    }
  },
  social_links: {
    facebook: 'https://facebook.com/cmway',
    instagram: 'https://instagram.com/cmway',
    youtube: 'https://youtube.com/cmway'
  },
  footer_config: {
    copyright: '© 2025 CMWay Co., Ltd. All rights reserved.',
    show_social_links: true,
    show_customer_center: true
  }
}

export const useCMSStore = create<CMSStore>()(
  persist(
    (set) => ({
      siteSettings: defaultSiteSettings,
      navigation: [],
      isLoading: false,
      setSiteSettings: (settings) => set({ siteSettings: settings }),
      updateSiteSettings: async (settings) => {
        set({ siteSettings: settings })
        // In the future, this would save to Supabase
        // await supabase.from('site_settings').update(settings).eq('id', 1)
      },
      setNavigation: (nav) => set({ navigation: nav }),
      setLoading: (loading) => set({ isLoading: loading }),
      initializeCMS: async () => {
        set({ isLoading: true })
        try {
          // 실제로는 Supabase에서 데이터를 가져옴
          // const { data: settings } = await supabase
          //   .from('site_settings')
          //   .select('*')
          //   .single()
          
          // const { data: nav } = await supabase
          //   .from('navigation')
          //   .select('*')
          //   .order('order', { ascending: true })
          
          // 현재는 기본값 사용
          set({ 
            siteSettings: defaultSiteSettings,
            navigation: [],
            isLoading: false 
          })
        } catch (error) {
          console.error('Failed to initialize CMS:', error)
          set({ isLoading: false })
        }
      }
    }),
    {
      name: 'cms-storage',
      partialize: (state) => ({ 
        siteSettings: state.siteSettings,
        navigation: state.navigation 
      })
    }
  )
)