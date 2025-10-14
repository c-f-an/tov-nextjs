-- =============================================
-- 자료실 관련 테이블 생성
-- =============================================

-- 1. 자료실 카테고리 테이블
-- 자료실의 분류를 관리 (종교인소득, 비영리재정, 결산공시 등)
CREATE TABLE `resource_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL COMMENT '카테고리명',
  `slug` varchar(100) NOT NULL COMMENT 'URL 슬러그',
  `description` text COMMENT '카테고리 설명',
  `icon` varchar(50) DEFAULT NULL COMMENT '아이콘 클래스명',
  `sort_order` int NOT NULL DEFAULT '0' COMMENT '정렬 순서',
  `is_active` tinyint(1) NOT NULL DEFAULT '1' COMMENT '활성화 여부',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `resource_categories_slug_unique` (`slug`),
  KEY `resource_categories_sort_order_index` (`sort_order`),
  KEY `resource_categories_is_active_index` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. 자료실 테이블
-- 실제 자료 정보를 저장
CREATE TABLE `resources` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_id` int NOT NULL COMMENT '자료실 카테고리 ID',
  `title` varchar(255) NOT NULL COMMENT '자료 제목',
  `description` text COMMENT '자료 설명',
  `resource_type` enum('guide','form','education','law','etc') NOT NULL DEFAULT 'etc' COMMENT '자료 유형',
  `file_type` varchar(10) DEFAULT NULL COMMENT '파일 타입 (PDF, XLSX, HWP, PPT 등)',
  `file_path` varchar(500) DEFAULT NULL COMMENT '파일 경로',
  `file_size` bigint DEFAULT NULL COMMENT '파일 크기(bytes)',
  `original_filename` varchar(255) DEFAULT NULL COMMENT '원본 파일명',
  `thumbnail_path` varchar(500) DEFAULT NULL COMMENT '썸네일 이미지 경로',
  `external_link` varchar(500) DEFAULT NULL COMMENT '외부 링크 (파일 대신 링크 제공 시)',
  `download_count` int NOT NULL DEFAULT '0' COMMENT '다운로드 횟수',
  `view_count` int NOT NULL DEFAULT '0' COMMENT '조회수',
  `is_featured` tinyint(1) NOT NULL DEFAULT '0' COMMENT '주요 자료 여부',
  `is_active` tinyint(1) NOT NULL DEFAULT '1' COMMENT '활성화 여부',
  `published_at` timestamp NULL DEFAULT NULL COMMENT '게시일',
  `created_by` int DEFAULT NULL COMMENT '작성자 ID',
  `updated_by` int DEFAULT NULL COMMENT '수정자 ID',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `resources_category_id_foreign` (`category_id`),
  KEY `resources_resource_type_index` (`resource_type`),
  KEY `resources_is_featured_index` (`is_featured`),
  KEY `resources_is_active_index` (`is_active`),
  KEY `resources_published_at_index` (`published_at`),
  KEY `resources_created_by_foreign` (`created_by`),
  KEY `resources_updated_by_foreign` (`updated_by`),
  FULLTEXT KEY `resources_title_description_fulltext` (`title`,`description`),
  CONSTRAINT `resources_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `resource_categories` (`id`) ON DELETE CASCADE,
  CONSTRAINT `resources_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `resources_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. 자료 태그 테이블 (선택적 - 자료 검색 및 분류 강화)
CREATE TABLE `resource_tags` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL COMMENT '태그명',
  `slug` varchar(50) NOT NULL COMMENT 'URL 슬러그',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `resource_tags_slug_unique` (`slug`),
  KEY `resource_tags_name_index` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. 자료-태그 연결 테이블
CREATE TABLE `resource_tag_relations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `resource_id` int NOT NULL,
  `tag_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `resource_tag_relations_unique` (`resource_id`,`tag_id`),
  KEY `resource_tag_relations_tag_id_foreign` (`tag_id`),
  CONSTRAINT `resource_tag_relations_resource_id_foreign` FOREIGN KEY (`resource_id`) REFERENCES `resources` (`id`) ON DELETE CASCADE,
  CONSTRAINT `resource_tag_relations_tag_id_foreign` FOREIGN KEY (`tag_id`) REFERENCES `resource_tags` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. 자료 다운로드 이력 테이블 (선택적 - 상세 통계용)
CREATE TABLE `resource_download_logs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `resource_id` int NOT NULL COMMENT '자료 ID',
  `user_id` int DEFAULT NULL COMMENT '다운로드한 사용자 ID (비회원은 NULL)',
  `ip_address` varchar(45) DEFAULT NULL COMMENT 'IP 주소',
  `user_agent` text COMMENT '브라우저 정보',
  `referer` varchar(500) DEFAULT NULL COMMENT '참조 URL',
  `downloaded_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '다운로드 시간',
  PRIMARY KEY (`id`),
  KEY `resource_download_logs_resource_id_foreign` (`resource_id`),
  KEY `resource_download_logs_user_id_foreign` (`user_id`),
  KEY `resource_download_logs_downloaded_at_index` (`downloaded_at`),
  CONSTRAINT `resource_download_logs_resource_id_foreign` FOREIGN KEY (`resource_id`) REFERENCES `resources` (`id`) ON DELETE CASCADE,
  CONSTRAINT `resource_download_logs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. 자료 접근 권한 테이블 (선택적 - 회원 전용 자료 관리)
CREATE TABLE `resource_permissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `resource_id` int NOT NULL COMMENT '자료 ID',
  `permission_type` enum('public','member','premium','admin') NOT NULL DEFAULT 'public' COMMENT '접근 권한 타입',
  `required_role` varchar(50) DEFAULT NULL COMMENT '필요한 역할',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `resource_permissions_resource_id_unique` (`resource_id`),
  KEY `resource_permissions_permission_type_index` (`permission_type`),
  CONSTRAINT `resource_permissions_resource_id_foreign` FOREIGN KEY (`resource_id`) REFERENCES `resources` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- 초기 데이터 입력
-- =============================================

-- 자료실 카테고리 초기 데이터
INSERT INTO `resource_categories` (`name`, `slug`, `description`, `icon`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES
('종교인소득', 'religious-income', '종교인 소득세 관련 자료와 가이드', 'Calculator', 1, 1, NOW(), NOW()),
('비영리재정', 'nonprofit-finance', '비영리법인 재정 관리 자료', 'Receipt', 2, 1, NOW(), NOW()),
('결산공시', 'settlement', '교회 결산 및 공시 관련 자료', 'FileText', 3, 1, NOW(), NOW()),
('관계법령', 'laws', '교회 세무 관련 법령 정보', 'Scale', 4, 1, NOW(), NOW());

-- 자료 태그 초기 데이터
INSERT INTO `resource_tags` (`name`, `slug`, `created_at`, `updated_at`) VALUES
('2024년', '2024', NOW(), NOW()),
('신고서식', 'tax-form', NOW(), NOW()),
('가이드', 'guide', NOW(), NOW()),
('교육자료', 'education', NOW(), NOW()),
('법령', 'law', NOW(), NOW()),
('세무', 'tax', NOW(), NOW()),
('회계', 'accounting', NOW(), NOW()),
('원천징수', 'withholding', NOW(), NOW()),
('비과세', 'tax-exempt', NOW(), NOW()),
('FAQ', 'faq', NOW(), NOW());

-- 샘플 자료 데이터 (종교인소득)
INSERT INTO `resources` (`category_id`, `title`, `description`, `resource_type`, `file_type`, `file_size`, `is_featured`, `is_active`, `published_at`, `created_at`, `updated_at`) VALUES
((SELECT id FROM resource_categories WHERE slug = 'religious-income'),
 '2024년 종교인 소득세 신고 안내서',
 '종교인 소득세 신고를 위한 상세 안내서입니다. 신고 절차, 필요 서류, 주의사항 등을 포함하고 있습니다.',
 'guide',
 'PDF',
 2621440, -- 2.5MB
 1,
 1,
 NOW(),
 NOW(),
 NOW()),

((SELECT id FROM resource_categories WHERE slug = 'religious-income'),
 '종교인 소득 원천징수 실무 가이드',
 '교회 실무자를 위한 원천징수 처리 방법과 절차를 설명합니다.',
 'guide',
 'PDF',
 1887436, -- 1.8MB
 1,
 1,
 NOW(),
 NOW(),
 NOW()),

((SELECT id FROM resource_categories WHERE slug = 'religious-income'),
 '종교인소득 지급명세서 (엑셀 서식)',
 '종교인소득 지급명세서 작성을 위한 엑셀 서식 파일입니다.',
 'form',
 'XLSX',
 159744, -- 156KB
 0,
 1,
 NOW(),
 NOW(),
 NOW());

-- 샘플 자료 데이터 (비영리재정)
INSERT INTO `resources` (`category_id`, `title`, `description`, `resource_type`, `file_type`, `file_size`, `is_featured`, `is_active`, `published_at`, `created_at`, `updated_at`) VALUES
((SELECT id FROM resource_categories WHERE slug = 'nonprofit-finance'),
 '비영리법인 회계처리 실무 매뉴얼',
 '비영리법인의 회계처리 기준과 실무 적용 방법을 상세히 설명한 매뉴얼입니다.',
 'guide',
 'PDF',
 3145728, -- 3MB
 1,
 1,
 NOW(),
 NOW(),
 NOW()),

((SELECT id FROM resource_categories WHERE slug = 'nonprofit-finance'),
 '교회 재무제표 작성 가이드',
 '교회 재무제표 작성 방법과 주의사항을 담은 실무 가이드입니다.',
 'guide',
 'PDF',
 2097152, -- 2MB
 0,
 1,
 NOW(),
 NOW(),
 NOW());

-- 샘플 자료 데이터 (결산공시)
INSERT INTO `resources` (`category_id`, `title`, `description`, `resource_type`, `file_type`, `file_size`, `is_featured`, `is_active`, `published_at`, `created_at`, `updated_at`) VALUES
((SELECT id FROM resource_categories WHERE slug = 'settlement'),
 '교회 결산서 작성 실무',
 '교회 결산서 작성을 위한 단계별 가이드와 체크리스트를 제공합니다.',
 'guide',
 'PDF',
 2516582, -- 2.4MB
 1,
 1,
 NOW(),
 NOW(),
 NOW()),

((SELECT id FROM resource_categories WHERE slug = 'settlement'),
 '결산 공시 체크리스트',
 '결산 공시 시 확인해야 할 사항들을 정리한 체크리스트입니다.',
 'form',
 'DOCX',
 102400, -- 100KB
 0,
 1,
 NOW(),
 NOW(),
 NOW());

-- 인덱스 추가 (성능 최적화)
CREATE INDEX `resources_title_index` ON `resources` (`title`);
CREATE INDEX `resources_download_count_index` ON `resources` (`download_count`);
CREATE INDEX `resource_categories_name_index` ON `resource_categories` (`name`);