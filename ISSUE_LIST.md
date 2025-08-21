# 개발 이슈 리스트

## 1. 미구현 페이지 (Header.tsx에서 참조하는 경로)

### 알림마당 카테고리 페이지
현재 Header.tsx에서 정적 경로로 링크되어 있으나, 실제로는 동적 라우팅(`[category]`)으로 처리되도록 설계되어 있어 404 에러 발생
- [ ] `/board/notice` - 공지사항
- [ ] `/board/news` - 토브소식  
- [ ] `/board/media` - 언론보도
- [ ] `/board/publication` - 발간자료
- [ ] `/board/resource` - 자료실
- [ ] `/board/activity` - 활동소식

### 기타 미구현 페이지
- [ ] `/education` - 교육 프로그램 (QuickLinks.tsx에서 참조)
- [ ] `/news/notice` - 공지사항 (Footer.tsx에서 참조, 잘못된 경로)
- [ ] `/privacy` - 개인정보처리방침 (Footer.tsx에서 참조)
- [ ] `/terms` - 이용약관 (Footer.tsx에서 참조)
- [ ] `/sitemap` - 사이트맵 (Footer.tsx에서 참조)

## 2. 경로 불일치 문제

### Header.tsx vs 실제 구현
- Header.tsx: `/board/notice`, `/board/news` 등 정적 경로 사용
- 실제 구현: `/board/[category]` 동적 라우팅 사용
- **해결 방안**: 
  1. 카테고리별 정적 페이지 생성
  2. 또는 Header.tsx 링크를 동적 라우팅에 맞게 수정

### Footer.tsx 잘못된 경로
- Footer.tsx: `/news/notice` 
- 올바른 경로: `/board/notice` (Header.tsx 기준)
- **해결 방안**: Footer 컴포넌트의 링크 수정 필요

## 3. 구현 우선순위

### 높음 (핵심 기능)
1. 알림마당 카테고리 페이지 정리 (정적 vs 동적 라우팅 결정)
2. 개인정보처리방침 페이지
3. 이용약관 페이지

### 중간 (사용자 경험)
4. 교육 프로그램 페이지
5. 사이트맵 페이지

### 낮음 (참조 오류 수정)
6. Footer.tsx의 잘못된 링크 수정

## 4. 기술적 고려사항

### 동적 라우팅 vs 정적 페이지
현재 `/board/[category]` 구조로 되어 있으며, `categoryMapping`에 카테고리 정보가 정의되어 있음.
- 장점: 카테고리 추가/수정이 용이
- 단점: 정적 경로로 직접 접근 시 처리 필요

### 데이터베이스 카테고리 연동
`getCategory` 함수에서 API를 통해 카테고리 정보를 가져오도록 구현되어 있으나, 
실제 카테고리 데이터가 DB에 없으면 404 에러 발생

## 5. 추가 확인 필요 사항
- [ ] 카테고리 데이터베이스 시드 데이터 확인
- [ ] API 엔드포인트 동작 확인 (`/api/categories`)
- [ ] 사용자 권한별 페이지 접근 제어 구현 여부

## 6. 기존 개발 완료 페이지
### 협회소개 섹션 ✅
- `/about` - 협회소개 메인 페이지
- `/about/greeting` - 인사말 페이지
- `/about/purpose` - 설립목적 페이지
- `/about/business` - 주요사업 페이지
- `/about/organization` - 조직도 페이지
- `/about/location` - 오시는길 페이지

### 자료실 섹션 ✅
- `/resources` - 자료실 메인 페이지
- `/resources/religious-income` - 종교인소득 페이지
- `/resources/nonprofit-finance` - 비영리재정 페이지
- `/resources/settlement` - 결산공시 페이지
- `/resources/laws` - 관계법령 페이지

### 상담센터 섹션 ✅
- `/consultation` - 상담센터 메인 페이지
- `/consultation/apply` - 상담신청 페이지
- `/consultation/guide` - 상담안내 페이지
- `/consultation/faq` - FAQ 페이지
- `/consultation/list` - 상담목록 페이지
- `/consultation/[id]` - 상담 상세 페이지

### 후원하기 섹션 ✅
- `/donation` - 후원하기 메인 페이지
- `/donation/apply` - 후원신청 페이지
- `/donation/guide` - 후원안내 페이지
- `/donation/report` - 재정보고 페이지

### 사용자 페이지 ✅
- `/mypage` - 마이페이지
- `/login` - 로그인 페이지
- `/register` - 회원가입 페이지

### 관리자 페이지 ✅
- `/admin` - 관리자 메인 페이지
- `/admin/posts` - 게시글 관리 페이지
- `/admin/consultations` - 상담 관리 페이지
- `/admin/donations` - 후원 관리 페이지
- `/admin/categories` - 카테고리 관리 페이지
- `/admin/sponsors` - 후원자 목록 페이지
- `/admin/users` - 회원 관리 페이지
- `/admin/settings` - 사이트 설정 페이지
- `/admin/profile` - 프로필 설정 페이지

### 게시판 섹션 ✅
- `/board` - 게시판 메인 페이지
- `/board/[category]` - 카테고리별 게시판 (동적 라우팅)
- `/board/[category]/[id]` - 게시글 상세 페이지
- `/board/[category]/write` - 게시글 작성 페이지

### FAQ 페이지 ✅
- `/faq` - FAQ 메인 페이지