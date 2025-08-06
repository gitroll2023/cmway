"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import toast from 'react-hot-toast'
import { createClient } from "@/lib/supabase/client"
import { SiteSettings } from "@/lib/types/cms"
import { Loader2, Save, Upload } from "lucide-react"

interface SiteSettingsFormData {
  site_name: { ko: string; en: string }
  tagline: { ko: string; en: string }
  description: { ko: string; en: string }
  company_info: {
    name: string
    ceo: string
    business_number: string
    online_business_number: string
    address: { ko: string; en: string }
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
  seo_config: {
    default_title: string
    title_template: string
    default_description: string
    default_keywords: string[]
    robots: string
    canonical_domain: string
  }
  social_links: {
    facebook?: string
    instagram?: string
    youtube?: string
    blog?: string
    kakao?: string
  }
  design_tokens: {
    colors: {
      primary: string
      secondary: string
      accent: string
      success: string
      warning: string
      error: string
    }
    fonts: {
      heading: string
      body: string
      code: string
    }
    animations: {
      enable_scroll: boolean
      enable_hover: boolean
      enable_page_transition: boolean
    }
  }
}

const defaultSettings: SiteSettingsFormData = {
  site_name: { ko: "", en: "" },
  tagline: { ko: "", en: "" },
  description: { ko: "", en: "" },
  company_info: {
    name: "",
    ceo: "",
    business_number: "",
    online_business_number: "",
    address: { ko: "", en: "" },
    phone: "",
    fax: "",
    email: "",
    customer_center: {
      phone: "",
      hours: "",
      lunch: "",
      holiday: ""
    }
  },
  seo_config: {
    default_title: "",
    title_template: "",
    default_description: "",
    default_keywords: [],
    robots: "index,follow",
    canonical_domain: ""
  },
  social_links: {
    facebook: "",
    instagram: "",
    youtube: "",
    blog: "",
    kakao: ""
  },
  design_tokens: {
    colors: {
      primary: "#2563eb",
      secondary: "#64748b",
      accent: "#dc2626",
      success: "#16a34a",
      warning: "#d97706",
      error: "#dc2626"
    },
    fonts: {
      heading: "Inter",
      body: "Inter",
      code: "JetBrains Mono"
    },
    animations: {
      enable_scroll: true,
      enable_hover: true,
      enable_page_transition: true
    }
  }
}

export default function SiteSettingsPage() {
  const [settings, setSettings] = useState<SiteSettingsFormData>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [logoFiles, setLogoFiles] = useState<{
    light?: File
    dark?: File
    mobile?: File
    favicon?: File
  }>({})

  const supabase = createClient()

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (data) {
        setSettings({
          site_name: data.site_name as { ko: string; en: string },
          tagline: data.tagline as { ko: string; en: string },
          description: data.description as { ko: string; en: string } || { ko: "", en: "" },
          company_info: data.company_info as any,
          seo_config: data.seo_config as any,
          social_links: data.social_links as any,
          design_tokens: data.design_tokens as any
        })
      }
    } catch (error: any) {
      console.error('Error loading settings:', error)
      toast.error('사이트 설정을 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const uploadImage = async (file: File, bucket: string, path: string): Promise<string> => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${path}.${fileExt}`
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      })

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName)

    return publicUrl
  }

  const saveSettings = async () => {
    try {
      setSaving(true)

      // 이미지 업로드 처리
      const imageUrls: any = {}

      if (logoFiles.light) {
        imageUrls.logo_light = await uploadImage(logoFiles.light, 'images', 'logos/logo-light')
      }
      if (logoFiles.dark) {
        imageUrls.logo_dark = await uploadImage(logoFiles.dark, 'images', 'logos/logo-dark')
      }
      if (logoFiles.mobile) {
        imageUrls.logo_mobile = await uploadImage(logoFiles.mobile, 'images', 'logos/logo-mobile')
      }
      if (logoFiles.favicon) {
        imageUrls.favicon = await uploadImage(logoFiles.favicon, 'images', 'logos/favicon')
      }

      const settingsData = {
        site_name: settings.site_name,
        tagline: settings.tagline,
        description: settings.description,
        company_info: settings.company_info,
        seo_config: settings.seo_config,
        social_links: settings.social_links,
        design_tokens: settings.design_tokens,
        ...imageUrls,
        updated_at: new Date().toISOString()
      }

      const { error } = await supabase
        .from('site_settings')
        .upsert(settingsData, {
          onConflict: 'id'
        })

      if (error) throw error

      toast.success('사이트 설정이 저장되었습니다.')

      setLogoFiles({})
    } catch (error: any) {
      console.error('Error saving settings:', error)
      toast.error('사이트 설정 저장에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (path: string, value: any) => {
    setSettings(prev => {
      const keys = path.split('.')
      const newSettings = JSON.parse(JSON.stringify(prev))
      
      let current = newSettings
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]]
      }
      current[keys[keys.length - 1]] = value
      
      return newSettings
    })
  }

  const handleFileChange = (type: keyof typeof logoFiles, file: File) => {
    setLogoFiles(prev => ({
      ...prev,
      [type]: file
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">설정을 불러오는 중...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">사이트 설정</h1>
          <p className="text-muted-foreground">
            사이트의 기본 정보와 설정을 관리합니다.
          </p>
        </div>
        <Button onClick={saveSettings} disabled={saving} className="gap-2">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          저장
        </Button>
      </div>

      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList>
          <TabsTrigger value="basic">기본 정보</TabsTrigger>
          <TabsTrigger value="company">회사 정보</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="social">소셜 미디어</TabsTrigger>
          <TabsTrigger value="design">디자인</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>사이트 기본 정보</CardTitle>
                <CardDescription>
                  사이트명과 태그라인을 설정합니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>사이트명 (한국어)</Label>
                    <Input
                      value={settings.site_name.ko}
                      onChange={(e) => handleInputChange('site_name.ko', e.target.value)}
                      placeholder="사이트명을 입력하세요"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>사이트명 (영어)</Label>
                    <Input
                      value={settings.site_name.en}
                      onChange={(e) => handleInputChange('site_name.en', e.target.value)}
                      placeholder="Site Name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>태그라인 (한국어)</Label>
                    <Input
                      value={settings.tagline.ko}
                      onChange={(e) => handleInputChange('tagline.ko', e.target.value)}
                      placeholder="태그라인을 입력하세요"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>태그라인 (영어)</Label>
                    <Input
                      value={settings.tagline.en}
                      onChange={(e) => handleInputChange('tagline.en', e.target.value)}
                      placeholder="Tagline"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>사이트 설명 (한국어)</Label>
                    <Textarea
                      value={settings.description.ko}
                      onChange={(e) => handleInputChange('description.ko', e.target.value)}
                      placeholder="사이트에 대한 간단한 설명"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>사이트 설명 (영어)</Label>
                    <Textarea
                      value={settings.description.en}
                      onChange={(e) => handleInputChange('description.en', e.target.value)}
                      placeholder="Brief description about your site"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>로고 관리</CardTitle>
                <CardDescription>
                  사이트에서 사용할 로고 파일들을 업로드합니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>라이트 로고</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleFileChange('light', e.target.files[0])
                          }
                        }}
                      />
                      <Upload className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>다크 로고</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleFileChange('dark', e.target.files[0])
                          }
                        }}
                      />
                      <Upload className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>모바일 로고</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleFileChange('mobile', e.target.files[0])
                          }
                        }}
                      />
                      <Upload className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>파비콘</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleFileChange('favicon', e.target.files[0])
                          }
                        }}
                      />
                      <Upload className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>회사 정보</CardTitle>
              <CardDescription>
                사업자 정보와 연락처를 설정합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>회사명</Label>
                  <Input
                    value={settings.company_info.name}
                    onChange={(e) => handleInputChange('company_info.name', e.target.value)}
                    placeholder="회사명"
                  />
                </div>
                <div className="space-y-2">
                  <Label>대표자</Label>
                  <Input
                    value={settings.company_info.ceo}
                    onChange={(e) => handleInputChange('company_info.ceo', e.target.value)}
                    placeholder="대표자명"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>사업자등록번호</Label>
                  <Input
                    value={settings.company_info.business_number}
                    onChange={(e) => handleInputChange('company_info.business_number', e.target.value)}
                    placeholder="000-00-00000"
                  />
                </div>
                <div className="space-y-2">
                  <Label>통신판매업신고번호</Label>
                  <Input
                    value={settings.company_info.online_business_number}
                    onChange={(e) => handleInputChange('company_info.online_business_number', e.target.value)}
                    placeholder="제0000-서울-00000호"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>주소 (한국어)</Label>
                  <Input
                    value={settings.company_info.address.ko}
                    onChange={(e) => handleInputChange('company_info.address.ko', e.target.value)}
                    placeholder="회사 주소"
                  />
                </div>
                <div className="space-y-2">
                  <Label>주소 (영어)</Label>
                  <Input
                    value={settings.company_info.address.en}
                    onChange={(e) => handleInputChange('company_info.address.en', e.target.value)}
                    placeholder="Company Address"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>전화번호</Label>
                  <Input
                    value={settings.company_info.phone}
                    onChange={(e) => handleInputChange('company_info.phone', e.target.value)}
                    placeholder="02-000-0000"
                  />
                </div>
                <div className="space-y-2">
                  <Label>팩스번호</Label>
                  <Input
                    value={settings.company_info.fax}
                    onChange={(e) => handleInputChange('company_info.fax', e.target.value)}
                    placeholder="02-000-0000"
                  />
                </div>
                <div className="space-y-2">
                  <Label>이메일</Label>
                  <Input
                    type="email"
                    value={settings.company_info.email}
                    onChange={(e) => handleInputChange('company_info.email', e.target.value)}
                    placeholder="info@company.com"
                  />
                </div>
              </div>

              <div className="space-y-4 border-t pt-4">
                <h3 className="text-lg font-semibold">고객센터 정보</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>고객센터 전화번호</Label>
                    <Input
                      value={settings.company_info.customer_center.phone}
                      onChange={(e) => handleInputChange('company_info.customer_center.phone', e.target.value)}
                      placeholder="1588-0000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>운영시간</Label>
                    <Input
                      value={settings.company_info.customer_center.hours}
                      onChange={(e) => handleInputChange('company_info.customer_center.hours', e.target.value)}
                      placeholder="평일 09:00 - 18:00"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>점심시간</Label>
                    <Input
                      value={settings.company_info.customer_center.lunch}
                      onChange={(e) => handleInputChange('company_info.customer_center.lunch', e.target.value)}
                      placeholder="12:00 - 13:00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>휴무일</Label>
                    <Input
                      value={settings.company_info.customer_center.holiday}
                      onChange={(e) => handleInputChange('company_info.customer_center.holiday', e.target.value)}
                      placeholder="토,일,공휴일"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle>SEO 설정</CardTitle>
              <CardDescription>
                검색 엔진 최적화 설정을 관리합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>기본 제목</Label>
                  <Input
                    value={settings.seo_config.default_title}
                    onChange={(e) => handleInputChange('seo_config.default_title', e.target.value)}
                    placeholder="기본 제목"
                  />
                </div>
                <div className="space-y-2">
                  <Label>제목 템플릿</Label>
                  <Input
                    value={settings.seo_config.title_template}
                    onChange={(e) => handleInputChange('seo_config.title_template', e.target.value)}
                    placeholder="%s | 사이트명"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>기본 설명</Label>
                <Textarea
                  value={settings.seo_config.default_description}
                  onChange={(e) => handleInputChange('seo_config.default_description', e.target.value)}
                  placeholder="사이트에 대한 기본 설명"
                />
              </div>

              <div className="space-y-2">
                <Label>기본 키워드</Label>
                <Input
                  value={settings.seo_config.default_keywords.join(', ')}
                  onChange={(e) => handleInputChange('seo_config.default_keywords', e.target.value.split(',').map(k => k.trim()))}
                  placeholder="키워드1, 키워드2, 키워드3"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>robots.txt</Label>
                  <Input
                    value={settings.seo_config.robots}
                    onChange={(e) => handleInputChange('seo_config.robots', e.target.value)}
                    placeholder="index,follow"
                  />
                </div>
                <div className="space-y-2">
                  <Label>메인 도메인</Label>
                  <Input
                    value={settings.seo_config.canonical_domain}
                    onChange={(e) => handleInputChange('seo_config.canonical_domain', e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>소셜 미디어 링크</CardTitle>
              <CardDescription>
                소셜 미디어 계정 링크를 설정합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>페이스북</Label>
                  <Input
                    value={settings.social_links.facebook || ''}
                    onChange={(e) => handleInputChange('social_links.facebook', e.target.value)}
                    placeholder="https://facebook.com/page"
                  />
                </div>
                <div className="space-y-2">
                  <Label>인스타그램</Label>
                  <Input
                    value={settings.social_links.instagram || ''}
                    onChange={(e) => handleInputChange('social_links.instagram', e.target.value)}
                    placeholder="https://instagram.com/account"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>유튜브</Label>
                  <Input
                    value={settings.social_links.youtube || ''}
                    onChange={(e) => handleInputChange('social_links.youtube', e.target.value)}
                    placeholder="https://youtube.com/@channel"
                  />
                </div>
                <div className="space-y-2">
                  <Label>블로그</Label>
                  <Input
                    value={settings.social_links.blog || ''}
                    onChange={(e) => handleInputChange('social_links.blog', e.target.value)}
                    placeholder="https://blog.example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>카카오</Label>
                <Input
                  value={settings.social_links.kakao || ''}
                  onChange={(e) => handleInputChange('social_links.kakao', e.target.value)}
                  placeholder="https://pf.kakao.com/channel"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="design">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>브랜드 컬러</CardTitle>
                <CardDescription>
                  사이트 전체에서 사용할 브랜드 컬러를 설정합니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Primary</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={settings.design_tokens.colors.primary}
                        onChange={(e) => handleInputChange('design_tokens.colors.primary', e.target.value)}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={settings.design_tokens.colors.primary}
                        onChange={(e) => handleInputChange('design_tokens.colors.primary', e.target.value)}
                        placeholder="#2563eb"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Secondary</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={settings.design_tokens.colors.secondary}
                        onChange={(e) => handleInputChange('design_tokens.colors.secondary', e.target.value)}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={settings.design_tokens.colors.secondary}
                        onChange={(e) => handleInputChange('design_tokens.colors.secondary', e.target.value)}
                        placeholder="#64748b"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Accent</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={settings.design_tokens.colors.accent}
                        onChange={(e) => handleInputChange('design_tokens.colors.accent', e.target.value)}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={settings.design_tokens.colors.accent}
                        onChange={(e) => handleInputChange('design_tokens.colors.accent', e.target.value)}
                        placeholder="#dc2626"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>타이포그래피</CardTitle>
                <CardDescription>
                  사이트에서 사용할 폰트를 설정합니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>제목 폰트</Label>
                    <Input
                      value={settings.design_tokens.fonts.heading}
                      onChange={(e) => handleInputChange('design_tokens.fonts.heading', e.target.value)}
                      placeholder="Inter"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>본문 폰트</Label>
                    <Input
                      value={settings.design_tokens.fonts.body}
                      onChange={(e) => handleInputChange('design_tokens.fonts.body', e.target.value)}
                      placeholder="Inter"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>코드 폰트</Label>
                    <Input
                      value={settings.design_tokens.fonts.code}
                      onChange={(e) => handleInputChange('design_tokens.fonts.code', e.target.value)}
                      placeholder="JetBrains Mono"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>애니메이션 설정</CardTitle>
                <CardDescription>
                  사이트 애니메이션을 활성화/비활성화합니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>스크롤 애니메이션</Label>
                    <Switch
                      checked={settings.design_tokens.animations.enable_scroll}
                      onCheckedChange={(checked) => handleInputChange('design_tokens.animations.enable_scroll', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>호버 애니메이션</Label>
                    <Switch
                      checked={settings.design_tokens.animations.enable_hover}
                      onCheckedChange={(checked) => handleInputChange('design_tokens.animations.enable_hover', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>페이지 전환 애니메이션</Label>
                    <Switch
                      checked={settings.design_tokens.animations.enable_page_transition}
                      onCheckedChange={(checked) => handleInputChange('design_tokens.animations.enable_page_transition', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}