# 씨엠웨이(주) 웹사이트 프론트엔드 분석 보고서

## 1. 사이트 개요

### 기본 정보
- **회사명**: 씨엠웨이(주)
- **도메인**: cmway.kro.kr
- **주요 사업**: 건강식품 방문판매
- **사이트 언어**: 한국어(ko)
- **SSL 상태**: SSL 인증서 문제 존재 (webplus.idcsolution.co.kr 인증서 사용)

### 연락처
- **사무실**: 광주광역시 서구 월드컵4강로 186-1, 3층 302호(내방동)
- **공장**: 광주광역시 서구 월드컵4강로 186-1
- **전화**: 062-372-5267
- **팩스**: 062-372-5268
- **이메일**: cmway2025@outlook.com

## 2. 사이트 구조

### 2.1 메인 페이지 구성

#### 메인 비주얼 섹션
- **기능**: 슬라이드 형태의 메인 배너
- **기술**: Swiper.js를 이용한 자동 슬라이드 (6초 간격)
- **메시지**: "건강한 삶의 동반자, 씨엠웨이" 홍보

#### 메인 컨텐츠 섹션들

1. **WHO WE ARE**
   - 제목: 건강한 삶의 파트너, 씨엠웨이
   - 핵심 가치: 신뢰, 품질, 건강, 행복
   - 애니메이션: WOW.js 스크롤 애니메이션

2. **OUR PRODUCTS**
   - 제목: 씨엠웨이 주요 제품
   - 주요 제품군:
     - 홍삼 제품
     - 비타민/미네랄
     - 프로바이오틱스
     - 오메가3/영양제
   - 구성: 4개 카드 레이아웃

3. **HEALTH & WELLNESS**
   - 제목: 고객님의 건강한 내일을 위한 씨엠웨이의 약속
   - 비전 메시지 표시

4. **빠른 메뉴**
   - 제품 카탈로그
   - 건강정보
   - 고객후기
   - 아이콘 기반 네비게이션

### 2.2 네비게이션 구조

```
├── 회사소개
│   ├── 인사말 (../wp_2ds/01_01.html)
│   ├── 회사연혁 (../wp_history/index.html)
│   ├── 사업자정보 (../wp_2ds/01_03.html)
│   └── 인증서 (../wp_2ds/01_04.html)
│
├── 제품소개
│   ├── 홍삼 제품 (../wp_2ds/02_01.html)
│   ├── 비타민/미네랄 (../wp_2ds/02_02.html)
│   ├── 프로바이오틱스 (../wp_2ds/02_03.html)
│   └── 오메가3/영양제 (../wp_2ds/02_04.html)
│
├── 건강정보
│   ├── 건강 칼럼 (../wp_2ds/03_01.html)
│   ├── 영양 가이드 (../wp_2ds/03_02.html)
│   ├── 제품 활용법 (../wp_2ds/03_03.html)
│   └── FAQ (../wp_2ds/03_04.html)
│
├── 고객센터
│   ├── 공지사항 (../wp_board/index.html?code=notice)
│   ├── 고객후기 (../wp_board/index.html?code=review)
│   └── 문의하기 (../wp_board/index.html?code=inquiry)
│
└── 자료실
    └── 제품 카탈로그 (../wp_board/index.html?code=catalog)
```

## 3. 기술 스택 상세

### 3.1 JavaScript 라이브러리

| 라이브러리 | 버전 | 용도 |
|----------|------|------|
| jQuery | 3.5.1, 2.2.4, 1.8.2 | DOM 조작, 이벤트 처리 (다중 버전) |
| Swiper.js | - | 메인 비주얼 슬라이드 |
| WOW.js | - | 스크롤 애니메이션 트리거 |
| Colorbox | - | 모달/팝업 기능 |
| HuskyEZCreator | - | 텍스트 에디터 |

### 3.2 CSS 프레임워크 및 스타일

| 스타일시트 | 용도 |
|-----------|------|
| Swiper CSS | 슬라이드 스타일링 |
| Animate.css | CSS 애니메이션 효과 |
| Colorbox CSS | 모달 스타일링 |
| Custom CSS | 사이트 고유 스타일 |

### 3.3 웹폰트

| 폰트명 | 굵기 | 형식 |
|--------|------|------|
| Noto Sans KR | 300, 400, 500, 600 | woff, woff2 |
| Spoqa Han Sans Neo | 400, 700 | woff, woff2 |
| Ubuntu | 500, 700 | woff2 |

## 4. 프론트엔드 아키텍처

### 4.1 구조 유형
- **타입**: Traditional MPA (Multi-Page Application)
- **CMS 스타일**: 폴더 기반 커스텀 CMS
- **명명 규칙**: wp_ 접두사 사용

### 4.2 폴더 구조

```
cmway.kro.kr/
├── wp_main/          # 메인 페이지
├── wp_2ds/           # 정적 컨텐츠 페이지
├── wp_product/       # 제품 정보 (동적)
├── wp_board/         # 게시판 (동적)
├── wp_history/       # 회사연혁 (동적)
├── wp_config/        # CSS/JS 설정
├── wp_images/        # 이미지 리소스
└── wp_default_image/ # 기본 이미지/아이콘
```

### 4.3 페이지 구조

#### 메인 페이지
- **레이아웃**: Fixed header + Main visual + Content sections + Footer
- **Body ID**: `main_body`
- **특징**: 풀페이지 비주얼, 섹션별 애니메이션

#### 서브 페이지
- **레이아웃**: Fixed header + Breadcrumb + Sub navigation + Content + Footer
- **Body ID**: `sub_body`
- **특징**: 일관된 헤더/푸터, 좌측 서브 네비게이션

## 5. 반응형 디자인

### 5.1 브레이크포인트
- **기준점**: 1024px
- **전략**: Desktop-first 접근법

### 5.2 모바일 최적화
- **모바일 메뉴**: 햄버거 메뉴 타입
- **뷰포트**: `width=device-width, initial-scale=1.0`
- **터치 지원**: 슬라이드 및 네비게이션

## 6. 인터랙티브 요소

### 6.1 애니메이션 효과
- **비주얼 슬라이드**: Swiper.js, 6초 자동 재생
- **스크롤 애니메이션**: WOW.js + Animate.css 조합
- **호버 효과**: 메뉴, 버튼, 카드에 적용
- **스티키 헤더**: 100px 스크롤 시 활성화

### 6.2 사용자 인터랙션
- **팝업/모달**: Colorbox를 이용한 이미지 갤러리
- **드롭다운 메뉴**: jQuery 기반 2단계 메뉴
- **탭 네비게이션**: 서브페이지 내 콘텐츠 전환

## 7. SEO 및 메타데이터

### 7.1 메타 태그
```html
<meta name="keywords" content="건강식품, 건강기능식품, 홍삼, 비타민, 프로바이오틱스, 오메가3, 영양제, 씨엠웨이">
<meta name="description" content="씨엠웨이 건강식품 방문판매, 홍삼, 비타민, 프로바이오틱스, 영양제 전문">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### 7.2 Open Graph
```html
<meta property="og:url" content="http://cmway.kro.kr">
<meta property="og:type" content="website">
<meta property="og:title" content="씨엠웨이(주) - 건강한 삶의 동반자">
<meta property="og:image" content="http://cmway.kro.kr/wp_default_image/logo_opengraph.png">
<meta property="og:description" content="씨엠웨이 건강식품 방문판매, 홍삼, 비타민, 프로바이오틱스, 영양제 전문">
```

### 7.3 기타 SEO 요소
- **Twitter Card**: summary 타입
- **Canonical URL**: http://cmway.kro.kr
- **Favicon**: /wp_default_image/favicon.ico
- **Naver 인증**: 사이트 인증 메타태그 포함

## 8. 접근성 기능

- **Skip Navigation**: 키보드 사용자를 위한 빠른 이동
- **Screen Reader 지원**: 기본적인 ARIA 레이블
- **키보드 네비게이션**: Tab 키를 통한 순차 이동
- **대체 텍스트**: 이미지 alt 속성

## 9. 분석 및 추적

### 9.1 데이터 수집
- **화면 해상도 추적**: /wp_analysis/resolution.php
- **리퍼러 추적**: referer_info 쿠키
- **네이버 웹마스터**: 사이트 인증 및 수집

## 10. 성능 고려사항

### 10.1 현재 이슈
1. **다중 jQuery 버전**: 3개의 다른 버전 동시 로드 (성능 저하 가능)
2. **SSL 인증서 문제**: 다른 도메인의 인증서 사용
3. **레거시 브라우저 지원**: IE Edge 지원으로 인한 폴리필

### 10.2 최적화 제안
1. jQuery 버전 통합 필요
2. SSL 인증서 교체 필요
3. 이미지 lazy loading 적용 고려
4. CSS/JS 번들링 및 압축
5. 캐싱 전략 수립

## 11. 브라우저 호환성

- **지원 브라우저**: Chrome, Firefox, Safari, Edge
- **최소 요구사항**: IE Edge 이상
- **모바일 브라우저**: iOS Safari, Chrome Mobile

## 12. 개선 권장사항

### 12.1 긴급 개선사항
1. **SSL 인증서 문제 해결**: 도메인에 맞는 인증서 설치
2. **jQuery 버전 정리**: 하나의 버전으로 통합

### 12.2 중기 개선사항
1. **성능 최적화**
   - 제품 이미지 최적화 및 lazy loading
   - CSS/JS 파일 압축 및 번들링
   - CDN 활용

2. **접근성 개선**
   - WCAG 2.1 AA 수준 준수
   - 키보드 접근성 강화
   - 스크린 리더 호환성 개선

3. **건강식품 특화 기능**
   - 제품 필터링 및 검색 기능 강화
   - 영양성분 표시 기능
   - 제품 비교 기능

### 12.3 장기 개선사항
1. **모던 프레임워크 마이그레이션**
   - React/Vue.js 같은 현대적 프레임워크 도입 검토
   - 컴포넌트 기반 아키텍처로 전환

2. **PWA 도입**
   - 오프라인 카탈로그 지원
   - 앱 같은 사용자 경험
   - 푸시 알림 기능

3. **고객 경험 강화**
   - 개인화된 제품 추천 시스템
   - 온라인 상담 챗봇
   - 회원 등급별 혜택 제공

4. **CMS 현대화**
   - 헤드리스 CMS 도입 검토
   - API 기반 콘텐츠 관리
   - 제품 재고 관리 시스템 통합

## 13. 결론

씨엠웨이(주) 웹사이트는 전통적인 기업 웹사이트 구조를 가지고 있으며, 건강식품 방문판매 전문업체로서의 신뢰성을 효과적으로 표현하고 있습니다. 기본적인 반응형 디자인과 인터랙티브 요소들이 구현되어 있으나, SSL 인증서 문제와 다중 jQuery 버전 사용 등 기술적 개선이 필요한 부분들이 존재합니다.

사이트는 고객에게 필요한 건강식품 정보를 체계적으로 제공하고 있으며, 기업의 신뢰성과 제품의 품질을 강조하는 디자인과 콘텐츠 구성을 갖추고 있습니다. 단기적으로는 기술적 이슈들을 해결하고, 중장기적으로는 현대적인 웹 기술 도입을 고려할 필요가 있습니다.