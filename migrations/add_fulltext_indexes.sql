-- =============================================
-- 인덱스 최적화 마이그레이션
-- 검색 성능 및 쿼리 최적화를 위한 인덱스
-- =============================================

-- =============================================
-- 이미 적용된 인덱스 (참고용 - 실행하지 마세요)
-- =============================================
-- posts:
--   - posts_title_content_fulltext (FULLTEXT)
--   - posts_status_created_at_idx (status, created_at DESC)
--   - posts_category_status_created_idx (category_id, status, created_at DESC)
--
-- consultations:
--   - consultations_title_content_fulltext (FULLTEXT)
--
-- users:
--   - users_last_login_idx (last_login_at)

-- =============================================
-- 추가 필요한 인덱스
-- =============================================

-- posts: user_id + created_at 조합 쿼리 최적화 (사용자별 게시물 조회용)
ALTER TABLE `posts` ADD INDEX `posts_user_created_idx` (`user_id`, `created_at` DESC);

-- consultations: status + created_at 조합 쿼리 최적화 (상태별 목록 조회용)
ALTER TABLE `consultations` ADD INDEX `consultations_status_created_idx` (`status`, `created_at` DESC);

-- consultations: user_id + created_at 조합 쿼리 최적화 (사용자별 상담 조회용)
ALTER TABLE `consultations` ADD INDEX `consultations_user_created_idx` (`user_id`, `created_at` DESC);

-- donations: payment_date 기반 월별 통계 최적화 (이미 payment_date_index 존재, created_at 추가)
ALTER TABLE `donations` ADD INDEX `donations_created_at_idx` (`created_at` DESC);

-- =============================================
-- 사용법 안내 (코드에서 FULLTEXT 검색 사용)
-- =============================================
-- 기존 LIKE 검색:
--   WHERE title LIKE '%검색어%' OR content LIKE '%검색어%'
--
-- FULLTEXT 검색 (권장):
--   WHERE MATCH(title, content) AGAINST('검색어' IN NATURAL LANGUAGE MODE)
--
-- Boolean Mode (고급):
--   WHERE MATCH(title, content) AGAINST('+종교인 +소득세' IN BOOLEAN MODE)

-- =============================================
-- 인덱스 삭제 (필요시)
-- =============================================
-- ALTER TABLE `posts` DROP INDEX `posts_user_created_idx`;
-- ALTER TABLE `consultations` DROP INDEX `consultations_status_created_idx`;
-- ALTER TABLE `consultations` DROP INDEX `consultations_user_created_idx`;
-- ALTER TABLE `donations` DROP INDEX `donations_created_at_idx`;
