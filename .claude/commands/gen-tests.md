---
description: 현재 작업 중인 파일의 테스트 코드를 생성합니다
---

방금 수정하거나 생성한 파일에 대한 Vitest 테스트를 작성해줘.

## 테스트 생성 규칙

1. **테스트 파일 위치**: 소스 파일과 같은 디렉토리에 `[파일명].test.ts` 로 생성
2. **테스트 프레임워크**: Vitest (import from 'vitest')
3. **테스트 대상 우선순위**:
   - 핵심 비즈니스 로직 (use-cases, domain services)
   - 엣지 케이스와 에러 시나리오
   - 성공 케이스

## 각 레이어별 테스트 방식

### Use Case / Domain Service
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('XxxUseCase', () => {
  // Repository는 Mock으로 대체
  const mockRepo = { findById: vi.fn(), create: vi.fn() };

  beforeEach(() => { vi.clearAllMocks(); });

  it('정상 케이스: [기대 동작 설명]', async () => {
    mockRepo.findById.mockResolvedValue({ id: 1, ... });
    // ...
    expect(result).toEqual(expected);
  });

  it('에러 케이스: [에러 상황 설명]', async () => {
    mockRepo.findById.mockResolvedValue(null);
    await expect(useCase.execute(999)).rejects.toThrow('Not found');
  });
});
```

### MySQL Repository
```typescript
import { describe, it, expect, vi } from 'vitest';

// DB 연결은 Mock 처리
vi.mock('@/infrastructure/database/mysql', () => ({
  default: { execute: vi.fn() }
}));

describe('MySQLXxxRepository', () => {
  it('findById: 존재하는 ID로 조회 시 엔티티 반환', async () => {
    // mock execute 설정
    // repository.findById() 호출
    // 결과 검증
  });
});
```

### 유틸 함수
```typescript
import { describe, it, expect } from 'vitest';
import { targetFunction } from './targetFile';

describe('targetFunction', () => {
  it('정상 입력으로 올바른 결과 반환', () => {
    expect(targetFunction(input)).toBe(expected);
  });
});
```

## 추가 지시사항

- Vitest가 package.json에 없으면 설치 명령어도 함께 안내: `npm install -D vitest`
- `vitest.config.ts`가 없으면 기본 설정 파일도 생성 제안
- 생성 후 `npx vitest run [테스트파일경로]` 로 테스트 실행
- DB, 외부 서비스는 반드시 Mock 처리하여 실제 연결 없이 테스트 가능하게 구성
