"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import toast from 'react-hot-toast'
import { createClient } from "@/lib/supabase/client"
import { Menu } from "@/lib/types/cms"
import { 
  Loader2, 
  Plus, 
  Edit, 
  Trash2, 
  GripVertical,
  Save,
  X,
  ChevronDown,
  ChevronRight
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface MenuFormData {
  id?: string
  menu_location: 'header' | 'footer' | 'mobile' | 'sidebar'
  parent_id?: string
  title: { ko: string; en: string }
  url?: string
  url_type: 'internal' | 'external' | 'anchor' | 'category' | 'page'
  target: '_self' | '_blank'
  icon?: string
  badge_text?: string
  badge_color?: string
  css_class?: string
  is_mega_menu: boolean
  mega_menu_columns: number
  mega_menu_content?: any
  visibility_rules: {
    show_logged_in: boolean
    show_logged_out: boolean
    required_roles: string[]
    hide_on_mobile: boolean
  }
  position: number
  is_active: boolean
}

const defaultMenuData: MenuFormData = {
  menu_location: 'header',
  title: { ko: '', en: '' },
  url: '',
  url_type: 'internal',
  target: '_self',
  is_mega_menu: false,
  mega_menu_columns: 1,
  visibility_rules: {
    show_logged_in: true,
    show_logged_out: true,
    required_roles: [],
    hide_on_mobile: false
  },
  position: 0,
  is_active: true
}

export default function MenusPage() {
  const [menus, setMenus] = useState<Menu[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingMenu, setEditingMenu] = useState<MenuFormData | null>(null)
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set())

  const supabase = createClient()

  useEffect(() => {
    loadMenus()
  }, [])

  const loadMenus = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('menus')
        .select('*')
        .order('menu_location', { ascending: true })
        .order('position', { ascending: true })

      if (error) throw error

      setMenus(data || [])
    } catch (error: any) {
      console.error('Error loading menus:', error)
      toast.error('메뉴를 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const saveMenu = async () => {
    if (!editingMenu) return

    try {
      setSaving(true)

      const menuData = {
        ...editingMenu,
        updated_at: new Date().toISOString()
      }

      if (editingMenu.id) {
        const { error } = await supabase
          .from('menus')
          .update(menuData)
          .eq('id', editingMenu.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('menus')
          .insert({
            ...menuData,
            created_at: new Date().toISOString()
          })

        if (error) throw error
      }

      toast.success('메뉴가 저장되었습니다.')

      setDialogOpen(false)
      setEditingMenu(null)
      loadMenus()
    } catch (error: any) {
      console.error('Error saving menu:', error)
      toast.error('메뉴 저장에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  const deleteMenu = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return

    try {
      const { error } = await supabase
        .from('menus')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast.success('메뉴가 삭제되었습니다.')

      loadMenus()
    } catch (error: any) {
      console.error('Error deleting menu:', error)
      toast.error('메뉴 삭제에 실패했습니다.')
    }
  }

  const handleEdit = (menu: Menu) => {
    setEditingMenu({
      id: menu.id,
      menu_location: menu.menu_location as any,
      parent_id: menu.parent_id || undefined,
      title: menu.title as { ko: string; en: string },
      url: menu.url || '',
      url_type: menu.url_type as any,
      target: menu.target as any,
      icon: menu.icon || '',
      badge_text: menu.badge_text || '',
      badge_color: menu.badge_color || '',
      css_class: menu.css_class || '',
      is_mega_menu: menu.is_mega_menu,
      mega_menu_columns: menu.mega_menu_columns,
      mega_menu_content: menu.mega_menu_content,
      visibility_rules: menu.visibility_rules as any,
      position: menu.position,
      is_active: menu.is_active
    })
    setDialogOpen(true)
  }

  const handleAdd = () => {
    setEditingMenu(defaultMenuData)
    setDialogOpen(true)
  }

  const toggleExpanded = (menuId: string) => {
    const newExpanded = new Set(expandedMenus)
    if (newExpanded.has(menuId)) {
      newExpanded.delete(menuId)
    } else {
      newExpanded.add(menuId)
    }
    setExpandedMenus(newExpanded)
  }

  const getMenusByLocation = (location: string) => {
    return menus.filter(menu => menu.menu_location === location && !menu.parent_id)
  }

  const getSubMenus = (parentId: string) => {
    return menus.filter(menu => menu.parent_id === parentId)
  }

  const renderMenuTree = (menu: Menu, level = 0) => {
    const subMenus = getSubMenus(menu.id)
    const hasSubMenus = subMenus.length > 0
    const isExpanded = expandedMenus.has(menu.id)

    return (
      <div key={menu.id}>
        <div 
          className={`flex items-center gap-2 p-2 border rounded-lg ${level > 0 ? 'ml-8 bg-muted/50' : 'bg-background'}`}
        >
          <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
          
          {hasSubMenus && (
            <button
              onClick={() => toggleExpanded(menu.id)}
              className="p-1 hover:bg-muted rounded"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          )}
          
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">
                {(menu.title as any).ko || (menu.title as any).en}
              </span>
              {menu.badge_text && (
                <Badge variant="secondary" className="text-xs">
                  {menu.badge_text}
                </Badge>
              )}
              {!menu.is_active && (
                <Badge variant="outline" className="text-xs">
                  비활성
                </Badge>
              )}
              {menu.is_mega_menu && (
                <Badge variant="outline" className="text-xs">
                  메가메뉴
                </Badge>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              {menu.url} ({menu.url_type})
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(menu)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteMenu(menu.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {hasSubMenus && isExpanded && (
          <div className="mt-2 space-y-2">
            {subMenus.map(subMenu => renderMenuTree(subMenu, level + 1))}
          </div>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">메뉴를 불러오는 중...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">메뉴 관리</h1>
          <p className="text-muted-foreground">
            사이트 네비게이션 메뉴를 관리합니다.
          </p>
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          메뉴 추가
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {['header', 'footer', 'mobile', 'sidebar'].map((location) => (
          <Card key={location}>
            <CardHeader>
              <CardTitle className="capitalize">
                {location === 'header' && '헤더 메뉴'}
                {location === 'footer' && '푸터 메뉴'}
                {location === 'mobile' && '모바일 메뉴'}
                {location === 'sidebar' && '사이드바 메뉴'}
              </CardTitle>
              <CardDescription>
                {location} 영역에 표시될 메뉴입니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {getMenusByLocation(location).length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    메뉴가 없습니다.
                  </div>
                ) : (
                  getMenusByLocation(location).map(menu => renderMenuTree(menu))
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingMenu?.id ? '메뉴 편집' : '새 메뉴 추가'}
            </DialogTitle>
            <DialogDescription>
              메뉴 정보를 입력하세요.
            </DialogDescription>
          </DialogHeader>

          {editingMenu && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>메뉴 위치</Label>
                  <Select
                    value={editingMenu.menu_location}
                    onValueChange={(value: any) => 
                      setEditingMenu(prev => prev ? { ...prev, menu_location: value } : null)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="header">헤더</SelectItem>
                      <SelectItem value="footer">푸터</SelectItem>
                      <SelectItem value="mobile">모바일</SelectItem>
                      <SelectItem value="sidebar">사이드바</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>상위 메뉴</Label>
                  <Select
                    value={editingMenu.parent_id || ''}
                    onValueChange={(value) => 
                      setEditingMenu(prev => prev ? { 
                        ...prev, 
                        parent_id: value || undefined 
                      } : null)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="없음" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">없음</SelectItem>
                      {getMenusByLocation(editingMenu.menu_location).map(menu => (
                        <SelectItem key={menu.id} value={menu.id}>
                          {(menu.title as any).ko}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>제목 (한국어)</Label>
                  <Input
                    value={editingMenu.title.ko}
                    onChange={(e) => 
                      setEditingMenu(prev => prev ? {
                        ...prev,
                        title: { ...prev.title, ko: e.target.value }
                      } : null)
                    }
                    placeholder="메뉴 제목"
                  />
                </div>
                <div className="space-y-2">
                  <Label>제목 (영어)</Label>
                  <Input
                    value={editingMenu.title.en}
                    onChange={(e) => 
                      setEditingMenu(prev => prev ? {
                        ...prev,
                        title: { ...prev.title, en: e.target.value }
                      } : null)
                    }
                    placeholder="Menu Title"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>URL</Label>
                  <Input
                    value={editingMenu.url}
                    onChange={(e) => 
                      setEditingMenu(prev => prev ? { ...prev, url: e.target.value } : null)
                    }
                    placeholder="/path 또는 https://example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>URL 타입</Label>
                  <Select
                    value={editingMenu.url_type}
                    onValueChange={(value: any) => 
                      setEditingMenu(prev => prev ? { ...prev, url_type: value } : null)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="internal">내부 링크</SelectItem>
                      <SelectItem value="external">외부 링크</SelectItem>
                      <SelectItem value="anchor">앵커 링크</SelectItem>
                      <SelectItem value="category">카테고리</SelectItem>
                      <SelectItem value="page">페이지</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>타겟</Label>
                  <Select
                    value={editingMenu.target}
                    onValueChange={(value: any) => 
                      setEditingMenu(prev => prev ? { ...prev, target: value } : null)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="_self">같은 창</SelectItem>
                      <SelectItem value="_blank">새 창</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>아이콘</Label>
                  <Input
                    value={editingMenu.icon}
                    onChange={(e) => 
                      setEditingMenu(prev => prev ? { ...prev, icon: e.target.value } : null)
                    }
                    placeholder="lucide-icon-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>배지 텍스트</Label>
                  <Input
                    value={editingMenu.badge_text}
                    onChange={(e) => 
                      setEditingMenu(prev => prev ? { ...prev, badge_text: e.target.value } : null)
                    }
                    placeholder="NEW, HOT 등"
                  />
                </div>
                <div className="space-y-2">
                  <Label>배지 색상</Label>
                  <Input
                    value={editingMenu.badge_color}
                    onChange={(e) => 
                      setEditingMenu(prev => prev ? { ...prev, badge_color: e.target.value } : null)
                    }
                    placeholder="#ff0000"
                  />
                </div>
              </div>

              <div className="space-y-4 border-t pt-4">
                <h3 className="text-lg font-semibold">메가메뉴 설정</h3>
                <div className="flex items-center justify-between">
                  <Label>메가메뉴 사용</Label>
                  <Switch
                    checked={editingMenu.is_mega_menu}
                    onCheckedChange={(checked) => 
                      setEditingMenu(prev => prev ? { ...prev, is_mega_menu: checked } : null)
                    }
                  />
                </div>
                {editingMenu.is_mega_menu && (
                  <div className="space-y-2">
                    <Label>컬럼 수</Label>
                    <Select
                      value={editingMenu.mega_menu_columns.toString()}
                      onValueChange={(value) => 
                        setEditingMenu(prev => prev ? { 
                          ...prev, 
                          mega_menu_columns: parseInt(value) 
                        } : null)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1컬럼</SelectItem>
                        <SelectItem value="2">2컬럼</SelectItem>
                        <SelectItem value="3">3컬럼</SelectItem>
                        <SelectItem value="4">4컬럼</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="space-y-4 border-t pt-4">
                <h3 className="text-lg font-semibold">표시 규칙</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>로그인 사용자에게 표시</Label>
                    <Switch
                      checked={editingMenu.visibility_rules.show_logged_in}
                      onCheckedChange={(checked) => 
                        setEditingMenu(prev => prev ? {
                          ...prev,
                          visibility_rules: { ...prev.visibility_rules, show_logged_in: checked }
                        } : null)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>로그아웃 사용자에게 표시</Label>
                    <Switch
                      checked={editingMenu.visibility_rules.show_logged_out}
                      onCheckedChange={(checked) => 
                        setEditingMenu(prev => prev ? {
                          ...prev,
                          visibility_rules: { ...prev.visibility_rules, show_logged_out: checked }
                        } : null)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>모바일에서 숨김</Label>
                    <Switch
                      checked={editingMenu.visibility_rules.hide_on_mobile}
                      onCheckedChange={(checked) => 
                        setEditingMenu(prev => prev ? {
                          ...prev,
                          visibility_rules: { ...prev.visibility_rules, hide_on_mobile: checked }
                        } : null)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>활성화</Label>
                    <Switch
                      checked={editingMenu.is_active}
                      onCheckedChange={(checked) => 
                        setEditingMenu(prev => prev ? { ...prev, is_active: checked } : null)
                      }
                    />
                  </div>
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
            <Button onClick={saveMenu} disabled={saving} className="gap-2">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              저장
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}