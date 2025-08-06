import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase 설정
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lpkftdzjqphibqzmjqxn.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxwa2Z0ZHpqcXBoaWJxem1qcXhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5ODkyMjAsImV4cCI6MjA1MTU2NTIyMH0.ibrYL3j7I7n_61UI-8E-Q7MZyyDzB5xDjvI5XvL3dUM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadHeroImages() {
  try {
    console.log('히어로 이미지 업로드 시작...');
    
    // mock 폴더 경로
    const mockDir = path.join(__dirname, '..', 'public', 'mock');
    
    // 이미지 파일 목록
    const imageFiles = ['slide1.jpg', 'slide2.jpg', 'slide3.jpg'];
    
    // 업로드된 이미지 URL들을 저장할 배열
    const uploadedImages = [];
    
    for (const fileName of imageFiles) {
      const filePath = path.join(mockDir, fileName);
      
      // 파일 읽기
      const fileBuffer = await fs.readFile(filePath);
      
      // 파일 업로드 경로 (hero 폴더에 저장)
      const uploadPath = `hero/${fileName}`;
      
      console.log(`업로드 중: ${fileName} -> ${uploadPath}`);
      
      // Supabase Storage에 업로드
      const { data, error } = await supabase.storage
        .from('images')
        .upload(uploadPath, fileBuffer, {
          contentType: 'image/jpeg',
          upsert: true // 이미 존재하면 덮어쓰기
        });
      
      if (error) {
        console.error(`업로드 실패 (${fileName}):`, error.message);
        continue;
      }
      
      // 공개 URL 가져오기
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(uploadPath);
      
      console.log(`업로드 완료: ${publicUrl}`);
      uploadedImages.push({
        name: fileName,
        path: uploadPath,
        url: publicUrl
      });
    }
    
    console.log('\n모든 이미지 업로드 완료!');
    console.log('업로드된 이미지 정보:');
    uploadedImages.forEach(img => {
      console.log(`- ${img.name}: ${img.url}`);
    });
    
    // 히어로 섹션 설정을 위한 데이터 준비
    const heroData = {
      slides: uploadedImages.map((img, index) => ({
        id: `slide-${index + 1}`,
        image: img.url,
        title: {
          ko: `슬라이드 ${index + 1}`,
          en: `Slide ${index + 1}`
        },
        subtitle: {
          ko: `히어로 섹션 슬라이드 ${index + 1}`,
          en: `Hero Section Slide ${index + 1}`
        },
        link: '/',
        is_active: true,
        order: index
      }))
    };
    
    console.log('\n히어로 섹션 데이터 구조:');
    console.log(JSON.stringify(heroData, null, 2));
    
    // site_settings 테이블에 히어로 이미지 정보 저장
    const { error: updateError } = await supabase
      .from('site_settings')
      .upsert({
        id: 1, // 기본 설정 ID
        hero_images: heroData.slides,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      });
    
    if (updateError) {
      console.error('히어로 설정 업데이트 실패:', updateError.message);
    } else {
      console.log('\n히어로 이미지 설정이 데이터베이스에 저장되었습니다.');
    }
    
  } catch (error) {
    console.error('오류 발생:', error);
  }
}

// 스크립트 실행
uploadHeroImages();