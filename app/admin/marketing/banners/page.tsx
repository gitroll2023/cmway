"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"
import { banners } from "@/lib/cms"
import { Banner } from "@/lib/types/cms"
import { 
  Loader2, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Monitor,
  Smartphone,
  Tablet,
  Calendar,
  TrendingUp
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface BannerFormData {
  id?: string
  name: string
  type: 'hero' | 'promotional' | 'notification' | 'announcement'
  title: { ko: string; en: string }
  subtitle: { ko: string; en: string }
  description: { ko: string; en: string }
  image: {
    desktop: string
    tablet?: string
    mobile?: string
  }
  background_color?: string
  text_color?: string
  button?: {
    text: { ko: string; en: string }
    url: string
    style: 'primary' | 'secondary' | 'outline'
  }
  position: {
    location: 'header' | 'hero' | 'middle' | 'footer' | 'popup'
    priority: number
  }
  display_rules: {
    pages: string[]
    start_date?: string
    end_date?: string
    show_logged_in: boolean
    show_logged_out: boolean
    max_impressions?: number
    frequency: 'always' | 'once_per_session' | 'once_per_day'
  }
  is_active: boolean
}

const defaultBannerData: BannerFormData = {
  name: '',
  type: 'promotional',
  title: { ko: '', en: '' },
  subtitle: { ko: '', en: '' },
  description: { ko: '', en: '' },
  image: {
    desktop: ''
  },
  position: {
    location: 'hero',
    priority: 1
  },
  display_rules: {
    pages: [],
    show_logged_in: true,
    show_logged_out: true,
    frequency: 'always'
  },
  is_active: true
}

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingBanner, setEditingBanner] = useState<BannerFormData | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [locationFilter, setLocationFilter] = useState<string>('all')

  useEffect(() => {
    loadBanners()
  }, [])

  const loadBanners = async () => {
    try {
      setLoading(true)
      const { data } = await banners.getAll()
      setBanners(data || [])
    } catch (error: any) {
      console.error('Error loading banners:', error)
      toast({
        title: "오류",
        description: "배너를 불러오는데 실패했습니다.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const saveBanner = async () => {
    if (!editingBanner) return

    try {
      setSaving(true)

      const bannerData = {
        name: editingBanner.name,
        type: editingBanner.type,
        title: editingBanner.title,
        subtitle: editingBanner.subtitle,
        description: editingBanner.description,
        image: editingBanner.image,
        background_color: editingBanner.background_color,
        text_color: editingBanner.text_color,
        button: editingBanner.button,
        position: editingBanner.position,
        display_rules: editingBanner.display_rules,
        is_active: editingBanner.is_active
      }

      if (editingBanner.id) {
        await banners.update(editingBanner.id, bannerData)
      } else {
        await banners.create(bannerData)
      }

      toast({
        title: "성공",
        description: "배너가 저장되었습니다."
      })

      setDialogOpen(false)
      setEditingBanner(null)
      loadBanners()
    } catch (error: any) {
      console.error('Error saving banner:', error)
      toast({
        title: "오류",
        description: "배너 저장에 실패했습니다.",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const deleteBanner = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return

    try {
      await banners.delete(id)

      toast({
        title: "성공",
        description: "배너가 삭제되었습니다."
      })

      loadBanners()
    } catch (error: any) {
      console.error('Error deleting banner:', error)
      toast({
        title: "오류",
        description: "배너 삭제에 실패했습니다.",
        variant: "destructive"
      })
    }
  }

  const toggleBannerStatus = async (banner: Banner, isActive: boolean) => {
    try {
      await banners.update(banner.id, { is_active: isActive })

      toast({
        title: "성공",
        description: `배너가 ${isActive ? '활성화' : '비활성화'}되었습니다.`
      })

      loadBanners()
    } catch (error: any) {
      console.error('Error updating banner status:', error)
      toast({
        title: "오류",
        description: "배너 상태 변경에 실패했습니다.",
        variant: "destructive"
      })
    }
  }

  const handleEdit = (banner: Banner) => {
    setEditingBanner({
      id: banner.id,
      name: banner.name,
      type: banner.type,
      title: banner.title as { ko: string; en: string },
      subtitle: (banner.subtitle as { ko: string; en: string }) || { ko: '', en: '' },
      description: (banner.description as { ko: string; en: string }) || { ko: '', en: '' },
      image: banner.image,
      background_color: banner.background_color,
      text_color: banner.text_color,
      button: banner.button as any,
      position: banner.position,
      display_rules: banner.display_rules,
      is_active: banner.is_active
    })
    setDialogOpen(true)
  }

  const handleAdd = () => {
    setEditingBanner(defaultBannerData)
    setDialogOpen(true)
  }

  const getTypeBadge = (type: string) => {
    const variants = {
      hero: { variant: 'default' as const, label: '히어로' },
      promotional: { variant: 'secondary' as const, label: '프로모션' },
      notification: { variant: 'outline' as const, label: '알림' },
      announcement: { variant: 'destructive' as const, label: '공지' }
    }
    const config = variants[type as keyof typeof variants] || variants.promotional
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getLocationBadge = (location: string) => {
    const labels = {
      header: '헤더',
      hero: '히어로',
      middle: '중간',
      footer: '푸터',
      popup: '팝업'
    }
    return <Badge variant="outline">{labels[location as keyof typeof labels]}</Badge>
  }

  const filteredBanners = banners.filter(banner => {
    const matchesSearch = banner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (banner.title as any)?.ko?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'all' || banner.type === typeFilter
    const matchesLocation = locationFilter === 'all' || banner.position.location === locationFilter
    return matchesSearch && matchesType && matchesLocation
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">배너를 불러오는 중...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">배너 관리</h1>
          <p className="text-muted-foreground">
            마케팅 배너를 생성하고 관리합니다.
          </p>
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          배너 추가
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            배너 목록
          </CardTitle>
          <CardDescription>
            등록된 배너들을 확인하고 편집할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 max-w-sm">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="배너 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 타입</SelectItem>
                <SelectItem value="hero">히어로</SelectItem>
                <SelectItem value="promotional">프로모션</SelectItem>
                <SelectItem value="notification">알림</SelectItem>
                <SelectItem value="announcement">공지</SelectItem>
              </SelectContent>
            </Select>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 위치</SelectItem>
                <SelectItem value="header">헤더</SelectItem>
                <SelectItem value="hero">히어로</SelectItem>
                <SelectItem value="middle">중간</SelectItem>
                <SelectItem value="footer">푸터</SelectItem>
                <SelectItem value="popup">팝업</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>배너</TableHead>
                <TableHead>타입</TableHead>
                <TableHead>위치</TableHead>
                <TableHead>기간</TableHead>
                <TableHead>성과</TableHead>
                <TableHead>상태</TableHead>
                <TableHead className="text-right">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBanners.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    배너가 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                filteredBanners.map((banner) => (
                  <TableRow key={banner.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-10 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                          {banner.image.desktop ? (
                            <img
                              src={banner.image.desktop}
                              alt={banner.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{banner.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {(banner.title as any)?.ko}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getTypeBadge(banner.type)}</TableCell>
                    <TableCell>{getLocationBadge(banner.position.location)}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {banner.display_rules.start_date && banner.display_rules.end_date ? (
                          <>
                            <div>{new Date(banner.display_rules.start_date).toLocaleDateString('ko-KR')}</div>
                            <div className="text-muted-foreground">
                              ~ {new Date(banner.display_rules.end_date).toLocaleDateString('ko-KR')}
                            </div>
                          </>
                        ) : (
                          <span className="text-muted-foreground">상시</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <TrendingUp className="h-4 w-4" />
                        <div>
                          <div>{banner.analytics.impressions.toLocaleString()} 노출</div>
                          <div className="text-muted-foreground">
                            {banner.analytics.clicks.toLocaleString()} 클릭 ({banner.analytics.conversion_rate.toFixed(1)}%)
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={banner.is_active}
                          onCheckedChange={(checked) => toggleBannerStatus(banner, checked)}
                          size="sm"
                        />
                        <span className="text-xs text-muted-foreground">
                          {banner.is_active ? '활성' : '비활성'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(banner)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteBanner(banner.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingBanner?.id ? '배너 편집' : '새 배너 추가'}
            </DialogTitle>
            <DialogDescription>
              배너 정보를 입력하세요.
            </DialogDescription>
          </DialogHeader>

          {editingBanner && (
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">기본 정보</TabsTrigger>
                <TabsTrigger value="content">콘텐츠</TabsTrigger>
                <TabsTrigger value="display">표시 설정</TabsTrigger>
                <TabsTrigger value="analytics">성과 분석</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>배너명</Label>
                    <Input
                      value={editingBanner.name}
                      onChange={(e) => 
                        setEditingBanner(prev => prev ? { ...prev, name: e.target.value } : null)
                      }
                      placeholder="배너명을 입력하세요"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>타입</Label>
                    <Select
                      value={editingBanner.type}
                      onValueChange={(value: any) => 
                        setEditingBanner(prev => prev ? { ...prev, type: value } : null)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hero">히어로 배너</SelectItem>
                        <SelectItem value="promotional">프로모션 배너</SelectItem>
                        <SelectItem value="notification">알림 배너</SelectItem>
                        <SelectItem value="announcement">공지 배너</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>위치</Label>
                    <Select
                      value={editingBanner.position.location}
                      onValueChange={(value: any) => 
                        setEditingBanner(prev => prev ? { 
                          ...prev, 
                          position: { ...prev.position, location: value }
                        } : null)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="header">헤더</SelectItem>
                        <SelectItem value="hero">히어로 영역</SelectItem>
                        <SelectItem value="middle">중간 영역</SelectItem>
                        <SelectItem value="footer">푸터</SelectItem>
                        <SelectItem value="popup">팝업</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>우선순위</Label>
                    <Input
                      type="number"
                      value={editingBanner.position.priority}
                      onChange={(e) => 
                        setEditingBanner(prev => prev ? {
                          ...prev,
                          position: { ...prev.position, priority: Number(e.target.value) }
                        } : null)
                      }
                      min="1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>배경색</Label>
                    <Input
                      type="color"
                      value={editingBanner.background_color || '#000000'}
                      onChange={(e) => 
                        setEditingBanner(prev => prev ? { ...prev, background_color: e.target.value } : null)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>텍스트 색상</Label>
                    <Input
                      type="color"
                      value={editingBanner.text_color || '#ffffff'}
                      onChange={(e) => 
                        setEditingBanner(prev => prev ? { ...prev, text_color: e.target.value } : null)
                      }
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="content" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>제목 (한국어)</Label>
                    <Input
                      value={editingBanner.title.ko}
                      onChange={(e) => 
                        setEditingBanner(prev => prev ? {
                          ...prev,
                          title: { ...prev.title, ko: e.target.value }
                        } : null)
                      }
                      placeholder="배너 제목"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>제목 (영어)</Label>
                    <Input
                      value={editingBanner.title.en}
                      onChange={(e) => 
                        setEditingBanner(prev => prev ? {
                          ...prev,
                          title: { ...prev.title, en: e.target.value }
                        } : null)
                      }
                      placeholder="Banner Title"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>부제목 (한국어)</Label>
                    <Input
                      value={editingBanner.subtitle.ko}
                      onChange={(e) => 
                        setEditingBanner(prev => prev ? {
                          ...prev,
                          subtitle: { ...prev.subtitle, ko: e.target.value }
                        } : null)
                      }
                      placeholder="부제목"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>부제목 (영어)</Label>
                    <Input
                      value={editingBanner.subtitle.en}
                      onChange={(e) => 
                        setEditingBanner(prev => prev ? {
                          ...prev,
                          subtitle: { ...prev.subtitle, en: e.target.value }
                        } : null)
                      }
                      placeholder="Subtitle"
                    />
                  </div>
                </div>

                <div className="space-y-4 border-t pt-4">
                  <h3 className="text-lg font-semibold">이미지</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Monitor className="h-4 w-4" />
                        데스크톱
                      </Label>
                      <Input
                        value={editingBanner.image.desktop}
                        onChange={(e) => 
                          setEditingBanner(prev => prev ? {
                            ...prev,
                            image: { ...prev.image, desktop: e.target.value }
                          } : null)
                        }
                        placeholder="데스크톱 이미지 URL"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Tablet className="h-4 w-4" />
                        태블릿
                      </Label>
                      <Input
                        value={editingBanner.image.tablet || ''}
                        onChange={(e) => 
                          setEditingBanner(prev => prev ? {
                            ...prev,
                            image: { ...prev.image, tablet: e.target.value }
                          } : null)
                        }
                        placeholder="태블릿 이미지 URL"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4" />
                        모바일
                      </Label>
                      <Input
                        value={editingBanner.image.mobile || ''}
                        onChange={(e) => 
                          setEditingBanner(prev => prev ? {
                            ...prev,
                            image: { ...prev.image, mobile: e.target.value }
                          } : null)
                        }
                        placeholder="모바일 이미지 URL"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 border-t pt-4">
                  <h3 className="text-lg font-semibold">버튼 설정</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>버튼 텍스트 (한국어)</Label>
                      <Input
                        value={editingBanner.button?.text?.ko || ''}
                        onChange={(e) => 
                          setEditingBanner(prev => prev ? {
                            ...prev,
                            button: { 
                              ...prev.button,
                              text: { 
                                ko: e.target.value, 
                                en: prev.button?.text?.en || ''
                              },
                              url: prev.button?.url || '',
                              style: prev.button?.style || 'primary'
                            }
                          } : null)
                        }
                        placeholder="버튼 텍스트"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>버튼 텍스트 (영어)</Label>
                      <Input
                        value={editingBanner.button?.text?.en || ''}
                        onChange={(e) => 
                          setEditingBanner(prev => prev ? {
                            ...prev,
                            button: { 
                              ...prev.button,
                              text: { 
                                ko: prev.button?.text?.ko || '', 
                                en: e.target.value
                              },
                              url: prev.button?.url || '',
                              style: prev.button?.style || 'primary'
                            }
                          } : null)
                        }
                        placeholder="Button Text"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>버튼 URL</Label>
                      <Input
                        value={editingBanner.button?.url || ''}
                        onChange={(e) => 
                          setEditingBanner(prev => prev ? {
                            ...prev,
                            button: { 
                              ...prev.button,
                              text: prev.button?.text || { ko: '', en: '' },
                              url: e.target.value,
                              style: prev.button?.style || 'primary'
                            }
                          } : null)
                        }
                        placeholder="/products"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>버튼 스타일</Label>
                      <Select
                        value={editingBanner.button?.style || 'primary'}
                        onValueChange={(value: any) => 
                          setEditingBanner(prev => prev ? {
                            ...prev,
                            button: { 
                              ...prev.button,
                              text: prev.button?.text || { ko: '', en: '' },
                              url: prev.button?.url || '',
                              style: value
                            }
                          } : null)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="primary">Primary</SelectItem>
                          <SelectItem value="secondary">Secondary</SelectItem>
                          <SelectItem value="outline">Outline</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="display" className="space-y-4">
                <div className="space-y-2">
                  <Label>표시할 페이지</Label>
                  <Textarea
                    value={editingBanner.display_rules.pages.join('\n')}
                    onChange={(e) => 
                      setEditingBanner(prev => prev ? {
                        ...prev,
                        display_rules: { 
                          ...prev.display_rules, 
                          pages: e.target.value.split('\n').filter(page => page.trim()) 
                        }
                      } : null)
                    }
                    placeholder="/&#10;/products&#10;/about"
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">한 줄에 하나씩 입력하세요</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>시작일</Label>
                    <Input
                      type="date"
                      value={editingBanner.display_rules.start_date || ''}
                      onChange={(e) => 
                        setEditingBanner(prev => prev ? {
                          ...prev,
                          display_rules: { ...prev.display_rules, start_date: e.target.value }
                        } : null)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>종료일</Label>
                    <Input
                      type="date"
                      value={editingBanner.display_rules.end_date || ''}
                      onChange={(e) => 
                        setEditingBanner(prev => prev ? {
                          ...prev,
                          display_rules: { ...prev.display_rules, end_date: e.target.value }
                        } : null)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>로그인 사용자에게 표시</Label>
                    <Switch
                      checked={editingBanner.display_rules.show_logged_in}
                      onCheckedChange={(checked) => 
                        setEditingBanner(prev => prev ? {
                          ...prev,
                          display_rules: { ...prev.display_rules, show_logged_in: checked }
                        } : null)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>로그아웃 사용자에게 표시</Label>
                    <Switch
                      checked={editingBanner.display_rules.show_logged_out}
                      onCheckedChange={(checked) => 
                        setEditingBanner(prev => prev ? {
                          ...prev,
                          display_rules: { ...prev.display_rules, show_logged_out: checked }
                        } : null)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>표시 빈도</Label>
                  <Select
                    value={editingBanner.display_rules.frequency}
                    onValueChange={(value: any) => 
                      setEditingBanner(prev => prev ? {
                        ...prev,
                        display_rules: { ...prev.display_rules, frequency: value }
                      } : null)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="always">항상 표시</SelectItem>
                      <SelectItem value="once_per_session">세션당 1회</SelectItem>
                      <SelectItem value="once_per_day">일 1회</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label>활성화</Label>
                  <Switch
                    checked={editingBanner.is_active}
                    onCheckedChange={(checked) => 
                      setEditingBanner(prev => prev ? { ...prev, is_active: checked } : null)
                    }
                  />
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-4">
                <div className="text-center text-muted-foreground py-8">
                  <TrendingUp className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">성과 분석</p>
                  <p className="text-sm">배너가 저장된 후 성과 데이터를 확인할 수 있습니다.</p>
                </div>
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
            >
              취소
            </Button>
            <Button onClick={saveBanner} disabled={saving} className="gap-2">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
              저장
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}