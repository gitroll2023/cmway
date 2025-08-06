import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: '파일이 없습니다.' }, { status: 400 });
    }

    // 파일 크기 체크 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: '파일 크기는 10MB를 초과할 수 없습니다.' }, { status: 400 });
    }

    // 허용된 파일 타입 체크
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: '허용되지 않은 파일 형식입니다.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 파일 확장자 추출
    const ext = path.extname(file.name);
    // 유니크한 파일명 생성
    const filename = `${uuidv4()}${ext}`;
    
    // 업로드 디렉토리 경로
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    // 디렉토리가 없으면 생성
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // 디렉토리가 이미 존재하면 무시
    }

    // 파일 저장
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    // 파일 URL 생성
    const fileUrl = `/uploads/${filename}`;

    // 파일 타입 결정
    let fileType = 'other';
    if (file.type.startsWith('image/')) {
      fileType = 'image';
    } else if (file.type.startsWith('video/')) {
      fileType = 'video';
    } else if (file.type === 'application/pdf') {
      fileType = 'document';
    }

    return NextResponse.json({
      success: true,
      file: {
        id: uuidv4(),
        name: file.name,
        url: fileUrl,
        type: fileType,
        size: file.size,
        mimeType: file.type,
        uploadedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: '파일 업로드 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}