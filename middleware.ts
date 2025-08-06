import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  // 테스트용 간단한 미들웨어
  const res = NextResponse.next()
  
  // 관리자 페이지 접근 시 체크
  if (req.nextUrl.pathname.startsWith('/admin')) {
    // 로그인 페이지는 체크하지 않음
    if (req.nextUrl.pathname === '/login') {
      return res
    }
    
    // 테스트용: 세션 스토리지나 쿠키로 간단한 체크
    // 실제로는 클라이언트 사이드에서 체크하도록 함
    // 프로덕션에서는 Supabase Auth 사용 필요
  }
  
  return res
}

export const config = {
  matcher: ['/admin/:path*'],
}