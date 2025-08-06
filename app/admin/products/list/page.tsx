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
import toast from 'react-hot-toast'
import { createClient } from "@/lib/supabase/client"
import { Product, Category } from "@/lib/types/cms"
import { 
  Loader2, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Filter,
  Star,
  Eye,
  Package,
  Image as ImageIcon,
  Tag
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ProductFormData {
  id?: string
  sku: string
  barcode?: string
  name: { ko: string; en: string }
  slug: string
  short_description: { ko: string; en: string }
  description: { ko: string; en: string }
  features: { ko: string[]; en: string[] }
  benefits: { ko: string[]; en: string[] }
  usage: { ko: string; en: string }
  primary_category_id?: string
  category_ids: string[]
  pricing: {
    display_price?: number
    price_text: string
    is_price_visible: boolean
  }
  media: {
    featured_image?: string
    gallery: string[]
    videos: string[]
    documents: string[]
  }
  quality: {
    gmp_certified: boolean
    haccp_certified: boolean
    organic_certified: boolean
    other_certifications: string[]
  }
  inquiry_settings: {
    enable_inquiry: boolean
    inquiry_button_text: string
    show_kakao_chat: boolean
    show_phone_number: boolean
  }
  status: 'draft' | 'published' | 'out_of_stock'
  featured: boolean
  is_new: boolean
  is_best: boolean
}

const defaultProductData: ProductFormData = {
  sku: '',
  name: { ko: '', en: '' },
  slug: '',
  short_description: { ko: '', en: '' },
  description: { ko: '', en: '' },
  features: { ko: [], en: [] },
  benefits: { ko: [], en: [] },
  usage: { ko: '', en: '' },
  category_ids: [],
  pricing: {
    price_text: '문의',
    is_price_visible: true
  },
  media: {
    gallery: [],
    videos: [],
    documents: []
  },
  quality: {
    gmp_certified: false,
    haccp_certified: false,
    organic_certified: false,
    other_certifications: []
  },
  inquiry_settings: {
    enable_inquiry: true,
    inquiry_button_text: '문의하기',
    show_kakao_chat: true,
    show_phone_number: true
  },
  status: 'draft',
  featured: false,
  is_new: false,
  is_best: false
}

export default function ProductsListPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<ProductFormData | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  const supabase = createClient()

  useEffect(() => {
    loadProducts()
    loadCategories()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setProducts(data || [])
    } catch (error: any) {
      console.error('Error loading products:', error)
      toast.error('제품을 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('position')

      if (error) throw error

      setCategories(data || [])
    } catch (error: any) {
      console.error('Error loading categories:', error)
    }
  }

  const saveProduct = async () => {
    if (!editingProduct) return

    try {
      setSaving(true)

      const productData = {
        sku: editingProduct.sku,
        barcode: editingProduct.barcode,
        name: editingProduct.name,
        slug: editingProduct.slug,
        short_description: editingProduct.short_description,
        description: editingProduct.description,
        features: editingProduct.features,
        benefits: editingProduct.benefits,
        usage: editingProduct.usage,
        primary_category_id: editingProduct.primary_category_id,
        category_ids: editingProduct.category_ids,
        pricing: editingProduct.pricing,
        media: editingProduct.media,
        quality: editingProduct.quality,
        inquiry_settings: editingProduct.inquiry_settings,
        status: editingProduct.status,
        featured: editingProduct.featured,
        is_new: editingProduct.is_new,
        is_best: editingProduct.is_best,
        seo: {},
        related_products: {
          cross_sells: [],
          up_sells: [],
          frequently_bought: []
        },
        stats: {
          view_count: 0,
          inquiry_count: 0,
          brochure_download_count: 0
        },
        custom_fields: {},
        updated_at: new Date().toISOString()
      }

      if (editingProduct.id) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('products')
          .insert({
            ...productData,
            created_at: new Date().toISOString()
          })

        if (error) throw error
      }

      toast.success('제품이 저장되었습니다.')

      setDialogOpen(false)
      setEditingProduct(null)
      loadProducts()
    } catch (error: any) {
      console.error('Error saving product:', error)
      toast.error('제품 저장에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  const deleteProduct = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast.success('제품이 삭제되었습니다.')

      loadProducts()
    } catch (error: any) {
      console.error('Error deleting product:', error)
      toast.error('제품 삭제에 실패했습니다.')
    }
  }

  const toggleProductStatus = async (product: Product, newStatus: string) => {
    try {
      const updateData: any = {
        status: newStatus,
        updated_at: new Date().toISOString()
      }

      if (newStatus === 'published' && !product.published_at) {
        updateData.published_at = new Date().toISOString()
      }

      const { error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', product.id)

      if (error) throw error

      toast.success(`제품 상태가 ${newStatus}(으)로 변경되었습니다.`)

      loadProducts()
    } catch (error: any) {
      console.error('Error updating product status:', error)
      toast.error('제품 상태 변경에 실패했습니다.')
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct({
      id: product.id,
      sku: product.sku,
      barcode: product.barcode || '',
      name: product.name as { ko: string; en: string },
      slug: product.slug,
      short_description: (product.short_description as any) || { ko: '', en: '' },
      description: (product.description as any) || { ko: '', en: '' },
      features: (product.features as any) || { ko: [], en: [] },
      benefits: (product.benefits as any) || { ko: [], en: [] },
      usage: (product.usage as any) || { ko: '', en: '' },
      primary_category_id: product.primary_category_id || undefined,
      category_ids: product.category_ids,
      pricing: product.pricing as any,
      media: product.media as any,
      quality: product.quality as any,
      inquiry_settings: product.inquiry_settings as any,
      status: product.status as any,
      featured: product.featured,
      is_new: product.is_new,
      is_best: product.is_best
    })
    setDialogOpen(true)
  }

  const handleAdd = () => {
    setEditingProduct(defaultProductData)
    setDialogOpen(true)
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: { variant: 'secondary' as const, label: '초안' },
      published: { variant: 'default' as const, label: '게시됨' },
      out_of_stock: { variant: 'destructive' as const, label: '품절' }
    }
    const config = variants[status as keyof typeof variants] || variants.draft
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId)
    return category ? (category.name as any).ko : '미분류'
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = (product.name as any)?.ko?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || product.category_ids.includes(categoryFilter)
    return matchesSearch && matchesStatus && matchesCategory
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">제품을 불러오는 중...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">제품 관리</h1>
          <p className="text-muted-foreground">
            제품 정보를 생성하고 관리합니다.
          </p>
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          제품 추가
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            제품 목록
          </CardTitle>
          <CardDescription>
            등록된 제품들을 확인하고 편집할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 max-w-sm">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="제품 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 상태</SelectItem>
                <SelectItem value="draft">초안</SelectItem>
                <SelectItem value="published">게시됨</SelectItem>
                <SelectItem value="out_of_stock">품절</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 카테고리</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {(category.name as any).ko}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>제품</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>카테고리</TableHead>
                <TableHead>가격</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>특성</TableHead>
                <TableHead className="text-right">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    제품이 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                          {(product.media as any)?.featured_image ? (
                            <img
                              src={(product.media as any).featured_image}
                              alt={(product.name as any).ko}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <ImageIcon className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{(product.name as any)?.ko}</div>
                          <div className="text-sm text-muted-foreground">
                            {(product.name as any)?.en}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="bg-muted px-2 py-1 rounded text-sm">
                        {product.sku}
                      </code>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {product.category_ids.slice(0, 2).map(categoryId => (
                          <Badge key={categoryId} variant="outline" className="text-xs">
                            {getCategoryName(categoryId)}
                          </Badge>
                        ))}
                        {product.category_ids.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{product.category_ids.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>{(product.pricing as any)?.price_text}</div>
                      {(product.pricing as any)?.display_price && (
                        <div className="text-sm text-muted-foreground">
                          {(product.pricing as any).display_price.toLocaleString()}원
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(product.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {product.featured && (
                          <Badge variant="secondary" className="text-xs">
                            <Star className="h-3 w-3 mr-1" />
                            추천
                          </Badge>
                        )}
                        {product.is_new && (
                          <Badge variant="outline" className="text-xs">NEW</Badge>
                        )}
                        {product.is_best && (
                          <Badge variant="outline" className="text-xs">BEST</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {product.status === 'published' ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleProductStatus(product, 'draft')}
                            title="비공개로 변경"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleProductStatus(product, 'published')}
                            title="게시"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteProduct(product.id)}
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
              {editingProduct?.id ? '제품 편집' : '새 제품 추가'}
            </DialogTitle>
            <DialogDescription>
              제품 정보를 입력하세요.
            </DialogDescription>
          </DialogHeader>

          {editingProduct && (
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="basic">기본 정보</TabsTrigger>
                <TabsTrigger value="content">상세 내용</TabsTrigger>
                <TabsTrigger value="media">미디어</TabsTrigger>
                <TabsTrigger value="settings">설정</TabsTrigger>
                <TabsTrigger value="quality">품질 인증</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>SKU</Label>
                    <Input
                      value={editingProduct.sku}
                      onChange={(e) => 
                        setEditingProduct(prev => prev ? { ...prev, sku: e.target.value } : null)
                      }
                      placeholder="PRD-001"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>바코드</Label>
                    <Input
                      value={editingProduct.barcode}
                      onChange={(e) => 
                        setEditingProduct(prev => prev ? { ...prev, barcode: e.target.value } : null)
                      }
                      placeholder="1234567890123"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>제품명 (한국어)</Label>
                    <Input
                      value={editingProduct.name.ko}
                      onChange={(e) => 
                        setEditingProduct(prev => prev ? {
                          ...prev,
                          name: { ...prev.name, ko: e.target.value }
                        } : null)
                      }
                      placeholder="제품명"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>제품명 (영어)</Label>
                    <Input
                      value={editingProduct.name.en}
                      onChange={(e) => 
                        setEditingProduct(prev => prev ? {
                          ...prev,
                          name: { ...prev.name, en: e.target.value }
                        } : null)
                      }
                      placeholder="Product Name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>슬러그</Label>
                  <Input
                    value={editingProduct.slug}
                    onChange={(e) => 
                      setEditingProduct(prev => prev ? { ...prev, slug: e.target.value } : null)
                    }
                    placeholder="product-name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>주 카테고리</Label>
                    <Select
                      value={editingProduct.primary_category_id}
                      onValueChange={(value) => 
                        setEditingProduct(prev => prev ? { 
                          ...prev, 
                          primary_category_id: value 
                        } : null)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="카테고리 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            {(category.name as any).ko}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>상태</Label>
                    <Select
                      value={editingProduct.status}
                      onValueChange={(value: any) => 
                        setEditingProduct(prev => prev ? { ...prev, status: value } : null)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">초안</SelectItem>
                        <SelectItem value="published">게시됨</SelectItem>
                        <SelectItem value="out_of_stock">품절</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>가격 텍스트</Label>
                    <Input
                      value={editingProduct.pricing.price_text}
                      onChange={(e) => 
                        setEditingProduct(prev => prev ? {
                          ...prev,
                          pricing: { ...prev.pricing, price_text: e.target.value }
                        } : null)
                      }
                      placeholder="문의, 별도 협의 등"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>표시 가격</Label>
                    <Input
                      type="number"
                      value={editingProduct.pricing.display_price || ''}
                      onChange={(e) => 
                        setEditingProduct(prev => prev ? {
                          ...prev,
                          pricing: { ...prev.pricing, display_price: e.target.value ? Number(e.target.value) : undefined }
                        } : null)
                      }
                      placeholder="100000"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>추천 제품</Label>
                    <Switch
                      checked={editingProduct.featured}
                      onCheckedChange={(checked) => 
                        setEditingProduct(prev => prev ? { ...prev, featured: checked } : null)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>신제품</Label>
                    <Switch
                      checked={editingProduct.is_new}
                      onCheckedChange={(checked) => 
                        setEditingProduct(prev => prev ? { ...prev, is_new: checked } : null)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>베스트 제품</Label>
                    <Switch
                      checked={editingProduct.is_best}
                      onCheckedChange={(checked) => 
                        setEditingProduct(prev => prev ? { ...prev, is_best: checked } : null)
                      }
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="content" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>짧은 설명 (한국어)</Label>
                    <Textarea
                      value={editingProduct.short_description.ko}
                      onChange={(e) => 
                        setEditingProduct(prev => prev ? {
                          ...prev,
                          short_description: { ...prev.short_description, ko: e.target.value }
                        } : null)
                      }
                      placeholder="간단한 제품 설명"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>짧은 설명 (영어)</Label>
                    <Textarea
                      value={editingProduct.short_description.en}
                      onChange={(e) => 
                        setEditingProduct(prev => prev ? {
                          ...prev,
                          short_description: { ...prev.short_description, en: e.target.value }
                        } : null)
                      }
                      placeholder="Brief product description"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>상세 설명 (한국어)</Label>
                    <Textarea
                      value={editingProduct.description.ko}
                      onChange={(e) => 
                        setEditingProduct(prev => prev ? {
                          ...prev,
                          description: { ...prev.description, ko: e.target.value }
                        } : null)
                      }
                      placeholder="자세한 제품 설명"
                      rows={5}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>상세 설명 (영어)</Label>
                    <Textarea
                      value={editingProduct.description.en}
                      onChange={(e) => 
                        setEditingProduct(prev => prev ? {
                          ...prev,
                          description: { ...prev.description, en: e.target.value }
                        } : null)
                      }
                      placeholder="Detailed product description"
                      rows={5}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>주요 기능 (한국어)</Label>
                    <Textarea
                      value={editingProduct.features.ko.join('\n')}
                      onChange={(e) => 
                        setEditingProduct(prev => prev ? {
                          ...prev,
                          features: { ...prev.features, ko: e.target.value.split('\n').filter(f => f.trim()) }
                        } : null)
                      }
                      placeholder="기능1\n기능2\n기능3"
                      rows={4}
                    />
                    <p className="text-xs text-muted-foreground">한 줄에 하나씩 입력하세요</p>
                  </div>
                  <div className="space-y-2">
                    <Label>주요 기능 (영어)</Label>
                    <Textarea
                      value={editingProduct.features.en.join('\n')}
                      onChange={(e) => 
                        setEditingProduct(prev => prev ? {
                          ...prev,
                          features: { ...prev.features, en: e.target.value.split('\n').filter(f => f.trim()) }
                        } : null)
                      }
                      placeholder="Feature1\nFeature2\nFeature3"
                      rows={4}
                    />
                    <p className="text-xs text-muted-foreground">한 줄에 하나씩 입력하세요</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="media" className="space-y-4">
                <div className="space-y-2">
                  <Label>대표 이미지</Label>
                  <Input
                    value={editingProduct.media.featured_image || ''}
                    onChange={(e) => 
                      setEditingProduct(prev => prev ? {
                        ...prev,
                        media: { ...prev.media, featured_image: e.target.value }
                      } : null)
                    }
                    placeholder="이미지 URL"
                  />
                </div>

                <div className="space-y-2">
                  <Label>갤러리 이미지</Label>
                  <Textarea
                    value={editingProduct.media.gallery.join('\n')}
                    onChange={(e) => 
                      setEditingProduct(prev => prev ? {
                        ...prev,
                        media: { ...prev.media, gallery: e.target.value.split('\n').filter(url => url.trim()) }
                      } : null)
                    }
                    placeholder="이미지 URL1\n이미지 URL2\n이미지 URL3"
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">한 줄에 하나씩 입력하세요</p>
                </div>

                <div className="space-y-2">
                  <Label>동영상</Label>
                  <Textarea
                    value={editingProduct.media.videos.join('\n')}
                    onChange={(e) => 
                      setEditingProduct(prev => prev ? {
                        ...prev,
                        media: { ...prev.media, videos: e.target.value.split('\n').filter(url => url.trim()) }
                      } : null)
                    }
                    placeholder="비디오 URL1\n비디오 URL2"
                    rows={3}
                  />
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">문의 설정</h3>
                  <div className="flex items-center justify-between">
                    <Label>문의 활성화</Label>
                    <Switch
                      checked={editingProduct.inquiry_settings.enable_inquiry}
                      onCheckedChange={(checked) => 
                        setEditingProduct(prev => prev ? {
                          ...prev,
                          inquiry_settings: { ...prev.inquiry_settings, enable_inquiry: checked }
                        } : null)
                      }
                    />
                  </div>
                  
                  {editingProduct.inquiry_settings.enable_inquiry && (
                    <>
                      <div className="space-y-2">
                        <Label>문의 버튼 텍스트</Label>
                        <Input
                          value={editingProduct.inquiry_settings.inquiry_button_text}
                          onChange={(e) => 
                            setEditingProduct(prev => prev ? {
                              ...prev,
                              inquiry_settings: { ...prev.inquiry_settings, inquiry_button_text: e.target.value }
                            } : null)
                          }
                          placeholder="문의하기"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label>카카오톡 채팅 표시</Label>
                        <Switch
                          checked={editingProduct.inquiry_settings.show_kakao_chat}
                          onCheckedChange={(checked) => 
                            setEditingProduct(prev => prev ? {
                              ...prev,
                              inquiry_settings: { ...prev.inquiry_settings, show_kakao_chat: checked }
                            } : null)
                          }
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label>전화번호 표시</Label>
                        <Switch
                          checked={editingProduct.inquiry_settings.show_phone_number}
                          onCheckedChange={(checked) => 
                            setEditingProduct(prev => prev ? {
                              ...prev,
                              inquiry_settings: { ...prev.inquiry_settings, show_phone_number: checked }
                            } : null)
                          }
                        />
                      </div>
                    </>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="quality" className="space-y-4">
                <h3 className="text-lg font-semibold">품질 인증</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>GMP 인증</Label>
                    <Switch
                      checked={editingProduct.quality.gmp_certified}
                      onCheckedChange={(checked) => 
                        setEditingProduct(prev => prev ? {
                          ...prev,
                          quality: { ...prev.quality, gmp_certified: checked }
                        } : null)
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label>HACCP 인증</Label>
                    <Switch
                      checked={editingProduct.quality.haccp_certified}
                      onCheckedChange={(checked) => 
                        setEditingProduct(prev => prev ? {
                          ...prev,
                          quality: { ...prev.quality, haccp_certified: checked }
                        } : null)
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label>유기농 인증</Label>
                    <Switch
                      checked={editingProduct.quality.organic_certified}
                      onCheckedChange={(checked) => 
                        setEditingProduct(prev => prev ? {
                          ...prev,
                          quality: { ...prev.quality, organic_certified: checked }
                        } : null)
                      }
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>기타 인증</Label>
                    <Textarea
                      value={editingProduct.quality.other_certifications.join('\n')}
                      onChange={(e) => 
                        setEditingProduct(prev => prev ? {
                          ...prev,
                          quality: { ...prev.quality, other_certifications: e.target.value.split('\n').filter(cert => cert.trim()) }
                        } : null)
                      }
                      placeholder="ISO 9001\nFDA 승인\n기타 인증"
                      rows={3}
                    />
                  </div>
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
            <Button onClick={saveProduct} disabled={saving} className="gap-2">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Package className="h-4 w-4" />}
              저장
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}