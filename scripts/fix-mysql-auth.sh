#!/bin/bash

# MySQL 사용자 인증 방식 변경 스크립트
# 주의: DBA 권한이 필요합니다

echo "🔧 MySQL Authentication Fix Script"
echo "=================================="
echo ""
echo "이 스크립트는 tov-client 사용자의 인증 방식을 변경하는 SQL을 생성합니다."
echo ""
echo "📝 DBA에게 다음 SQL을 실행하도록 요청하세요:"
echo ""
echo "-- MySQL 8.0에서 sha256_password를 mysql_native_password로 변경"
echo "ALTER USER 'tov-client'@'%' IDENTIFIED WITH mysql_native_password BY 'A0oMDPDoRn3H6Y0';"
echo "FLUSH PRIVILEGES;"
echo ""
echo "또는"
echo ""
echo "-- 새로운 사용자 생성 (기존 사용자가 변경 불가능한 경우)"
echo "CREATE USER 'tov-client-native'@'%' IDENTIFIED WITH mysql_native_password BY 'A0oMDPDoRn3H6Y0';"
echo "GRANT ALL PRIVILEGES ON tov_prod.* TO 'tov-client-native'@'%';"
echo "FLUSH PRIVILEGES;"
echo ""
echo "📌 변경 후 .env 파일 업데이트:"
echo "DATABASE_URL=\"mysql://tov-client-native:A0oMDPDoRn3H6Y0@localhost:3307/tov_prod\""
echo ""
echo "⚠️  보안 주의사항:"
echo "- 프로덕션에서는 더 강력한 비밀번호를 사용하세요"
echo "- IP 제한을 사용하여 '%' 대신 특정 호스트만 허용하세요"