#!/bin/bash

# EC2에서 데이터베이스 데이터 확인 스크립트
# 사용법: EC2에서 이 스크립트 실행

echo "Checking database data on EC2..."

# 환경변수 파일 읽기
if [ -f /apps/tov-homepage/current/.env ]; then
    export $(cat /apps/tov-homepage/current/.env | grep DATABASE_URL | xargs)
fi

# DATABASE_URL 파싱
if [ -z "$DATABASE_URL" ]; then
    echo "DATABASE_URL not found!"
    exit 1
fi

# URL에서 정보 추출
DB_USER=$(echo $DATABASE_URL | sed -n 's/.*mysql:\/\/\([^:]*\).*/\1/p')
DB_PASS=$(echo $DATABASE_URL | sed -n 's/.*mysql:\/\/[^:]*:\([^@]*\).*/\1/p')
DB_HOST=$(echo $DATABASE_URL | sed -n 's/.*@\([^:\/]*\).*/\1/p')
DB_PORT=$(echo $DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
DB_NAME=$(echo $DATABASE_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')

echo "Connecting to database..."

# 카테고리 확인
echo -e "\n=== Categories ==="
mysql -h $DB_HOST -P $DB_PORT -u $DB_USER -p$DB_PASS $DB_NAME -e "SELECT id, name, slug, type FROM categories;"

# 게시글 수 확인
echo -e "\n=== Posts Count by Category ==="
mysql -h $DB_HOST -P $DB_PORT -u $DB_USER -p$DB_PASS $DB_NAME -e "
SELECT c.name as category, COUNT(p.id) as post_count 
FROM categories c 
LEFT JOIN posts p ON c.id = p.category_id 
GROUP BY c.id, c.name;"

# 최근 게시글 확인
echo -e "\n=== Recent Posts ==="
mysql -h $DB_HOST -P $DB_PORT -u $DB_USER -p$DB_PASS $DB_NAME -e "
SELECT p.id, c.name as category, p.title, p.created_at 
FROM posts p 
JOIN categories c ON p.category_id = c.id 
ORDER BY p.created_at DESC 
LIMIT 10;"

echo -e "\nDone!"