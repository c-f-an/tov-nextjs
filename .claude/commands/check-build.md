---
description: TypeScript 타입 체크와 린트를 실행하여 빌드 에러를 확인합니다
---

빌드 에러가 없는지 확인해줘.

## 실행 순서

다음을 순서대로 실행하고 결과를 보고해줘.

### 1단계: TypeScript 타입 체크

```bash
npx tsc --noEmit 2>&1
```

- 에러 없음 → 2단계 진행
- 에러 있음 → 에러 목록 출력 후 원인 분석 및 수정

### 2단계: Next.js 린트

```bash
yarn lint 2>&1
```

또는 yarn이 없으면:

```bash
npx next lint 2>&1
```

- 에러/경고 없음 → 완료
- 에러 있음 → 에러 목록 출력 후 원인 분석 및 수정

## 결과 보고 형식

```
✅ TypeScript: 타입 에러 없음
✅ Lint: 린트 에러 없음
→ 빌드 에러 없음. 배포 준비 완료.
```

또는 에러가 있을 경우:

```
❌ TypeScript 에러 발견:
  - src/app/xxx.tsx:42 - TS2322: ...
  - src/lib/yyy.ts:10 - TS2339: ...

❌ Lint 에러 발견:
  - src/app/zzz.tsx - no-unused-vars: ...

→ 위 에러를 수정한 후 다시 /check-build 를 실행해주세요.
```

## 주의사항

- TypeScript 에러는 반드시 수정하고 넘어갈 것 (any 남용 금지)
- Lint 경고(warning)는 선택적으로 수정, 에러(error)는 필수 수정
- 수정 후에는 `/check-build` 를 다시 실행하여 모든 에러가 해결됐는지 확인
