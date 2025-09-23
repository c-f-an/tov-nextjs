-- 토브 홈페이지 데이터베이스 스키마
-- Database: tov_homepage
-- For Next.js Application

-- =============================================
-- 1. 사용자 관련 테이블
-- =============================================

-- 사용자 테이블 (일반 로그인 + 소셜 로그인 통합)
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) DEFAULT NULL COMMENT '사용자 ID (일반 로그인용)',
  `email` varchar(191) NOT NULL,
  `password` varchar(255) DEFAULT NULL COMMENT '비밀번호 (소셜 로그인 시 NULL)',
  `name` varchar(50) NOT NULL COMMENT '이름',
  `phone` varchar(20) DEFAULT NULL COMMENT '전화번호',
  `status` enum('active','inactive','suspended') NOT NULL DEFAULT 'active',
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `login_type` enum('email','google','naver','kakao','apple') NOT NULL DEFAULT 'email' COMMENT '가입 유형',
  `avatar_url` varchar(500) DEFAULT NULL COMMENT '프로필 이미지 URL (소셜 로그인)',
  `last_login_at` timestamp NULL DEFAULT NULL,
  `last_login_ip` varchar(45) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  UNIQUE KEY `users_username_unique` (`username`),
  KEY `users_login_type_index` (`login_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 사용자 프로필 테이블
CREATE TABLE `user_profiles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `church_name` varchar(100) DEFAULT NULL COMMENT '교회명',
  `position` varchar(50) DEFAULT NULL COMMENT '직분',
  `denomination` varchar(50) DEFAULT NULL COMMENT '교단',
  `address` varchar(255) DEFAULT NULL,
  `postcode` varchar(10) DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `gender` enum('M','F') DEFAULT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  `newsletter_subscribe` tinyint(1) NOT NULL DEFAULT '0' COMMENT '뉴스레터 구독 여부',
  `marketing_agree` tinyint(1) NOT NULL DEFAULT '0' COMMENT '마케팅 수신 동의',
  `privacy_agree_date` timestamp NULL DEFAULT NULL COMMENT '개인정보 동의일',
  `terms_agree_date` timestamp NULL DEFAULT NULL COMMENT '이용약관 동의일',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_profiles_user_id_foreign` (`user_id`),
  CONSTRAINT `user_profiles_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 비밀번호 리셋 토큰 테이블
CREATE TABLE `password_reset_tokens` (
  `email` varchar(191) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  KEY `password_reset_tokens_email_index` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- 2. 콘텐츠 관리 테이블
-- =============================================

-- 카테고리 테이블
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `parent_id` int DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `description` text,
  `type` enum('notice','news','publication','media','resource','activity') NOT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `categories_slug_unique` (`slug`),
  KEY `categories_parent_id_foreign` (`parent_id`),
  CONSTRAINT `categories_parent_id_foreign` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 게시글 테이블
CREATE TABLE `posts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_id` int NOT NULL,
  `user_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `content` longtext NOT NULL,
  `excerpt` text COMMENT '요약',
  `featured_image` varchar(255) DEFAULT NULL COMMENT '대표 이미지',
  `status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
  `is_notice` tinyint(1) NOT NULL DEFAULT '0' COMMENT '공지사항 여부',
  `is_featured` tinyint(1) NOT NULL DEFAULT '0' COMMENT '메인 노출 여부',
  `view_count` int NOT NULL DEFAULT '0',
  `published_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `posts_category_id_foreign` (`category_id`),
  KEY `posts_user_id_foreign` (`user_id`),
  KEY `posts_status_index` (`status`),
  KEY `posts_published_at_index` (`published_at`),
  CONSTRAINT `posts_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
  CONSTRAINT `posts_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 첨부파일 테이블
CREATE TABLE `attachments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `attachable_type` varchar(100) NOT NULL COMMENT '첨부 대상 모델',
  `attachable_id` int NOT NULL COMMENT '첨부 대상 ID',
  `filename` varchar(255) NOT NULL,
  `original_filename` varchar(255) NOT NULL,
  `path` varchar(500) NOT NULL,
  `mime_type` varchar(100) DEFAULT NULL,
  `size` bigint DEFAULT NULL COMMENT '파일 크기(bytes)',
  `download_count` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `attachments_attachable_type_attachable_id_index` (`attachable_type`,`attachable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- 3. 메인 페이지 관리 테이블
-- =============================================

-- 메인 배너 테이블
CREATE TABLE `main_banners` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `subtitle` varchar(255) DEFAULT NULL,
  `description` text,
  `image_path` varchar(500) NOT NULL,
  `link_url` varchar(500) DEFAULT NULL,
  `link_target` enum('_self','_blank') NOT NULL DEFAULT '_self',
  `sort_order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `main_banners_sort_order_index` (`sort_order`),
  KEY `main_banners_is_active_index` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 주요 사업 바로가기 테이블
CREATE TABLE `quick_links` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `icon` varchar(255) DEFAULT NULL COMMENT '아이콘 클래스 또는 이미지 경로',
  `link_url` varchar(500) NOT NULL,
  `description` text,
  `sort_order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `quick_links_sort_order_index` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- 4. 상담 관련 테이블
-- =============================================

-- 상담 신청 테이블
CREATE TABLE `consultations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL COMMENT '회원인 경우',
  `name` varchar(50) NOT NULL COMMENT '신청자명',
  `phone` varchar(20) NOT NULL,
  `email` varchar(191) DEFAULT NULL,
  `church_name` varchar(100) DEFAULT NULL,
  `position` varchar(50) DEFAULT NULL,
  `consultation_type` varchar(50) NOT NULL COMMENT '상담 유형',
  `preferred_date` date DEFAULT NULL COMMENT '희망 상담일',
  `preferred_time` varchar(50) DEFAULT NULL COMMENT '희망 시간대',
  `title` varchar(255) NOT NULL COMMENT '상담 제목',
  `content` text NOT NULL COMMENT '상담 내용',
  `status` enum('pending','assigned','in_progress','completed','cancelled') NOT NULL DEFAULT 'pending',
  `assigned_to` int DEFAULT NULL COMMENT '담당자 ID',
  `consultation_date` datetime DEFAULT NULL COMMENT '실제 상담일시',
  `consultation_notes` text COMMENT '상담 결과',
  `privacy_agree` tinyint(1) NOT NULL DEFAULT '0' COMMENT '개인정보 수집 동의',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `consultations_user_id_foreign` (`user_id`),
  KEY `consultations_status_index` (`status`),
  CONSTRAINT `consultations_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- 5. 후원 관련 테이블
-- =============================================

-- 후원자 정보 테이블
CREATE TABLE `sponsors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `sponsor_type` enum('individual','organization') NOT NULL DEFAULT 'individual',
  `name` varchar(100) NOT NULL,
  `organization_name` varchar(100) DEFAULT NULL COMMENT '단체명',
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(191) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `postcode` varchar(10) DEFAULT NULL,
  `sponsor_status` enum('active','inactive','paused') NOT NULL DEFAULT 'active',
  `privacy_agree` tinyint(1) NOT NULL DEFAULT '0',
  `receipt_required` tinyint(1) NOT NULL DEFAULT '0' COMMENT '기부금영수증 발급 여부',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sponsors_user_id_foreign` (`user_id`),
  CONSTRAINT `sponsors_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 후원 내역 테이블
CREATE TABLE `donations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sponsor_id` int NOT NULL,
  `donation_type` enum('regular','one_time') NOT NULL COMMENT '정기/일시',
  `amount` decimal(10,0) NOT NULL COMMENT '후원금액',
  `payment_method` varchar(50) DEFAULT NULL COMMENT '결제방법',
  `payment_date` date NOT NULL COMMENT '후원일',
  `receipt_number` varchar(50) DEFAULT NULL COMMENT '영수증 번호',
  `purpose` varchar(255) DEFAULT NULL COMMENT '후원 목적',
  `memo` text,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `donations_sponsor_id_foreign` (`sponsor_id`),
  KEY `donations_payment_date_index` (`payment_date`),
  CONSTRAINT `donations_sponsor_id_foreign` FOREIGN KEY (`sponsor_id`) REFERENCES `sponsors` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 재정 보고 테이블
CREATE TABLE `financial_reports` (
  `id` int NOT NULL AUTO_INCREMENT,
  `report_year` year NOT NULL,
  `report_month` tinyint DEFAULT NULL COMMENT 'NULL이면 연간보고서',
  `title` varchar(255) NOT NULL,
  `content` longtext,
  `total_income` decimal(12,0) DEFAULT NULL COMMENT '총 수입',
  `total_expense` decimal(12,0) DEFAULT NULL COMMENT '총 지출',
  `balance` decimal(12,0) DEFAULT NULL COMMENT '잔액',
  `published_at` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `financial_reports_year_month_unique` (`report_year`,`report_month`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- 6. 보고서 관련 테이블
-- =============================================

-- 사업보고 및 재정보고 테이블
CREATE TABLE `reports` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL COMMENT '보고서 제목',
  `year` varchar(4) NOT NULL COMMENT '보고서 연도',
  `date` date NOT NULL COMMENT '보고서 작성일',
  `type` enum('business','finance') NOT NULL COMMENT '보고서 타입 (사업/재정)',
  `summary` text COMMENT '보고서 요약',
  `content` longtext COMMENT '보고서 내용',
  `file_url` varchar(500) DEFAULT NULL COMMENT '첨부 파일 URL',
  `views` int NOT NULL DEFAULT '0' COMMENT '조회수',
  `is_active` tinyint(1) NOT NULL DEFAULT '1' COMMENT '활성화 여부',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `reports_year_index` (`year`),
  KEY `reports_type_index` (`type`),
  KEY `reports_is_active_index` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- 7. 기타 관리 테이블
-- =============================================

-- FAQ 테이블
CREATE TABLE `faqs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category` varchar(50) NOT NULL COMMENT 'FAQ 카테고리',
  `question` varchar(500) NOT NULL,
  `answer` text NOT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `view_count` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `faqs_category_index` (`category`),
  KEY `faqs_sort_order_index` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 팝업 관리 테이블
CREATE TABLE `popups` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `image_path` varchar(500) DEFAULT NULL,
  `link_url` varchar(500) DEFAULT NULL,
  `width` int DEFAULT '400',
  `height` int DEFAULT '500',
  `position_x` int DEFAULT '100',
  `position_y` int DEFAULT '100',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `popups_is_active_index` (`is_active`),
  KEY `popups_dates_index` (`start_date`,`end_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 메뉴 관리 테이블
CREATE TABLE `menus` (
  `id` int NOT NULL AUTO_INCREMENT,
  `parent_id` int DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `url` varchar(500) DEFAULT NULL,
  `menu_type` enum('main','footer','utility') NOT NULL DEFAULT 'main',
  `target` enum('_self','_blank') NOT NULL DEFAULT '_self',
  `sort_order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `menus_parent_id_foreign` (`parent_id`),
  KEY `menus_menu_type_index` (`menu_type`),
  CONSTRAINT `menus_parent_id_foreign` FOREIGN KEY (`parent_id`) REFERENCES `menus` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 사이트 설정 테이블
CREATE TABLE `site_settings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `setting_group` varchar(50) NOT NULL,
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text,
  `setting_type` enum('text','textarea','number','boolean','json') NOT NULL DEFAULT 'text',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `site_settings_group_key_unique` (`setting_group`,`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 활동 로그 테이블
CREATE TABLE `activity_logs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `log_type` varchar(50) NOT NULL,
  `description` text NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `activity_logs_user_id_foreign` (`user_id`),
  KEY `activity_logs_log_type_index` (`log_type`),
  KEY `activity_logs_created_at_index` (`created_at`),
  CONSTRAINT `activity_logs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 만족도 평가 테이블
CREATE TABLE `satisfaction_surveys` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `survey_type` varchar(50) NOT NULL COMMENT '평가 유형',
  `rating` tinyint NOT NULL COMMENT '평점 (1-5)',
  `feedback` text COMMENT '의견',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `satisfaction_surveys_user_id_foreign` (`user_id`),
  KEY `satisfaction_surveys_survey_type_index` (`survey_type`),
  CONSTRAINT `satisfaction_surveys_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 뉴스레터 구독자 테이블
CREATE TABLE `newsletter_subscribers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(191) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `subscribed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `unsubscribed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `newsletter_subscribers_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- 7. Next.js 관련 추가 테이블
-- =============================================

-- API 키 관리 테이블 (외부 서비스 연동용)
CREATE TABLE `api_keys` (
  `id` int NOT NULL AUTO_INCREMENT,
  `service_name` varchar(50) NOT NULL COMMENT '서비스명 (google, naver, kakao 등)',
  `api_key` varchar(255) NOT NULL,
  `api_secret` varchar(255) DEFAULT NULL,
  `environment` enum('development','staging','production') NOT NULL DEFAULT 'development',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `api_keys_service_env_unique` (`service_name`,`environment`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- JWT 리프레시 토큰 관리 테이블
CREATE TABLE `refresh_tokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `token_hash` varchar(255) NOT NULL COMMENT 'SHA256 해시된 토큰',
  `device_info` varchar(255) DEFAULT NULL COMMENT '디바이스/브라우저 정보',
  `ip_address` varchar(45) DEFAULT NULL,
  `expires_at` timestamp NOT NULL,
  `revoked_at` timestamp NULL DEFAULT NULL COMMENT '토큰 폐기 시간',
  `revoked_reason` varchar(255) DEFAULT NULL COMMENT '폐기 사유',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `refresh_tokens_token_hash_unique` (`token_hash`),
  KEY `refresh_tokens_user_id_foreign` (`user_id`),
  KEY `refresh_tokens_expires_at_index` (`expires_at`),
  KEY `refresh_tokens_revoked_at_index` (`revoked_at`),
  CONSTRAINT `refresh_tokens_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- JWT 블랙리스트 테이블 (로그아웃된 토큰 관리)
CREATE TABLE `jwt_blacklist` (
  `id` int NOT NULL AUTO_INCREMENT,
  `jti` varchar(255) NOT NULL COMMENT 'JWT ID',
  `token_type` enum('access','refresh') NOT NULL,
  `user_id` int DEFAULT NULL,
  `expires_at` timestamp NOT NULL,
  `blacklisted_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `reason` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `jwt_blacklist_jti_unique` (`jti`),
  KEY `jwt_blacklist_expires_at_index` (`expires_at`),
  KEY `jwt_blacklist_user_id_index` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 사용자 디바이스/세션 관리 테이블
CREATE TABLE `user_devices` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `device_id` varchar(255) NOT NULL COMMENT '디바이스 고유 ID',
  `device_name` varchar(255) DEFAULT NULL COMMENT '사용자가 지정한 디바이스명',
  `device_type` enum('web','mobile','tablet','desktop') NOT NULL DEFAULT 'web',
  `platform` varchar(50) DEFAULT NULL COMMENT 'OS 정보',
  `browser` varchar(50) DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `last_active_at` timestamp NULL DEFAULT NULL,
  `is_trusted` tinyint(1) NOT NULL DEFAULT '0' COMMENT '신뢰할 수 있는 디바이스',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_devices_device_id_unique` (`device_id`),
  KEY `user_devices_user_id_foreign` (`user_id`),
  CONSTRAINT `user_devices_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- OAuth 계정 연동 테이블 (소셜 로그인)
CREATE TABLE `social_accounts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `provider` enum('google','naver','kakao','apple') NOT NULL COMMENT '소셜 제공자',
  `provider_user_id` varchar(255) NOT NULL COMMENT '소셜 서비스 사용자 ID',
  `provider_email` varchar(191) DEFAULT NULL COMMENT '소셜 서비스 이메일',
  `provider_name` varchar(100) DEFAULT NULL COMMENT '소셜 서비스 표시명',
  `provider_avatar` varchar(500) DEFAULT NULL COMMENT '소셜 서비스 프로필 이미지',
  `access_token` text COMMENT '액세스 토큰',
  `refresh_token` text COMMENT '리프레시 토큰',
  `token_expires_at` timestamp NULL DEFAULT NULL,
  `raw_data` json DEFAULT NULL COMMENT '소셜 서비스 원본 데이터',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `social_accounts_provider_user_unique` (`provider`,`provider_user_id`),
  KEY `social_accounts_user_id_foreign` (`user_id`),
  CONSTRAINT `social_accounts_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 소셜 로그인 설정 테이블
CREATE TABLE `social_login_configs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `provider` enum('google','naver','kakao','apple') NOT NULL,
  `client_id` varchar(255) NOT NULL,
  `client_secret` varchar(255) NOT NULL,
  `redirect_uri` varchar(500) NOT NULL,
  `scope` text COMMENT '요청할 권한 범위',
  `additional_params` json DEFAULT NULL COMMENT '추가 파라미터',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `environment` enum('development','staging','production') NOT NULL DEFAULT 'development',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `social_login_configs_provider_env_unique` (`provider`,`environment`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 로그인 시도 기록 테이블 (보안)
CREATE TABLE `login_attempts` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(191) DEFAULT NULL,
  `ip_address` varchar(45) NOT NULL,
  `user_agent` text,
  `login_type` enum('email','google','naver','kakao','apple') NOT NULL,
  `attempt_status` enum('success','failed','blocked') NOT NULL,
  `failure_reason` varchar(255) DEFAULT NULL,
  `attempted_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `login_attempts_email_index` (`email`),
  KEY `login_attempts_ip_index` (`ip_address`),
  KEY `login_attempts_attempted_at_index` (`attempted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 이미지 최적화 캐시 테이블
CREATE TABLE `image_optimizations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `original_path` varchar(500) NOT NULL,
  `optimized_path` varchar(500) NOT NULL,
  `width` int DEFAULT NULL,
  `height` int DEFAULT NULL,
  `format` varchar(10) DEFAULT NULL,
  `quality` tinyint DEFAULT NULL,
  `size_bytes` bigint DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `image_optimizations_original_path_index` (`original_path`),
  KEY `image_optimizations_dimensions_index` (`width`,`height`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 페이지 메타데이터 테이블 (SEO)
CREATE TABLE `page_metadata` (
  `id` int NOT NULL AUTO_INCREMENT,
  `page_type` varchar(50) NOT NULL COMMENT 'home, post, category 등',
  `page_id` int DEFAULT NULL COMMENT '관련 콘텐츠 ID',
  `title` varchar(255) DEFAULT NULL,
  `description` text,
  `keywords` text,
  `og_title` varchar(255) DEFAULT NULL,
  `og_description` text,
  `og_image` varchar(500) DEFAULT NULL,
  `twitter_card` varchar(50) DEFAULT 'summary_large_image',
  `canonical_url` varchar(500) DEFAULT NULL,
  `robots` varchar(100) DEFAULT 'index,follow',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `page_metadata_type_id_unique` (`page_type`,`page_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 캐시 관리 테이블 (ISR 지원)
CREATE TABLE `cache_entries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cache_key` varchar(255) NOT NULL,
  `cache_value` longtext,
  `tags` json DEFAULT NULL COMMENT '캐시 태그 (JSON 배열)',
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cache_entries_key_unique` (`cache_key`),
  KEY `cache_entries_expires_at_index` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 리다이렉트 관리 테이블
CREATE TABLE `redirects` (
  `id` int NOT NULL AUTO_INCREMENT,
  `source_path` varchar(500) NOT NULL,
  `destination_path` varchar(500) NOT NULL,
  `status_code` int NOT NULL DEFAULT '301' COMMENT '301 or 302',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `hit_count` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `redirects_source_path_unique` (`source_path`),
  KEY `redirects_is_active_index` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 폼 제출 로그 테이블 (문의, 상담 등 모든 폼)
CREATE TABLE `form_submissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `form_type` varchar(50) NOT NULL COMMENT '폼 종류',
  `form_data` json NOT NULL COMMENT '제출된 데이터',
  `user_id` int DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text,
  `referer` varchar(500) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `form_submissions_form_type_index` (`form_type`),
  KEY `form_submissions_user_id_foreign` (`user_id`),
  KEY `form_submissions_created_at_index` (`created_at`),
  CONSTRAINT `form_submissions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- 10. JWT 토큰 인증 시스템
-- =============================================

-- JWT 토큰 인증 방식 채택
-- Access Token: 메모리/로컬스토리지 저장 (15분~1시간)
-- Refresh Token: HttpOnly 쿠키 저장 (7~30일)

-- =============================================
-- 11. 2단계 인증 (2FA) 관련 테이블
-- =============================================

-- 2단계 인증 설정 테이블
CREATE TABLE `two_factor_auth` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `secret` varchar(255) NOT NULL COMMENT '암호화된 시크릿 키',
  `recovery_codes` json DEFAULT NULL COMMENT '복구 코드 (해시)',
  `enabled_at` timestamp NULL DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `two_factor_auth_user_id_unique` (`user_id`),
  CONSTRAINT `two_factor_auth_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 인증 코드 임시 저장 테이블 (이메일/SMS 인증)
CREATE TABLE `verification_codes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `identifier` varchar(255) NOT NULL COMMENT '이메일 또는 전화번호',
  `code` varchar(10) NOT NULL COMMENT '인증 코드',
  `type` enum('email','sms','2fa') NOT NULL,
  `expires_at` timestamp NOT NULL,
  `verified_at` timestamp NULL DEFAULT NULL,
  `attempts` tinyint NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `verification_codes_identifier_index` (`identifier`),
  KEY `verification_codes_expires_at_index` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;