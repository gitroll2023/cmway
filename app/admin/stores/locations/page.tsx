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
import { createClient } from "@/lib/supabase/client"
import { StoreLocation } from "@/lib/types/cms"
import { 
  Loader2, 
  Plus, 
  Edit, 
  Trash2, 
  MapPin,
  Phone,
  Clock,
  Car,
  Wifi,
  Accessibility,
  Train,
  Building,
  Warehouse,
  Home,
  Eye
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface StoreLocationFormData {
  id?: string
  name: { ko: string; en: string }
  type: 'headquarters' | 'branch' | 'warehouse' | 'showroom'
  address: { ko: string; en: string }
  postal_code?: string
  coordinates?: {
    latitude: number
    longitude: number
  }
  contact: {
    phone?: string
    fax?: string
    email?: string
  }
  hours: {
    monday?: { open: string; close: string; closed?: boolean }
    tuesday?: { open: string; close: string; closed?: boolean }
    wednesday?: { open: string; close: string; closed?: boolean }
    thursday?: { open: string; close: string; closed?: boolean }
    friday?: { open: string; close: string; closed?: boolean }
    saturday?: { open: string; close: string; closed?: boolean }
    sunday?: { open: string; close: string; closed?: boolean }
  }
  services: string[]
  features: {
    parking: boolean
    wheelchair_accessible: boolean
    public_transport: boolean
    wifi: boolean
  }
  images: string[]
  description: { ko: string; en: string }
  manager?: {
    name: string
    phone?: string
    email?: string
  }
  is_active: boolean
}

const defaultLocationData: StoreLocationFormData = {
  name: { ko: '', en: '' },
  type: 'branch',
  address: { ko: '', en: '' },
  contact: {},
  hours: {},
  services: [],
  features: {
    parking: false,
    wheelchair_accessible: false,
    public_transport: false,
    wifi: false
  },
  images: [],
  description: { ko: '', en: '' },
  is_active: true
}

const daysOfWeek = [
  { key: 'monday', label: '월요일' },
  { key: 'tuesday', label: '화요일' },
  { key: 'wednesday', label: '수요일' },
  { key: 'thursday', label: '목요일' },
  { key: 'friday', label: '금요일' },
  { key: 'saturday', label: '토요일' },
  { key: 'sunday', label: '일요일' }
]

export default function StoreLocationsPage() {
  const [locations, setLocations] = useState<StoreLocation[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingLocation, setEditingLocation] = useState<StoreLocationFormData | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  const supabase = createClient()

  useEffect(() => {
    loadLocations()
  }, [])

  const loadLocations = async () => {
    try {
      setLoading(true)
      // 실제 구현에서는 store_locations 테이블에서 데이터를 가져옵니다
      // 여기서는 목업 데이터로 시연합니다
      const mockLocations: StoreLocation[] = [
        {
          id: '1',
          name: { ko: '본사', en: 'Headquarters' },
          type: 'headquarters',
          address: { 
            ko: '서울특별시 강남구 테헤란로 123',
            en: '123 Teheran-ro, Gangnam-gu, Seoul'
          },
          postal_code: '06142',
          coordinates: {
            latitude: 37.5074,
            longitude: 127.0596
          },
          contact: {
            phone: '02-1234-5678',
            fax: '02-1234-5679',
            email: 'headquarters@company.com'
          },
          hours: {
            monday: { open: '09:00', close: '18:00' },
            tuesday: { open: '09:00', close: '18:00' },
            wednesday: { open: '09:00', close: '18:00' },
            thursday: { open: '09:00', close: '18:00' },
            friday: { open: '09:00', close: '18:00' },
            saturday: { closed: true },
            sunday: { closed: true }
          },
          services: ['상담', '제품 전시', '고객 지원'],
          features: {
            parking: true,
            wheelchair_accessible: true,
            public_transport: true,
            wifi: true
          },
          images: ['/images/store-headquarters-1.jpg', '/images/store-headquarters-2.jpg'],
          description: { 
            ko: '회사의 본사로 모든 업무가 이루어지는 중심 공간입니다.',
            en: 'Company headquarters where all business operations are conducted.'
          },
          manager: {
            name: '김대표',
            phone: '010-1234-5678',
            email: 'manager@company.com'
          },
          is_active: true,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-15T00:00:00Z'
        },
        {
          id: '2',
          name: { ko: '부산 지점', en: 'Busan Branch' },
          type: 'branch',
          address: { 
            ko: '부산광역시 해운대구 센텀중앙로 456',
            en: '456 Centum jungang-ro, Haeundae-gu, Busan'
          },
          postal_code: '48058',
          contact: {
            phone: '051-987-6543',
            email: 'busan@company.com'
          },
          hours: {
            monday: { open: '09:00', close: '18:00' },
            tuesday: { open: '09:00', close: '18:00' },
            wednesday: { open: '09:00', close: '18:00' },
            thursday: { open: '09:00', close: '18:00' },
            friday: { open: '09:00', close: '18:00' },
            saturday: { open: '10:00', close: '15:00' },
            sunday: { closed: true }
          },
          services: ['제품 상담', 'A/S'],
          features: {
            parking: true,
            wheelchair_accessible: false,
            public_transport: true,
            wifi: true
          },
          images: ['/images/store-busan-1.jpg'],
          description: { 
            ko: '부산 지역 고객을 위한 지점입니다.',
            en: 'Branch office serving customers in Busan area.'
          },
          is_active: true,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-10T00:00:00Z'
        }
      ]
      setLocations(mockLocations)
    } catch (error: any) {
      console.error('Error loading locations:', error)
      toast({
        title: "오류",
        description: "매장 정보를 불러오는데 실패했습니다.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const saveLocation = async () => {
    if (!editingLocation) return

    try {
      setSaving(true)

      const locationData = {
        name: editingLocation.name,
        type: editingLocation.type,
        address: editingLocation.address,
        postal_code: editingLocation.postal_code,
        coordinates: editingLocation.coordinates,
        contact: editingLocation.contact,
        hours: editingLocation.hours,
        services: editingLocation.services,
        features: editingLocation.features,
        images: editingLocation.images,
        description: editingLocation.description,
        manager: editingLocation.manager,
        is_active: editingLocation.is_active,
        updated_at: new Date().toISOString()
      }

      // 실제 구현에서는 Supabase에 저장
      // const { error } = await supabase.from('store_locations').upsert(locationData)
      // if (error) throw error

      toast({
        title: "성공",
        description: "매장 정보가 저장되었습니다."
      })

      setDialogOpen(false)
      setEditingLocation(null)
      loadLocations()
    } catch (error: any) {
      console.error('Error saving location:', error)
      toast({
        title: "오류",
        description: "매장 정보 저장에 실패했습니다.",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const deleteLocation = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return

    try {
      // 실제 구현에서는 Supabase에서 삭제
      // const { error } = await supabase.from('store_locations').delete().eq('id', id)
      // if (error) throw error

      toast({
        title: "성공",
        description: "매장 정보가 삭제되었습니다."
      })

      loadLocations()
    } catch (error: any) {
      console.error('Error deleting location:', error)
      toast({
        title: "오류",
        description: "매장 정보 삭제에 실패했습니다.",
        variant: "destructive"
      })
    }
  }

  const toggleLocationStatus = async (location: StoreLocation, isActive: boolean) => {
    try {
      // 실제 구현에서는 Supabase 업데이트
      // const { error } = await supabase.from('store_locations').update({ is_active: isActive }).eq('id', location.id)
      // if (error) throw error

      toast({
        title: "성공",
        description: `매장이 ${isActive ? '활성화' : '비활성화'}되었습니다.`
      })

      loadLocations()
    } catch (error: any) {
      console.error('Error updating location status:', error)
      toast({
        title: "오류",
        description: "매장 상태 변경에 실패했습니다.",
        variant: "destructive"
      })
    }
  }

  const handleEdit = (location: StoreLocation) => {
    setEditingLocation({
      id: location.id,
      name: location.name as { ko: string; en: string },
      type: location.type,
      address: location.address as { ko: string; en: string },
      postal_code: location.postal_code,
      coordinates: location.coordinates,
      contact: location.contact,
      hours: location.hours,
      services: location.services,
      features: location.features,
      images: location.images,
      description: (location.description as { ko: string; en: string }) || { ko: '', en: '' },
      manager: location.manager,
      is_active: location.is_active
    })
    setDialogOpen(true)
  }

  const handleAdd = () => {
    setEditingLocation(defaultLocationData)
    setDialogOpen(true)
  }

  const getTypeBadge = (type: string) => {
    const variants = {
      headquarters: { variant: 'default' as const, label: '본사', icon: Building },
      branch: { variant: 'secondary' as const, label: '지점', icon: Home },
      warehouse: { variant: 'outline' as const, label: '창고', icon: Warehouse },
      showroom: { variant: 'destructive' as const, label: '전시장', icon: Eye }
    }
    const config = variants[type as keyof typeof variants] || variants.branch
    const Icon = config.icon
    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const getOpenStatus = (hours: any) => {
    const now = new Date()
    const day = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][now.getDay()]
    const currentHour = hours[day]
    
    if (!currentHour || currentHour.closed) {
      return <Badge variant="outline">휴무</Badge>
    }

    const currentTime = now.getHours() * 100 + now.getMinutes()
    const openTime = parseInt(currentHour.open.replace(':', ''))
    const closeTime = parseInt(currentHour.close.replace(':', ''))

    if (currentTime >= openTime && currentTime < closeTime) {
      return <Badge variant="default">영업중</Badge>
    } else {
      return <Badge variant="secondary">영업종료</Badge>
    }
  }

  const filteredLocations = locations.filter(location => {
    const matchesSearch = (location.name as any)?.ko?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (location.address as any)?.ko?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'all' || location.type === typeFilter
    return matchesSearch && matchesType
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">매장 정보를 불러오는 중...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">매장 관리</h1>
          <p className="text-muted-foreground">
            매장 및 지점 정보를 관리합니다.
          </p>
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          매장 추가
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            매장 목록
          </CardTitle>
          <CardDescription>
            등록된 매장들을 확인하고 편집할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 max-w-sm">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="매장 검색..."
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
                <SelectItem value="headquarters">본사</SelectItem>
                <SelectItem value="branch">지점</SelectItem>
                <SelectItem value="warehouse">창고</SelectItem>
                <SelectItem value="showroom">전시장</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>매장</TableHead>
                <TableHead>주소</TableHead>
                <TableHead>연락처</TableHead>
                <TableHead>운영시간</TableHead>
                <TableHead>편의시설</TableHead>
                <TableHead>상태</TableHead>
                <TableHead className="text-right">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLocations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    매장이 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                filteredLocations.map((location) => (
                  <TableRow key={location.id}>
                    <TableCell>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{(location.name as any).ko}</span>
                          {getTypeBadge(location.type)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {(location.name as any).en}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{(location.address as any).ko}</div>
                        {location.postal_code && (
                          <div className="text-muted-foreground">우편번호: {location.postal_code}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {location.contact.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {location.contact.phone}
                          </div>
                        )}
                        {location.contact.email && (
                          <div className="text-muted-foreground">
                            {location.contact.email}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {getOpenStatus(location.hours)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {location.features.parking && <Car className="h-4 w-4 text-green-600" />}
                        {location.features.wheelchair_accessible && <Accessibility className="h-4 w-4 text-blue-600" />}
                        {location.features.public_transport && <Train className="h-4 w-4 text-purple-600" />}
                        {location.features.wifi && <Wifi className="h-4 w-4 text-orange-600" />}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={location.is_active}
                          onCheckedChange={(checked) => toggleLocationStatus(location, checked)}
                          size="sm"
                        />
                        <span className="text-xs text-muted-foreground">
                          {location.is_active ? '활성' : '비활성'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(location)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteLocation(location.id)}
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
              {editingLocation?.id ? '매장 정보 편집' : '새 매장 추가'}
            </DialogTitle>
            <DialogDescription>
              매장 정보를 입력하세요.
            </DialogDescription>
          </DialogHeader>

          {editingLocation && (
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">기본 정보</TabsTrigger>
                <TabsTrigger value="hours">운영시간</TabsTrigger>
                <TabsTrigger value="features">편의시설</TabsTrigger>
                <TabsTrigger value="manager">담당자</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>매장명 (한국어)</Label>
                    <Input
                      value={editingLocation.name.ko}
                      onChange={(e) => 
                        setEditingLocation(prev => prev ? {
                          ...prev,
                          name: { ...prev.name, ko: e.target.value }
                        } : null)
                      }
                      placeholder="매장명"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>매장명 (영어)</Label>
                    <Input
                      value={editingLocation.name.en}
                      onChange={(e) => 
                        setEditingLocation(prev => prev ? {
                          ...prev,
                          name: { ...prev.name, en: e.target.value }
                        } : null)
                      }
                      placeholder="Store Name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>매장 유형</Label>
                  <Select
                    value={editingLocation.type}
                    onValueChange={(value: any) => 
                      setEditingLocation(prev => prev ? { ...prev, type: value } : null)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="headquarters">본사</SelectItem>
                      <SelectItem value="branch">지점</SelectItem>
                      <SelectItem value="warehouse">창고</SelectItem>
                      <SelectItem value="showroom">전시장</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>주소 (한국어)</Label>
                    <Textarea
                      value={editingLocation.address.ko}
                      onChange={(e) => 
                        setEditingLocation(prev => prev ? {
                          ...prev,
                          address: { ...prev.address, ko: e.target.value }
                        } : null)
                      }
                      placeholder="서울특별시 강남구 테헤란로 123"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>주소 (영어)</Label>
                    <Textarea
                      value={editingLocation.address.en}
                      onChange={(e) => 
                        setEditingLocation(prev => prev ? {
                          ...prev,
                          address: { ...prev.address, en: e.target.value }
                        } : null)
                      }
                      placeholder="123 Teheran-ro, Gangnam-gu, Seoul"
                      rows={2}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>우편번호</Label>
                  <Input
                    value={editingLocation.postal_code || ''}
                    onChange={(e) => 
                      setEditingLocation(prev => prev ? { ...prev, postal_code: e.target.value } : null)
                    }
                    placeholder="06142"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>위도</Label>
                    <Input
                      type="number"
                      step="any"
                      value={editingLocation.coordinates?.latitude || ''}
                      onChange={(e) => 
                        setEditingLocation(prev => prev ? {
                          ...prev,
                          coordinates: {
                            ...prev.coordinates,
                            latitude: Number(e.target.value),
                            longitude: prev.coordinates?.longitude || 0
                          }
                        } : null)
                      }
                      placeholder="37.5074"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>경도</Label>
                    <Input
                      type="number"
                      step="any"
                      value={editingLocation.coordinates?.longitude || ''}
                      onChange={(e) => 
                        setEditingLocation(prev => prev ? {
                          ...prev,
                          coordinates: {
                            ...prev.coordinates,
                            latitude: prev.coordinates?.latitude || 0,
                            longitude: Number(e.target.value)
                          }
                        } : null)
                      }
                      placeholder="127.0596"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>전화번호</Label>
                    <Input
                      value={editingLocation.contact.phone || ''}
                      onChange={(e) => 
                        setEditingLocation(prev => prev ? {
                          ...prev,
                          contact: { ...prev.contact, phone: e.target.value }
                        } : null)
                      }
                      placeholder="02-1234-5678"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>팩스</Label>
                    <Input
                      value={editingLocation.contact.fax || ''}
                      onChange={(e) => 
                        setEditingLocation(prev => prev ? {
                          ...prev,
                          contact: { ...prev.contact, fax: e.target.value }
                        } : null)
                      }
                      placeholder="02-1234-5679"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>이메일</Label>
                    <Input
                      type="email"
                      value={editingLocation.contact.email || ''}
                      onChange={(e) => 
                        setEditingLocation(prev => prev ? {
                          ...prev,
                          contact: { ...prev.contact, email: e.target.value }
                        } : null)
                      }
                      placeholder="store@company.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>설명 (한국어)</Label>
                    <Textarea
                      value={editingLocation.description.ko}
                      onChange={(e) => 
                        setEditingLocation(prev => prev ? {
                          ...prev,
                          description: { ...prev.description, ko: e.target.value }
                        } : null)
                      }
                      placeholder="매장에 대한 설명"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>설명 (영어)</Label>
                    <Textarea
                      value={editingLocation.description.en}
                      onChange={(e) => 
                        setEditingLocation(prev => prev ? {
                          ...prev,
                          description: { ...prev.description, en: e.target.value }
                        } : null)
                      }
                      placeholder="Store description"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>제공 서비스</Label>
                  <Textarea
                    value={editingLocation.services.join('\n')}
                    onChange={(e) => 
                      setEditingLocation(prev => prev ? {
                        ...prev,
                        services: e.target.value.split('\n').filter(s => s.trim())
                      } : null)
                    }
                    placeholder="상담\n제품 전시\n고객 지원"
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">한 줄에 하나씩 입력하세요</p>
                </div>
              </TabsContent>

              <TabsContent value="hours" className="space-y-4">
                <h3 className="text-lg font-semibold">운영시간 설정</h3>
                {daysOfWeek.map(day => (
                  <div key={day.key} className="flex items-center gap-4">
                    <div className="w-20">
                      <Label>{day.label}</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={!editingLocation.hours[day.key as keyof typeof editingLocation.hours]?.closed}
                        onCheckedChange={(checked) => 
                          setEditingLocation(prev => prev ? {
                            ...prev,
                            hours: {
                              ...prev.hours,
                              [day.key]: checked ? 
                                { open: '09:00', close: '18:00' } : 
                                { closed: true }
                            }
                          } : null)
                        }
                      />
                      <span className="text-sm">영업</span>
                    </div>
                    {!editingLocation.hours[day.key as keyof typeof editingLocation.hours]?.closed && (
                      <>
                        <Input
                          type="time"
                          value={editingLocation.hours[day.key as keyof typeof editingLocation.hours]?.open || '09:00'}
                          onChange={(e) => 
                            setEditingLocation(prev => prev ? {
                              ...prev,
                              hours: {
                                ...prev.hours,
                                [day.key]: {
                                  ...prev.hours[day.key as keyof typeof prev.hours],
                                  open: e.target.value
                                }
                              }
                            } : null)
                          }
                          className="w-32"
                        />
                        <span>~</span>
                        <Input
                          type="time"
                          value={editingLocation.hours[day.key as keyof typeof editingLocation.hours]?.close || '18:00'}
                          onChange={(e) => 
                            setEditingLocation(prev => prev ? {
                              ...prev,
                              hours: {
                                ...prev.hours,
                                [day.key]: {
                                  ...prev.hours[day.key as keyof typeof prev.hours],
                                  close: e.target.value
                                }
                              }
                            } : null)
                          }
                          className="w-32"
                        />
                      </>
                    )}
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="features" className="space-y-4">
                <h3 className="text-lg font-semibold">편의시설</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Car className="h-4 w-4" />
                      주차 가능
                    </Label>
                    <Switch
                      checked={editingLocation.features.parking}
                      onCheckedChange={(checked) => 
                        setEditingLocation(prev => prev ? {
                          ...prev,
                          features: { ...prev.features, parking: checked }
                        } : null)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Accessibility className="h-4 w-4" />
                      휠체어 접근 가능
                    </Label>
                    <Switch
                      checked={editingLocation.features.wheelchair_accessible}
                      onCheckedChange={(checked) => 
                        setEditingLocation(prev => prev ? {
                          ...prev,
                          features: { ...prev.features, wheelchair_accessible: checked }
                        } : null)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Train className="h-4 w-4" />
                      대중교통 접근 가능
                    </Label>
                    <Switch
                      checked={editingLocation.features.public_transport}
                      onCheckedChange={(checked) => 
                        setEditingLocation(prev => prev ? {
                          ...prev,
                          features: { ...prev.features, public_transport: checked }
                        } : null)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Wifi className="h-4 w-4" />
                      Wi-Fi 제공
                    </Label>
                    <Switch
                      checked={editingLocation.features.wifi}
                      onCheckedChange={(checked) => 
                        setEditingLocation(prev => prev ? {
                          ...prev,
                          features: { ...prev.features, wifi: checked }
                        } : null)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2 border-t pt-4">
                  <Label>매장 이미지</Label>
                  <Textarea
                    value={editingLocation.images.join('\n')}
                    onChange={(e) => 
                      setEditingLocation(prev => prev ? {
                        ...prev,
                        images: e.target.value.split('\n').filter(url => url.trim())
                      } : null)
                    }
                    placeholder="이미지 URL1\n이미지 URL2"
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">한 줄에 하나씩 입력하세요</p>
                </div>
              </TabsContent>

              <TabsContent value="manager" className="space-y-4">
                <h3 className="text-lg font-semibold">담당자 정보</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>담당자명</Label>
                    <Input
                      value={editingLocation.manager?.name || ''}
                      onChange={(e) => 
                        setEditingLocation(prev => prev ? {
                          ...prev,
                          manager: { ...prev.manager, name: e.target.value }
                        } : null)
                      }
                      placeholder="홍길동"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>휴대폰 번호</Label>
                    <Input
                      value={editingLocation.manager?.phone || ''}
                      onChange={(e) => 
                        setEditingLocation(prev => prev ? {
                          ...prev,
                          manager: { ...prev.manager, phone: e.target.value }
                        } : null)
                      }
                      placeholder="010-1234-5678"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>이메일</Label>
                    <Input
                      type="email"
                      value={editingLocation.manager?.email || ''}
                      onChange={(e) => 
                        setEditingLocation(prev => prev ? {
                          ...prev,
                          manager: { ...prev.manager, email: e.target.value }
                        } : null)
                      }
                      placeholder="manager@company.com"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between border-t pt-4">
                  <Label>활성화</Label>
                  <Switch
                    checked={editingLocation.is_active}
                    onCheckedChange={(checked) => 
                      setEditingLocation(prev => prev ? { ...prev, is_active: checked } : null)
                    }
                  />
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
            <Button onClick={saveLocation} disabled={saving} className="gap-2">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
              저장
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}