-- Production 데이터베이스 초기 데이터 삽입 스크립트
-- 주의: 이미 데이터가 있는 경우 중복 에러가 발생할 수 있습니다

-- 1. 카테고리 데이터 삽입
INSERT IGNORE INTO categories (id, name, slug, type, sort_order, is_active, created_at, updated_at) VALUES
(1, '공지사항', 'notice', 'notice', 1, true, NOW(), NOW()),
(2, '토브소식', 'news', 'news', 2, true, NOW(), NOW()),
(3, '언론보도', 'media', 'media', 3, true, NOW(), NOW()),
(4, '발간자료', 'publication', 'publication', 4, true, NOW(), NOW()),
(5, '자료실', 'resource', 'resource', 5, true, NOW(), NOW()),
(6, '활동소식', 'activity', 'activity', 6, true, NOW(), NOW());

-- 2. 관리자 계정 생성 (비밀번호는 추후 변경 필요)
INSERT IGNORE INTO users (id, email, password, name, status, created_at, updated_at) VALUES
(1, 'admin@tov.or.kr', '$2b$10$YourHashedPasswordHere', '관리자', 'active', NOW(), NOW());

-- 3. 샘플 게시글 삽입
INSERT IGNORE INTO posts (category_id, user_id, title, slug, content, excerpt, status, is_notice, view_count, published_at, created_at, updated_at) VALUES
-- 공지사항
(1, 1, '2024년 종교인 소득세 신고 안내', '2024-tax-guide', 
'<p>2024년 종교인 소득세 신고 기간이 다가옵니다.</p>
<p>신고 기간: 2024년 5월 1일 ~ 5월 31일</p>
<p>본 안내를 참고하여 기한 내에 신고를 완료해주시기 바랍니다.</p>', 
'2024년 종교인 소득세 신고 안내입니다.', 'published', 1, 152, NOW(), NOW(), NOW()),

(1, 1, '비영리법인 결산서류 공시 의무화 안내', 'nonprofit-disclosure', 
'<p>2024년부터 비영리법인의 결산서류 공시가 의무화됩니다.</p>
<p>대상: 자산총액 5억원 이상 또는 수입총액 3억원 이상 비영리법인</p>
<p>자세한 내용은 첨부파일을 확인하세요.</p>', 
'비영리법인 결산서류 공시 의무화 안내', 'published', 1, 203, NOW(), NOW(), NOW()),

(1, 1, '1분기 실무자 교육 프로그램 신청 안내', 'q1-education', 
'<p>2024년 1분기 비영리 회계 실무자 교육 프로그램 신청을 받습니다.</p>
<p>교육일정: 2024년 3월 15일 ~ 3월 16일 (2일간)</p>
<p>장소: 서울 강남구 토브협회 교육장</p>
<p>신청마감: 2024년 3월 10일</p>', 
'1분기 교육 프로그램 안내', 'published', 0, 87, NOW(), NOW(), NOW()),

(1, 1, '토브협회 정기총회 개최 안내', 'annual-meeting-2024', 
'<p>2024년 토브협회 정기총회를 다음과 같이 개최합니다.</p>
<p>일시: 2024년 2월 28일 오후 2시</p>
<p>장소: 토브협회 대회의실</p>
<p>안건: 2023년 사업보고 및 2024년 사업계획</p>', 
'정기총회 개최 안내', 'published', 0, 45, NOW(), NOW(), NOW()),

-- 토브소식
(2, 1, '비영리단체 투명성 강화 세미나 성황리 개최', 'transparency-seminar', 
'<p>지난 1월 12일 비영리단체 재정 투명성 강화를 위한 세미나가 성황리에 개최되었습니다.</p>
<p>200여명의 비영리단체 실무자들이 참석하여 열띤 호응을 보였습니다.</p>', 
'투명성 강화 세미나 개최', 'published', 0, 178, NOW(), NOW(), NOW()),

(2, 1, '2023년 재정 투명성 우수 단체 선정', 'best-transparency-2023', 
'<p>2023년 재정 투명성 우수 단체로 10개 기관이 선정되었습니다.</p>
<p>선정된 단체에는 인증패와 함께 1년간 무료 컨설팅이 제공됩니다.</p>', 
'재정 투명성 우수 단체 선정', 'published', 0, 234, NOW(), NOW(), NOW()),

(2, 1, '종교인 소득세 무료 상담 서비스 시작', 'free-tax-consultation', 
'<p>토브협회에서 종교인 소득세 관련 무료 상담 서비스를 시작합니다.</p>
<p>상담 신청: 홈페이지 또는 전화(02-1234-5678)</p>', 
'무료 상담 서비스 시작', 'published', 0, 156, NOW(), NOW(), NOW()),

-- 언론보도
(3, 1, 'KBS 뉴스 - 종교인 과세 특집 방송', 'kbs-news-religious-tax', 
'<p>KBS 9시 뉴스에서 종교인 과세 관련 특집 방송이 나갔습니다.</p>
<p>토브협회 이사장님의 인터뷰가 포함되어 있습니다.</p>', 
'KBS 특집 방송 안내', 'published', 0, 412, NOW(), NOW(), NOW()),

(3, 1, '중앙일보 - 비영리단체 투명성 강화 기사', 'joongang-nonprofit', 
'<p>중앙일보에서 비영리단체 재정 투명성 강화 필요성을 다룬 기사가 게재되었습니다.</p>
<p>토브협회의 활동이 모범 사례로 소개되었습니다.</p>', 
'중앙일보 기사', 'published', 0, 325, NOW(), NOW(), NOW()),

-- 발간자료
(4, 1, '2024년 종교인 소득세 신고 가이드북', 'guide-2024-religious-tax', 
'<p>2024년 종교인 소득세 신고를 위한 상세 가이드북을 발간했습니다.</p>
<p>PDF 파일로 다운로드 가능합니다.</p>', 
'가이드북 발간', 'published', 0, 567, NOW(), NOW(), NOW()),

(4, 1, '비영리법인 회계처리 실무 매뉴얼', 'nonprofit-accounting-guide', 
'<p>비영리법인 회계처리에 대한 실무 매뉴얼을 발간했습니다.</p>
<p>초보자도 쉽게 이해할 수 있도록 구성되었습니다.</p>', 
'회계처리 매뉴얼 발간', 'published', 0, 489, NOW(), NOW(), NOW()),

-- 자료실
(5, 1, '비영리 회계 실무 매뉴얼', 'nonprofit-accounting-manual', 
'<p>비영리단체 회계 담당자를 위한 실무 매뉴얼입니다.</p>
<p>계정과목 설명부터 결산까지 상세히 다룹니다.</p>', 
'회계 실무 매뉴얼', 'published', 0, 723, NOW(), NOW(), NOW()),

(5, 1, '종교인 소득세 관련 법령 모음', 'religious-tax-laws', 
'<p>종교인 소득세와 관련된 모든 법령을 정리했습니다.</p>
<p>소득세법, 시행령, 시행규칙 포함</p>', 
'관련 법령 모음', 'published', 0, 445, NOW(), NOW(), NOW()),

-- 활동소식
(6, 1, '2024년 신년 하례회 개최', 'new-year-2024', 
'<p>2024년 새해를 맞아 신년 하례회를 개최했습니다.</p>
<p>100여명의 회원들이 참석하여 새해 인사를 나누었습니다.</p>', 
'신년 하례회', 'published', 0, 234, NOW(), NOW(), NOW()),

(6, 1, '비영리 회계 실무자 워크숍 진행', 'accounting-workshop', 
'<p>비영리 회계 실무자를 위한 워크숍을 진행했습니다.</p>
<p>실제 사례를 중심으로 한 실습 위주의 교육이었습니다.</p>', 
'실무자 워크숍', 'published', 0, 198, NOW(), NOW(), NOW());

-- 4. 메인 배너 데이터 (옵션)
INSERT IGNORE INTO main_banners (title, subtitle, description, image_path, link_url, link_target, sort_order, is_active, start_date, end_date, created_at, updated_at) VALUES
('비영리 재정 투명성의 시작', '토브협회가 함께합니다', '종교인 소득세, 비영리 회계 전문 상담', '/images/banner1.jpg', '/about', '_self', 1, true, NULL, NULL, NOW(), NOW()),
('전문가와 함께하는 재정 상담', '맞춤형 솔루션 제공', '회계, 세무, 법률 전문가의 통합 상담', '/images/banner2.jpg', '/consultation/apply', '_self', 2, true, NULL, NULL, NOW(), NOW()),
('투명한 재정 운영 교육', '실무자를 위한 전문 교육', '비영리 회계 실무 교육 프로그램', '/images/banner3.jpg', '/resources', '_self', 3, true, NULL, NULL, NOW(), NOW());

-- 5. 퀵링크 데이터 (옵션)
INSERT IGNORE INTO quick_links (title, icon, link_url, description, sort_order, is_active, created_at, updated_at) VALUES
('종교인 소득세', 'document', '/resources/religious-income', '종교인 소득세 신고 안내', 1, true, NOW(), NOW()),
('비영리 회계', 'calculator', '/resources/nonprofit-finance', '비영리단체 회계 가이드', 2, true, NOW(), NOW()),
('결산 공시', 'chart', '/resources/settlement', '결산서류 공시 안내', 3, true, NOW(), NOW()),
('상담 신청', 'chat', '/consultation/apply', '전문가 상담 예약', 4, true, NOW(), NOW()),
('교육 프로그램', 'book', '/education', '실무자 교육 일정', 5, true, NOW(), NOW()),
('관계 법령', 'scale', '/resources/laws', '관련 법령 및 규정', 6, true, NOW(), NOW());

SELECT 'Data insertion completed!' as result;