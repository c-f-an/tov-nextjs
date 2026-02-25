#!/bin/bash
# post-edit.sh
# PostToolUse 훅: 소스 파일 수정 시 관련 테스트 자동 실행
# - 테스트 파일 존재 → 실행 후 결과 보고
# - 테스트 파일 없음 → Claude에게 생성 요청

set -euo pipefail

# stdin에서 JSON 읽기
INPUT=$(cat)

# jq 없으면 건너뜀
if ! command -v jq &>/dev/null; then
  exit 0
fi

# 수정된 파일 경로 추출
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty' 2>/dev/null)
[ -z "$FILE_PATH" ] && exit 0

# TypeScript/JavaScript 파일만 처리
[[ "$FILE_PATH" =~ \.(ts|tsx|js|jsx)$ ]] || exit 0

# 제외 대상: 테스트 파일 자체, node_modules, .next, 설정 파일
[[ "$FILE_PATH" =~ \.(test|spec)\.(ts|tsx|js|jsx)$ ]] && exit 0
[[ "$FILE_PATH" =~ /(node_modules|\.next|dist|\.claude)/ ]] && exit 0
[[ "$FILE_PATH" =~ /(tailwind|eslint|postcss|next\.config|vitest\.config|jest\.config)/ ]] && exit 0
[[ "$FILE_PATH" =~ globals\.css$ ]] && exit 0

# 파일명 파싱
BASENAME=$(basename "$FILE_PATH")
DIRNAME=$(dirname "$FILE_PATH")
STEM="${BASENAME%.*}"
EXT="${BASENAME##*.}"

# 관련 테스트 파일 탐색
FOUND_TEST=""
for CANDIDATE in \
  "${DIRNAME}/${STEM}.test.${EXT}" \
  "${DIRNAME}/${STEM}.spec.${EXT}" \
  "${DIRNAME}/__tests__/${STEM}.test.${EXT}" \
  "${CLAUDE_PROJECT_DIR:-$PWD}/src/__tests__/${STEM}.test.${EXT}"; do
  if [ -f "$CANDIDATE" ]; then
    FOUND_TEST="$CANDIDATE"
    break
  fi
done

# 프로젝트 루트로 이동
cd "${CLAUDE_PROJECT_DIR:-$PWD}" 2>/dev/null || exit 0

if [ -n "$FOUND_TEST" ]; then
  echo "🧪 테스트 실행 중: $(basename "$FOUND_TEST")" >&2

  # Vitest 우선, Jest 차선
  if npx vitest run "$FOUND_TEST" --reporter=verbose 2>&1; then
    echo "✅ 테스트 통과: $(basename "$FOUND_TEST")" >&2
    exit 0
  elif npx jest "$FOUND_TEST" --no-coverage 2>&1; then
    echo "✅ 테스트 통과: $(basename "$FOUND_TEST")" >&2
    exit 0
  else
    echo "❌ 테스트 실패: $(basename "$FOUND_TEST")" >&2
    echo "위 테스트 실패를 확인하고 코드 또는 테스트를 수정해주세요." >&2
    exit 2
  fi

else
  # 테스트 없음 → Claude에게 생성 요청
  RELATIVE_PATH="${FILE_PATH#${CLAUDE_PROJECT_DIR:-$PWD}/}"
  echo "⚠️  테스트 파일 없음: ${RELATIVE_PATH}" >&2
  echo "CLAUDE.md 규칙에 따라 이 파일의 핵심 로직에 대한 테스트를 생성해주세요." >&2
  echo "테스트 위치: ${DIRNAME}/${STEM}.test.${EXT}" >&2
  exit 2
fi
