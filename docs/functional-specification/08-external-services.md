# 🌐 외부 서비스 연동 (External Services)

## 📋 개요

TOV 시스템에서 사용하는 외부 서비스 및 API 연동 명세입니다.

## ☁️ AWS Services

### S3 / Cloudflare R2 (Simple Storage Service)

#### 용도
- 파일 업로드 저장소
- 이미지 호스팅 (배너, 프로필, 썸네일)
- 문서 파일 저장 (자료실 리소스)
- 백업 스토리지

#### 설정
```env
AWS_REGION=ap-northeast-2
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=tov-homepage-resource-production
AWS_CLOUDFRONT_URL=https://d1234567890.cloudfront.net (선택)
NEXT_PUBLIC_S3_BUCKET_URL=https://tov-homepage-resource-production.s3.ap-northeast-2.amazonaws.com
```

#### 버킷 구조
```
tov-homepage-resource-production/
├── posts/              # 게시물 이미지
│   ├── thumbnails/     # 썸네일
│   └── content/        # 본문 이미지
├── consultations/      # 상담 첨부파일
├── profiles/           # 프로필 이미지
├── documents/          # 일반 문서
├── resources/          # 자료실 파일 (NEW)
│   ├── pdfs/          # PDF 문서
│   ├── excel/         # 엑셀 파일
│   └── hwp/           # HWP 파일
├── banners/            # 메인 배너 이미지 (NEW)
└── data-archive/       # 백업 및 아카이브
```

#### 보안 정책
- **버킷 정책**: Private (Pre-signed URL 사용, 1시간 만료)
- **CORS 설정**: 도메인 제한
- **암호화**: AES-256 (Server-side encryption)
- **Storage Class**: STANDARD_IA (비용 최적화)
- **버저닝**: 활성화
- **수명 주기**: 90일 후 Glacier 이동

#### S3Service 기능 (src/infrastructure/services/S3Service.ts)
- `uploadFile()`: 일반 파일 업로드
- `uploadImage()`: 이미지 파일 업로드 (메타데이터 포함)
- `getPresignedDownloadUrl()`: 다운로드용 사전서명 URL (1시간 유효)
- `deleteFile()`: 파일 삭제
- `fileExists()`: 파일 존재 여부 확인
- `listFiles()`: 파일 목록 조회
- `getPublicUrl()`: 공개 URL 생성

### CloudFront (CDN) - 프로덕션

#### 용도
- 정적 자원 캐싱
- 이미지 최적화
- 글로벌 배포

#### 캐시 정책
- 이미지: 1년
- CSS/JS: 1개월
- HTML: 캐시 무효화

## 📧 이메일 서비스

### 1. SendGrid (현재 권장)

#### 요금제
- **Free**: 일 100건 (현재 사용 가능)
- **Essentials**: $19.95/월 (40,000건)
- **Pro**: $89.95/월 (100,000건)

#### 설정
```env
SENDGRID_API_KEY=SG.xxxxx (선택)
EMAIL_FROM=noreply@tov.or.kr
```

#### 기능 (src/lib/email/email-service.ts)
- **템플릿 지원**: welcome, password-reset, notification, custom
- **일괄 발송**: 최대 1000명/배치
- **통계 분석**: 오픈율, 클릭율
- **스팸 필터링**: 자동 관리
- **Fallback**: SendGrid 미설정 시 console.log로 개발 모드 지원

#### 이메일 템플릿
1. `welcome` - 회원가입 환영
2. `password-reset` - 비밀번호 재설정
3. `account-suspended` - 계정 정지 안내
4. `notification` - 일반 알림
5. `custom` - 커스텀 HTML

### 2. Nodemailer (대체 옵션)

#### 지원 서비스
- **Gmail**: 일 500건 무료
- **Naver Mail**: 일 500건 무료
- **Outlook**: 일 300건 무료
- **Custom SMTP**: 제한 없음

#### 설정
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=app-password
EMAIL_FROM=your-email@gmail.com
```

#### Gmail 설정 프로세스
1. 2단계 인증 활성화
2. 앱 비밀번호 생성
3. 환경변수 설정
4. 서비스 재시작

## 🗺️ 지도 서비스

### Kakao Maps API

#### 용도
- 위치 표시 (찾아오시는 길)
- 주변 정보 표시
- 길찾기 연동

#### 설정
```env
NEXT_PUBLIC_KAKAO_MAP_API_KEY=f60ac689635543440ef447181e7f6af7
NEXT_PUBLIC_COMPANY_ADDRESS=서울 종로구 삼일대로 428 낙원상가 5층 500호
```

#### 구현
```javascript
// 지도 초기화
const container = document.getElementById('map');
const options = {
  center: new kakao.maps.LatLng(37.5733, 126.9881),
  level: 3
};
const map = new kakao.maps.Map(container, options);

// 마커 추가
const marker = new kakao.maps.Marker({
  position: new kakao.maps.LatLng(37.5733, 126.9881),
  map: map
});
```

#### 사용 제한
- 일 300,000건
- 초당 10건

## 💳 결제 서비스 (향후 구현)

### 결제 게이트웨이 옵션

#### 1. 아임포트 (I'mport)
- **지원 PG**: 모든 국내 PG사
- **수수료**: PG사별 상이 (2.2~3.3%)
- **특징**: 통합 관리

#### 2. 토스페이먼츠
- **수수료**: 2.4% + VAT
- **정기결제**: 지원
- **특징**: 간편 연동

#### 3. 카카오페이
- **수수료**: 2.5~3.3%
- **특징**: 카카오 계정 연동

### 후원 결제 프로세스
```
1. 후원 정보 입력
2. 결제 방법 선택
3. PG사 결제창 호출
4. 결제 완료
5. Webhook 수신
6. DB 업데이트
7. 영수증 발급
```

## 📊 분석 도구 (향후 구현)

### Google Analytics 4

#### 추적 항목
- 페이지뷰
- 사용자 행동
- 전환율
- 이벤트

#### 설정
```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Google Tag Manager

#### 태그 관리
- GA4 태그
- 페이스북 픽셀
- 전환 추적

#### 설정
```env
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

## 🔍 검색 엔진 (향후 구현)

### Elasticsearch

#### 용도
- 전문 검색
- 자동 완성
- 검색 분석

#### 인덱스 구조
```json
{
  "posts": {
    "mappings": {
      "properties": {
        "title": { "type": "text", "analyzer": "korean" },
        "content": { "type": "text", "analyzer": "korean" },
        "category": { "type": "keyword" },
        "createdAt": { "type": "date" }
      }
    }
  }
}
```

## 🔐 보안 서비스

### SSL 인증서

#### Let's Encrypt (무료)
- 90일 갱신
- 자동 갱신 스크립트
- Certbot 사용

### DDoS 방어 (향후)

#### Cloudflare
- 무료 플랜 가능
- DDoS 방어
- WAF 기능
- 캐싱

## 📱 푸시 알림 (향후 구현)

### Firebase Cloud Messaging

#### 용도
- 웹 푸시 알림
- 모바일 앱 푸시
- 토픽 기반 메시징

#### 설정
```env
FIREBASE_PROJECT_ID=tov-project
FIREBASE_PRIVATE_KEY=...
FIREBASE_CLIENT_EMAIL=...
```

## 🎨 미디어 처리

### 이미지 최적화

#### Sharp (Node.js)
- 썸네일 생성
- 리사이즈
- 포맷 변환 (WebP)
- 품질 조정

#### 설정
```javascript
const sharp = require('sharp');

// 썸네일 생성
await sharp(input)
  .resize(300, 200)
  .webp({ quality: 80 })
  .toFile(output);
```

## 📦 백업 서비스

### 자동 백업 전략

#### 데이터베이스
- **일일 백업**: 매일 새벽 3시
- **보관 기간**: 30일
- **저장 위치**: S3 Glacier

#### 파일 시스템
- **주간 백업**: 매주 일요일
- **보관 기간**: 90일
- **증분 백업**: 일일

## 🔄 CI/CD (향후 구현)

### GitHub Actions

#### 워크플로우
1. 코드 푸시
2. 테스트 실행
3. 빌드
4. Docker 이미지 생성
5. ECR 푸시
6. ECS 배포

### Docker

#### 컨테이너 구성
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📡 API 연동 현황

### 현재 사용 중
✅ **AWS S3 / Cloudflare R2** - 파일 스토리지 (배너, 자료실, 프로필)
✅ **SendGrid** - 이메일 발송 (템플릿 지원)
✅ **Kakao Maps** - 지도 서비스
✅ **MySQL 8.0** - 데이터베이스 (t2.micro 최적화)
✅ **Sharp** - 이미지 최적화
✅ **AWS SDK v3** - S3 클라이언트

### 구현 예정
⏳ Google Analytics 4 - 웹 분석
⏳ 결제 게이트웨이 - 후원 (아임포트/토스페이먼츠)
⏳ Firebase Cloud Messaging - 푸시 알림
⏳ Elasticsearch - 고급 검색
⏳ CloudFront - CDN 캐싱
⏳ OAuth 2.0 - 소셜 로그인 (테이블 준비 완료)

## 🔑 API 키 관리

### 보안 원칙
1. **환경변수 사용**: .env.local
2. **키 로테이션**: 3개월마다
3. **최소 권한 원칙**
4. **접근 로그 모니터링**

### 키 저장 위치
```
개발: .env.local (Git 제외)
프로덕션: AWS Secrets Manager
CI/CD: GitHub Secrets
```

## 📊 서비스 모니터링

### 헬스체크 엔드포인트
- `/api/health` - 전체 시스템 상태
- `/api/admin/db-monitor` - 데이터베이스 모니터링 (관리자)
  - 커넥션 풀 상태
  - 느린 쿼리 (>1000ms)
  - 메모리 사용량

### 성능 모니터링 (구현됨)
- **DB 커넥션 풀**: t2.micro 최적화 (5 connections, 2 max idle)
- **Keep-alive**: 5분마다 핑
- **Slow Query Detection**: 1초 이상 쿼리 자동 로깅
- **Memory Tracking**: Heap, RSS, External 메모리 추적
- **Query Performance**: 실행 시간 통계

### 알림 설정
- 서비스 다운: 즉시 알림
- 응답 지연: 5초 이상
- 에러율: 1% 이상
- 느린 쿼리: 1초 이상

## 🆕 최근 추가/개선된 외부 서비스 (2025년 1월)

### 추가된 서비스
1. **SendGrid 이메일 서비스**
   - 템플릿 기반 이메일 시스템
   - 일괄 발송 지원 (1000명/배치)
   - 개발 모드 fallback

2. **S3 서비스 강화**
   - 배너 이미지 전용 버킷 구조
   - 자료실 파일 관리
   - Presigned URL (1시간 유효)
   - STANDARD_IA 스토리지 클래스

3. **Sharp 이미지 처리**
   - 썸네일 자동 생성
   - WebP 변환
   - 이미지 최적화

### 개선된 모니터링
1. **DB 성능 모니터링**
   - 커넥션 풀 실시간 추적
   - 느린 쿼리 자동 감지
   - 메모리 사용량 추적

2. **Health Check**
   - `/api/health` 엔드포인트
   - DB 연결 상태 체크
   - 응답 시간 측정

### 준비된 인프라
- **소셜 로그인 테이블**: social_accounts, social_login_configs
- **2FA 테이블**: two_factor_auth, verification_codes
- **캐시 시스템**: cache_entries, image_optimizations
- **SEO 메타데이터**: page_metadata

---

*최종 업데이트: 2025년 1월 29일*