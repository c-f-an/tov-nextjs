# 📧 무료 이메일 서비스 설정 가이드

TOV 프로젝트에서 무료로 이메일을 발송할 수 있는 설정 방법입니다.

## 📌 지원 서비스

- **Gmail** (권장) - 일일 500건 무료
- **Naver Mail** - 일일 500건 무료
- **Outlook/Hotmail** - 일일 300건 무료
- **사용자 정의 SMTP** - 제한 없음

## 🔧 Gmail 설정 방법 (권장)

### 1단계: 2단계 인증 활성화

1. [Google 계정 설정](https://myaccount.google.com/security) 접속
2. "2단계 인증" 클릭
3. 화면 안내에 따라 2단계 인증 설정 완료

### 2단계: 앱 비밀번호 생성

1. [앱 비밀번호 페이지](https://myaccount.google.com/apppasswords) 접속
2. 앱 선택: "메일"
3. 기기 선택: "기타(맞춤 이름)"
4. 이름 입력: "TOV Email Service"
5. "생성" 클릭
6. **16자리 앱 비밀번호 복사** (공백 제거)

### 3단계: 환경변수 설정

`.env.local` 파일에 추가:

```env
# Gmail 설정
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx  # 16자리 앱 비밀번호 (공백 포함 가능)
EMAIL_FROM=your-email@gmail.com
```

## 📮 Naver Mail 설정 방법

### 1단계: SMTP 사용 설정

1. [Naver 메일 환경설정](https://mail.naver.com/option/imap) 접속
2. "POP3/IMAP 설정" 탭 선택
3. "POP3/SMTP 사용함" 선택
4. 저장

### 2단계: 환경변수 설정

`.env.local` 파일에 추가:

```env
# Naver 설정
EMAIL_SERVICE=naver
EMAIL_USER=your-id@naver.com
EMAIL_PASS=your-naver-password  # 네이버 로그인 비밀번호
EMAIL_FROM=your-id@naver.com
```

## 📬 Outlook/Hotmail 설정 방법

### 1단계: 앱 비밀번호 생성 (2단계 인증 사용 시)

1. [Microsoft 계정 보안](https://account.microsoft.com/security) 접속
2. "추가 보안 옵션"
3. "앱 암호" 섹션에서 "새 앱 암호 만들기"
4. 생성된 비밀번호 복사

### 2단계: 환경변수 설정

`.env.local` 파일에 추가:

```env
# Outlook 설정
EMAIL_SERVICE=outlook
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-app-password  # 앱 비밀번호 또는 일반 비밀번호
EMAIL_FROM=your-email@outlook.com
```

## 🔐 사용자 정의 SMTP 설정

자체 메일 서버가 있는 경우:

```env
# Custom SMTP 설정
EMAIL_SERVICE=custom
EMAIL_USER=your-email@yourdomain.com
EMAIL_PASS=your-password
EMAIL_FROM=noreply@yourdomain.com
SMTP_HOST=smtp.yourdomain.com
SMTP_PORT=587
SMTP_SECURE=false  # true for 465, false for 587
```

## ⚙️ 코드에서 서비스 전환

### SendGrid에서 무료 서비스로 전환 (이미 설정됨)

`/api/admin/users/send-email/route.ts`와 `/api/admin/users/create/route.ts`에서:

```typescript
// SendGrid 서비스 (유료)
// import { emailService } from "@/lib/email/email-service";

// 무료 이메일 서비스 (Gmail, Naver, Outlook 등)
import { freeEmailService as emailService } from "@/lib/email/free-email-service";
```

## 🧪 테스트 방법

1. 환경변수 설정 완료
2. 서버 재시작: `npm run dev`
3. 회원 관리 → 이메일 발송 테스트
4. 콘솔에서 성공 메시지 확인

## ⚠️ 주의사항

### Gmail
- 일일 발송 한도: 500건
- 분당 발송 한도: 20건
- 보안 수준이 낮은 앱 액세스는 지원 중단됨 (앱 비밀번호 필수)

### Naver
- 일일 발송 한도: 500건
- 첨부파일 크기: 최대 25MB
- 해외 IP에서 접속 시 추가 인증 필요

### Outlook
- 일일 발송 한도: 300건
- 분당 발송 한도: 30건
- 받는 사람 수: 최대 100명

## 🚨 문제 해결

### "Invalid login" 오류
- 앱 비밀번호가 올바른지 확인
- 2단계 인증이 활성화되어 있는지 확인
- 이메일 주소와 비밀번호가 일치하는지 확인

### "Connection timeout" 오류
- 방화벽 설정 확인 (포트 587 또는 465)
- SMTP 설정이 올바른지 확인
- VPN 사용 시 비활성화 후 테스트

### 이메일이 스팸함으로 가는 경우
- SPF, DKIM 설정 권장
- 발신자 이메일을 실제 도메인 이메일로 변경
- 메일 내용에 스팸 키워드 제거

## 📝 환경변수 예시 (Gmail)

`.env.local` 파일:

```env
# Database
DATABASE_URL="mysql://dev_tov_user:qwe123@localhost:3306/dev_tov"

# Email Configuration (Free Service)
EMAIL_SERVICE=gmail
EMAIL_USER=tov.service@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop  # 실제 앱 비밀번호로 교체
EMAIL_FROM=TOV Service <tov.service@gmail.com>

# 기타 설정들...
```

## 🎯 추천 설정

1. **개발 환경**: 콘솔 출력 (이메일 인증 불필요)
2. **테스트 환경**: Gmail 무료 계정
3. **프로덕션 환경**:
   - 소규모: Gmail 비즈니스 계정
   - 대규모: SendGrid, AWS SES 등 유료 서비스

## 📞 지원

문제가 있으시면 다음을 확인해주세요:
- 환경변수가 올바르게 설정되었는지
- 이메일 서비스에서 SMTP를 허용했는지
- 앱 비밀번호를 사용하고 있는지 (2단계 인증 사용 시)

---

*이 가이드는 TOV 프로젝트의 무료 이메일 서비스 설정을 위한 것입니다.*