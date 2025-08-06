"use client"

import { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"
import { 
  Loader2, 
  Upload, 
  Trash2, 
  Search,
  Image as ImageIcon,
  Video,
  File,
  Eye,
  Copy,
  Download,
  X
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface MediaFile {
  name: string
  id: string
  updated_at: string
  created_at: string
  last_accessed_at: string
  metadata: {
    eTag: string
    size: number
    mimetype: string
    cacheControl: string
    lastModified: string
    contentLength: number
    httpStatusCode: number
  }
}

export default function MediaPage() {
  const [imageFiles, setImageFiles] = useState<MediaFile[]>([])
  const [videoFiles, setVideoFiles] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBucket, setSelectedBucket] = useState<'images' | 'videos'>('images')
  const [previewFile, setPreviewFile] = useState<MediaFile | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)

  const supabase = createClient()

  useEffect(() => {
    loadMedia()
  }, [])

  const loadMedia = async () => {
    try {
      setLoading(true)
      
      // 이미지 파일 로드
      const { data: imageData, error: imageError } = await supabase.storage
        .from('images')
        .list('', {
          limit: 100,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' }
        })

      if (imageError) {
        console.error('Error loading images:', imageError)
      } else {
        setImageFiles(imageData || [])
      }

      // 비디오 파일 로드
      const { data: videoData, error: videoError } = await supabase.storage
        .from('videos')
        .list('', {
          limit: 100,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' }
        })

      if (videoError) {
        console.error('Error loading videos:', videoError)
      } else {
        setVideoFiles(videoData || [])
      }
    } catch (error: any) {
      console.error('Error loading media:', error)
      toast({
        title: "오류",
        description: "미디어 파일을 불러오는데 실패했습니다.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const uploadFiles = async () => {
    if (!selectedFiles || selectedFiles.length === 0) return

    try {
      setUploading(true)
      const uploadPromises = Array.from(selectedFiles).map(async (file) => {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
        
        const { error } = await supabase.storage
          .from(selectedBucket)
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          })

        if (error) throw error
        return fileName
      })

      await Promise.all(uploadPromises)

      toast({
        title: "성공",
        description: `${selectedFiles.length}개 파일이 업로드되었습니다.`
      })

      setUploadDialogOpen(false)
      setSelectedFiles(null)
      loadMedia()
    } catch (error: any) {
      console.error('Error uploading files:', error)
      toast({
        title: "오류",
        description: "파일 업로드에 실패했습니다.",
        variant: "destructive"
      })
    } finally {
      setUploading(false)
    }
  }

  const deleteFile = async (bucket: string, fileName: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return

    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([fileName])

      if (error) throw error

      toast({
        title: "성공",
        description: "파일이 삭제되었습니다."
      })

      loadMedia()
    } catch (error: any) {
      console.error('Error deleting file:', error)
      toast({
        title: "오류",
        description: "파일 삭제에 실패했습니다.",
        variant: "destructive"
      })
    }
  }

  const getPublicUrl = (bucket: string, fileName: string) => {
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName)
    return publicUrl
  }

  const copyUrl = (bucket: string, fileName: string) => {
    const url = getPublicUrl(bucket, fileName)
    navigator.clipboard.writeText(url)
    toast({
      title: "성공",
      description: "URL이 클립보드에 복사되었습니다."
    })
  }

  const downloadFile = (bucket: string, fileName: string) => {
    const url = getPublicUrl(bucket, fileName)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const openPreview = (file: MediaFile, bucket: string) => {
    setPreviewFile(file)
    const url = getPublicUrl(bucket, file.name)
    setPreviewUrl(url)
  }

  const closePreview = () => {
    setPreviewFile(null)
    setPreviewUrl(null)
  }

  const getFileIcon = (mimetype: string) => {
    if (mimetype.startsWith('image/')) {
      return <ImageIcon className="h-6 w-6" />
    } else if (mimetype.startsWith('video/')) {
      return <Video className="h-6 w-6" />
    } else {
      return <File className="h-6 w-6" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const currentFiles = selectedBucket === 'images' ? imageFiles : videoFiles
  const filteredFiles = currentFiles.filter(file => 
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">미디어를 불러오는 중...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">미디어 라이브러리</h1>
          <p className="text-muted-foreground">
            이미지와 비디오 파일을 관리합니다.
          </p>
        </div>
        <Button onClick={() => setUploadDialogOpen(true)} className="gap-2">
          <Upload className="h-4 w-4" />
          파일 업로드
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 max-w-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="파일 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={selectedBucket} onValueChange={(value: any) => setSelectedBucket(value)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="images">이미지</SelectItem>
            <SelectItem value="videos">비디오</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {selectedBucket === 'images' ? <ImageIcon className="h-5 w-5" /> : <Video className="h-5 w-5" />}
            {selectedBucket === 'images' ? '이미지' : '비디오'} 파일
            <Badge variant="secondary">{filteredFiles.length}</Badge>
          </CardTitle>
          <CardDescription>
            {selectedBucket === 'images' ? '이미지' : '비디오'} 파일들을 관리할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredFiles.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              <div className="mx-auto mb-4">
                {selectedBucket === 'images' ? <ImageIcon className="h-16 w-16 mx-auto" /> : <Video className="h-16 w-16 mx-auto" />}
              </div>
              <p className="text-lg">파일이 없습니다.</p>
              <p className="text-sm">첫 번째 {selectedBucket === 'images' ? '이미지' : '비디오'}를 업로드해보세요.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {filteredFiles.map((file) => (
                <Card key={file.id} className="overflow-hidden">
                  <div className="aspect-square relative group">
                    {selectedBucket === 'images' ? (
                      <img
                        src={getPublicUrl(selectedBucket, file.name)}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <Video className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => openPreview(file, selectedBucket)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => copyUrl(selectedBucket, file.name)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => downloadFile(selectedBucket, file.name)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteFile(selectedBucket, file.name)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" title={file.name}>
                          {file.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(file.metadata.size)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(file.created_at).toLocaleDateString('ko-KR')}
                        </p>
                      </div>
                      <div className="flex-shrink-0 ml-2">
                        {getFileIcon(file.metadata.mimetype)}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 업로드 다이얼로그 */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>파일 업로드</DialogTitle>
            <DialogDescription>
              {selectedBucket === 'images' ? '이미지' : '비디오'} 파일을 업로드합니다.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>업로드할 파일</Label>
              <Input
                type="file"
                multiple
                accept={selectedBucket === 'images' ? 'image/*' : 'video/*'}
                onChange={(e) => setSelectedFiles(e.target.files)}
              />
              <p className="text-sm text-muted-foreground">
                {selectedBucket === 'images' 
                  ? '이미지 파일만 업로드 가능합니다. (JPG, PNG, GIF, WebP 등)' 
                  : '비디오 파일만 업로드 가능합니다. (MP4, WebM, MOV 등)'
                }
              </p>
            </div>

            {selectedFiles && selectedFiles.length > 0 && (
              <div className="space-y-2">
                <Label>선택된 파일</Label>
                <div className="space-y-1">
                  {Array.from(selectedFiles).map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                      <div className="flex items-center gap-2">
                        {getFileIcon(file.type)}
                        <span className="text-sm">{file.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatFileSize(file.size)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setUploadDialogOpen(false)}
            >
              취소
            </Button>
            <Button 
              onClick={uploadFiles} 
              disabled={uploading || !selectedFiles || selectedFiles.length === 0}
              className="gap-2"
            >
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              업로드
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 미리보기 다이얼로그 */}
      <Dialog open={!!previewFile} onOpenChange={(open) => !open && closePreview()}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{previewFile?.name}</span>
              <Button variant="ghost" size="sm" onClick={closePreview}>
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
            <DialogDescription>
              {previewFile && (
                <div className="flex items-center gap-4 text-sm">
                  <span>크기: {formatFileSize(previewFile.metadata.size)}</span>
                  <span>타입: {previewFile.metadata.mimetype}</span>
                  <span>생성일: {new Date(previewFile.created_at).toLocaleDateString('ko-KR')}</span>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>

          {previewFile && previewUrl && (
            <div className="flex items-center justify-center p-4">
              {selectedBucket === 'images' ? (
                <img
                  src={previewUrl}
                  alt={previewFile.name}
                  className="max-w-full max-h-96 object-contain"
                />
              ) : (
                <video
                  src={previewUrl}
                  controls
                  className="max-w-full max-h-96"
                >
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => previewFile && copyUrl(selectedBucket, previewFile.name)}
              className="gap-2"
            >
              <Copy className="h-4 w-4" />
              URL 복사
            </Button>
            <Button
              variant="outline"
              onClick={() => previewFile && downloadFile(selectedBucket, previewFile.name)}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              다운로드
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (previewFile) {
                  deleteFile(selectedBucket, previewFile.name)
                  closePreview()
                }
              }}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}