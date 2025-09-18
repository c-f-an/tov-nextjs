import { MainBanner } from '@/presentation/components/home/MainBanner';
import { QuickLinks } from '@/presentation/components/home/QuickLinks';
import { LatestNews } from '@/presentation/components/home/LatestNews';
import { TovActivities } from '@/presentation/components/home/TovActivities';
import { ConsultationBanner } from '@/presentation/components/home/ConsultationBanner';
import { FinancialReport } from '@/presentation/components/home/FinancialReport';
import { getContainer } from '@/infrastructure/config/getContainer';

export default async function Home() {
  let banners: any[] = [];
  let categories: any[] = [];
  let notices: any[] = [];
  let news: any[] = [];
  let quickLinks: any[] = [];
  let consultationStats = null;
  let financialReport = null;

  // Skip database queries during build
  if (process.env.SKIP_DB_QUERIES !== 'true') {
    // Fetch main banners from database
    const container = getContainer();
    const getMainBannersUseCase = container.getGetMainBannersUseCase();
    const bannersResult = await getMainBannersUseCase.execute({ activeOnly: true });
    banners = bannersResult.ok ? bannersResult.value.map(banner => ({
      ...banner,
      createdAt: banner.createdAt?.toISOString() || null,
      updatedAt: banner.updatedAt?.toISOString() || null,
      startDate: banner.startDate?.toISOString() || null,
      endDate: banner.endDate?.toISOString() || null
    })) : [];

    // Fetch categories
    const getCategoriesUseCase = container.getGetCategoriesUseCase();
    const categoriesResult = await getCategoriesUseCase.execute();
    categories = Array.isArray(categoriesResult) ? categoriesResult : [];

    // Find notice and news category IDs
    const noticeCategory = categories.find(cat => cat.slug === 'notice');
    const newsCategory = categories.find(cat => cat.slug === 'news');

    // Fetch latest posts
    const getPostsUseCase = container.getGetPostsUseCase();
    
    // Fetch latest notices
    const noticesResult = noticeCategory ? await getPostsUseCase.execute({
      categoryId: noticeCategory.id,
      limit: 4,
      page: 1
    }) : null;
    notices = noticesResult?.posts ? noticesResult.posts.map((post: any) => ({
      ...post,
      createdAt: post.createdAt?.toISOString() || null,
      updatedAt: post.updatedAt?.toISOString() || null,
      publishedAt: post.publishedAt?.toISOString() || null
    })) : [];

    // Fetch latest news
    const newsResult = newsCategory ? await getPostsUseCase.execute({
      categoryId: newsCategory.id,
      limit: 4,
      page: 1
    }) : null;
    news = newsResult?.posts ? newsResult.posts.map((post: any) => ({
      ...post,
      createdAt: post.createdAt?.toISOString() || null,
      updatedAt: post.updatedAt?.toISOString() || null,
      publishedAt: post.publishedAt?.toISOString() || null
    })) : [];

    // Fetch quick links
    const getQuickLinksUseCase = container.getGetQuickLinksUseCase();
    const quickLinksResult = await getQuickLinksUseCase.execute({ activeOnly: true });
    quickLinks = quickLinksResult.ok ? quickLinksResult.value.map(link => ({
      ...link,
      createdAt: link.createdAt?.toISOString() || null,
      updatedAt: link.updatedAt?.toISOString() || null
    })) : [];

    // Fetch consultation stats
    const getConsultationStatsUseCase = container.getGetConsultationStatsUseCase();
    const statsResult = await getConsultationStatsUseCase.execute();
    consultationStats = statsResult.ok ? statsResult.value : null;

    // Fetch latest financial report
    const getLatestFinancialReportUseCase = container.getGetLatestFinancialReportUseCase();
    const reportResult = await getLatestFinancialReportUseCase.execute();
    financialReport = reportResult.ok ? reportResult.value : null;
  }

  return (
    <>
      {/* Main Banner */}
      <MainBanner banners={banners} />
      
      {/* Quick Links */}
      <QuickLinks links={quickLinks} />
      
      {/* Latest News & Notice */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <LatestNews notices={notices} news={news} />
        </div>
      </section>

      {/* Tov Activities */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <TovActivities />
        </div>
      </section>
      
      {/* Consultation Banner */}
      <ConsultationBanner stats={consultationStats} />
      
      {/* Financial Report */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <FinancialReport report={financialReport} />
        </div>
      </section>
    </>
  );
}
