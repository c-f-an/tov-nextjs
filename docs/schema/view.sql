-- =============================================
-- 9. 뷰 생성 (자주 사용하는 복잡한 쿼리)
-- =============================================

-- 활성 게시물 뷰
CREATE VIEW `active_posts_view` AS
SELECT 
    p.*,
    c.name as category_name,
    c.slug as category_slug,
    u.name as author_name,
    u.email as author_email
FROM posts p
INNER JOIN categories c ON p.category_id = c.id
INNER JOIN users u ON p.user_id = u.id
WHERE p.status = 'published' 
AND p.published_at <= NOW();