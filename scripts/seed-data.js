const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

// 로컬 터널링 환경 사용시 .env.local 파일 우선 로드
dotenv.config({ path: '.env.local' });
dotenv.config();

const prisma = new PrismaClient();

async function seedDatabase() {
  console.log('🔍 Connecting to database through SSH tunnel...');

  try {
    await prisma.$connect();
    console.log('✅ Connected to database\n');

    // 1. Create test users
    console.log('Creating users...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const users = await prisma.$executeRaw`
      INSERT INTO users (username, email, password, name, phone, status, login_type, created_at, updated_at) 
      VALUES 
      ('admin', 'admin@tov.or.kr', ${hashedPassword}, '관리자', '010-1234-5678', 'active', 'email', NOW(), NOW()),
      ('user1', 'user1@example.com', ${hashedPassword}, '홍길동', '010-2222-3333', 'active', 'email', NOW(), NOW()),
      ('user2', 'user2@example.com', ${hashedPassword}, '김철수', '010-3333-4444', 'active', 'email', NOW(), NOW())
      ON DUPLICATE KEY UPDATE updated_at = NOW()
    `;
    console.log(`✅ Created ${users} users`);

    // Get user IDs
    const userList = await prisma.$queryRaw`SELECT id, username FROM users`;
    const adminId = userList.find(u => u.username === 'admin')?.id;
    const user1Id = userList.find(u => u.username === 'user1')?.id;

    // 2. Create categories
    console.log('Creating categories...');
    const categories = await prisma.$executeRaw`
      INSERT INTO categories (name, slug, description, type, sort_order, is_active, created_at, updated_at)
      VALUES 
      ('공지사항', 'notice', '토브 공지사항', 'notice', 1, 1, NOW(), NOW()),
      ('토브 뉴스', 'news', '토브 관련 뉴스', 'news', 2, 1, NOW(), NOW()),
      ('활동소식', 'activity', '토브 활동소식', 'activity', 3, 1, NOW(), NOW()),
      ('출판물', 'publication', '토브 출판물', 'publication', 4, 1, NOW(), NOW()),
      ('미디어', 'media', '토브 미디어 자료', 'media', 5, 1, NOW(), NOW())
      ON DUPLICATE KEY UPDATE updated_at = NOW()
    `;
    console.log(`✅ Created ${categories} categories`);

    // Get category IDs
    const categoryList = await prisma.$queryRaw`SELECT id, slug FROM categories`;
    const noticeId = categoryList.find(c => c.slug === 'notice')?.id;
    const newsId = categoryList.find(c => c.slug === 'news')?.id;
    const activityId = categoryList.find(c => c.slug === 'activity')?.id;

    // 3. Create posts
    console.log('Creating posts...');
    if (adminId && noticeId && newsId && activityId) {
      const posts = await prisma.$executeRaw`
        INSERT INTO posts (category_id, user_id, title, slug, content, excerpt, status, is_notice, view_count, published_at, created_at, updated_at)
        VALUES 
        (${noticeId}, ${adminId}, '2025년 토브 신년 인사', '2025-new-year-greeting', '<p>새해 복 많이 받으세요. 2025년에도 토브와 함께 해주세요.</p>', '2025년 새해 인사말', 'published', 1, 150, NOW(), NOW(), NOW()),
        (${noticeId}, ${adminId}, '토브 홈페이지 리뉴얼 안내', 'website-renewal', '<p>홈페이지가 새롭게 단장되었습니다.</p>', '홈페이지 리뉴얼 소식', 'published', 1, 230, NOW(), NOW(), NOW()),
        (${noticeId}, ${adminId}, '2024년 연말 감사예배 안내', '2024-year-end-service', '<p>올 한해 감사예배를 드립니다.</p>', '연말 감사예배 안내', 'published', 0, 89, NOW(), NOW(), NOW()),
        (${newsId}, ${adminId}, '청소년 리더십 캠프 개최', 'youth-leadership-camp', '<p>여름 청소년 리더십 캠프가 개최됩니다.</p>', '청소년 캠프 소식', 'published', 0, 156, NOW(), NOW(), NOW()),
        (${activityId}, ${adminId}, '토브 창립 10주년 기념행사', 'tov-10th-anniversary', '<p>토브 창립 10주년을 맞이하여 기념행사를 개최합니다.</p>', '창립 10주년 행사', 'published', 0, 342, NOW(), NOW(), NOW())
        ON DUPLICATE KEY UPDATE updated_at = NOW()
      `;
      console.log(`✅ Created ${posts} posts`);
    }

    // 4. Create main banners
    console.log('Creating main banners...');
    const banners = await prisma.$executeRaw`
      INSERT INTO main_banners (title, subtitle, description, image_path, link_url, link_target, sort_order, is_active, created_at, updated_at)
      VALUES 
      ('토브와 함께하는 2025년', '새로운 시작, 새로운 도전', '2025년 토브의 새로운 비전과 함께 하세요', '/images/banner/banner1.jpg', '/about', '_self', 1, 1, NOW(), NOW()),
      ('청소년 리더십 프로그램', '미래를 이끌어갈 리더 양성', '토브 청소년 리더십 프로그램에 참여하세요', '/images/banner/banner2.jpg', '/programs/youth', '_self', 2, 1, NOW(), NOW()),
      ('토브 후원 안내', '당신의 나눔이 희망이 됩니다', '토브와 함께 사랑을 실천해주세요', '/images/banner/banner3.jpg', '/support', '_self', 3, 1, NOW(), NOW())
      ON DUPLICATE KEY UPDATE updated_at = NOW()
    `;
    console.log(`✅ Created ${banners} main banners`);

    // 5. Create quick links
    console.log('Creating quick links...');
    const quickLinks = await prisma.$executeRaw`
      INSERT INTO quick_links (title, icon, link_url, description, sort_order, is_active, created_at, updated_at)
      VALUES 
      ('상담신청', 'consultation', '/consultation', '전문 상담사와 상담을 받아보세요', 1, 1, NOW(), NOW()),
      ('교육프로그램', 'education', '/programs', '다양한 교육 프로그램에 참여하세요', 2, 1, NOW(), NOW()),
      ('후원하기', 'support', '/support', '토브의 사역에 동참해주세요', 3, 1, NOW(), NOW()),
      ('자료실', 'resource', '/resources', '유용한 자료를 다운로드하세요', 4, 1, NOW(), NOW())
      ON DUPLICATE KEY UPDATE updated_at = NOW()
    `;
    console.log(`✅ Created ${quickLinks} quick links`);

    // 6. Create FAQs
    console.log('Creating FAQs...');
    const faqs = await prisma.$executeRaw`
      INSERT INTO faqs (category, question, answer, sort_order, is_active, created_at, updated_at)
      VALUES 
      ('general', '토브는 어떤 단체인가요?', '토브는 기독교 정신을 바탕으로 청소년과 가정을 돕는 비영리 단체입니다.', 1, 1, NOW(), NOW()),
      ('program', '프로그램 참가비는 얼마인가요?', '프로그램마다 참가비가 다릅니다. 각 프로그램 상세 페이지에서 확인해주세요.', 2, 1, NOW(), NOW()),
      ('support', '후원금은 어떻게 사용되나요?', '후원금은 100% 청소년 교육과 가정 상담 프로그램 운영에 사용됩니다.', 3, 1, NOW(), NOW()),
      ('consultation', '상담은 비밀이 보장되나요?', '네, 모든 상담 내용은 철저히 비밀이 보장됩니다.', 4, 1, NOW(), NOW())
      ON DUPLICATE KEY UPDATE updated_at = NOW()
    `;
    console.log(`✅ Created ${faqs} FAQs`);

    // 7. Create menus
    console.log('Creating menus...');
    const mainMenus = await prisma.$executeRaw`
      INSERT INTO menus (name, url, menu_type, target, sort_order, is_active, created_at, updated_at)
      VALUES 
      ('소개', '/about', 'main', '_self', 1, 1, NOW(), NOW()),
      ('사업안내', '/programs', 'main', '_self', 2, 1, NOW(), NOW()),
      ('상담신청', '/consultation', 'main', '_self', 3, 1, NOW(), NOW()),
      ('소식', '/news', 'main', '_self', 4, 1, NOW(), NOW()),
      ('후원', '/support', 'main', '_self', 5, 1, NOW(), NOW()),
      ('자료실', '/resources', 'main', '_self', 6, 1, NOW(), NOW())
      ON DUPLICATE KEY UPDATE updated_at = NOW()
    `;
    console.log(`✅ Created ${mainMenus} main menus`);

    // Get parent menu IDs for submenu
    const menuList = await prisma.$queryRaw`SELECT id, name FROM menus WHERE parent_id IS NULL`;
    const aboutId = menuList.find(m => m.name === '소개')?.id;
    const programId = menuList.find(m => m.name === '사업안내')?.id;

    // Create submenus
    if (aboutId && programId) {
      const subMenus = await prisma.$executeRaw`
        INSERT INTO menus (parent_id, name, url, menu_type, target, sort_order, is_active, created_at, updated_at)
        VALUES 
        (${aboutId}, '인사말', '/about/greeting', 'main', '_self', 1, 1, NOW(), NOW()),
        (${aboutId}, '비전과 미션', '/about/vision', 'main', '_self', 2, 1, NOW(), NOW()),
        (${aboutId}, '조직도', '/about/organization', 'main', '_self', 3, 1, NOW(), NOW()),
        (${programId}, '청소년 프로그램', '/programs/youth', 'main', '_self', 1, 1, NOW(), NOW()),
        (${programId}, '가정 프로그램', '/programs/family', 'main', '_self', 2, 1, NOW(), NOW()),
        (${programId}, '교육 프로그램', '/programs/education', 'main', '_self', 3, 1, NOW(), NOW())
        ON DUPLICATE KEY UPDATE updated_at = NOW()
      `;
      console.log(`✅ Created ${subMenus} submenus`);
    }

    // 8. Create newsletter subscribers
    console.log('Creating newsletter subscribers...');
    const subscribers = await prisma.$executeRaw`
      INSERT INTO newsletter_subscribers (email, name, is_active, subscribed_at, created_at, updated_at)
      VALUES 
      ('subscriber1@example.com', '구독자1', 1, NOW(), NOW(), NOW()),
      ('subscriber2@example.com', '구독자2', 1, NOW(), NOW(), NOW()),
      ('subscriber3@example.com', '구독자3', 1, NOW(), NOW(), NOW())
      ON DUPLICATE KEY UPDATE updated_at = NOW()
    `;
    console.log(`✅ Created ${subscribers} newsletter subscribers`);

    // 9. Create site settings
    console.log('Creating site settings...');
    const settings = await prisma.$executeRaw`
      INSERT INTO site_settings (setting_group, setting_key, setting_value, setting_type, created_at, updated_at)
      VALUES 
      ('general', 'site_name', '토브', 'text', NOW(), NOW()),
      ('general', 'site_description', '토브 - 청소년과 가정을 위한 비영리 단체', 'text', NOW(), NOW()),
      ('contact', 'email', 'info@tov.or.kr', 'text', NOW(), NOW()),
      ('contact', 'phone', '02-1234-5678', 'text', NOW(), NOW()),
      ('contact', 'address', '서울특별시 강남구 테헤란로 123', 'text', NOW(), NOW()),
      ('social', 'facebook', 'https://facebook.com/tov', 'text', NOW(), NOW()),
      ('social', 'instagram', 'https://instagram.com/tov', 'text', NOW(), NOW())
      ON DUPLICATE KEY UPDATE updated_at = NOW()
    `;
    console.log(`✅ Created ${settings} site settings`);

    // 10. Create sample consultations
    console.log('Creating consultations...');
    if (user1Id) {
      const consultations = await prisma.$executeRaw`
        INSERT INTO consultations (user_id, name, phone, email, church_name, position, consultation_type, title, content, status, privacy_agree, created_at, updated_at)
        VALUES 
        (${user1Id}, '홍길동', '010-2222-3333', 'user1@example.com', '은혜교회', '청년', 'youth', '진로 상담 요청', '대학 진학에 대해 상담받고 싶습니다.', 'pending', 1, NOW(), NOW()),
        (NULL, '박영희', '010-5555-6666', 'park@example.com', '사랑교회', '학부모', 'family', '자녀 교육 상담', '중학생 자녀와의 소통 문제로 상담 신청합니다.', 'pending', 1, NOW(), NOW())
        ON DUPLICATE KEY UPDATE updated_at = NOW()
      `;
      console.log(`✅ Created ${consultations} consultations`);
    }

    console.log('\n🎉 Seed data created successfully!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
    console.log('👋 Database connection closed');
  }
}

// Run the seed function
seedDatabase().catch(console.error);