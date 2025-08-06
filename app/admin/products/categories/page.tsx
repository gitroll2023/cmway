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
import { toast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"
import { Category } from "@/lib/types/cms"
import { 
  Loader2, 
  Plus, 
  Edit, 
  Trash2, 
  GripVertical,
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
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

interface CategoryFormData {
  id?: string
  parent_id?: string
  name: { ko: string; en: string }
  slug: string
  description: { ko: string; en: string }
  thumbnail?: string
  banner_image?: string
  icon?: string
  display_settings: {
    show_in_menu: boolean
    show_in_homepage: boolean
    show_in_footer: boolean
    featured: boolean
  }
  layout_settings: {
    products_per_page: number
    default_view: 'grid' | 'list'
    show_filters: boolean
    show_sorting: boolean
  }
  position: number
  is_active: boolean
}

const defaultCategoryData: CategoryFormData = {
  name: { ko: '', en: '' },
  slug: '',
  description: { ko: '', en: '' },
  display_settings: {
    show_in_menu: true,
    show_in_homepage: false,
    show_in_footer: false,
    featured: false
  },
  layout_settings: {
    products_per_page: 12,
    default_view: 'grid',
    show_filters: true,
    show_sorting: true
  },
  position: 0,
  is_active: true
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<CategoryFormData | null>(null)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

  const supabase = createClient()

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('position')

      if (error) throw error

      // Convert null parent_id to undefined for TypeScript compatibility
      const formattedCategories = (data || []).map(cat => ({
        ...cat,
        parent_id: cat.parent_id || undefined
      })) as Category[]
      
      setCategories(formattedCategories)
    } catch (error: any) {
      console.error('Error loading categories:', error)
      toast({
        title: "오류",
        description: "카테고리를 불러오는데 실패했습니다.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const saveCategory = async () => {
    if (!editingCategory) return

    try {
      setSaving(true)

      const categoryData = {
        parent_id: editingCategory.parent_id,
        name: editingCategory.name,
        slug: editingCategory.slug,
        description: editingCategory.description,
        thumbnail: editingCategory.thumbnail,
        banner_image: editingCategory.banner_image,
        icon: editingCategory.icon,
        meta: {},
        display_settings: editingCategory.display_settings,
        layout_settings: editingCategory.layout_settings,
        custom_fields: {},
        position: editingCategory.position,
        path: null,
        level: editingCategory.parent_id ? 1 : 0,
        is_active: editingCategory.is_active,
        updated_at: new Date().toISOString()
      }

      if (editingCategory.id) {
        const { error } = await supabase
          .from('categories')
          .update(categoryData)
          .eq('id', editingCategory.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('categories')
          .insert({
            ...categoryData,
            created_at: new Date().toISOString()
          })

        if (error) throw error
      }

      toast({
        title: "성공",
        description: "카테고리가 저장되었습니다."
      })

      setDialogOpen(false)
      setEditingCategory(null)
      loadCategories()
    } catch (error: any) {
      console.error('Error saving category:', error)
      toast({
        title: "오류",
        description: "카테고리 저장에 실패했습니다.",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const deleteCategory = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까? 하위 카테고리도 함께 삭제됩니다.')) return

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast({
        title: "성공",
        description: "카테고리가 삭제되었습니다."
      })

      loadCategories()
    } catch (error: any) {
      console.error('Error deleting category:', error)
      toast({
        title: "오류",
        description: "카테고리 삭제에 실패했습니다.",
        variant: "destructive"
      })
    }
  }

  const toggleCategoryStatus = async (category: Category, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('categories')
        .update({ 
          is_active: isActive,
          updated_at: new Date().toISOString()
        })
        .eq('id', category.id)

      if (error) throw error

      toast({
        title: "성공",
        description: `카테고리가 ${isActive ? '활성화' : '비활성화'}되었습니다.`
      })

      loadCategories()
    } catch (error: any) {
      console.error('Error updating category status:', error)
      toast({
        title: "오류",
        description: "카테고리 상태 변경에 실패했습니다.",
        variant: "destructive"
      })
    }
  }

  const handleEdit = (category: Category) => {
    setEditingCategory({
      id: category.id,
      parent_id: category.parent_id || undefined,
      name: category.name as { ko: string; en: string },
      slug: category.slug,
      description: (category.description as any) || { ko: '', en: '' },
      thumbnail: category.thumbnail || undefined,
      banner_image: category.banner_image || undefined,
      icon: category.icon || undefined,
      display_settings: category.display_settings as any,
      layout_settings: category.layout_settings as any,
      position: category.position,
      is_active: category.is_active
    })
    setDialogOpen(true)
  }

  const handleAdd = (parentId?: string) => {
    setEditingCategory({
      ...defaultCategoryData,
      parent_id: parentId
    })
    setDialogOpen(true)
  }

  const toggleExpanded = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  const getTopLevelCategories = () => {
    return categories.filter(category => !category.parent_id)
  }

  const getSubCategories = (parentId: string) => {
    return categories.filter(category => category.parent_id === parentId)
  }

  const renderCategoryTree = (category: Category, level = 0) => {
    const subCategories = getSubCategories(category.id)
    const hasSubCategories = subCategories.length > 0
    const isExpanded = expandedCategories.has(category.id)

    return (
      <div key={category.id} className={level > 0 ? 'ml-8' : ''}>
        <Card className="mb-2">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                
                {hasSubCategories && (
                  <button
                    onClick={() => toggleExpanded(category.id)}
                    className="p-1 hover:bg-muted rounded"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                )}

                <div className="flex items-center gap-2">
                  {hasSubCategories ? (
                    isExpanded ? <FolderOpen className="h-5 w-5" /> : <Folder className="h-5 w-5" />
                  ) : (
                    <Tag className="h-5 w-5" />
                  )}

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{(category.name as any)?.ko}</span>
                      {!category.is_active && (
                        <Badge variant="secondary">비활성</Badge>
                      )}
                      {(category.display_settings as any)?.featured && (
                        <Badge variant="default">추천</Badge>
                      )}
                      {(category.display_settings as any)?.show_in_homepage && (
                        <Badge variant="outline">홈페이지</Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {(category.name as any)?.en} • /{category.slug}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Switch
                    checked={category.is_active}
                    onCheckedChange={(checked) => toggleCategoryStatus(category, checked)}
                    size="sm"
                  />
                  <span className="text-xs text-muted-foreground">활성</span>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAdd(category.id)}
                  title="하위 카테고리 추가"
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(category)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteCategory(category.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {hasSubCategories && isExpanded && (
          <div className="ml-4 border-l-2 border-muted pl-4">
            {subCategories.map(subCategory => renderCategoryTree(subCategory, level + 1))}
          </div>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">카테고리를 불러오는 중...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">카테고리 관리</h1>
          <p className="text-muted-foreground">
            제품 카테고리를 트리 구조로 관리합니다.
          </p>
        </div>
        <Button onClick={() => handleAdd()} className="gap-2">
          <Plus className="h-4 w-4" />
          카테고리 추가
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Folder className="h-5 w-5" />
            카테고리 트리
          </CardTitle>
          <CardDescription>
            드래그앤드롭으로 순서를 변경하고 계층 구조를 관리할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {getTopLevelCategories().length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              <Folder className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">카테고리가 없습니다.</p>
              <p className="text-sm">첫 번째 카테고리를 추가해보세요.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {getTopLevelCategories().map(category => renderCategoryTree(category))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCategory?.id ? '카테고리 편집' : '새 카테고리 추가'}
            </DialogTitle>
            <DialogDescription>
              카테고리 정보를 입력하세요.
            </DialogDescription>
          </DialogHeader>

          {editingCategory && (
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>상위 카테고리</Label>
                  <Select
                    value={editingCategory.parent_id || ''}
                    onValueChange={(value) => 
                      setEditingCategory(prev => prev ? { 
                        ...prev, 
                        parent_id: value || undefined 
                      } : null)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="없음 (최상위 카테고리)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">없음</SelectItem>
                      {getTopLevelCategories().map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {(category.name as any).ko}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>슬러그</Label>
                  <Input
                    value={editingCategory.slug}
                    onChange={(e) => 
                      setEditingCategory(prev => prev ? { ...prev, slug: e.target.value } : null)
                    }
                    placeholder="category-name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>카테고리명 (한국어)</Label>
                  <Input
                    value={editingCategory.name.ko}
                    onChange={(e) => 
                      setEditingCategory(prev => prev ? {
                        ...prev,
                        name: { ...prev.name, ko: e.target.value }
                      } : null)
                    }
                    placeholder="카테고리명"
                  />
                </div>
                <div className="space-y-2">
                  <Label>카테고리명 (영어)</Label>
                  <Input
                    value={editingCategory.name.en}
                    onChange={(e) => 
                      setEditingCategory(prev => prev ? {
                        ...prev,
                        name: { ...prev.name, en: e.target.value }
                      } : null)
                    }
                    placeholder="Category Name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>설명 (한국어)</Label>
                  <Textarea
                    value={editingCategory.description.ko}
                    onChange={(e) => 
                      setEditingCategory(prev => prev ? {
                        ...prev,
                        description: { ...prev.description, ko: e.target.value }
                      } : null)
                    }
                    placeholder="카테고리 설명"
                  />
                </div>
                <div className="space-y-2">
                  <Label>설명 (영어)</Label>
                  <Textarea
                    value={editingCategory.description.en}
                    onChange={(e) => 
                      setEditingCategory(prev => prev ? {
                        ...prev,
                        description: { ...prev.description, en: e.target.value }
                      } : null)
                    }
                    placeholder="Category Description"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>썸네일 이미지</Label>
                  <Input
                    value={editingCategory.thumbnail || ''}
                    onChange={(e) => 
                      setEditingCategory(prev => prev ? { ...prev, thumbnail: e.target.value } : null)
                    }
                    placeholder="이미지 URL"
                  />
                </div>
                <div className="space-y-2">
                  <Label>배너 이미지</Label>
                  <Input
                    value={editingCategory.banner_image || ''}
                    onChange={(e) => 
                      setEditingCategory(prev => prev ? { ...prev, banner_image: e.target.value } : null)
                    }
                    placeholder="배너 이미지 URL"
                  />
                </div>
                <div className="space-y-2">
                  <Label>아이콘</Label>
                  <Input
                    value={editingCategory.icon || ''}
                    onChange={(e) => 
                      setEditingCategory(prev => prev ? { ...prev, icon: e.target.value } : null)
                    }
                    placeholder="icon-name"
                  />
                </div>
              </div>

              <div className="space-y-4 border-t pt-4">
                <h3 className="text-lg font-semibold">표시 설정</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>메뉴에 표시</Label>
                      <Switch
                        checked={editingCategory.display_settings.show_in_menu}
                        onCheckedChange={(checked) => 
                          setEditingCategory(prev => prev ? {
                            ...prev,
                            display_settings: { ...prev.display_settings, show_in_menu: checked }
                          } : null)
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>홈페이지에 표시</Label>
                      <Switch
                        checked={editingCategory.display_settings.show_in_homepage}
                        onCheckedChange={(checked) => 
                          setEditingCategory(prev => prev ? {
                            ...prev,
                            display_settings: { ...prev.display_settings, show_in_homepage: checked }
                          } : null)
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>푸터에 표시</Label>
                      <Switch
                        checked={editingCategory.display_settings.show_in_footer}
                        onCheckedChange={(checked) => 
                          setEditingCategory(prev => prev ? {
                            ...prev,
                            display_settings: { ...prev.display_settings, show_in_footer: checked }
                          } : null)
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>추천 카테고리</Label>
                      <Switch
                        checked={editingCategory.display_settings.featured}
                        onCheckedChange={(checked) => 
                          setEditingCategory(prev => prev ? {
                            ...prev,
                            display_settings: { ...prev.display_settings, featured: checked }
                          } : null)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 border-t pt-4">
                <h3 className="text-lg font-semibold">레이아웃 설정</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>페이지당 제품 수</Label>
                    <Input
                      type="number"
                      value={editingCategory.layout_settings.products_per_page}
                      onChange={(e) => 
                        setEditingCategory(prev => prev ? {
                          ...prev,
                          layout_settings: { ...prev.layout_settings, products_per_page: Number(e.target.value) }
                        } : null)
                      }
                      min="1"
                      max="100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>기본 보기 형식</Label>
                    <Select
                      value={editingCategory.layout_settings.default_view}
                      onValueChange={(value: any) => 
                        setEditingCategory(prev => prev ? {
                          ...prev,
                          layout_settings: { ...prev.layout_settings, default_view: value }
                        } : null)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="grid">그리드</SelectItem>
                        <SelectItem value="list">리스트</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <Label>필터 표시</Label>
                    <Switch
                      checked={editingCategory.layout_settings.show_filters}
                      onCheckedChange={(checked) => 
                        setEditingCategory(prev => prev ? {
                          ...prev,
                          layout_settings: { ...prev.layout_settings, show_filters: checked }
                        } : null)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>정렬 옵션 표시</Label>
                    <Switch
                      checked={editingCategory.layout_settings.show_sorting}
                      onCheckedChange={(checked) => 
                        setEditingCategory(prev => prev ? {
                          ...prev,
                          layout_settings: { ...prev.layout_settings, show_sorting: checked }
                        } : null)
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2 border-t pt-4">
                <div className="flex items-center justify-between">
                  <Label>활성화</Label>
                  <Switch
                    checked={editingCategory.is_active}
                    onCheckedChange={(checked) => 
                      setEditingCategory(prev => prev ? { ...prev, is_active: checked } : null)
                    }
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
            >
              취소
            </Button>
            <Button onClick={saveCategory} disabled={saving} className="gap-2">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Folder className="h-4 w-4" />}
              저장
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}