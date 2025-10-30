# 데이터베이스 스키마 (Database Schema)

## 개요

TOV 시스템의 MySQL 데이터베이스 구조 및 관계 명세입니다. 본 문서는 실제 운영 중인 데이터베이스의 전체 테이블 구조를 포괄적으로 다룹니다.

## 데이터베이스 구조

### 데이터베이스 정보
- **Engine**: MySQL 8.0
- **Character Set**: utf8mb4
- **Collation**: utf8mb4_unicode_ci
- **Storage Engine**: InnoDB
- **총 테이블 수**: 33개 이상

## 테이블 구조

### 1. 사용자 관련 테이블

#### users (사용자)
```sql
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
```

#### user_profiles (사용자 프로필)
```sql
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
```

#### password_reset_tokens (비밀번호 리셋 토큰)
```sql
CREATE TABLE `password_reset_tokens` (
  `email` varchar(191) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  KEY `password_reset_tokens_email_index` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 2. 콘텐츠 관리 테이블

#### categories (카테고리)
```sql
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
```

#### posts (게시물)
```sql
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
```

#### attachments (첨부파일)
```sql
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
```

### 3. 메인 페이지 관리 테이블

#### main_banners (메인 배너) - 2025년 신규
```sql
CREATE TABLE `main_banners` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `subtitle` varchar(255) DEFAULT NULL,
  `description` text,
  `image_path` varchar(500) NOT NULL,
  `image_option` varchar(255) DEFAULT NULL COMMENT '이미지 옵션 (gradient 등)',
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
```

#### quick_links (주요 사업 바로가기) - 2025년 신규
```sql
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
```

### 4. 상담 관련 테이블

#### consultations (상담 신청)
```sql
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
```

#### financial_consulting_cases (재정관리 컨설팅 사례) - 2024년 신규
```sql
CREATE TABLE `financial_consulting_cases` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `title` varchar(255) NOT NULL COMMENT '사례 제목',
  `organization_name` varchar(255) NOT NULL COMMENT '기관/단체명',
  `organization_type` varchar(100) NOT NULL COMMENT '기관 유형 (church, nonprofit, foundation, etc)',
  `consulting_type` varchar(100) NOT NULL COMMENT '컨설팅 유형 (system_setup, diagnosis, training, etc)',
  `consulting_period` varchar(100) NULL COMMENT '컨설팅 기간',
  `thumbnail_image` varchar(500) NULL COMMENT '썸네일 이미지 URL',
  `challenge` text NULL COMMENT '도전과제/문제점',
  `solution` text NULL COMMENT '해결방안',
  `result` text NULL COMMENT '컨설팅 결과',
  `client_feedback` text NULL COMMENT '고객 후기',
  `tags` varchar(500) NULL COMMENT '태그 (쉼표로 구분)',
  `is_featured` tinyint(1) DEFAULT 0 COMMENT '대표 사례 여부',
  `is_active` tinyint(1) DEFAULT 1 COMMENT '게시 여부',
  `display_order` int DEFAULT 0 COMMENT '표시 순서',
  `view_count` int DEFAULT 0 COMMENT '조회수',
  `consulting_date` date NULL COMMENT '컨설팅 실시 날짜',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_organization_type (organization_type),
  INDEX idx_consulting_type (consulting_type),
  INDEX idx_is_active (is_active),
  INDEX idx_is_featured (is_featured),
  INDEX idx_display_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 5. 후원 관련 테이블

#### sponsors (후원자)
```sql
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
```

#### donations (후원 내역)
```sql
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
```

#### financial_reports (재정 보고)
```sql
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
```

### 6. 자료실 관련 테이블 - 2024년 신규

#### resource_categories (자료실 카테고리)
```sql
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
```

#### resources (자료실)
```sql
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
```

#### resource_tags (자료 태그)
```sql
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
```

#### resource_tag_relations (자료-태그 연결)
```sql
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
```

#### resource_download_logs (자료 다운로드 이력)
```sql
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
```

#### resource_permissions (자료 접근 권한)
```sql
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
```

### 7. 보고서 관련 테이블

#### reports (사업/재정 보고서)
```sql
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
```

### 8. 사이트 관리 테이블

#### faqs (자주 묻는 질문)
```sql
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
```

#### popups (팝업 관리)
```sql
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
```

#### menus (메뉴 관리)
```sql
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
```

#### site_settings (사이트 설정)
```sql
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
```

#### newsletter_subscribers (뉴스레터 구독자)
```sql
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
```

### 9. 인증 및 보안 테이블

#### refresh_tokens (JWT 리프레시 토큰)
```sql
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
```

#### jwt_blacklist (JWT 블랙리스트)
```sql
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
```

#### login_attempts (로그인 시도 기록)
```sql
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
```

#### user_devices (사용자 디바이스/세션 관리)
```sql
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
```

#### two_factor_auth (2단계 인증)
```sql
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
```

#### verification_codes (인증 코드)
```sql
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
```

### 10. 소셜 로그인 관련 테이블

#### social_accounts (OAuth 계정 연동)
```sql
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
```

#### social_login_configs (소셜 로그인 설정)
```sql
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
```

### 11. 로깅 및 추적 테이블

#### activity_logs (활동 로그)
```sql
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
```

#### form_submissions (폼 제출 로그)
```sql
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
```

#### satisfaction_surveys (만족도 평가)
```sql
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
```

### 12. Next.js 최적화 테이블

#### api_keys (API 키 관리)
```sql
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
```

#### image_optimizations (이미지 최적화 캐시)
```sql
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
```

#### page_metadata (페이지 메타데이터 - SEO)
```sql
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
```

#### cache_entries (캐시 관리 - ISR 지원)
```sql
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
```

#### redirects (리다이렉트 관리)
```sql
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
```

## 테이블 관계

### 주요 관계 구조

#### 1. 사용자 중심 관계
```
users
├── user_profiles (1:1) - 사용자 상세 프로필
├── posts (1:N) - 작성한 게시물
├── consultations (1:N) - 신청한 상담
├── sponsors (1:N) - 후원자 정보
├── social_accounts (1:N) - 소셜 계정 연동
├── refresh_tokens (1:N) - 리프레시 토큰
├── user_devices (1:N) - 사용자 디바이스
├── two_factor_auth (1:1) - 2단계 인증
└── activity_logs (1:N) - 활동 로그
```

#### 2. 콘텐츠 관계
```
categories
├── posts (1:N)
└── parent_id (자기참조) - 계층 구조

posts
├── category_id → categories
├── user_id → users
└── attachments (다형성)
```

#### 3. 자료실 관계
```
resource_categories
└── resources (1:N)
    ├── resource_tags (N:M via resource_tag_relations)
    ├── resource_download_logs (1:N)
    ├── resource_permissions (1:1)
    ├── created_by → users
    └── updated_by → users
```

#### 4. 후원 관계
```
sponsors
├── user_id → users
└── donations (1:N)
```

#### 5. 상담 관계
```
consultations
├── user_id → users
└── assigned_to → users
```

### ER 다이어그램 (확장)
```
사용자 관리
users ────┬──── user_profiles (1:1)
          ├──── social_accounts (1:N)
          ├──── refresh_tokens (1:N)
          ├──── user_devices (1:N)
          ├──── two_factor_auth (1:1)
          └──── login_attempts (1:N)

콘텐츠 관리
categories ──┬── posts (1:N) ──── attachments (다형성)
             └── parent_id (자기참조)

자료실
resource_categories ──── resources ───┬─── resource_tag_relations ──── resource_tags
                                      ├─── resource_download_logs
                                      └─── resource_permissions

후원 관리
users ──── sponsors ──── donations

상담 관리
users ──┬── consultations (신청자)
        └── consultations (담당자)

메인 페이지
main_banners (독립)
quick_links (독립)

보안 및 추적
jwt_blacklist (독립)
verification_codes (독립)
activity_logs ──── users
form_submissions ──── users
login_attempts (독립)

Next.js 최적화
api_keys (독립)
image_optimizations (독립)
page_metadata (독립)
cache_entries (독립)
redirects (독립)
```

## 2025년 주요 변경사항

### 신규 추가된 테이블

1. **main_banners** (메인 배너)
   - 기존 banners 테이블과 별도로 메인 페이지 전용 배너 관리
   - `image_option` 필드로 그라데이션 효과 지원
   - 서브타이틀 및 상세 설명 필드 추가

2. **quick_links** (주요 사업 바로가기)
   - 메인 페이지 퀵링크 섹션 관리
   - 아이콘 및 정렬 순서 지원

3. **financial_consulting_cases** (재정관리 컨설팅 사례)
   - 컨설팅 사례 관리
   - 도전과제, 해결방안, 결과, 고객 후기 구조화
   - 태그 기반 검색 지원

4. **자료실 관련 테이블 6개**
   - `resource_categories`: 자료실 카테고리
   - `resources`: 자료 정보
   - `resource_tags`: 태그
   - `resource_tag_relations`: 자료-태그 연결
   - `resource_download_logs`: 다운로드 이력
   - `resource_permissions`: 접근 권한

### 업데이트된 테이블

1. **users** 테이블
   - 소셜 로그인 통합 지원 강화
   - `login_type` enum 확장 (email, google, naver, kakao, apple)
   - `avatar_url` 추가
   - `last_login_ip` 추가

2. **user_profiles** 테이블
   - users 테이블에서 분리하여 독립 관리
   - 교회 정보 (church_name, position, denomination) 통합
   - 마케팅 동의 및 개인정보 동의일 추적

## 인덱스 전략

### 성능 최적화 인덱스

1. **검색 최적화**
   - FULLTEXT 인덱스: `posts` (title, content), `resources` (title, description), `faqs` (question, answer)
   - 일반 인덱스: 제목, 이메일, 슬러그 등 검색에 자주 사용되는 컬럼

2. **조회 최적화**
   - 복합 인덱스: `(status, published_at)`, `(is_active, sort_order)`, `(start_date, end_date)`
   - 단일 인덱스: status, is_active, is_featured 등 필터링 컬럼

3. **조인 최적화**
   - 외래키 인덱스: 모든 FK 컬럼에 자동 인덱스 생성
   - 다형성 관계: `(attachable_type, attachable_id)` 복합 인덱스

4. **정렬 최적화**
   - sort_order, display_order, created_at, published_at 등

### 인덱스 명명 규칙
- Primary Key: `PRIMARY`
- Unique Key: `{table}_{column}_unique`
- Foreign Key: `{table}_{column}_foreign`
- Index: `{table}_{column}_index`
- Composite Index: `{table}_{columns}_index`

## 보안 고려사항

### 데이터 암호화
1. **비밀번호**: bcrypt 해시 (cost factor: 10)
2. **토큰**: SHA256 해시 저장
3. **민감 정보**:
   - API Secret: 암호화 저장
   - 2FA Secret: 암호화 저장
   - Recovery Codes: 해시 저장

### 접근 제어
1. **JWT 토큰 기반 인증**
   - Access Token: 메모리/로컬스토리지 (15분~1시간)
   - Refresh Token: HttpOnly 쿠키 (7~30일)
   - 토큰 블랙리스트 관리

2. **자료실 권한 관리**
   - public: 모든 사용자
   - member: 로그인 필수
   - premium: 프리미엄 회원
   - admin: 관리자 전용

3. **로그인 보안**
   - 로그인 시도 기록 및 차단
   - 디바이스 관리 및 신뢰 디바이스 설정
   - 2단계 인증 (2FA) 지원

### 개인정보 보호
1. **동의 관리**
   - 개인정보 수집 동의일 기록
   - 이용약관 동의일 기록
   - 마케팅 수신 동의 별도 관리

2. **로그 보안**
   - IP 주소 기록
   - User Agent 기록
   - 민감정보 마스킹

## 성능 고려사항

### 파티셔닝 전략 (향후 도입 예정)
1. **시간 기반 파티셔닝**
   - `posts`: 연도별 파티셔닝
   - `activity_logs`: 월별 파티셔닝
   - `login_attempts`: 월별 파티셔닝
   - `resource_download_logs`: 월별 파티셔닝

2. **범위 기반 파티셔닝**
   - `donations`: 연도별 파티셔닝
   - `financial_reports`: 연도별 파티셔닝

### 아카이빙 정책
1. **로그 데이터**
   - 6개월 이상 로그 → 아카이브 테이블 이동
   - activity_logs, login_attempts, resource_download_logs

2. **히스토리 데이터**
   - 3년 이상 오래된 상담 → 아카이브
   - 5년 이상 오래된 후원 내역 → 아카이브

### 캐싱 전략
1. **애플리케이션 레벨 캐싱**
   - Redis/Memcached 활용
   - 자주 조회되는 설정값, 메뉴, FAQ 등

2. **데이터베이스 레벨 캐싱**
   - `cache_entries` 테이블 활용
   - Next.js ISR(Incremental Static Regeneration) 지원
   - 태그 기반 캐시 무효화

3. **이미지 캐싱**
   - `image_optimizations` 테이블
   - 최적화된 이미지 경로 캐싱
   - 반응형 이미지 크기별 캐싱

## 백업 및 복구

### 백업 전략
1. **전체 백업**: 매일 03:00 (KST)
2. **증분 백업**: 매 6시간
3. **바이너리 로그**: 실시간 복제
4. **보관 기간**: 30일

### 복구 시나리오
1. **특정 시점 복구** (Point-in-Time Recovery)
2. **테이블 단위 복구**
3. **재해 복구** (Disaster Recovery)

## 마이그레이션

### 버전 관리 전략
- 마이그레이션 파일 위치: `migrations/`
- SQL 기반 마이그레이션 관리
- 롤백 스크립트 필수 작성

### 마이그레이션 이력
주요 마이그레이션:
1. `create_resources_tables.sql` - 자료실 테이블 생성
2. `create_financial_consulting_cases_table.sql` - 컨설팅 사례 테이블 생성
3. main_banners, quick_links 테이블 추가 (2025년)

## 데이터베이스 모니터링

### 성능 메트릭
1. **쿼리 성능**
   - Slow Query Log 모니터링
   - 1초 이상 쿼리 자동 기록

2. **인덱스 사용률**
   - 사용되지 않는 인덱스 식별
   - 필요한 인덱스 누락 체크

3. **테이블 크기**
   - 테이블별 용량 추적
   - 파티셔닝 필요성 판단

### 자동화
1. **정기 점검**: 매주 일요일 01:00
2. **인덱스 최적화**: 매월 첫째 주 일요일
3. **통계 업데이트**: 매일 04:00

---

**문서 버전**: 2.0
**최종 업데이트**: 2025년 1월 29일
**작성자**: TOV 개발팀
**검토자**: 시스템 관리자

**변경 이력**:
- 2025-01-29: 전체 데이터베이스 스키마 문서 재작성 (33+ 테이블 반영)
- 2024-10-14: 초기 문서 작성 (15개 테이블)
