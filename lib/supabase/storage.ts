import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { v4 as uuidv4 } from 'uuid';

export interface UploadedFile {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'document' | 'other';
  size: number;
  bucket: string;
  path: string;
  created_at: string;
}

/**
 * 파일을 Supabase Storage에 업로드
 */
export async function uploadFile(file: File): Promise<UploadedFile> {
  const supabase = createClientComponentClient();
  
  // 파일 타입에 따라 버킷 선택
  let bucket = '';
  let fileType: 'image' | 'video' | 'document' | 'other' = 'other';
  
  if (file.type.startsWith('image/')) {
    bucket = 'images';
    fileType = 'image';
  } else if (file.type.startsWith('video/')) {
    bucket = 'videos';
    fileType = 'video';
  } else {
    throw new Error('지원하지 않는 파일 형식입니다. 이미지 또는 비디오만 업로드 가능합니다.');
  }
  
  // 파일 확장자 추출
  const ext = file.name.split('.').pop();
  // 유니크한 파일명 생성
  const fileName = `${uuidv4()}.${ext}`;
  // 날짜별 폴더 구조 생성 (YYYY/MM/DD)
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const filePath = `${year}/${month}/${day}/${fileName}`;
  
  // 파일 업로드
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });
  
  if (error) {
    console.error('Upload error:', error);
    throw new Error(`파일 업로드 실패: ${error.message}`);
  }
  
  // 공개 URL 가져오기
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);
  
  return {
    id: uuidv4(),
    name: file.name,
    url: publicUrl,
    type: fileType,
    size: file.size,
    bucket,
    path: filePath,
    created_at: new Date().toISOString()
  };
}

/**
 * 여러 파일을 한번에 업로드
 */
export async function uploadFiles(files: File[]): Promise<UploadedFile[]> {
  const uploadPromises = files.map(file => uploadFile(file));
  return Promise.all(uploadPromises);
}

/**
 * 파일 삭제
 */
export async function deleteFile(bucket: string, path: string): Promise<void> {
  const supabase = createClientComponentClient();
  
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);
  
  if (error) {
    console.error('Delete error:', error);
    throw new Error(`파일 삭제 실패: ${error.message}`);
  }
}

/**
 * 버킷의 파일 목록 가져오기
 */
export async function listFiles(bucket: string, folder?: string) {
  const supabase = createClientComponentClient();
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .list(folder, {
      limit: 100,
      offset: 0,
      sortBy: { column: 'created_at', order: 'desc' }
    });
  
  if (error) {
    console.error('List error:', error);
    throw new Error(`파일 목록 가져오기 실패: ${error.message}`);
  }
  
  return data;
}

/**
 * 이미지 버킷의 모든 파일 가져오기
 */
export async function getImages() {
  const supabase = createClientComponentClient();
  const allImages: any[] = [];
  
  // 연도별 폴더 스캔 (최근 2년)
  const currentYear = new Date().getFullYear();
  for (let year = currentYear; year >= currentYear - 1; year--) {
    for (let month = 1; month <= 12; month++) {
      const monthStr = String(month).padStart(2, '0');
      
      try {
        const { data, error } = await supabase.storage
          .from('images')
          .list(`${year}/${monthStr}`, {
            limit: 1000,
            offset: 0
          });
        
        if (data && data.length > 0) {
          // 각 일자별 폴더 스캔
          for (const dayFolder of data) {
            if (dayFolder.name && !dayFolder.name.includes('.')) {
              const { data: files } = await supabase.storage
                .from('images')
                .list(`${year}/${monthStr}/${dayFolder.name}`, {
                  limit: 1000,
                  offset: 0
                });
              
              if (files) {
                files.forEach(file => {
                  if (file.name && file.name.includes('.')) {
                    const { data: { publicUrl } } = supabase.storage
                      .from('images')
                      .getPublicUrl(`${year}/${monthStr}/${dayFolder.name}/${file.name}`);
                    
                    allImages.push({
                      id: file.id || uuidv4(),
                      name: file.name,
                      url: publicUrl,
                      type: 'image',
                      size: file.metadata?.size || 0,
                      path: `${year}/${monthStr}/${dayFolder.name}/${file.name}`,
                      created_at: file.created_at
                    });
                  }
                });
              }
            }
          }
        }
      } catch (error) {
        // 폴더가 없을 수 있으므로 에러 무시
        continue;
      }
    }
  }
  
  return allImages;
}

/**
 * 비디오 버킷의 모든 파일 가져오기
 */
export async function getVideos() {
  const supabase = createClientComponentClient();
  const allVideos: any[] = [];
  
  // 연도별 폴더 스캔 (최근 2년)
  const currentYear = new Date().getFullYear();
  for (let year = currentYear; year >= currentYear - 1; year--) {
    for (let month = 1; month <= 12; month++) {
      const monthStr = String(month).padStart(2, '0');
      
      try {
        const { data, error } = await supabase.storage
          .from('videos')
          .list(`${year}/${monthStr}`, {
            limit: 1000,
            offset: 0
          });
        
        if (data && data.length > 0) {
          // 각 일자별 폴더 스캔
          for (const dayFolder of data) {
            if (dayFolder.name && !dayFolder.name.includes('.')) {
              const { data: files } = await supabase.storage
                .from('videos')
                .list(`${year}/${monthStr}/${dayFolder.name}`, {
                  limit: 1000,
                  offset: 0
                });
              
              if (files) {
                files.forEach(file => {
                  if (file.name && file.name.includes('.')) {
                    const { data: { publicUrl } } = supabase.storage
                      .from('videos')
                      .getPublicUrl(`${year}/${monthStr}/${dayFolder.name}/${file.name}`);
                    
                    allVideos.push({
                      id: file.id || uuidv4(),
                      name: file.name,
                      url: publicUrl,
                      type: 'video',
                      size: file.metadata?.size || 0,
                      path: `${year}/${monthStr}/${dayFolder.name}/${file.name}`,
                      created_at: file.created_at
                    });
                  }
                });
              }
            }
          }
        }
      } catch (error) {
        // 폴더가 없을 수 있으므로 에러 무시
        continue;
      }
    }
  }
  
  return allVideos;
}