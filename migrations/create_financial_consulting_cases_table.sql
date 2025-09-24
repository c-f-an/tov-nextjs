-- 재정관리 컨설팅 사례 테이블 생성
CREATE TABLE IF NOT EXISTS financial_consulting_cases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL COMMENT '사례 제목',
    organization_name VARCHAR(255) NOT NULL COMMENT '기관/단체명',
    organization_type VARCHAR(100) NOT NULL COMMENT '기관 유형 (church, nonprofit, foundation, etc)',
    consulting_type VARCHAR(100) NOT NULL COMMENT '컨설팅 유형 (system_setup, diagnosis, training, etc)',
    consulting_period VARCHAR(100) NULL COMMENT '컨설팅 기간',
    thumbnail_image VARCHAR(500) NULL COMMENT '썸네일 이미지 URL',

    -- 컨설팅 내용
    challenge TEXT NULL COMMENT '도전과제/문제점',
    solution TEXT NULL COMMENT '해결방안',
    result TEXT NULL COMMENT '컨설팅 결과',
    client_feedback TEXT NULL COMMENT '고객 후기',

    -- 메타 정보
    tags VARCHAR(500) NULL COMMENT '태그 (쉼표로 구분)',
    is_featured BOOLEAN DEFAULT FALSE COMMENT '대표 사례 여부',
    is_active BOOLEAN DEFAULT TRUE COMMENT '게시 여부',
    display_order INT DEFAULT 0 COMMENT '표시 순서',
    view_count INT DEFAULT 0 COMMENT '조회수',

    -- 시간 정보
    consulting_date DATE NULL COMMENT '컨설팅 실시 날짜',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_organization_type (organization_type),
    INDEX idx_consulting_type (consulting_type),
    INDEX idx_is_active (is_active),
    INDEX idx_is_featured (is_featured),
    INDEX idx_display_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='재정관리 컨설팅 사례';

-- 샘플 데이터 입력
INSERT INTO financial_consulting_cases
(title, organization_name, organization_type, consulting_type, consulting_period, challenge, solution, result, client_feedback, tags, is_featured, consulting_date)
VALUES
(
    '중대형 교회 재정관리 시스템 구축',
    '○○교회',
    'church',
    'system_setup',
    '3개월',
    '재정 관리 시스템이 체계화되지 않아 투명성과 효율성이 떨어지는 문제가 있었습니다. 예산 편성과 집행이 일관성 없이 진행되고 있었습니다.',
    '통합 재정관리 시스템을 구축하고, 예산 편성부터 집행, 결산까지의 프로세스를 표준화했습니다. 담당자별 권한과 책임을 명확히 하고 내부 통제 시스템을 강화했습니다.',
    '재정 투명성이 크게 향상되었고, 예산 집행률이 95%로 개선되었습니다. 재정 보고서 작성 시간이 50% 단축되었습니다.',
    '토브의 전문적인 컨설팅으로 우리 교회 재정관리가 한 단계 도약했습니다. 이제 성도들에게 자신있게 재정 현황을 보고할 수 있게 되었습니다.',
    '교회,재정시스템,투명성,예산관리',
    TRUE,
    '2024-03-15'
),
(
    '비영리단체 회계 투명성 강화 프로젝트',
    '○○재단',
    'foundation',
    'diagnosis',
    '2개월',
    '복잡한 사업 구조로 인해 회계 처리가 어렵고, 외부 감사에서 지적사항이 반복되는 문제가 있었습니다.',
    '회계 업무 프로세스를 재정립하고, 부서별 회계 처리 기준을 표준화했습니다. 정기적인 내부 감사 체계를 구축했습니다.',
    '외부 감사 지적사항이 80% 감소했으며, 기부자들의 신뢰도가 향상되어 후원금이 30% 증가했습니다.',
    '체계적인 진단과 맞춤형 솔루션 제공으로 우리 재단의 회계 투명성이 크게 개선되었습니다.',
    '비영리,회계투명성,감사,재단',
    TRUE,
    '2024-02-20'
),
(
    '소규모 교회 재정관리 교육 및 시스템 도입',
    '○○교회',
    'church',
    'training',
    '1개월',
    '재정 담당자의 전문성 부족과 시스템 부재로 기본적인 재정 관리도 어려운 상황이었습니다.',
    '재정 담당자를 위한 맞춤형 교육 프로그램을 제공하고, 소규모 교회에 적합한 간편한 재정관리 시스템을 도입했습니다.',
    '재정 담당자의 업무 역량이 향상되었고, 월별 재정 보고가 정기화되었습니다. 재정 관리에 대한 부담이 크게 줄었습니다.',
    '작은 교회 상황에 맞는 실용적인 컨설팅이었습니다. 이제 재정 관리가 훨씬 수월해졌습니다.',
    '소규모교회,재정교육,시스템도입',
    FALSE,
    '2024-04-10'
),
(
    '사회복지법인 예산 편성 체계 개선',
    '○○복지재단',
    'nonprofit',
    'system_setup',
    '2개월',
    '다양한 사업부서의 예산 요구를 조정하기 어렵고, 예산 편성 과정에서 비효율이 발생하고 있었습니다.',
    '사업별 우선순위 설정 기준을 마련하고, 성과 기반 예산 편성 시스템을 도입했습니다. 예산 편성 위원회 운영 체계를 개선했습니다.',
    '예산 편성 기간이 30% 단축되었고, 사업부서의 만족도가 향상되었습니다. 예산 집행의 효율성이 20% 개선되었습니다.',
    '체계적인 예산 편성 프로세스 덕분에 한정된 자원을 더 효과적으로 활용할 수 있게 되었습니다.',
    '사회복지,예산편성,성과관리',
    FALSE,
    '2024-01-25'
);