# AWS S3 자료실 설정 가이드

## 개요
토브 홈페이지의 자료실 파일들은 AWS S3 버킷 `tov-homepage-resource-production`의 `data-archive/` 경로에 저장됩니다.

## 환경변수 설정

`.env.local` 또는 `.env.production` 파일에 다음 환경변수를 설정해주세요:

```env
# AWS S3 Configuration
AWS_REGION=ap-northeast-2
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_S3_BUCKET=tov-homepage-resource-production

# Optional: CloudFront 사용 시
# AWS_CLOUDFRONT_URL=https://your-cloudfront-domain.cloudfront.net
```

## S3 버킷 구조

```
tov-homepage-resource-production/
└── data-archive/
    └── resources/
        ├── 2024/
        │   ├── 01/
        │   ├── 02/
        │   └── ...
        └── 2025/
            ├── 01/
            └── ...
```

파일들은 `data-archive/resources/년도/월/` 구조로 저장됩니다.

## AWS IAM 권한 설정

S3 접근을 위한 IAM 사용자에게 다음 권한이 필요합니다:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::tov-homepage-resource-production/*",
        "arn:aws:s3:::tov-homepage-resource-production"
      ]
    }
  ]
}
```

## S3 버킷 CORS 설정

외부에서 파일 다운로드를 허용하려면 S3 버킷에 CORS 설정이 필요합니다:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "HEAD", "PUT", "POST"],
    "AllowedOrigins": [
      "https://tov.or.kr",
      "https://www.tov.or.kr",
      "http://localhost:3000"
    ],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

## 파일 업로드 프로세스

1. **어드민 페이지에서 파일 선택**
   - `/admin/resources/new` 페이지에서 파일 업로드

2. **S3에 업로드**
   - 파일은 자동으로 `data-archive/resources/년도/월/` 경로에 저장
   - 파일명은 `타임스탬프_랜덤문자_원본파일명` 형식으로 저장

3. **데이터베이스에 정보 저장**
   - S3 키 경로가 `file_path`에 저장
   - 원본 파일명, 파일 크기 등 메타데이터 저장

## 파일 다운로드 프로세스

1. **다운로드 요청**
   - `/api/resources/{id}/download` 엔드포인트 호출

2. **Presigned URL 생성**
   - S3에서 1시간 유효한 Presigned URL 생성
   - 브라우저가 직접 S3에서 파일 다운로드

3. **다운로드 로그**
   - 다운로드 횟수 및 이력 자동 기록

## 보안 고려사항

1. **Presigned URL 사용**
   - S3 버킷은 private으로 설정
   - 다운로드 시 임시 URL 생성하여 제공

2. **파일 타입 제한**
   - PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, HWP, ZIP만 허용

3. **파일 크기 제한**
   - 필요시 업로드 크기 제한 설정 가능

4. **접근 권한 관리**
   - IAM 권한은 최소 필요 권한만 부여
   - 프로덕션 환경에서는 별도 IAM 사용자 사용 권장

## 백업 및 복구

1. **S3 버전 관리**
   - S3 버킷의 버전 관리 기능 활성화 권장
   - 실수로 삭제된 파일 복구 가능

2. **정기 백업**
   - S3 Cross-Region Replication 설정 고려
   - 중요 자료는 별도 백업 권장

## 모니터링

1. **CloudWatch 메트릭**
   - S3 버킷 사용량 모니터링
   - 비정상적인 다운로드 패턴 감지

2. **비용 관리**
   - S3 Intelligent-Tiering 활용
   - 오래된 파일은 Glacier로 이동 고려

## 문제 해결

### 업로드 실패
- AWS 자격 증명 확인
- S3 버킷 권한 확인
- 네트워크 연결 상태 확인

### 다운로드 실패
- Presigned URL 만료 시간 확인
- CORS 설정 확인
- 파일 존재 여부 확인

### 권한 오류
- IAM 정책 확인
- 환경변수 설정 확인
- S3 버킷 정책 확인