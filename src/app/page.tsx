import { MainBanner } from '@/presentation/components/home/MainBanner';
import { QuickLinks } from '@/presentation/components/home/QuickLinks';
import { LatestNews } from '@/presentation/components/home/LatestNews';
import { ConsultationBanner } from '@/presentation/components/home/ConsultationBanner';
import { FinancialReport } from '@/presentation/components/home/FinancialReport';
import { container } from '@/infrastructure/config/container.tsyringe';
import { GetMainBannersUseCase } from '@/core/application/use-cases/main-banner/GetMainBannersUseCase';
import { GetPostsUseCase } from '@/core/application/use-cases/post/GetPostsUseCase';
import { GetCategoriesUseCase } from '@/core/application/use-cases/category/GetCategoriesUseCase';
import { GetQuickLinksUseCase } from '@/core/application/use-cases/quick-link/GetQuickLinksUseCase';
import { GetConsultationStatsUseCase } from '@/core/application/use-cases/consultation/GetConsultationStatsUseCase';
import { GetLatestFinancialReportUseCase } from '@/core/application/use-cases/financial-report/GetLatestFinancialReportUseCase';

export default async function Home() {
  let banners = [];
  let categories = [];
  let notices = [];
  let news = [];
  let quickLinks = [];
  let consultationStats = null;
  let financialReport = null;

  // Skip database queries during build
  if (process.env.SKIP_DB_QUERIES !== 'true') {
    // Fetch main banners from database
    const getMainBannersUseCase = container.resolve(GetMainBannersUseCase);
    const bannersResult = await getMainBannersUseCase.execute({ activeOnly: true });
    banners = bannersResult.ok ? bannersResult.value : [];

    // Fetch categories
    const getCategoriesUseCase = container.resolve(GetCategoriesUseCase);
    const categoriesResult = await getCategoriesUseCase.execute();
    categories = categoriesResult.isSuccess ? categoriesResult.value : [];

    // Find notice and news category IDs
    const noticeCategory = categories.find(cat => cat.slug === 'notice');
    const newsCategory = categories.find(cat => cat.slug === 'news');

    // Fetch latest posts
    const getPostsUseCase = container.resolve(GetPostsUseCase);
    
    // Fetch latest notices
    const noticesResult = noticeCategory ? await getPostsUseCase.execute({
      categoryId: noticeCategory.id,
      status: 'published',
      limit: 4,
      page: 1
    }) : null;
    notices = noticesResult?.isSuccess ? noticesResult.value.posts : [];

    // Fetch latest news
    const newsResult = newsCategory ? await getPostsUseCase.execute({
      categoryId: newsCategory.id,
      status: 'published',
      limit: 4,
      page: 1
    }) : null;
    news = newsResult?.isSuccess ? newsResult.value.posts : [];

    // Fetch quick links
    const getQuickLinksUseCase = container.resolve(GetQuickLinksUseCase);
    const quickLinksResult = await getQuickLinksUseCase.execute({ activeOnly: true });
    quickLinks = quickLinksResult.ok ? quickLinksResult.value : [];

    // Fetch consultation stats
    const getConsultationStatsUseCase = container.resolve(GetConsultationStatsUseCase);
    const statsResult = await getConsultationStatsUseCase.execute();
    consultationStats = statsResult.ok ? statsResult.value : null;

    // Fetch latest financial report
    const getLatestFinancialReportUseCase = container.resolve(GetLatestFinancialReportUseCase);
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
