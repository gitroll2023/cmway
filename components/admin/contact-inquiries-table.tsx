'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'
import { contacts } from '@/lib/cms'
// Contact type is defined locally
interface Contact {
  id: string
  name: string
  phone: string
  email?: string
  subject: string
  message: string
  status: 'new' | 'in_progress' | 'completed'
  created_at: string
  response?: string
  responded_at?: string
}
import { 
  Search, 
  Filter,
  Eye,
  MessageSquare,
  Calendar,
  User,
  Mail,
  Phone,
  FileText,
  Loader2,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react'

interface ContactInquiriesTableProps {
  page: number
  status: string
  search: string
}

export function ContactInquiriesTable({ page, status, search }: ContactInquiriesTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [contacts_data, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [searchTerm, setSearchTerm] = useState(search)
  const [statusFilter, setStatusFilter] = useState(status)
  const [response, setResponse] = useState('')

  const pageSize = 10

  useEffect(() => {
    fetchContacts()
  }, [page, status, search])

  const fetchContacts = async () => {
    try {
      setLoading(true)
      const { data, count } = await contacts.getAll({
        page,
        limit: pageSize,
        status: status === 'all' ? undefined : status as any,
        search: search || undefined
      })
      
      setContacts(data || [])
      setTotal(count || 0)
    } catch (error) {
      console.error('Error fetching contacts:', error)
      toast({
        title: '오류',
        description: '문의 목록을 불러오는데 실패했습니다.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('search', searchTerm)
    params.set('page', '1') // Reset to first page
    router.push(`?${params.toString()}`)
  }

  const handleStatusFilter = (newStatus: string) => {
    setStatusFilter(newStatus)
    const params = new URLSearchParams(searchParams.toString())
    params.set('status', newStatus)
    params.set('page', '1') // Reset to first page
    router.push(`?${params.toString()}`)
  }

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', newPage.toString())
    router.push(`?${params.toString()}`)
  }

  const handleViewContact = (contact: Contact) => {
    setSelectedContact(contact)
    setResponse('')
    setDialogOpen(true)
  }

  const handleUpdateStatus = async (newStatus: 'pending' | 'responded' | 'closed') => {
    if (!selectedContact) return

    try {
      setUpdating(true)
      await contacts.updateStatus(selectedContact.id, newStatus, response)
      
      toast({
        title: '성공',
        description: '문의 상태가 업데이트되었습니다.'
      })

      setDialogOpen(false)
      setSelectedContact(null)
      setResponse('')
      fetchContacts()
    } catch (error) {
      console.error('Error updating contact status:', error)
      toast({
        title: '오류',
        description: '문의 상태 업데이트에 실패했습니다.',
        variant: 'destructive'
      })
    } finally {
      setUpdating(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { variant: 'secondary' as const, label: '대기중', icon: Clock },
      responded: { variant: 'default' as const, label: '답변완료', icon: CheckCircle },
      closed: { variant: 'outline' as const, label: '종료', icon: XCircle }
    }
    const config = variants[status as keyof typeof variants] || variants.pending
    const IconComponent = config.icon
    
    return (
      <Badge variant={config.variant} className="gap-1">
        <IconComponent className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const getInquiryTypeBadge = (type: string) => {
    const typeLabels = {
      general: '일반 문의',
      product: '제품 문의',
      support: '기술 지원',
      partnership: '파트너십',
      complaint: '불만 접수',
      suggestion: '제안'
    }
    return (
      <Badge variant="outline">
        {typeLabels[type as keyof typeof typeLabels] || type}
      </Badge>
    )
  }

  const totalPages = Math.ceil(total / pageSize)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <span>문의 목록을 불러오는 중...</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 max-w-sm">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="이름, 이메일, 제목으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>
          </div>
          <Button onClick={handleSearch} variant="outline" size="default">
            검색
          </Button>
          <Select value={statusFilter} onValueChange={handleStatusFilter}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">모든 상태</SelectItem>
              <SelectItem value="pending">대기중</SelectItem>
              <SelectItem value="responded">답변완료</SelectItem>
              <SelectItem value="closed">종료</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="px-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>고객 정보</TableHead>
              <TableHead>문의 정보</TableHead>
              <TableHead>유형</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>문의일</TableHead>
              <TableHead className="text-right">작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts_data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  문의가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              contacts_data.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span className="font-medium">{contact.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {contact.email}
                      </div>
                      {contact.phone && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {contact.phone}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1 max-w-xs">
                      <div className="font-medium truncate">{contact.subject}</div>
                      <div className="text-sm text-muted-foreground truncate">
                        {contact.message}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getInquiryTypeBadge(contact.inquiry_type)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(contact.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4" />
                      {new Date(contact.created_at).toLocaleDateString('ko-KR')}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewContact(contact)}
                    >
                      <Eye className="h-4 w-4" />
                      <span className="ml-1">보기</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
          >
            이전
          </Button>
          <span className="text-sm text-muted-foreground">
            {page} / {totalPages} 페이지
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages}
          >
            다음
          </Button>
        </div>
      )}

      {/* Contact Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>문의 상세 정보</DialogTitle>
            <DialogDescription>
              고객 문의 내용을 확인하고 상태를 관리하세요
            </DialogDescription>
          </DialogHeader>

          {selectedContact && (
            <div className="space-y-6 py-4">
              {/* Customer Info */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">고객 정보</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">이름</Label>
                    <p className="text-sm">{selectedContact.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">이메일</Label>
                    <p className="text-sm">{selectedContact.email}</p>
                  </div>
                  {selectedContact.phone && (
                    <div>
                      <Label className="text-sm font-medium">전화번호</Label>
                      <p className="text-sm">{selectedContact.phone}</p>
                    </div>
                  )}
                  {selectedContact.company && (
                    <div>
                      <Label className="text-sm font-medium">회사</Label>
                      <p className="text-sm">{selectedContact.company}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Inquiry Info */}
              <div className="space-y-3 border-t pt-6">
                <h3 className="font-semibold text-lg">문의 정보</h3>
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">제목</Label>
                    <p className="text-sm">{selectedContact.subject}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">유형</Label>
                    <div className="mt-1">
                      {getInquiryTypeBadge(selectedContact.inquiry_type)}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">내용</Label>
                    <div className="mt-1 p-3 bg-muted rounded-md">
                      <p className="text-sm whitespace-pre-wrap">{selectedContact.message}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">문의일시</Label>
                    <p className="text-sm">
                      {new Date(selectedContact.created_at).toLocaleString('ko-KR')}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">현재 상태</Label>
                    <div className="mt-1">
                      {getStatusBadge(selectedContact.status)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Response Section */}
              {selectedContact.status === 'pending' && (
                <div className="space-y-3 border-t pt-6">
                  <h3 className="font-semibold text-lg">답변 작성</h3>
                  <div className="space-y-2">
                    <Label>답변 내용</Label>
                    <Textarea
                      value={response}
                      onChange={(e) => setResponse(e.target.value)}
                      placeholder="고객에게 보낼 답변을 작성하세요..."
                      rows={4}
                    />
                  </div>
                </div>
              )}

              {/* Previous Responses */}
              {selectedContact.response && (
                <div className="space-y-3 border-t pt-6">
                  <h3 className="font-semibold text-lg">답변 내역</h3>
                  <div className="p-3 bg-blue-50 rounded-md">
                    <p className="text-sm whitespace-pre-wrap">{selectedContact.response}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      답변일: {selectedContact.responded_at ? 
                        new Date(selectedContact.responded_at).toLocaleString('ko-KR') : 
                        '-'
                      }
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
            >
              닫기
            </Button>
            
            {selectedContact?.status === 'pending' && (
              <>
                <Button
                  onClick={() => handleUpdateStatus('responded')}
                  disabled={updating || !response.trim()}
                  className="gap-2"
                >
                  {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageSquare className="h-4 w-4" />}
                  답변 완료
                </Button>
              </>
            )}
            
            {selectedContact?.status === 'responded' && (
              <Button
                onClick={() => handleUpdateStatus('closed')}
                disabled={updating}
                variant="outline"
                className="gap-2"
              >
                {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                종료
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}